
export const gameDifficulties = ['easy', 'medium', 'hard', 'expert'] as const;

export type GameDifficulty = typeof gameDifficulties[number];
