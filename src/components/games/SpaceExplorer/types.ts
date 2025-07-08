export interface Planet {
  id: string;
  name: string;
  emoji: string;
  fact: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  distanceFromSun: string;
  temperature: string;
  moons: number;
  funFacts: string[];
}

export interface SpaceObject {
  id: string;
  name: string;
  emoji: string;
  type: 'planet' | 'moon' | 'asteroid' | 'comet';
  description: string;
}

export interface SpaceMission {
  id: string;
  name: string;
  target: string;
  description: string;
  difficulty: number;
  completed: boolean;
}