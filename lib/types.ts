/* eslint-disable no-unused-vars */
export interface BlobInfo {
  id: number;
  height: string;
  width: string;
  public_id: string;
  format: string;
  publicUrl: string;

  description?: string;
  sensitive: boolean;
  author?: string;
  groupId?: string;

  size?: string;
  space?: string;
  density?: string;
  chromaSubsampling?: string;
  channels?: string;
  hasAlpha?: string;
  isisProgressive?: string;
  blurhash?: string;
}

export interface UploadImage {
  fileId: string;
  description?: string;
  sensitive?: boolean;
  author?: string;
  groupId?: string;
  file?: File;
}
