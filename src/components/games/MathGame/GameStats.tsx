
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface GameStatsProps {
  timeLeft: number;
  score: number;
  streak: number;
  questionCount: number;
  totalTime: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ 
  timeLeft, 
  score, 
  streak, 
  questionCount, 
  totalTime 
}) => {
  return (
    <>
      <div className="flex justify-center gap-4 flex-wrap">
        <Badge className="bg-white/30 text-gray-800 border-white/50 px-4 py-2 text-lg font-bold">
          ⏱️ {timeLeft}s
        </Badge>
        <Badge className="bg-white/30 text-gray-800 border-white/50 px-4 py-2 text-lg font-bold">
          📊 Score: {score}
        </Badge>
        <Badge className="bg-white/30 text-gray-800 border-white/50 px-4 py-2 text-lg font-bold">
          🔥 Streak: {streak}
        </Badge>
        <Badge className="bg-white/30 text-gray-800 border-white/50 px-4 py-2 text-lg font-bold">
          📝 {questionCount}
        </Badge>
      </div>
      <Progress 
        value={(timeLeft / totalTime) * 100} 
        className="w-full max-w-md mx-auto bg-white/30" 
      />
    </>
  );
};
