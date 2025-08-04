import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CrosswordGame } from './components/CrosswordGame';

interface WordMasterProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GameMode = 'word-search' | 'crossword' | 'scramble' | 'smart-grid' | 'trail';

interface GameStats {
  wordsFound: number;
  totalWords: number;
  score: number;
  timeRemaining: number;
  streak: number;
  level: number;
  lives: number;
  combo: number;
  perfectWords: number;
}

interface SmartGridCell {
  letter: string;
  playerId: number | null;
  wordId: string | null;
  isHighlighted: boolean;
}

interface WordDefinition {
  word: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  pronunciation?: string;
}

export const WordMaster: React.FC<WordMasterProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('word-search');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    wordsFound: 0,
    totalWords: 10,
    score: 0,
    timeRemaining: 300,
    streak: 0,
    level: 1,
    lives: 3,
    combo: 0,
    perfectWords: 0
  });

  // Game State
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [gridLetters, setGridLetters] = useState<string[][]>([]);
  const [userInput, setUserInput] = useState('');
  const [showMeaning, setShowMeaning] = useState(false);
  const [currentWordDef, setCurrentWordDef] = useState<WordDefinition | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(false);

  // Smart Grid Game State
  const [smartGrid, setSmartGrid] = useState<SmartGridCell[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerScores, setPlayerScores] = useState([0, 0]);
  const [selectedWord, setSelectedWord] = useState('');
  const [smartGridWords, setSmartGridWords] = useState<string[]>([]);

  // Crossword State
  const [crosswordGrid, setCrosswordGrid] = useState<string[][]>([]);
  const [crosswordClues, setCrosswordClues] = useState<{across: any[], down: any[]}>({across: [], down: []});
  const [selectedClue, setSelectedClue] = useState<any>(null);

  // Word Trail State
  const [trailLetters, setTrailLetters] = useState<string[]>([]);
  const [trailPath, setTrailPath] = useState<number[]>([]);
  const [trailWords, setTrailWords] = useState<string[]>([]);

  // Enhanced word databases with definitions
  const wordDatabase = {
    easy: [
      { word: 'CAT', definition: 'A small domesticated carnivorous mammal with soft fur', synonyms: ['feline', 'kitten'], antonyms: ['dog'], example: 'The cat sat on the mat.' },
      { word: 'DOG', definition: 'A loyal domesticated carnivorous mammal', synonyms: ['puppy', 'hound'], antonyms: ['cat'], example: 'The dog barked loudly.' },
      { word: 'SUN', definition: 'The star around which Earth orbits', synonyms: ['star', 'daylight'], antonyms: ['moon', 'darkness'], example: 'The sun shines brightly.' },
      { word: 'RUN', definition: 'Move at a speed faster than walking', synonyms: ['sprint', 'jog'], antonyms: ['walk', 'stop'], example: 'I run every morning.' },
      { word: 'FISH', definition: 'A cold-blooded aquatic vertebrate', synonyms: ['seafood'], antonyms: ['bird'], example: 'Fish swim in the ocean.' },
      { word: 'BIRD', definition: 'A feathered flying animal', synonyms: ['fowl'], antonyms: ['fish'], example: 'The bird sings beautifully.' },
      { word: 'TREE', definition: 'A large woody perennial plant', synonyms: ['plant'], antonyms: [], example: 'The tree provides shade.' },
      { word: 'BOOK', definition: 'Written or printed pages bound together', synonyms: ['novel', 'tome'], antonyms: [], example: 'I love reading this book.' }
    ],
    medium: [
      { word: 'HOUSE', definition: 'A building for human habitation', synonyms: ['home', 'dwelling'], antonyms: [], example: 'We live in a beautiful house.' },
      { word: 'SCHOOL', definition: 'An institution for educating children', synonyms: ['academy', 'college'], antonyms: [], example: 'Children go to school to learn.' },
      { word: 'COMPUTER', definition: 'An electronic device for processing data', synonyms: ['laptop', 'PC'], antonyms: [], example: 'I use my computer for work.' },
      { word: 'GARDEN', definition: 'A plot of ground for growing plants', synonyms: ['yard', 'plot'], antonyms: [], example: 'She grows vegetables in her garden.' },
      { word: 'MOUNTAIN', definition: 'A large landform that rises above surrounding land', synonyms: ['peak', 'hill'], antonyms: ['valley'], example: 'The mountain peak was covered in snow.' },
      { word: 'OCEAN', definition: 'A large body of salt water', synonyms: ['sea'], antonyms: ['land'], example: 'The ocean waves crashed on the shore.' },
      { word: 'FRIEND', definition: 'A person you know well and like', synonyms: ['companion', 'buddy'], antonyms: ['enemy'], example: 'My friend helped me move.' },
      { word: 'FAMILY', definition: 'A group of related people living together', synonyms: ['relatives', 'clan'], antonyms: [], example: 'I spend holidays with my family.' }
    ],
    hard: [
      { word: 'BEAUTIFUL', definition: 'Pleasing the senses or mind aesthetically', synonyms: ['gorgeous', 'lovely'], antonyms: ['ugly', 'hideous'], example: 'The sunset was beautiful.' },
      { word: 'INTELLIGENT', definition: 'Having or showing intelligence', synonyms: ['smart', 'clever'], antonyms: ['stupid', 'dumb'], example: 'She is very intelligent.' },
      { word: 'MYSTERIOUS', definition: 'Difficult to understand or explain', synonyms: ['enigmatic', 'puzzling'], antonyms: ['clear', 'obvious'], example: 'The case remained mysterious.' },
      { word: 'MAGNIFICENT', definition: 'Impressively beautiful or elaborate', synonyms: ['splendid', 'grand'], antonyms: ['ordinary', 'plain'], example: 'The palace was magnificent.' },
      { word: 'EXTRAORDINARY', definition: 'Very unusual or remarkable', synonyms: ['exceptional', 'amazing'], antonyms: ['ordinary', 'common'], example: 'Her talent is extraordinary.' },
      { word: 'ADVENTUROUS', definition: 'Willing to take risks or try new experiences', synonyms: ['daring', 'bold'], antonyms: ['cautious', 'timid'], example: 'He has an adventurous spirit.' }
    ],
    expert: [
      { word: 'SERENDIPITOUS', definition: 'Occurring by chance in a happy way', synonyms: ['fortuitous', 'lucky'], antonyms: ['planned', 'deliberate'], example: 'Their meeting was serendipitous.' },
      { word: 'PERSPICACIOUS', definition: 'Having keen insight or discernment', synonyms: ['perceptive', 'astute'], antonyms: ['oblivious', 'dense'], example: 'Her perspicacious analysis impressed everyone.' },
      { word: 'MELLIFLUOUS', definition: 'Sweet or musical; pleasant to hear', synonyms: ['melodious', 'harmonious'], antonyms: ['harsh', 'discordant'], example: 'His mellifluous voice captivated the audience.' },
      { word: 'EPHEMERAL', definition: 'Lasting for a very short time', synonyms: ['fleeting', 'transient'], antonyms: ['permanent', 'eternal'], example: 'The beauty of flowers is ephemeral.' },
      { word: 'UBIQUITOUS', definition: 'Present everywhere at the same time', synonyms: ['omnipresent', 'pervasive'], antonyms: ['rare', 'absent'], example: 'Smartphones have become ubiquitous.' }
    ]
  };

  const initializeGame = useCallback(() => {
    const words = wordDatabase[difficulty].slice(0, gameMode === 'smart-grid' ? 20 : 8);
    setCurrentWords(words.map(w => w.word));
    setFoundWords([]);
    setSelectedCells([]);
    setHintsUsed(0);
    
    const timeLimit = {
      easy: 600,
      medium: 450,
      hard: 300,
      expert: 240
    }[difficulty];

    setGameStats({
      wordsFound: 0,
      totalWords: words.length,
      score: 0,
      timeRemaining: timeLimit,
      streak: 0,
      level: 1,
      lives: 3,
      combo: 0,
      perfectWords: 0
    });

    // Initialize grid based on game mode
    switch (gameMode) {
      case 'word-search':
        initializeWordSearchGrid(words.map(w => w.word));
        break;
      case 'smart-grid':
        initializeSmartGrid();
        break;
      case 'crossword':
        initializeCrosswordGrid(words);
        break;
      case 'trail':
        initializeWordTrail(words.map(w => w.word));
        break;
      default:
        initializeWordSearchGrid(words.map(w => w.word));
    }
    
    setGameStarted(true);
    setGameComplete(false);
  }, [difficulty, gameMode]);

  const initializeWordSearchGrid = (words: string[]) => {
    const size = difficulty === 'expert' ? 15 : 12;
    let grid: string[][] = [];
    
    // Initialize empty grid
    for (let i = 0; i < size; i++) {
      const row: string[] = [];
      for (let j = 0; j < size; j++) {
        row.push('');
      }
      grid.push(row);
    }

    // Place words in grid
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];

    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);
        
        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
          placeWord(grid, word, startRow, startCol, direction);
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGridLetters(grid);
  };

  const initializeSmartGrid = () => {
    const size = 8;
    const grid: SmartGridCell[][] = [];
    
    for (let i = 0; i < size; i++) {
      const row: SmartGridCell[] = [];
      for (let j = 0; j < size; j++) {
        row.push({
          letter: '',
          playerId: null,
          wordId: null,
          isHighlighted: false
        });
      }
      grid.push(row);
    }
    
    setSmartGrid(grid);
    setSmartGridWords([]);
    setCurrentPlayer(1);
    setPlayerScores([0, 0]);
  };

  const initializeCrosswordGrid = (words: {word: string, definition: string}[]) => {
    const size = 15;
    const grid: string[][] = [];
    const clues: {across: any[], down: any[]} = {across: [], down: []};
    
    // Initialize empty grid
    for (let i = 0; i < size; i++) {
      const row: string[] = [];
      for (let j = 0; j < size; j++) {
        row.push('');
      }
      grid.push(row);
    }

    // Simple crossword placement algorithm
    words.forEach((wordData, index) => {
      const word = wordData.word;
      const isAcross = index % 2 === 0;
      
      if (isAcross && word.length <= size) {
        const row = Math.floor(index / 2) * 3 + 2;
        const startCol = Math.floor((size - word.length) / 2);
        
        if (row < size) {
          for (let i = 0; i < word.length; i++) {
            if (startCol + i < size) {
              grid[row][startCol + i] = word[i];
            }
          }
          clues.across.push({
            number: clues.across.length + 1,
            clue: wordData.definition,
            answer: word,
            row: row,
            col: startCol,
            length: word.length
          });
        }
      } else if (!isAcross && word.length <= size) {
        const col = Math.floor(index / 2) * 4 + 3;
        const startRow = Math.floor((size - word.length) / 2);
        
        if (col < size) {
          for (let i = 0; i < word.length; i++) {
            if (startRow + i < size) {
              grid[startRow + i][col] = word[i];
            }
          }
          clues.down.push({
            number: clues.down.length + 1,
            clue: wordData.definition,
            answer: word,
            row: startRow,
            col: col,
            length: word.length
          });
        }
      }
    });

    setCrosswordGrid(grid);
    setCrosswordClues(clues);
  };

  const initializeWordTrail = (words: string[]) => {
    const allLetters = words.join('').split('');
    const shuffledLetters = [...new Set(allLetters)].sort(() => Math.random() - 0.5);
    
    // Add some random letters
    const randomLetters = Array.from({length: 10}, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    );
    
    setTrailLetters([...shuffledLetters, ...randomLetters].slice(0, 20));
    setTrailPath([]);
    setTrailWords([]);
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: number[]) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction[0] * i;
      const newCol = col + direction[1] * i;
      
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
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

  const handleWordFound = (word: string, points: number) => {
    const wordData = wordDatabase[difficulty].find(w => w.word === word);
    
    if (wordData && !foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      
      const bonusPoints = gameStats.streak >= 3 ? 50 : 0;
      const comboMultiplier = Math.min(gameStats.combo + 1, 5);
      const finalPoints = (points + bonusPoints) * comboMultiplier;
      
      setGameStats(prev => ({
        ...prev,
        wordsFound: newFoundWords.length,
        score: prev.score + finalPoints,
        streak: prev.streak + 1,
        combo: prev.combo + 1,
        perfectWords: hintsUsed === 0 ? prev.perfectWords + 1 : prev.perfectWords
      }));
      
      setCurrentWordDef(wordData);
      setShowMeaning(true);
      
      // Play success animation
      if (animations) {
        toast({
          title: "🎉 Word Found!",
          description: `"${word}" for ${finalPoints} points! ${comboMultiplier > 1 ? `${comboMultiplier}x combo!` : ''}`,
        });
      }
      
      // Check if level complete
      if (newFoundWords.length === currentWords.length) {
        setGameComplete(true);
        const bonus = gameStats.timeRemaining * 2;
        setGameStats(prev => ({...prev, score: prev.score + bonus}));
      }
      
      return true;
    }
    return false;
  };

  const renderWordSearchGrid = () => {
    const size = gridLetters.length;
    return (
      <div className={`grid gap-1 max-w-2xl mx-auto`} style={{gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`}}>
        {gridLetters.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cellIndex = rowIndex * size + colIndex;
            const isSelected = selectedCells.includes(cellIndex);
            const isInFoundWord = foundWords.some(word => {
              return word.includes(letter);
            });
            
            return (
              <div
                key={cellIndex}
                className={`
                  w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                  border rounded transition-all duration-200
                  ${isSelected ? 'bg-blue-500 text-white border-blue-600 scale-110' : 
                    isInFoundWord ? 'bg-green-200 text-green-800 border-green-400' : 
                    'bg-white hover:bg-gray-100 border-gray-300 hover:scale-105'}
                  ${animations ? 'animate-fade-in' : ''}
                `}
                style={{ animationDelay: `${(rowIndex + colIndex) * 0.02}s` }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const renderSmartGrid = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">
            Player 1: <span className="text-blue-600">{playerScores[0]}</span>
          </div>
          <div className="text-lg font-bold">
            Current Player: <span className={currentPlayer === 1 ? 'text-blue-600' : 'text-red-600'}>
              Player {currentPlayer}
            </span>
          </div>
          <div className="text-lg font-bold">
            Player 2: <span className="text-red-600">{playerScores[1]}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-8 gap-1 max-w-md mx-auto">
          {smartGrid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                  border rounded transition-all duration-200
                  ${cell.playerId === 1 ? 'bg-blue-200 border-blue-400' :
                    cell.playerId === 2 ? 'bg-red-200 border-red-400' :
                    'bg-white hover:bg-gray-100 border-gray-300'}
                  ${cell.isHighlighted ? 'ring-2 ring-yellow-400' : ''}
                `}
                onClick={() => handleSmartGridClick(rowIndex, colIndex)}
              >
                {cell.letter}
              </div>
            ))
          )}
        </div>
        
        <div className="text-center space-y-4">
          <Input
            value={selectedWord}
            onChange={(e) => setSelectedWord(e.target.value.toUpperCase())}
            placeholder="Enter a letter to place"
            maxLength={1}
            className="max-w-xs mx-auto text-center"
          />
          <div className="space-x-2">
            <Button 
              onClick={handleSmartGridPlace}
              disabled={!selectedWord || selectedCells.length === 0}
              className="bg-green-500 hover:bg-green-600"
            >
              Place Letter
            </Button>
            <Button 
              onClick={() => setCurrentPlayer(currentPlayer === 1 ? 2 : 1)}
              variant="outline"
            >
              Switch Player
            </Button>
          </div>
        </div>
        
        {smartGridWords.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold mb-2">Words Found:</h3>
            <div className="flex flex-wrap gap-2">
              {smartGridWords.map((word, index) => (
                <Badge key={index} variant="outline">{word}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWordScramble = () => {
    const currentWordData = wordDatabase[difficulty][foundWords.length];
    if (!currentWordData) return null;
    
    const scrambledWord = currentWordData.word.split('').sort(() => Math.random() - 0.5).join('');
    
    return (
      <div className="text-center space-y-6">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Unscramble this word:</h3>
          <div className="text-5xl font-bold text-purple-600 mb-6 tracking-widest animate-pulse">
            {scrambledWord.split('').map((letter, index) => (
              <span 
                key={index}
                className="inline-block mx-1 p-2 bg-white rounded-lg shadow-md"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="mb-4">
            <p className="text-lg text-gray-600 mb-2">Hint:</p>
            <p className="text-md italic">{currentWordData.definition}</p>
          </div>
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toUpperCase())}
            placeholder="Type your answer..."
            className="text-center text-xl max-w-sm mx-auto mb-4"
            onKeyPress={(e) => e.key === 'Enter' && checkScrambleAnswer()}
          />
          <div className="space-x-2">
            <Button 
              onClick={checkScrambleAnswer} 
              className="bg-purple-500 hover:bg-purple-600 px-8 py-3"
              disabled={!userInput}
            >
              Submit Answer
            </Button>
            <Button 
              onClick={() => setShowHint(true)}
              variant="outline"
              disabled={hintsUsed >= 3}
            >
              💡 Hint ({3 - hintsUsed} left)
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderWordTrail = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Word Trail Challenge</h3>
          <p className="text-gray-600 mb-4">Connect letters in any direction to form words!</p>
        </div>
        
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {trailLetters.map((letter, index) => {
            const isSelected = trailPath.includes(index);
            const isLastSelected = trailPath[trailPath.length - 1] === index;
            
            return (
              <div
                key={index}
                className={`
                  w-12 h-12 flex items-center justify-center text-lg font-bold cursor-pointer
                  border-2 rounded-lg transition-all duration-200
                  ${isSelected ? 'bg-blue-500 text-white border-blue-600' : 
                    'bg-white hover:bg-gray-100 border-gray-300'}
                  ${isLastSelected ? 'ring-2 ring-yellow-400' : ''}
                  hover:scale-105
                `}
                onClick={() => handleTrailClick(index)}
              >
                {letter}
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <div className="mb-4">
            <span className="text-lg font-mono bg-gray-100 px-4 py-2 rounded">
              {trailPath.map(index => trailLetters[index]).join('')}
            </span>
          </div>
          <div className="space-x-2">
            <Button 
              onClick={checkTrailWord}
              disabled={trailPath.length < 3}
              className="bg-green-500 hover:bg-green-600"
            >
              Submit Word
            </Button>
            <Button 
              onClick={() => setTrailPath([])}
              variant="outline"
            >
              Clear
            </Button>
          </div>
        </div>
        
        {trailWords.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold mb-2">Words Found:</h3>
            <div className="flex flex-wrap gap-2">
              {trailWords.map((word, index) => (
                <Badge key={index} className="bg-green-500">{word}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCellClick = (row: number, col: number) => {
    const size = gridLetters.length;
    const cellIndex = row * size + col;
    
    if (selectedCells.includes(cellIndex)) {
      setSelectedCells(selectedCells.filter(cell => cell !== cellIndex));
    } else {
      setSelectedCells([...selectedCells, cellIndex]);
    }
  };

  const handleSmartGridClick = (row: number, col: number) => {
    const cellIndex = row * 8 + col;
    setSelectedCells([cellIndex]);
  };

  const handleSmartGridPlace = () => {
    if (selectedCells.length === 0 || !selectedWord) return;
    
    const cellIndex = selectedCells[0];
    const row = Math.floor(cellIndex / 8);
    const col = cellIndex % 8;
    
    const newGrid = [...smartGrid];
    newGrid[row][col] = {
      letter: selectedWord,
      playerId: currentPlayer,
      wordId: null,
      isHighlighted: false
    };
    
    setSmartGrid(newGrid);
    setSelectedWord('');
    setSelectedCells([]);
    
    // Check for words formed
    checkSmartGridWords(newGrid, row, col);
  };

  const checkSmartGridWords = (grid: SmartGridCell[][], row: number, col: number) => {
    // Implementation for checking words in smart grid
    // This would check all directions from the placed letter
    // and award points for valid words formed
  };

  const handleTrailClick = (index: number) => {
    if (trailPath.includes(index)) {
      // Remove this letter and all after it
      const letterIndex = trailPath.indexOf(index);
      setTrailPath(trailPath.slice(0, letterIndex));
    } else {
      // Add letter to path
      setTrailPath([...trailPath, index]);
    }
  };

  const checkTrailWord = () => {
    const word = trailPath.map(index => trailLetters[index]).join('');
    
    if (currentWords.includes(word) && !trailWords.includes(word)) {
      setTrailWords([...trailWords, word]);
      handleWordFound(word, word.length * 15);
      setTrailPath([]);
    } else {
      toast({
        title: "Invalid Word",
        description: "That's not a valid word or you've already found it.",
        variant: "destructive"
      });
    }
  };

  const checkSelectedWord = () => {
    if (selectedCells.length === 0) return;
    
    const size = gridLetters.length;
    const word = selectedCells
      .sort((a, b) => a - b)
      .map(cellIndex => {
        const row = Math.floor(cellIndex / size);
        const col = cellIndex % size;
        return gridLetters[row][col];
      })
      .join('');
    
    const points = word.length * 10 + (difficulty === 'expert' ? 50 : 0);
    
    if (handleWordFound(word, points)) {
      // Success handled in handleWordFound
    } else {
      toast({
        title: "Try Again",
        description: word.length > 0 ? `"${word}" is not a valid word or already found.` : "Select letters to form a word.",
        variant: "destructive"
      });
      
      setGameStats(prev => ({
        ...prev,
        lives: prev.lives - 1,
        combo: 0
      }));
      
      if (gameStats.lives <= 1) {
        setGameComplete(true);
        toast({
          title: "Game Over",
          description: "You've run out of lives!",
          variant: "destructive"
        });
      }
    }
    
    setSelectedCells([]);
  };

  const checkScrambleAnswer = () => {
    const currentWordData = wordDatabase[difficulty][foundWords.length];
    if (!currentWordData) return;
    
    if (userInput === currentWordData.word) {
      handleWordFound(currentWordData.word, currentWordData.word.length * 15);
      setUserInput('');
    } else {
      toast({
        title: "Try Again",
        description: "That's not the correct word.",
        variant: "destructive"
      });
      
      setGameStats(prev => ({
        ...prev,
        lives: prev.lives - 1,
        combo: 0
      }));
    }
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window && soundEnabled) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameComplete && gameStats.timeRemaining > 0) {
      const timer = setInterval(() => {
        setGameStats(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (gameStats.timeRemaining === 0) {
      setGameComplete(true);
      toast({
        title: "⏰ Time's Up!",
        description: `Final score: ${gameStats.score}`,
        variant: "destructive"
      });
    }
  }, [gameStarted, gameComplete, gameStats.timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-orange-600';
      case 'expert': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="bg-white/90 hover:bg-white text-black"
          >
            ← Back to Categories
          </Button>
          <h1 className="text-4xl font-bold text-white animate-fade-in">📚 Word Master Pro</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 How to Play
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Word Master Pro - Complete Guide</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-blue-600">🔍 Word Search</h3>
                  <p>Find hidden words in the letter grid by clicking letters in sequence. Words can be horizontal, vertical, or diagonal.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-purple-600">🔀 Word Scramble</h3>
                  <p>Unscramble the letters to form the correct word. Use the definition hint to help you!</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-green-600">🎯 Smart Grid Challenge</h3>
                  <p>Take turns placing letters to form words. Connect with adjacent letters in any direction to score points!</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-orange-600">🛤️ Word Trail</h3>
                  <p>Connect letters in any direction to form words. Create your own path through the letter maze!</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-red-600">✏️ Crossword</h3>
                  <p>Solve crossword puzzles by filling in words based on the given clues.</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800">🏆 Scoring System:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Base points = Letter count × 10</li>
                    <li>Streak bonus: +50 points for 3+ consecutive words</li>
                    <li>Combo multiplier: Up to 5x for rapid success</li>
                    <li>Perfect words: No hints used bonus</li>
                    <li>Time bonus: Remaining seconds × 2</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800">💡 Tips for Success:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Look for common prefixes and suffixes</li>
                    <li>Start with shorter words and build up</li>
                    <li>Use hints wisely - you only get 3 per game</li>
                    <li>Learn word meanings to expand vocabulary</li>
                    <li>Practice different game modes for variety</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Choose Your Word Adventure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold">🎯 Difficulty Level</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger className="text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy - 3-5 letter words</SelectItem>
                      <SelectItem value="medium">🟡 Medium - 5-8 letter words</SelectItem>
                      <SelectItem value="hard">🔴 Hard - 8-12 letter words</SelectItem>
                      <SelectItem value="expert">🟣 Expert - Advanced vocabulary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-lg font-semibold">🎮 Game Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger className="text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="word-search">🔍 Word Search Classic</SelectItem>
                      <SelectItem value="scramble">🔀 Word Scramble</SelectItem>
                      <SelectItem value="smart-grid">🎯 Smart Grid Challenge</SelectItem>
                      <SelectItem value="trail">🛤️ Word Trail</SelectItem>
                      <SelectItem value="crossword">✏️ Crossword Puzzle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">⚙️ Game Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    <label>🔊 Sound Effects</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={animations} onCheckedChange={setAnimations} />
                    <label>✨ Animations</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} />
                    <label>⏭️ Auto Advance</label>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={initializeGame} 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🚀 Start Word Adventure
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Game Stats */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-blue-600">{gameStats.score.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-green-600">{gameStats.wordsFound}/{gameStats.totalWords}</div>
                    <div className="text-sm text-gray-600">Words</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-purple-600">{gameStats.streak}</div>
                    <div className="text-sm text-gray-600">Streak</div>
                  </div>
                  <div className="space-y-1">
                    <div className={`text-3xl font-bold ${gameStats.timeRemaining < 60 ? 'text-red-600' : 'text-orange-600'}`}>
                      {formatTime(gameStats.timeRemaining)}
                    </div>
                    <div className="text-sm text-gray-600">Time</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-red-600">{'❤️'.repeat(gameStats.lives)}</div>
                    <div className="text-sm text-gray-600">Lives</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-yellow-600">{gameStats.combo}x</div>
                    <div className="text-sm text-gray-600">Combo</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Progress 
                    value={(gameStats.wordsFound / gameStats.totalWords) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress: {Math.round((gameStats.wordsFound / gameStats.totalWords) * 100)}%</span>
                    <span className={getDifficultyColor(difficulty)}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Area */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <Tabs value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="word-search" className="text-sm">🔍 Search</TabsTrigger>
                    <TabsTrigger value="scramble" className="text-sm">🔀 Scramble</TabsTrigger>
                    <TabsTrigger value="smart-grid" className="text-sm">🎯 Smart Grid</TabsTrigger>
                    <TabsTrigger value="trail" className="text-sm">🛤️ Trail</TabsTrigger>
                    <TabsTrigger value="crossword" className="text-sm">✏️ Crossword</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="word-search" className="space-y-6">
                    {renderWordSearchGrid()}
                    <div className="text-center space-x-2">
                      <Button 
                        onClick={checkSelectedWord}
                        disabled={selectedCells.length === 0}
                        className="bg-blue-500 hover:bg-blue-600 px-6 py-3"
                      >
                        ✅ Check Word ({selectedCells.length} letters)
                      </Button>
                      <Button 
                        onClick={() => setSelectedCells([])}
                        variant="outline"
                      >
                        🔄 Clear Selection
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="scramble" className="space-y-6">
                    {renderWordScramble()}
                  </TabsContent>
                  
                  <TabsContent value="smart-grid" className="space-y-6">
                    {renderSmartGrid()}
                  </TabsContent>
                  
                  <TabsContent value="trail" className="space-y-6">
                    {renderWordTrail()}
                  </TabsContent>
                  
                  <TabsContent value="crossword" className="space-y-6">
                    <CrosswordGame 
                      difficulty={difficulty}
                      onWordFound={handleWordFound}
                      onComplete={() => setGameComplete(true)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Words Progress */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📝 Word Progress
                  <Badge variant="outline" className="ml-auto">
                    {foundWords.length}/{currentWords.length} Complete
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {currentWords.map((word, index) => {
                    const isFound = foundWords.includes(word);
                    const wordData = wordDatabase[difficulty].find(w => w.word === word);
                    
                    return (
                      <div
                        key={word}
                        className={`
                          p-3 rounded-lg border transition-all duration-300
                          ${isFound ? 
                            'bg-green-100 border-green-300 text-green-800' : 
                            'bg-gray-50 border-gray-200 text-gray-600'
                          }
                        `}
                      >
                        <div className="font-bold">
                          {isFound ? `✅ ${word}` : `${word.length} letters`}
                        </div>
                        {isFound && wordData && (
                          <div className="text-xs mt-1 opacity-75">
                            {wordData.definition.slice(0, 50)}...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Word Meaning Dialog */}
        <Dialog open={showMeaning} onOpenChange={setShowMeaning}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                📖 Word Definition
                {soundEnabled && currentWordDef && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => speakWord(currentWordDef.word)}
                  >
                    🔊 Pronounce
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            {currentWordDef && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-purple-600 mb-2">{currentWordDef.word}</h2>
                  <p className="text-lg text-gray-700">{currentWordDef.definition}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {currentWordDef.synonyms.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-bold text-blue-800 mb-2">📝 Synonyms:</h3>
                      <div className="flex flex-wrap gap-1">
                        {currentWordDef.synonyms.map((synonym, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-100">
                            {synonym}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentWordDef.antonyms.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-bold text-red-800 mb-2">🔄 Antonyms:</h3>
                      <div className="flex flex-wrap gap-1">
                        {currentWordDef.antonyms.map((antonym, index) => (
                          <Badge key={index} variant="outline" className="bg-red-100">
                            {antonym}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-2">💭 Example:</h3>
                  <p className="italic text-green-700">"{currentWordDef.example}"</p>
                </div>
                
                <Button 
                  onClick={() => setShowMeaning(false)} 
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  Continue Playing
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Game Complete Dialog */}
        <Dialog open={gameComplete} onOpenChange={setGameComplete}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                {gameStats.wordsFound === gameStats.totalWords ? '🎉 Perfect Score!' : '🏆 Game Complete!'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-center">
              <div className="text-8xl mb-4">
                {gameStats.wordsFound === gameStats.totalWords ? '🌟' : '🏆'}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-lg">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{gameStats.score.toLocaleString()}</div>
                  <div className="text-blue-800">Final Score</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{gameStats.wordsFound}/{gameStats.totalWords}</div>
                  <div className="text-green-800">Words Found</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{gameStats.streak}</div>
                  <div className="text-purple-800">Best Streak</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{gameStats.perfectWords}</div>
                  <div className="text-yellow-800">Perfect Words</div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={initializeGame} className="bg-green-500 hover:bg-green-600 px-6">
                  🔄 Play Again
                </Button>
                <Button 
                  onClick={() => {
                    setGameMode(gameMode === 'word-search' ? 'scramble' : 'word-search');
                    initializeGame();
                  }} 
                  className="bg-blue-500 hover:bg-blue-600 px-6"
                >
                  🎮 Try Different Mode
                </Button>
                <Button onClick={onBack} variant="outline" className="px-6">
                  ← Back to Categories
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Hint Dialog */}
        <AlertDialog open={showHint} onOpenChange={setShowHint}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>💡 Hint</AlertDialogTitle>
              <AlertDialogDescription>
                {currentWordDef && (
                  <div className="space-y-2">
                    <p><strong>Definition:</strong> {currentWordDef.definition}</p>
                    {currentWordDef.synonyms.length > 0 && (
                      <p><strong>Similar words:</strong> {currentWordDef.synonyms.join(', ')}</p>
                    )}
                    <p className="text-sm text-gray-500">Hints remaining: {3 - hintsUsed - 1}</p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  setHintsUsed(hintsUsed + 1);
                  setShowHint(false);
                }}
              >
                Use Hint
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};