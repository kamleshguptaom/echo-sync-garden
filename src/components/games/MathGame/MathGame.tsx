
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MathGameProps {
  onBack: () => void;
}

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

export const MathGame: React.FC<MathGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [operation, setOperation] = useState<Operation>('addition');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const getNumberRange = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return { min: 1, max: 10 };
      case 'medium': return { min: 10, max: 50 };
      case 'hard': return { min: 50, max: 100 };
    }
  };

  const generateQuestion = (): Question => {
    const range = getNumberRange(difficulty);
    let num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    let num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    
    // For division, ensure clean division
    if (operation === 'division') {
      const product = num1 * num2;
      num1 = product;
      // num2 stays the same as divisor
    }
    
    // For subtraction, ensure positive results
    if (operation === 'subtraction' && num2 > num1) {
      [num1, num2] = [num2, num1];
    }

    let answer: number;
    switch (operation) {
      case 'addition':
        answer = num1 + num2;
        break;
      case 'subtraction':
        answer = num1 - num2;
        break;
      case 'multiplication':
        answer = num1 * num2;
        break;
      case 'division':
        answer = num1 / num2;
        break;
    }

    return { num1, num2, operation, answer };
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setFeedback('');
    setCurrentQuestion(generateQuestion());
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const userNum = parseFloat(userAnswer);
    if (userNum === currentQuestion.answer) {
      setScore(score + (streak + 1) * 10);
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
    } else {
      setStreak(0);
      setFeedback(`Incorrect. The answer was ${currentQuestion.answer}`);
    }
    
    setUserAnswer('');
    if (gameActive) {
      setTimeout(() => {
        setCurrentQuestion(generateQuestion());
        setFeedback('');
      }, 1500);
    }
  };

  const getOperationSymbol = (op: Operation) => {
    switch (op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Math Challenge</h1>
          <div className="w-20"></div>
        </div>

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
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Operation</label>
                <Select value={operation} onValueChange={(value) => setOperation(value as Operation)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addition">Addition (+)</SelectItem>
                    <SelectItem value="subtraction">Subtraction (-)</SelectItem>
                    <SelectItem value="multiplication">Multiplication (×)</SelectItem>
                    <SelectItem value="division">Division (÷)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center flex justify-between items-center">
              <span>Score: {score}</span>
              <span>Streak: {streak}</span>
              <span>Time: {timeLeft}s</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!gameActive && !currentQuestion ? (
              <div>
                <p className="text-lg mb-4">Ready to test your math skills?</p>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-xl px-8 py-3">
                  Start Game
                </Button>
              </div>
            ) : gameActive && currentQuestion ? (
              <div className="space-y-6">
                <div className="text-6xl font-bold text-blue-600 animate-pulse">
                  {currentQuestion.num1} {getOperationSymbol(currentQuestion.operation)} {currentQuestion.num2} = ?
                </div>
                
                <div className="flex justify-center gap-4">
                  <Input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    placeholder="Your answer"
                    className="w-32 text-xl text-center"
                    autoFocus
                  />
                  <Button onClick={checkAnswer} className="bg-blue-500 hover:bg-blue-600">
                    Submit
                  </Button>
                </div>
                
                {feedback && (
                  <div className={`text-xl font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'} animate-bounce`}>
                    {feedback}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-600">Game Over!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Best Streak: {streak}</p>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  Play Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
