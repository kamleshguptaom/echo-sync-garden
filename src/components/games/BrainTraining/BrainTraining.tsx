import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Volume2, VolumeX, RotateCcw, Trophy, Star } from 'lucide-react';

interface BrainTrainingProps {
  onBack: () => void;
}

type GameType = 'memory' | 'focus' | 'speed' | 'logic';

interface MemoryItem {
  id: number;
  color: string;
  position: number;
}

interface FocusItem {
  id: number;
  shape: string;
  color: string;
  isTarget: boolean;
}

const BrainTraining: React.FC<BrainTrainingProps> = ({ onBack }) => {
  const [currentGame, setCurrentGame] = useState<GameType>('memory');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'showSequence' | 'gameOver' | 'levelComplete'>('menu');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Memory Game State
  const [sequence, setSequence] = useState<MemoryItem[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Focus Game State
  const [focusItems, setFocusItems] = useState<FocusItem[]>([]);
  const [targetShape, setTargetShape] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  
  // Speed Game State
  const [mathProblem, setMathProblem] = useState({ question: '', answer: 0, options: [0] });
  const [speedScore, setSpeedScore] = useState(0);
  
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
  const shapes = ['●', '■', '▲', '◆', '★', '♦'];

  const playSound = useCallback((type: 'correct' | 'wrong' | 'click') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'correct':
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        break;
      case 'wrong':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        break;
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [soundEnabled]);

  const generateMemorySequence = useCallback(() => {
    const newSequence: MemoryItem[] = [];
    for (let i = 0; i < level + 2; i++) {
      newSequence.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        position: Math.floor(Math.random() * 9)
      });
    }
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentStep(0);
  }, [level]);

  const generateFocusItems = useCallback(() => {
    const items: FocusItem[] = [];
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(target);
    
    for (let i = 0; i < 20; i++) {
      const shape = Math.random() < 0.3 ? target : shapes[Math.floor(Math.random() * shapes.length)];
      items.push({
        id: i,
        shape,
        color: colors[Math.floor(Math.random() * colors.length)],
        isTarget: shape === target
      });
    }
    setFocusItems(items);
  }, []);

  const generateMathProblem = useCallback(() => {
    const a = Math.floor(Math.random() * (level * 5)) + 1;
    const b = Math.floor(Math.random() * (level * 5)) + 1;
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let answer = 0;
    let question = '';
    
    switch (op) {
      case '+':
        answer = a + b;
        question = `${a} + ${b}`;
        break;
      case '-':
        answer = Math.abs(a - b);
        question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
        break;
      case '×':
        answer = a * b;
        question = `${a} × ${b}`;
        break;
    }
    
    const options = [answer];
    while (options.length < 4) {
      const wrong = answer + Math.floor(Math.random() * 20) - 10;
      if (wrong !== answer && wrong > 0 && !options.includes(wrong)) {
        options.push(wrong);
      }
    }
    
    setMathProblem({
      question,
      answer,
      options: options.sort(() => Math.random() - 0.5)
    });
  }, [level]);

  const startGame = (gameType: GameType) => {
    setCurrentGame(gameType);
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    
    switch (gameType) {
      case 'memory':
        generateMemorySequence();
        setGameState('showSequence');
        break;
      case 'focus':
        generateFocusItems();
        setTimeLeft(30);
        break;
      case 'speed':
        generateMathProblem();
        setSpeedScore(0);
        setTimeLeft(60);
        break;
    }
  };

  const handleMemoryClick = (position: number) => {
    if (gameState !== 'playing') return;
    
    playSound('click');
    const newUserSequence = [...userSequence, position];
    setUserSequence(newUserSequence);
    
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1].position) {
      playSound('wrong');
      setLives(prev => prev - 1);
      if (lives <= 1) {
        setGameState('gameOver');
      } else {
        setGameState('showSequence');
        setUserSequence([]);
      }
    } else if (newUserSequence.length === sequence.length) {
      playSound('correct');
      setScore(prev => prev + level * 10);
      setLevel(prev => prev + 1);
      setGameState('levelComplete');
    }
  };

  const handleFocusClick = (item: FocusItem) => {
    if (item.isTarget) {
      playSound('correct');
      setScore(prev => prev + 10);
    } else {
      playSound('wrong');
      setLives(prev => prev - 1);
    }
  };

  const handleSpeedAnswer = (selectedAnswer: number) => {
    if (selectedAnswer === mathProblem.answer) {
      playSound('correct');
      setSpeedScore(prev => prev + 1);
      setScore(prev => prev + level * 5);
      generateMathProblem();
    } else {
      playSound('wrong');
      setLives(prev => prev - 1);
    }
  };

  // Timer effects
  useEffect(() => {
    if (gameState === 'playing' && (currentGame === 'focus' || currentGame === 'speed')) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('gameOver');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState, currentGame]);

  // Memory sequence display effect
  useEffect(() => {
    if (gameState === 'showSequence') {
      setShowingSequence(true);
      const timer = setTimeout(() => {
        setShowingSequence(false);
        setGameState('playing');
      }, (sequence.length + 1) * 800);
      
      return () => clearTimeout(timer);
    }
  }, [gameState, sequence.length]);

  const renderGameMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => startGame('memory')}>
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🧠</div>
          <CardTitle>Memory Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Remember and repeat color sequences</p>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => startGame('focus')}>
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <CardTitle>Focus Training</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Find target shapes quickly</p>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => startGame('speed')}>
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">⚡</div>
          <CardTitle>Speed Math</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Solve math problems quickly</p>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => startGame('logic')}>
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🧩</div>
          <CardTitle>Logic Puzzles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Pattern recognition and reasoning</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderMemoryGame = () => (
    <div className="space-y-4">
      {gameState === 'showSequence' && (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Watch the sequence!</h3>
          <div className="text-lg">Level {level}</div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        {Array.from({ length: 9 }, (_, i) => {
          const isActive = showingSequence && sequence[currentStep]?.position === i;
          const shouldGlow = sequence.slice(0, currentStep + 1).some(item => item.position === i);
          
          return (
            <div
              key={i}
              className={`
                w-20 h-20 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${isActive ? 'transform scale-110 shadow-lg' : ''}
                ${shouldGlow && showingSequence ? 'bg-yellow-300' : 'bg-gray-200 hover:bg-gray-300'}
              `}
              style={{
                backgroundColor: isActive ? sequence[currentStep]?.color : undefined
              }}
              onClick={() => handleMemoryClick(i)}
            />
          );
        })}
      </div>
    </div>
  );

  const renderFocusGame = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold">Find all: <span style={{ fontSize: '2rem' }}>{targetShape}</span></h3>
        <div className="text-lg">Time: {timeLeft}s</div>
      </div>
      
      <div className="grid grid-cols-5 gap-2 max-w-lg mx-auto">
        {focusItems.map((item) => (
          <div
            key={item.id}
            className="w-16 h-16 flex items-center justify-center text-2xl cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: item.color }}
            onClick={() => handleFocusClick(item)}
          >
            {item.shape}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpeedGame = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold mb-4">{mathProblem.question} = ?</div>
        <div className="text-lg">Time: {timeLeft}s | Correct: {speedScore}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {mathProblem.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleSpeedAnswer(option)}
            className="h-16 text-xl"
            variant="outline"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/20 text-white border-white/30">
            ← Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">🧠 Brain Training</h1>
            <p className="text-white/90">Challenge your mind with cognitive exercises</p>
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
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/90">
              <CardContent className="text-center p-4">
                <Trophy className="mx-auto text-yellow-500 mb-2" size={24} />
                <div className="font-bold">{score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90">
              <CardContent className="text-center p-4">
                <Star className="mx-auto text-blue-500 mb-2" size={24} />
                <div className="font-bold">{level}</div>
                <div className="text-sm text-gray-600">Level</div>
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
            {gameState === 'menu' && renderGameMenu()}
            {gameState !== 'menu' && currentGame === 'memory' && renderMemoryGame()}
            {gameState === 'playing' && currentGame === 'focus' && renderFocusGame()}
            {gameState === 'playing' && currentGame === 'speed' && renderSpeedGame()}
            
            {gameState === 'levelComplete' && (
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-green-600">Level Complete!</h2>
                <p>Score: {score}</p>
                <Button onClick={() => {
                  if (currentGame === 'memory') {
                    generateMemorySequence();
                    setGameState('showSequence');
                  }
                }}>
                  Next Level
                </Button>
              </div>
            )}
            
            {gameState === 'gameOver' && (
              <div className="text-center space-y-4">
                <div className="text-6xl">😵</div>
                <h2 className="text-2xl font-bold text-red-600">Game Over!</h2>
                <p>Final Score: {score}</p>
                <p>Level Reached: {level}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => startGame(currentGame)}>
                    <RotateCcw size={16} className="mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={() => setGameState('menu')} variant="outline">
                    Main Menu
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

export default BrainTraining;