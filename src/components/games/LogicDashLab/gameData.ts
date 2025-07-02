
import { GameLevel, GameItem } from './types';

export const gameLevels: GameLevel[] = [
  {
    id: 'level-1',
    title: 'Healthy vs Unhealthy',
    world: 'Grocery Dash',
    description: 'Sort healthy foods into the basket and unhealthy foods into the bin!',
    difficulty: 'easy',
    targetBasket: 'healthy',
    rules: [],
    items: [
      {
        id: 'apple',
        name: 'Apple',
        category: 'fruit',
        color: 'red',
        isHealthy: true,
        emoji: '🍎',
        position: { x: 50, y: 50 }
      },
      {
        id: 'carrot',
        name: 'Carrot',
        category: 'vegetable',
        color: 'orange',
        isHealthy: true,
        emoji: '🥕',
        position: { x: 150, y: 50 }
      },
      {
        id: 'banana',
        name: 'Banana',
        category: 'fruit',
        color: 'yellow',
        isHealthy: true,
        emoji: '🍌',
        position: { x: 250, y: 50 }
      },
      {
        id: 'broccoli',
        name: 'Broccoli',
        category: 'vegetable',
        color: 'green',
        isHealthy: true,
        emoji: '🥦',
        position: { x: 350, y: 50 }
      },
      {
        id: 'candy',
        name: 'Candy',
        category: 'junk',
        color: 'colorful',
        isHealthy: false,
        emoji: '🍭',
        position: { x: 450, y: 50 }
      },
      {
        id: 'chips',
        name: 'Chips',
        category: 'junk',
        color: 'yellow',
        isHealthy: false,
        emoji: '🍟',
        position: { x: 550, y: 50 }
      }
    ]
  },
  {
    id: 'level-2',
    title: 'Fruits & Veggies',
    world: 'Grocery Dash',
    description: 'Identify and sort fresh produce vs processed foods!',
    difficulty: 'easy',
    targetBasket: 'healthy',
    rules: [],
    items: [
      {
        id: 'strawberry',
        name: 'Strawberry',
        category: 'fruit',
        color: 'red',
        isHealthy: true,
        emoji: '🍓',
        position: { x: 100, y: 50 }
      },
      {
        id: 'orange',
        name: 'Orange',
        category: 'fruit',
        color: 'orange',
        isHealthy: true,
        emoji: '🍊',
        position: { x: 200, y: 50 }
      },
      {
        id: 'lettuce',
        name: 'Lettuce',
        category: 'vegetable',
        color: 'green',
        isHealthy: true,
        emoji: '🥬',
        position: { x: 300, y: 50 }
      },
      {
        id: 'pizza',
        name: 'Pizza',
        category: 'junk',
        color: 'mixed',
        isHealthy: false,
        emoji: '🍕',
        position: { x: 400, y: 50 }
      },
      {
        id: 'donut',
        name: 'Donut',
        category: 'junk',
        color: 'brown',
        isHealthy: false,
        emoji: '🍩',
        position: { x: 500, y: 50 }
      }
    ]
  },
  {
    id: 'level-3',
    title: 'Dairy & Proteins',
    world: 'Kitchen Creator',
    description: 'Sort nutritious proteins and dairy from sugary treats!',
    difficulty: 'medium',
    targetBasket: 'healthy',
    rules: [],
    items: [
      {
        id: 'milk',
        name: 'Milk',
        category: 'dairy',
        color: 'white',
        isHealthy: true,
        emoji: '🥛',
        position: { x: 80, y: 50 }
      },
      {
        id: 'cheese',
        name: 'Cheese',
        category: 'dairy',
        color: 'yellow',
        isHealthy: true,
        emoji: '🧀',
        position: { x: 180, y: 50 }
      },
      {
        id: 'egg',
        name: 'Egg',
        category: 'protein',
        color: 'white',
        isHealthy: true,
        emoji: '🥚',
        position: { x: 280, y: 50 }
      },
      {
        id: 'cookie',
        name: 'Cookie',
        category: 'junk',
        color: 'brown',
        isHealthy: false,
        emoji: '🍪',
        position: { x: 380, y: 50 }
      },
      {
        id: 'icecream',
        name: 'Ice Cream',
        category: 'junk',
        color: 'pink',
        isHealthy: false,
        emoji: '🍦',
        position: { x: 480, y: 50 }
      }
    ]
  }
];

export const worlds = [
  { id: 'grocery', name: 'Grocery Dash', emoji: '🛒', color: 'bg-green-400' },
  { id: 'kitchen', name: 'Kitchen Creator', emoji: '👨‍🍳', color: 'bg-orange-400' },
  { id: 'lab', name: 'Logic Lab', emoji: '🧪', color: 'bg-purple-400' }
];
