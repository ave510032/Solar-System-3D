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
  explorationHistory?: { year: string; mission: string; detail: string }[];
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface Tour {
  id: string;
  name: string;
  targets: string[];
}