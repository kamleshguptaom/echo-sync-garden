
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface PatternGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type PatternType = 'sequence' | 'visual' | 'logical' | 'mixed';

interface Pattern {
  sequence: (string | number)[];
  answer: string | number;
  type: string;
  explanation: string;
}

export const PatternGame: React.FC<PatternGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [patternType, setPatternType] = useState<PatternType>('sequence');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Reset game when settings change
  useEffect(() => {
    if (gameStarted) {
      setGameStarted(false);
      setScore(0);
      setRound(1);
      setFeedback('');
      setCurrentPattern(null);
    }
  }, [patternType, difficulty]);

  const generateSequencePattern = (): Pattern => {
    const patterns = [
      // Arithmetic sequences
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const diff = Math.floor(Math.random() * 5) + 1;
        const sequence = [start, start + diff, start + 2*diff, start + 3*diff];
        return {
          sequence: [...sequence, '?'],
          answer: start + 4*diff,
          type: 'Arithmetic Sequence',
          explanation: `Each number increases by ${diff}`
        };
      },
      // Geometric sequences
      () => {
        const start = Math.floor(Math.random() * 5) + 2;
        const ratio = Math.floor(Math.random() * 3) + 2;
        const sequence = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio];
        return {
          sequence: [...sequence, '?'],
          answer: start * Math.pow(ratio, 4),
          type: 'Geometric Sequence',
          explanation: `Each number is multiplied by ${ratio}`
        };
      },
      // Fibonacci-like
      () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const sequence = [a, b, a + b, a + 2*b, 2*a + 3*b];
        return {
          sequence: [...sequence, '?'],
          answer: 3*a + 5*b,
          type: 'Fibonacci-like',
          explanation: 'Each number is the sum of the two previous numbers'
        };
      }
    ];

    return patterns[Math.floor(Math.random() * patterns.length)]();
  };

  const generateVisualPattern = (): Pattern => {
    const shapes = ['●', '■', '▲', '♦', '★'];
    const colors = ['🔴', '🔵', '🟢', '🟡', '🟣'];
    
    const pattern = shapes[Math.floor(Math.random() * shapes.length)];
    const sequence = Array(4).fill(pattern);
    
    return {
      sequence: [...sequence, '?'],
      answer: pattern,
      type: 'Visual Pattern',
      explanation: 'The same shape repeats'
    };
  };

  const generateLogicalPattern = (): Pattern => {
    const patterns = [
      // Alternating pattern
      () => {
        const items = ['A', 'B'];
        const sequence = [items[0], items[1], items[0], items[1]];
        return {
          sequence: [...sequence, '?'],
          answer: items[0],
          type: 'Alternating Pattern',
          explanation: 'Items alternate between A and B'
        };
      },
      // Increasing pattern
      () => {
        const base = Math.floor(Math.random() * 5) + 1;
        const sequence = [base, base + 1, base + 2, base + 3];
        return {
          sequence: [...sequence, '?'],
          answer: base + 4,
          type: 'Increasing Pattern',
          explanation: 'Each number increases by 1'
        };
      }
    ];

    return patterns[Math.floor(Math.random() * patterns.length)]();
  };

  const generatePattern = (): Pattern => {
    let currentType = patternType;
    
    if (patternType === 'mixed') {
      const types: PatternType[] = ['sequence', 'visual', 'logical'];
      currentType = types[Math.floor(Math.random() * types.length)];
    }

    switch (currentType) {
      case 'sequence':
        return generateSequencePattern();
      case 'visual':
        return generateVisualPattern();
      case 'logical':
        return generateLogicalPattern();
      default:
        return generateSequencePattern();
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    setFeedback('');
    setShowSolution(false);
    generateNewPattern();
  };

  const generateNewPattern = () => {
    const newPattern = generatePattern();
    setCurrentPattern(newPattern);
    setUserAnswer('');
    setFeedback('');
    setShowSolution(false);
  };

  const checkAnswer = () => {
    if (!currentPattern) return;

    const userValue = isNaN(Number(userAnswer)) ? userAnswer : Number(userAnswer);
    const correctAnswer = currentPattern.answer;
    
    const isCorrect = userValue == correctAnswer;

    if (isCorrect) {
      setScore(score + 10);
      setFeedback('🎉 Correct! Well done!');
    } else {
      setFeedback(`❌ Incorrect. The answer was ${correctAnswer}`);
    }

    setShowSolution(true);

    setTimeout(() => {
      if (round < 10) {
        setRound(round + 1);
        generateNewPattern();
      } else {
        setGameStarted(false);
        setFeedback(`🏆 Game Complete! Final Score: ${score}/100`);
      }
    }, 3000);
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
          <h1 className="text-4xl font-bold text-white">🔍 Pattern Recognition</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pattern Recognition Training</DialogTitle>
                <DialogDescription>Enhance your analytical and logical thinking</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">🎯 What are Patterns?</h3>
                  <p>Patterns are recurring sequences or arrangements that follow a specific rule or logic.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">🧠 Types of Patterns</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Sequence:</strong> Number patterns with mathematical rules</li>
                    <li><strong>Visual:</strong> Shape and color patterns</li>
                    <li><strong>Logical:</strong> Rule-based patterns</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-bold">💡 Strategy Tips:</h4>
                  <p>Look for differences, ratios, or repeating elements. Try to identify the underlying rule!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Pattern Recognition Settings</CardTitle>
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
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pattern Type</label>
                  <Select value={patternType} onValueChange={(value) => setPatternType(value as PatternType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequence">Number Sequences</SelectItem>
                      <SelectItem value="visual">Visual Patterns</SelectItem>
                      <SelectItem value="logical">Logical Patterns</SelectItem>
                      <SelectItem value="mixed">Mixed Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
                  Start Pattern Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                Round {round}/10 - Score: {score}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentPattern && (
                <div className="text-center">
                  <p className="text-lg mb-4">Complete the pattern:</p>
                  <div className="bg-gray-100 p-6 rounded-lg mb-6">
                    <div className="flex justify-center items-center gap-4 text-3xl font-bold">
                      {currentPattern.sequence.map((item, index) => (
                        <span 
                          key={index}
                          className={`${index === currentPattern.sequence.length - 1 ? 'text-red-500 animate-pulse' : ''}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="max-w-xs mx-auto mb-6">
                    <label className="block text-sm font-medium mb-1">Your Answer:</label>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-center text-lg"
                      placeholder="Enter the next item"
                      disabled={!!feedback}
                    />
                  </div>
                  
                  <Button
                    onClick={checkAnswer}
                    disabled={!userAnswer || !!feedback}
                    className="bg-green-500 hover:bg-green-600 mb-4"
                  >
                    Submit Answer
                  </Button>

                  {showSolution && (
                    <div className="bg-yellow-50 p-6 rounded-lg animate-fade-in">
                      <h4 className="font-bold mb-2">📝 Solution:</h4>
                      <p className="text-lg mb-2">Answer: <strong>{currentPattern.answer}</strong></p>
                      <p className="text-sm text-gray-600">Type: {currentPattern.type}</p>
                      <p className="text-sm">{currentPattern.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {feedback && (
                <div className={`text-center p-4 rounded-lg animate-bounce ${
                  feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
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
