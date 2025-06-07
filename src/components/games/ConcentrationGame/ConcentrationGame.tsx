
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface ConcentrationGameProps {
  onBack: () => void;
}

type GameMode = 'stroop' | 'color-match' | 'attention' | 'focus';
type Difficulty = 'easy' | 'medium' | 'hard';

interface StroopItem {
  word: string;
  color: string;
  correct: boolean;
}

interface ColorBox {
  id: number;
  color: string;
  x: number;
  y: number;
  size: number;
}

export const ConcentrationGame: React.FC<ConcentrationGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('stroop');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentItem, setCurrentItem] = useState<StroopItem | null>(null);
  const [colorBoxes, setColorBoxes] = useState<ColorBox[]>([]);
  const [targetColor, setTargetColor] = useState<string>('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
  const colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Cyan'];

  // Reset game when mode changes
  useEffect(() => {
    if (gameStarted) {
      setGameStarted(false);
      setCurrentItem(null);
      setColorBoxes([]);
      setScore(0);
      setRound(1);
      setFeedback('');
    }
  }, [gameMode, difficulty]);

  const generateStroopItem = (): StroopItem => {
    const wordIndex = Math.floor(Math.random() * colorNames.length);
    const colorIndex = Math.floor(Math.random() * colors.length);
    
    return {
      word: colorNames[wordIndex],
      color: colors[colorIndex],
      correct: wordIndex === colorIndex
    };
  };

  const generateColorBoxes = () => {
    const boxes: ColorBox[] = [];
    const count = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
    const targetColorIndex = Math.floor(Math.random() * colors.length);
    setTargetColor(colors[targetColorIndex]);
    
    // Add target color boxes
    const targetCount = Math.floor(count * 0.3);
    for (let i = 0; i < targetCount; i++) {
      boxes.push({
        id: i,
        color: colors[targetColorIndex],
        x: Math.random() * 300,
        y: Math.random() * 300,
        size: 30 + Math.random() * 20
      });
    }
    
    // Add distractor boxes
    for (let i = targetCount; i < count; i++) {
      let colorIndex;
      do {
        colorIndex = Math.floor(Math.random() * colors.length);
      } while (colorIndex === targetColorIndex);
      
      boxes.push({
        id: i,
        color: colors[colorIndex],
        x: Math.random() * 300,
        y: Math.random() * 300,
        size: 30 + Math.random() * 20
      });
    }
    
    setColorBoxes(boxes.sort(() => Math.random() - 0.5));
  };

  const generateQuestion = () => {
    switch (gameMode) {
      case 'stroop':
        setCurrentItem(generateStroopItem());
        break;
      case 'color-match':
        generateColorBoxes();
        break;
      case 'attention':
        generateColorBoxes();
        break;
      case 'focus':
        setCurrentItem(generateStroopItem());
        break;
    }
    
    setTimeLeft(difficulty === 'easy' ? 8 : difficulty === 'medium' ? 5 : 3);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    setFeedback('');
    generateQuestion();
  };

  const handleStroopAnswer = (answer: 'word' | 'color') => {
    if (!currentItem) return;
    
    let isCorrect = false;
    if (gameMode === 'stroop') {
      // In Stroop test, answer the COLOR, not the word
      isCorrect = (answer === 'color');
    } else {
      // In other modes, different logic
      isCorrect = (answer === 'word') === currentItem.correct;
    }
    
    if (isCorrect) {
      setScore(score + timeLeft * 2);
      setFeedback('✅ Correct! Great concentration!');
    } else {
      setFeedback('❌ Incorrect. Focus on the instruction!');
    }
    
    setTimeout(() => {
      nextRound();
    }, 1500);
  };

  const handleColorBoxClick = (box: ColorBox) => {
    if (gameMode === 'color-match' || gameMode === 'attention') {
      const isCorrect = box.color === targetColor;
      
      if (isCorrect) {
        setScore(score + 10);
        setFeedback('✅ Correct color found!');
        // Remove the clicked box
        setColorBoxes(prev => prev.filter(b => b.id !== box.id));
        
        // Check if all target colors found
        const remainingTargets = colorBoxes.filter(b => b.color === targetColor && b.id !== box.id);
        if (remainingTargets.length === 0) {
          setTimeout(() => {
            nextRound();
          }, 1000);
        }
      } else {
        setFeedback('❌ Wrong color! Try again.');
        setTimeout(() => setFeedback(''), 1000);
      }
    }
  };

  const nextRound = () => {
    if (round < 10) {
      setRound(round + 1);
      setFeedback('');
      generateQuestion();
    } else {
      setGameStarted(false);
      setFeedback(`Game Complete! Final Score: ${score}`);
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !feedback.includes('Complete')) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setFeedback('⏰ Time up!');
            setTimeout(() => {
              nextRound();
            }, 1500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft, feedback, round]);

  const renderGameContent = () => {
    switch (gameMode) {
      case 'stroop':
        return currentItem && (
          <div className="text-center">
            <p className="text-lg mb-6">Say the COLOR of the word, not what it says!</p>
            <div 
              className="text-8xl font-bold mb-8 animate-pulse"
              style={{ color: currentItem.color }}
            >
              {currentItem.word}
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleStroopAnswer('word')}
                disabled={!!feedback}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-4 text-lg"
              >
                Word: {currentItem.word}
              </Button>
              <Button
                onClick={() => handleStroopAnswer('color')}
                disabled={!!feedback}
                className="bg-green-500 hover:bg-green-600 px-8 py-4 text-lg"
                style={{ backgroundColor: currentItem.color }}
              >
                Color: {currentItem.color}
              </Button>
            </div>
          </div>
        );
        
      case 'color-match':
      case 'attention':
        return (
          <div className="text-center">
            <p className="text-lg mb-4">Click all boxes with color: 
              <span 
                className="font-bold ml-2 px-3 py-1 rounded text-white"
                style={{ backgroundColor: targetColor }}
              >
                {targetColor}
              </span>
            </p>
            <div className="relative bg-gray-100 w-96 h-96 mx-auto rounded-lg border-4 border-gray-300">
              {colorBoxes.map((box) => (
                <div
                  key={box.id}
                  className="absolute cursor-pointer transition-transform hover:scale-110 rounded"
                  style={{
                    left: box.x,
                    top: box.y,
                    width: box.size,
                    height: box.size,
                    backgroundColor: box.color,
                  }}
                  onClick={() => handleColorBoxClick(box)}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Remaining: {colorBoxes.filter(box => box.color === targetColor).length}
            </p>
          </div>
        );
        
      default:
        return (
          <div className="text-center">
            <p className="text-lg">Game mode: {gameMode}</p>
            <p className="text-gray-600">Select a game mode and start playing!</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🧠 Concentration Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Concentration & Focus Training</DialogTitle>
                <DialogDescription>Improve selective attention and cognitive control</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🧠 What is the Stroop Effect?</h3>
                  <p>The Stroop effect demonstrates the interference in the reaction time of a task when the name of a color (e.g., "blue") is printed in a color not denoted by the name (e.g., the word "blue" printed in red ink).</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎯 Skills Trained</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Selective Attention:</strong> Focus on relevant stimuli while ignoring distractions</li>
                    <li><strong>Cognitive Control:</strong> Override automatic responses</li>
                    <li><strong>Processing Speed:</strong> Quickly analyze and respond to stimuli</li>
                    <li><strong>Mental Flexibility:</strong> Switch between different mental tasks</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Benefits:</h4>
                  <p>Regular practice can improve focus, reduce distractibility, and enhance performance in tasks requiring sustained attention.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Concentration Challenge Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (8s per question)</SelectItem>
                      <SelectItem value="medium">Medium (5s per question)</SelectItem>
                      <SelectItem value="hard">Hard (3s per question)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Challenge Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stroop">Stroop Test</SelectItem>
                      <SelectItem value="color-match">Color Matching</SelectItem>
                      <SelectItem value="attention">Attention Grid</SelectItem>
                      <SelectItem value="focus">Focus Challenge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>Round {round}/10</span>
                <span>Score: {score}</span>
                <span className={`${timeLeft <= 2 ? 'text-red-500 animate-pulse' : ''}`}>
                  Time: {timeLeft}s
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderGameContent()}

              {feedback && (
                <div className={`text-center p-4 rounded-lg ${
                  feedback.includes('Correct') ? 'bg-green-100 text-green-800 animate-bounce' : 
                  feedback.includes('Incorrect') || feedback.includes('Wrong') ? 'bg-red-100 text-red-800 animate-shake' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {feedback}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
