
import { GameLevel, GameItem, GameRule } from './types';

export const gameRules: GameRule[] = [
  {
    id: 'fruit-red',
    condition: 'IF fruit AND red',
    action: 'THEN put in healthy basket',
    explanation: 'Red fruits like apples and strawberries are healthy choices!',
    example: 'Apple (red fruit) → Healthy Basket ✅'
  },
  {
    id: 'junk-food',
    condition: 'IF junk food OR cartoon character',
    action: 'THEN put in trash bin',
    explanation: 'Foods with cartoons or junk foods should be avoided for health.',
    example: 'Candy with cartoon → Trash Bin ❌'
  },
  {
    id: 'green-vegetable',
    condition: 'IF vegetable AND green',
    action: 'THEN put in healthy basket',
    explanation: 'Green vegetables are packed with vitamins and minerals!',
    example: 'Broccoli (green vegetable) → Healthy Basket ✅'
  }
];

export const gameLevels: GameLevel[] = [
  {
    id: 'level-1',
    title: 'Fruit Logic Basics',
    world: 'Grocery Dash',
    description: 'Learn to sort red fruits into the healthy basket!',
    difficulty: 'easy',
    targetBasket: 'healthy',
    rules: [gameRules[0]],
    items: [
      {
        id: 'apple',
        name: 'Apple',
        category: 'fruit',
        color: 'red',
        isHealthy: true,
        emoji: '🍎',
        position: { x: 100, y: 200 }
      },
      {
        id: 'strawberry',
        name: 'Strawberry',
        category: 'fruit',
        color: 'red',
        isHealthy: true,
        emoji: '🍓',
        position: { x: 200, y: 200 }
      },
      {
        id: 'broccoli',
        name: 'Broccoli',
        category: 'vegetable',
        color: 'green',
        isHealthy: true,
        emoji: '🥦',
        position: { x: 300, y: 200 }
      },
      {
        id: 'candy',
        name: 'Candy',
        category: 'junk',
        color: 'colorful',
        isHealthy: false,
        emoji: '🍭',
        position: { x: 400, y: 200 }
      }
    ]
  },
  {
    id: 'level-2',
    title: 'Healthy vs Junk',
    world: 'Grocery Dash',
    description: 'Sort healthy foods and avoid junk food!',
    difficulty: 'medium',
    targetBasket: 'healthy',
    rules: [gameRules[0], gameRules[1]],
    items: [
      {
        id: 'banana',
        name: 'Banana',
        category: 'fruit',
        color: 'yellow',
        isHealthy: true,
        emoji: '🍌',
        position: { x: 150, y: 200 }
      },
      {
        id: 'chips',
        name: 'Chips',
        category: 'junk',
        color: 'yellow',
        isHealthy: false,
        emoji: '🍟',
        position: { x: 250, y: 200 }
      },
      {
        id: 'carrot',
        name: 'Carrot',
        category: 'vegetable',
        color: 'orange',
        isHealthy: true,
        emoji: '🥕',
        position: { x: 350, y: 200 }
      }
    ]
  }
];

export const worlds = [
  { id: 'grocery', name: 'Grocery Dash', emoji: '🛒', color: 'bg-green-400' },
  { id: 'kitchen', name: 'Kitchen Creator', emoji: '👨‍🍳', color: 'bg-orange-400' },
  { id: 'lab', name: 'Logic Lab', emoji: '🧪', color: 'bg-purple-400' },
  { id: 'shapes', name: 'Shape Store', emoji: '🔺', color: 'bg-blue-400' },
  { id: 'emotions', name: 'Emotion Park', emoji: '😊', color: 'bg-pink-400' },
  { id: 'recycle', name: 'Recycle Zone', emoji: '♻️', color: 'bg-teal-400' }
];
