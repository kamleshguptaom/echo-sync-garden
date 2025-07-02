
export interface LogicBlock {
  id: string;
  type: 'IF' | 'THEN' | 'AND' | 'OR';
  condition?: string;
  action?: string;
  position: { x: number; y: number };
  isConnected: boolean;
}

export interface GameItem {
  id: string;
  name: string;
  category: 'fruit' | 'vegetable' | 'junk' | 'dairy' | 'shape' | 'emotion' | 'recyclable';
  color?: string;
  shape?: string;
  isHealthy?: boolean;
  emoji: string;
  position: { x: number; y: number };
}

export interface GameRule {
  id: string;
  condition: string;
  action: string;
  explanation: string;
  example: string;
}

export interface GameLevel {
  id: string;
  title: string;
  world: string;
  description: string;
  items: GameItem[];
  rules: GameRule[];
  targetBasket: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

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

export type WorldType = 'grocery' | 'kitchen' | 'lab' | 'shapes' | 'emotions' | 'recycle';
