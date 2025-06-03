
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SudokuProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type Cell = number | null;

export const Sudoku: React.FC<SudokuProps> = ({ onBack }) => {
  const [board, setBoard] = useState<Cell[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [initialBoard, setInitialBoard] = useState<Cell[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<{row: number, col: number}[]>([]);

  const generateSudoku = (diff: Difficulty) => {
    // Simple sudoku generation - in a real app, you'd want more sophisticated generation
    const solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    const cellsToRemove = diff === 'easy' ? 30 : diff === 'medium' ? 40 : 50;
    const puzzle = solution.map(row => [...row]);
    
    // Remove cells randomly
    const cellsRemoved = new Set<string>();
    while (cellsRemoved.size < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const key = `${row}-${col}`;
      if (!cellsRemoved.has(key)) {
        puzzle[row][col] = null;
        cellsRemoved.add(key);
      }
    }

    return puzzle;
  };

  const startGame = () => {
    const puzzle = generateSudoku(difficulty);
    setBoard(puzzle.map(row => [...row]));
    setInitialBoard(puzzle.map(row => [...row]));
    setGameStarted(true);
    setIsComplete(false);
    setSelectedCell(null);
    setErrors([]);
  };

  const isValidMove = (board: Cell[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && board[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if ((i !== row || j !== col) && board[i][j] === num) return false;
      }
    }

    return true;
  };

  const makeMove = (row: number, col: number, num: number | null) => {
    if (initialBoard[row][col] !== null) return; // Can't modify initial cells

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    // Check for errors
    const newErrors: {row: number, col: number}[] = [];
    if (num !== null && !isValidMove(newBoard, row, col, num)) {
      newErrors.push({row, col});
    }
    setErrors(newErrors);

    // Check if completed
    if (newBoard.every(row => row.every(cell => cell !== null))) {
      const isValid = newBoard.every((row, i) => 
        row.every((cell, j) => 
          cell !== null && isValidMove(newBoard, i, j, cell)
        )
      );
      if (isValid) {
        setIsComplete(true);
      }
    }
  };

  const clearCell = () => {
    if (selectedCell && initialBoard[selectedCell.row][selectedCell.col] === null) {
      makeMove(selectedCell.row, selectedCell.col, null);
    }
  };

  const isErrorCell = (row: number, col: number) => {
    return errors.some(error => error.row === row && error.col === col);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Sudoku</h1>
          <div className="w-20"></div>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center items-center">
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 mt-6">
                {gameStarted ? 'New Game' : 'Start Game'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameStarted && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                {isComplete ? '🎉 Congratulations! Puzzle Solved! 🎉' : 'Click a cell and use the number buttons below'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 bg-gray-800">
                  {board.map((row, i) =>
                    row.map((cell, j) => (
                      <button
                        key={`${i}-${j}`}
                        className={`w-12 h-12 border border-gray-400 flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                          selectedCell?.row === i && selectedCell?.col === j
                            ? 'bg-blue-200 ring-2 ring-blue-500'
                            : initialBoard[i][j] !== null
                            ? 'bg-gray-100'
                            : isErrorCell(i, j)
                            ? 'bg-red-200'
                            : 'bg-white hover:bg-gray-50'
                        } ${
                          (i + 1) % 3 === 0 && i !== 8 ? 'border-b-2 border-b-gray-800' : ''
                        } ${
                          (j + 1) % 3 === 0 && j !== 8 ? 'border-r-2 border-r-gray-800' : ''
                        }`}
                        onClick={() => setSelectedCell({row: i, col: j})}
                      >
                        {cell}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <Button
                    key={num}
                    className="w-12 h-12 text-lg font-bold"
                    onClick={() => selectedCell && makeMove(selectedCell.row, selectedCell.col, num)}
                    disabled={!selectedCell || initialBoard[selectedCell.row][selectedCell.col] !== null}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  className="w-20 h-12 text-sm font-bold bg-red-500 hover:bg-red-600"
                  onClick={clearCell}
                  disabled={!selectedCell || initialBoard[selectedCell.row][selectedCell.col] !== null}
                >
                  Clear
                </Button>
              </div>

              {isComplete && (
                <div className="text-center">
                  <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                    Play Again
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
