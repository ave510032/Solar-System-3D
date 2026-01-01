
import { GoogleGenAI } from "@google/genai";

/**
 * Service to interact with Google Gemini API for astronomical data and features.
 */

// Fetches detailed information about a celestial body using search grounding.
export const getPlanetInfo = async (planetName: string) => {
  // Initialize AI client right before use to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide detailed scientific information and recent news about the celestial body: ${planetName}.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || '',
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
};

// Finds astronomical observatories or planetariums, optionally using the user's location for grounding.
export const findObservatories = async (lat?: number, lng?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: "Find major astronomical observatories, planetariums, and dark sky parks. If my current location is provided, suggest the ones closest to me.",
    config: {
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined,
        },
      },
    },
  });

  return {
    text: response.text || '',
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
};

// Generates a space-themed image based on a prompt using the Gemini flash image model (nano banana series).
export const generateSpaceImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A photorealistic and scientifically inspired space visualization of: ${prompt}` }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  // Iterate through parts to find the image data as per nano banana series rules
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};

// Provides an interactive chat experience with a simulated expert astronomer using the Pro model.
export const askAstronomer = async (question: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: question,
    config: {
      systemInstruction: "You are a professional astronomer and educator. Answer questions about space, physics, and the solar system with scientific accuracy and enthusiasm. Keep answers concise but informative.",
    },
  });
  return response.text || '';
};
