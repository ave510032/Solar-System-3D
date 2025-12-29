export interface CelestialBody {
  name: string;
  nameRu: string;
  type: 'star' | 'planet' | 'dwarf' | 'moon';
  radius: number; // Relative size
  distance: number; // Distance from Sun
  speed: number; // Orbital speed
  color: string;
  description: string;
  textureUrl?: string;
  ringConfig?: {
    innerRadius: number;
    outerRadius: number;
    textureUrl?: string;
    color?: string;
    rotation?: [number, number, number];
  };
  moons?: CelestialBody[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        text: string;
      }[];
    }[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
export type ImageSize = "1K" | "2K" | "4K";