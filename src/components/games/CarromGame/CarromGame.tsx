
import React, { useState, useRef, useEffect } from 'react';
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
}

export const CarromGame: React.FC<CarromGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [striker, setStriker] = useState({ x: 200, y: 350, angle: 0, power: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const initializeGame = () => {
    const newCoins: Coin[] = [];
    
    // Add black and white coins in diamond formation
    const centerX = 200;
    const centerY = 200;
    
    for (let i = 0; i < 9; i++) {
      newCoins.push({
        x: centerX + (i % 3 - 1) * 25,
        y: centerY + Math.floor(i / 3) * 25,
        vx: 0,
        vy: 0,
        color: i % 2 === 0 ? 'black' : 'white',
        pocketed: false
      });
    }
    
    // Add red coin (queen)
    newCoins.push({
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      color: 'red',
      pocketed: false
    });
    
    setCoins(newCoins);
    setGameStarted(true);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and draw board
    ctx.fillStyle = '#deb887';
    ctx.fillRect(0, 0, 400, 400);
    
    // Draw border
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, 400, 400);
    
    // Draw corners (pockets)
    const pockets = [[20, 20], [380, 20], [20, 380], [380, 380]];
    ctx.fillStyle = '#000000';
    pockets.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw coins
    coins.forEach(coin => {
      if (!coin.pocketed) {
        ctx.fillStyle = coin.color === 'white' ? '#ffffff' : 
                       coin.color === 'black' ? '#000000' : '#ff0000';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    
    // Draw striker
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(striker.x, striker.y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    if (gameStarted) {
      draw();
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline">← Back to Hub</Button>
            <Button onClick={() => window.history.back()} variant="outline">← Previous</Button>
          </div>
          <h1 className="text-3xl font-bold text-white">🎯 Carrom Board</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white">🧠 Concept</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Strategy & Physics</DialogTitle>
                <DialogDescription>Learn angles and force through carrom</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Carrom teaches:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Angle calculation</li>
                  <li>Force application</li>
                  <li>Strategic planning</li>
                  <li>Hand-eye coordination</li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border-2 border-gray-300 rounded"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>Player 1: {score.player1}</div>
                  <div>Player 2: {score.player2}</div>
                  <div>Current: Player {currentPlayer}</div>
                </div>
              </CardContent>
            </Card>

            {!gameStarted ? (
              <Button onClick={initializeGame} className="w-full">Start Game</Button>
            ) : (
              <Button onClick={() => window.location.reload()} className="w-full">New Game</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
