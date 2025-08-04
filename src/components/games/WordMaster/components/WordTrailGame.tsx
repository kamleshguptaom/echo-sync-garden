import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WordTrailGameProps {
  words: string[];
  onWordFound: (word: string, points: number) => Promise<boolean>;
}

export const WordTrailGame: React.FC<WordTrailGameProps> = ({
  words,
  onWordFound
}) => {
  const [trailLetters, setTrailLetters] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    initializeTrail();
  }, [words]);

  const initializeTrail = () => {
    const allLetters = words.join('').split('');
    const uniqueLetters = [...new Set(allLetters)];
    
    // Add some random letters
    const randomLetters = Array.from({length: 8}, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    );
    
    const shuffled = [...uniqueLetters, ...randomLetters]
      .sort(() => Math.random() - 0.5)
      .slice(0, 16);
    
    setTrailLetters(shuffled);
  };

  const handleLetterInteraction = (index: number, isClick: boolean = true) => {
    if (isClick) {
      setIsDragging(true);
      setSelectedPath([index]);
    } else if (isDragging && !selectedPath.includes(index)) {
      // Check if the letter is adjacent to the last selected letter
      const lastIndex = selectedPath[selectedPath.length - 1];
      if (isAdjacent(lastIndex, index)) {
        setSelectedPath(prev => [...prev, index]);
      }
    }
  };

  const isAdjacent = (index1: number, index2: number): boolean => {
    const row1 = Math.floor(index1 / 4);
    const col1 = index1 % 4;
    const row2 = Math.floor(index2 / 4);
    const col2 = index2 % 4;
    
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
  };

  const handleMouseUp = async () => {
    if (selectedPath.length > 1) {
      const word = selectedPath.map(index => trailLetters[index]).join('');
      await onWordFound(word, word.length * 8);
    }
    
    setIsDragging(false);
    setSelectedPath([]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Create a word trail!</h3>
        <p className="text-muted-foreground">Click and drag to connect adjacent letters</p>
      </div>
      
      <div 
        className="grid grid-cols-4 gap-3 max-w-xs mx-auto"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {trailLetters.map((letter, index) => {
          const isSelected = selectedPath.includes(index);
          const pathPosition = selectedPath.indexOf(index);
          
          return (
            <div
              key={index}
              className={`
                w-16 h-16 flex items-center justify-center text-lg font-bold cursor-pointer
                border-2 rounded-lg transition-all duration-200 relative
                ${isSelected ? 'bg-primary text-primary-foreground border-primary scale-110' : 
                  'bg-background hover:bg-muted border-border hover:scale-105'}
              `}
              onMouseDown={() => handleLetterInteraction(index, true)}
              onMouseEnter={() => handleLetterInteraction(index, false)}
            >
              {letter}
              {isSelected && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pathPosition + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedPath.length > 0 && (
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">
            Current Trail: {selectedPath.map(index => trailLetters[index]).join('')}
          </div>
          <Button variant="outline" onClick={() => setSelectedPath([])}>
            Clear Trail
          </Button>
        </div>
      )}
    </div>
  );
};