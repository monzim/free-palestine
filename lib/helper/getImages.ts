import { BlobServiceClient } from "@azure/storage-blob";
import { BlobInfo } from "../types";
import { cache } from "react";

// export const getImages = cache(async (): Promise<BlobInfo[]> => {
//   try {
//     const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
//     if (connectionString === "") {
//       throw new Error("AZURE_STORAGE_CONNECTION_STRING not set");
//     }

//     const containerName =
//       process.env.AZURE_STORAGE_CONTAINER_NAME || "gallery-1";

//     const blobServiceClient =
//       BlobServiceClient.fromConnectionString(connectionString);

//     const containerClient = blobServiceClient.getContainerClient(containerName);

//     let blobs: BlobInfo[] = [];

//     var n = 0;

//     for await (const blob of containerClient.listBlobsFlat({
//       includeMetadata: true,
//       includeDeleted: false,
//     })) {
//       const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
//       // read blob metadata
//       const meta = blob.metadata;
//       const sensitive = meta?.sensitive === "true" ? true : false;
//       const description = meta?.description || "";
//       const author = meta?.author || "";
//       const groupId = meta?.groupId || "";
//       const createdAt = blob.properties.createdOn || new Date();
//     }

//     return blobs;
//   } catch (error) {
//     console.log("🚀 ~ file: getImages.ts:64 ~ GetImages ~ error:", error);
//     return [];
//   }
// });

import {
  AzureNamedKeyCredential,
  TableClient,
  odata,
} from "@azure/data-tables";
import { CURRENTUTCPERTITIONKEY, formatUtcDateToPartitionKey } from "../radom";

const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY || "";
const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME || "";
const AZURE_STORAGE_TABLE_NAME = process.env.AZURE_STORAGE_TABLE_NAME || "";

const credential = new AzureNamedKeyCredential(
  AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_KEY
);
const tableClient = new TableClient(
  `https://${AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`,
  AZURE_STORAGE_TABLE_NAME,
  credential
);

export async function queryLatestImages(limit: number = 100) {
  try {
    let currentDate = new Date();
    let blobs: BlobInfo[] = [];

    let sevenDaysAgo = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    let listResults = tableClient.listEntities({
      queryOptions: {
        filter: odata`PartitionKey ge '${formatUtcDateToPartitionKey(
          sevenDaysAgo
        )}' and PartitionKey le '${CURRENTUTCPERTITIONKEY}'`,
      },
    });

    let iterator = listResults.byPage({
      maxPageSize: limit,
    });

    for await (const page of iterator) {
      page.forEach((entity) => {
        const newImageProps: BlobInfo = {
          id: entity.rowKey as string,
          height: entity.height as number,
          width: entity.width as number,
          publicUrl: entity.url as string,

          sensitive: entity.sensitive as boolean,
          description: entity.description as string,
          groupId: entity.groupId as string,

          size: entity.size as number,
          space: entity.space as string,
          density: entity.density as number,
          chromaSubsampling: entity.chromaSubsampling as string,
          channels: entity.channels as number,
          hasAlpha: entity.hasAlpha as boolean,
          isisProgressive: entity.isProgressive as boolean,
          blurhash: entity.blurhash as string,

          rowKey: entity.rowKey as string,
          partitionKey: entity.partitionKey as string,
        };

        blobs.push(newImageProps);
      });
      // We break to only get the first page
      // this only sends a single request to the service
      break;
    }

    return blobs;
  } catch (error) {
    console.log(
      "🚀 ~ file: getImage.ts:55 ~ queryLatestImages ~ error:",
      error
    );
    return [];
  }
}

export async function queryLatestImagesByGroupId(
  groupId: string,
  limit: number = 100
) {}

export async function getImageWithPartitionKeyAndRowKey(
  partitionKey?: string,
  rowKey?: string
) {
  if (!partitionKey || !rowKey) {
    return null;
  }

  try {
    let entity = await tableClient.getEntity(partitionKey, rowKey);
    const newImageProps: BlobInfo = {
      id: entity.rowKey as string,
      height: entity.height as number,
      width: entity.width as number,
      publicUrl: entity.url as string,

      sensitive: entity.sensitive as boolean,
      description: entity.description as string,
      groupId: entity.groupId as string,

      size: entity.size as number,
      space: entity.space as string,
      density: entity.density as number,
      chromaSubsampling: entity.chromaSubsampling as string,
      channels: entity.channels as number,
      hasAlpha: entity.hasAlpha as boolean,
      isisProgressive: entity.isProgressive as boolean,
      blurhash: entity.blurhash as string,

      rowKey: entity.rowKey as string,
      partitionKey: entity.partitionKey as string,
    };

    return newImageProps;
  } catch (error) {
    console.log(
      "🚀 ~ file: getImage.ts:55 ~ queryLatestImages ~ error:",
      error
    );
    return null;
  }
}
