
import { GameLevel } from '../types';

export const hygieneLevels: GameLevel[] = [
  {
    id: 5,
    title: 'Morning Routine',
    world: 'Bathroom Zone',
    description: 'Add hygiene items to bathroom bag!',
    difficulty: 'easy',
    targetBasket: 'hygiene',
    rules: [],
    items: [
      {
        id: 'toothbrush',
        name: 'Toothbrush',
        category: 'hygiene',
        isHealthy: true,
        emoji: '🪥'
      },
      {
        id: 'soap',
        name: 'Soap',
        category: 'hygiene',
        isHealthy: true,
        emoji: '🧼'
      },
      {
        id: 'toy',
        name: 'Toy',
        category: 'junk',
        isHealthy: false,
        emoji: '🧸'
      },
      {
        id: 'shampoo',
        name: 'Shampoo',
        category: 'hygiene',
        isHealthy: true,
        emoji: '🧴'
      }
    ]
  },
  {
    id: 6,
    title: 'Bedtime Setup',
    world: 'Bedroom Zone',
    description: 'Keep bedtime items. Remove distractions!',
    difficulty: 'medium',
    targetBasket: 'bedtime',
    rules: [],
    items: [
      {
        id: 'pillow',
        name: 'Pillow',
        category: 'bedtime',
        isHealthy: true,
        emoji: '🛏️'
      },
      {
        id: 'storybook',
        name: 'Storybook',
        category: 'bedtime',
        isHealthy: true,
        emoji: '📖'
      },
      {
        id: 'phone',
        name: 'Phone',
        category: 'junk',
        isHealthy: false,
        emoji: '📱'
      },
      {
        id: 'candy_bed',
        name: 'Candy',
        category: 'junk',
        isHealthy: false,
        emoji: '🍬'
      }
    ]
  }
];
