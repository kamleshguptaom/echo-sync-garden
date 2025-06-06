
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface NumberSequenceProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type SequenceType = 'arithmetic' | 'geometric' | 'fibonacci' | 'squares' | 'mixed';

interface Sequence {
  numbers: number[];
  pattern: string;
  nextNumber: number;
  rule: string;
}

export const NumberSequence: React.FC<NumberSequenceProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [sequenceType, setSequenceType] = useState<SequenceType>('mixed');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSequence, setCurrentSequence] = useState<Sequence | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const generateArithmetic = (): Sequence => {
    const first = Math.floor(Math.random() * 20) + 1;
    const diff = Math.floor(Math.random() * 10) + 1;
    const length = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
    
    const numbers = Array.from({ length }, (_, i) => first + i * diff);
    const nextNumber = first + length * diff;
    
    return {
      numbers,
      pattern: 'Arithmetic',
      nextNumber,
      rule: `Add ${diff} to each term`
    };
  };

  const generateGeometric = (): Sequence => {
    const first = Math.floor(Math.random() * 5) + 2;
    const ratio = Math.floor(Math.random() * 3) + 2;
    const length = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
    
    const numbers = Array.from({ length }, (_, i) => first * Math.pow(ratio, i));
    const nextNumber = first * Math.pow(ratio, length);
    
    return {
      numbers,
      pattern: 'Geometric',
      nextNumber,
      rule: `Multiply by ${ratio}`
    };
  };

  const generateFibonacci = (): Sequence => {
    const start1 = Math.floor(Math.random() * 5) + 1;
    const start2 = Math.floor(Math.random() * 5) + 1;
    const length = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7;
    
    const numbers = [start1, start2];
    for (let i = 2; i < length; i++) {
      numbers.push(numbers[i-1] + numbers[i-2]);
    }
    
    const nextNumber = numbers[length-1] + numbers[length-2];
    
    return {
      numbers,
      pattern: 'Fibonacci-like',
      nextNumber,
      rule: 'Add the two previous terms'
    };
  };

  const generateSquares = (): Sequence => {
    const start = Math.floor(Math.random() * 5) + 1;
    const length = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
    
    const numbers = Array.from({ length }, (_, i) => Math.pow(start + i, 2));
    const nextNumber = Math.pow(start + length, 2);
    
    return {
      numbers,
      pattern: 'Perfect Squares',
      nextNumber,
      rule: `Square of consecutive integers starting from ${start}`
    };
  };

  const generateSequence = () => {
    let sequence: Sequence;
    
    if (sequenceType === 'mixed') {
      const types = ['arithmetic', 'geometric', 'fibonacci', 'squares'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      switch (randomType) {
        case 'geometric': sequence = generateGeometric(); break;
        case 'fibonacci': sequence = generateFibonacci(); break;
        case 'squares': sequence = generateSquares(); break;
        default: sequence = generateArithmetic();
      }
    } else {
      switch (sequenceType) {
        case 'geometric': sequence = generateGeometric(); break;
        case 'fibonacci': sequence = generateFibonacci(); break;
        case 'squares': sequence = generateSquares(); break;
        default: sequence = generateArithmetic();
      }
    }
    
    setCurrentSequence(sequence);
    setUserAnswer('');
    setFeedback('');
    setShowPattern(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    generateSequence();
  };

  const checkAnswer = () => {
    if (!currentSequence) return;
    
    const userValue = parseInt(userAnswer);
    const isCorrect = userValue === currentSequence.nextNumber;
    
    if (isCorrect) {
      setScore(score + 10);
      setFeedback('🎉 Excellent! You found the pattern!');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setFeedback(`❌ Not quite right. The answer is ${currentSequence.nextNumber}`);
    }
    
    setShowPattern(true);
    
    setTimeout(() => {
      setRound(round + 1);
      if (round < 10) {
        generateSequence();
      } else {
        setGameStarted(false);
        setFeedback(`🏆 Game Complete! Final Score: ${score}/100`);
      }
    }, 3000);
  };

  const renderSequenceVisualization = () => {
    if (!currentSequence) return null;
    
    return (
      <div className="bg-blue-50 p-6 rounded-lg animate-fade-in">
        <h4 className="font-bold mb-4">🔍 Pattern Analysis:</h4>
        <div className="flex justify-center gap-2 mb-4">
          {currentSequence.numbers.map((num, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                {num}
              </div>
              {index < currentSequence.numbers.length - 1 && (
                <div className="text-green-600 font-bold mt-1">→</div>
              )}
            </div>
          ))}
          <div className="flex flex-col items-center">
            <div className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
              ?
            </div>
          </div>
        </div>
        {showPattern && (
          <div className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-500">
            <p><strong>Pattern:</strong> {currentSequence.pattern}</p>
            <p><strong>Rule:</strong> {currentSequence.rule}</p>
          </div>
        )}
      </div>
    );
  };

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={goBack} variant="outline" className="bg-white/90">
              ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="bg-white/90">
              ← Previous
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">🔢 Number Patterns</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Understanding Number Patterns</DialogTitle>
                <DialogDescription>Master the art of recognizing mathematical sequences</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🔢 What are Number Patterns?</h3>
                  <p>Number patterns are sequences where numbers follow a specific rule or relationship. Recognizing these patterns helps develop logical thinking and mathematical reasoning.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">📊 Common Pattern Types:</h3>
                  <div className="space-y-2">
                    <p><strong>1. Arithmetic:</strong> Add or subtract the same number each time (e.g., 2, 5, 8, 11...)</p>
                    <p><strong>2. Geometric:</strong> Multiply or divide by the same number (e.g., 3, 6, 12, 24...)</p>
                    <p><strong>3. Fibonacci:</strong> Add the two previous numbers (e.g., 1, 1, 2, 3, 5, 8...)</p>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Pattern Recognition Tips:</h4>
                  <p>• Look for differences between consecutive numbers<br/>
                     • Check if numbers are being multiplied/divided<br/>
                     • Consider special sequences like squares or cubes<br/>
                     • Sometimes patterns involve adding previous terms!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-yellow-400 via-green-500 to-blue-600 text-white text-6xl font-bold p-8 rounded-full animate-bounce">
              🎉 Pattern Master! 🎉
            </div>
          </div>
        )}

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Number Pattern Challenge Settings</CardTitle>
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
                      <SelectItem value="easy">Easy (Short sequences)</SelectItem>
                      <SelectItem value="medium">Medium (Medium sequences)</SelectItem>
                      <SelectItem value="hard">Hard (Long sequences)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pattern Type</label>
                  <Select value={sequenceType} onValueChange={(value) => setSequenceType(value as SequenceType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arithmetic">Arithmetic Sequences</SelectItem>
                      <SelectItem value="geometric">Geometric Sequences</SelectItem>
                      <SelectItem value="fibonacci">Fibonacci-like</SelectItem>
                      <SelectItem value="squares">Perfect Squares</SelectItem>
                      <SelectItem value="mixed">Mixed Patterns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
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
              {currentSequence && (
                <div className="text-center">
                  <p className="text-xl mb-6">What comes next in this sequence?</p>
                  
                  {renderSequenceVisualization()}
                  
                  <div className="max-w-xs mx-auto mb-6">
                    <label className="block text-sm font-medium mb-1">Next Number:</label>
                    <Input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter the next number"
                      className="text-center text-lg"
                      disabled={!!feedback}
                    />
                  </div>
                  
                  <Button
                    onClick={checkAnswer}
                    disabled={!userAnswer || !!feedback}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Submit Answer
                  </Button>
                </div>
              )}

              {feedback && (
                <div className={`text-center p-4 rounded-lg animate-bounce ${
                  feedback.includes('Excellent') ? 'bg-green-100 text-green-800' : 
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
