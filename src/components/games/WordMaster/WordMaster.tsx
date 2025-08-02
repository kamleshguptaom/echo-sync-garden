import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

interface WordMasterProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GameMode = 'word-search' | 'crossword' | 'scramble' | 'match' | 'quest' | 'smart-grid' | 'trail' | 'mixed';

interface GameStats {
  wordsFound: number;
  totalWords: number;
  score: number;
  timeRemaining: number;
  streak: number;
  level: number;
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
    level: 1
  });
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [gridLetters, setGridLetters] = useState<string[][]>([]);
  const [userInput, setUserInput] = useState('');
  const [showMeaning, setShowMeaning] = useState(false);
  const [currentWordMeaning, setCurrentWordMeaning] = useState('');
  const [gameComplete, setGameComplete] = useState(false);

  // Word databases for different difficulties
  const wordDatabases = {
    easy: [
      'CAT', 'DOG', 'SUN', 'RUN', 'FUN', 'BIG', 'RED', 'HAT', 'BAT', 'MAT',
      'PEN', 'TEN', 'HEN', 'CUP', 'HOP', 'TOP', 'CAR', 'FAR', 'JAR', 'FISH'
    ],
    medium: [
      'HOUSE', 'MOUSE', 'RIVER', 'TIGER', 'HAPPY', 'FRIEND', 'SCHOOL', 'GARDEN',
      'WINDOW', 'FAMILY', 'PURPLE', 'ORANGE', 'FLOWER', 'MOUNTAIN', 'COMPUTER'
    ],
    hard: [
      'BEAUTIFUL', 'WONDERFUL', 'DANGEROUS', 'EXCELLENT', 'INTELLIGENT', 'MYSTERIOUS',
      'EXTRAORDINARY', 'MAGNIFICENT', 'RESPONSIBILITY', 'ENVIRONMENT', 'ACHIEVEMENT'
    ],
    expert: [
      'PHARMACEUTICAL', 'METAMORPHOSIS', 'ACKNOWLEDGMENT', 'ENTREPRENEURSHIP', 'CONSCIOUSNESS',
      'INTERDISCIPLINARY', 'THERMODYNAMICS', 'NEUROPLASTICITY', 'PHOTOSYNTHESIS'
    ]
  };

  // Word meanings database
  const wordMeanings: Record<string, string> = {
    'CAT': 'A small domesticated carnivorous mammal with soft fur',
    'DOG': 'A loyal domesticated carnivorous mammal',
    'HOUSE': 'A building for human habitation',
    'BEAUTIFUL': 'Pleasing the senses or mind aesthetically',
    'COMPUTER': 'An electronic device for storing and processing data',
    'SCHOOL': 'An institution for educating children',
    'FAMILY': 'A group of one or more parents and their children',
    'FLOWER': 'The reproductive structure found in flowering plants',
    'MOUNTAIN': 'A large landform that rises above surrounding land'
  };

  // Initialize game grid
  const initializeGrid = (size: number = 12) => {
    const grid: string[][] = [];
    for (let i = 0; i < size; i++) {
      const row: string[] = [];
      for (let j = 0; j < size; j++) {
        row.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
      }
      grid.push(row);
    }
    return grid;
  };

  // Place words in grid
  const placeWordsInGrid = (grid: string[][], words: string[]) => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal down-right
      [-1, 1],  // diagonal up-right
    ];

    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 50) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * grid.length);
        const startCol = Math.floor(Math.random() * grid[0].length);
        
        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
          placeWord(grid, word, startRow, startCol, direction);
          placed = true;
        }
        attempts++;
      }
    });
    
    return grid;
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: number[]) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + direction[0] * i;
      const newCol = col + direction[1] * i;
      
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
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

  const startGame = () => {
    const words = wordDatabases[difficulty].slice(0, 8).map(word => word.toUpperCase());
    setCurrentWords(words);
    setFoundWords([]);
    setSelectedCells([]);
    
    let grid = initializeGrid(12);
    grid = placeWordsInGrid(grid, words);
    setGridLetters(grid);
    
    setGameStats({
      wordsFound: 0,
      totalWords: words.length,
      score: 0,
      timeRemaining: difficulty === 'easy' ? 600 : difficulty === 'medium' ? 450 : 300,
      streak: 0,
      level: 1
    });
    
    setGameStarted(true);
    setGameComplete(false);
  };

  const handleCellClick = (row: number, col: number) => {
    const cellIndex = row * 12 + col;
    
    if (selectedCells.includes(cellIndex)) {
      setSelectedCells(selectedCells.filter(cell => cell !== cellIndex));
    } else {
      setSelectedCells([...selectedCells, cellIndex]);
    }
  };

  const checkSelectedWord = () => {
    if (selectedCells.length === 0) return;
    
    const word = selectedCells
      .sort((a, b) => a - b)
      .map(cellIndex => {
        const row = Math.floor(cellIndex / 12);
        const col = cellIndex % 12;
        return gridLetters[row][col];
      })
      .join('');
    
    if (currentWords.includes(word) && !foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      
      // Update score and stats
      const points = word.length * 10 + (difficulty === 'expert' ? 50 : 0);
      setGameStats(prev => ({
        ...prev,
        wordsFound: newFoundWords.length,
        score: prev.score + points,
        streak: prev.streak + 1
      }));
      
      // Show word meaning
      setCurrentWordMeaning(wordMeanings[word] || 'Great word!');
      setShowMeaning(true);
      
      toast({
        title: "Word Found!",
        description: `You found "${word}" for ${points} points!`,
      });
      
      // Check if game complete
      if (newFoundWords.length === currentWords.length) {
        setGameComplete(true);
        toast({
          title: "Level Complete!",
          description: `Amazing! You found all words!`,
        });
      }
    } else {
      toast({
        title: "Try Again",
        description: word.length > 0 ? `"${word}" is not a valid word.` : "Select letters to form a word.",
        variant: "destructive"
      });
    }
    
    setSelectedCells([]);
  };

  const renderWordSearchGrid = () => (
    <div className="grid grid-cols-12 gap-1 max-w-md mx-auto">
      {gridLetters.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const cellIndex = rowIndex * 12 + colIndex;
          const isSelected = selectedCells.includes(cellIndex);
          const isInFoundWord = foundWords.some(word => {
            // Simple check - in a real implementation, you'd track word positions
            return word.includes(letter);
          });
          
          return (
            <div
              key={cellIndex}
              className={`
                w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                border border-gray-300 rounded
                ${isSelected ? 'bg-blue-500 text-white' : 
                  isInFoundWord ? 'bg-green-200 text-green-800' : 
                  'bg-white hover:bg-gray-100'}
                transition-colors
              `}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );

  const renderScrambleGame = () => {
    const currentWord = currentWords[foundWords.length] || '';
    const scrambledWord = currentWord.split('').sort(() => Math.random() - 0.5).join('');
    
    return (
      <div className="text-center space-y-6">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Unscramble this word:</h3>
          <div className="text-4xl font-bold text-purple-600 mb-4 tracking-widest">
            {scrambledWord}
          </div>
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toUpperCase())}
            placeholder="Type your answer..."
            className="text-center text-lg max-w-xs mx-auto"
            onKeyPress={(e) => e.key === 'Enter' && checkScrambleAnswer()}
          />
          <Button 
            onClick={checkScrambleAnswer} 
            className="mt-4 bg-purple-500 hover:bg-purple-600"
            disabled={!userInput}
          >
            Submit Answer
          </Button>
        </div>
      </div>
    );
  };

  const checkScrambleAnswer = () => {
    const currentWord = currentWords[foundWords.length] || '';
    
    if (userInput === currentWord) {
      const newFoundWords = [...foundWords, currentWord];
      setFoundWords(newFoundWords);
      setUserInput('');
      
      const points = currentWord.length * 15;
      setGameStats(prev => ({
        ...prev,
        wordsFound: newFoundWords.length,
        score: prev.score + points,
        streak: prev.streak + 1
      }));
      
      setCurrentWordMeaning(wordMeanings[currentWord] || 'Excellent work!');
      setShowMeaning(true);
      
      if (newFoundWords.length === currentWords.length) {
        setGameComplete(true);
      }
    } else {
      toast({
        title: "Try Again",
        description: "That's not the correct word.",
        variant: "destructive"
      });
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
        title: "Time's Up!",
        description: `Game over! Final score: ${gameStats.score}`,
        variant: "destructive"
      });
    }
  }, [gameStarted, gameComplete, gameStats.timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="bg-white/90 hover:bg-white"
          >
            ← Back to Categories
          </Button>
          <h1 className="text-4xl font-bold text-white">📚 Word Master</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 How to Play
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Word Master - How to Play</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">🔍 Word Search</h3>
                  <p>Find hidden words in the letter grid by clicking letters in sequence.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">🔀 Word Scramble</h3>
                  <p>Unscramble the letters to form the correct word.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">🎯 Smart Grid</h3>
                  <p>Create words by connecting adjacent letters in any direction.</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-bold">💡 Tips:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Look for patterns and common letter combinations</li>
                    <li>Start with shorter words and build up</li>
                    <li>Use hints when you're stuck</li>
                    <li>Learn word meanings to expand vocabulary</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="max-w-2xl mx-auto bg-white/95">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Choose Your Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy - Short Words</SelectItem>
                      <SelectItem value="medium">🟡 Medium - Common Words</SelectItem>
                      <SelectItem value="hard">🔴 Hard - Complex Words</SelectItem>
                      <SelectItem value="expert">🟣 Expert - Advanced Vocabulary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Game Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="word-search">🔍 Word Search</SelectItem>
                      <SelectItem value="scramble">🔀 Word Scramble</SelectItem>
                      <SelectItem value="crossword">✏️ Crossword</SelectItem>
                      <SelectItem value="smart-grid">🎯 Smart Grid</SelectItem>
                      <SelectItem value="mixed">🎲 Mixed Modes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={startGame} 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
                >
                  🚀 Start Word Adventure
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Game Stats */}
            <Card className="bg-white/95">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{gameStats.score}</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{gameStats.wordsFound}/{gameStats.totalWords}</div>
                    <div className="text-sm text-gray-600">Words Found</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{gameStats.streak}</div>
                    <div className="text-sm text-gray-600">Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{formatTime(gameStats.timeRemaining)}</div>
                    <div className="text-sm text-gray-600">Time Left</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{gameStats.level}</div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                </div>
                <Progress 
                  value={(gameStats.wordsFound / gameStats.totalWords) * 100} 
                  className="mt-4"
                />
              </CardContent>
            </Card>

            {/* Game Area */}
            <Card className="bg-white/95">
              <CardContent className="p-6">
                <Tabs value={gameMode} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="word-search">Word Search</TabsTrigger>
                    <TabsTrigger value="scramble">Scramble</TabsTrigger>
                    <TabsTrigger value="smart-grid">Smart Grid</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="word-search" className="space-y-6">
                    {renderWordSearchGrid()}
                    <div className="text-center">
                      <Button 
                        onClick={checkSelectedWord}
                        disabled={selectedCells.length === 0}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Check Word ({selectedCells.length} letters)
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="scramble" className="space-y-6">
                    {renderScrambleGame()}
                  </TabsContent>
                  
                  <TabsContent value="smart-grid" className="space-y-6">
                    <div className="text-center">
                      <p className="text-lg mb-4">Smart Grid mode coming soon!</p>
                      <p className="text-gray-600">Build words by connecting letters in any direction.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Word List */}
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle>Words to Find</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentWords.map((word, index) => (
                    <Badge 
                      key={word}
                      variant={foundWords.includes(word) ? "default" : "outline"}
                      className={foundWords.includes(word) ? "bg-green-500" : ""}
                    >
                      {foundWords.includes(word) ? `✓ ${word}` : `${word.length} letters`}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Word Meaning Dialog */}
        <Dialog open={showMeaning} onOpenChange={setShowMeaning}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Word Meaning</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-lg">{currentWordMeaning}</p>
              <Button onClick={() => setShowMeaning(false)} className="w-full">
                Continue Playing
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Game Complete Dialog */}
        <Dialog open={gameComplete} onOpenChange={setGameComplete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🎉 Congratulations!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-center">
              <div className="text-6xl">🏆</div>
              <p className="text-xl">Final Score: {gameStats.score}</p>
              <p>Words Found: {gameStats.wordsFound}/{gameStats.totalWords}</p>
              <p>Longest Streak: {gameStats.streak}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  Play Again
                </Button>
                <Button onClick={onBack} variant="outline">
                  Back to Categories
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};