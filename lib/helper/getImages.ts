import { BlobInfo } from "../types";

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
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
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

    if (blobs.length === 0) {
      let listResults = tableClient.listEntities({
        queryOptions: {
          filter: odata`PartitionKey le '${CURRENTUTCPERTITIONKEY}'`,
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
