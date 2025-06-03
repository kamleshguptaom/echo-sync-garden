
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AimingGameProps {
  onBack: () => void;
}

type GameMode = 'targets' | 'balloons' | 'fruits';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  points: number;
  emoji: string;
}

export const AimingGame: React.FC<AimingGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('targets');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [hits, setHits] = useState(0);
  const [shots, setShots] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const getGameSettings = () => {
    const modeSettings = {
      targets: { emoji: '🎯', baseSize: 60, colors: ['#ff4444', '#44ff44', '#4444ff'] },
      balloons: { emoji: '🎈', baseSize: 50, colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'] },
      fruits: { emoji: '🍎', baseSize: 45, colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'] }
    };
    
    const difficultySettings = {
      easy: { targetCount: 3, speed: 2000, sizeVariation: 0.3 },
      medium: { targetCount: 5, speed: 1500, sizeVariation: 0.5 },
      hard: { targetCount: 7, speed: 1000, sizeVariation: 0.7 }
    };
    
    return { mode: modeSettings[gameMode], difficulty: difficultySettings[difficulty] };
  };

  const generateTarget = (): Target => {
    const settings = getGameSettings();
    const gameArea = gameAreaRef.current;
    if (!gameArea) return { id: 0, x: 0, y: 0, size: 50, color: '#ff0000', points: 10, emoji: '🎯' };
    
    const rect = gameArea.getBoundingClientRect();
    const sizeVariation = 1 + (Math.random() - 0.5) * settings.difficulty.sizeVariation;
    const size = settings.mode.baseSize * sizeVariation;
    
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (rect.width - size),
      y: Math.random() * (rect.height - size),
      size,
      color: settings.mode.colors[Math.floor(Math.random() * settings.mode.colors.length)],
      points: Math.max(10, Math.floor(100 / sizeVariation)),
      emoji: settings.mode.emoji
    };
  };

  const spawnTargets = () => {
    const settings = getGameSettings();
    const newTargets: Target[] = [];
    
    for (let i = 0; i < settings.difficulty.targetCount; i++) {
      newTargets.push(generateTarget());
    }
    
    setTargets(newTargets);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setHits(0);
    setShots(0);
    setTimeLeft(30);
    spawnTargets();
  };

  const handleTargetClick = (targetId: number) => {
    setTargets(prevTargets => {
      const target = prevTargets.find(t => t.id === targetId);
      if (target) {
        setScore(prevScore => prevScore + target.points);
        setHits(prevHits => prevHits + 1);
      }
      return prevTargets.filter(t => t.id !== targetId);
    });
    setShots(prevShots => prevShots + 1);
  };

  const handleMiss = () => {
    setShots(prevShots => prevShots + 1);
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (gameActive) {
      const settings = getGameSettings();
      const interval = setInterval(() => {
        setTargets(prevTargets => {
          const filtered = prevTargets.filter(() => Math.random() > 0.3);
          const newCount = settings.difficulty.targetCount - filtered.length;
          const newTargets = [];
          
          for (let i = 0; i < newCount; i++) {
            newTargets.push(generateTarget());
          }
          
          return [...filtered, ...newTargets];
        });
      }, settings.difficulty.speed);
      
      return () => clearInterval(interval);
    }
  }, [gameActive, gameMode, difficulty]);

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Aiming Game</h1>
          <div className="w-20"></div>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center">
              <div>
                <label className="block text-sm font-medium mb-1">Game Mode</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="targets">🎯 Targets</SelectItem>
                    <SelectItem value="balloons">🎈 Balloons</SelectItem>
                    <SelectItem value="fruits">🍎 Fruits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center flex justify-between items-center">
              <span>Score: {score}</span>
              <span>Accuracy: {accuracy}%</span>
              <span>Time: {timeLeft}s</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!gameActive && targets.length === 0 ? (
              <div className="text-center space-y-4">
                <p className="text-lg">Click the targets as fast as you can!</p>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-xl px-8 py-3">
                  Start Game
                </Button>
              </div>
            ) : !gameActive ? (
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-blue-600">Game Over!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Accuracy: {accuracy}% ({hits}/{shots})</p>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  Play Again
                </Button>
              </div>
            ) : (
              <div 
                ref={gameAreaRef}
                className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden cursor-crosshair"
                style={{ height: '400px' }}
                onClick={handleMiss}
              >
                {targets.map((target) => (
                  <div
                    key={target.id}
                    className="absolute transition-all duration-200 hover:scale-110 cursor-pointer animate-pulse"
                    style={{
                      left: target.x,
                      top: target.y,
                      width: target.size,
                      height: target.size,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTargetClick(target.id);
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white"
                      style={{ backgroundColor: target.color }}
                    >
                      {target.emoji}
                    </div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
                      {target.points}
                    </div>
                  </div>
                ))}
                
                {targets.length === 0 && gameActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl text-gray-500">
                    Loading targets...
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
