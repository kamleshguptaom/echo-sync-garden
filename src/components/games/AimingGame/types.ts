
export type GameMode = 'training' | 'challenge' | 'tournament' | 'survival';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type WeaponType = 'bow' | 'gun' | 'dart';
export type TargetType = 'balloons' | 'birds' | 'fruits' | 'metal';

export interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  points: number;
  hit: boolean;
  type: TargetType;
  color?: string;
  emoji?: string;
  velocity?: { x: number; y: number };
  gravity?: number;
}

export interface Shot {
  x: number;
  y: number;
  accuracy: number;
  points: number;
  weapon: WeaponType;
}

export interface WindEffect {
  direction: number;
  strength: number;
}

export interface GameSettings {
  weapon: WeaponType;
  targetType: TargetType;
  background: string;
  timeLimit: number;
  maxShots: number;
}
