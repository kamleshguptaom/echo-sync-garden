import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface ConcentrationGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
type GameMode = 'stroop' | 'nback' | 'attention' | 'focus' | 'random';

interface StroopTest {
  word: string;
  color: string;
  correctAnswer: string;
  isCongruent: boolean;
}

export const ConcentrationGame: React.FC<ConcentrationGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('stroop');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [reactionTime, setReactionTime] = useState<number[]>([]);
  const [currentTest, setCurrentTest] = useState<StroopTest | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [showConcept, setShowConcept] = useState(false);
  const [streak, setStreak] = useState(0);
  const [colorBoxes, setColorBoxes] = useState<Array<{color: string, position: number}>>([]);

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'brown', 'lime'];
  const colorMap = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
    orange: '#f97316',
    pink: '#ec4899',
    cyan: '#06b6d4',
    brown: '#8b4513',
    lime: '#84cc16'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive) {
      interval = setInterval(() => setTimer(timer => timer + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  // Reset game when settings change
  useEffect(() => {
    if (gameStarted) {
      setGameStarted(false);
      setGameActive(false);
      setCurrentTest(null);
      setScore(0);
      setRound(1);
    }
  }, [difficulty, gameMode]);

  const generateRandomColorBoxes = () => {
    const numBoxes = 8 + Math.floor(Math.random() * 8); // 8-16 boxes
    const boxes = [];
    for (let i = 0; i < numBoxes; i++) {
      boxes.push({
        color: colors[Math.floor(Math.random() * colors.length)],
        position: Math.floor(Math.random() * 25) // 5x5 grid positions
      });
    }
    setColorBoxes(boxes);
  };

  const generateStroopTest = useCallback((): StroopTest => {
    const words = colors.map(c => c.toUpperCase());
    const word = words[Math.floor(Math.random() * words.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isCongruent = word.toLowerCase() === color;
    
    return {
      word,
      color,
      correctAnswer: color,
      isCongruent
    };
  }, []);

  const generateNBackTest = () => {
    // Simple N-back implementation
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const currentLetter = letters[Math.floor(Math.random() * letters.length)];
    
    return {
      word: currentLetter,
      color: 'black',
      correctAnswer: currentLetter,
      isCongruent: true
    };
  };

  const generateAttentionTest = () => {
    const shapes = ['●', '■', '▲', '♦'];
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      word: targetShape,
      color: targetColor,
      correctAnswer: targetColor,
      isCongruent: true
    };
  };

  const generateTest = () => {
    let currentMode = gameMode;
    
    if (gameMode === 'random') {
      const modes: GameMode[] = ['stroop', 'nback', 'attention', 'focus'];
      currentMode = modes[Math.floor(Math.random() * modes.length)];
    }

    switch (currentMode) {
      case 'stroop':
        return generateStroopTest();
      case 'nback':
        return generateNBackTest();
      case 'attention':
        return generateAttentionTest();
      case 'focus':
        return generateStroopTest(); // Use stroop for focus mode too
      default:
        return generateStroopTest();
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameActive(true);
    setScore(0);
    setRound(1);
    setTimer(0);
    setReactionTime([]);
    setStreak(0);
    generateNewTest();
  };

  const generateNewTest = () => {
    setCurrentTest(generateTest());
    generateRandomColorBoxes();
    setStartTime(Date.now());
    setShowResult(false);
    setFeedback('');
  };

  const submitAnswer = (answer: string) => {
    if (!currentTest) return;

    const endTime = Date.now();
    const reaction = endTime - startTime;
    setReactionTime([...reactionTime, reaction]);

    const isCorrect = answer === currentTest.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback('✅ Correct!');
    } else {
      setStreak(0);
      setFeedback(`❌ Incorrect. The color was ${currentTest.correctAnswer}`);
    }

    setShowResult(true);

    setTimeout(() => {
      if (round < 20) {
        setRound(round + 1);
        generateNewTest();
      } else {
        setGameActive(false);
      }
    }, 1500);
  };

  const getAverageReactionTime = () => {
    if (reactionTime.length === 0) return 0;
    return Math.round(reactionTime.reduce((a, b) => a + b, 0) / reactionTime.length);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultySettings = () => {
    switch (difficulty === 'random' ? (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)] : difficulty) {
      case 'easy': return { timeLimit: 3000, rounds: 15 };
      case 'medium': return { timeLimit: 2000, rounds: 20 };
      case 'hard': return { timeLimit: 1500, rounds: 25 };
    }
  };

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  const renderColorBoxes = () => (
    <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto mb-6">
      {Array.from({ length: 25 }, (_, i) => {
        const box = colorBoxes.find(b => b.position === i);
        return (
          <div
            key={i}
            className="w-6 h-6 rounded border animate-pulse"
            style={{ 
              backgroundColor: box ? colorMap[box.color as keyof typeof colorMap] : '#f3f4f6',
              animationDelay: `${i * 0.05}s`
            }}
          />
        );
      })}
    </div>
  );

  const renderGameContent = () => {
    if (!currentTest) return null;

    if (gameMode === 'stroop' || gameMode === 'focus' || gameMode === 'random') {
      return (
        <>
          {renderColorBoxes()}
          <div className="mb-6">
            <p className="text-lg mb-4">Click the color of the text (not what the word says):</p>
            <div 
              className="text-8xl font-bold mb-6 animate-pulse"
              style={{ color: colorMap[currentTest.color as keyof typeof colorMap] }}
            >
              {currentTest.word}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {currentTest.isCongruent ? '(Congruent - word and color match)' : '(Incongruent - word and color differ)'}
            </div>
          </div>
        </>
      );
    } else if (gameMode === 'nback' || gameMode === 'attention') {
      return (
        <>
          {renderColorBoxes()}
          <div className="mb-6">
            <p className="text-lg mb-4">Remember this item:</p>
            <div 
              className="text-8xl font-bold mb-6 animate-bounce"
              style={{ color: colorMap[currentTest.color as keyof typeof colorMap] }}
            >
              {currentTest.word}
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={goBack} variant="outline" className="bg-white/90">
            ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
          </Button>
          <h1 className="text-4xl font-bold text-white">🎯 Concentration Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-yellow-500 text-white hover:bg-yellow-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Concentration & Focus Training</DialogTitle>
                <DialogDescription>Enhance your cognitive control and attention</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Stroop Effect</h3>
                  <p className="mb-2">The Stroop effect demonstrates how our brain automatically processes word meaning, which can interfere with identifying colors.</p>
                  <div className="bg-yellow-100 p-3 rounded">
                    <p className="text-sm">Example: When you see the word <span style={{color: 'blue'}}>"RED"</span> written in blue, your brain wants to say "red" but you must say "blue"</p>
                  </div>
                </div>
                <div className="animate-scale-in">
                  <h3 className="font-bold text-lg">🧠 Cognitive Benefits</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Improves selective attention</li>
                    <li>Enhances cognitive flexibility</li>
                    <li>Strengthens inhibitory control</li>
                    <li>Boosts processing speed</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg animate-pulse">
                  <h4 className="font-bold">💡 Training Tip:</h4>
                  <p>Focus on the COLOR of the text, not what the word says!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="mb-6 bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 justify-center">
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
                
                <div>
                  <label className="block text-sm font-medium mb-1">Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stroop">🎨 Stroop Test</SelectItem>
                      <SelectItem value="nback">🧠 N-Back</SelectItem>
                      <SelectItem value="attention">👁️ Attention</SelectItem>
                      <SelectItem value="focus">🎯 Focus</SelectItem>
                      <SelectItem value="random">🎲 Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600">
                  Start Training
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                Round {round}/20 - Score: {score} - Streak: {streak} - Avg: {getAverageReactionTime()}ms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                {renderGameContent()}

                <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto mb-6">
                  {colors.map((color, index) => (
                    <Button
                      key={color}
                      className="h-12 text-white font-bold animate-scale-in text-sm"
                      style={{ 
                        backgroundColor: colorMap[color as keyof typeof colorMap],
                        animationDelay: `${index * 0.05}s`
                      }}
                      onClick={() => submitAnswer(color)}
                      disabled={showResult}
                    >
                      {color.toUpperCase()}
                    </Button>
                  ))}
                </div>

                {feedback && (
                  <div className={`text-xl font-bold mb-4 animate-bounce ${
                    feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {feedback}
                  </div>
                )}

                {showResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Reaction Time: {reactionTime[reactionTime.length - 1]}ms
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                      <h5 className="font-bold text-blue-800 mb-2">🧠 Cognitive Insight:</h5>
                      <p className="text-blue-700 text-sm">
                        {currentTest?.isCongruent 
                          ? "Congruent trials are easier because word meaning and color align."
                          : "Incongruent trials require cognitive control to override automatic word reading."
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!gameActive && round > 1 && (
          <Card className="bg-white/95">
            <CardContent className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Training Complete!</h2>
              <div className="space-y-2 mb-6">
                <p className="text-lg">Final Score: {score}/20</p>
                <p className="text-lg">Average Reaction Time: {getAverageReactionTime()}ms</p>
                <p className="text-lg">Best Streak: {Math.max(...reactionTime.map((_, i) => streak))} correct in a row</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">🎯 Performance Analysis</h3>
                <p className="text-sm">
                  {score >= 16 ? '🏆 Excellent concentration! Your cognitive control is outstanding.' :
                   score >= 12 ? '⭐ Great focus! You handled most conflicts well.' :
                   score >= 8 ? '👍 Good effort! Practice will improve your cognitive flexibility.' :
                   '📚 Keep training! Concentration improves with consistent practice.'}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h5 className="font-bold text-blue-800 mb-2">🔗 Related Learning Resources:</h5>
                <div className="space-y-1">
                  <a href="https://www.braingymmer.com/en/brain-games/" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 text-sm underline">BrainGymmer - Concentration Games</a>
                  <a href="https://www.education.com/worksheets/focus-and-attention/" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 text-sm underline">Education.com - Focus Exercises</a>
                  <a href="https://www.mathplayground.com/brain_workouts.html" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 text-sm underline">Math Playground - Brain Workouts</a>
                </div>
              </div>
              
              <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-600">
                Train Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
