
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
  currentPlayer: 'player1' | 'player2' | 'computer';
  player1Position: number;
  player2Position: number;
  computerPosition: number;
  diceValue: number;
  gameEnded: boolean;
  winner: string | null;
  isRolling: boolean;
  consecutiveTurns: number;
  powerUps: Record<PowerUp['type'], boolean>;
}

export interface GameStats {
  laddersClimbed: number;
  snakesBitten: number;
  powerUpsCollected: number;
  totalMoves: number;
}
