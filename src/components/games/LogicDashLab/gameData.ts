
import { GameLevel, GameItem } from './types';

export const gameLevels: GameLevel[] = [
  // Food Logic Levels
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
  },
  
  // School Bag Logic Levels
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
  },
  
  // Hygiene & Routine Logic
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
  },
  
  // Eco Logic (Recycling & Environment)
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
  },
  
  // Math & Sorting Logic
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

export const worlds = [
  { id: 'grocery', name: 'Grocery Dash', emoji: '🛒', color: 'bg-green-400' },
  { id: 'kitchen', name: 'Kitchen Creator', emoji: '👨‍🍳', color: 'bg-orange-400' },
  { id: 'school', name: 'School Zone', emoji: '🎒', color: 'bg-blue-400' },
  { id: 'bathroom', name: 'Bathroom Zone', emoji: '🚿', color: 'bg-cyan-400' },
  { id: 'bedroom', name: 'Bedroom Zone', emoji: '🛏️', color: 'bg-purple-400' },
  { id: 'eco', name: 'Eco Zone', emoji: '♻️', color: 'bg-emerald-400' },
  { id: 'math', name: 'Math Zone', emoji: '🔢', color: 'bg-pink-400' }
];
