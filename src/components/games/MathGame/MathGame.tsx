
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MathGameProps {
  onBack: () => void;
}

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'algebra' | 'fractions' | 'percentages';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface Question {
  num1: number;
  num2: number;
  num3?: number;
  operation: Operation;
  answer: number;
  displayQuestion: string;
  isAlgebra?: boolean;
  variable?: string;
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
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const getNumberRange = (diff: Difficulty, op: Operation) => {
    const ranges = {
      easy: { min: 1, max: 10 },
      medium: { min: 10, max: 50 },
      hard: { min: 50, max: 100 },
      expert: { min: 100, max: 500 }
    };
    
    if (op === 'fractions') {
      return { min: 1, max: diff === 'easy' ? 10 : diff === 'medium' ? 20 : 50 };
    }
    
    return ranges[diff];
  };

  const generateQuestion = (): Question => {
    const range = getNumberRange(difficulty, operation);
    
    switch (operation) {
      case 'addition':
        return generateBasicOperation(range, '+');
      case 'subtraction':
        return generateBasicOperation(range, '-');
      case 'multiplication':
        return generateBasicOperation(range, '×');
      case 'division':
        return generateDivision(range);
      case 'mixed':
        return generateMixed(range);
      case 'algebra':
        return generateAlgebra(range);
      case 'fractions':
        return generateFractions(range);
      case 'percentages':
        return generatePercentages(range);
      default:
        return generateBasicOperation(range, '+');
    }
  };

  const generateBasicOperation = (range: {min: number, max: number}, op: string): Question => {
    let num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    let num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    
    // For subtraction, ensure positive results
    if (op === '-' && num2 > num1) {
      [num1, num2] = [num2, num1];
    }
    
    let answer: number;
    let operation: Operation;
    
    switch (op) {
      case '+':
        answer = num1 + num2;
        operation = 'addition';
        break;
      case '-':
        answer = num1 - num2;
        operation = 'subtraction';
        break;
      case '×':
        answer = num1 * num2;
        operation = 'multiplication';
        break;
      default:
        answer = num1 + num2;
        operation = 'addition';
    }

    return {
      num1,
      num2,
      operation,
      answer,
      displayQuestion: `${num1} ${op} ${num2} = ?`
    };
  };

  const generateDivision = (range: {min: number, max: number}): Question => {
    let num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    let answer = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    let num1 = num2 * answer;
    
    return {
      num1,
      num2,
      operation: 'division',
      answer,
      displayQuestion: `${num1} ÷ ${num2} = ?`
    };
  };

  const generateMixed = (range: {min: number, max: number}): Question => {
    const operations = ['+', '-', '×'];
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    return generateBasicOperation(range, randomOp);
  };

  const generateAlgebra = (range: {min: number, max: number}): Question => {
    const variable = 'x';
    const coefficient = Math.floor(Math.random() * 10) + 1;
    const constant = Math.floor(Math.random() * 20) + 1;
    const result = Math.floor(Math.random() * 30) + 1;
    const answer = Math.floor((result - constant) / coefficient);
    
    return {
      num1: coefficient,
      num2: constant,
      operation: 'algebra',
      answer,
      displayQuestion: `${coefficient}${variable} + ${constant} = ${result}. Find ${variable}`,
      isAlgebra: true,
      variable
    };
  };

  const generateFractions = (range: {min: number, max: number}): Question => {
    const num1 = Math.floor(Math.random() * range.max) + 1;
    const den1 = Math.floor(Math.random() * range.max) + 1;
    const num2 = Math.floor(Math.random() * range.max) + 1;
    const den2 = Math.floor(Math.random() * range.max) + 1;
    
    // Addition of fractions: a/b + c/d = (ad + bc) / (bd)
    const numerator = (num1 * den2) + (num2 * den1);
    const denominator = den1 * den2;
    
    // Simplify if possible
    const gcd = findGCD(numerator, denominator);
    const answer = numerator / gcd;
    const answerDen = denominator / gcd;
    
    return {
      num1,
      num2,
      operation: 'fractions',
      answer: parseFloat((answer / answerDen).toFixed(2)),
      displayQuestion: `${num1}/${den1} + ${num2}/${den2} = ? (as decimal)`
    };
  };

  const generatePercentages = (range: {min: number, max: number}): Question => {
    const percentage = Math.floor(Math.random() * 50) + 10; // 10-60%
    const total = Math.floor(Math.random() * 200) + 50; // 50-250
    const answer = Math.round((percentage / 100) * total);
    
    return {
      num1: percentage,
      num2: total,
      operation: 'percentages',
      answer,
      displayQuestion: `What is ${percentage}% of ${total}?`
    };
  };

  const findGCD = (a: number, b: number): number => {
    return b === 0 ? a : findGCD(b, a % b);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(operation === 'algebra' ? 45 : 30);
    setFeedback('');
    setHintsUsed(0);
    setCurrentQuestion(generateQuestion());
  };

  const useHint = () => {
    if (!currentQuestion || hintsUsed >= 2) return;
    
    let hint = '';
    switch (currentQuestion.operation) {
      case 'algebra':
        hint = `Try solving: isolate the variable by doing inverse operations`;
        break;
      case 'fractions':
        hint = `Convert fractions to decimals: divide numerator by denominator`;
        break;
      case 'percentages':
        hint = `Percentage formula: (percentage ÷ 100) × total`;
        break;
      case 'division':
        hint = `Think: ${currentQuestion.num2} × ? = ${currentQuestion.num1}`;
        break;
      default:
        hint = `The answer is between ${Math.floor(currentQuestion.answer * 0.8)} and ${Math.ceil(currentQuestion.answer * 1.2)}`;
    }
    
    setFeedback(`💡 Hint: ${hint}`);
    setHintsUsed(hintsUsed + 1);
    
    setTimeout(() => setFeedback(''), 4000);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const userNum = parseFloat(userAnswer);
    const tolerance = currentQuestion.operation === 'fractions' ? 0.01 : 0;
    
    if (Math.abs(userNum - currentQuestion.answer) <= tolerance) {
      const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : difficulty === 'hard' ? 30 : 40;
      const operationMultiplier = currentQuestion.operation === 'algebra' ? 2 : currentQuestion.operation === 'fractions' ? 1.5 : 1;
      const points = Math.floor(basePoints * operationMultiplier * (streak + 1));
      
      setScore(score + points);
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

  const getOperationDisplay = () => {
    const displays = {
      addition: '➕ Addition',
      subtraction: '➖ Subtraction',
      multiplication: '✖️ Multiplication',
      division: '➗ Division',
      mixed: '🔄 Mixed Operations',
      algebra: '📐 Algebra',
      fractions: '📊 Fractions',
      percentages: '📈 Percentages'
    };
    return displays[operation];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Math Challenge</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Math Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>Basic Operations:</strong> Solve addition, subtraction, multiplication, division</p>
                <p><strong>Algebra:</strong> Find the value of the variable</p>
                <p><strong>Fractions:</strong> Add fractions and give decimal answer</p>
                <p><strong>Percentages:</strong> Calculate percentage of numbers</p>
                <p>💡 Use hints if you get stuck (max 2 per game)</p>
                <p>🏆 Higher difficulty and complex operations give more points</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center flex-wrap">
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
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Operation</label>
                <Select value={operation} onValueChange={(value) => setOperation(value as Operation)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addition">➕ Addition</SelectItem>
                    <SelectItem value="subtraction">➖ Subtraction</SelectItem>
                    <SelectItem value="multiplication">✖️ Multiplication</SelectItem>
                    <SelectItem value="division">➗ Division</SelectItem>
                    <SelectItem value="mixed">🔄 Mixed Operations</SelectItem>
                    <SelectItem value="algebra">📐 Algebra</SelectItem>
                    <SelectItem value="fractions">📊 Fractions</SelectItem>
                    <SelectItem value="percentages">📈 Percentages</SelectItem>
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
                <p className="text-lg mb-2">Ready to test your math skills?</p>
                <p className="text-sm text-gray-600 mb-4">
                  Current: {getOperationDisplay()} | {difficulty.toUpperCase()}
                </p>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-xl px-8 py-3">
                  Start Game
                </Button>
              </div>
            ) : gameActive && currentQuestion ? (
              <div className="space-y-6">
                <div className="text-4xl font-bold text-blue-600 animate-pulse">
                  {currentQuestion.displayQuestion}
                </div>
                
                <div className="text-sm text-gray-500">
                  Operation: {getOperationDisplay()} | Difficulty: {difficulty.toUpperCase()}
                </div>
                
                <div className="flex justify-center gap-4 items-center">
                  <Input
                    type="number"
                    step="0.01"
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
                  <Button 
                    onClick={useHint} 
                    disabled={hintsUsed >= 2} 
                    variant="outline"
                    className="bg-yellow-100 hover:bg-yellow-200"
                  >
                    💡 Hint ({hintsUsed}/2)
                  </Button>
                </div>
                
                {feedback && (
                  <div className={`text-xl font-bold ${feedback.includes('Correct') ? 'text-green-600' : feedback.includes('Hint') ? 'text-yellow-600' : 'text-red-600'} animate-bounce`}>
                    {feedback}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-600">Game Over!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Best Streak: {streak}</p>
                <div className="text-sm text-gray-600">
                  Performance: {streak >= 10 ? '🏆 Math Genius!' : streak >= 5 ? '⭐ Great Job!' : '👍 Keep Practicing!'}
                </div>
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
