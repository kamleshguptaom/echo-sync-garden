
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TicTacToeProps {
  onBack: () => void;
}

type Player = 'X' | 'O' | null;
type GameMode = 'human' | 'ai-easy' | 'ai-hard';
type BoardSize = 3 | 4 | 5;

export const TicTacToe: React.FC<TicTacToeProps> = ({ onBack }) => {
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('human');
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setWinner(null);
    setCurrentPlayer('X');
  }, [boardSize]);

  useEffect(() => {
    if (gameMode !== 'human' && currentPlayer === 'O' && !winner) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner]);

  const getWinningLines = (size: number) => {
    const lines = [];
    
    // Rows
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j);
      }
      lines.push(row);
    }
    
    // Columns
    for (let i = 0; i < size; i++) {
      const col = [];
      for (let j = 0; j < size; j++) {
        col.push(j * size + i);
      }
      lines.push(col);
    }
    
    // Diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < size; i++) {
      diagonal1.push(i * size + i);
      diagonal2.push(i * size + (size - 1 - i));
    }
    lines.push(diagonal1);
    lines.push(diagonal2);
    
    return lines;
  };

  const checkWinner = (newBoard: Player[]) => {
    const lines = getWinningLines(boardSize);
    
    for (const line of lines) {
      const values = line.map(index => newBoard[index]);
      if (values[0] && values.every(val => val === values[0])) {
        return values[0];
      }
    }
    
    if (newBoard.every(cell => cell !== null)) {
      return 'draw';
    }
    
    return null;
  };

  const makeMove = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      setScore(prev => ({
        ...prev,
        [gameResult === 'draw' ? 'draws' : gameResult]: prev[gameResult === 'draw' ? 'draws' : gameResult] + 1
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const makeAIMove = () => {
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    if (availableMoves.length === 0) return;
    
    let move: number;
    
    if (gameMode === 'ai-hard') {
      move = getBestMove(board, boardSize);
    } else {
      move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    makeMove(move);
  };

  const getBestMove = (currentBoard: Player[], size: number): number => {
    const availableMoves = currentBoard.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    // Try to win
    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'O';
      if (checkWinner(testBoard) === 'O') {
        return move;
      }
    }
    
    // Block player from winning
    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'X';
      if (checkWinner(testBoard) === 'X') {
        return move;
      }
    }
    
    // Take center if available
    const center = Math.floor((size * size) / 2);
    if (availableMoves.includes(center)) {
      return center;
    }
    
    // Take corners
    const corners = [0, size - 1, size * (size - 1), size * size - 1];
    const availableCorners = corners.filter(corner => availableMoves.includes(corner));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Tic Tac Toe</h1>
          <div className="w-20"></div>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center">
              <div>
                <label className="block text-sm font-medium mb-1">Board Size</label>
                <Select value={boardSize.toString()} onValueChange={(value) => setBoardSize(parseInt(value) as BoardSize)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3x3</SelectItem>
                    <SelectItem value="4">4x4</SelectItem>
                    <SelectItem value="5">5x5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Game Mode</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human">2 Players</SelectItem>
                    <SelectItem value="ai-easy">vs AI (Easy)</SelectItem>
                    <SelectItem value="ai-hard">vs AI (Hard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">
              Score: X({score.X}) - O({score.O}) - Draws({score.draws})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              {winner ? (
                <div className="text-2xl font-bold text-green-600">
                  {winner === 'draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
                </div>
              ) : (
                <div className="text-xl">
                  Current Player: <span className="font-bold text-blue-600">{currentPlayer}</span>
                </div>
              )}
            </div>

            <div 
              className={`grid gap-2 mx-auto justify-center mb-4`}
              style={{ 
                gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                maxWidth: `${boardSize * 80}px`
              }}
            >
              {board.map((cell, index) => (
                <Button
                  key={index}
                  className={`w-16 h-16 text-2xl font-bold transition-all duration-200 ${
                    cell === 'X' ? 'bg-blue-500 hover:bg-blue-600' :
                    cell === 'O' ? 'bg-red-500 hover:bg-red-600' :
                    'bg-gray-200 hover:bg-gray-300'
                  } ${!cell && !winner ? 'hover:scale-105' : ''}`}
                  onClick={() => makeMove(index)}
                  disabled={!!cell || !!winner}
                >
                  {cell}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600">
                New Game
              </Button>
              <Button onClick={resetScore} variant="outline">
                Reset Score
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
