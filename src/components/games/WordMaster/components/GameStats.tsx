import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface GameStatsProps {
  stats: {
    wordsFound: number;
    totalWords: number;
    score: number;
    timeRemaining: number;
    streak: number;
    level: number;
    lives: number;
    combo: number;
    perfectWords: number;
  };
}

export const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  const progressPercentage = (stats.wordsFound / stats.totalWords) * 100;
  const timePercentage = (stats.timeRemaining / 300) * 100; // Assuming 5 min max

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-6 bg-background/95 backdrop-blur">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.score}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold">{stats.wordsFound}/{stats.totalWords}</div>
            <div className="text-sm text-muted-foreground">Words Found</div>
            <Progress value={progressPercentage} className="mt-1" />
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-semibold ${stats.timeRemaining < 60 ? 'text-destructive' : ''}`}>
              {formatTime(stats.timeRemaining)}
            </div>
            <div className="text-sm text-muted-foreground">Time Left</div>
            <Progress value={timePercentage} className="mt-1" />
          </div>
          
          <div className="text-center">
            <Badge variant={stats.streak > 2 ? 'default' : 'secondary'} className="text-sm">
              🔥 {stats.streak}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">Streak</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold">Level {stats.level}</div>
            <div className="flex justify-center gap-1 mt-1">
              {Array.from({length: 3}, (_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < stats.lives ? 'bg-red-500' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold">
              {stats.combo > 1 && <Badge variant="outline">x{stats.combo}</Badge>}
            </div>
            <div className="text-sm text-muted-foreground">Combo</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};