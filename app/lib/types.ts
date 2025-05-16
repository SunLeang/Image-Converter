export interface FileWithPreview extends File {
  preview: string;
  id: string;
  
}export interface ConvertedImage {
  id: string;
  originalName: string;
  convertedUrl: string;
  format: 'jpeg' | 'png';
  size: number;
}

export type ConversionFormat = 'jpeg' | 'png';