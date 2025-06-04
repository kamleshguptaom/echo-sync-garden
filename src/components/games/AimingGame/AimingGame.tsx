
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AimingGameProps {
  onBack: () => void;
}

type GameMode = 'classic' | 'moving' | 'shrinking' | 'precision' | 'reaction' | 'random';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'random';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  speed?: { dx: number; dy: number };
  color: string;
  points: number;
  timeLeft?: number;
}

export const AimingGame: React.FC<AimingGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [accuracy, setAccuracy] = useState({ hits: 0, misses: 0 });
  const [showConcept, setShowConcept] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Animation loop for moving targets
  useEffect(() => {
    if (gameStarted && (gameMode === 'moving' || gameMode === 'shrinking')) {
      const animate = () => {
        setTargets(prev => prev.map(target => {
          if (gameMode === 'moving' && target.speed) {
            let newX = target.x + target.speed.dx;
            let newY = target.y + target.speed.dy;
            
            // Bounce off walls
            if (newX <= 0 || newX >= 760) target.speed.dx *= -1;
            if (newY <= 0 || newY >= 360) target.speed.dy *= -1;
            
            return { ...target, x: Math.max(0, Math.min(760, newX)), y: Math.max(0, Math.min(360, newY)) };
          }
          
          if (gameMode === 'shrinking') {
            const newSize = Math.max(10, target.size - 0.5);
            return { ...target, size: newSize };
          }
          
          return target;
        }).filter(target => target.size > 10));
        
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, gameMode]);

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const getRandomGameMode = (): Exclude<GameMode, 'random'> => {
    const modes = ['classic', 'moving', 'shrinking', 'precision', 'reaction'] as const;
    return modes[Math.floor(Math.random() * modes.length)];
  };

  const getRandomDifficulty = (): Exclude<Difficulty, 'random'> => {
    const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const startGame = () => {
    const actualMode = gameMode === 'random' ? getRandomGameMode() : gameMode;
    const actualDifficulty = difficulty === 'random' ? getRandomDifficulty() : difficulty;
    
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setAccuracy({ hits: 0, misses: 0 });
    spawnTarget(actualMode, actualDifficulty);
  };

  const endGame = () => {
    setGameStarted(false);
    setTargets([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const spawnTarget = (mode: Exclude<GameMode, 'random'>, diff: Exclude<Difficulty, 'random'>) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    const sizes = {
      easy: { min: 50, max: 80 },
      medium: { min: 35, max: 60 },
      hard: { min: 25, max: 45 },
      expert: { min: 15, max: 30 }
    };
    
    const targetCount = mode === 'precision' ? 1 : diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4;
    const newTargets: Target[] = [];
    
    for (let i = 0; i < targetCount; i++) {
      const size = Math.random() * (sizes[diff].max - sizes[diff].min) + sizes[diff].min;
      const target: Target = {
        id: Date.now() + i,
        x: Math.random() * (760 - size),
        y: Math.random() * (360 - size),
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        points: Math.round(100 / size * 10)
      };
      
      if (mode === 'moving') {
        target.speed = {
          dx: (Math.random() - 0.5) * 4 * (diff === 'expert' ? 2 : 1),
          dy: (Math.random() - 0.5) * 4 * (diff === 'expert' ? 2 : 1)
        };
      }
      
      if (mode === 'reaction') {
        target.timeLeft = diff === 'easy' ? 3000 : diff === 'medium' ? 2000 : diff === 'hard' ? 1500 : 1000;
      }
      
      newTargets.push(target);
    }
    
    setTargets(newTargets);
    
    // Auto-spawn next targets
    if (mode !== 'reaction') {
      setTimeout(() => {
        if (gameStarted) spawnTarget(mode, diff);
      }, mode === 'precision' ? 3000 : 2000);
    }
  };

  const handleTargetClick = (targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    if (target) {
      setScore(score + target.points);
      setAccuracy(prev => ({ ...prev, hits: prev.hits + 1 }));
      setTargets(prev => prev.filter(t => t.id !== targetId));
      
      // Spawn new target for reaction mode
      if (gameMode === 'reaction') {
        setTimeout(() => {
          if (gameStarted) {
            const actualDifficulty = difficulty === 'random' ? getRandomDifficulty() : difficulty;
            spawnTarget('reaction', actualDifficulty);
          }
        }, 500);
      }
    }
  };

  const handleMiss = () => {
    setAccuracy(prev => ({ ...prev, misses: prev.misses + 1 }));
  };

  const getAccuracyPercent = () => {
    const total = accuracy.hits + accuracy.misses;
    return total > 0 ? Math.round((accuracy.hits / total) * 100) : 0;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Aiming Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Aiming Game Concepts</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Hand-Eye Coordination</h3>
                  <p>Aiming games improve the connection between visual processing and motor skills.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎮 Game Modes</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Classic:</strong> Static targets for steady aim practice</li>
                    <li><strong>Moving:</strong> Targets that move across the screen</li>
                    <li><strong>Shrinking:</strong> Targets that get smaller over time</li>
                    <li><strong>Precision:</strong> Very small targets for accuracy</li>
                    <li><strong>Reaction:</strong> Targets appear and disappear quickly</li>
                  </ul>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <h4 className="font-bold">💡 Tips for Better Aim:</h4>
                    <ul className="list-disc list-inside text-sm">
                      <li>Keep your wrist steady, move with your arm</li>
                      <li>Focus on the target, not your cursor</li>
                      <li>Practice smooth, controlled movements</li>
                      <li>Take breaks to avoid fatigue</li>
                    </ul>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                    <SelectItem value="classic">🎯 Classic</SelectItem>
                    <SelectItem value="moving">🔄 Moving</SelectItem>
                    <SelectItem value="shrinking">📉 Shrinking</SelectItem>
                    <SelectItem value="precision">🔍 Precision</SelectItem>
                    <SelectItem value="reaction">⚡ Reaction</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
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
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                {gameStarted ? 'New Game' : 'Start Game'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameStarted && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Score: {score}</span>
                <span>Time: {timeLeft}s</span>
                <span>Accuracy: {getAccuracyPercent()}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={gameAreaRef}
                className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-gray-300 rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleMiss}
              >
                {targets.map(target => (
                  <div
                    key={target.id}
                    className="absolute rounded-full cursor-pointer transition-all duration-100 hover:scale-110 animate-pulse"
                    style={{
                      left: target.x,
                      top: target.y,
                      width: target.size,
                      height: target.size,
                      backgroundColor: target.color,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTargetClick(target.id);
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                      {target.points}
                    </div>
                  </div>
                ))}
                
                {targets.length === 0 && gameStarted && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl">
                    Get ready for the next target...
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex justify-center gap-4">
                <Button onClick={endGame} variant="outline">
                  End Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!gameStarted && accuracy.hits > 0 && (
          <Card className="bg-white/95">
            <CardContent className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <div className="space-y-2 text-lg">
                <p>Final Score: <span className="font-bold text-blue-600">{score}</span></p>
                <p>Accuracy: <span className="font-bold text-green-600">{getAccuracyPercent()}%</span></p>
                <p>Hits: <span className="font-bold">{accuracy.hits}</span> | Misses: <span className="font-bold">{accuracy.misses}</span></p>
              </div>
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 mt-4">
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
