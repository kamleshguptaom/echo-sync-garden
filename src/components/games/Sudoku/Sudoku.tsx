
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface SudokuProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'random';
type Cell = number | null;

export const Sudoku: React.FC<SudokuProps> = ({ onBack }) => {
  const [board, setBoard] = useState<Cell[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [initialBoard, setInitialBoard] = useState<Cell[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<{row: number, col: number}[]>([]);
  const [notes, setNotes] = useState<number[][][]>(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
  const [notesMode, setNotesMode] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showConcept, setShowConcept] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [maxMistakes] = useState(3);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && gameStarted && !isComplete) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameStarted, isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateSudoku = (diff: Difficulty) => {
    const actualDiff = diff === 'random' ? 
      (['easy', 'medium', 'hard', 'expert'] as const)[Math.floor(Math.random() * 4)] : 
      diff;

    // Start with a valid completed Sudoku
    const completedBoard = [
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

    const cellsToRemove = actualDiff === 'easy' ? 35 : 
                         actualDiff === 'medium' ? 45 : 
                         actualDiff === 'hard' ? 55 : 65;
    
    const puzzle = completedBoard.map(row => [...row]);
    
    // Remove cells
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

  const startGame = () => {
    const puzzle = generateSudoku(difficulty);
    setBoard(puzzle.map(row => [...row]));
    setInitialBoard(puzzle.map(row => [...row]));
    setGameStarted(true);
    setGameActive(true);
    setIsComplete(false);
    setSelectedCell(null);
    setErrors([]);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setHintsUsed(0);
    setTimer(0);
    setMistakeCount(0);
  };

  const makeMove = (row: number, col: number, num: number | null) => {
    if (initialBoard[row][col] !== null) return;
    if (mistakeCount >= maxMistakes) return;

    if (notesMode && num !== null) {
      const newNotes = [...notes];
      const cellNotes = newNotes[row][col];
      const noteIndex = cellNotes.indexOf(num);
      if (noteIndex === -1) {
        cellNotes.push(num);
        cellNotes.sort();
      } else {
        cellNotes.splice(noteIndex, 1);
      }
      setNotes(newNotes);
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    // Clear notes for this cell when placing a number
    if (num !== null) {
      const newNotes = [...notes];
      newNotes[row][col] = [];
      setNotes(newNotes);
    }

    // Check for errors
    const newErrors: {row: number, col: number}[] = [];
    if (num !== null && !isValidMove(newBoard, row, col, num)) {
      newErrors.push({row, col});
      setMistakeCount(prev => prev + 1);
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
        setGameActive(false);
      }
    }
  };

  const useHint = () => {
    if (hintsUsed >= 3) return;
    
    // Find an empty cell and fill it with correct answer
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === null && initialBoard[i][j] === null) {
          for (let num = 1; num <= 9; num++) {
            const testBoard = board.map(r => [...r]);
            testBoard[i][j] = num;
            if (isValidMove(testBoard, i, j, num)) {
              makeMove(i, j, num);
              setHintsUsed(hintsUsed + 1);
              return;
            }
          }
        }
      }
    }
  };

  const clearCell = () => {
    if (selectedCell && initialBoard[selectedCell.row][selectedCell.col] === null) {
      makeMove(selectedCell.row, selectedCell.col, null);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard.map(row => [...row]));
    setErrors([]);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setSelectedCell(null);
    setTimer(0);
    setMistakeCount(0);
    setHintsUsed(0);
    setGameActive(true);
    setIsComplete(false);
  };

  const isErrorCell = (row: number, col: number) => {
    return errors.some(error => error.row === row && error.col === col);
  };

  const getCellHighlight = (row: number, col: number) => {
    if (!selectedCell) return '';
    
    const { row: selRow, col: selCol } = selectedCell;
    const sameRow = row === selRow;
    const sameCol = col === selCol;
    const sameBox = Math.floor(row / 3) === Math.floor(selRow / 3) && 
                   Math.floor(col / 3) === Math.floor(selCol / 3);
    
    if (row === selRow && col === selCol) return 'bg-blue-200 ring-2 ring-blue-500';
    if (sameRow || sameCol || sameBox) return 'bg-blue-50';
    return '';
  };

  // Real-time difficulty change
  useEffect(() => {
    if (gameStarted) {
      startGame();
    }
  }, [difficulty]);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Sudoku</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Sudoku Concepts & Strategy</DialogTitle>
                <DialogDescription>Learn the fundamentals and advanced techniques</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Rules</h3>
                  <p>Fill a 9×9 grid so each row, column, and 3×3 box contains digits 1-9 exactly once.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🧠 Basic Strategies</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Elimination:</strong> Rule out impossible numbers</li>
                    <li><strong>Naked Singles:</strong> Find cells with only one possibility</li>
                    <li><strong>Hidden Singles:</strong> Find numbers that can only go in one place</li>
                    <li><strong>Notes:</strong> Use pencil marks to track possibilities</li>
                  </ul>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h3 className="font-bold text-lg">📝 Advanced Techniques</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Naked Pairs:</strong> Two cells with same two candidates</li>
                    <li><strong>Pointing Pairs:</strong> Candidates aligned in box and row/column</li>
                    <li><strong>Box/Line Reduction:</strong> Eliminate candidates from intersecting regions</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg animate-pulse">
                  <h4 className="font-bold">💡 Pro Tips:</h4>
                  <p>Start with rows/columns/boxes that have the most numbers filled in!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center items-center flex-wrap">
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
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 mt-6">
                {gameStarted ? 'New Game' : 'Start Game'}
              </Button>

              {gameStarted && (
                <>
                  <Button onClick={resetGame} variant="outline" className="mt-6">
                    🔄 Reset
                  </Button>
                  <Button onClick={() => alert('Instructions: Fill the grid so each row, column, and 3x3 box contains digits 1-9 exactly once.')} variant="outline" className="mt-6">
                    📋 Instructions
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {gameStarted && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center flex-wrap gap-2">
                <div>Time: {formatTime(timer)}</div>
                <div>
                  {isComplete ? '🎉 Congratulations! Puzzle Solved! 🎉' : 
                   mistakeCount >= maxMistakes ? '❌ Game Over - Too many mistakes!' :
                   `Hints: ${hintsUsed}/3 | Mistakes: ${mistakeCount}/${maxMistakes}`}
                </div>
                <div>Difficulty: {difficulty === 'random' ? '🎲 Random' : difficulty}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 bg-gray-800">
                  {board.map((row, i) =>
                    row.map((cell, j) => (
                      <button
                        key={`${i}-${j}`}
                        className={`w-12 h-12 border border-gray-400 flex items-center justify-center text-lg font-bold transition-all duration-200 relative ${
                          getCellHighlight(i, j)
                        } ${
                          initialBoard[i][j] !== null
                            ? 'bg-gray-100 font-black text-black'
                            : isErrorCell(i, j)
                            ? 'bg-red-200'
                            : 'bg-white hover:bg-gray-50'
                        } ${
                          (i + 1) % 3 === 0 && i !== 8 ? 'border-b-2 border-b-gray-800' : ''
                        } ${
                          (j + 1) % 3 === 0 && j !== 8 ? 'border-r-2 border-r-gray-800' : ''
                        }`}
                        onClick={() => setSelectedCell({row: i, col: j})}
                        disabled={mistakeCount >= maxMistakes && !isComplete}
                      >
                        {cell || ''}
                        {!cell && notes[i][j].length > 0 && (
                          <div className="absolute inset-0 grid grid-cols-3 gap-0 text-xs text-gray-500 p-1">
                            {[1,2,3,4,5,6,7,8,9].map(num => (
                              <div key={num} className="flex items-center justify-center text-xs">
                                {notes[i][j].includes(num) ? num : ''}
                              </div>
                            ))}
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button 
                    onClick={() => setNotesMode(!notesMode)} 
                    variant={notesMode ? "default" : "outline"}
                    disabled={mistakeCount >= maxMistakes && !isComplete}
                  >
                    📝 Notes {notesMode ? 'ON' : 'OFF'}
                  </Button>
                  <Button 
                    onClick={useHint} 
                    disabled={hintsUsed >= 3 || mistakeCount >= maxMistakes} 
                    variant="outline"
                  >
                    💡 Hint ({hintsUsed}/3)
                  </Button>
                  <Button 
                    onClick={clearCell} 
                    variant="outline"
                    disabled={mistakeCount >= maxMistakes && !isComplete}
                  >
                    🗑️ Clear
                  </Button>
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <Button
                      key={num}
                      className="w-12 h-12 text-lg font-bold"
                      onClick={() => selectedCell && makeMove(selectedCell.row, selectedCell.col, num)}
                      disabled={!selectedCell || initialBoard[selectedCell.row][selectedCell.col] !== null || (mistakeCount >= maxMistakes && !isComplete)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              {(isComplete || mistakeCount >= maxMistakes) && (
                <div className={`text-center p-6 rounded-lg ${isComplete ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h2 className={`text-2xl font-bold mb-2 ${isComplete ? 'text-green-800' : 'text-red-800'}`}>
                    {isComplete ? 'Puzzle Complete!' : 'Game Over!'}
                  </h2>
                  <p className={`mb-4 ${isComplete ? 'text-green-700' : 'text-red-700'}`}>
                    {isComplete ? `Time: ${formatTime(timer)} | Hints used: ${hintsUsed}` : 'Too many mistakes made!'}
                  </p>
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
