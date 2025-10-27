export enum Tab {
  TITLE_OPTIMIZER = 'Title Optimizer',
  THUMBNAIL_GENERATOR = 'Thumbnail Generator',
  IMAGE_EDITOR = 'Image Editor',
  IMAGE_ANALYZER = 'Image Analyzer',
  VIDEO_GENERATOR = 'Video Generator',
}

// Veo Operation types from Gemini docs
export interface Operation<T = any> {
    name: string;
    metadata?: any;
    done: boolean;
    error?: {
        code: number;
        message: string;
        details: any[];
    };
    response?: T;
}

export interface VideoGenerationResponse {
    generatedVideos: {
        video: {
            uri: string;
            aspectRatio?: string;
        };
    }[];
}