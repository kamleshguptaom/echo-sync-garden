import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GameModeSelectorProps {
  selectedMode: string;
  onModeSelect: (mode: string) => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  selectedMode,
  onModeSelect
}) => {
  const modes = [
    { id: 'word-search', name: 'Word Search', icon: '🔍', description: 'Find hidden words in the grid' },
    { id: 'crossword', name: 'Crossword', icon: '📝', description: 'Solve crossword puzzles with clues' },
    { id: 'scramble', name: 'Word Scramble', icon: '🔤', description: 'Unscramble jumbled letters' },
    { id: 'smart-grid', name: 'Smart Grid', icon: '🎯', description: 'Strategic word placement game' },
    { id: 'trail', name: 'Word Trail', icon: '🛤️', description: 'Connect letters to form words' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {modes.map(mode => (
        <Card
          key={mode.id}
          className={`cursor-pointer transition-all hover:scale-105 ${
            selectedMode === mode.id 
              ? 'ring-2 ring-primary bg-primary/10' 
              : 'hover:bg-muted/50'
          }`}
          onClick={() => onModeSelect(mode.id)}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">{mode.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{mode.name}</h3>
            <p className="text-xs text-muted-foreground">{mode.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};