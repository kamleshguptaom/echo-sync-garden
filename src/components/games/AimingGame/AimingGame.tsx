
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface AimingGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type WeaponType = 'bow' | 'pistol' | 'rifle';

interface Target {
  x: number;
  y: number;
  size: number;
  points: number;
  hit: boolean;
  id: number;
}

interface Shot {
  x: number;
  y: number;
  accuracy: number;
}

export const AimingGame: React.FC<AimingGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [weapon, setWeapon] = useState<WeaponType>('bow');
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [score, setScore] = useState(0);
  const [ammo, setAmmo] = useState(10);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [crosshair, setCrosshair] = useState({ x: 200, y: 200 });
  const [isAiming, setIsAiming] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const weaponSettings = {
    bow: { accuracy: 0.8, damage: 1, ammo: 15, reloadTime: 1000 },
    pistol: { accuracy: 0.9, damage: 2, ammo: 12, reloadTime: 800 },
    rifle: { accuracy: 0.95, damage: 3, ammo: 8, reloadTime: 1500 }
  };

  const generateTargets = () => {
    const newTargets: Target[] = [];
    const count = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    
    for (let i = 0; i < count; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * 350 + 25,
        y: Math.random() * 250 + 25,
        size: difficulty === 'easy' ? 50 : difficulty === 'medium' ? 40 : 30,
        points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
        hit: false
      });
    }
    
    setTargets(newTargets);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameFinished(false);
    setScore(0);
    setShots([]);
    setAmmo(weaponSettings[weapon].ammo);
    setTimeLeft(60);
    generateTargets();
    
    // Start timer
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
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    setCrosshair({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleShoot = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted || gameFinished || ammo <= 0) return;
    
    setIsAiming(true);
    setTimeout(() => setIsAiming(false), 200);
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const shotX = e.clientX - rect.left;
    const shotY = e.clientY - rect.top;
    
    // Check if shot hits any target
    let hit = false;
    const newTargets = targets.map(target => {
      if (target.hit) return target;
      
      const distance = Math.sqrt(
        Math.pow(shotX - (target.x + target.size/2), 2) + 
        Math.pow(shotY - (target.y + target.size/2), 2)
      );
      
      if (distance <= target.size/2) {
        hit = true;
        setScore(prev => prev + target.points);
        return { ...target, hit: true };
      }
      return target;
    });
    
    setTargets(newTargets);
    setAmmo(prev => prev - 1);
    
    // Add shot marker
    const accuracy = hit ? 100 : Math.max(0, 100 - (Math.random() * 50));
    setShots(prev => [...prev, { x: shotX, y: shotY, accuracy }]);
    
    // Check win condition
    if (newTargets.every(target => target.hit)) {
      setGameFinished(true);
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

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-amber-400 via-orange-500 to-red-600">
      <style>{`
        .crosshair {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid red;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        .crosshair::before,
        .crosshair::after {
          content: '';
          position: absolute;
          background: red;
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
        .target {
          transition: all 0.3s ease;
        }
        .target:hover {
          transform: scale(1.1);
        }
        .shot-marker {
          position: absolute;
          width: 8px;
          height: 8px;
          background: yellow;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: shotFade 2s ease-out forwards;
        }
        @keyframes shotFade {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
        }
        .weapon-aim {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 3rem;
          z-index: 5;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={goBack} variant="outline" className="bg-white/90">
              ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">🏹 Advanced Archery</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-orange-500 text-white hover:bg-orange-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Precision Aiming & Focus Training</DialogTitle>
                <DialogDescription>Improve hand-eye coordination and concentration</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Aiming Skills</h3>
                  <p>Precision aiming develops hand-eye coordination, focus, and spatial awareness. These skills transfer to many real-world activities.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🏹 Weapon Types</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Bow:</strong> Traditional archery with moderate accuracy</li>
                    <li><strong>Pistol:</strong> Quick shots with good accuracy</li>
                    <li><strong>Rifle:</strong> High precision but limited ammo</li>
                  </ul>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">🎯 Aiming Tips:</h4>
                  <p>• Take your time to aim carefully<br/>
                     • Account for weapon accuracy<br/>
                     • Practice smooth, steady movements<br/>
                     • Focus on breathing and concentration</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Archery Range Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (Large targets)</SelectItem>
                      <SelectItem value="medium">Medium (Medium targets)</SelectItem>
                      <SelectItem value="hard">Hard (Small targets)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weapon</label>
                  <Select value={weapon} onValueChange={(value) => setWeapon(value as WeaponType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bow">🏹 Bow & Arrow</SelectItem>
                      <SelectItem value="pistol">🔫 Pistol</SelectItem>
                      <SelectItem value="rifle">🔫 Rifle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
                  Enter Shooting Range
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>Score: {score}</span>
                <span>Ammo: {ammo}</span>
                <span>Time: {timeLeft}s</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={gameAreaRef}
                className="relative bg-gradient-to-b from-sky-200 to-green-300 w-full h-96 rounded-lg border-4 border-gray-400 cursor-crosshair overflow-hidden"
                onMouseMove={handleMouseMove}
                onClick={handleShoot}
                style={{ cursor: 'none' }}
              >
                {/* Crosshair */}
                <div 
                  className="crosshair"
                  style={{ left: crosshair.x, top: crosshair.y }}
                />
                
                {/* Targets */}
                {targets.map((target) => (
                  <div
                    key={target.id}
                    className={`target absolute rounded-full ${
                      target.hit ? 'bg-gray-400' : 'bg-red-500'
                    } border-4 border-white`}
                    style={{
                      left: target.x,
                      top: target.y,
                      width: target.size,
                      height: target.size,
                      opacity: target.hit ? 0.5 : 1
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {target.hit ? '✓' : target.points}
                    </div>
                  </div>
                ))}
                
                {/* Shot markers */}
                {shots.map((shot, index) => (
                  <div
                    key={index}
                    className="shot-marker"
                    style={{ left: shot.x, top: shot.y }}
                  />
                ))}
                
                {/* Weapon display */}
                <div className="weapon-aim">
                  {weapon === 'bow' ? '🏹' : '🔫'}
                </div>
              </div>
              
              {gameFinished && (
                <div className="text-center mt-6 space-y-4">
                  <h2 className="text-3xl font-bold">🎯 Shooting Complete!</h2>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-blue-100 p-4 rounded">
                      <div className="font-bold">Final Score</div>
                      <div className="text-2xl">{score}</div>
                    </div>
                    <div className="bg-green-100 p-4 rounded">
                      <div className="font-bold">Accuracy</div>
                      <div className="text-2xl">
                        {Math.round((targets.filter(t => t.hit).length / targets.length) * 100)}%
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => { setGameStarted(false); setGameFinished(false); }} className="bg-orange-500 hover:bg-orange-600">
                    Return to Range
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
