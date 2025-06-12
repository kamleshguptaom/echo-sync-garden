
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GameMode, Difficulty, WeaponType, TargetType } from './types';

interface GameSettingsProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  weapon: WeaponType;
  setWeapon: (weapon: WeaponType) => void;
  targetType: TargetType;
  setTargetType: (type: TargetType) => void;
  background: string;
  setBackground: (bg: string) => void;
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  weapon,
  setWeapon,
  targetType,
  setTargetType,
  background,
  setBackground,
  onStartGame
}) => {
  const backgrounds = [
    { value: 'forest', label: '🌲 Forest', gradient: 'from-green-400 to-green-600' },
    { value: 'mountain', label: '🏔️ Mountain', gradient: 'from-blue-400 to-gray-600' },
    { value: 'desert', label: '🏜️ Desert', gradient: 'from-yellow-400 to-orange-600' },
    { value: 'ocean', label: '🌊 Ocean', gradient: 'from-blue-300 to-blue-600' },
    { value: 'sunset', label: '🌅 Sunset', gradient: 'from-orange-400 to-pink-600' }
  ];

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-teal-700">🎯 Archery Range Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-teal-700">Game Mode</label>
            <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
              <SelectTrigger className="border-teal-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="training">🎯 Training</SelectItem>
                <SelectItem value="challenge">⚡ Challenge</SelectItem>
                <SelectItem value="tournament">🏆 Tournament</SelectItem>
                <SelectItem value="survival">💀 Survival</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-teal-700">Difficulty</label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
              <SelectTrigger className="border-teal-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">🟢 Beginner</SelectItem>
                <SelectItem value="medium">🟡 Intermediate</SelectItem>
                <SelectItem value="hard">🟠 Advanced</SelectItem>
                <SelectItem value="expert">🔴 Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-teal-700">Weapon</label>
            <Select value={weapon} onValueChange={(value) => setWeapon(value as WeaponType)}>
              <SelectTrigger className="border-teal-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bow">🏹 Bow & Arrow</SelectItem>
                <SelectItem value="gun">🔫 Precision Gun</SelectItem>
                <SelectItem value="dart">🎯 Dart Thrower</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-teal-700">Target Type</label>
            <Select value={targetType} onValueChange={(value) => setTargetType(value as TargetType)}>
              <SelectTrigger className="border-teal-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balloons">🎈 Flying Balloons</SelectItem>
                <SelectItem value="birds">🐦 Flying Birds</SelectItem>
                <SelectItem value="fruits">🍎 Falling Fruits</SelectItem>
                <SelectItem value="metal">🎯 Metal Targets</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-teal-700">Background Scene</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.value}
                onClick={() => setBackground(bg.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  background === bg.value 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <div className={`w-full h-8 rounded bg-gradient-to-r ${bg.gradient} mb-2`}></div>
                <span className="text-sm font-medium">{bg.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center pt-4">
          <Button 
            onClick={onStartGame} 
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎯 Start Shooting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
