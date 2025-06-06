
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface CarromGameProps {
  onBack: () => void;
}

interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: 'white' | 'black' | 'red';
  pocketed: boolean;
  radius: number;
}

export const CarromGame: React.FC<CarromGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [striker, setStriker] = useState({ x: 200, y: 350, vx: 0, vy: 0, radius: 15 });
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [power, setPower] = useState(0);
  const [angle, setAngle] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [gamePhase, setGamePhase] = useState<'aiming' | 'moving' | 'finished'>('aiming');

  const BOARD_SIZE = 400;
  const FRICTION = 0.98;
  const MIN_VELOCITY = 0.5;

  const initializeGame = () => {
    const newCoins: Coin[] = [];
    const centerX = BOARD_SIZE / 2;
    const centerY = BOARD_SIZE / 2;
    
    // Create diamond formation
    const positions = [
      [0, 0], // Center (red queen)
      [-15, 0], [15, 0], [0, -15], [0, 15], // Inner ring
      [-30, 0], [30, 0], [0, -30], [0, 30], // Outer ring
      [-15, -15], [15, -15], [-15, 15], [15, 15] // Corners
    ];
    
    positions.forEach((pos, index) => {
      newCoins.push({
        x: centerX + pos[0],
        y: centerY + pos[1],
        vx: 0,
        vy: 0,
        color: index === 0 ? 'red' : (index % 2 === 1 ? 'black' : 'white'),
        pocketed: false,
        radius: 8
      });
    });
    
    setCoins(newCoins);
    setStriker({ x: centerX, y: 350, vx: 0, vy: 0, radius: 15 });
    setGameStarted(true);
    setGamePhase('aiming');
  };

  const checkCollisions = useCallback((coins: Coin[], striker: any) => {
    const newCoins = [...coins];
    let newStriker = { ...striker };
    
    // Check coin-coin collisions
    for (let i = 0; i < newCoins.length; i++) {
      for (let j = i + 1; j < newCoins.length; j++) {
        const coin1 = newCoins[i];
        const coin2 = newCoins[j];
        
        if (coin1.pocketed || coin2.pocketed) continue;
        
        const dx = coin2.x - coin1.x;
        const dy = coin2.y - coin1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < coin1.radius + coin2.radius) {
          // Simple collision response
          const angle = Math.atan2(dy, dx);
          const speed1 = Math.sqrt(coin1.vx * coin1.vx + coin1.vy * coin1.vy);
          const speed2 = Math.sqrt(coin2.vx * coin2.vx + coin2.vy * coin2.vy);
          
          coin1.vx = -Math.cos(angle) * speed2 * 0.5;
          coin1.vy = -Math.sin(angle) * speed2 * 0.5;
          coin2.vx = Math.cos(angle) * speed1 * 0.5;
          coin2.vy = Math.sin(angle) * speed1 * 0.5;
          
          // Separate overlapping coins
          const overlap = coin1.radius + coin2.radius - distance;
          coin1.x -= Math.cos(angle) * overlap * 0.5;
          coin1.y -= Math.sin(angle) * overlap * 0.5;
          coin2.x += Math.cos(angle) * overlap * 0.5;
          coin2.y += Math.sin(angle) * overlap * 0.5;
        }
      }
    }
    
    // Check striker-coin collisions
    for (let coin of newCoins) {
      if (coin.pocketed) continue;
      
      const dx = coin.x - newStriker.x;
      const dy = coin.y - newStriker.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < coin.radius + newStriker.radius) {
        const angle = Math.atan2(dy, dx);
        const strikerSpeed = Math.sqrt(newStriker.vx * newStriker.vx + newStriker.vy * newStriker.vy);
        
        coin.vx = Math.cos(angle) * strikerSpeed * 0.8;
        coin.vy = Math.sin(angle) * strikerSpeed * 0.8;
        
        newStriker.vx *= 0.3;
        newStriker.vy *= 0.3;
      }
    }
    
    return { coins: newCoins, striker: newStriker };
  }, []);

  const checkPockets = useCallback((coins: Coin[], striker: any) => {
    const pockets = [
      { x: 20, y: 20 }, { x: 380, y: 20 },
      { x: 20, y: 380 }, { x: 380, y: 380 }
    ];
    
    const newCoins = [...coins];
    let newStriker = { ...striker };
    let scoreChange = { player1: 0, player2: 0 };
    
    // Check coins in pockets
    newCoins.forEach(coin => {
      if (!coin.pocketed) {
        pockets.forEach(pocket => {
          const dx = coin.x - pocket.x;
          const dy = coin.y - pocket.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 20) {
            coin.pocketed = true;
            if (coin.color === 'black' && currentPlayer === 1) scoreChange.player1++;
            if (coin.color === 'white' && currentPlayer === 1) scoreChange.player1++;
            if (coin.color === 'black' && currentPlayer === 2) scoreChange.player2++;
            if (coin.color === 'white' && currentPlayer === 2) scoreChange.player2++;
            if (coin.color === 'red') {
              if (currentPlayer === 1) scoreChange.player1 += 3;
              if (currentPlayer === 2) scoreChange.player2 += 3;
            }
          }
        });
      }
    });
    
    // Check striker in pocket (foul)
    pockets.forEach(pocket => {
      const dx = newStriker.x - pocket.x;
      const dy = newStriker.y - pocket.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 20) {
        newStriker.x = BOARD_SIZE / 2;
        newStriker.y = 350;
        newStriker.vx = 0;
        newStriker.vy = 0;
      }
    });
    
    return { coins: newCoins, striker: newStriker, scoreChange };
  }, [currentPlayer]);

  const updatePhysics = useCallback(() => {
    if (gamePhase !== 'moving') return;
    
    setCoins(prevCoins => {
      setStriker(prevStriker => {
        const { coins: collidedCoins, striker: collidedStriker } = checkCollisions(prevCoins, prevStriker);
        const { coins: finalCoins, striker: finalStriker, scoreChange } = checkPockets(collidedCoins, collidedStriker);
        
        // Update score
        if (scoreChange.player1 > 0 || scoreChange.player2 > 0) {
          setScore(prev => ({
            player1: prev.player1 + scoreChange.player1,
            player2: prev.player2 + scoreChange.player2
          }));
        }
        
        // Apply physics
        const updatedCoins = finalCoins.map(coin => {
          if (coin.pocketed) return coin;
          
          // Apply friction
          coin.vx *= FRICTION;
          coin.vy *= FRICTION;
          
          // Stop very slow movement
          if (Math.abs(coin.vx) < MIN_VELOCITY) coin.vx = 0;
          if (Math.abs(coin.vy) < MIN_VELOCITY) coin.vy = 0;
          
          // Update position
          coin.x += coin.vx;
          coin.y += coin.vy;
          
          // Boundary collision
          if (coin.x - coin.radius < 10 || coin.x + coin.radius > BOARD_SIZE - 10) {
            coin.vx = -coin.vx * 0.7;
            coin.x = Math.max(coin.radius + 10, Math.min(BOARD_SIZE - coin.radius - 10, coin.x));
          }
          if (coin.y - coin.radius < 10 || coin.y + coin.radius > BOARD_SIZE - 10) {
            coin.vy = -coin.vy * 0.7;
            coin.y = Math.max(coin.radius + 10, Math.min(BOARD_SIZE - coin.radius - 10, coin.y));
          }
          
          return coin;
        });
        
        // Update striker
        finalStriker.vx *= FRICTION;
        finalStriker.vy *= FRICTION;
        
        if (Math.abs(finalStriker.vx) < MIN_VELOCITY) finalStriker.vx = 0;
        if (Math.abs(finalStriker.vy) < MIN_VELOCITY) finalStriker.vy = 0;
        
        finalStriker.x += finalStriker.vx;
        finalStriker.y += finalStriker.vy;
        
        // Striker boundary collision
        if (finalStriker.x - finalStriker.radius < 10 || finalStriker.x + finalStriker.radius > BOARD_SIZE - 10) {
          finalStriker.vx = -finalStriker.vx * 0.7;
          finalStriker.x = Math.max(finalStriker.radius + 10, Math.min(BOARD_SIZE - finalStriker.radius - 10, finalStriker.x));
        }
        if (finalStriker.y - finalStriker.radius < 10 || finalStriker.y + finalStriker.radius > BOARD_SIZE - 10) {
          finalStriker.vy = -finalStriker.vy * 0.7;
          finalStriker.y = Math.max(finalStriker.radius + 10, Math.min(BOARD_SIZE - finalStriker.radius - 10, finalStriker.y));
        }
        
        // Check if everything stopped
        const allStopped = updatedCoins.every(coin => coin.vx === 0 && coin.vy === 0) && 
                          finalStriker.vx === 0 && finalStriker.vy === 0;
        
        if (allStopped) {
          setGamePhase('aiming');
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
        
        return finalStriker;
      });
      
      return prevCoins;
    });
  }, [gamePhase, currentPlayer, checkCollisions, checkPockets]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#deb887';
    ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    
    // Draw border
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 20;
    ctx.strokeRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    
    // Draw center circle
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(BOARD_SIZE/2, BOARD_SIZE/2, 50, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw pockets
    const pockets = [
      { x: 20, y: 20 }, { x: 380, y: 20 },
      { x: 20, y: 380 }, { x: 380, y: 380 }
    ];
    
    ctx.fillStyle = '#000000';
    pockets.forEach(pocket => {
      ctx.beginPath();
      ctx.arc(pocket.x, pocket.y, 20, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw coins
    coins.forEach(coin => {
      if (!coin.pocketed) {
        ctx.fillStyle = coin.color === 'white' ? '#ffffff' : 
                       coin.color === 'black' ? '#000000' : '#ff0000';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    
    // Draw striker
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(striker.x, striker.y, striker.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw aiming line during aiming phase
    if (gamePhase === 'aiming' && power > 0) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(striker.x, striker.y);
      ctx.lineTo(
        striker.x + Math.cos(angle) * power * 2,
        striker.y + Math.sin(angle) * power * 2
      );
      ctx.stroke();
    }
  }, [coins, striker, gamePhase, power, angle]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gamePhase !== 'aiming') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const dx = mouseX - striker.x;
    const dy = mouseY - striker.y;
    setAngle(Math.atan2(dy, dx));
  };

  const shoot = () => {
    if (gamePhase !== 'aiming' || power === 0) return;
    
    const shootPower = power / 10;
    setStriker(prev => ({
      ...prev,
      vx: Math.cos(angle) * shootPower,
      vy: Math.sin(angle) * shootPower
    }));
    
    setGamePhase('moving');
    setPower(0);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updatePhysics();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (gameStarted) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, updatePhysics, draw]);

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-amber-400 via-orange-500 to-red-600">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={goBack} variant="outline" className="bg-white/90">
              ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="bg-white/90">
              ← Previous
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">🎯 Carrom Master</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Strategy & Physics in Carrom</DialogTitle>
                <DialogDescription>Learn angles, force, and strategic thinking</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 How to Play Carrom</h3>
                  <p>Use the striker to hit coins into the corner pockets. Plan your shots carefully considering angles and force!</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🧠 Skills Developed</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Angle calculation and geometry</li>
                    <li>Force and momentum understanding</li>
                    <li>Strategic planning and foresight</li>
                    <li>Hand-eye coordination</li>
                    <li>Physics concepts (friction, collision)</li>
                  </ul>
                </div>
                <div className="bg-amber-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Pro Tips:</h4>
                  <p>• Aim for optimal angles to pocket multiple coins<br/>
                     • Control power - too much force can be counterproductive<br/>
                     • Use the center circle for strategic positioning<br/>
                     • Plan 2-3 moves ahead like chess!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card className="bg-white/95">
              <CardContent className="p-4">
                <canvas
                  ref={canvasRef}
                  width={BOARD_SIZE}
                  height={BOARD_SIZE}
                  className="border-4 border-brown-600 rounded-lg cursor-crosshair"
                  onClick={handleCanvasClick}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="text-sm">Game Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>Player 1: {score.player1} points</div>
                  <div>Player 2: {score.player2} points</div>
                  <div className="font-bold">Current: Player {currentPlayer}</div>
                  <div className="capitalize">Phase: {gamePhase}</div>
                </div>
              </CardContent>
            </Card>

            {gamePhase === 'aiming' && (
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="text-sm">Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-xs mb-1">Power: {power}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={power}
                      onChange={(e) => setPower(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    onClick={shoot} 
                    disabled={power === 0}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    Shoot!
                  </Button>
                  <p className="text-xs text-gray-600">
                    Click on the board to aim, adjust power, then shoot!
                  </p>
                </CardContent>
              </Card>
            )}

            {!gameStarted ? (
              <Button onClick={initializeGame} className="w-full bg-amber-500 hover:bg-amber-600">
                Start New Game
              </Button>
            ) : (
              <Button onClick={() => { setGameStarted(false); }} className="w-full bg-red-500 hover:bg-red-600">
                Reset Game
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
