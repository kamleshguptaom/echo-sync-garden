
import { GameLevel } from '../types';

export const ecoLevels: GameLevel[] = [
  {
    id: 7,
    title: 'Recycle Sorter',
    world: 'Eco Zone',
    description: 'Put recyclable items in the recycle bin!',
    difficulty: 'medium',
    targetBasket: 'recyclable',
    rules: [],
    items: [
      {
        id: 'juice_box',
        name: 'Juice Box',
        category: 'recyclable',
        isHealthy: true,
        emoji: '🧃'
      },
      {
        id: 'banana_peel',
        name: 'Banana Peel',
        category: 'junk',
        isHealthy: false,
        emoji: '🍌'
      },
      {
        id: 'cardboard',
        name: 'Cardboard',
        category: 'recyclable',
        isHealthy: true,
        emoji: '📦'
      },
      {
        id: 'plastic_bottle',
        name: 'Plastic Bottle',
        category: 'recyclable',
        isHealthy: true,
        emoji: '🍼'
      }
    ]
  }
];
