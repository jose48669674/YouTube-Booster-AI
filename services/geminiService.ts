import { GoogleGenAI, Modality } from "@google/genai";
import type { Operation, VideoGenerationResponse } from '../types';

export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

const getApiKey = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

const getAiClient = () => new GoogleGenAI({ apiKey: getApiKey() });

export const generateTitleSuggestions = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: `Generate 5 viral YouTube titles for a video about: "${prompt}". Return only the titles, each on a new line.`,
    config: {
      temperature: 0.7,
      topP: 1,
      topK: 1,
    }
  });
  return response.text;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A compelling, high-click-through-rate YouTube thumbnail for a video about: ${prompt}. Cinematic, vibrant, high-detail.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("Image generation failed.");
};


export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("Image editing failed to produce an image.");
};


export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        {
          text: prompt,
        },
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
      ],
    },
  });
  return response.text;
};

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16', image?: { imageBytes: string; mimeType: string }): Promise<Operation<VideoGenerationResponse>> => {
  const ai = getAiClient();
  return ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: image,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    }
  });
};

export const getVideosOperation = async (operation: Operation): Promise<Operation<VideoGenerationResponse>> => {
    const ai = getAiClient();
    return ai.operations.getVideosOperation({ operation: operation });
};
