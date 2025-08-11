import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  length: number;
  direction: 'across' | 'down';
}

interface CrosswordGameProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  onWordFound: (word: string, points: number) => Promise<boolean>;
  onComplete: () => void;
}

export const CrosswordGame: React.FC<CrosswordGameProps> = ({
  difficulty,
  onWordFound,
  onComplete
}) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());

  const crosswordData = {
    easy: [
      { word: 'CAT', clue: 'Furry pet that meows' },
      { word: 'DOG', clue: 'Man\'s best friend' },
      { word: 'SUN', clue: 'Bright star in our sky' },
      { word: 'BOOK', clue: 'You read this' },
      { word: 'TREE', clue: 'Tall plant with leaves' }
    ],
    medium: [
      { word: 'HOUSE', clue: 'Place where you live' },
      { word: 'SCHOOL', clue: 'Place of learning' },
      { word: 'OCEAN', clue: 'Large body of water' },
      { word: 'FRIEND', clue: 'Someone you like' },
      { word: 'GARDEN', clue: 'Place to grow plants' }
    ],
    hard: [
      { word: 'BEAUTIFUL', clue: 'Pleasing to look at' },
      { word: 'COMPUTER', clue: 'Electronic device for data' },
      { word: 'MOUNTAIN', clue: 'Very tall landform' },
      { word: 'ELEPHANT', clue: 'Large gray animal with trunk' },
      { word: 'RAINBOW', clue: 'Colorful arc in sky after rain' }
    ],
    expert: [
      { word: 'EXTRAORDINARY', clue: 'Very unusual or remarkable' },
      { word: 'MAGNIFICENT', clue: 'Impressively beautiful' },
      { word: 'MYSTERIOUS', clue: 'Difficult to understand' },
      { word: 'ADVENTUROUS', clue: 'Willing to take risks' },
      { word: 'INTELLIGENT', clue: 'Having great mental capacity' }
    ]
  };

  useEffect(() => {
    initializeCrossword();
  }, [difficulty]);

  const initializeCrossword = () => {
    const words = crosswordData[difficulty];
    const size = difficulty === 'expert' ? 15 : difficulty === 'hard' ? 12 : 10;
    
    // Initialize empty grids
    const newGrid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
    const newUserGrid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
    const newClues: CrosswordClue[] = [];

    // Place words in crossword pattern
    words.forEach((wordData, index) => {
      const isAcross = index % 2 === 0;
      const word = wordData.word;
      
      if (isAcross) {
        const row = Math.floor(index / 2) * 3 + 2;
        const startCol = Math.floor((size - word.length) / 2);
        
        if (row < size && startCol >= 0) {
          // Place word horizontally
          for (let i = 0; i < word.length; i++) {
            if (startCol + i < size) {
              newGrid[row][startCol + i] = word[i];
            }
          }
          
          newClues.push({
            number: index + 1,
            clue: wordData.clue,
            answer: word,
            row: row,
            col: startCol,
            length: word.length,
            direction: 'across'
          });
        }
      } else {
        const col = Math.floor((index - 1) / 2) * 4 + 3;
        const startRow = Math.floor((size - word.length) / 2);
        
        if (col < size && startRow >= 0) {
          // Place word vertically
          for (let i = 0; i < word.length; i++) {
            if (startRow + i < size) {
              newGrid[startRow + i][col] = word[i];
            }
          }
          
          newClues.push({
            number: index + 1,
            clue: wordData.clue,
            answer: word,
            row: startRow,
            col: col,
            length: word.length,
            direction: 'down'
          });
        }
      }
    });

    setGrid(newGrid);
    setUserGrid(newUserGrid);
    setClues(newClues);
    setCompletedWords(new Set());
  };

  const handleCellClick = (row: number, col: number) => {
    // Find clue that includes this cell
    const clue = clues.find(c => {
      if (c.direction === 'across') {
        return row === c.row && col >= c.col && col < c.col + c.length;
      } else {
        return col === c.col && row >= c.row && row < c.row + c.length;
      }
    });
    
    if (clue) {
      setSelectedClue(clue);
      setCurrentInput(getUserAnswer(clue));
    }
  };

  const getUserAnswer = (clue: CrosswordClue): string => {
    let answer = '';
    for (let i = 0; i < clue.length; i++) {
      if (clue.direction === 'across') {
        answer += userGrid[clue.row][clue.col + i] || '';
      } else {
        answer += userGrid[clue.row + i][clue.col] || '';
      }
    }
    return answer;
  };

  const handleInputSubmit = () => {
    if (!selectedClue || !currentInput) return;

    const isCorrect = currentInput.toUpperCase() === selectedClue.answer;
    
    if (isCorrect) {
      // Fill in the grid
      const newUserGrid = [...userGrid];
      for (let i = 0; i < selectedClue.length; i++) {
        if (selectedClue.direction === 'across') {
          newUserGrid[selectedClue.row][selectedClue.col + i] = selectedClue.answer[i];
        } else {
          newUserGrid[selectedClue.row + i][selectedClue.col] = selectedClue.answer[i];
        }
      }
      setUserGrid(newUserGrid);
      
      // Mark word as completed
      const newCompleted = new Set(completedWords);
      newCompleted.add(selectedClue.answer);
      setCompletedWords(newCompleted);
      
      // Award points
      onWordFound(selectedClue.answer, selectedClue.answer.length * 10);
      
      // Check if all words completed
      if (newCompleted.size === clues.length) {
        onComplete();
      }
    }
    
    setCurrentInput('');
    setSelectedClue(null);
  };

  const getCellStyle = (row: number, col: number) => {
    const hasLetter = grid[row][col] !== '';
    const userLetter = userGrid[row][col];
    const isSelected = selectedClue && (
      (selectedClue.direction === 'across' && 
       row === selectedClue.row && 
       col >= selectedClue.col && 
       col < selectedClue.col + selectedClue.length) ||
      (selectedClue.direction === 'down' && 
       col === selectedClue.col && 
       row >= selectedClue.row && 
       row < selectedClue.row + selectedClue.length)
    );

    let className = 'w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-bold cursor-pointer ';
    
    if (!hasLetter) {
      className += 'bg-black';
    } else if (isSelected) {
      className += 'bg-blue-200 border-blue-400';
    } else if (userLetter) {
      className += 'bg-green-100 border-green-400';
    } else {
      className += 'bg-white hover:bg-gray-100';
    }

    return className;
  };

  const getClueNumber = (row: number, col: number): number | null => {
    const clue = clues.find(c => c.row === row && c.col === col);
    return clue ? clue.number : null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crossword Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Crossword Puzzle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-block bg-white p-4 rounded-lg border">
              <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${grid.length}, 1fr)` }}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const clueNumber = getClueNumber(rowIndex, colIndex);
                    return (
                      <div key={`${rowIndex}-${colIndex}`} className="relative">
                        <div
                          className={getCellStyle(rowIndex, colIndex)}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                          {userGrid[rowIndex][colIndex] || ''}
                        </div>
                        {clueNumber && (
                          <div className="absolute top-0 left-0 text-xs font-bold text-blue-600 leading-none">
                            {clueNumber}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clues */}
        <Card>
          <CardHeader>
            <CardTitle>Clues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold">Across</h3>
              {clues.filter(c => c.direction === 'across').map(clue => (
                <div
                  key={`across-${clue.number}`}
                  className={`p-2 rounded cursor-pointer ${
                    completedWords.has(clue.answer) ? 'bg-green-100 text-green-800' :
                    selectedClue === clue ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedClue(clue)}
                >
                  <span className="font-bold">{clue.number}.</span> {clue.clue}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-bold">Down</h3>
              {clues.filter(c => c.direction === 'down').map(clue => (
                <div
                  key={`down-${clue.number}`}
                  className={`p-2 rounded cursor-pointer ${
                    completedWords.has(clue.answer) ? 'bg-green-100 text-green-800' :
                    selectedClue === clue ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedClue(clue)}
                >
                  <span className="font-bold">{clue.number}.</span> {clue.clue}
                </div>
              ))}
            </div>

            {selectedClue && (
              <div className="border-t pt-4">
                <h4 className="font-bold mb-2">
                  {selectedClue.number} {selectedClue.direction}: {selectedClue.clue}
                </h4>
                <div className="flex gap-2">
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value.toUpperCase())}
                    placeholder={`Enter ${selectedClue.length} letter word`}
                    maxLength={selectedClue.length}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleInputSubmit();
                      }
                    }}
                  />
                  <Button onClick={handleInputSubmit}>Submit</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Completed: {completedWords.size}/{clues.length} words
        </p>
      </div>
    </div>
  );
};