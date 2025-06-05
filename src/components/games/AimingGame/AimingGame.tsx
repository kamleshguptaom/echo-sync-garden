import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface AimingGameProps {
  onBack: () => void;
}

type GameMode = 'archery' | 'shooting' | 'moving' | 'flying' | 'fruit' | 'tournament';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type Environment = 'forest' | 'mountains' | 'beach' | 'city' | 'desert' | 'arctic';
type Weather = 'clear' | 'windy' | 'rainy' | 'snowy' | 'stormy';
type WeaponType = 'recurve_bow' | 'compound_bow' | 'crossbow' | 'rifle' | 'pistol';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  speed?: { dx: number; dy: number };
  color: string;
  points: number;
  timeLeft?: number;
  type: 'bullseye' | 'fruit' | 'bird' | 'clay' | 'bottle';
  emoji?: string;
  distance: number;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  trail: { x: number; y: number }[];
}

interface WeatherEffect {
  windX: number;
  windY: number;
  visibility: number;
  gravity: number;
}

interface EnvironmentSettings {
  backgroundColor: string;
  obstacles: any[];
  lighting: string;
}

export const AimingGame: React.FC<AimingGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('archery');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [environment, setEnvironment] = useState<Environment>('forest');
  const [weather, setWeather] = useState<Weather>('clear');
  const [weaponType, setWeaponType] = useState<WeaponType>('recurve_bow');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [accuracy, setAccuracy] = useState({ hits: 0, misses: 0 });
  const [showConcept, setShowConcept] = useState(false);
  const [aimPosition, setAimPosition] = useState({ x: 50, y: 400 });
  const [aimAngle, setAimAngle] = useState(0);
  const [power, setPower] = useState(50);
  const [isCharging, setIsCharging] = useState(false);
  const [chargeStartTime, setChargeStartTime] = useState(0);
  const [weatherEffects, setWeatherEffects] = useState<WeatherEffect>({
    windX: 0,
    windY: 0,
    visibility: 1,
    gravity: 0.3
  });
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const environments: Record<Environment, EnvironmentSettings> = {
    forest: {
      backgroundColor: 'linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%)',
      obstacles: [
        { type: 'tree', x: 200, y: 300, width: 40, height: 100 },
        { type: 'tree', x: 500, y: 350, width: 35, height: 80 }
      ],
      lighting: 'bright'
    },
    mountains: {
      backgroundColor: 'linear-gradient(to bottom, #4682B4 0%, #DEB887 100%)',
      obstacles: [
        { type: 'rock', x: 150, y: 380, width: 60, height: 40 },
        { type: 'rock', x: 400, y: 360, width: 80, height: 60 }
      ],
      lighting: 'normal'
    },
    beach: {
      backgroundColor: 'linear-gradient(to bottom, #87CEEB 0%, #F0E68C 100%)',
      obstacles: [
        { type: 'palm', x: 300, y: 320, width: 30, height: 100 }
      ],
      lighting: 'bright'
    },
    city: {
      backgroundColor: 'linear-gradient(to bottom, #696969 0%, #D3D3D3 100%)',
      obstacles: [
        { type: 'building', x: 100, y: 200, width: 80, height: 200 },
        { type: 'building', x: 350, y: 250, width: 60, height: 150 }
      ],
      lighting: 'dim'
    },
    desert: {
      backgroundColor: 'linear-gradient(to bottom, #F4A460 0%, #DEB887 100%)',
      obstacles: [
        { type: 'cactus', x: 250, y: 350, width: 20, height: 70 },
        { type: 'rock', x: 450, y: 380, width: 50, height: 30 }
      ],
      lighting: 'harsh'
    },
    arctic: {
      backgroundColor: 'linear-gradient(to bottom, #F0F8FF 0%, #FFFFFF 100%)',
      obstacles: [
        { type: 'ice', x: 200, y: 380, width: 100, height: 20 },
        { type: 'snow', x: 400, y: 370, width: 80, height: 30 }
      ],
      lighting: 'low'
    }
  };

  // Apply weather effects
  useEffect(() => {
    const effects: WeatherEffect = {
      windX: 0,
      windY: 0,
      visibility: 1,
      gravity: 0.3
    };

    switch (weather) {
      case 'clear':
        // Default values
        break;
      case 'windy':
        effects.windX = (Math.random() - 0.5) * 0.4;
        effects.windY = (Math.random() - 0.5) * 0.2;
        break;
      case 'rainy':
        effects.windX = (Math.random() - 0.5) * 0.2;
        effects.visibility = 0.8;
        effects.gravity = 0.4;
        break;
      case 'snowy':
        effects.windX = (Math.random() - 0.5) * 0.3;
        effects.visibility = 0.6;
        effects.gravity = 0.25;
        break;
      case 'stormy':
        effects.windX = (Math.random() - 0.5) * 0.6;
        effects.windY = (Math.random() - 0.5) * 0.4;
        effects.visibility = 0.5;
        effects.gravity = 0.5;
        break;
    }

    setWeatherEffects(effects);
  }, [weather]);

  // Animation loop
  useEffect(() => {
    if (gameStarted) {
      const animate = () => {
        updateProjectiles();
        updateTargets();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, projectiles, targets, weatherEffects]);

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const updateProjectiles = () => {
    setProjectiles(prev => prev.map(projectile => {
      if (!projectile.active) return projectile;

      // Apply physics with weather effects
      const newVx = projectile.vx + weatherEffects.windX;
      const newVy = projectile.vy + weatherEffects.gravity + weatherEffects.windY;
      const newX = projectile.x + newVx;
      const newY = projectile.y + newVy;

      // Update trail
      const newTrail = [...projectile.trail, { x: projectile.x, y: projectile.y }].slice(-10);

      // Check bounds
      if (newX < 0 || newX > 800 || newY < 0 || newY > 500) {
        return { ...projectile, active: false };
      }

      // Check target collisions
      targets.forEach(target => {
        const distance = Math.sqrt(
          Math.pow(newX - (target.x + target.size/2), 2) + 
          Math.pow(newY - (target.y + target.size/2), 2)
        );
        
        if (distance < target.size/2 && projectile.active) {
          handleTargetHit(target.id);
          projectile.active = false;
        }
      });

      return {
        ...projectile,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        trail: newTrail
      };
    }));
  };

  const updateTargets = () => {
    setTargets(prev => prev.map(target => {
      if (target.speed && gameMode !== 'archery') {
        let newX = target.x + target.speed.dx;
        let newY = target.y + target.speed.dy;
        
        // Bounce off walls or remove if flying
        if (gameMode === 'flying') {
          if (newX < -target.size || newX > 850 || newY < -target.size || newY > 450) {
            return null; // Mark for removal
          }
        } else {
          if (newX <= 0 || newX >= 800 - target.size) target.speed.dx *= -1;
          if (newY <= 0 || newY >= 400 - target.size) target.speed.dy *= -1;
        }
        
        return { ...target, x: Math.max(0, Math.min(800 - target.size, newX)), y: Math.max(0, Math.min(400 - target.size, newY)) };
      }
      return target;
    }).filter(Boolean) as Target[]);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setAccuracy({ hits: 0, misses: 0 });
    setProjectiles([]);
    spawnTargets();
  };

  const endGame = () => {
    setGameStarted(false);
    setTargets([]);
    setProjectiles([]);
  };

  const spawnTargets = () => {
    const targetCount = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const newTargets: Target[] = [];
    
    for (let i = 0; i < targetCount; i++) {
      const size = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 40 : 30;
      const distance = 100 + Math.random() * 200;
      
      const target: Target = {
        id: Date.now() + i,
        x: 200 + Math.random() * 400,
        y: 100 + Math.random() * 200,
        size,
        color: '#FF6B6B',
        points: Math.round(distance / 10),
        type: 'bullseye',
        emoji: '🎯',
        distance
      };
      
      if (gameMode === 'moving' || gameMode === 'flying') {
        const speedMultiplier = difficulty === 'expert' ? 3 : difficulty === 'hard' ? 2 : 1;
        target.speed = {
          dx: (Math.random() - 0.5) * 4 * speedMultiplier,
          dy: gameMode === 'flying' ? 
            -Math.random() * 2 * speedMultiplier : 
            (Math.random() - 0.5) * 4 * speedMultiplier
        };
      }
      
      newTargets.push(target);
    }
    
    setTargets(newTargets);
    
    // Auto-spawn next targets
    setTimeout(() => {
      if (gameStarted) spawnTargets();
    }, 4000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameAreaRef.current && (weaponType.includes('bow') || weaponType === 'crossbow')) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const angle = Math.atan2(mouseY - aimPosition.y, mouseX - aimPosition.x);
      setAimAngle(angle);
    }
  };

  const handleMouseDown = () => {
    if (weaponType.includes('bow') || weaponType === 'crossbow') {
      setIsCharging(true);
      setChargeStartTime(Date.now());
    } else {
      shootProjectile(power);
    }
  };

  const handleMouseUp = () => {
    if (isCharging) {
      setIsCharging(false);
      const chargeTime = Math.min(Date.now() - chargeStartTime, 2000);
      const chargePower = Math.min((chargeTime / 2000) * 100, 100);
      shootProjectile(chargePower);
    }
  };

  const shootProjectile = (shotPower: number) => {
    const speed = (shotPower / 100) * 15 + 5;
    const spread = weaponType === 'rifle' ? 0.02 : weaponType === 'pistol' ? 0.05 : 0.01;
    const angleWithSpread = aimAngle + (Math.random() - 0.5) * spread;
    
    const newProjectile: Projectile = {
      id: Date.now(),
      x: aimPosition.x,
      y: aimPosition.y,
      vx: Math.cos(angleWithSpread) * speed,
      vy: Math.sin(angleWithSpread) * speed,
      active: true,
      trail: []
    };
    
    setProjectiles(prev => [...prev, newProjectile]);
    setAccuracy(prev => ({ ...prev, misses: prev.misses + 1 }));
  };

  const handleTargetHit = (targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    if (target) {
      setScore(score + target.points);
      setAccuracy(prev => ({ ...prev, hits: prev.hits + 1, misses: Math.max(0, prev.misses - 1) }));
      setTargets(prev => prev.filter(t => t.id !== targetId));
    }
  };

  const getAccuracyPercent = () => {
    const total = accuracy.hits + accuracy.misses;
    return total > 0 ? Math.round((accuracy.hits / total) * 100) : 0;
  };

  const renderEnvironment = () => {
    const env = environments[environment];
    const weatherOverlay = weather !== 'clear' ? (
      <div className={`absolute inset-0 pointer-events-none ${
        weather === 'rainy' ? 'bg-blue-900/20' :
        weather === 'snowy' ? 'bg-white/30' :
        weather === 'stormy' ? 'bg-gray-900/40' :
        weather === 'windy' ? 'bg-yellow-100/20' : ''
      }`}>
        {weather === 'rainy' && (
          <div className="rain-effect">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="raindrop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }} />
            ))}
          </div>
        )}
        {weather === 'snowy' && (
          <div className="snow-effect">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="snowflake" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}>❄</div>
            ))}
          </div>
        )}
      </div>
    ) : null;

    return (
      <div 
        className="absolute inset-0"
        style={{ background: env.backgroundColor }}
      >
        {/* Render environment obstacles */}
        {env.obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: obstacle.x,
              top: obstacle.y,
              width: obstacle.width,
              height: obstacle.height,
              backgroundColor: obstacle.type === 'tree' ? '#228B22' :
                             obstacle.type === 'rock' ? '#696969' :
                             obstacle.type === 'building' ? '#2F4F4F' :
                             obstacle.type === 'cactus' ? '#32CD32' :
                             '#8B4513'
            }}
          />
        ))}
        {weatherOverlay}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline" className="bg-white/90">
              ← Back to Hub
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="bg-gray-100">
              ← Previous
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">🏹 Advanced Archery & Shooting Range</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Precision & Hand-Eye Coordination</DialogTitle>
                <DialogDescription>Master the art of precision aiming</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">🎯 Aiming & Precision</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Hand-Eye Coordination:</strong> Synchronizing visual input with motor skills</li>
                    <li><strong>Spatial Awareness:</strong> Understanding your position relative to targets</li>
                    <li><strong>Focus & Concentration:</strong> Maintaining attention under pressure</li>
                    <li><strong>Adaptability:</strong> Adjusting to dynamic conditions like wind and movement</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Hand%E2%80%93eye_coordination" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Hand-Eye Coordination</a>
                    <a href="https://en.wikipedia.org/wiki/Archery" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Archery</a>
                    <a href="https://en.wikipedia.org/wiki/Shooting_sport" target="_blank" className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Shooting Sports</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Game Settings */}
        <div className="grid lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/95">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Game Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="archery">🏹 Archery</SelectItem>
                  <SelectItem value="shooting">🔫 Shooting</SelectItem>
                  <SelectItem value="moving">🔄 Moving Targets</SelectItem>
                  <SelectItem value="flying">🐦 Flying Targets</SelectItem>
                  <SelectItem value="fruit">🍎 Fruit Shooting</SelectItem>
                  <SelectItem value="tournament">🏆 Tournament</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Weapon & Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select value={weaponType} onValueChange={(value) => setWeaponType(value as WeaponType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recurve_bow">🏹 Recurve Bow</SelectItem>
                  <SelectItem value="compound_bow">🎯 Compound Bow</SelectItem>
                  <SelectItem value="crossbow">⚔️ Crossbow</SelectItem>
                  <SelectItem value="rifle">🔫 Rifle</SelectItem>
                  <SelectItem value="pistol">🔫 Pistol</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={environment} onValueChange={(value) => setEnvironment(value as Environment)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forest">🌲 Forest</SelectItem>
                  <SelectItem value="mountains">🏔️ Mountains</SelectItem>
                  <SelectItem value="beach">🏖️ Beach</SelectItem>
                  <SelectItem value="city">🏙️ City</SelectItem>
                  <SelectItem value="desert">🏜️ Desert</SelectItem>
                  <SelectItem value="arctic">🏔️ Arctic</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-white/95">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Weather & Power</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select value={weather} onValueChange={(value) => setWeather(value as Weather)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">☀️ Clear</SelectItem>
                  <SelectItem value="windy">💨 Windy</SelectItem>
                  <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                  <SelectItem value="snowy">❄️ Snowy</SelectItem>
                  <SelectItem value="stormy">⛈️ Stormy</SelectItem>
                </SelectContent>
              </Select>
              
              {weaponType.includes('gun') && (
                <div>
                  <label className="text-xs">Power: {power}%</label>
                  <Slider
                    value={[power]}
                    onValueChange={(value) => setPower(value[0])}
                    max={100}
                    min={20}
                    step={5}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        {gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Score: {score}</span>
                <span>Time: {timeLeft}s</span>
                <span>Accuracy: {getAccuracyPercent()}%</span>
                <span>Wind: {weatherEffects.windX.toFixed(2)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={gameAreaRef}
                className="relative w-full h-96 border-2 border-gray-300 rounded-lg overflow-hidden cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              >
                {renderEnvironment()}

                {/* Weapon */}
                <div
                  className="absolute z-10"
                  style={{
                    left: aimPosition.x - 20,
                    top: aimPosition.y - 20,
                    transform: `rotate(${aimAngle}rad)`,
                  }}
                >
                  <div className="text-3xl">
                    {weaponType === 'recurve_bow' ? '🏹' :
                     weaponType === 'compound_bow' ? '🎯' :
                     weaponType === 'crossbow' ? '⚔️' :
                     weaponType === 'rifle' ? '🔫' : '🔫'}
                  </div>
                </div>

                {/* Projectiles */}
                {projectiles.map(projectile => (
                  projectile.active && (
                    <div key={projectile.id}>
                      {/* Trail */}
                      {projectile.trail.map((point, index) => (
                        <div
                          key={index}
                          className="absolute w-1 h-1 bg-yellow-500 rounded-full"
                          style={{
                            left: point.x,
                            top: point.y,
                            opacity: (index / projectile.trail.length) * 0.5
                          }}
                        />
                      ))}
                      {/* Projectile */}
                      <div
                        className="absolute w-2 h-2 bg-yellow-600 rounded-full"
                        style={{
                          left: projectile.x - 1,
                          top: projectile.y - 1,
                        }}
                      />
                    </div>
                  )
                ))}

                {/* Targets */}
                {targets.map(target => (
                  <div
                    key={target.id}
                    className="absolute rounded-full cursor-pointer transition-all duration-100 hover:scale-110 animate-pulse flex items-center justify-center"
                    style={{
                      left: target.x,
                      top: target.y,
                      width: target.size,
                      height: target.size,
                      backgroundColor: target.color,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      opacity: weatherEffects.visibility
                    }}
                  >
                    <div className="text-center">
                      <div className="text-2xl">{target.emoji}</div>
                      <div className="text-xs font-bold text-white">{target.points}</div>
                    </div>
                  </div>
                ))}
                
                {/* Power meter for charging weapons */}
                {isCharging && (weaponType.includes('bow') || weaponType === 'crossbow') && (
                  <div className="absolute top-4 left-4 bg-white/90 p-2 rounded">
                    <div className="text-sm font-bold">Power</div>
                    <div className="w-20 h-2 bg-gray-300 rounded">
                      <div 
                        className="h-full bg-red-500 rounded animate-pulse"
                        style={{ width: `${Math.min((Date.now() - chargeStartTime) / 20, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Weather indicator */}
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded text-xs">
                  <div>Weather: {weather}</div>
                  <div>Wind: {weatherEffects.windX.toFixed(2)}</div>
                  <div>Visibility: {Math.round(weatherEffects.visibility * 100)}%</div>
                </div>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                {weaponType.includes('bow') || weaponType === 'crossbow' ? 
                  'Move mouse to aim, hold click to charge power, release to shoot' :
                  'Move mouse to aim, click to shoot'
                }
              </div>
              
              <div className="mt-4 flex justify-center gap-4">
                <Button onClick={endGame} variant="outline">
                  End Game
                </Button>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  New Round
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Ready for the Challenge?</h2>
              <p className="mb-6">Test your precision in realistic archery and shooting scenarios with dynamic weather effects!</p>
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-lg px-8">
                Start Training 🎯
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <style>
        {`
        .raindrop {
          position: absolute;
          width: 2px;
          height: 10px;
          background: linear-gradient(transparent, #87CEEB);
          animation: fall linear infinite;
        }
        
        .snowflake {
          position: absolute;
          color: white;
          user-select: none;
          pointer-events: none;
          animation: snow linear infinite;
        }
        
        @keyframes fall {
          0% { top: -10px; }
          100% { top: 100vh; }
        }
        
        @keyframes snow {
          0% { 
            top: -10px; 
            transform: translateX(0px) rotate(0deg);
          }
          100% { 
            top: 100vh; 
            transform: translateX(100px) rotate(360deg);
          }
        }
        `}
      </style>
    </div>
  );
};
