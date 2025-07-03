
import { GameLevel } from '../types';

export const foodLevels: GameLevel[] = [
  {
    id: 1,
    title: 'Healthy Food Sorter',
    world: 'Grocery Dash',
    description: 'Put healthy food in the basket, junk food in the bin!',
    difficulty: 'easy',
    targetBasket: 'healthy',
    rules: [],
    items: [
      {
        id: 'apple',
        name: 'Apple',
        category: 'fruit',
        isHealthy: true,
        emoji: '🍎'
      },
      {
        id: 'fries',
        name: 'Fries',
        category: 'junk',
        isHealthy: false,
        emoji: '🍟'
      },
      {
        id: 'broccoli',
        name: 'Broccoli',
        category: 'vegetable',
        isHealthy: true,
        emoji: '🥦'
      },
      {
        id: 'candy',
        name: 'Candy',
        category: 'junk',
        isHealthy: false,
        emoji: '🍫'
      },
      {
        id: 'banana',
        name: 'Banana',
        category: 'fruit',
        isHealthy: true,
        emoji: '🍌'
      },
      {
        id: 'donut',
        name: 'Donut',
        category: 'junk',
        isHealthy: false,
        emoji: '🍩'
      }
    ]
  },
  {
    id: 2,
    title: 'Lunch Box Builder',
    world: 'Kitchen Creator',
    description: 'Pack food that gives energy. Discard the rest!',
    difficulty: 'easy',
    targetBasket: 'healthy',
    rules: [],
    items: [
      {
        id: 'sandwich',
        name: 'Sandwich',
        category: 'protein',
        isHealthy: true,
        emoji: '🥪'
      },
      {
        id: 'juice',
        name: 'Juice',
        category: 'fruit',
        isHealthy: true,
        emoji: '🧃'
      },
      {
        id: 'donut2',
        name: 'Donut',
        category: 'junk',
        isHealthy: false,
        emoji: '🍩'
      },
      {
        id: 'gummy',
        name: 'Gummy',
        category: 'junk',
        isHealthy: false,
        emoji: '🍬'
      },
      {
        id: 'orange',
        name: 'Orange',
        category: 'fruit',
        isHealthy: true,
        emoji: '🍊'
      }
    ]
  }
];
