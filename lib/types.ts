/* eslint-disable no-unused-vars */
export interface BlobInfo {
  id: string;
  height: number;
  width: number;
  description?: string;

  format?: string;
  publicUrl: string;
  createdAt?: Date;

  sensitive: boolean;
  author?: string;
  groupId?: string;
  density?: number;
  chromaSubsampling?: string;
  size?: number;
  blurhash?: string;
  isisProgressive?: boolean;
  space?: string;
  channels?: number;
  hasAlpha?: boolean;

  partitionKey?: string;
  rowKey?: string;
}

export interface UploadImage {
  fileId: string;
  description?: string;
  sensitive?: boolean;
  author?: string;
  groupId?: string;
  file?: File;
}
