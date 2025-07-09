export interface Vehicle {
  id: string;
  name: string;
  emoji: string;
  category: 'land' | 'air' | 'water';
  sound: string;
  fact: string;
  speed: string;
  environment: string;
}

export interface TransportCategory {
  name: string;
  emoji: string;
  color: string;
  description: string;
  examples: string[];
}

export interface GameProgress {
  level: number;
  score: number;
  vehiclesSorted: number;
  perfectSorts: number;
  categoriesMastered: Set<string>;
  soundEnabled: boolean;
}