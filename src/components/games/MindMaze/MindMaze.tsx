import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Volume2, VolumeX, Timer, Target, Zap, Trophy } from 'lucide-react';

interface MindMazeProps {
  onBack: () => void;
}

type PuzzleType = 'pathfinding' | 'sequence' | 'pattern' | 'logic' | 'spatial';

interface Puzzle {
  id: string;
  type: PuzzleType;
  title: string;
  difficulty: number;
  timeLimit: number;
  description: string;
}

interface PathCell {
  x: number;
  y: number;
  type: 'start' | 'end' | 'wall' | 'path' | 'visited';
  isCorrect?: boolean;
}

const MindMaze: React.FC<MindMazeProps> = ({ onBack }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'complete' | 'failed'>('menu');

  // Pathfinding state
  const [maze, setMaze] = useState<PathCell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [solution, setSolution] = useState<{x: number, y: number}[]>([]);

  // Sequence state
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);

  // Pattern state
  const [pattern, setPattern] = useState<boolean[][]>([]);
  const [userPattern, setUserPattern] = useState<boolean[][]>([]);

  // Logic state
  const [logicPuzzle, setLogicPuzzle] = useState<{
    question: string;
    options: string[];
    correct: number;
  }>({ question: '', options: [], correct: 0 });

  // Spatial state
  const [shapes, setShapes] = useState<{
    id: string;
    shape: string;
    rotation: number;
    position: {x: number, y: number};
    target?: {x: number, y: number};
  }[]>([]);

  const puzzleTypes: { type: PuzzleType; name: string; icon: string; color: string }[] = [
    { type: 'pathfinding', name: 'Maze Runner', icon: '🏃', color: 'bg-blue-500' },
    { type: 'sequence', name: 'Memory Chain', icon: '🔗', color: 'bg-green-500' },
    { type: 'pattern', name: 'Pattern Match', icon: '🔳', color: 'bg-purple-500' },
    { type: 'logic', name: 'Logic Quest', icon: '🧠', color: 'bg-orange-500' },
    { type: 'spatial', name: 'Shape Shift', icon: '🔄', color: 'bg-red-500' }
  ];

  const playSound = useCallback((type: 'move' | 'success' | 'fail' | 'tick') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'move':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        break;
      case 'success':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        break;
      case 'fail':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        break;
      case 'tick':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [soundEnabled]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('failed');
            playSound('fail');
            return 0;
          }
          if (prev <= 10) playSound('tick');
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, playSound]);

  const generateMaze = useCallback((size: number) => {
    const newMaze: PathCell[][] = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({ x: 0, y: 0, type: 'wall' as const }))
    );
    
    // Set positions
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        newMaze[y][x] = { x, y, type: 'wall' };
      }
    }
    
    // Generate simple path
    const path: {x: number, y: number}[] = [];
    let currentX = 0, currentY = 0;
    
    while (currentX < size - 1 || currentY < size - 1) {
      path.push({ x: currentX, y: currentY });
      newMaze[currentY][currentX].type = 'path';
      
      if (currentX < size - 1 && (Math.random() > 0.5 || currentY === size - 1)) {
        currentX++;
      } else if (currentY < size - 1) {
        currentY++;
      }
    }
    
    path.push({ x: size - 1, y: size - 1 });
    newMaze[0][0].type = 'start';
    newMaze[size - 1][size - 1].type = 'end';
    
    // Add some random paths
    for (let i = 0; i < size; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (newMaze[y][x].type === 'wall') {
        newMaze[y][x].type = 'path';
      }
    }
    
    setMaze(newMaze);
    setSolution(path);
    setPlayerPos({ x: 0, y: 0 });
  }, []);

  const generateSequence = useCallback((length: number) => {
    const newSequence = Array(length).fill(0).map(() => Math.floor(Math.random() * 6));
    setSequence(newSequence);
    setUserSequence([]);
  }, []);

  const generatePattern = useCallback((size: number) => {
    const newPattern = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => Math.random() > 0.6)
    );
    setPattern(newPattern);
    setUserPattern(Array(size).fill(null).map(() => Array(size).fill(false)));
  }, []);

  const generateLogicPuzzle = useCallback(() => {
    const puzzles = [
      {
        question: "If all roses are flowers and some flowers are red, which must be true?",
        options: ["All roses are red", "Some roses are red", "No roses are red", "Some roses might be red"],
        correct: 3
      },
      {
        question: "What comes next in the sequence: 2, 4, 8, 16, ?",
        options: ["24", "32", "20", "18"],
        correct: 1
      },
      {
        question: "If Monday is to Week as January is to ?",
        options: ["Year", "Month", "Calendar", "Season"],
        correct: 0
      }
    ];
    
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setLogicPuzzle(puzzle);
  }, []);

  const generateShapes = useCallback(() => {
    const shapeTypes = ['🔺', '🔲', '⭕', '🔶'];
    const newShapes = Array(4).fill(null).map((_, index) => ({
      id: `shape-${index}`,
      shape: shapeTypes[index],
      rotation: 0,
      position: { x: index * 80 + 50, y: 100 },
      target: { x: index * 80 + 50, y: 300 }
    }));
    
    // Shuffle targets
    const targets = newShapes.map(s => s.target);
    for (let i = targets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targets[i], targets[j]] = [targets[j], targets[i]];
    }
    
    newShapes.forEach((shape, index) => {
      shape.target = targets[index];
    });
    
    setShapes(newShapes);
  }, []);

  const startPuzzle = (type: PuzzleType) => {
    const puzzle: Puzzle = {
      id: `${type}-${level}`,
      type,
      title: puzzleTypes.find(p => p.type === type)?.name || '',
      difficulty: level,
      timeLimit: Math.max(30, 90 - level * 5),
      description: `Level ${level} ${type} challenge`
    };
    
    setCurrentPuzzle(puzzle);
    setTimeLeft(puzzle.timeLimit);
    setGameState('playing');
    
    switch (type) {
      case 'pathfinding':
        generateMaze(4 + Math.floor(level / 2));
        break;
      case 'sequence':
        generateSequence(3 + level);
        setShowingSequence(true);
        setTimeout(() => setShowingSequence(false), (3 + level) * 800);
        break;
      case 'pattern':
        generatePattern(3 + Math.floor(level / 2));
        break;
      case 'logic':
        generateLogicPuzzle();
        break;
      case 'spatial':
        generateShapes();
        break;
    }
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState !== 'playing' || !currentPuzzle || currentPuzzle.type !== 'pathfinding') return;
    
    const { x, y } = playerPos;
    let newX = x, newY = y;
    
    switch (direction) {
      case 'up': newY = Math.max(0, y - 1); break;
      case 'down': newY = Math.min(maze.length - 1, y + 1); break;
      case 'left': newX = Math.max(0, x - 1); break;
      case 'right': newX = Math.min(maze[0].length - 1, x + 1); break;
    }
    
    if (maze[newY][newX].type !== 'wall') {
      setPlayerPos({ x: newX, y: newY });
      playSound('move');
      
      if (maze[newY][newX].type === 'end') {
        completePuzzle();
      }
    }
  };

  const addSequenceInput = (value: number) => {
    if (showingSequence || gameState !== 'playing') return;
    
    const newUserSequence = [...userSequence, value];
    setUserSequence(newUserSequence);
    playSound('move');
    
    if (newUserSequence.length === sequence.length) {
      const isCorrect = newUserSequence.every((val, index) => val === sequence[index]);
      if (isCorrect) {
        completePuzzle();
      } else {
        failPuzzle();
      }
    }
  };

  const togglePatternCell = (row: number, col: number) => {
    if (gameState !== 'playing') return;
    
    const newUserPattern = [...userPattern];
    newUserPattern[row][col] = !newUserPattern[row][col];
    setUserPattern(newUserPattern);
    playSound('move');
    
    // Check if pattern matches
    const matches = pattern.every((row, rIndex) =>
      row.every((cell, cIndex) => cell === userPattern[rIndex][cIndex])
    );
    
    if (matches) {
      completePuzzle();
    }
  };

  const answerLogicPuzzle = (optionIndex: number) => {
    if (gameState !== 'playing') return;
    
    if (optionIndex === logicPuzzle.correct) {
      completePuzzle();
    } else {
      failPuzzle();
    }
  };

  const completePuzzle = () => {
    setGameState('complete');
    setScore(prev => prev + (timeLeft * level));
    setLevel(prev => prev + 1);
    playSound('success');
  };

  const failPuzzle = () => {
    setLives(prev => prev - 1);
    playSound('fail');
    
    if (lives <= 1) {
      setGameState('failed');
    } else {
      setGameState('playing');
      setTimeLeft(currentPuzzle?.timeLimit || 60);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setGameState('menu');
    setCurrentPuzzle(null);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentPuzzle?.type === 'pathfinding') {
        switch (e.key) {
          case 'ArrowUp': movePlayer('up'); break;
          case 'ArrowDown': movePlayer('down'); break;
          case 'ArrowLeft': movePlayer('left'); break;
          case 'ArrowRight': movePlayer('right'); break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPuzzle, playerPos, maze]);

  const renderPuzzleMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {puzzleTypes.map((puzzleType) => (
        <Card 
          key={puzzleType.type}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => startPuzzle(puzzleType.type)}
        >
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">{puzzleType.icon}</div>
            <CardTitle className="text-lg">{puzzleType.name}</CardTitle>
            <Badge className={`${puzzleType.color} text-white`}>
              Level {level}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 text-center">
              Test your {puzzleType.type} skills
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPathfinding = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Navigate to the exit!</h3>
        <p className="text-sm text-gray-600">Use arrow keys or click adjacent cells</p>
      </div>
      
      <div className="flex justify-center">
        <div className="grid gap-1 p-4 bg-gray-100 rounded-lg" style={{
          gridTemplateColumns: `repeat(${maze[0]?.length || 4}, 1fr)`
        }}>
          {maze.flat().map((cell, index) => {
            const isPlayer = playerPos.x === cell.x && playerPos.y === cell.y;
            
            return (
              <div
                key={index}
                className={`
                  w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                  ${cell.type === 'wall' ? 'bg-gray-800' : 
                    cell.type === 'start' ? 'bg-green-300' :
                    cell.type === 'end' ? 'bg-red-300' :
                    'bg-white border border-gray-300'}
                `}
                onClick={() => {
                  const distance = Math.abs(cell.x - playerPos.x) + Math.abs(cell.y - playerPos.y);
                  if (distance === 1 && cell.type !== 'wall') {
                    setPlayerPos({ x: cell.x, y: cell.y });
                    playSound('move');
                    if (cell.type === 'end') completePuzzle();
                  }
                }}
              >
                {isPlayer ? '🤖' : 
                 cell.type === 'start' ? 'S' :
                 cell.type === 'end' ? 'E' :
                 cell.type === 'wall' ? '🧱' : ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSequence = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">
          {showingSequence ? 'Watch the sequence!' : 'Repeat the sequence!'}
        </h3>
        <p className="text-sm text-gray-600">
          {showingSequence ? 'Memorize the order' : `${userSequence.length}/${sequence.length}`}
        </p>
      </div>
      
      {showingSequence ? (
        <div className="flex justify-center gap-2">
          {sequence.map((value, index) => (
            <div
              key={index}
              className={`
                w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold
                animate-pulse
              `}
              style={{ 
                backgroundColor: `hsl(${value * 60}, 70%, 60%)`,
                animationDelay: `${index * 0.8}s`,
                animationDuration: '0.6s'
              }}
            >
              {value + 1}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {userSequence.map((value, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: `hsl(${value * 60}, 70%, 60%)` }}
              >
                {value + 1}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {Array.from({ length: 6 }, (_, i) => (
              <Button
                key={i}
                onClick={() => addSequenceInput(i)}
                className="h-16 text-xl font-bold"
                style={{ backgroundColor: `hsl(${i * 60}, 70%, 60%)` }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPattern = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Match the pattern!</h3>
        <p className="text-sm text-gray-600">Click cells to toggle them</p>
      </div>
      
      <div className="flex justify-center gap-8">
        <div>
          <h4 className="text-center font-bold mb-2">Target</h4>
          <div className="grid gap-1" style={{
            gridTemplateColumns: `repeat(${pattern[0]?.length || 3}, 1fr)`
          }}>
            {pattern.flat().map((cell, index) => (
              <div
                key={index}
                className={`w-8 h-8 border border-gray-400 ${
                  cell ? 'bg-blue-500' : 'bg-white'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-center font-bold mb-2">Your Pattern</h4>
          <div className="grid gap-1" style={{
            gridTemplateColumns: `repeat(${userPattern[0]?.length || 3}, 1fr)`
          }}>
            {userPattern.flat().map((cell, index) => {
              const row = Math.floor(index / userPattern[0].length);
              const col = index % userPattern[0].length;
              
              return (
                <div
                  key={index}
                  className={`w-8 h-8 border border-gray-400 cursor-pointer ${
                    cell ? 'bg-green-500' : 'bg-white'
                  }`}
                  onClick={() => togglePatternCell(row, col)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogic = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Logic Challenge</h3>
        <div className="bg-blue-50 p-6 rounded-lg max-w-2xl mx-auto">
          <p className="text-lg font-medium">{logicPuzzle.question}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {logicPuzzle.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => answerLogicPuzzle(index)}
            variant="outline"
            className="h-auto p-4 text-left whitespace-normal"
          >
            <div>
              <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={() => {
              if (gameState === 'playing') {
                setGameState('menu');
                setCurrentPuzzle(null);
              } else {
                onBack();
              }
            }}
            variant="outline" 
            className="bg-white/20 text-white border-white/30"
          >
            ← {gameState === 'playing' ? 'Menu' : 'Back'}
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">🧩 Mind Maze</h1>
            <p className="text-white/90">Challenge your cognitive abilities</p>
          </div>
          
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="outline"
            className="bg-white/20 text-white border-white/30"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </Button>
        </div>

        {/* Game Stats */}
        {gameState !== 'menu' && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/90">
              <CardContent className="text-center p-4">
                <Trophy className="mx-auto text-yellow-500 mb-2" size={24} />
                <div className="font-bold">{score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90">
              <CardContent className="text-center p-4">
                <Target className="mx-auto text-blue-500 mb-2" size={24} />
                <div className="font-bold">{level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90">
              <CardContent className="text-center p-4">
                <Timer className="mx-auto text-green-500 mb-2" size={24} />
                <div className="font-bold">{timeLeft}s</div>
                <div className="text-sm text-gray-600">Time</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90">
              <CardContent className="text-center p-4">
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <span key={i} className={i < lives ? 'text-red-500' : 'text-gray-300'}>
                      ❤️
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">Lives</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Content */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            {gameState === 'menu' && renderPuzzleMenu()}
            {gameState === 'playing' && currentPuzzle?.type === 'pathfinding' && renderPathfinding()}
            {gameState === 'playing' && currentPuzzle?.type === 'sequence' && renderSequence()}
            {gameState === 'playing' && currentPuzzle?.type === 'pattern' && renderPattern()}
            {gameState === 'playing' && currentPuzzle?.type === 'logic' && renderLogic()}
            
            {gameState === 'complete' && (
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-green-600">Puzzle Complete!</h2>
                <p>Score earned: {timeLeft * level}</p>
                <p>Total Score: {score}</p>
                <Button onClick={() => setGameState('menu')}>
                  Continue to Level {level}
                </Button>
              </div>
            )}
            
            {gameState === 'failed' && (
              <div className="text-center space-y-4">
                <div className="text-6xl">💭</div>
                <h2 className="text-2xl font-bold text-red-600">Game Over!</h2>
                <p>Final Score: {score}</p>
                <p>Highest Level: {level}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame}>
                    Play Again
                  </Button>
                  <Button onClick={() => setGameState('menu')} variant="outline">
                    Back to Menu
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MindMaze;