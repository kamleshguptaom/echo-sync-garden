import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface VisualPerceptionProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'pattern-match' | 'shape-rotate' | 'hidden-object' | 'visual-scan';

interface Pattern {
  id: number;
  shape: string;
  color: string;
  rotation: number;
  size: number;
}

export const VisualPerception: React.FC<VisualPerceptionProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('pattern-match');
  const [gameStarted, setGameStarted] = useState(false);
  const [targetPattern, setTargetPattern] = useState<Pattern | null>(null);
  const [options, setOptions] = useState<Pattern[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  const shapes = ['●', '■', '▲', '♦', '★', '◆', '▼', '♠', '♥', '♣'];
  const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ff8844', '#8844ff'];

  const generatePattern = (): Pattern => {
    return {
      id: Math.random(),
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.floor(Math.random() * 4) * 90,
      size: 20 + Math.floor(Math.random() * 20)
    };
  };

  const generateQuestion = () => {
    if (gameMode === 'pattern-match') {
      const target = generatePattern();
      setTargetPattern(target);
      
      const correctOption = { ...target };
      const wrongOptions: Pattern[] = [];
      
      for (let i = 0; i < 3; i++) {
        let wrongOption = generatePattern();
        while (wrongOption.shape === target.shape && 
               wrongOption.color === target.color && 
               wrongOption.rotation === target.rotation) {
          wrongOption = generatePattern();
        }
        wrongOptions.push(wrongOption);
      }
      
      const allOptions = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } else if (gameMode === 'shape-rotate') {
      const target = generatePattern();
      setTargetPattern(target);
      
      const correctOption = { ...target };
      const wrongOptions: Pattern[] = [];
      
      for (let i = 0; i < 3; i++) {
        const wrongOption = { ...target, rotation: (target.rotation + 90 * (i + 1)) % 360 };
        wrongOptions.push(wrongOption);
      }
      
      const allOptions = [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    }
    
    setTimeLeft(difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 8);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    setFeedback('');
    generateQuestion();
  };

  const handleAnswer = (selectedPattern: Pattern) => {
    if (!targetPattern) return;
    
    let isCorrect = false;
    
    if (gameMode === 'pattern-match') {
      isCorrect = selectedPattern.shape === targetPattern.shape &&
                  selectedPattern.color === targetPattern.color &&
                  selectedPattern.rotation === targetPattern.rotation;
    } else if (gameMode === 'shape-rotate') {
      isCorrect = selectedPattern.shape === targetPattern.shape &&
                  selectedPattern.color === targetPattern.color &&
                  selectedPattern.rotation === targetPattern.rotation;
    }
    
    if (isCorrect) {
      setScore(score + (timeLeft * 2));
      setFeedback('✅ Correct! Great visual perception!');
    } else {
      setFeedback('❌ Incorrect. Look more carefully at the details.');
    }
    
    setTimeout(() => {
      setRound(round + 1);
      if (round < 15) {
        generateQuestion();
        setFeedback('');
      } else {
        setGameStarted(false);
        setFeedback(`Game Complete! Final Score: ${score}`);
      }
    }, 2000);
  };

  // Reset game when mode changes
  useEffect(() => {
    if (gameStarted) {
      setGameStarted(false);
      setScore(0);
      setRound(1);
      setFeedback('');
    }
  }, [gameMode, difficulty]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !feedback) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setFeedback('⏰ Time up! Try to be faster next time.');
            setTimeout(() => {
              setRound(round + 1);
              if (round < 15) {
                generateQuestion();
                setFeedback('');
              } else {
                setGameStarted(false);
                setFeedback(`Game Complete! Final Score: ${score}`);
              }
            }, 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timeLeft, feedback, round, score]);

  const renderPattern = (pattern: Pattern, size: 'small' | 'large' = 'small') => {
    const fontSize = size === 'small' ? 'text-4xl' : 'text-6xl';
    return (
      <div 
        className={`inline-block ${fontSize} transition-transform hover:scale-110`}
        style={{ 
          color: pattern.color,
          transform: `rotate(${pattern.rotation}deg)`,
          fontSize: size === 'large' ? pattern.size * 2 : pattern.size
        }}
      >
        {pattern.shape}
      </div>
    );
  };

  const renderGameContent = () => {
    if (gameMode === 'pattern-match') {
      return (
        <div className="text-center">
          <p className="text-lg mb-4">Find the pattern that matches this one exactly:</p>
          <div className="bg-gray-100 p-8 rounded-lg mb-6 inline-block">
            {targetPattern && renderPattern(targetPattern, 'large')}
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Look carefully at shape, color, and rotation!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {options.map((option, index) => (
              <Button
                key={index}
                className="h-24 w-24 mx-auto bg-gray-50 hover:bg-blue-100 border-2 border-gray-300 hover:border-blue-400 transition-all"
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
              >
                {renderPattern(option)}
              </Button>
            ))}
          </div>
        </div>
      );
    } else if (gameMode === 'shape-rotate') {
      return (
        <div className="text-center">
          <p className="text-lg mb-4">Find the same shape with the same rotation:</p>
          <div className="bg-gray-100 p-8 rounded-lg mb-6 inline-block">
            {targetPattern && renderPattern(targetPattern, 'large')}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {options.map((option, index) => (
              <Button
                key={index}
                className="h-24 w-24 mx-auto bg-gray-50 hover:bg-blue-100 border-2 border-gray-300 hover:border-blue-400 transition-all"
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
              >
                {renderPattern(option)}
              </Button>
            ))}
          </div>
        </div>
      );
    }
    
    return <div>Game mode not implemented yet</div>;
  };

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={goBack} variant="outline" className="bg-white/90">
            ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
          </Button>
          <h1 className="text-4xl font-bold text-white">👁️ Visual Perception Training</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Visual Perception Training</DialogTitle>
                <DialogDescription>Enhance your visual processing and pattern recognition skills</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">👁️ What is Visual Perception?</h3>
                  <p>Visual perception is your brain's ability to interpret and make sense of what you see. It involves recognizing shapes, colors, patterns, spatial relationships, and details in visual information.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎯 Skills Trained</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Pattern Recognition:</strong> Identifying similar patterns</li>
                    <li><strong>Visual Discrimination:</strong> Spotting differences and similarities</li>
                    <li><strong>Spatial Awareness:</strong> Understanding position and rotation</li>
                    <li><strong>Processing Speed:</strong> Quick visual analysis</li>
                  </ul>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Benefits:</h4>
                  <p>Improves reading comprehension, mathematical skills, attention to detail, and overall cognitive processing speed.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Visual Perception Training Settings</CardTitle>
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
                      <SelectItem value="easy">Easy (15s per question)</SelectItem>
                      <SelectItem value="medium">Medium (10s per question)</SelectItem>
                      <SelectItem value="hard">Hard (8s per question)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Training Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pattern-match">Pattern Matching</SelectItem>
                      <SelectItem value="shape-rotate">Shape Rotation</SelectItem>
                      <SelectItem value="hidden-object">Hidden Objects (Coming Soon)</SelectItem>
                      <SelectItem value="visual-scan">Visual Scanning (Coming Soon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600">
                  Start Training
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>Round {round}/15</span>
                <span>Score: {score}</span>
                <span className={`${timeLeft <= 3 ? 'text-red-500 animate-pulse' : ''}`}>
                  Time: {timeLeft}s
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {targetPattern && renderGameContent()}

              {feedback && (
                <div className={`text-center p-4 rounded-lg animate-bounce ${
                  feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 
                  feedback.includes('Incorrect') ? 'bg-red-100 text-red-800' : 
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
