
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { GameSettings } from './GameSettings';
import { generateTargets, updateTargets } from './TargetGenerator';
import { GameMode, Difficulty, WeaponType, TargetType, Target, Shot, WindEffect } from './types';

interface AimingGameProps {
  onBack: () => void;
}

export const AimingGame: React.FC<AimingGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('training');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [weapon, setWeapon] = useState<WeaponType>('bow');
  const [targetType, setTargetType] = useState<TargetType>('balloons');
  const [background, setBackground] = useState('forest');
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [score, setScore] = useState(0);
  const [ammo, setAmmo] = useState(20);
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
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const powerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const backgrounds = {
    forest: 'from-green-400 via-green-500 to-green-600',
    mountain: 'from-blue-400 via-gray-500 to-gray-600',
    desert: 'from-yellow-400 via-orange-500 to-orange-600',
    ocean: 'from-blue-300 via-blue-500 to-blue-600',
    sunset: 'from-orange-400 via-pink-500 to-pink-600'
  };

  const weaponEmojis = {
    bow: '🏹',
    gun: '🔫',
    dart: '🎯'
  };

  // Game loop for moving targets
  const gameLoop = useCallback(() => {
    if (!gameStarted || gameFinished) return;

    setTargets(prevTargets => {
      const gameArea = { width: 600, height: 400 };
      let updatedTargets = updateTargets(prevTargets, gameArea);
      
      // Generate new targets if needed
      if (updatedTargets.length === 0) {
        updatedTargets = generateTargets(targetType, difficulty, gameArea);
      }
      
      return updatedTargets;
    });
  }, [gameStarted, gameFinished, targetType, difficulty]);

  useEffect(() => {
    if (gameStarted && !gameFinished) {
      gameLoopRef.current = setInterval(gameLoop, 50);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameStarted, gameFinished]);

  const generateWindEffect = () => {
    const windStrength = difficulty === 'easy' ? 0 : difficulty === 'medium' ? 0.3 : difficulty === 'hard' ? 0.5 : 0.8;
    setWindEffect({
      direction: Math.random() * 360,
      strength: Math.random() * windStrength
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setGameFinished(false);
    setScore(0);
    setShots([]);
    setAmmo(20);
    setTimeLeft(90);
    setCombo(0);
    generateWindEffect();
    
    const gameArea = { width: 600, height: 400 };
    setTargets(generateTargets(targetType, difficulty, gameArea));
    
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
    if (!isAiming || isPowerBuilding || ammo <= 0) return;
    
    setIsPowerBuilding(true);
    setPower(0);
    
    powerIntervalRef.current = setInterval(() => {
      setPower(prev => {
        if (prev >= 100) {
          stopPowerBuilding();
          return 100;
        }
        return prev + 3;
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
    if (!isAiming || ammo <= 0 || isPowerBuilding) return;
    
    stopPowerBuilding();
    
    // Apply wind effect
    const windOffsetX = Math.cos(windEffect.direction * Math.PI / 180) * windEffect.strength * 30;
    const windOffsetY = Math.sin(windEffect.direction * Math.PI / 180) * windEffect.strength * 30;
    
    const finalX = aimPosition.x + windOffsetX;
    const finalY = aimPosition.y + windOffsetY;
    
    let hitTarget = false;
    let points = 0;
    
    // Check for target hits
    setTargets(prevTargets => 
      prevTargets.map(target => {
        if (target.hit) return target;
        
        const distance = Math.sqrt(
          Math.pow(finalX - (target.x + target.size / 2), 2) + 
          Math.pow(finalY - (target.y + target.size / 2), 2)
        );
        
        if (distance <= target.size / 2) {
          hitTarget = true;
          points = target.points;
          setCombo(prev => prev + 1);
          return { ...target, hit: true };
        }
        
        return target;
      })
    );
    
    if (!hitTarget) {
      setCombo(0);
    }
    
    // Combo bonus
    points += Math.floor(combo / 3);
    
    setScore(prev => prev + points);
    setAmmo(prev => prev - 1);
    
    const newShot: Shot = {
      x: finalX,
      y: finalY,
      accuracy: hitTarget ? 100 : 0,
      points,
      weapon
    };
    
    setShots(prev => [...prev, newShot]);
    setIsAiming(false);
    setPower(0);
    
    // Generate new wind for next shot
    generateWindEffect();
    
    // Check for game end
    if (ammo <= 1) {
      setTimeout(() => {
        setGameFinished(true);
        if (score > bestScore) {
          setBestScore(score);
        }
      }, 1000);
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
        .crosshair {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid #ff0000;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .crosshair::before,
        .crosshair::after {
          content: '';
          position: absolute;
          background: #ff0000;
        }
        .crosshair::before {
          width: 2px;
          height: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
        .crosshair::after {
          height: 2px;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
        }
        .target-moving {
          animation: targetFloat 2s ease-in-out infinite;
        }
        @keyframes targetFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .shot-mark {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: shotFade 3s ease-out forwards;
        }
        @keyframes shotFade {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.3; transform: scale(0.5); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={goBack} variant="outline" className="bg-white/90 hover:bg-white">
            ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
          </Button>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🎯 2D Archery Master</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90 hover:bg-white text-teal-600">
                🎯 How to Play
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Master 2D Precision Shooting</DialogTitle>
                <DialogDescription>Hit moving targets with various weapons</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">🎯 Game Objective</h3>
                  <p>Hit moving targets to score points. Different targets have different point values and movement patterns.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">🎮 Controls</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Mouse:</strong> Move to aim at targets</li>
                    <li><strong>Click & Hold:</strong> Build power</li>
                    <li><strong>Release:</strong> Shoot</li>
                    <li><strong>Wind:</strong> Affects projectile trajectory</li>
                  </ul>
                </div>
                <div className="bg-emerald-100 p-4 rounded-lg">
                  <h4 className="font-bold">🏆 Targets:</h4>
                  <p>• 🎈 Balloons: Float upward<br/>
                     • 🐦 Birds: Fly horizontally<br/>
                     • 🍎 Fruits: Fall from trees<br/>
                     • 🎯 Metal: Stationary targets</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <GameSettings
            gameMode={gameMode}
            setGameMode={setGameMode}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            weapon={weapon}
            setWeapon={setWeapon}
            targetType={targetType}
            setTargetType={setTargetType}
            background={background}
            setBackground={setBackground}
            onStartGame={startGame}
          />
        ) : (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center text-teal-700">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  Score: {score}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{weaponEmojis[weapon]}</span>
                  Ammo: {ammo}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  Time: {timeLeft}s
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  Combo: {combo}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={gameAreaRef}
                className={`relative w-full h-96 rounded-xl border-4 border-teal-300 overflow-hidden cursor-crosshair bg-gradient-to-b ${backgrounds[background as keyof typeof backgrounds]}`}
                onMouseMove={handleMouseMove}
                onClick={() => setIsAiming(true)}
                onMouseDown={startPowerBuilding}
                onMouseUp={handleShoot}
                style={{ cursor: isAiming ? 'none' : 'crosshair' }}
              >
                {/* Wind Indicator */}
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg text-center">
                  <div className="text-xl">{getWindIndicator()}</div>
                  <div className="text-xs">Wind: {Math.round(windEffect.strength * 100)}%</div>
                </div>

                {/* Combo Display */}
                {combo > 0 && (
                  <div className="absolute top-4 left-4 bg-yellow-400/90 p-2 rounded-lg font-bold animate-pulse">
                    🔥 Combo x{combo}
                  </div>
                )}
                
                {/* Targets */}
                {targets.map((target) => (
                  <div
                    key={target.id}
                    className="absolute transition-all duration-100"
                    style={{
                      left: target.x,
                      top: target.y,
                      width: target.size,
                      height: target.size,
                      fontSize: target.size * 0.8
                    }}
                  >
                    {target.emoji}
                  </div>
                ))}
                
                {/* Shot marks */}
                {shots.map((shot, index) => (
                  <div
                    key={index}
                    className="shot-mark"
                    style={{ 
                      left: shot.x - 4, 
                      top: shot.y - 4,
                      backgroundColor: shot.points > 0 ? '#10b981' : '#ef4444'
                    }}
                  />
                ))}
                
                {/* Crosshair */}
                {isAiming && (
                  <div 
                    className="crosshair"
                    style={{ left: aimPosition.x, top: aimPosition.y }}
                  />
                )}
                
                {/* Power meter */}
                {isPowerBuilding && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-6 bg-black/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 transition-all duration-100"
                      style={{ width: `${power}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                      Power: {Math.round(power)}%
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => setIsAiming(!isAiming)}
                    disabled={ammo <= 0}
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
                      <h2 className="text-4xl font-bold mb-4 text-teal-600">🎯 Shooting Complete!</h2>
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
