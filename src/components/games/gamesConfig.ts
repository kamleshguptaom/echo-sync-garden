import { GameInfo } from './GameGrid';
import { coreGames } from './config/coreGames';
import { educationalGames } from './config/educationalGames';
import { advancedGames } from './config/advancedGames';
import { getGameCategories as getCategoriesFromConfig } from './config/gameCategories';

export const gamesData: GameInfo[] = [
  ...coreGames,
  ...educationalGames,
  ...advancedGames
];

export const getGameCategories = getCategoriesFromConfig;

// Keep the old export for backwards compatibility
export const gamesConfig = gamesData;
