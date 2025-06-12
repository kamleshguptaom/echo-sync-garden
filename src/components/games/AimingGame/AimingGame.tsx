
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface AimingGameProps {
  onBack: () => void;
}

type GameMode = 'training' | 'challenge' | 'tournament';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface Target {
  x: number;
  y: number;
  size: number;
  points: number;
  hit: boolean;
  id: number;
  ringValues: number[];
  color: string;
}

interface Shot {
  x: number;
  y: number;
  accuracy: number;
  points: number;
}

interface WindEffect {
  direction: number;
  strength: number;
}

export const AimingGame: React.FC<AimingGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('training');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [score, setScore] = useState(0);
  const [arrows, setArrows] = useState(12);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [aimPosition, setAimPosition] = useState({ x: 200, y: 350 });
  const [power, setPower] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [isPowerBuilding, setIsPowerBuilding] = useState(false);
  const [windEffect, setWindEffect] = useState<WindEffect>({ direction: 0, strength: 0 });
  const [combo, setCombo] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(3);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const powerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const difficultySettings = {
    easy: { targetSize: 80, targetDistance: 200, windStrength: 0, timeLimit: 120 },
    medium: { targetSize: 60, targetDistance: 300, windStrength: 0.3, timeLimit: 90 },
    hard: { targetSize: 40, targetDistance: 400, windStrength: 0.5, timeLimit: 60 },
    expert: { targetSize: 30, targetDistance: 500, windStrength: 0.8, timeLimit: 45 }
  };

  const generateTarget = () => {
    const settings = difficultySettings[difficulty];
    const centerX = 200;
    const centerY = 150;
    
    const target: Target = {
      id: Date.now(),
      x: centerX - settings.targetSize / 2,
      y: centerY - settings.targetSize / 2,
      size: settings.targetSize,
      points: 0,
      hit: false,
      ringValues: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      color: 'red'
    };
    
    setTargets([target]);
  };

  const generateWindEffect = () => {
    const settings = difficultySettings[difficulty];
    setWindEffect({
      direction: Math.random() * 360,
      strength: Math.random() * settings.windStrength
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setGameFinished(false);
    setScore(0);
    setShots([]);
    setArrows(12);
    setTimeLeft(difficultySettings[difficulty].timeLimit);
    setRound(1);
    setCombo(0);
    generateTarget();
    generateWindEffect();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameFinished(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !isAiming) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setAimPosition({ x: mouseX, y: mouseY });
  };

  const startPowerBuilding = () => {
    if (!isAiming || isPowerBuilding) return;
    
    setIsPowerBuilding(true);
    setPower(0);
    
    powerIntervalRef.current = setInterval(() => {
      setPower(prev => {
        if (prev >= 100) {
          stopPowerBuilding();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const stopPowerBuilding = () => {
    if (powerIntervalRef.current) {
      clearInterval(powerIntervalRef.current);
      powerIntervalRef.current = null;
    }
    setIsPowerBuilding(false);
  };

  const handleShoot = () => {
    if (!isAiming || arrows <= 0 || isPowerBuilding) return;
    
    stopPowerBuilding();
    
    const target = targets[0];
    if (!target) return;
    
    // Calculate distance from center of target
    const targetCenterX = target.x + target.size / 2;
    const targetCenterY = target.y + target.size / 2;
    
    // Apply wind effect
    const windOffsetX = Math.cos(windEffect.direction * Math.PI / 180) * windEffect.strength * 30;
    const windOffsetY = Math.sin(windEffect.direction * Math.PI / 180) * windEffect.strength * 30;
    
    const finalX = aimPosition.x + windOffsetX;
    const finalY = aimPosition.y + windOffsetY;
    
    const distance = Math.sqrt(
      Math.pow(finalX - targetCenterX, 2) + 
      Math.pow(finalY - targetCenterY, 2)
    );
    
    let points = 0;
    const ringSize = target.size / 10;
    
    if (distance <= target.size / 2) {
      // Hit the target - calculate ring score
      const ring = Math.floor(distance / ringSize);
      points = Math.max(1, 10 - ring);
      
      // Bonus for perfect shots
      if (distance <= ringSize) {
        points = 10;
        setCombo(prev => prev + 1);
      } else {
        setCombo(0);
      }
      
      // Combo bonus
      points += Math.floor(combo / 3);
    } else {
      setCombo(0);
    }
    
    setScore(prev => prev + points);
    setArrows(prev => prev - 1);
    
    const newShot: Shot = {
      x: finalX,
      y: finalY,
      accuracy: distance <= target.size / 2 ? 100 - (distance / (target.size / 2)) * 100 : 0,
      points
    };
    
    setShots(prev => [...prev, newShot]);
    setIsAiming(false);
    setPower(0);
    
    // Generate new wind for next shot
    generateWindEffect();
    
    // Check for round/game end
    if (arrows <= 1) {
      if (round < totalRounds) {
        setTimeout(() => {
          setRound(prev => prev + 1);
          setArrows(12);
          generateTarget();
        }, 2000);
      } else {
        setTimeout(() => {
          setGameFinished(true);
          if (score > bestScore) {
            setBestScore(score);
          }
        }, 2000);
      }
    }
  };

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
      setGameFinished(false);
    } else {
      onBack();
    }
  };

  const getWindIndicator = () => {
    const windIcons = ['➡️', '↗️', '⬆️', '↖️', '⬅️', '↙️', '⬇️', '↘️'];
    const directionIndex = Math.floor(windEffect.direction / 45) % 8;
    return windIcons[directionIndex];
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-500">
      <style>{`
        .archery-target {
          position: relative;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .target-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid #333;
        }
        .arrow-trail {
          position: absolute;
          width: 4px;
          height: 20px;
          background: #8B4513;
          border-radius: 2px;
          transform: rotate(45deg);
          animation: arrowFade 3s ease-out forwards;
        }
        .arrow-trail::before {
          content: '';
          position: absolute;
          top: -6px;
          left: -2px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 8px solid #654321;
        }
        @keyframes arrowFade {
          0% { opacity: 1; transform: rotate(45deg) scale(1); }
          100% { opacity: 0.3; transform: rotate(45deg) scale(0.8); }
        }
        .aim-sight {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 2px solid #ff0000;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .aim-sight::before,
        .aim-sight::after {
          content: '';
          position: absolute;
          background: #ff0000;
        }
        .aim-sight::before {
          width: 2px;
          height: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
        .aim-sight::after {
          height: 2px;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
        }
        .wind-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.9);
          padding: 10px;
          border-radius: 10px;
          text-align: center;
        }
        .power-meter {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 20px;
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          overflow: hidden;
        }
        .combo-display {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255,215,0,0.9);
          padding: 10px;
          border-radius: 10px;
          font-weight: bold;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={goBack} variant="outline" className="bg-white/90 hover:bg-white">
            ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
          </Button>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🏹 Archery Master</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90 hover:bg-white text-teal-600">
                🎯 How to Play
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Master the Art of Archery</DialogTitle>
                <DialogDescription>Professional archery training and competition</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">🎯 Game Objective</h3>
                  <p>Score points by hitting the target center. Perfect shots score 10 points, outer rings score less.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">🎮 Controls</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Mouse:</strong> Move to aim</li>
                    <li><strong>Space/Click:</strong> Hold to build power, release to shoot</li>
                    <li><strong>Wind:</strong> Affects arrow trajectory</li>
                  </ul>
                </div>
                <div className="bg-emerald-100 p-4 rounded-lg">
                  <h4 className="font-bold">🏆 Scoring:</h4>
                  <p>• Bullseye (center): 10 points<br/>
                     • Inner rings: 9-6 points<br/>
                     • Outer rings: 5-1 points<br/>
                     • Perfect shot combos give bonus points</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-teal-700">Archery Range Settings</CardTitle>
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
                      <SelectItem value="training">🎯 Training Mode</SelectItem>
                      <SelectItem value="challenge">⚡ Challenge Mode</SelectItem>
                      <SelectItem value="tournament">🏆 Tournament</SelectItem>
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
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  onClick={startGame} 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🎯 Enter Shooting Range
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center text-teal-700">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  Score: {score}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Round: {round}/{totalRounds}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🏹</span>
                  Arrows: {arrows}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  Time: {timeLeft}s
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={gameAreaRef}
                className="relative bg-gradient-to-b from-sky-200 via-green-200 to-green-400 w-full h-96 rounded-xl border-4 border-teal-300 overflow-hidden cursor-crosshair"
                onMouseMove={handleMouseMove}
                onClick={() => setIsAiming(true)}
                onMouseDown={startPowerBuilding}
                onMouseUp={handleShoot}
                style={{ cursor: isAiming ? 'none' : 'crosshair' }}
              >
                {/* Wind Indicator */}
                <div className="wind-indicator animate-pulse">
                  <div className="text-2xl">{getWindIndicator()}</div>
                  <div className="text-xs">Wind: {Math.round(windEffect.strength * 100)}%</div>
                </div>

                {/* Combo Display */}
                {combo > 0 && (
                  <div className="combo-display animate-bounce">
                    🔥 Combo x{combo}
                  </div>
                )}
                
                {/* Target */}
                {targets.map((target) => (
                  <div
                    key={target.id}
                    className="archery-target"
                    style={{
                      left: target.x,
                      top: target.y,
                      width: target.size,
                      height: target.size,
                      background: 'radial-gradient(circle, #ff0000 10%, #ffffff 10% 20%, #000000 20% 30%, #ffffff 30% 40%, #ff0000 40% 50%, #ffffff 50% 60%, #000000 60% 70%, #ffffff 70% 80%, #ff0000 80% 90%, #ffffff 90%)'
                    }}
                  >
                    {/* Target rings with point values */}
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="target-ring"
                        style={{
                          width: `${20 + i * 16}%`,
                          height: `${20 + i * 16}%`,
                          background: i % 2 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                        }}
                      />
                    ))}
                    <div className="text-white font-bold text-lg z-10">10</div>
                  </div>
                ))}
                
                {/* Arrow shots */}
                {shots.map((shot, index) => (
                  <div
                    key={index}
                    className="arrow-trail"
                    style={{ left: shot.x - 2, top: shot.y - 10 }}
                  />
                ))}
                
                {/* Aim sight */}
                {isAiming && (
                  <div 
                    className="aim-sight animate-pulse"
                    style={{ left: aimPosition.x, top: aimPosition.y }}
                  />
                )}
                
                {/* Power meter */}
                {isPowerBuilding && (
                  <div className="power-meter">
                    <Progress value={power} className="h-full" />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      Power: {Math.round(power)}%
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => setIsAiming(!isAiming)}
                    className={`px-6 py-2 rounded-full transition-all duration-200 ${
                      isAiming ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
                    } text-white`}
                  >
                    {isAiming ? '❌ Cancel Aim' : '🎯 Start Aiming'}
                  </Button>
                </div>
                
                <div className="text-sm text-teal-600">
                  {isAiming ? 'Move mouse to aim, hold click to build power, release to shoot!' : 'Click "Start Aiming" to begin shooting'}
                </div>
              </div>
              
              {gameFinished && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-xl">
                  <Card className="bg-white p-8 text-center transform animate-scale-in">
                    <CardContent>
                      <h2 className="text-4xl font-bold mb-4 text-teal-600">🏆 Tournament Complete!</h2>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-teal-100 p-4 rounded-lg">
                          <div className="text-lg font-bold text-teal-700">Final Score</div>
                          <div className="text-3xl font-bold text-teal-800">{score}</div>
                        </div>
                        <div className="bg-emerald-100 p-4 rounded-lg">
                          <div className="text-lg font-bold text-emerald-700">Best Combo</div>
                          <div className="text-3xl font-bold text-emerald-800">{combo}</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => { setGameStarted(false); setGameFinished(false); }} 
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3 rounded-full"
                      >
                        🎯 Practice Again
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
