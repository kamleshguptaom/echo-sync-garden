import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AimingGameProps {
  onBack: () => void;
}

type GameMode = 'archery' | 'modern' | 'clay_shooting' | 'moving_targets' | 'challenge' | 'tournament';
type Difficulty = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'expert' | 'master';
type WeaponType = 'recurve_bow' | 'compound_bow' | 'crossbow' | 'rifle' | 'pistol' | 'slingshot';
type TargetType = 'bullseye' | 'animal' | 'fruit' | 'clay_pigeon' | 'balloon' | 'moving_disc';
type Environment = 'indoor_range' | 'outdoor_field' | 'forest' | 'desert' | 'mountain' | 'urban';
type WeatherCondition = 'calm' | 'light_wind' | 'strong_wind' | 'rain' | 'fog' | 'snow';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  speed?: { dx: number; dy: number };
  color: string;
  points: number;
  timeLeft?: number;
  type: TargetType;
  emoji?: string;
  rings?: number[];
  hit?: boolean;
  distance?: number;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  trail: { x: number; y: number }[];
  wind_affected: boolean;
}

interface GameSettings {
  weapon: WeaponType;
  environment: Environment;
  weather: WeatherCondition;
  targetDistance: number;
  windStrength: number;
  gravity: number;
  scoreMultiplier: number;
  timeLimit: number;
  targetCount: number;
  allowedShots: number;
}

interface WeaponStats {
  power: number;
  accuracy: number;
  reload_time: number;
  wind_resistance: number;
  projectile_drop: number;
}

export const AimingGame: React.FC<AimingGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('archery');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    weapon: 'recurve_bow',
    environment: 'outdoor_field',
    weather: 'calm',
    targetDistance: 50,
    windStrength: 0,
    gravity: 1,
    scoreMultiplier: 1,
    timeLimit: 300,
    targetCount: 10,
    allowedShots: 30
  });

  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [shotsLeft, setShotsLeft] = useState(30);
  const [accuracy, setAccuracy] = useState({ hits: 0, shots: 0 });
  const [showConcept, setShowConcept] = useState(false);
  const [weaponPosition, setWeaponPosition] = useState({ x: 100, y: 400 });
  const [aimAngle, setAimAngle] = useState(0);
  const [power, setPower] = useState(50);
  const [isCharging, setIsCharging] = useState(false);
  const [chargeStartTime, setChargeStartTime] = useState(0);
  const [windDirection, setWindDirection] = useState(0);
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition>('calm');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [customization, setCustomization] = useState({
    crosshairType: 'circle',
    crosshairColor: '#FF0000',
    trajectoryVisible: true,
    soundEnabled: true,
    showWindIndicator: true,
    showDistanceMarkers: true
  });

  // Add missing refs
  const animationRef = useRef<number>();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const chargeStartRef = useRef<number>();

  const weaponStats: Record<WeaponType, WeaponStats> = {
    recurve_bow: { power: 70, accuracy: 85, reload_time: 2, wind_resistance: 60, projectile_drop: 80 },
    compound_bow: { power: 90, accuracy: 95, reload_time: 3, wind_resistance: 75, projectile_drop: 70 },
    crossbow: { power: 95, accuracy: 90, reload_time: 4, wind_resistance: 80, projectile_drop: 60 },
    rifle: { power: 100, accuracy: 98, reload_time: 1, wind_resistance: 95, projectile_drop: 30 },
    pistol: { power: 60, accuracy: 75, reload_time: 1, wind_resistance: 70, projectile_drop: 90 },
    slingshot: { power: 40, accuracy: 60, reload_time: 1, wind_resistance: 30, projectile_drop: 100 }
  };

  const environmentEffects = {
    indoor_range: { wind: 0, visibility: 100, difficulty_modifier: 1 },
    outdoor_field: { wind: 0.3, visibility: 95, difficulty_modifier: 1.1 },
    forest: { wind: 0.5, visibility: 80, difficulty_modifier: 1.3 },
    desert: { wind: 0.8, visibility: 85, difficulty_modifier: 1.4 },
    mountain: { wind: 1.2, visibility: 90, difficulty_modifier: 1.5 },
    urban: { wind: 0.6, visibility: 75, difficulty_modifier: 1.2 }
  };

  const weatherEffects = {
    calm: { wind_multiplier: 1, visibility: 100, accuracy_modifier: 1 },
    light_wind: { wind_multiplier: 1.5, visibility: 95, accuracy_modifier: 0.95 },
    strong_wind: { wind_multiplier: 3, visibility: 90, accuracy_modifier: 0.8 },
    rain: { wind_multiplier: 2, visibility: 70, accuracy_modifier: 0.85 },
    fog: { wind_multiplier: 1, visibility: 50, accuracy_modifier: 0.9 },
    snow: { wind_multiplier: 2.5, visibility: 60, accuracy_modifier: 0.75 }
  };

  // Animation loop
  useEffect(() => {
    if (gameStarted) {
      const animate = () => {
        updateProjectiles();
        updateTargets();
        checkCollisions();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, projectiles, targets]);

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  // Wind simulation
  useEffect(() => {
    if (gameStarted) {
      const windTimer = setInterval(() => {
        const envEffect = environmentEffects[gameSettings.environment];
        const weatherEffect = weatherEffects[gameSettings.weather];
        const baseWind = envEffect.wind * weatherEffect.wind_multiplier;
        
        setWindDirection(prev => prev + (Math.random() - 0.5) * 10);
        setGameSettings(prev => ({
          ...prev,
          windStrength: baseWind + Math.random() * baseWind
        }));
      }, 3000);
      
      return () => clearInterval(windTimer);
    }
  }, [gameStarted, gameSettings.environment, gameSettings.weather]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(gameSettings.timeLimit);
    setShotsLeft(gameSettings.allowedShots);
    setAccuracy({ hits: 0, shots: 0 });
    setProjectiles([]);
    setAchievements([]);
    generateTargets();
  };

  const endGame = () => {
    setGameStarted(false);
    setTargets([]);
    setProjectiles([]);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    // Check for achievements
    const finalAccuracy = accuracy.shots > 0 ? (accuracy.hits / accuracy.shots) * 100 : 0;
    const newAchievements = [];
    
    if (finalAccuracy >= 90) newAchievements.push('Sharpshooter');
    if (score >= 1000) newAchievements.push('High Scorer');
    if (accuracy.hits >= 10) newAchievements.push('Marksman');
    
    setAchievements(newAchievements);
  };

  const generateTargets = () => {
    const newTargets: Target[] = [];
    
    for (let i = 0; i < gameSettings.targetCount; i++) {
      const targetType = getRandomTargetType();
      const distance = gameSettings.targetDistance + Math.random() * 100;
      const size = getTargetSize(targetType, distance);
      
      const target: Target = {
        id: Date.now() + i,
        x: 600 + distance + Math.random() * 200,
        y: 100 + Math.random() * 300,
        size,
        type: targetType,
        points: calculateTargetPoints(targetType, distance),
        color: getTargetColor(targetType),
        distance,
        rings: targetType === 'bullseye' ? [10, 8, 6, 4, 2] : undefined
      };
      
      if (gameMode === 'moving_targets' || gameMode === 'clay_shooting') {
        target.speed = {
          dx: (Math.random() - 0.5) * 4,
          dy: targetType === 'clay_pigeon' ? -2 - Math.random() * 2 : (Math.random() - 0.5) * 2
        };
      }
      
      newTargets.push(target);
    }
    
    setTargets(newTargets);
  };

  const getRandomTargetType = (): TargetType => {
    const types: TargetType[] = ['bullseye', 'animal', 'fruit', 'balloon'];
    if (gameMode === 'clay_shooting') return 'clay_pigeon';
    if (gameMode === 'moving_targets') return 'moving_disc';
    return types[Math.floor(Math.random() * types.length)];
  };

  const getTargetSize = (type: TargetType, distance: number): number => {
    const baseSize = {
      bullseye: 60,
      animal: 80,
      fruit: 40,
      clay_pigeon: 30,
      balloon: 35,
      moving_disc: 45
    }[type];
    
    // Adjust size based on distance and difficulty
    const distanceFactor = Math.max(0.3, 1 - (distance - 50) / 200);
    const difficultyFactor = {
      beginner: 1.4,
      novice: 1.2,
      intermediate: 1,
      advanced: 0.8,
      expert: 0.6,
      master: 0.4
    }[difficulty];
    
    return Math.max(15, baseSize * distanceFactor * difficultyFactor);
  };

  const getTargetColor = (type: TargetType): string => {
    const colors = {
      bullseye: '#FF0000',
      animal: '#8B4513',
      fruit: '#FF6B6B',
      clay_pigeon: '#FFA500',
      balloon: '#FF69B4',
      moving_disc: '#4169E1'
    };
    return colors[type];
  };

  const calculateTargetPoints = (type: TargetType, distance: number): number => {
    const basePoints = {
      bullseye: 100,
      animal: 75,
      fruit: 50,
      clay_pigeon: 150,
      balloon: 60,
      moving_disc: 120
    }[type];
    
    const distanceMultiplier = 1 + (distance - 50) / 100;
    const difficultyMultiplier = {
      beginner: 1,
      novice: 1.2,
      intermediate: 1.5,
      advanced: 2,
      expert: 2.5,
      master: 3
    }[difficulty];
    
    return Math.round(basePoints * distanceMultiplier * difficultyMultiplier * gameSettings.scoreMultiplier);
  };

  const updateProjectiles = () => {
    setProjectiles(prev => prev.map(projectile => {
      if (!projectile.active) return projectile;
      
      const weapon = weaponStats[gameSettings.weapon];
      const weather = weatherEffects[gameSettings.weather];
      
      // Apply physics
      let newX = projectile.x + projectile.vx;
      let newY = projectile.y + projectile.vy;
      
      // Apply gravity
      projectile.vy += gameSettings.gravity * (weapon.projectile_drop / 100);
      
      // Apply wind effect
      if (projectile.wind_affected) {
        const windEffect = gameSettings.windStrength * (1 - weapon.wind_resistance / 100);
        newX += Math.cos(windDirection * Math.PI / 180) * windEffect;
        newY += Math.sin(windDirection * Math.PI / 180) * windEffect * 0.3;
      }
      
      // Update trail
      const newTrail = [...projectile.trail, { x: projectile.x, y: projectile.y }];
      if (newTrail.length > 10) newTrail.shift();
      
      // Check boundaries
      if (newX < 0 || newX > 900 || newY < 0 || newY > 500) {
        return { ...projectile, active: false };
      }
      
      return {
        ...projectile,
        x: newX,
        y: newY,
        trail: newTrail
      };
    }));
  };

  const updateTargets = () => {
    setTargets(prev => prev.map(target => {
      if (!target.speed) return target;
      
      let newX = target.x + target.speed.dx;
      let newY = target.y + target.speed.dy;
      
      // Bounce off boundaries or remove for clay pigeons
      if (target.type === 'clay_pigeon') {
        if (newY > 500 || newX < 0 || newX > 900) {
          return { ...target, x: -100, y: -100 }; // Remove off-screen
        }
      } else {
        if (newX <= target.size || newX >= 900 - target.size) target.speed.dx *= -1;
        if (newY <= target.size || newY >= 500 - target.size) target.speed.dy *= -1;
        newX = Math.max(target.size, Math.min(900 - target.size, newX));
        newY = Math.max(target.size, Math.min(500 - target.size, newY));
      }
      
      return { ...target, x: newX, y: newY };
    }));
  };

  const checkCollisions = () => {
    projectiles.forEach(projectile => {
      if (!projectile.active) return;
      
      targets.forEach(target => {
        if (target.hit) return;
        
        const distance = Math.sqrt(
          Math.pow(projectile.x - target.x, 2) + 
          Math.pow(projectile.y - target.y, 2)
        );
        
        if (distance < target.size / 2) {
          handleTargetHit(target, projectile, distance);
          setProjectiles(prev => prev.map(p => 
            p.id === projectile.id ? { ...p, active: false } : p
          ));
        }
      });
    });
  };

  const handleTargetHit = (target: Target, projectile: Projectile, hitDistance: number) => {
    let points = target.points;
    
    // Calculate ring score for bullseye targets
    if (target.type === 'bullseye' && target.rings) {
      const ringIndex = Math.floor((hitDistance / (target.size / 2)) * target.rings.length);
      const ringScore = target.rings[Math.min(ringIndex, target.rings.length - 1)];
      points = Math.round(points * (ringScore / 10));
    }
    
    // Bonus for precise hits
    if (hitDistance < target.size / 4) {
      points = Math.round(points * 1.5); // Bullseye bonus
    }
    
    setScore(prev => prev + points);
    setAccuracy(prev => ({ ...prev, hits: prev.hits + 1 }));
    
    // Mark target as hit
    setTargets(prev => prev.map(t => 
      t.id === target.id ? { ...t, hit: true } : t
    ));
    
    // Spawn new target if needed
    if (gameMode === 'clay_shooting' || gameMode === 'challenge') {
      setTimeout(() => {
        const newTarget = generateSingleTarget();
        setTargets(prev => [...prev.filter(t => !t.hit), newTarget]);
      }, 1000);
    }
  };

  const generateSingleTarget = (): Target => {
    const targetType = getRandomTargetType();
    const distance = gameSettings.targetDistance + Math.random() * 100;
    
    const target: Target = {
      id: Date.now(),
      x: 600 + distance + Math.random() * 200,
      y: 100 + Math.random() * 300,
      size: getTargetSize(targetType, distance),
      type: targetType,
      points: calculateTargetPoints(targetType, distance),
      color: getTargetColor(targetType),
      distance
    };
    
    if (gameMode === 'clay_shooting') {
      target.speed = {
        dx: (Math.random() - 0.5) * 6,
        dy: -3 - Math.random() * 3
      };
    }
    
    return target;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const angle = Math.atan2(mouseY - weaponPosition.y, mouseX - weaponPosition.x);
    setAimAngle(angle);
  };

  const handleMouseDown = () => {
    if (shotsLeft <= 0 || !gameStarted) return;
    
    setIsCharging(true);
    setChargeStartTime(Date.now());
    chargeStartRef.current = Date.now();
  };

  const handleMouseUp = () => {
    if (!isCharging || shotsLeft <= 0) return;
    
    setIsCharging(false);
    const chargeTime = Date.now() - chargeStartTime;
    const chargePower = Math.min(chargeTime / 1000, 2) * 50 + 25; // 25-125% power
    
    shoot(chargePower);
    setShotsLeft(prev => prev - 1);
    setAccuracy(prev => ({ ...prev, shots: prev.shots + 1 }));
  };

  const shoot = (shotPower: number) => {
    const weapon = weaponStats[gameSettings.weapon];
    const velocity = (shotPower / 100) * weapon.power * 0.3;
    
    const newProjectile: Projectile = {
      id: Date.now(),
      x: weaponPosition.x,
      y: weaponPosition.y,
      vx: Math.cos(aimAngle) * velocity,
      vy: Math.sin(aimAngle) * velocity,
      active: true,
      trail: [],
      wind_affected: gameSettings.weapon !== 'rifle'
    };
    
    setProjectiles(prev => [...prev, newProjectile]);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getAccuracyPercent = (): number => {
    return accuracy.shots > 0 ? Math.round((accuracy.hits / accuracy.shots) * 100) : 0;
  };

  const renderWeapon = () => {
    const weaponEmojis = {
      recurve_bow: '🏹',
      compound_bow: '🏹',
      crossbow: '🏹',
      rifle: '🔫',
      pistol: '🔫',
      slingshot: '🪃'
    };
    
    return (
      <div
        className="absolute text-3xl"
        style={{
          left: weaponPosition.x - 15,
          top: weaponPosition.y - 15,
          transform: `rotate(${aimAngle}rad)`,
        }}
      >
        {weaponEmojis[gameSettings.weapon]}
      </div>
    );
  };

  const renderEnvironment = () => {
    const envColors = {
      indoor_range: 'from-gray-200 to-gray-100',
      outdoor_field: 'from-green-200 to-blue-200',
      forest: 'from-green-300 to-green-100',
      desert: 'from-yellow-200 to-orange-200',
      mountain: 'from-blue-300 to-white',
      urban: 'from-gray-300 to-blue-100'
    };
    
    return `bg-gradient-to-br ${envColors[gameSettings.environment]}`;
  };

  const renderWeatherEffect = () => {
    if (gameSettings.weather === 'rain') {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-4 bg-blue-400 opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      );
    }
    
    if (gameSettings.weather === 'fog') {
      return (
        <div className="absolute inset-0 bg-gray-300 opacity-30 pointer-events-none" />
      );
    }
    
    return null;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🏹 Advanced Archery & Shooting Range</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Advanced Marksmanship & Physics</DialogTitle>
                <DialogDescription>Master precision shooting with realistic ballistics</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Hand-Eye Coordination</h3>
                  <p>Aiming games improve the connection between visual processing and motor skills.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎮 Game Modes</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Archery:</strong> Static targets for steady aim practice</li>
                    <li><strong>Modern:</strong> Fast-moving targets for precision</li>
                    <li><strong>Clay Shooting:</strong> Fast-moving clay pigeons</li>
                    <li><strong>Moving Targets:</strong> Targets that move across the screen</li>
                    <li><strong>Challenge:</strong> Competitive scoring system</li>
                    <li><strong>Tournament:</strong> Competitive scoring system</li>
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

        {!gameStarted ? (
          <Card className="mb-6 bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Professional Shooting Range Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="archery">🏹 Archery</TabsTrigger>
                  <TabsTrigger value="modern">🔫 Modern</TabsTrigger>
                  <TabsTrigger value="challenge">🎯 Challenge</TabsTrigger>
                </TabsList>
                
                <TabsContent value="archery" className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bow Type</label>
                      <Select 
                        value={gameSettings.weapon} 
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, weapon: value as WeaponType }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recurve_bow">🏹 Recurve Bow</SelectItem>
                          <SelectItem value="compound_bow">🏹 Compound Bow</SelectItem>
                          <SelectItem value="crossbow">🏹 Crossbow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Distance</label>
                      <Slider
                        value={[gameSettings.targetDistance]}
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, targetDistance: value[0] }))}
                        max={200}
                        min={20}
                        step={10}
                      />
                      <span className="text-sm">{gameSettings.targetDistance}m</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty</label>
                      <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="novice">Novice</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="modern" className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Weapon</label>
                      <Select 
                        value={gameSettings.weapon} 
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, weapon: value as WeaponType }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rifle">🔫 Rifle</SelectItem>
                          <SelectItem value="pistol">🔫 Pistol</SelectItem>
                          <SelectItem value="slingshot">🪃 Slingshot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Distance</label>
                      <Slider
                        value={[gameSettings.targetDistance]}
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, targetDistance: value[0] }))}
                        max={200}
                        min={20}
                        step={10}
                      />
                      <span className="text-sm">{gameSettings.targetDistance}m</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty</label>
                      <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="novice">Novice</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="challenge" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Clay Shooting</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Fast-moving clay pigeons</p>
                        <Button 
                          onClick={() => setGameMode('clay_shooting')}
                          className="w-full mt-2"
                        >
                          Select
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Tournament</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Competitive scoring system</p>
                        <Button 
                          onClick={() => setGameMode('tournament')}
                          className="w-full mt-2"
                        >
                          Select
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Environment & Weather</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <Select 
                        value={gameSettings.environment} 
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, environment: value as Environment }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indoor_range">🏢 Indoor Range</SelectItem>
                          <SelectItem value="outdoor_field">🌾 Outdoor Field</SelectItem>
                          <SelectItem value="forest">🌲 Forest</SelectItem>
                          <SelectItem value="desert">🏜️ Desert</SelectItem>
                          <SelectItem value="mountain">🏔️ Mountain</SelectItem>
                          <SelectItem value="urban">🏙️ Urban</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Weather</label>
                      <Select 
                        value={gameSettings.weather} 
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, weather: value as WeatherCondition }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="calm">☀️ Calm</SelectItem>
                          <SelectItem value="light_wind">🌤️ Light Wind</SelectItem>
                          <SelectItem value="strong_wind">💨 Strong Wind</SelectItem>
                          <SelectItem value="rain">🌧️ Rain</SelectItem>
                          <SelectItem value="fog">🌫️ Fog</SelectItem>
                          <SelectItem value="snow">❄️ Snow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Game Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Time Limit</label>
                      <Slider
                        value={[gameSettings.timeLimit]}
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, timeLimit: value[0] }))}
                        max={600}
                        min={60}
                        step={30}
                      />
                      <span className="text-sm">{Math.floor(gameSettings.timeLimit / 60)}:{(gameSettings.timeLimit % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Shots</label>
                      <Slider
                        value={[gameSettings.allowedShots]}
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, allowedShots: value[0] }))}
                        max={100}
                        min={10}
                        step={5}
                      />
                      <span className="text-sm">{gameSettings.allowedShots} shots</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Target Count</label>
                      <Slider
                        value={[gameSettings.targetCount]}
                        onValueChange={(value) => setGameSettings(prev => ({ ...prev, targetCount: value[0] }))}
                        max={50}
                        min={5}
                        step={5}
                      />
                      <span className="text-sm">{gameSettings.targetCount} targets</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center">
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-lg px-8">
                  Start Shooting Session 🎯
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 bg-white/95">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-sm">
                  <span>Score: {score}</span>
                  <span>Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  <span>Shots: {shotsLeft}/{gameSettings.allowedShots}</span>
                  <span>Accuracy: {accuracy.shots > 0 ? Math.round((accuracy.hits / accuracy.shots) * 100) : 0}%</span>
                  <span>Wind: {Math.round(gameSettings.windStrength * 10)}mph {windDirection > 0 ? '→' : '←'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={gameAreaRef}
                  className="relative w-full h-96 border-2 border-gray-300 rounded-lg overflow-hidden cursor-crosshair bg-gradient-to-br from-green-100 via-blue-100 to-purple-100"
                  onMouseMove={handleMouseMove}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                >
                  {renderWeatherEffect()}
                  
                  {/* Distance markers */}
                  {customization.showDistanceMarkers && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[100, 200, 300, 400, 500].map(distance => (
                        <div
                          key={distance}
                          className="absolute h-full border-l border-gray-400 opacity-30"
                          style={{ left: `${(distance / 900) * 100}%` }}
                        >
                          <span className="text-xs text-gray-600 bg-white px-1 rounded">
                            {distance}m
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Wind indicator */}
                  {customization.showWindIndicator && gameSettings.windStrength > 0 && (
                    <div className="absolute top-4 right-4 bg-white/80 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Wind</span>
                        <div 
                          className="text-lg"
                          style={{ transform: `rotate(${windDirection}deg)` }}
                        >
                          →
                        </div>
                        <span className="text-sm">{Math.round(gameSettings.windStrength * 10)}mph</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Weapon */}
                  {renderWeapon()}
                  
                  {/* Projectiles */}
                  {projectiles.map(projectile => (
                    projectile.active && (
                      <div key={projectile.id}>
                        {/* Projectile trail */}
                        {customization.trajectoryVisible && projectile.trail.map((point, index) => (
                          <div
                            key={index}
                            className="absolute w-1 h-1 bg-red-400 rounded-full"
                            style={{
                              left: point.x,
                              top: point.y,
                              opacity: (index + 1) / projectile.trail.length * 0.5
                            }}
                          />
                        ))}
                        {/* Projectile */}
                        <div
                          className="absolute w-2 h-2 bg-yellow-600 rounded-full"
                          style={{
                            left: projectile.x - 1,
                            top: projectile.y - 1
                          }}
                        />
                      </div>
                    )
                  ))}
                  
                  {/* Targets */}
                  {targets.map(target => (
                    !target.hit && (
                      <div
                        key={target.id}
                        className="absolute cursor-pointer transition-all duration-100 hover:scale-110"
                        style={{
                          left: target.x - target.size / 2,
                          top: target.y - target.size / 2,
                          width: target.size,
                          height: target.size,
                        }}
                      >
                        {target.type === 'bullseye' ? (
                          <div className="w-full h-full relative">
                            {/* Bullseye rings */}
                            {[0, 1, 2, 3, 4].map(ring => (
                              <div
                                key={ring}
                                className="absolute rounded-full border-2 border-gray-800"
                                style={{
                                  width: `${100 - ring * 20}%`,
                                  height: `${100 - ring * 20}%`,
                                  left: `${ring * 10}%`,
                                  top: `${ring * 10}%`,
                                  backgroundColor: ring % 2 === 0 ? '#FF0000' : '#FFFFFF'
                                }}
                              />
                            ))}
                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                              {target.rings?.[0] || 10}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: target.color }}
                          >
                            {target.type === 'animal' && '🦌'}
                            {target.type === 'fruit' && '🍎'}
                            {target.type === 'clay_pigeon' && '🥏'}
                            {target.type === 'balloon' && '🎈'}
                            {target.type === 'moving_disc' && '💿'}
                          </div>
                        )}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-black/50 px-1 rounded">
                          {target.points}pt
                        </div>
                      </div>
                    )
                  ))}
                  
                  {/* Power meter */}
                  {isCharging && (
                    <div className="absolute top-4 left-4 bg-white/90 p-3 rounded">
                      <div className="text-sm font-bold mb-2">Power</div>
                      <div className="w-32 h-4 bg-gray-300 rounded">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded transition-all duration-100"
                          style={{ 
                            width: `${Math.min(((Date.now() - chargeStartTime) / 2000) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs mt-1">Hold to charge, release to shoot</div>
                    </div>
                  )}
                  
                  {/* Crosshair */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: weaponPosition.x + Math.cos(aimAngle) * 100,
                      top: weaponPosition.y + Math.sin(aimAngle) * 100,
                    }}
                  >
                    <div 
                      className="w-8 h-8 border-2 rounded-full"
                      style={{ 
                        borderColor: customization.crosshairColor,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="w-1 h-8"
                          style={{ backgroundColor: customization.crosshairColor }}
                        />
                        <div 
                          className="absolute w-8 h-1"
                          style={{ backgroundColor: customization.crosshairColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  Aim with mouse • Hold click to charge power • Release to shoot
                </div>
                
                <div className="mt-4 flex justify-center gap-4">
                  <Button onClick={endGame} variant="outline">
                    End Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weapon Stats */}
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="text-sm">Weapon Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  {Object.entries(weaponStats[gameSettings.weapon]).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="font-bold capitalize">{stat.replace('_', ' ')}</div>
                      <div className="text-2xl font-bold text-blue-600">{value}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Game Over Screen */}
        {!gameStarted && (score > 0 || accuracy.shots > 0) && (
          <Card className="bg-white/95">
            <CardContent className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Session Complete! 🎯</h2>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm">Final Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{getAccuracyPercent()}%</div>
                  <div className="text-sm">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">{accuracy.hits}</div>
                  <div className="text-sm">Hits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">{gameSettings.allowedShots - shotsLeft}</div>
                  <div className="text-sm">Shots Fired</div>
                </div>
              </div>
              
              {achievements.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">🏆 Achievements Unlocked:</h3>
                  <div className="flex justify-center gap-2">
                    {achievements.map(achievement => (
                      <span key={achievement} className="bg-yellow-100 px-3 py-1 rounded-full text-sm">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                New Session 🎯
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
