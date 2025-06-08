
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface GameStats {
  gameId: string;
  gameName: string;
  totalPlays: number;
  averageScore: number;
  completionRate: number;
  averageTime: number;
  difficulty: string;
  emoji: string;
}

export const GameAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');
  
  const gameStats: GameStats[] = [
    { gameId: 'tictactoe', gameName: 'Tic Tac Toe', totalPlays: 245, averageScore: 85, completionRate: 92, averageTime: 120, difficulty: 'Easy', emoji: '⭕' },
    { gameId: 'memory', gameName: 'Memory Game', totalPlays: 189, averageScore: 78, completionRate: 85, averageTime: 180, difficulty: 'Medium', emoji: '🧠' },
    { gameId: 'math', gameName: 'Math Challenge', totalPlays: 156, averageScore: 72, completionRate: 76, averageTime: 240, difficulty: 'Hard', emoji: '🔢' },
    { gameId: 'word', gameName: 'Word Puzzle', totalPlays: 134, averageScore: 69, completionRate: 82, averageTime: 200, difficulty: 'Medium', emoji: '📝' },
  ];

  const totalStats = {
    totalPlayers: 1247,
    totalGames: gameStats.reduce((sum, game) => sum + game.totalPlays, 0),
    averageEngagement: 8.4,
    retentionRate: 73
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white">{totalStats.totalPlayers.toLocaleString()}</div>
            <div className="text-white/80 text-sm">Total Players</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🎮</div>
            <div className="text-2xl font-bold text-white">{totalStats.totalGames.toLocaleString()}</div>
            <div className="text-white/80 text-sm">Games Played</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-white">{totalStats.averageEngagement}/10</div>
            <div className="text-white/80 text-sm">Avg Engagement</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🔄</div>
            <div className="text-2xl font-bold text-white">{totalStats.retentionRate}%</div>
            <div className="text-white/80 text-sm">Retention Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            📊 Game Performance Analytics
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {gameStats.map((game) => (
              <div key={game.gameId} className="bg-white/20 p-4 rounded-lg border border-white/30">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{game.emoji}</span>
                    <div>
                      <h3 className="text-white font-semibold">{game.gameName}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge className={`${
                          game.difficulty === 'Easy' ? 'bg-green-500' :
                          game.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white text-xs`}>
                          {game.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                          {game.totalPlays} plays
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">{game.averageScore}%</div>
                    <div className="text-white/70 text-xs">Avg Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 p-2 rounded">
                    <div className="text-white font-semibold">{game.completionRate}%</div>
                    <div className="text-white/70 text-xs">Completion</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded">
                    <div className="text-white font-semibold">{Math.floor(game.averageTime / 60)}:{(game.averageTime % 60).toString().padStart(2, '0')}</div>
                    <div className="text-white/70 text-xs">Avg Time</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded">
                    <div className="text-white font-semibold">{game.totalPlays}</div>
                    <div className="text-white/70 text-xs">Total Plays</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
