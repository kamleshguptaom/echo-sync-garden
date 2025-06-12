
export type GameMode = 'classic' | 'educational' | 'challenge' | 'speed' | 'extreme';
export type Player = 'player1' | 'player2' | 'computer';

export interface GameState {
  currentPlayer: Player;
  player1Position: number;
  player2Position: number;
  computerPosition?: number;
  diceValue: number;
  gameEnded: boolean;
  winner: Player | null;
  isRolling: boolean;
  consecutiveTurns: number;
  powerUps: { [key: string]: boolean };
}

export interface LadderSnake {
  start: number;
  end: number;
  type: 'ladder' | 'snake';
  concept?: string;
  animation?: string;
  sound?: string;
}

export interface PowerUp {
  position: number;
  type: 'double-move' | 'skip-snake' | 'extra-turn' | 'teleport' | 'mega-jump' | 'shield';
  icon: string;
  description: string;
}

export interface GameStats {
  laddersClimbed: number;
  snakesBitten: number;
  powerUpsCollected: number;
  totalMoves: number;
}
