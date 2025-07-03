
import { GameLevel } from '../types';

export const mathLevels: GameLevel[] = [
  {
    id: 8,
    title: 'Shape Sorter',
    world: 'Math Zone',
    description: 'Keep triangle-shaped objects!',
    difficulty: 'hard',
    targetBasket: 'math',
    rules: [],
    items: [
      {
        id: 'triangle',
        name: 'Triangle',
        category: 'shape',
        isHealthy: true,
        emoji: '🔺'
      },
      {
        id: 'circle',
        name: 'Circle',
        category: 'shape',
        isHealthy: false,
        emoji: '⚪'
      },
      {
        id: 'square',
        name: 'Square',
        category: 'shape',
        isHealthy: false,
        emoji: '🟦'
      },
      {
        id: 'triangle2',
        name: 'Pizza Slice',
        category: 'shape',
        isHealthy: true,
        emoji: '🍕'
      }
    ]
  }
];
