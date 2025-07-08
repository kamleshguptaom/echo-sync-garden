export interface RecycleItem {
  id: string;
  name: string;
  emoji: string;
  category: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic';
  color: string;
  fact: string;
  tip: string;
}

export interface Bin {
  category: 'plastic' | 'paper' | 'glass' | 'metal' | 'organic';
  name: string;
  emoji: string;
  color: string;
  description: string;
  examples: string[];
}

export interface GameState {
  level: number;
  score: number;
  streak: number;
  itemsRecycled: number;
  correctCategories: string[];
  showCelebration: boolean;
}