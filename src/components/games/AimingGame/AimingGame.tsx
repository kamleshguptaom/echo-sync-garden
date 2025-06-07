
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface AimingGameProps {
  onBack: () => void;
}

type GameMode = 'archery' | 'target' | 'moving' | 'precision';
type Difficulty = 'easy' | 'medium' | 'hard';
type WeaponType = 'bow' | 'crossbow' | 'pistol' | 'rifle' | 'laser';

interface Target {
  x: number;
  y: number;
  size: number;
  points: number;
  hit: boolean;
  velocity?: { x: number; y: number };
}

interface GameState {
  score: number;
  shotsLeft: number;
  round: number;
  targetsHit: number;
  accuracy: number;
}

export const AimingGame: React.FC<AimingGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('archery');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [weapon, setWeapon] = useState<WeaponType>('bow');
  const [windEnabled, setWindEnabled] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    shotsLeft: 10,
    round: 1,
    targetsHit: 0,
    accuracy: 0
  });
  const [aimPosition, setAimPosition] = useState({ x: 0, y: 0 });
  const [windForce, setWindForce] = useState({ x: 0, y: 0 });
  const [showConcept, setShowConcept] = useState(false);
  const [arrowFlying, setArrowFlying] = useState(false);
  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0 });
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [totalShots, setTotalShots] = useState(0);
  const [powerLevel, setPowerLevel] = useState(50);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;

  useEffect(() => {
    if (gameStarted) {
      generateTargets();
      
      // Generate random wind force
      if (windEnabled) {
        setWindForce({
          x: (Math.random() - 0.5) * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3),
          y: (Math.random() - 0.5) * (difficulty === 'easy' ? 0.5 : difficulty === 'medium' ? 1 : 2),
        });
      } else {
        setWindForce({ x: 0, y: 0 });
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted]);
  
  // Reset game when difficulty or mode changes
  useEffect(() => {
    if (gameStarted) {
      setGameStarted(false);
    }
  }, [difficulty, gameMode, weapon, windEnabled]);

  const generateTargets = () => {
    const newTargets: Target[] = [];
    const targetCount = gameMode === 'archery' ? 1 : 
                        difficulty === 'easy' ? 3 : 
                        difficulty === 'medium' ? 5 : 7;
    
    for (let i = 0; i < targetCount; i++) {
      if (gameMode === 'archery') {
        // Single target in center for archery
        newTargets.push({
          x: CANVAS_WIDTH * 0.8,
          y: CANVAS_HEIGHT * 0.5,
          size: 100,
          points: 10,
          hit: false
        });
      } else if (gameMode === 'moving') {
        // Moving targets
        newTargets.push({
          x: CANVAS_WIDTH * (0.3 + Math.random() * 0.6),
          y: CANVAS_HEIGHT * (0.2 + Math.random() * 0.6),
          size: 30 + Math.random() * 30,
          points: Math.floor(Math.random() * 3) + 1,
          hit: false,
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
          }
        });
      } else {
        // Random targets for other modes
        newTargets.push({
          x: CANVAS_WIDTH * (0.3 + Math.random() * 0.6),
          y: CANVAS_HEIGHT * (0.2 + Math.random() * 0.6),
          size: 30 + Math.random() * 30,
          points: Math.floor(Math.random() * 3) + 1,
          hit: false
        });
      }
    }
    
    setTargets(newTargets);
  };

  const startGame = () => {
    setGameState({
      score: 0,
      shotsLeft: 10,
      round: 1,
      targetsHit: 0,
      accuracy: 0
    });
    setTotalShots(0);
    setGameStarted(true);
    setShowWinCelebration(false);
    setArrowFlying(false);
    setAimPosition({ x: 100, y: CANVAS_HEIGHT / 2 });
  };

  const gameLoop = () => {
    draw();
    updateTargets();
    
    if (arrowFlying) {
      updateArrow();
    }
    
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const updateTargets = () => {
    if (gameMode === 'moving') {
      setTargets(prev => prev.map(target => {
        if (target.hit || !target.velocity) return target;
        
        let newX = target.x + target.velocity.x;
        let newY = target.y + target.velocity.y;
        
        // Bounce off boundaries
        if (newX - target.size/2 < 0 || newX + target.size/2 > CANVAS_WIDTH) {
          target.velocity.x *= -1;
          newX = target.x + target.velocity.x;
        }
        
        if (newY - target.size/2 < 0 || newY + target.size/2 > CANVAS_HEIGHT) {
          target.velocity.y *= -1;
          newY = target.y + target.velocity.y;
        }
        
        return {
          ...target,
          x: newX,
          y: newY
        };
      }));
    }
  };

  const updateArrow = () => {
    setArrowPosition(prev => {
      const newX = prev.x + 10; // Arrow speed
      const newY = prev.y + windForce.y;
      
      // Check if arrow hit any target
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (!target.hit) {
          const dx = newX - target.x;
          const dy = newY - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < target.size / 2) {
            // Hit detected
            const newTargets = [...targets];
            newTargets[i] = { ...target, hit: true };
            setTargets(newTargets);
            
            // Update score
            setGameState(prev => ({
              ...prev,
              score: prev.score + target.points,
              targetsHit: prev.targetsHit + 1
            }));
          }
        }
      }
      
      // Check if arrow is out of bounds
      if (newX > CANVAS_WIDTH) {
        setArrowFlying(false);
        
        // Update shots left and check if round is over
        setGameState(prev => {
          const newShotsLeft = prev.shotsLeft - 1;
          
          if (newShotsLeft <= 0) {
            // Round over
            if (prev.round >= 5) {
              // Game over
              setShowWinCelebration(prev.score > 50);
              return prev;
            } else {
              // Next round
              setTimeout(() => {
                setGameState(gs => ({
                  ...gs,
                  round: gs.round + 1,
                  shotsLeft: 10,
                }));
                generateTargets();
              }, 2000);
              return {
                ...prev,
                shotsLeft: 0,
              };
            }
          }
          
          return { ...prev, shotsLeft: newShotsLeft };
        });
        
        // Update total shots and accuracy
        setTotalShots(prev => {
          const newTotalShots = prev + 1;
          setGameState(gs => ({
            ...gs,
            accuracy: (gs.targetsHit / newTotalShots) * 100
          }));
          return newTotalShots;
        });
      }
      
      return { x: newX, y: newY };
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStarted || arrowFlying || gameState.shotsLeft <= 0) return;
    
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    
    if (canvas && rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Set aim position
      setAimPosition({ x, y });
      
      // Fire arrow
      setArrowFlying(true);
      setArrowPosition({ x: 100, y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStarted || arrowFlying) return;
    
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    
    if (canvas && rect) {
      const y = e.clientY - rect.top;
      
      // Update aim position vertically only
      setAimPosition(prev => ({ ...prev, y }));
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
    
    // Draw targets
    targets.forEach(target => {
      if (gameMode === 'archery') {
        // Draw archery target board
        const rings = [
          { radius: target.size / 2, color: '#FFFFFF' },
          { radius: target.size * 0.4, color: '#000000' },
          { radius: target.size * 0.3, color: '#0000FF' },
          { radius: target.size * 0.2, color: '#FF0000' },
          { radius: target.size * 0.1, color: '#FFFF00' }
        ];
        
        rings.forEach(ring => {
          ctx.beginPath();
          ctx.arc(target.x, target.y, ring.radius, 0, Math.PI * 2);
          ctx.fillStyle = target.hit ? '#888888' : ring.color;
          ctx.fill();
          ctx.stroke();
        });
      } else {
        // Draw circular target
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = target.hit ? '#888888' : '#FF0000';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw point value
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(target.points.toString(), target.x, target.y);
      }
    });
    
    // Draw weapon
    if (weapon === 'bow' || weapon === 'crossbow') {
      // Draw bow
      ctx.beginPath();
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 5;
      ctx.arc(80, aimPosition.y, 50, -Math.PI/2, Math.PI/2);
      ctx.stroke();
      
      // Draw bowstring
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.moveTo(80, aimPosition.y - 50);
      ctx.lineTo(95, aimPosition.y);
      ctx.lineTo(80, aimPosition.y + 50);
      ctx.stroke();
      
    } else {
      // Draw gun
      ctx.fillStyle = '#333333';
      ctx.fillRect(50, aimPosition.y - 10, 60, 20);
      ctx.fillRect(60, aimPosition.y - 20, 15, 40);
      
      if (weapon === 'laser') {
        // Draw laser sight
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(110, aimPosition.y);
        ctx.lineTo(CANVAS_WIDTH, aimPosition.y);
        ctx.stroke();
      }
    }
    
    // Draw arrow if flying
    if (arrowFlying) {
      ctx.save();
      ctx.translate(arrowPosition.x, arrowPosition.y);
      
      if (weapon === 'bow' || weapon === 'crossbow') {
        // Draw arrow
        ctx.beginPath();
        ctx.fillStyle = '#8B4513';
        ctx.moveTo(0, 0);
        ctx.lineTo(-30, -3);
        ctx.lineTo(-30, 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(20, 0);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.fillStyle = '#888888';
        ctx.moveTo(20, 0);
        ctx.lineTo(10, -5);
        ctx.lineTo(10, 5);
        ctx.closePath();
        ctx.fill();
      } else {
        // Draw bullet/projectile
        ctx.beginPath();
        ctx.fillStyle = '#FFD700';
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw aim guide
    if (!arrowFlying) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.setLineDash([5, 5]);
      ctx.moveTo(110, aimPosition.y);
      ctx.lineTo(CANVAS_WIDTH, aimPosition.y + (windForce.y * 50));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw HUD
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillRect(10, 10, 200, 100);
    ctx.strokeRect(10, 10, 200, 100);
    
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 20, 35);
    ctx.fillText(`Shots: ${gameState.shotsLeft}/10`, 20, 60);
    ctx.fillText(`Round: ${gameState.round}/5`, 20, 85);
    ctx.fillText(`Accuracy: ${gameState.accuracy.toFixed(1)}%`, 20, 110);
    
    // Draw power meter
    if (!arrowFlying) {
      ctx.fillStyle = '#333333';
      ctx.fillRect(CANVAS_WIDTH - 40, 10, 30, 100);
      ctx.fillStyle = powerLevel < 33 ? '#00FF00' : powerLevel < 66 ? '#FFFF00' : '#FF0000';
      const powerHeight = 100 * (powerLevel / 100);
      ctx.fillRect(CANVAS_WIDTH - 40, 110 - powerHeight, 30, powerHeight);
    }
    
    // Draw wind indicator
    if (windEnabled) {
      const windX = windForce.x * 20;
      const windY = windForce.y * 20;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(CANVAS_WIDTH - 90, 10, 40, 40);
      ctx.strokeRect(CANVAS_WIDTH - 90, 10, 40, 40);
      
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.fillText('Wind', CANVAS_WIDTH - 70, 20);
      
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH - 70, 30);
      ctx.lineTo(CANVAS_WIDTH - 70 + windX, 30 + windY);
      ctx.strokeStyle = Math.abs(windX) + Math.abs(windY) < 10 ? '#00FF00' : 
                        Math.abs(windX) + Math.abs(windY) < 20 ? '#FFFF00' : '#FF0000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH - 70 + windX, 30 + windY);
      ctx.lineTo(CANVAS_WIDTH - 70 + windX - 5, 30 + windY - 5);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH - 70 + windX, 30 + windY);
      ctx.lineTo(CANVAS_WIDTH - 70 + windX - 5, 30 + windY + 5);
      ctx.stroke();
    }
    
    // Game over overlay
    if (gameState.round > 5) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
      
      ctx.font = '30px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
      
      if (gameState.score > 50) {
        ctx.fillText('Amazing performance! 🏆', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      } else if (gameState.score > 30) {
        ctx.fillText('Great job! 👍', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      } else {
        ctx.fillText('Keep practicing! 🎯', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      }
    }
    
    // Win celebration
    if (showWinCelebration) {
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * CANVAS_WIDTH,
          Math.random() * CANVAS_HEIGHT,
          Math.random() * 10 + 5,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ctx.fill();
      }
    }
  };

  const getWeaponName = () => {
    switch (weapon) {
      case 'bow': return 'Archery Bow';
      case 'crossbow': return 'Crossbow';
      case 'pistol': return 'Pistol';
      case 'rifle': return 'Rifle';
      case 'laser': return 'Laser Sight';
    }
  };

  const goBack = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-800 to-purple-900 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={goBack} variant="outline" className="bg-white/90">
            ← {gameStarted ? 'Settings' : 'Back to Hub'}
          </Button>
          <h1 className="text-4xl font-bold text-white">🏹 Advanced Archery</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Aiming & Precision Training</DialogTitle>
                <DialogDescription>Develop accuracy, timing and spatial awareness</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Skills Developed</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Hand-eye Coordination:</strong> Precisely align your aim with targets</li>
                    <li><strong>Spatial Awareness:</strong> Judge distances and trajectories</li>
                    <li><strong>Timing & Rhythm:</strong> Time your shots with moving targets</li>
                    <li><strong>Focus & Concentration:</strong> Maintain steady aim under pressure</li>
                    <li><strong>Strategic Planning:</strong> Prioritize high-value targets</li>
                  </ul>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎮 How to Play</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Move your mouse to aim up and down</li>
                    <li>Click to shoot</li>
                    <li>Hit targets to score points</li>
                    <li>Account for wind effects when enabled</li>
                    <li>Complete 5 rounds with 10 shots each</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Real-World Applications:</h4>
                  <p>These skills benefit activities requiring precision like surgery, sports, video gaming, and even everyday tasks that need steady hands and good coordination.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {gameStarted ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="mx-auto border-4 border-gray-800 cursor-crosshair"
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
              />
            </div>
            {gameState.round > 5 && (
              <div className="text-center">
                <Button 
                  onClick={startGame} 
                  className="bg-green-500 hover:bg-green-600"
                  size="lg"
                >
                  Play Again
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="text-center">Game Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Game Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="archery">🎯 Classic Archery</SelectItem>
                      <SelectItem value="target">🎪 Target Practice</SelectItem>
                      <SelectItem value="moving">🏃‍♂️ Moving Targets</SelectItem>
                      <SelectItem value="precision">🔍 Precision Shooting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="hard">🔴 Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Weapon</label>
                  <Select value={weapon} onValueChange={(value) => setWeapon(value as WeaponType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bow">🏹 Traditional Bow</SelectItem>
                      <SelectItem value="crossbow">🏹 Crossbow</SelectItem>
                      <SelectItem value="pistol">🔫 Pistol</SelectItem>
                      <SelectItem value="rifle">🎯 Sniper Rifle</SelectItem>
                      <SelectItem value="laser">💠 Laser Rifle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium">Wind Effects</label>
                    <Button variant={windEnabled ? "default" : "outline"} size="sm" onClick={() => setWindEnabled(!windEnabled)}>
                      {windEnabled ? "Enabled 🌬️" : "Disabled"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Shot Power: {powerLevel}%</label>
                  <Slider 
                    value={[powerLevel]} 
                    onValueChange={(value) => setPowerLevel(value[0])} 
                    min={10} 
                    max={100} 
                  />
                </div>
                
                <div className="text-center pt-4">
                  <Button
                    onClick={startGame}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Start Game
                  </Button>
                </div>
              </CardContent>
            </Card>
                
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="text-center">Game Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{gameMode === 'archery' ? 'Classic Archery' : 
                                                    gameMode === 'target' ? 'Target Practice' :
                                                    gameMode === 'moving' ? 'Moving Targets' :
                                                    'Precision Shooting'}</h3>
                  <p className="text-gray-600">
                    {gameMode === 'archery' 
                      ? 'Hit the bullseye on a traditional archery target.'
                      : gameMode === 'target'
                      ? 'Hit multiple stationary targets of varying sizes and point values.'
                      : gameMode === 'moving'
                      ? 'Track and hit moving targets as they travel across the field.'
                      : 'Aim for precise shots on small, high-value targets.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold">Selected Weapon:</h4>
                  <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                    <span className="text-xl">{
                      weapon === 'bow' || weapon === 'crossbow' ? '🏹' :
                      weapon === 'laser' ? '💠' : '🔫'
                    }</span>
                    <span>{getWeaponName()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold">Difficulty:</h4>
                  <div className="bg-gray-100 p-2 rounded">
                    {difficulty === 'easy'
                      ? '🟢 Easy - Larger targets, less wind effect, slower movements'
                      : difficulty === 'medium'
                      ? '🟡 Medium - Standard targets and moderate challenge'
                      : '🔴 Hard - Small targets, strong wind, fast movements'}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold">How To Play:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 bg-gray-100 p-2 rounded">
                    <li>Move your mouse to aim up and down</li>
                    <li>Click to shoot your {weapon === 'bow' || weapon === 'crossbow' ? 'arrow' : 'projectile'}</li>
                    <li>Account for {windEnabled ? 'wind effects' : 'gravity and distance'}</li>
                    <li>Complete 5 rounds with 10 shots each</li>
                  </ul>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-semibold">Scoring:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 bg-gray-100 p-2 rounded">
                    <li>Bullseye: 10 points</li>
                    <li>Inner Ring: 5 points</li>
                    <li>Outer Ring: 2 points</li>
                    <li>Hit any part: 1 point</li>
                    <li>Moving Target Bonus: +2 points</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes confetti {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--translate-x, -100px), var(--translate-y, 100px)) rotate(var(--rotate, 360deg)); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in-out forwards;
          --translate-x: ${Math.random() * 200 - 100}px;
          --translate-y: ${Math.random() * 200 - 100}px;
          --rotate: ${Math.random() * 360}deg;
        }
      `}</style>
    </div>
  );
};
