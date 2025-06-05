
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface GolfGameProps {
  onBack: () => void;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  inHole: boolean;
}

interface Hole {
  x: number;
  y: number;
  radius: number;
  par: number;
}

export const GolfGame: React.FC<GolfGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ball, setBall] = useState<Ball>({ x: 50, y: 300, vx: 0, vy: 0, inHole: false });
  const [hole, setHole] = useState<Hole>({ x: 550, y: 200, radius: 20, par: 3 });
  const [isAiming, setIsAiming] = useState(false);
  const [power, setPower] = useState(0);
  const [angle, setAngle] = useState(0);
  const [strokes, setStrokes] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [currentHole, setCurrentHole] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setBall({ x: 50, y: 300, vx: 0, vy: 0, inHole: false });
    setStrokes(0);
  };

  const shoot = () => {
    if (ball.inHole) return;
    
    const speed = power * 0.2;
    setBall(prev => ({
      ...prev,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    }));
    setStrokes(strokes + 1);
    setPower(0);
  };

  useEffect(() => {
    if (!gameStarted) return;
    
    const interval = setInterval(() => {
      setBall(prev => {
        if (prev.inHole) return prev;
        
        let newX = prev.x + prev.vx;
        let newY = prev.y + prev.vy;
        let newVx = prev.vx * 0.98; // friction
        let newVy = prev.vy * 0.98;
        
        // Boundaries
        if (newX < 10 || newX > 590) newVx = -newVx * 0.7;
        if (newY < 10 || newY > 390) newVy = -newVy * 0.7;
        
        newX = Math.max(10, Math.min(590, newX));
        newY = Math.max(10, Math.min(390, newY));
        
        // Check if ball is in hole
        const distToHole = Math.sqrt((newX - hole.x) ** 2 + (newY - hole.y) ** 2);
        if (distToHole < hole.radius) {
          return { x: hole.x, y: hole.y, vx: 0, vy: 0, inHole: true };
        }
        
        // Stop if moving very slowly
        if (Math.abs(newVx) < 0.1 && Math.abs(newVy) < 0.1) {
          newVx = 0;
          newVy = 0;
        }
        
        return { x: newX, y: newY, vx: newVx, vy: newVy, inHole: false };
      });
    }, 16);
    
    return () => clearInterval(interval);
  }, [gameStarted, hole]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, 0, 600, 400);
    
    // Draw hole
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw ball
    ctx.fillStyle = ball.inHole ? '#fbbf24' : '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    
    // Draw aiming line
    if (isAiming && !ball.inHole) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(
        ball.x + Math.cos(angle) * power * 2,
        ball.y + Math.sin(angle) * power * 2
      );
      ctx.stroke();
    }
  };

  useEffect(() => {
    draw();
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isAiming || ball.inHole) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setAngle(Math.atan2(mouseY - ball.y, mouseX - ball.x));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline">← Back to Hub</Button>
            <Button onClick={() => window.history.back()} variant="outline">← Previous</Button>
          </div>
          <h1 className="text-3xl font-bold text-white">⛳ Mini Golf</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white">🧠 Concept</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Physics & Precision</DialogTitle>
                <DialogDescription>Learn physics through golf mechanics</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Mini golf teaches physics concepts like:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Force and motion</li>
                  <li>Friction and energy loss</li>
                  <li>Angle and trajectory</li>
                  <li>Momentum conservation</li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <Card>
              <CardContent className="p-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border-2 border-gray-300 rounded cursor-pointer"
                  onMouseMove={handleMouseMove}
                  onMouseDown={() => setIsAiming(true)}
                  onMouseUp={() => {
                    setIsAiming(false);
                    shoot();
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Game Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>Hole: {currentHole}</div>
                  <div>Par: {hole.par}</div>
                  <div>Strokes: {strokes}</div>
                  <div>Score: {totalScore}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Power</CardTitle>
              </CardHeader>
              <CardContent>
                <Slider
                  value={[power]}
                  onValueChange={(value) => setPower(value[0])}
                  max={100}
                  min={0}
                  step={5}
                />
                <div className="text-center mt-2">{power}%</div>
              </CardContent>
            </Card>

            {!gameStarted ? (
              <Button onClick={startGame} className="w-full">Start Game</Button>
            ) : (
              <Button onClick={() => window.location.reload()} className="w-full">New Game</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
