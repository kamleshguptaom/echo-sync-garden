
export interface LadderSnake {
  start: number;
  end: number;
  type: 'ladder' | 'snake';
  concept: string;
}

export interface PowerUp {
  position: number;
  type: 'double-move' | 'skip-snake' | 'extra-turn' | 'teleport' | 'mega-jump' | 'shield';
  icon: string;
  description: string;
}

export type GameMode = 'classic' | 'challenge' | 'extreme';

export interface Player {
  id: number;
  name: string;
  position: number;
  color: string;
  isActive: boolean;
  powerUps: PowerUp['type'][];
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number;
  gameMode: GameMode;
  isGameOver: boolean;
  winner: Player | null;
  moveHistory: Array<{
    player: string;
    from: number;
    to: number;
    dice: number;
    special?: string;
  }>;
}
