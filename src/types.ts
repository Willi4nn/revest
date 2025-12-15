export interface ImageDimensions {
  width: number;
  height: number;
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
  width: number;
  height: number;
}

export interface UploadSectionItem {
  id: string;
  step: string;
  title: string;
  description: string;
  subLabel: string;
  image: UploadedImage | null;
  onImageSelect: (image: UploadedImage) => void;
  onClear: () => void;
}

export type ProcessingState =
  | 'IDLE'
  | 'UPLOADING'
  | 'GENERATING'
  | 'SUCCESS'
  | 'ERROR';

export const ProcessingState = {
  IDLE: 'IDLE' as ProcessingState,
  UPLOADING: 'UPLOADING' as ProcessingState,
  GENERATING: 'GENERATING' as ProcessingState,
  SUCCESS: 'SUCCESS' as ProcessingState,
  ERROR: 'ERROR' as ProcessingState,
};

export interface GenerationResult {
  imageUrl: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
