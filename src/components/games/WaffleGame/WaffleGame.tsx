
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WaffleGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
type CellType = 'green' | 'yellow' | 'white';

interface Cell {
  letter: string;
  type: CellType;
  isFixed: boolean;
  row: number;
  col: number;
}

export const WaffleGame: React.FC<WaffleGameProps> = ({ onBack }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [maxMoves, setMaxMoves] = useState(15);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [swapMode, setSwapMode] = useState(false);
  const [firstSwapCell, setFirstSwapCell] = useState<{row: number, col: number} | null>(null);
  const [showConcept, setShowConcept] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const words = {
    easy: ['CAT', 'DOG', 'SUN', 'RUN', 'FUN'],
    medium: ['HOUSE', 'WATER', 'LIGHT', 'PHONE', 'MUSIC'],
    hard: ['COMPUTER', 'RAINBOW', 'KITCHEN', 'JOURNEY', 'MYSTERY']
  };

  const generateWaffleGrid = (diff: Difficulty) => {
    const actualDiff = diff === 'random' ? 
      (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)] : 
      diff;

    const gridSize = 5;
    const newGrid: Cell[][] = Array(gridSize).fill(null).map((_, row) =>
      Array(gridSize).fill(null).map((_, col) => ({
        letter: '',
        type: 'white' as CellType,
        isFixed: false,
        row,
        col
      }))
    );

    // Create waffle pattern with words
    const targetWords = words[actualDiff];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
    // Fill grid with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        newGrid[i][j].letter = letters[Math.floor(Math.random() * letters.length)];
        
        // Set some cells as correct (green)
        if (Math.random() < 0.3) {
          newGrid[i][j].type = 'green';
          newGrid[i][j].isFixed = true;
        }
        // Set some as partially correct (yellow)
        else if (Math.random() < 0.4) {
          newGrid[i][j].type = 'yellow';
        }
      }
    }

    setMaxMoves(actualDiff === 'easy' ? 20 : actualDiff === 'medium' ? 15 : 10);
    return newGrid;
  };

  const startGame = () => {
    const newGrid = generateWaffleGrid(difficulty);
    setGrid(newGrid);
    setGameStarted(true);
    setMoves(0);
    setIsComplete(false);
    setSelectedCell(null);
    setSwapMode(false);
    setFirstSwapCell(null);
    setHintsUsed(0);
  };

  const swapCells = (cell1: {row: number, col: number}, cell2: {row: number, col: number}) => {
    if (grid[cell1.row][cell1.col].isFixed || grid[cell2.row][cell2.col].isFixed) return;

    const newGrid = [...grid];
    const temp = newGrid[cell1.row][cell1.col].letter;
    newGrid[cell1.row][cell1.col].letter = newGrid[cell2.row][cell2.col].letter;
    newGrid[cell2.row][cell2.col].letter = temp;
    
    setGrid(newGrid);
    setMoves(moves + 1);
    
    // Check for completion
    checkCompletion(newGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isFixed) return;

    if (swapMode) {
      if (!firstSwapCell) {
        setFirstSwapCell({row, col});
        setSelectedCell({row, col});
      } else {
        if (firstSwapCell.row !== row || firstSwapCell.col !== col) {
          swapCells(firstSwapCell, {row, col});
        }
        setFirstSwapCell(null);
        setSelectedCell(null);
        setSwapMode(false);
      }
    } else {
      setSelectedCell({row, col});
      setSwapMode(true);
    }
  };

  const checkCompletion = (currentGrid: Cell[][]) => {
    const allGreen = currentGrid.every(row => 
      row.every(cell => cell.type === 'green')
    );
    if (allGreen) {
      setIsComplete(true);
    }
  };

  const useHint = () => {
    if (hintsUsed >= 3) return;
    
    // Find a cell that can be improved
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (!grid[i][j].isFixed && grid[i][j].type !== 'green') {
          const newGrid = [...grid];
          newGrid[i][j].type = 'yellow';
          setGrid(newGrid);
          setHintsUsed(hintsUsed + 1);
          return;
        }
      }
    }
  };

  const resetGame = () => {
    startGame();
  };

  // Real-time difficulty change
  useEffect(() => {
    if (gameStarted) {
      startGame();
    }
  }, [difficulty]);

  const getCellClass = (cell: Cell) => {
    let baseClass = "w-12 h-12 border-2 flex items-center justify-center font-bold text-lg transition-all duration-300 cursor-pointer ";
    
    if (cell.isFixed) {
      baseClass += "cursor-not-allowed ";
    }
    
    if (selectedCell && selectedCell.row === cell.row && selectedCell.col === cell.col) {
      baseClass += "ring-2 ring-blue-500 ";
    }

    switch (cell.type) {
      case 'green':
        return baseClass + "bg-green-500 text-white border-green-600";
      case 'yellow':
        return baseClass + "bg-yellow-400 text-black border-yellow-500";
      default:
        return baseClass + "bg-gray-200 text-black border-gray-300 hover:bg-gray-300";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Waffle Game</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-yellow-500 text-white hover:bg-yellow-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Waffle Game Concepts</DialogTitle>
                <DialogDescription>Learn how to master the waffle word puzzle</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 How to Play</h3>
                  <p>Swap letters to form valid words in all rows and columns of the waffle grid.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🟢 Color Meanings</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><span className="bg-green-500 text-white px-2 py-1 rounded">Green</span> - Correct letter in correct position</li>
                    <li><span className="bg-yellow-400 text-black px-2 py-1 rounded">Yellow</span> - Correct letter in wrong position</li>
                    <li><span className="bg-gray-200 text-black px-2 py-1 rounded">White</span> - Letter not in target word</li>
                  </ul>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h3 className="font-bold text-lg">🎮 Strategy Tips</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Focus on green letters first - they're in correct positions</li>
                    <li>Move yellow letters to better positions</li>
                    <li>Look for common word patterns</li>
                    <li>Use limited moves wisely</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg animate-pulse">
                  <h4 className="font-bold">💡 Pro Tip:</h4>
                  <p>Start with the corners and work your way inward!</p>
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
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600 mt-6">
                {gameStarted ? 'New Game' : 'Start Game'}
              </Button>

              {gameStarted && (
                <>
                  <Button onClick={resetGame} variant="outline" className="mt-6">
                    🔄 Reset
                  </Button>
                  <Button onClick={() => alert('Swap letters by clicking two cells to form valid words in all rows and columns.')} variant="outline" className="mt-6">
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
                <div>Moves: {moves}/{maxMoves}</div>
                <div>
                  {isComplete ? '🎉 Waffle Complete!' : 
                   moves >= maxMoves ? '❌ No more moves!' :
                   swapMode ? (firstSwapCell ? 'Select second cell' : 'Select first cell') : 'Click to swap letters'}
                </div>
                <div>Hints: {hintsUsed}/3</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-1 p-4 bg-yellow-100 rounded-lg">
                  {grid.map((row, i) =>
                    row.map((cell, j) => (
                      <button
                        key={`${i}-${j}`}
                        className={getCellClass(cell)}
                        onClick={() => handleCellClick(i, j)}
                        disabled={moves >= maxMoves && !isComplete}
                      >
                        {cell.letter}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2 justify-center flex-wrap">
                <Button 
                  onClick={useHint} 
                  disabled={hintsUsed >= 3 || moves >= maxMoves} 
                  variant="outline"
                >
                  💡 Hint ({hintsUsed}/3)
                </Button>
                <Button 
                  onClick={() => {
                    setSwapMode(false);
                    setFirstSwapCell(null);
                    setSelectedCell(null);
                  }} 
                  variant="outline"
                  disabled={moves >= maxMoves && !isComplete}
                >
                  ❌ Cancel Swap
                </Button>
              </div>

              {(isComplete || moves >= maxMoves) && (
                <div className={`text-center p-6 rounded-lg ${isComplete ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h2 className={`text-2xl font-bold mb-2 ${isComplete ? 'text-green-800' : 'text-red-800'}`}>
                    {isComplete ? 'Waffle Complete!' : 'Game Over!'}
                  </h2>
                  <p className={`mb-4 ${isComplete ? 'text-green-700' : 'text-red-700'}`}>
                    {isComplete ? `Completed in ${moves} moves!` : 'No more moves remaining!'}
                  </p>
                  <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600">
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
