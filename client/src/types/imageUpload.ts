export type Pixels = { x: number; y: number; width: number; height: number };

export interface ImageUpload {
  filename: string;
  path: string;
}

export interface ImageSingleUpload extends ImageUpload {
  status: boolean;
}

export interface ImageMultiUpload {
  files: ImageUpload[];
  status: boolean;
}
