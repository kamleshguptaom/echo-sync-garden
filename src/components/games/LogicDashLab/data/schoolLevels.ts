
import { GameLevel } from '../types';

export const schoolLevels: GameLevel[] = [
  {
    id: 3,
    title: 'Pack for School',
    world: 'School Zone',
    description: 'Put school items in the backpack. Leave toys and food aside!',
    difficulty: 'easy',
    targetBasket: 'school',
    rules: [],
    items: [
      {
        id: 'book',
        name: 'Book',
        category: 'school',
        isHealthy: true,
        emoji: '📚'
      },
      {
        id: 'crayon',
        name: 'Crayon',
        category: 'school',
        isHealthy: true,
        emoji: '🖍️'
      },
      {
        id: 'teddy',
        name: 'Teddy',
        category: 'junk',
        isHealthy: false,
        emoji: '🧸'
      },
      {
        id: 'pizza',
        name: 'Pizza',
        category: 'junk',
        isHealthy: false,
        emoji: '🍕'
      },
      {
        id: 'pencil',
        name: 'Pencil',
        category: 'school',
        isHealthy: true,
        emoji: '✏️'
      }
    ]
  },
  {
    id: 4,
    title: 'Sport Day Prep',
    world: 'School Zone',
    description: 'Pack only sports items for the big game!',
    difficulty: 'medium',
    targetBasket: 'sports',
    rules: [],
    items: [
      {
        id: 'ball',
        name: 'Ball',
        category: 'sports',
        isHealthy: true,
        emoji: '🏀'
      },
      {
        id: 'shoes',
        name: 'Sports Shoes',
        category: 'sports',
        isHealthy: true,
        emoji: '👟'
      },
      {
        id: 'gamepad',
        name: 'Gamepad',
        category: 'junk',
        isHealthy: false,
        emoji: '🎮'
      },
      {
        id: 'whistle',
        name: 'Whistle',
        category: 'sports',
        isHealthy: true,
        emoji: '🔔'
      }
    ]
  }
];
