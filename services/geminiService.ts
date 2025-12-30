
import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Helper to handle API key selection errors as per guidelines
const handleGenAIError = async (error: any) => {
  if (error?.message?.includes("Requested entity was not found.")) {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }
  }
  throw error;
};

// 1. Search Grounding - Get current info about planets
export const getPlanetInfo = async (planetName: string) => {
  // Fix: Create instance right before calling to ensure up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find interesting, up-to-date scientific facts and news about ${planetName}. Focus on recent discoveries or space missions. Answer in Russian.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text, // Fix: Access property .text
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
    };
  } catch (error) {
    console.error("Error fetching planet info:", error);
    return handleGenAIError(error);
  }
};

// 2. Maps Grounding - Find observatories/planetariums
export const findObservatories = async (lat: number, lng: number) => {
  // Fix: Create instance right before calling
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Найти ближайшие планетарии или обсерватории.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
      },
    });

    return {
      text: response.text, // Fix: Access property .text
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
    };
  } catch (error) {
    console.error("Error finding observatories:", error);
    return handleGenAIError(error);
  }
};

// 3. Image Generation - Generate planet textures or artistic views
export const generateSpaceImage = async (
  prompt: string,
  aspectRatio: AspectRatio = "1:1",
  size: ImageSize = "1K"
) => {
  // Fix: Create instance right before calling
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: size,
        },
      },
    });

    let imageUrl = null;
    // Fix: Iterating through candidates parts to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        imageUrl = `data:image/png;base64,${base64EncodeString}`;
        break;
      }
    }
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    return handleGenAIError(error);
  }
};

// 4. Thinking Mode - Complex astronomical questions
export const askAstronomer = async (question: string) => {
  // Fix: Create instance right before calling
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: question,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text; // Fix: Access property .text
  } catch (error) {
    console.error("Error asking astronomer:", error);
    return handleGenAIError(error);
  }
};
