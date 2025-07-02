
import { GameInfo } from './GameGrid';

export const gamesConfig: GameInfo[] = [
  {
    id: 'memory',
    title: 'Memory Match',
    emoji: '🧠',
    description: 'Test your memory with colorful cards and fun patterns!',
    category: 'Memory',
    difficulty: 'easy' as const,
    isFeatured: true
  },
  {
    id: 'math',
    title: 'Math Adventure',
    emoji: '🔢',
    description: 'Solve exciting math problems and build number skills!',
    category: 'Math',
    difficulty: 'medium' as const
  },
  {
    id: 'word',
    title: 'Word Explorer',
    emoji: '📝',
    description: 'Discover new words and improve your vocabulary!',
    category: 'Language',
    difficulty: 'easy' as const
  },
  {
    id: 'logic',
    title: 'Logic Puzzles',
    emoji: '🧩',
    description: 'Challenge your mind with brain-teasing logic games!',
    category: 'Logic',
    difficulty: 'hard' as const
  },
  {
    id: 'geometry',
    title: 'Shape Master',
    emoji: '📐',
    description: 'Learn about shapes, angles, and spatial reasoning!',
    category: 'Math',
    difficulty: 'medium' as const
  },
  {
    id: 'science',
    title: 'Science Lab',
    emoji: '🔬',
    description: 'Explore the wonders of science through experiments!',
    category: 'Science',
    difficulty: 'medium' as const
  },
  {
    id: 'geography',
    title: 'World Explorer',
    emoji: '🌍',
    description: 'Discover countries, capitals, and amazing places!',
    category: 'Geography',
    difficulty: 'medium' as const
  },
  {
    id: 'history',
    title: 'Time Travel',
    emoji: '🏛️',
    description: 'Journey through history and meet famous figures!',
    category: 'History',
    difficulty: 'hard' as const
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    emoji: '⭕',
    description: 'Classic strategy game with a colorful twist!',
    category: 'Strategy',
    difficulty: 'easy' as const
  },
  {
    id: 'sudoku',
    title: 'Number Sudoku',
    emoji: '🔢',
    description: 'Fill the grid with numbers using logic and reasoning!',
    category: 'Logic',
    difficulty: 'expert' as const
  },
  {
    id: 'jigsaw',
    title: 'Jigsaw Puzzle',
    emoji: '🧩',
    description: 'Piece together beautiful pictures and scenes!',
    category: 'Puzzle',
    difficulty: 'medium' as const
  },
  {
    id: 'waffle',
    title: 'Waffle Words',
    emoji: '🧇',
    description: 'Swap letters to create words in this tasty puzzle!',
    category: 'Word',
    difficulty: 'hard' as const
  },
  {
    id: 'laddersnake',
    title: 'Ladder Snake',
    emoji: '🐍',
    description: 'Climb ladders and avoid snakes in this classic board game!',
    category: 'Board Game',
    difficulty: 'easy' as const
  },
  {
    id: 'builder',
    title: 'Object Builder',
    emoji: '🏗️',
    description: 'Build amazing structures and unleash your creativity!',
    category: 'Creative',
    difficulty: 'medium' as const
  },
  {
    id: 'pattern',
    title: 'Pattern Detective',
    emoji: '🔍',
    description: 'Spot patterns and sequences in this observational game!',
    category: 'Logic',
    difficulty: 'medium' as const
  },
  {
    id: 'concentration',
    title: 'Concentration',
    emoji: '🎯',
    description: 'Focus your mind and improve your attention span!',
    category: 'Focus',
    difficulty: 'medium' as const
  },
  {
    id: 'speedreading',
    title: 'Speed Reading',
    emoji: '📚',
    description: 'Read faster while maintaining comprehension!',
    category: 'Reading',
    difficulty: 'hard' as const
  },
  {
    id: 'typing',
    title: 'Typing Master',
    emoji: '⌨️',
    description: 'Improve your typing speed and accuracy!',
    category: 'Skill',
    difficulty: 'medium' as const
  },
  {
    id: 'drawing',
    title: 'Digital Artist',
    emoji: '🎨',
    description: 'Create beautiful digital artwork and express yourself!',
    category: 'Creative',
    difficulty: 'easy' as const
  },
  {
    id: 'visualperception',
    title: 'Visual Perception',
    emoji: '👁️',
    description: 'Train your eyes to see details and differences!',
    category: 'Perception',
    difficulty: 'medium' as const
  },
  {
    id: 'attention',
    title: 'Attention Training',
    emoji: '🧘',
    description: 'Strengthen your focus and attention skills!',
    category: 'Focus',
    difficulty: 'medium' as const
  },
  {
    id: 'fractions',
    title: 'Fraction Fun',
    emoji: '🍕',
    description: 'Learn fractions with pizza slices and fun visuals!',
    category: 'Math',
    difficulty: 'medium' as const
  },
  {
    id: 'algebra',
    title: 'Algebra Quest',
    emoji: '🧮',
    description: 'Solve equations and master algebraic thinking!',
    category: 'Math',
    difficulty: 'hard' as const
  },
  {
    id: 'criticalthinking',
    title: 'Critical Think',
    emoji: '🤔',
    description: 'Develop reasoning and analytical thinking skills!',
    category: 'Logic',
    difficulty: 'hard' as const
  },
  {
    id: 'roadsafety',
    title: 'Road Safety',
    emoji: '🚦',
    description: 'Learn important road safety rules and signs!',
    category: 'Safety',
    difficulty: 'easy' as const
  },
  {
    id: 'numbersequence',
    title: 'Number Sequence',
    emoji: '🔢',
    description: 'Find patterns in number sequences and continue them!',
    category: 'Math',
    difficulty: 'medium' as const
  },
  {
    id: 'mathracing',
    title: 'Math Racing',
    emoji: '🏎️',
    description: 'Race against time solving math problems!',
    category: 'Math',
    difficulty: 'hard' as const
  },
  {
    id: 'grammar',
    title: 'Grammar Guide',
    emoji: '📖',
    description: 'Master grammar rules with fun exercises!',
    category: 'Language',
    difficulty: 'medium' as const
  },
  {
    id: 'bloodrelations',
    title: 'Family Tree',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Understand family relationships and connections!',
    category: 'Logic',
    difficulty: 'hard' as const
  },
  {
    id: 'logicdashlab',
    title: 'Logic Dash Lab',
    emoji: '🧩',
    description: 'Learn logic, healthy habits, and sorting through fun drag-and-drop gameplay!',
    category: 'Logic',
    difficulty: 'easy' as const,
    isNew: true
  }
];
