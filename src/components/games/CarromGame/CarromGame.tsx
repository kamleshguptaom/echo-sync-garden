
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface CarromGameProps {
  onBack: () => void;
}

type GameMode = 'practice' | 'tournament' | 'challenge';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Piece {
  id: string;
  x: number;
  y: number;
  color: 'white' | 'black' | 'red' | 'striker';
  inPocket: boolean;
  velocity: { x: number; y: number };
}

interface HandGesture {
  type: 'aim' | 'power' | 'spin';
  intensity: number;
}

export const CarromGame: React.FC<CarromGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [strikerPosition, setStrikerPosition] = useState({ x: 200, y: 350 });
  const [aimAngle, setAimAngle] = useState(0);
  const [power, setPower] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [handGesture, setHandGesture] = useState<HandGesture>({ type: 'aim', intensity: 0 });
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const boardSize = 400;
  const pieceSize = 20;

  const initializeBoard = () => {
    const newPieces: Piece[] = [];
    
    // Create pieces in formation
    const centerX = boardSize / 2;
    const centerY = boardSize / 2;
    
    // White pieces
    for (let i = 0; i < 9; i++) {
      const angle = (i * 40) * (Math.PI / 180);
      newPieces.push({
        id: `white_${i}`,
        x: centerX + Math.cos(angle) * 60,
        y: centerY + Math.sin(angle) * 60,
        color: 'white',
        inPocket: false,
        velocity: { x: 0, y: 0 }
      });
    }
    
    // Black pieces
    for (let i = 0; i < 9; i++) {
      const angle = (i * 40 + 20) * (Math.PI / 180);
      newPieces.push({
        id: `black_${i}`,
        x: centerX + Math.cos(angle) * 80,
        y: centerY + Math.sin(angle) * 80,
        color: 'black',
        inPocket: false,
        velocity: { x: 0, y: 0 }
      });
    }
    
    // Red queen
    newPieces.push({
      id: 'queen',
      x: centerX,
      y: centerY,
      color: 'red',
      inPocket: false,
      velocity: { x: 0, y: 0 }
    });
    
    setPieces(newPieces);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameFinished(false);
    setScore({ player1: 0, player2: 0 });
    setCurrentPlayer('player1');
    initializeBoard();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAiming || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const angle = Math.atan2(mouseY - strikerPosition.y, mouseX - strikerPosition.x);
    setAimAngle(angle);
    
    // Update hand gesture for aiming
    setHandGesture({ type: 'aim', intensity: 50 });
  };

  const handlePowerAdjust = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAiming) return;
    
    const powerLevel = Math.min(100, Math.max(0, power + 10));
    setPower(powerLevel);
    setHandGesture({ type: 'power', intensity: powerLevel });
  };

  const handleShot = () => {
    if (!isAiming || power === 0) return;
    
    setHandGesture({ type: 'spin', intensity: power });
    
    // Simulate shot physics
    const shotVelocity = {
      x: Math.cos(aimAngle) * (power / 10),
      y: Math.sin(aimAngle) * (power / 10)
    };
    
    // Update pieces with collision simulation
    setPieces(prevPieces => prevPieces.map(piece => {
      const distance = Math.sqrt(
        Math.pow(piece.x - strikerPosition.x, 2) + 
        Math.pow(piece.y - strikerPosition.y, 2)
      );
      
      if (distance < 50) {
        return {
          ...piece,
          velocity: {
            x: shotVelocity.x * 0.8,
            y: shotVelocity.y * 0.8
          }
        };
      }
      return piece;
    }));
    
    setIsAiming(false);
    setPower(0);
    
    // Switch player after shot
    setTimeout(() => {
      setCurrentPlayer(prev => prev === 'player1' ? 'player2' : 'player1');
    }, 2000);
  };

  const handleDragStart = (e: React.DragEvent, pieceId: string) => {
    setDraggedPiece(pieceId);
    setHandGesture({ type: 'aim', intensity: 30 });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedPiece || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;
    
    setPieces(prevPieces => prevPieces.map(piece => {
      if (piece.id === draggedPiece) {
        return { ...piece, x: dropX, y: dropY };
      }
      return piece;
    }));
    
    setDraggedPiece(null);
    setHandGesture({ type: 'power', intensity: 0 });
  };

  const renderHandGesture = () => {
    const gestureEmoji = {
      aim: '👉',
      power: '✊',
      spin: '🌀'
    };
    
    return (
      <div className="absolute top-4 right-4 text-4xl animate-pulse">
        {gestureEmoji[handGesture.type]}
        <div className="text-sm text-center mt-1">
          {handGesture.type.toUpperCase()}
        </div>
      </div>
    );
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
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-400">
      <style>{`
        .carrom-board {
          background: #8B4513;
          border: 8px solid #654321;
          position: relative;
        }
        .carrom-piece {
          border-radius: 50%;
          border: 2px solid #333;
          cursor: pointer;
          transition: all 0.3s ease;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          user-select: none;
        }
        .carrom-piece:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .carrom-piece.white {
          background: #FFFFFF;
          color: #333;
        }
        .carrom-piece.black {
          background: #2C2C2C;
          color: #FFF;
        }
        .carrom-piece.red {
          background: #DC2626;
          color: #FFF;
        }
        .carrom-piece.striker {
          background: #FBBF24;
          border: 3px solid #F59E0B;
        }
        .pocket {
          position: absolute;
          width: 40px;
          height: 40px;
          background: #000;
          border-radius: 50%;
          border: 3px solid #333;
        }
        .aim-line {
          position: absolute;
          background: red;
          height: 2px;
          transform-origin: left center;
          opacity: 0.7;
          z-index: 10;
        }
        .power-meter {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 200px;
          height: 20px;
          background: #333;
          border-radius: 10px;
          overflow: hidden;
        }
        .power-fill {
          height: 100%;
          background: linear-gradient(to right, #10B981, #F59E0B, #DC2626);
          transition: width 0.3s ease;
        }
        @keyframes handGesture {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .hand-gesture {
          animation: handGesture 1s infinite;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={goBack} variant="outline" className="bg-white/90">
              ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">🎯 Carrom Master</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-amber-500 text-white hover:bg-amber-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Carrom Game Strategy</DialogTitle>
                <DialogDescription>Master precision and strategy in this classic board game</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Game Objective</h3>
                  <p>Use the striker to pocket your assigned pieces (white or black) and the red queen to score points. First to pocket all pieces wins!</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎮 Controls</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Mouse:</strong> Aim and adjust power</li>
                    <li><strong>Drag & Drop:</strong> Fine positioning</li>
                    <li><strong>Hand Gestures:</strong> Visual feedback for actions</li>
                  </ul>
                </div>
                <div className="bg-amber-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">🏆 Strategy Tips:</h4>
                  <p>• Plan your shots carefully<br/>
                     • Use angles and rebounds<br/>
                     • Control the striker power<br/>
                     • Watch opponent's pieces</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Carrom Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Game Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="practice">Practice Mode</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="challenge">Challenge Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-amber-500 hover:bg-amber-600">
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>Player 1: {score.player1}</span>
                <span>Current: {currentPlayer}</span>
                <span>Player 2: {score.player2}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={boardRef}
                className="carrom-board mx-auto relative"
                style={{ width: boardSize, height: boardSize }}
                onMouseMove={handleMouseMove}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Hand gesture indicator */}
                {renderHandGesture()}
                
                {/* Corner pockets */}
                <div className="pocket" style={{ top: -20, left: -20 }} />
                <div className="pocket" style={{ top: -20, right: -20 }} />
                <div className="pocket" style={{ bottom: -20, left: -20 }} />
                <div className="pocket" style={{ bottom: -20, right: -20 }} />
                
                {/* Game pieces */}
                {pieces.filter(piece => !piece.inPocket).map((piece) => (
                  <div
                    key={piece.id}
                    className={`carrom-piece ${piece.color}`}
                    style={{
                      left: piece.x - pieceSize/2,
                      top: piece.y - pieceSize/2,
                      width: pieceSize,
                      height: pieceSize
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                  >
                    {piece.color === 'red' ? '👑' : piece.color === 'white' ? 'W' : 'B'}
                  </div>
                ))}
                
                {/* Striker */}
                <div
                  className="carrom-piece striker"
                  style={{
                    left: strikerPosition.x - pieceSize/2,
                    top: strikerPosition.y - pieceSize/2,
                    width: pieceSize + 4,
                    height: pieceSize + 4
                  }}
                  onClick={() => setIsAiming(!isAiming)}
                >
                  S
                </div>
                
                {/* Aim line */}
                {isAiming && (
                  <div
                    className="aim-line"
                    style={{
                      left: strikerPosition.x,
                      top: strikerPosition.y,
                      width: 100,
                      transform: `rotate(${aimAngle}rad)`
                    }}
                  />
                )}
                
                {/* Power meter */}
                {isAiming && (
                  <div className="power-meter">
                    <div 
                      className="power-fill"
                      style={{ width: `${power}%` }}
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center space-x-4">
                <Button 
                  onClick={() => setIsAiming(!isAiming)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isAiming ? 'Cancel Aim' : 'Aim'}
                </Button>
                <Button 
                  onClick={handlePowerAdjust}
                  disabled={!isAiming}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Power +
                </Button>
                <Button 
                  onClick={handleShot}
                  disabled={!isAiming || power === 0}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Shoot!
                </Button>
              </div>
              
              {gameFinished && (
                <div className="text-center mt-6 space-y-4">
                  <h2 className="text-3xl font-bold">🏆 Game Complete!</h2>
                  <p className="text-xl">
                    Winner: {score.player1 > score.player2 ? 'Player 1' : 'Player 2'}
                  </p>
                  <Button onClick={() => { setGameStarted(false); setGameFinished(false); }} className="bg-amber-500 hover:bg-amber-600">
                    New Game
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
