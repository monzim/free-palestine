import { UploadImage } from "@/lib/types";
import { nanoid } from "nanoid";
import { getPlaiceholder } from "plaiceholder";

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

import { NextRequest, NextResponse } from "next/server";
import { getIPHash, redis } from "@/lib/redis";
import { getIP } from "@/lib/api";

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
  const CONTAINER = process.env.AZURE_STORAGE_CONTAINER_NAME || "gallery-1";

  if (AZURE_STORAGE_ACCOUNT_KEY === "" || AZURE_STORAGE_ACCOUNT_NAME === "") {
    return NextResponse.json(
      { error: "AZURE_STORAGE_ACCOUNT_KEY not set" },
      { status: 500 }
    );
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_STORAGE_ACCOUNT_KEY
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential
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
    // Get the current user count
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

    const groupId = length > 1 ? nanoid() : "";
    const uploadPromises = files.map(async (file, index) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const prop: UploadImage = JSON.parse(props[index]);

      if (buffer.length > 2097152) {
        return;
      }

      const ext = file.name.split(".").pop();
      const { base64, metadata } = await getPlaiceholder(buffer);
      const fileName = `${nanoid()}.${metadata.format ?? ext}`;

      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      const options = {
        metadata: {
          description:
            prop?.description === undefined || prop?.description === ""
              ? description ?? ""
              : prop.description ?? "",
          sensitive: prop?.sensitive ? "true" : "false",
          groupId: groupId,

          width: String(metadata.width),
          height: String(metadata.height),
          size: String(metadata.size),
          space: String(metadata.space),
          density: String(metadata.density),
          chromaSubsampling: String(metadata.chromaSubsampling),
          channels: String(metadata.channels),
          hasAlpha: String(metadata.hasAlpha),
          isisProgressive: String(metadata.isProgressive),
          ip: ipAddr ?? "",
          blurhash: base64,
        },

        blobHTTPHeaders: {
          blobContentType: "image/jpeg",
        },
      };

      await blockBlobClient.upload(buffer, buffer.length, options);
    });

    await Promise.all(uploadPromises);
    const quotaLeft = await redis.incrby(userHash, length);
    const globalCount = await redis.incrby(GLOBAL_COUNT_KEY, length);

    return NextResponse.json({
      total: files.length,
      message: "success",
      quotaLeft: Math.max(0, UPLOADLIMIT - quotaLeft),
      globalUploadCount: globalCount,
    });
  } catch (error) {
    console.log("🚀 ~ file: route.ts:158 ~ POST ~ error:", error);

    return NextResponse.json({ error: "failed to upload" }, { status: 500 });
  }
}
