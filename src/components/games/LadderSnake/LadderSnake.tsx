
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface LadderSnakeProps {
  onBack: () => void;
}

type GameMode = 'classic' | 'educational' | 'challenge' | 'speed';
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
  consecutiveTurns: number;
  powerUps: { [key: string]: boolean };
}

interface LadderSnake {
  start: number;
  end: number;
  type: 'ladder' | 'snake';
  concept?: string;
  animation?: string;
  sound?: string;
}

interface PowerUp {
  position: number;
  type: 'double-move' | 'skip-snake' | 'extra-turn' | 'teleport';
  icon: string;
  description: string;
}

const classicLaddersSnakes: LadderSnake[] = [
  { start: 4, end: 14, type: 'ladder', concept: 'Hard work pays off!', animation: 'climb' },
  { start: 9, end: 31, type: 'ladder', concept: 'Knowledge lifts you up!', animation: 'climb' },
  { start: 21, end: 42, type: 'ladder', concept: 'Persistence leads to success!', animation: 'climb' },
  { start: 28, end: 84, type: 'ladder', concept: 'Great effort brings great rewards!', animation: 'climb' },
  { start: 51, end: 67, type: 'ladder', concept: 'Teamwork helps you rise!', animation: 'climb' },
  { start: 71, end: 91, type: 'ladder', concept: 'Wisdom opens new paths!', animation: 'climb' },
  { start: 80, end: 100, type: 'ladder', concept: 'Excellence leads to victory!', animation: 'climb' },
  { start: 17, end: 7, type: 'snake', concept: 'Shortcuts often lead backwards', animation: 'slide' },
  { start: 54, end: 34, type: 'snake', concept: 'Greed brings downfall', animation: 'slide' },
  { start: 62, end: 19, type: 'snake', concept: 'Pride comes before a fall', animation: 'slide' },
  { start: 64, end: 60, type: 'snake', concept: 'Small mistakes can cost', animation: 'slide' },
  { start: 87, end: 24, type: 'snake', concept: 'Overconfidence leads to failure', animation: 'slide' },
  { start: 93, end: 73, type: 'snake', concept: 'Near success requires caution', animation: 'slide' },
  { start: 95, end: 75, type: 'snake', concept: 'Success can make you careless', animation: 'slide' },
  { start: 99, end: 78, type: 'snake', concept: 'Final steps need most care', animation: 'slide' }
];

const powerUps: PowerUp[] = [
  { position: 15, type: 'double-move', icon: '⚡', description: 'Double your next move!' },
  { position: 35, type: 'skip-snake', icon: '🛡️', description: 'Immunity to next snake!' },
  { position: 55, type: 'extra-turn', icon: '🎯', description: 'Get an extra turn!' },
  { position: 75, type: 'teleport', icon: '🌟', description: 'Jump forward 10 spaces!' }
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
    isRolling: false,
    consecutiveTurns: 0,
    powerUps: {}
  });
  const [showConcept, setShowConcept] = useState(false);
  const [conceptMessage, setConceptMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState('');
  const [gameStats, setGameStats] = useState({
    laddersClimbed: 0,
    snakesBitten: 0,
    powerUpsCollected: 0,
    totalMoves: 0
  });

  const getLaddersSnakes = () => {
    return classicLaddersSnakes;
  };

  const rollDice = () => {
    if (gameState.isRolling || gameState.gameEnded) return;
    
    setGameState(prev => ({ ...prev, isRolling: true }));
    setGameStats(prev => ({ ...prev, totalMoves: prev.totalMoves + 1 }));
    
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }));
      rollCount++;
      
      if (rollCount >= 15) {
        clearInterval(rollInterval);
        const finalDice = Math.floor(Math.random() * 6) + 1;
        movePlayer(finalDice);
      }
    }, 80);
  };

  const movePlayer = (diceValue: number) => {
    setGameState(prev => {
      const newState = { ...prev, diceValue, isRolling: false };
      const currentPos = prev[`${prev.currentPlayer}Position` as keyof GameState] as number;
      let newPosition = currentPos + diceValue;
      
      // Apply power-ups
      if (prev.powerUps['double-move']) {
        newPosition = currentPos + (diceValue * 2);
        newState.powerUps = { ...prev.powerUps, 'double-move': false };
      }
      
      // Don't move beyond 100
      if (newPosition > 100) {
        newPosition = currentPos;
      }
      
      // Check for power-ups
      const powerUp = powerUps.find(p => p.position === newPosition);
      if (powerUp) {
        setGameStats(prevStats => ({ ...prevStats, powerUpsCollected: prevStats.powerUpsCollected + 1 }));
        newState.powerUps = { ...prev.powerUps, [powerUp.type]: true };
        setConceptMessage(`⚡ Power-up collected: ${powerUp.description}`);
        setTimeout(() => setConceptMessage(''), 3000);
        
        if (powerUp.type === 'teleport') {
          newPosition = Math.min(100, newPosition + 10);
        }
      }
      
      // Check for ladders and snakes
      const ladderSnake = getLaddersSnakes().find(ls => ls.start === newPosition);
      if (ladderSnake) {
        // Check snake immunity
        if (ladderSnake.type === 'snake' && prev.powerUps['skip-snake']) {
          newState.powerUps = { ...prev.powerUps, 'skip-snake': false };
          setConceptMessage('🛡️ Snake immunity used! Safe passage!');
          setTimeout(() => setConceptMessage(''), 3000);
        } else {
          newPosition = ladderSnake.end;
          
          if (ladderSnake.type === 'ladder') {
            setGameStats(prevStats => ({ ...prevStats, laddersClimbed: prevStats.laddersClimbed + 1 }));
            setShowAnimation('climb');
          } else {
            setGameStats(prevStats => ({ ...prevStats, snakesBitten: prevStats.snakesBitten + 1 }));
            setShowAnimation('slide');
          }
          
          if (ladderSnake.concept) {
            setConceptMessage(ladderSnake.concept);
            setTimeout(() => setConceptMessage(''), 4000);
          }
          
          setTimeout(() => setShowAnimation(''), 2000);
        }
      }
      
      // Update position
      newState[`${prev.currentPlayer}Position` as keyof GameState] = newPosition as never;
      
      // Check for winner
      if (newPosition === 100) {
        newState.gameEnded = true;
        newState.winner = prev.currentPlayer;
      } else {
        // Check for extra turn
        if (prev.powerUps['extra-turn']) {
          newState.powerUps = { ...prev.powerUps, 'extra-turn': false };
          setConceptMessage('🎯 Extra turn activated!');
          setTimeout(() => setConceptMessage(''), 2000);
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
      isRolling: false,
      consecutiveTurns: 0,
      powerUps: {}
    });
    setGameStats({
      laddersClimbed: 0,
      snakesBitten: 0,
      powerUpsCollected: 0,
      totalMoves: 0
    });
    setConceptMessage('');
    setShowAnimation('');
  };

  const getSquareContent = (position: number) => {
    const ladderSnake = getLaddersSnakes().find(ls => ls.start === position);
    const powerUp = powerUps.find(p => p.position === position);
    
    if (powerUp) return powerUp.icon;
    if (ladderSnake) return ladderSnake.type === 'ladder' ? '🪜' : '🐍';
    if (position === 100) return '👑';
    return position.toString();
  };

  const getSquareColor = (position: number) => {
    const ladderSnake = getLaddersSnakes().find(ls => ls.start === position);
    const powerUp = powerUps.find(p => p.position === position);
    
    if (position === 100) return 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-600';
    if (powerUp) return 'bg-gradient-to-br from-purple-300 to-purple-500';
    if (ladderSnake) {
      return ladderSnake.type === 'ladder' 
        ? 'bg-gradient-to-br from-green-300 to-green-500' 
        : 'bg-gradient-to-br from-red-300 to-red-500';
    }
    return (Math.floor((position - 1) / 10) + (position - 1)) % 2 === 0 
      ? 'bg-gradient-to-br from-blue-200 to-blue-300' 
      : 'bg-gradient-to-br from-amber-200 to-amber-300';
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
              relative w-10 h-10 border-2 border-gray-400 flex items-center justify-center text-xs font-bold
              transition-all duration-300 hover:scale-105
              ${getSquareColor(position)}
              ${showAnimation === 'climb' && position === gameState[`${gameState.currentPlayer}Position`] ? 'animate-bounce' : ''}
              ${showAnimation === 'slide' && position === gameState[`${gameState.currentPlayer}Position`] ? 'animate-pulse' : ''}
            `}
          >
            {getSquareContent(position)}
            
            {/* Players */}
            <div className="absolute -top-1 -right-1 flex gap-0.5">
              {isPlayer1Here && (
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              )}
              {isPlayer2Here && (
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              )}
              {isComputerHere && (
                <div className="w-3 h-3 bg-gray-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              )}
            </div>
          </div>
        );
      }
    }
    
    return squares;
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600">
      <style>{`
        @keyframes ladderClimb {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes snakeSlide {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .ladder-animation {
          animation: ladderClimb 1s ease-in-out;
        }
        .snake-animation {
          animation: snakeSlide 1s ease-in-out;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90 hover:bg-white">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🐍🪜 Snakes & Ladders Plus</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90 hover:bg-white text-purple-600">
                📖 How to Play
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Enhanced Snakes & Ladders</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-purple-600">🎯 Game Rules:</h4>
                  <p>• Roll dice to move forward</p>
                  <p>• 🪜 Ladders help you climb up quickly</p>
                  <p>• 🐍 Snakes make you slide down</p>
                  <p>• First to reach square 100 wins!</p>
                </div>
                <div>
                  <h4 className="font-bold text-purple-600">⚡ Power-ups:</h4>
                  <p>• ⚡ Double Move: Next roll counts double</p>
                  <p>• 🛡️ Snake Shield: Immunity to one snake</p>
                  <p>• 🎯 Extra Turn: Roll again immediately</p>
                  <p>• 🌟 Teleport: Jump forward 10 spaces</p>
                </div>
                <div>
                  <h4 className="font-bold text-purple-600">🎨 Player Colors:</h4>
                  <p>• 🔴 Player 1 • 🔵 Player 2 • ⚫ Computer</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-purple-700 text-xl">
                🎯 Game Board
                {showAnimation && (
                  <span className={`ml-2 ${showAnimation === 'climb' ? 'text-green-600' : 'text-red-600'}`}>
                    {showAnimation === 'climb' ? '🪜 Climbing!' : '🐍 Sliding!'}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-1 border-4 border-purple-300 rounded-lg p-2 mb-4 mx-auto w-fit bg-gradient-to-br from-purple-100 to-indigo-100">
                {renderBoard()}
              </div>
              
              {conceptMessage && (
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg text-center animate-bounce border-2 border-purple-300">
                  <p className="text-purple-800 font-medium text-lg">{conceptMessage}</p>
                </div>
              )}

              {/* Game Stats */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="bg-green-100 p-2 rounded text-center">
                  <div className="text-green-600 font-bold">🪜 {gameStats.laddersClimbed}</div>
                  <div className="text-xs">Ladders</div>
                </div>
                <div className="bg-red-100 p-2 rounded text-center">
                  <div className="text-red-600 font-bold">🐍 {gameStats.snakesBitten}</div>
                  <div className="text-xs">Snakes</div>
                </div>
                <div className="bg-purple-100 p-2 rounded text-center">
                  <div className="text-purple-600 font-bold">⚡ {gameStats.powerUpsCollected}</div>
                  <div className="text-xs">Power-ups</div>
                </div>
                <div className="bg-blue-100 p-2 rounded text-center">
                  <div className="text-blue-600 font-bold">🎲 {gameStats.totalMoves}</div>
                  <div className="text-xs">Total Moves</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control Panel */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-purple-700">🎮 Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">Game Mode</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">🎮 Classic</SelectItem>
                    <SelectItem value="educational">📚 Educational</SelectItem>
                    <SelectItem value="challenge">🎯 Challenge</SelectItem>
                    <SelectItem value="speed">⚡ Speed Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-700">Players</label>
                <Select value={players} onValueChange={(value) => setPlayers(value as '2player' | 'computer')}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2player">👥 2 Players</SelectItem>
                    <SelectItem value="computer">🤖 vs Computer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Current Player */}
              <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg border-2 border-purple-200">
                <h3 className="font-semibold mb-2 text-purple-700">Current Turn</h3>
                <div className={`text-2xl font-bold ${
                  gameState.currentPlayer === 'player1' ? 'text-red-500' : 
                  gameState.currentPlayer === 'player2' ? 'text-blue-500' : 'text-gray-600'
                }`}>
                  {gameState.currentPlayer === 'player1' ? '🔴 Player 1' :
                   gameState.currentPlayer === 'player2' ? '🔵 Player 2' : '🤖 Computer'}
                </div>
              </div>

              {/* Active Power-ups */}
              {Object.entries(gameState.powerUps).some(([_, active]) => active) && (
                <div className="bg-yellow-100 p-3 rounded-lg border-2 border-yellow-300">
                  <h4 className="font-bold text-yellow-700 mb-2">⚡ Active Power-ups:</h4>
                  {Object.entries(gameState.powerUps).map(([powerUp, active]) => active && (
                    <div key={powerUp} className="text-sm text-yellow-600 animate-pulse">
                      {powerUps.find(p => p.type === powerUp)?.icon} {powerUps.find(p => p.type === powerUp)?.description}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Dice */}
              <div className="text-center">
                <div className={`text-6xl mx-auto mb-4 w-20 h-20 flex items-center justify-center border-4 border-purple-400 rounded-xl bg-gradient-to-br from-white to-purple-50 shadow-lg ${gameState.isRolling ? 'animate-spin' : 'hover:scale-105 transition-transform'}`}>
                  {gameState.diceValue}
                </div>
                <Button 
                  onClick={rollDice}
                  disabled={gameState.isRolling || gameState.gameEnded || (gameState.currentPlayer === 'computer' && players === 'computer')}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-lg px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {gameState.isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
                </Button>
              </div>
              
              {/* Player Positions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-lg border border-red-300">
                  <span className="font-medium text-red-700 flex items-center gap-2">
                    🔴 Player 1
                    <Progress value={(gameState.player1Position / 100) * 100} className="w-16 h-2" />
                  </span>
                  <span className="font-bold text-red-800">Square {gameState.player1Position}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-300">
                  <span className="font-medium text-blue-700 flex items-center gap-2">
                    {players === '2player' ? '🔵 Player 2' : '🤖 Computer'}
                    <Progress value={((players === '2player' ? gameState.player2Position : gameState.computerPosition) / 100) * 100} className="w-16 h-2" />
                  </span>
                  <span className="font-bold text-blue-800">
                    Square {players === '2player' ? gameState.player2Position : gameState.computerPosition}
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={resetGame} 
                variant="outline" 
                className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                🔄 New Game
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Winner Dialog */}
        {gameState.gameEnded && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <Card className="bg-white p-8 text-center transform animate-scale-in border-0 shadow-2xl">
              <CardContent>
                <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  🎉 Game Complete! 🎉
                </h2>
                <div className="text-6xl mb-4 animate-bounce">
                  {gameState.winner === 'player1' ? '🔴' :
                   gameState.winner === 'player2' ? '🔵' : '🤖'}
                </div>
                <p className="text-2xl mb-6 font-bold text-gray-700">
                  {gameState.winner === 'player1' ? 'Player 1' :
                   gameState.winner === 'player2' ? 'Player 2' : 'Computer'} Wins!
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <div className="text-sm text-purple-600">Game Stats</div>
                    <div className="text-lg font-bold text-purple-800">
                      🪜 {gameStats.laddersClimbed} 🐍 {gameStats.snakesBitten}
                    </div>
                  </div>
                  <div className="bg-indigo-100 p-4 rounded-lg">
                    <div className="text-sm text-indigo-600">Total Moves</div>
                    <div className="text-lg font-bold text-indigo-800">{gameStats.totalMoves}</div>
                  </div>
                </div>
                
                <Button 
                  onClick={resetGame} 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🎮 Play Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
