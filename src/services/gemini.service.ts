import { GoogleGenAI } from '@google/genai';

const PRO_MODEL = 'gemini-3-pro-image-preview';
const FLASH_MODEL = 'gemini-2.5-flash-image';

interface GeminiApiError {
  status?: number;
  code?: number;
  message?: string;
}

const cleanBase64 = (base64Data: string): string => base64Data.split(',')[1];

const getMimeType = (base64Data: string): string => {
  const match = base64Data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  return match && match.length > 1 ? match[1] : 'image/jpeg';
};

const getClosestAspectRatio = (width: number, height: number): string => {
  const targetRatio = width / height;
  const supportedRatios = [
    { id: '1:1', value: 1.0 },
    { id: '3:4', value: 3 / 4 },
    { id: '4:3', value: 4 / 3 },
    { id: '9:16', value: 9 / 16 },
    { id: '16:9', value: 16 / 9 },
  ];
  const closest = supportedRatios.reduce((prev, curr) =>
    Math.abs(curr.value - targetRatio) < Math.abs(prev.value - targetRatio)
      ? curr
      : prev
  );
  return closest.id;
};

const callGeminiModel = async (
  apiKey: string,
  model: string,
  prompt: string,
  furniture: { mime: string; data: string },
  texture: { mime: string; data: string },
  aspectRatio: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: furniture.mime, data: furniture.data } },
        { inlineData: { mimeType: texture.mime, data: texture.data } },
      ],
    },
    config: {
      imageConfig: { aspectRatio: aspectRatio },
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('No content generated.');

  const imagePart = parts.find((part) => part.inlineData);
  if (imagePart && imagePart.inlineData) {
    return `data:image/png;base64,${imagePart.inlineData.data}`;
  }

  throw new Error('Model did not return an image.');
};

export const generateReupholstery = async (
  furnitureBase64: string,
  textureBase64: string,
  width: number,
  height: number
): Promise<string> => {
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error('API Key not found.');

  const aspectRatio = getClosestAspectRatio(width, height);
  const furnitureMime = getMimeType(furnitureBase64);
  const textureMime = getMimeType(textureBase64);
  const cleanFurniture = cleanBase64(furnitureBase64);
  const cleanTexture = cleanBase64(textureBase64);

  const prompt = `ACT AS AN EXPERT UPHOLSTERER.

  TASK: Reupholster the furniture in Image 1 using the fabric from Image 2.

  INSTRUCTIONS:
  1.  Identify all fabric and upholstered areas on the furniture in Image 1.
  2.  Replace the material in ALL identified upholstered areas with the new fabric color and texture from Image 2.
  3.  Ensure the new fabric covers the entire upholstered surface uniformly.
  4.  Keep all non-upholstered parts (wood, metal, etc.) and the background exactly as they are in Image 1.
  5.  Preserve the original lighting, shadows, and folds to make the new fabric look realistic.

  GOAL: A photorealistic reupholstery job where only the fabric has changed, and the rest of the image is untouched.
  OUTPUT: Only the final processed image.`;

  try {
    return await callGeminiModel(
      apiKey,
      PRO_MODEL,
      prompt,
      { mime: furnitureMime, data: cleanFurniture },
      { mime: textureMime, data: cleanTexture },
      aspectRatio
    );
  } catch (err: unknown) {
    const error = err as GeminiApiError;
    const isOverloaded =
      error.status === 503 ||
      error.code === 503 ||
      error.message?.includes('overloaded');

    if (isOverloaded) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        return await callGeminiModel(
          apiKey,
          PRO_MODEL,
          prompt,
          { mime: furnitureMime, data: cleanFurniture },
          { mime: textureMime, data: cleanTexture },
          aspectRatio
        );
      } catch {
        return await callGeminiModel(
          apiKey,
          FLASH_MODEL,
          prompt,
          { mime: furnitureMime, data: cleanFurniture },
          { mime: textureMime, data: cleanTexture },
          aspectRatio
        );
      }
    }
    throw error;
  }
};
