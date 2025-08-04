import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SmartGridGameProps {
  words: string[];
  onWordFound: (word: string, points: number) => Promise<boolean>;
}

export const SmartGridGame: React.FC<SmartGridGameProps> = ({
  words,
  onWordFound
}) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);

  const gridSize = 8;

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: string[][] = [];
    for (let i = 0; i < gridSize; i++) {
      const row: string[] = [];
      for (let j = 0; j < gridSize; j++) {
        row.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellIndex = rowIndex * gridSize + colIndex;
    
    if (selectedCells.includes(cellIndex)) {
      setSelectedCells(prev => prev.filter(index => index !== cellIndex));
    } else {
      setSelectedCells(prev => [...prev, cellIndex]);
    }
  };

  const submitWord = async () => {
    const selectedWord = selectedCells
      .sort((a, b) => a - b)
      .map(index => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        return grid[row][col];
      })
      .join('');
    
    const success = await onWordFound(selectedWord, selectedWord.length * 12);
    if (success) {
      setSelectedCells([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Create words by selecting letters!</h3>
        <p className="text-muted-foreground">Click letters to select them, then submit your word</p>
      </div>
      
      <div 
        className="grid gap-2 max-w-md mx-auto" 
        style={{gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`}}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cellIndex = rowIndex * gridSize + colIndex;
            const isSelected = selectedCells.includes(cellIndex);
            
            return (
              <div
                key={cellIndex}
                className={`
                  w-10 h-10 flex items-center justify-center text-sm font-bold cursor-pointer
                  border rounded transition-all duration-200
                  ${isSelected ? 'bg-primary text-primary-foreground border-primary scale-110' : 
                    'bg-background hover:bg-muted border-border hover:scale-105'}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
      
      <div className="text-center space-y-4">
        {selectedCells.length > 0 && (
          <div className="text-lg font-semibold">
            Selected: {selectedCells
              .sort((a, b) => a - b)
              .map(index => {
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                return grid[row][col];
              })
              .join('')}
          </div>
        )}
        
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={submitWord} 
            disabled={selectedCells.length < 2}
          >
            Submit Word
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setSelectedCells([])}
            disabled={selectedCells.length === 0}
          >
            Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
};