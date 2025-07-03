
import { GameLevel } from './types';
import { foodLevels } from './data/foodLevels';
import { schoolLevels } from './data/schoolLevels';
import { hygieneLevels } from './data/hygieneLevels';
import { ecoLevels } from './data/ecoLevels';
import { mathLevels } from './data/mathLevels';

export const gameLevels: GameLevel[] = [
  ...foodLevels,
  ...schoolLevels,
  ...hygieneLevels,
  ...ecoLevels,
  ...mathLevels
];

export { worlds } from './data/worlds';
