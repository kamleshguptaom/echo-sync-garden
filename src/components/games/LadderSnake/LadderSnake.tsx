
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LadderSnakeProps {
  onBack: () => void;
}

type GameMode = 'classic' | 'educational' | 'challenge';
type Player = 'player1' | 'player2' | 'computer';

interface GameState {
  currentPlayer: Player;
  player1Position: number;
  player2Position: number;
  computerPosition?: number;
  diceValue: number;
  gameEnded: boolean;
  winner: Player | null;
  isRolling: boolean;
}

interface LadderSnake {
  start: number;
  end: number;
  type: 'ladder' | 'snake';
  concept?: string;
}

const classicLaddersSnakes: LadderSnake[] = [
  { start: 4, end: 14, type: 'ladder' },
  { start: 9, end: 31, type: 'ladder' },
  { start: 21, end: 42, type: 'ladder' },
  { start: 28, end: 84, type: 'ladder' },
  { start: 51, end: 67, type: 'ladder' },
  { start: 71, end: 91, type: 'ladder' },
  { start: 80, end: 100, type: 'ladder' },
  { start: 17, end: 7, type: 'snake' },
  { start: 54, end: 34, type: 'snake' },
  { start: 62, end: 19, type: 'snake' },
  { start: 64, end: 60, type: 'snake' },
  { start: 87, end: 24, type: 'snake' },
  { start: 93, end: 73, type: 'snake' },
  { start: 95, end: 75, type: 'snake' },
  { start: 99, end: 78, type: 'snake' }
];

const educationalLaddersSnakes: LadderSnake[] = [
  { start: 5, end: 25, type: 'ladder', concept: 'Reading helps you climb higher!' },
  { start: 15, end: 35, type: 'ladder', concept: 'Practice makes perfect!' },
  { start: 45, end: 65, type: 'ladder', concept: 'Teamwork leads to success!' },
  { start: 75, end: 95, type: 'ladder', concept: 'Knowledge is power!' },
  { start: 20, end: 8, type: 'snake', concept: 'Laziness makes you fall behind' },
  { start: 40, end: 18, type: 'snake', concept: 'Cheating never pays off' },
  { start: 60, end: 30, type: 'snake', concept: 'Giving up is going backwards' },
  { start: 85, end: 55, type: 'snake', concept: 'Pride comes before a fall' }
];

export const LadderSnake: React.FC<LadderSnakeProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [players, setPlayers] = useState<'2player' | 'computer'>('2player');
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 'player1',
    player1Position: 0,
    player2Position: 0,
    computerPosition: 0,
    diceValue: 1,
    gameEnded: false,
    winner: null,
    isRolling: false
  });
  const [showConcept, setShowConcept] = useState(false);
  const [conceptMessage, setConceptMessage] = useState('');

  const getLaddersSnakes = () => {
    return gameMode === 'educational' ? educationalLaddersSnakes : classicLaddersSnakes;
  };

  const rollDice = () => {
    if (gameState.isRolling || gameState.gameEnded) return;
    
    setGameState(prev => ({ ...prev, isRolling: true }));
    
    // Simulate dice rolling animation
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }));
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalDice = Math.floor(Math.random() * 6) + 1;
        movePlayer(finalDice);
      }
    }, 100);
  };

  const movePlayer = (diceValue: number) => {
    setGameState(prev => {
      const newState = { ...prev, diceValue, isRolling: false };
      const currentPos = prev[`${prev.currentPlayer}Position` as keyof GameState] as number;
      let newPosition = currentPos + diceValue;
      
      // Don't move beyond 100
      if (newPosition > 100) {
        newPosition = currentPos;
      }
      
      // Check for ladders and snakes
      const ladderSnake = getLaddersSnakes().find(ls => ls.start === newPosition);
      if (ladderSnake) {
        newPosition = ladderSnake.end;
        if (ladderSnake.concept && gameMode === 'educational') {
          setConceptMessage(ladderSnake.concept);
          setTimeout(() => setConceptMessage(''), 3000);
        }
      }
      
      // Update position
      newState[`${prev.currentPlayer}Position` as keyof GameState] = newPosition as never;
      
      // Check for winner
      if (newPosition === 100) {
        newState.gameEnded = true;
        newState.winner = prev.currentPlayer;
      } else {
        // Switch player
        if (players === '2player') {
          newState.currentPlayer = prev.currentPlayer === 'player1' ? 'player2' : 'player1';
        } else {
          newState.currentPlayer = prev.currentPlayer === 'player1' ? 'computer' : 'player1';
          
          // Computer's turn
          if (newState.currentPlayer === 'computer' && !newState.gameEnded) {
            setTimeout(() => {
              const computerDice = Math.floor(Math.random() * 6) + 1;
              movePlayer(computerDice);
            }, 1500);
          }
        }
      }
      
      return newState;
    });
  };

  const resetGame = () => {
    setGameState({
      currentPlayer: 'player1',
      player1Position: 0,
      player2Position: 0,
      computerPosition: 0,
      diceValue: 1,
      gameEnded: false,
      winner: null,
      isRolling: false
    });
    setConceptMessage('');
  };

  const getSquareContent = (position: number) => {
    const ladderSnake = getLaddersSnakes().find(ls => ls.start === position);
    if (ladderSnake) {
      return ladderSnake.type === 'ladder' ? '🪜' : '🐍';
    }
    return position.toString();
  };

  const getSquareColor = (position: number) => {
    const ladderSnake = getLaddersSnakes().find(ls => ls.start === position);
    if (ladderSnake) {
      return ladderSnake.type === 'ladder' ? 'bg-green-200' : 'bg-red-200';
    }
    return (Math.floor((position - 1) / 10) + (position - 1)) % 2 === 0 ? 'bg-yellow-100' : 'bg-blue-100';
  };

  const renderBoard = () => {
    const squares = [];
    
    for (let row = 9; row >= 0; row--) {
      for (let col = 0; col < 10; col++) {
        const position = row % 2 === 1 
          ? row * 10 + (10 - col) 
          : row * 10 + col + 1;
        
        const isPlayer1Here = gameState.player1Position === position;
        const isPlayer2Here = gameState.player2Position === position;
        const isComputerHere = players === 'computer' && gameState.computerPosition === position;
        
        squares.push(
          <div
            key={position}
            className={`
              relative w-8 h-8 border border-gray-400 flex items-center justify-center text-xs font-bold
              ${getSquareColor(position)}
              ${position === 100 ? 'bg-gold-300 border-yellow-500' : ''}
            `}
          >
            {getSquareContent(position)}
            
            {/* Players */}
            <div className="absolute -top-1 -right-1 flex gap-0.5">
              {isPlayer1Here && <div className="w-2 h-2 bg-red-500 rounded-full border border-white"></div>}
              {isPlayer2Here && <div className="w-2 h-2 bg-blue-500 rounded-full border border-white"></div>}
              {isComputerHere && <div className="w-2 h-2 bg-gray-500 rounded-full border border-white"></div>}
            </div>
          </div>
        );
      }
    }
    
    return squares;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🐍🪜 Snakes & Ladders</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Snakes & Ladders</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>1. Roll the dice to move your piece</p>
                <p>2. Climb ladders to move up quickly 🪜</p>
                <p>3. Avoid snakes or slide down 🐍</p>
                <p>4. First player to reach square 100 wins!</p>
                <p><strong>Educational Mode:</strong> Learn life lessons with each ladder and snake</p>
                <p><strong>Red dot:</strong> Player 1, <strong>Blue dot:</strong> Player 2, <strong>Gray dot:</strong> Computer</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <Card className="lg:col-span-2 bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Game Board</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-0 border-2 border-gray-600 mb-4 mx-auto w-fit">
                {renderBoard()}
              </div>
              
              {conceptMessage && (
                <div className="bg-blue-100 p-3 rounded-lg text-center animate-bounce">
                  <p className="text-blue-800 font-medium">{conceptMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Control Panel */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Game Mode</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">🎮 Classic</SelectItem>
                    <SelectItem value="educational">📚 Educational</SelectItem>
                    <SelectItem value="challenge">🎯 Challenge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Players</label>
                <Select value={players} onValueChange={(value) => setPlayers(value as '2player' | 'computer')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2player">👥 2 Players</SelectItem>
                    <SelectItem value="computer">🤖 vs Computer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Current Player */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Current Turn</h3>
                <div className={`text-2xl font-bold ${
                  gameState.currentPlayer === 'player1' ? 'text-red-500' : 
                  gameState.currentPlayer === 'player2' ? 'text-blue-500' : 'text-gray-500'
                }`}>
                  {gameState.currentPlayer === 'player1' ? '🔴 Player 1' :
                   gameState.currentPlayer === 'player2' ? '🔵 Player 2' : '🤖 Computer'}
                </div>
              </div>
              
              {/* Dice */}
              <div className="text-center">
                <div className={`text-6xl mx-auto mb-4 w-20 h-20 flex items-center justify-center border-4 border-gray-400 rounded-lg bg-white ${gameState.isRolling ? 'animate-spin' : ''}`}>
                  {gameState.diceValue}
                </div>
                <Button 
                  onClick={rollDice}
                  disabled={gameState.isRolling || gameState.gameEnded || (gameState.currentPlayer === 'computer' && players === 'computer')}
                  className="bg-green-500 hover:bg-green-600 text-lg px-6 py-3"
                >
                  {gameState.isRolling ? 'Rolling...' : '🎲 Roll Dice'}
                </Button>
              </div>
              
              {/* Player Positions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="font-medium text-red-600">🔴 Player 1</span>
                  <span className="font-bold">Square {gameState.player1Position}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="font-medium text-blue-600">
                    {players === '2player' ? '🔵 Player 2' : '🤖 Computer'}
                  </span>
                  <span className="font-bold">
                    Square {players === '2player' ? gameState.player2Position : gameState.computerPosition}
                  </span>
                </div>
              </div>
              
              <Button onClick={resetGame} variant="outline" className="w-full">
                🔄 New Game
              </Button>
              
              <Dialog open={showConcept} onOpenChange={setShowConcept}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    📚 Game Concepts
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Snakes & Ladders Concepts</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Game Elements:</h4>
                      <p className="text-sm">• Probability: Each dice roll has equal 1/6 chance</p>
                      <p className="text-sm">• Strategy vs Luck: Pure chance-based movement</p>
                      <p className="text-sm">• Risk & Reward: Ladders help, snakes hinder</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Life Lessons (Educational Mode):</h4>
                      <p className="text-sm">• Good deeds help you progress (ladders)</p>
                      <p className="text-sm">• Bad choices set you back (snakes)</p>
                      <p className="text-sm">• Persistence leads to success</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Mathematical Concepts:</h4>
                      <p className="text-sm">• Counting and number recognition</p>
                      <p className="text-sm">• Addition (current position + dice roll)</p>
                      <p className="text-sm">• Spatial awareness and navigation</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
        
        {/* Winner Dialog */}
        {gameState.gameEnded && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white p-6 text-center">
              <CardContent>
                <h2 className="text-3xl font-bold mb-4 text-green-600">🎉 Game Over! 🎉</h2>
                <p className="text-xl mb-4">
                  {gameState.winner === 'player1' ? '🔴 Player 1' :
                   gameState.winner === 'player2' ? '🔵 Player 2' : '🤖 Computer'} Wins!
                </p>
                <Button onClick={resetGame} className="bg-green-500 hover:bg-green-600">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
