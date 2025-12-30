export interface CelestialBody {
  name: string;
  nameRu: string;
  type: 'star' | 'planet' | 'dwarf' | 'asteroid' | 'moon';
  radius: number; // Visualization size
  realRadius: number; // km
  distance: number; // Visualization distance
  realDistance?: string; // million km
  speed: number; // Visualization orbital speed
  mass?: string;
  gravity?: string;
  rotationPeriod?: string;
  orbitalPeriod?: string;
  temperature?: string;
  composition?: string[];
  interestingFacts?: string[];
  color: string;
  description: string;
  ringConfig?: {
    innerRadius: number;
    outerRadius: number;
    color?: string;
    rotation?: [number, number, number];
    hasGaps?: boolean;
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