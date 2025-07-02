
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface GameInfo {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  isFeatured?: boolean;
  isNew?: boolean;
}

interface GameGridProps {
  games: GameInfo[];
  onGameSelect: (gameId: string) => void;
  animationDelay?: number;
}

export const GameGrid: React.FC<GameGridProps> = ({ games, onGameSelect, animationDelay = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {games.map((game, index) => (
        <Card 
          key={game.id}
          className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/95 animate-scale-in"
          style={{ animationDelay: `${(animationDelay + index) * 0.05}s` }}
          onClick={() => onGameSelect(game.id)}
        >
          <CardHeader className="text-center pb-2">
            <div className="text-4xl mb-2">
              {game.emoji}
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-lg font-bold">
              {game.title}
              {game.isNew && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <p className="text-sm text-gray-600 mb-2 leading-relaxed">{game.description}</p>
            <div className="mb-3 flex justify-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {game.category}
              </span>
              {game.difficulty && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  game.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  game.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                </span>
              )}
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2"
              onClick={(e) => {
                e.stopPropagation();
                onGameSelect(game.id);
              }}
            >
              Play Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
