import { GameInfo } from './GameGrid';

export const gamesData: GameInfo[] = [
  // Core Cognitive Skills
  { id: 'memory', title: 'Memory Training', emoji: '🧠', description: 'Enhance memory capacity and recall', category: 'Cognitive Skills', difficulty: 'medium' },
  { id: 'attention', title: 'Attention Training', emoji: '🎯', description: 'Improve focus and concentration', category: 'Cognitive Skills', difficulty: 'medium' },
  { id: 'visualperception', title: 'Visual Perception', emoji: '👁️', description: 'Enhance visual processing skills', category: 'Cognitive Skills', difficulty: 'medium' },
  { id: 'pattern', title: 'Pattern Recognition', emoji: '🔍', description: 'Identify and predict patterns', category: 'Cognitive Skills', difficulty: 'hard' },
  { id: 'concentration', title: 'Concentration Test', emoji: '🎨', description: 'Stroop test & focus training', category: 'Cognitive Skills', difficulty: 'medium' },
  { id: 'logic', title: 'Logic Puzzles', emoji: '🧩', description: 'Develop logical reasoning', category: 'Cognitive Skills', difficulty: 'hard' },
  { id: 'criticalthinking', title: 'Critical Thinking', emoji: '🤔', description: 'Analyze and evaluate information', category: 'Cognitive Skills', difficulty: 'expert' },
  { id: 'bloodrelations', title: 'Blood Relations', emoji: '👪', description: 'Master family relationship puzzles', category: 'Cognitive Skills', difficulty: 'hard', isNew: true },
  { id: 'numbersequence', title: 'Number Patterns', emoji: '🔢', description: 'Identify numerical sequences', category: 'Cognitive Skills', difficulty: 'medium' },
  
  // Mathematics & Numbers
  { id: 'math', title: 'Math Challenge', emoji: '🧮', description: 'Comprehensive math training', category: 'Mathematics', difficulty: 'medium' },
  { id: 'mathracing', title: 'Math Racing', emoji: '🏎️', description: 'Speed math challenges', category: 'Mathematics', difficulty: 'hard' },
  { id: 'fractions', title: 'Fraction Master', emoji: '½', description: 'Learn fractions visually', category: 'Mathematics', difficulty: 'easy' },
  { id: 'algebra', title: 'Algebra Quest', emoji: '📊', description: 'Solve algebraic equations', category: 'Mathematics', difficulty: 'hard' },
  { id: 'geometry', title: 'Geometry Studio', emoji: '📐', description: 'Explore shapes and angles', category: 'Mathematics', difficulty: 'medium' },
  
  // Language & Communication
  { id: 'word', title: 'Word Games', emoji: '📝', description: 'Vocabulary and spelling', category: 'Language', difficulty: 'easy' },
  { id: 'grammar', title: 'Grammar Master', emoji: '📚', description: 'Master language structure', category: 'Language', difficulty: 'medium', isNew: true, isFeatured: true },
  { id: 'speedreading', title: 'Speed Reading', emoji: '📖', description: 'Improve reading speed', category: 'Language', difficulty: 'medium' },
  { id: 'typing', title: 'Typing Master', emoji: '⌨️', description: 'Professional typing skills', category: 'Language', difficulty: 'easy' },
  
  // STEM & Technology
  { id: 'science', title: 'Science Explorer', emoji: '🔬', description: 'Interactive science learning', category: 'STEM', difficulty: 'medium' },
  { id: 'roadsafety', title: 'Road Safety', emoji: '🚦', description: 'Learn traffic rules and safety', category: 'STEM', difficulty: 'easy' },
  
  // World Knowledge
  { id: 'geography', title: 'Geography Quest', emoji: '🌍', description: 'Explore world geography', category: 'World Knowledge', difficulty: 'medium' },
  { id: 'history', title: 'History Journey', emoji: '🏛️', description: 'Travel through time', category: 'World Knowledge', difficulty: 'medium' },
  
  // Creative & Arts
  { id: 'drawing', title: 'Art Studio Pro', emoji: '🎨', description: 'Professional digital art', category: 'Creative', difficulty: 'easy', isFeatured: true },
  { id: 'builder', title: 'Object Builder', emoji: '🏗️', description: 'Create 3D objects', category: 'Creative', difficulty: 'medium' },
  
  // Puzzle Games
  { id: 'sudoku', title: 'Sudoku Master', emoji: '🔢', description: 'Number placement puzzles', category: 'Puzzles', difficulty: 'hard' },
  { id: 'jigsaw', title: 'Jigsaw Puzzles', emoji: '🧩', description: 'Picture piece puzzles', category: 'Puzzles', difficulty: 'easy' },
  { id: 'waffle', title: 'Waffle Game', emoji: '🧇', description: 'Word puzzle challenge', category: 'Puzzles', difficulty: 'medium' },
  
  // Sports & Action
  { id: 'aiming', title: 'Archery Challenge', emoji: '🏹', description: 'Advanced shooting range', category: 'Sports', difficulty: 'medium', isFeatured: true },
  { id: 'carrom', title: 'Carrom Board', emoji: '🎯', description: 'Strike and pocket coins', category: 'Sports', difficulty: 'medium' },
  
  // Classic Games
  { id: 'tictactoe', title: 'Tic Tac Toe Pro', emoji: '⭕', description: 'Advanced strategy game', category: 'Classic', difficulty: 'easy', isFeatured: true },
  { id: 'laddersnake', title: 'Snakes & Ladders', emoji: '🐍', description: 'Classic board game', category: 'Classic', difficulty: 'easy' }
];

export const getGameCategories = (): string[] => {
  return [...new Set(gamesData.map(game => game.category))];
};

export const getGameById = (id: string): GameInfo | undefined => {
  return gamesData.find(game => game.id === id);
};

export const getFeaturedGames = (): GameInfo[] => {
  return gamesData.filter(game => game.isFeatured);
};

export const getGamesByCategory = (category: string): GameInfo[] => {
  return gamesData.filter(game => game.category === category);
};
