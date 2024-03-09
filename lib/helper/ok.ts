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
    let blobs: BlobInfo[] = [];
    let numberOfDays = 7;

    let startDate = new Date();
    let endDate = new Date(
      startDate.getTime() - numberOfDays * 24 * 60 * 60 * 1000
    );

    let c = 0;
    while (blobs.length < limit) {
      console.log("startDate", startDate);
      console.log("endDate", endDate);

      let getImages = await getImagesByDateRange(limit, startDate, endDate);
      blobs = blobs.concat(getImages?.blobs || []);

      if (c > 100 || blobs.length >= limit) {
        console.log("No more images found for the current previous day");
        break;
      }

      // Update previousDay for the next iteration
      startDate = new Date(
        endDate.getTime() - numberOfDays * 24 * 60 * 60 * 1000
      );
      endDate = new Date(
        endDate.getTime() - numberOfDays * 24 * 60 * 60 * 1000
      );
      c++;
    }

    return blobs;
  } catch (error) {
    console.log("🚀 queryLatestImageV3 ~ error:", error);
    return [];
  }
}

interface GetImagesByDateRange {
  blobs: BlobInfo[];
  nextIteration: boolean;
}

export async function getImagesByDateRange(
  limit: number = 100,
  startDate: Date,
  endDate: Date
): Promise<GetImagesByDateRange | null> {
  try {
    let blobs: BlobInfo[] = [];

    let listResults = tableClient.listEntities({
      queryOptions: {
        filter: odata`Timestamp ge datetime'${endDate.toISOString()}' and Timestamp le datetime'${startDate.toISOString()}'`,
      },
    });

    let iterator = listResults.byPage({ maxPageSize: limit });

    for await (const page of iterator) {
      page.forEach((entity) => {
        blobs.push(blobToImage(entity));
      });
    }

    return {
      blobs,
      nextIteration: true,
    };
  } catch (error) {
    console.log("🚀 ~ file: error:", error);

    return null;
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
