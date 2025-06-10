
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface GameSettingsProps {
  difficulty: 'easy' | 'medium' | 'hard';
  theme: string;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onThemeChange: (theme: string) => void;
  onStartGame: () => void;
  themes: Array<{ value: string; label: string; description: string }>;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  difficulty,
  theme,
  onDifficultyChange,
  onThemeChange,
  onStartGame,
  themes
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border-2 border-white/50 max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-800 text-center text-2xl">🎮 Game Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Choose Difficulty</h3>
          <div className="grid grid-cols-3 gap-4">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <Button
                key={level}
                onClick={() => onDifficultyChange(level)}
                variant={difficulty === level ? "default" : "outline"}
                className={`p-6 h-auto flex flex-col items-center gap-2 ${
                  difficulty === level 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : 'bg-white/70 border-gray-300 text-gray-700 hover:bg-white/90'
                }`}
              >
                <span className="text-2xl">
                  {level === 'easy' ? '🟢' : level === 'medium' ? '🟡' : '🔴'}
                </span>
                <span className="font-bold capitalize">{level}</span>
                <span className="text-sm opacity-80">
                  {level === 'easy' ? '6 pairs' : level === 'medium' ? '8 pairs' : '10 pairs'}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Choose Theme</h3>
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-full bg-white/70 border-gray-300 text-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((themeOption) => (
                <SelectItem key={themeOption.value} value={themeOption.value}>
                  <div className="flex items-center gap-2">
                    <span>{themeOption.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {themeOption.description}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={onStartGame} 
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 text-lg shadow-lg"
        >
          🎮 Start Memory Challenge
        </Button>
      </CardContent>
    </Card>
  );
};
