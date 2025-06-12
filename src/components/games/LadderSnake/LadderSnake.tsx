import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GameBoard } from './GameBoard';
import { GameControls } from './GameControls';
import { getGameConfig, getPowerUps } from './gameConfig';
import { GameState, GameMode, GameStats } from './types';

interface LadderSnakeProps {
  onBack: () => void;
}

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
  const [conceptMessage, setConceptMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState('');
  const [gameStats, setGameStats] = useState<GameStats>({
    laddersClimbed: 0,
    snakesBitten: 0,
    powerUpsCollected: 0,
    totalMoves: 0
  });

  // Real-time game updates when mode or players change
  useEffect(() => {
    resetGame();
  }, [gameMode, players]);

  const laddersSnakes = [...getGameConfig(gameMode).ladders, ...getGameConfig(gameMode).snakes];
  const powerUps = getPowerUps(gameMode);

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
      
      if (prev.powerUps['mega-jump']) {
        newPosition = Math.min(100, currentPos + 15);
        newState.powerUps = { ...prev.powerUps, 'mega-jump': false };
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
      const ladderSnake = laddersSnakes.find(ls => ls.start === newPosition);
      if (ladderSnake) {
        // Check snake immunity
        if (ladderSnake.type === 'snake' && (prev.powerUps['skip-snake'] || prev.powerUps['shield'])) {
          if (prev.powerUps['skip-snake']) {
            newState.powerUps = { ...prev.powerUps, 'skip-snake': false };
          } else if (prev.powerUps['shield']) {
            // Shield protects from 2 snakes, so we keep it active
            setConceptMessage('🔰 Shield protection activated!');
          }
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
                  <p>• 🚀 Mega Jump: Jump forward 15 spaces</p>
                  <p>• 🔰 Shield: Immunity to next 2 snakes</p>
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
                🎯 Game Board - {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode
                {showAnimation && (
                  <span className={`ml-2 ${showAnimation === 'climb' ? 'text-green-600' : 'text-red-600'}`}>
                    {showAnimation === 'climb' ? '🪜 Climbing!' : '🐍 Sliding!'}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GameBoard
                gameState={gameState}
                players={players}
                showAnimation={showAnimation}
                laddersSnakes={laddersSnakes}
                powerUps={powerUps}
              />
              
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
            <CardContent>
              <GameControls
                gameMode={gameMode}
                setGameMode={setGameMode}
                players={players}
                setPlayers={setPlayers}
                gameState={gameState}
                rollDice={rollDice}
                resetGame={resetGame}
                powerUps={powerUps}
              />
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
