import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface GameCategory {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  route: string;
  gameCount: number;
}

const gameCategories: GameCategory[] = [
  {
    id: 'creative-arts',
    title: 'Creative Arts Studio',
    emoji: '🎨',
    description: 'Draw, animate, and create amazing digital artwork!',
    color: 'from-purple-400 via-pink-500 to-red-500',
    route: '/creative-arts',
    gameCount: 3
  },
  {
    id: 'life-skills-safety',
    title: 'Life Skills & Safety',
    emoji: '🌟',
    description: 'Learn essential life skills and safety awareness!',
    color: 'from-green-400 via-blue-500 to-purple-600',
    route: '/life-skills-safety',
    gameCount: 6
  },
  {
    id: 'brain-memory-training',
    title: 'Brain & Memory Training',
    emoji: '🧠',
    description: 'Boost cognitive abilities and enhance memory!',
    color: 'from-indigo-500 via-purple-500 to-pink-500',
    route: '/brain-memory-training',
    gameCount: 5
  },
  {
    id: 'exploration-discovery',
    title: 'Exploration & Discovery',
    emoji: '🌍',
    description: 'Explore the world, time, and scientific mysteries!',
    color: 'from-blue-400 via-cyan-500 to-teal-600',
    route: '/exploration-discovery',
    gameCount: 5
  },
  {
    id: 'language-reading',
    title: 'Language & Reading',
    emoji: '📚',
    description: 'Master vocabulary, grammar, and reading skills!',
    color: 'from-emerald-400 via-blue-500 to-purple-600',
    route: '/language-reading',
    gameCount: 6
  },
  {
    id: 'logic-puzzles',
    title: 'Logic & Puzzles',
    emoji: '🧩',
    description: 'Challenge your logical thinking and problem-solving!',
    color: 'from-violet-500 via-purple-600 to-indigo-700',
    route: '/logic-puzzles',
    gameCount: 5
  },
  {
    id: 'math-games',
    title: 'Math Adventures',
    emoji: '🔢',
    description: 'Explore mathematics from basic to advanced levels!',
    color: 'from-orange-400 via-red-500 to-pink-600',
    route: '/math-games',
    gameCount: 6
  },
  {
    id: 'science-games',
    title: 'Science Adventures',
    emoji: '🔬',
    description: 'Discover the exciting world of scientific exploration!',
    color: 'from-cyan-400 via-blue-500 to-indigo-600',
    route: '/science-games',
    gameCount: 6
  }
];

export const GameCategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {gameCategories.map((category) => (
        <Card 
          key={category.id}
          className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/95 backdrop-blur-sm border-0 overflow-hidden"
          onClick={() => handleCategoryClick(category.route)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
          <CardHeader className="relative z-10 pb-2">
            <div className="text-center">
              <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {category.emoji}
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900">
                {category.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 text-center">
            <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
              {category.description}
            </p>
            <div className="flex justify-center items-center space-x-2">
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {category.gameCount} Games
              </span>
            </div>
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`h-1 w-full bg-gradient-to-r ${category.color} rounded-full`}></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};