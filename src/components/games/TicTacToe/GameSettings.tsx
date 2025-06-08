
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface GameSettingsProps {
  gameMode: 'human-vs-human' | 'human-vs-ai';
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible';
  settings: any;
  onGameModeChange: (mode: 'human-vs-human' | 'human-vs-ai') => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard' | 'impossible') => void;
  onSettingsChange: (settings: any) => void;
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  gameMode,
  difficulty,
  settings,
  onGameModeChange,
  onDifficultyChange,
  onSettingsChange,
  onStartGame
}) => {
  const symbolOptions = [
    { X: 'X', O: 'O' },
    { X: '❌', O: '⭕' },
    { X: '🔥', O: '💧' },
    { X: '⚡', O: '🌟' },
    { X: '🎯', O: '🎪' },
    { X: '🚀', O: '🛸' },
    { X: '👑', O: '💎' },
    { X: '🎮', O: '🎲' }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-center">🎮 Game Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1">Game Mode</Label>
              <Select value={gameMode} onValueChange={onGameModeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human-vs-human">👥 Human vs Human</SelectItem>
                  <SelectItem value="human-vs-ai">🤖 Human vs AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {gameMode === 'human-vs-ai' && (
              <div>
                <Label className="text-sm font-medium mb-1">AI Difficulty</Label>
                <Select value={difficulty} onValueChange={onDifficultyChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">😊 Easy</SelectItem>
                    <SelectItem value="medium">😐 Medium</SelectItem>
                    <SelectItem value="hard">😤 Hard</SelectItem>
                    <SelectItem value="impossible">😈 Impossible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <Button onClick={onStartGame} className="w-full bg-purple-500 hover:bg-purple-600">
            Start Game
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-center">🎨 Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2">Player Symbols</Label>
            <Select 
              value={JSON.stringify(settings.playerSymbols)} 
              onValueChange={(value) => onSettingsChange({...settings, playerSymbols: JSON.parse(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {symbolOptions.map((symbols, index) => (
                  <SelectItem key={index} value={JSON.stringify(symbols)}>
                    {symbols.X} vs {symbols.O}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Board Theme</Label>
            <Select value={settings.boardTheme} onValueChange={(value) => onSettingsChange({...settings, boardTheme: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">🎯 Classic</SelectItem>
                <SelectItem value="neon">🌟 Neon</SelectItem>
                <SelectItem value="wood">🌳 Wood</SelectItem>
                <SelectItem value="glass">💎 Glass</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Board Size: {settings.boardSize}px</Label>
            <Slider
              value={[settings.boardSize]}
              onValueChange={(value) => onSettingsChange({...settings, boardSize: value[0]})}
              max={400}
              min={200}
              step={25}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Animation Speed</Label>
            <Select value={settings.animationSpeed} onValueChange={(value) => onSettingsChange({...settings, animationSpeed: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">🐌 Slow</SelectItem>
                <SelectItem value="normal">⚡ Normal</SelectItem>
                <SelectItem value="fast">🚀 Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Show Hints</Label>
            <Switch
              checked={settings.showHints}
              onCheckedChange={(checked) => onSettingsChange({...settings, showHints: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Sound Effects</Label>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => onSettingsChange({...settings, soundEnabled: checked})}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
