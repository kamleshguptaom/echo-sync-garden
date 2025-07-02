
export interface GameState {
  currentLevel: number;
  score: number;
  completedLevels: number[];
  logicBlocks: LogicBlock[];
  draggedItem: GameItem | null;
  showHint: boolean;
  showExplanation: boolean;
  mistakes: number;
  timer: number;
}

export interface GameItem {
  id: string;
  name: string;
  emoji: string;
  isHealthy: boolean;
  category: ItemCategory;
  color?: string;
  position?: { x: number; y: number };
  description?: string;
}

export interface LogicBlock {
  id: string;
  type: 'condition' | 'action' | 'connector';
  content: string;
  position: { x: number; y: number };
}

export interface GameLevel {
  id: number | string;
  title: string;
  description: string;
  world: string;
  items: GameItem[];
  targetScore?: number;
  maxMistakes?: number;
  timeLimit?: number;
  difficulty?: Difficulty;
  targetBasket?: string;
  rules?: string[];
}

export interface World {
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export type ItemCategory = 'fruit' | 'vegetable' | 'junk' | 'dairy' | 'protein' | 'shape' | 'emotion' | 'recyclable' | 'school' | 'hygiene' | 'bedtime' | 'sports' | 'math' | 'science' | 'weather';
export type Difficulty = 'easy' | 'medium' | 'hard';
