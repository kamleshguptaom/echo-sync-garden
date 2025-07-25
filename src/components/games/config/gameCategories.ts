
export const gameCategories = [
  'Memory',
  'Math', 
  'Language',
  'Logic',
  'Science',
  'Geography',
  'History',
  'Strategy',
  'Puzzle',
  'Word',
  'Board Game',
  'Creative',
  'Focus',
  'Reading',
  'Skill',
  'Perception',
  'Safety',
  'Health',
  'Social',
  'Music',
  'Art',
  'Environment',
  'General',
  'STEM'
] as const;

export type GameCategory = typeof gameCategories[number];

export const getGameCategories = (): string[] => {
  return [...gameCategories].sort();
};
