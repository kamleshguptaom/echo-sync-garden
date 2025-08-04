import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WordSearchGameProps {
  words: string[];
  difficulty: string;
  onWordFound: (word: string, points: number) => Promise<boolean>;
  foundWords: string[];
}

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
  words,
  difficulty,
  onWordFound,
  foundWords
}) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const gridSize = difficulty === 'expert' ? 15 : 12;

  useEffect(() => {
    generateGrid();
  }, [words, difficulty]);

  const generateGrid = () => {
    const newGrid: string[][] = [];
    
    // Initialize empty grid
    for (let i = 0; i < gridSize; i++) {
      const row: string[] = [];
      for (let j = 0; j < gridSize; j++) {
        row.push('');
      }
      newGrid.push(row);
    }

    // Place words
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];

    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);
        
        if (canPlaceWord(newGrid, word, startRow, startCol, direction)) {
          placeWord(newGrid, word, startRow, startCol, direction);
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: number[]) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction[0] * i;
      const newCol = col + direction[1] * i;
      
      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false;
      }
      
      if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, row: number, col: number, direction: number[]) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction[0] * i;
      const newCol = col + direction[1] * i;
      grid[newRow][newCol] = word[i];
    }
  };

  const handleCellInteraction = (rowIndex: number, colIndex: number, isClick: boolean = true) => {
    const cellIndex = rowIndex * gridSize + colIndex;
    
    if (isClick) {
      setIsDragging(true);
      setSelectedCells([cellIndex]);
    } else if (isDragging) {
      if (!selectedCells.includes(cellIndex)) {
        setSelectedCells(prev => [...prev, cellIndex]);
      }
    }
  };

  const handleMouseUp = () => {
    if (selectedCells.length > 0) {
      const selectedWord = selectedCells
        .map(index => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          return grid[row][col];
        })
        .join('');
      
      onWordFound(selectedWord, selectedWord.length * 10);
    }
    
    setIsDragging(false);
    setSelectedCells([]);
  };

  const renderGrid = () => {
    return (
      <div 
        className="grid gap-1 max-w-2xl mx-auto select-none" 
        style={{gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`}}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cellIndex = rowIndex * gridSize + colIndex;
            const isSelected = selectedCells.includes(cellIndex);
            
            return (
              <div
                key={cellIndex}
                className={`
                  w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                  border rounded transition-all duration-200
                  ${isSelected ? 'bg-primary text-primary-foreground border-primary scale-110' : 
                    'bg-background hover:bg-muted border-border hover:scale-105'}
                `}
                onMouseDown={() => handleCellInteraction(rowIndex, colIndex, true)}
                onMouseEnter={() => handleCellInteraction(rowIndex, colIndex, false)}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Find the hidden words!</h3>
        <p className="text-muted-foreground">Click and drag to select words</p>
      </div>
      
      {renderGrid()}
      
      <div className="space-y-2">
        <h4 className="font-semibold">Words to find:</h4>
        <div className="flex flex-wrap gap-2">
          {words.map(word => (
            <span
              key={word}
              className={`px-3 py-1 rounded text-sm ${
                foundWords.includes(word) 
                  ? 'bg-primary text-primary-foreground line-through' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};