
export interface GameState {
  currentPlayer: Player;
  player1Position: number;
  player2Position: number;
  computerPosition: number;
  diceValue: number;
  gameEnded: boolean;
  winner: Player | null;
  isRolling: boolean;
  consecutiveTurns: number;
  powerUps: Record<PowerUp, boolean>;
}

export interface GameStats {
  laddersClimbed: number;
  snakesBitten: number;
  powerUpsCollected: number;
  totalMoves: number;
}

export interface LadderSnake {
  start: number;
  end: number;
  type: 'ladder' | 'snake';
  concept?: string;
}

export interface PowerUpItem {
  position: number;
  type: PowerUp;
  icon: string;
  description: string;
}

export type GameMode = 'classic' | 'educational' | 'challenge' | 'speed' | 'extreme';
export type Player = 'player1' | 'player2' | 'computer';
export type PowerUp = 'double-move' | 'skip-snake' | 'extra-turn' | 'teleport' | 'mega-jump' | 'shield';
