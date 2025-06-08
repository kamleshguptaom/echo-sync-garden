
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameInfo } from './GameGrid';

interface FeaturedSectionProps {
  games: GameInfo[];
  onGameSelect: (gameId: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ games, onGameSelect }) => {
  if (games.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
        🌟 Featured Games
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game, index) => (
          <Card 
            key={`featured-${game.id}`}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/20 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onGameSelect(game.id)}
          >
            <CardHeader className="text-center pb-2">
              <div className="text-5xl mb-3 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                {game.emoji}
              </div>
              <CardTitle className="text-lg font-bold text-white">
                {game.title}
                {game.isNew && (
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-white/90 mb-2 leading-relaxed">{game.description}</p>
              {game.difficulty && (
                <div className="mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    game.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                    game.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    game.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                  </span>
                </div>
              )}
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
    </div>
  );
};
