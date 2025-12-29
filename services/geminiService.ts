import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Search Grounding - Get current info about planets
export const getPlanetInfo = async (planetName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find interesting, up-to-date scientific facts and news about ${planetName}. Focus on recent discoveries or space missions. Answer in Russian.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
    };
  } catch (error) {
    console.error("Error fetching planet info:", error);
    throw error;
  }
};

// 2. Maps Grounding - Find observatories/planetariums
export const findObservatories = async (lat: number, lng: number) => {
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
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
    };
  } catch (error) {
    console.error("Error finding observatories:", error);
    throw error;
  }
};

// 3. Image Generation - Generate planet textures or artistic views
export const generateSpaceImage = async (
  prompt: string,
  aspectRatio: AspectRatio = "1:1",
  size: ImageSize = "1K"
) => {
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
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// 4. Thinking Mode - Complex astronomical questions
export const askAstronomer = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: question,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error asking astronomer:", error);
    throw error;
  }
};
