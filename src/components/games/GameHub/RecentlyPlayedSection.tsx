
import React from 'react';
import { Button } from '@/components/ui/button';
import { GameInfo } from '../GameGrid';

interface RecentlyPlayedSectionProps {
  recentlyPlayed: GameInfo[];
  onGameSelect: (gameId: string) => void;
}

export const RecentlyPlayedSection: React.FC<RecentlyPlayedSectionProps> = ({
  recentlyPlayed,
  onGameSelect
}) => {
  if (recentlyPlayed.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
        🕹️ Recently Played
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentlyPlayed.map((game, index) => (
          <Button
            key={`recent-${game.id}-${index}`}
            className="h-auto flex flex-col items-center p-4 bg-white/20 hover:bg-white/30 rounded-lg animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onGameSelect(game.id)}
          >
            <div className="text-2xl mb-1">{game.emoji}</div>
            <div className="text-sm font-medium text-white">{game.title}</div>
            {game.difficulty && (
              <div className="text-xs text-white/70 mt-1">
                {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
