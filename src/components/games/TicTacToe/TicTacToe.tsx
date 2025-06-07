
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface TicTacToeProps {
  onBack: () => void;
}

type GameMode = 'human-vs-human' | 'human-vs-ai';
type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';
type Player = 'X' | 'O' | null;

interface GameState {
  board: Player[];
  currentPlayer: Player;
  winner: Player | 'tie' | null;
  gameOver: boolean;
}

export const TicTacToe: React.FC<TicTacToeProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('human-vs-ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    gameOver: false
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0, ties: 0 });
  const [showConcept, setShowConcept] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);

  const checkWinner = (board: Player[]): Player | 'tie' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'tie';
    }

    return null;
  };

  const minimax = (board: Player[], depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    const winner = checkWinner(board);
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'tie') return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const eval_ = minimax(board, depth + 1, false, alpha, beta);
          board[i] = null;
          maxEval = Math.max(maxEval, eval_);
          alpha = Math.max(alpha, eval_);
          if (beta <= alpha) break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const eval_ = minimax(board, depth + 1, true, alpha, beta);
          board[i] = null;
          minEval = Math.min(minEval, eval_);
          beta = Math.min(beta, eval_);
          if (beta <= alpha) break;
        }
      }
      return minEval;
    }
  };

  const getAIMove = (board: Player[]): number => {
    const emptySpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    if (emptySpots.length === 0) return -1;

    switch (difficulty) {
      case 'easy':
        return emptySpots[Math.floor(Math.random() * emptySpots.length)];
      
      case 'medium':
        if (Math.random() < 0.7) {
          let bestMove = -1;
          let bestValue = -Infinity;
          
          for (const spot of emptySpots) {
            board[spot] = 'O';
            const moveValue = minimax(board, 0, false);
            board[spot] = null;
            
            if (moveValue > bestValue) {
              bestValue = moveValue;
              bestMove = spot;
            }
          }
          return bestMove;
        } else {
          return emptySpots[Math.floor(Math.random() * emptySpots.length)];
        }
      
      case 'hard':
      case 'impossible':
        let bestMove = -1;
        let bestValue = -Infinity;
        
        for (const spot of emptySpots) {
          board[spot] = 'O';
          const moveValue = minimax(board, 0, false);
          board[spot] = null;
          
          if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = spot;
          }
        }
        return bestMove;
      
      default:
        return emptySpots[0];
    }
  };

  const makeMove = (index: number) => {
    if (gameState.board[index] || gameState.gameOver) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = checkWinner(newBoard);
    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      gameOver: winner !== null
    };

    setGameState(newGameState);

    if (winner) {
      setScore(prev => ({
        ...prev,
        [winner === 'tie' ? 'ties' : winner]: prev[winner === 'tie' ? 'ties' : winner] + 1
      }));
    }
  };

  useEffect(() => {
    if (gameMode === 'human-vs-ai' && gameState.currentPlayer === 'O' && !gameState.gameOver && gameStarted) {
      setAiThinking(true);
      const timer = setTimeout(() => {
        const aiMove = getAIMove([...gameState.board]);
        if (aiMove !== -1) {
          makeMove(aiMove);
        }
        setAiThinking(false);
      }, difficulty === 'easy' ? 500 : difficulty === 'medium' ? 1000 : 1500);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameOver, gameStarted, gameMode, difficulty]);

  const startGame = () => {
    setGameStarted(true);
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      gameOver: false
    });
  };

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      gameOver: false
    });
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, ties: 0 });
  };

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  const getDifficultyDescription = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'AI makes random moves';
      case 'medium': return 'AI plays smart 70% of the time';
      case 'hard': return 'AI always plays optimally';
      case 'impossible': return 'Perfect AI - you cannot win';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600">
      <style>{`
        .board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          background: #333;
          padding: 4px;
          border-radius: 8px;
          max-width: 300px;
          margin: 0 auto;
        }
        .cell {
          aspect-ratio: 1;
          background: white;
          border: none;
          font-size: 2rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cell:hover:not(:disabled) {
          background: #f0f0f0;
          transform: scale(1.05);
        }
        .cell:disabled {
          cursor: not-allowed;
        }
        .cell.x {
          color: #3B82F6;
        }
        .cell.o {
          color: #EF4444;
        }
        .winner-animation {
          animation: winner 0.5s ease-in-out;
        }
        @keyframes winner {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .ai-thinking {
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={goBack} variant="outline" className="bg-white/90">
              ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">⭕ Tic Tac Toe Pro</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Strategic Thinking & Game Theory</DialogTitle>
                <DialogDescription>Master logical reasoning and pattern recognition</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Game Strategy</h3>
                  <p>Tic Tac Toe teaches strategic thinking, pattern recognition, and planning ahead. Learn to anticipate opponent moves and create winning opportunities.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🧠 Skills Developed</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Strategic Planning:</strong> Think multiple moves ahead</li>
                    <li><strong>Pattern Recognition:</strong> Identify winning/blocking patterns</li>
                    <li><strong>Decision Making:</strong> Choose optimal moves under pressure</li>
                    <li><strong>Game Theory:</strong> Understand minimax strategy</li>
                  </ul>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Winning Tips:</h4>
                  <p>• Control the center square<br/>
                     • Create multiple winning threats<br/>
                     • Block opponent's winning moves<br/>
                     • Think defensively and offensively</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Tic Tac Toe Pro Settings</CardTitle>
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
                      <SelectItem value="human-vs-human">👥 Human vs Human</SelectItem>
                      <SelectItem value="human-vs-ai">🤖 Human vs AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {gameMode === 'human-vs-ai' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">AI Difficulty</label>
                    <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">😊 Easy</SelectItem>
                        <SelectItem value="medium">😐 Medium</SelectItem>
                        <SelectItem value="hard">😤 Hard</SelectItem>
                        <SelectItem value="impossible">😈 Impossible</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-600 mt-1">{getDifficultyDescription(difficulty)}</p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600">
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>X Wins: {score.X}</span>
                <span className={aiThinking ? 'ai-thinking' : ''}>
                  {gameState.gameOver 
                    ? (gameState.winner === 'tie' ? '🤝 Tie Game!' : `🏆 ${gameState.winner} Wins!`)
                    : aiThinking 
                      ? '🤖 AI Thinking...'
                      : `${gameState.currentPlayer}'s Turn`
                  }
                </span>
                <span>O Wins: {score.O}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`board ${gameState.gameOver ? 'winner-animation' : ''}`}>
                {gameState.board.map((cell, index) => (
                  <button
                    key={index}
                    className={`cell ${cell?.toLowerCase() || ''}`}
                    onClick={() => makeMove(index)}
                    disabled={!!cell || gameState.gameOver || aiThinking}
                  >
                    {cell}
                  </button>
                ))}
              </div>

              <div className="text-center space-x-4">
                <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600">
                  New Round
                </Button>
                <Button onClick={resetScore} variant="outline">
                  Reset Score
                </Button>
                <Button onClick={() => setGameStarted(false)} variant="outline">
                  Change Settings
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Ties: {score.ties} | Total Games: {score.X + score.O + score.ties}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
