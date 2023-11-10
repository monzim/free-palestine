import { BlobServiceClient } from "@azure/storage-blob";
import { BlobInfo } from "../types";

export async function GetImages(): Promise<BlobInfo[]> {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
  if (connectionString === "") {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING not set");
  }

  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "gallery-1";

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  const containerClient = blobServiceClient.getContainerClient(containerName);

  let blobs: BlobInfo[] = [];

  var n = 0;

  for await (const blob of containerClient.listBlobsFlat({
    includeMetadata: true,
    includeDeleted: false,
  })) {
    const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
    // read blob metadata
    const meta = blob.metadata;
    const sensitive = meta?.sensitive === "true" ? true : false;
    const description = meta?.description || "";
    const author = meta?.author || "";
    const groupId = meta?.groupId || "";

    const newImageProps: BlobInfo = {
      id: n++,
      public_id: blob.name,
      height: "1",
      width: "1",
      format: blob.properties.contentType || "image/jpeg",
      publicUrl: tempBlockBlobClient.url,

      sensitive: sensitive,
      description: description,
      groupId: groupId,
      author: author,

      size: meta?.size || "",
      space: meta?.space || "",
      density: meta?.density || "",
      chromaSubsampling: meta?.chromaSubsampling || "",
      channels: meta?.channels || "",
      hasAlpha: meta?.hasAlpha || "",
      isisProgressive: meta?.isProgressive || "",
      blurhash: meta?.blurhash || "",
    };

    blobs.push(newImageProps);
  }

  blobs.reverse();

  return blobs;
}
