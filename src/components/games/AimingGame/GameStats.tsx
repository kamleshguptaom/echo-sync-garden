
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GameStatsProps {
  score: number;
  ammo: number;
  timeLeft: number;
  combo: number;
  bestScore: number;
  accuracy: number;
  shotsHit: number;
  totalShots: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  score,
  ammo,
  timeLeft,
  combo,
  bestScore,
  accuracy,
  shotsHit,
  totalShots
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-700">🏆 {score}</div>
          <div className="text-sm text-emerald-600">Score</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">🎯 {ammo}</div>
          <div className="text-sm text-blue-600">Ammo Left</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">⏱️ {timeLeft}s</div>
          <div className="text-sm text-orange-600">Time Left</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">🔥 x{combo}</div>
          <div className="text-sm text-purple-600">Combo</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">⭐ {bestScore}</div>
          <div className="text-sm text-yellow-600">Best Score</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-teal-100 to-teal-200 border-teal-300">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-teal-700">📊 {accuracy}%</div>
          <div className="text-sm text-teal-600">Accuracy</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-300">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-indigo-700">✅ {shotsHit}</div>
          <div className="text-sm text-indigo-600">Hits</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-pink-700">🎲 {totalShots}</div>
          <div className="text-sm text-pink-600">Total Shots</div>
        </CardContent>
      </Card>
    </div>
  );
};
