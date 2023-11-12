import { UploadImage } from "@/lib/types";
import { getPlaiceholder } from "plaiceholder";

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

import { NextRequest, NextResponse } from "next/server";
import { getIPHash, redis } from "@/lib/redis";
import { getIP } from "@/lib/api";
import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import {
  CURRENTUTCPERTITIONKEY,
  generateGroupId,
  generateRowKeyWithGroup,
} from "@/lib/radom";

const GLOBAL_COUNT_KEY = "global_upload_count";
const UPLOADLIMIT = 10 * 24;
const TTL = 60 * 60 * 24; // 24 hours

export async function GET(req: NextRequest) {
  const userHash = await getIPHash(req.ip);

  try {
    const currentUserQuota = await redis.get(userHash);
    const quota = currentUserQuota
      ? parseInt(currentUserQuota ?? `${UPLOADLIMIT}`, 10)
      : UPLOADLIMIT;

    return NextResponse.json({
      message: "success",
      ttl: TTL,
      quotaLeft: Math.max(0, UPLOADLIMIT - quota),
    });
  } catch (error) {
    return NextResponse.json({ error: "failed to get quota" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ipAddr = getIP(req) ?? req.ip;
  const userHash = await getIPHash(ipAddr);

  const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY || "";
  const AZURE_STORAGE_ACCOUNT_NAME =
    process.env.AZURE_STORAGE_ACCOUNT_NAME || "";

  const AZURE_STORAGE_TABLE_NAME = process.env.AZURE_STORAGE_TABLE_NAME || "";
  const CONTAINER = process.env.AZURE_STORAGE_CONTAINER_NAME || "gallery-1";

  if (AZURE_STORAGE_ACCOUNT_KEY === "" || AZURE_STORAGE_ACCOUNT_NAME === "") {
    throw new Error("AZURE_STORAGE_ACCOUNT_KEY not set");
  }

  if (AZURE_STORAGE_TABLE_NAME === "") {
    throw new Error("AZURE_STORAGE_TABLE_NAME not set");
  }

  if (AZURE_STORAGE_ACCOUNT_KEY === "" || AZURE_STORAGE_ACCOUNT_NAME === "") {
    return NextResponse.json({ error: "server config error" }, { status: 500 });
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_KEY
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential
  );

  const credential = new AzureNamedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_KEY
  );

  const tableClient = new TableClient(
    `https://${AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`,
    AZURE_STORAGE_TABLE_NAME,
    credential
  );

  const containerClient = blobServiceClient.getContainerClient(CONTAINER);

  const data = await req.formData();
  const files: File[] = data.getAll("images") as unknown as File[];
  const props = data.getAll("props") as unknown as [];
  const descriptionJson = data.get("description") as unknown as any;
  const desJson = JSON.parse(descriptionJson);
  const description = desJson?.description ?? "";

  const length = files.length;

  if (length < 1) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // start check quota
    const currentUserQuota = await redis.get(userHash);
    if (currentUserQuota === null) {
      await redis.set(userHash, 0, "EX", TTL);
    }
    const quota = currentUserQuota
      ? parseInt(currentUserQuota ?? `${UPLOADLIMIT}`, 10)
      : 0;

    if (quota > UPLOADLIMIT) {
      return NextResponse.json(
        {
          error: `Sorry, you've reached your upload limit for today. The quota is ${UPLOADLIMIT}/day. Try again later!`,
        },
        { status: 202 }
      );
    }

    if (quota + length > UPLOADLIMIT) {
      return NextResponse.json(
        {
          error: `Sorry, you have only ${
            UPLOADLIMIT - quota
          } uploads left today, but you tried to upload ${length} images.`,
        },
        { status: 202 }
      );
    }
    // end check quota

    const groupId = length > 1 ? generateGroupId() : null;

    const uploadPromises = files.map(async (file, index) => {
      const fileName = generateRowKeyWithGroup(groupId);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const prop: UploadImage = JSON.parse(props[index]);

      if (buffer.length > 2097152) {
        return;
      }

      const { base64, metadata } = await getPlaiceholder(buffer);

      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      const options = {
        metadata: {
          description:
            prop?.description === undefined || prop?.description === ""
              ? description ?? ""
              : prop.description ?? "",
          sensitive: prop?.sensitive ? "true" : "false",
          groupId: groupId ?? "",

          width: String(metadata.width),
          height: String(metadata.height),
          size: String(metadata.size),
          space: String(metadata.space),
          density: String(metadata.density),
          chromaSubsampling: String(metadata.chromaSubsampling),
          channels: String(metadata.channels),
          hasAlpha: String(metadata.hasAlpha),
          isisProgressive: String(metadata.isProgressive),
          timestamp: String(Date.now()),
          ip: ipAddr ?? "",
          blurhash: base64,
        },

        blobHTTPHeaders: {
          blobContentType: "image/jpeg",
        },
      };

      await blockBlobClient.upload(buffer, buffer.length, options);

      await tableClient.createEntity({
        partitionKey: CURRENTUTCPERTITIONKEY,
        rowKey: fileName,
        ip: options.metadata.ip,
        url: blockBlobClient.url,
        sensitive: prop?.sensitive ? true : false,
        groupId: options.metadata.groupId,
        blurhash: options.metadata.blurhash,
        description: options.metadata.description,
        width: Number(options.metadata.width),
        height: Number(options.metadata.height),
        size: Number(options.metadata.size),
        density: Number(options.metadata.density),
        channels: Number(options.metadata.channels),
        hasAlpha: Boolean(options.metadata.hasAlpha),
        space: options.metadata.space,
        isisProgressive: Boolean(options.metadata.isisProgressive),
        chromaSubsampling: options.metadata.chromaSubsampling,
      });
    });

    await Promise.all(uploadPromises);
    const quotaLeft = await redis.incrby(userHash, length);
    const globalCount = await redis.incrby(GLOBAL_COUNT_KEY, length);

    return NextResponse.json({
      message: "success",
      total: files.length,
      quotaLeft: Math.max(0, UPLOADLIMIT - quotaLeft),
      globalUploadCount: globalCount,
    });
  } catch (error) {
    console.log("🚀 ~ file: route.ts:205 ~ POST ~ error:", error);
    return NextResponse.json({ error: "failed to upload" }, { status: 500 });
  }
}
