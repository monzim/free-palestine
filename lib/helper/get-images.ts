import { BlobInfo } from "../types";

import {
  AzureNamedKeyCredential,
  TableClient,
  TableEntityResult,
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

export async function queryLatestImageV2(limit: number = 100) {
  try {
    let currentDate = new Date();
    let blobs: BlobInfo[] = [];
    let numberOfDays = 1;

    let previousDay =
      currentDate.getTime() - numberOfDays * 24 * 60 * 60 * 1000;

    //   Timestamp ge datetime'2023-12-22T16:15:37.000Z' and Timestamp le datetime'2023-12-23T16:15:37.000Z'

    while (blobs.length < limit) {
      let getImages = await getImagesTimestamp(
        limit - blobs.length,
        new Date(previousDay)
      );

      blobs = blobs.concat(getImages);

      if (getImages.length === 0) {
        console.log("No more images found for the current previous day");
        // No more images found for the current previous day
        break;
      }

      // Update previousDay for the next iteration
      previousDay -= numberOfDays * 24 * 60 * 60 * 1000;
      numberOfDays *= 2;
    }

    return blobs;
  } catch (error) {
    console.log("🚀 queryLatestImageV3 ~ error:", error);
    return [];
  }
}

export async function getImagesTimestamp(limit: number = 100, timestamp: Date) {
  try {
    let blobs: BlobInfo[] = [];

    let listResults = tableClient.listEntities({
      queryOptions: {
        filter: odata`PartitionKey ge '${formatUtcDateToPartitionKey(
          timestamp
        )}' and PartitionKey le '${CURRENTUTCPERTITIONKEY}'`,
      },
    });

    let iterator = listResults.byPage({
      maxPageSize: limit,
    });

    for await (const page of iterator) {
      page.forEach((entity) => {
        const newImageProps: BlobInfo = blobToImage(entity);
        blobs.push(newImageProps);
      });
    }

    return blobs;
  } catch (error) {
    console.log("🚀 ~ file: error:", error);

    return [];
  }
}

export function blobToImage(
  entity: TableEntityResult<Record<string, unknown>>
): BlobInfo {
  return {
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
}
