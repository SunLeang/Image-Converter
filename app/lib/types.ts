export interface FileWithPreview extends File {
  preview: string;
  id: string;
}

export type ConversionFormat = 'jpeg' | 'png';