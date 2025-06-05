
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface FractionGameProps {
  onBack: () => void;
}

type GameMode = 'identify' | 'compare' | 'add' | 'subtract' | 'multiply' | 'divide';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface FractionProblem {
  fraction1: { numerator: number; denominator: number };
  fraction2?: { numerator: number; denominator: number };
  operation?: string;
  answer: { numerator: number; denominator: number };
  options: { numerator: number; denominator: number }[];
}

export const FractionGame: React.FC<FractionGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('identify');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentProblem, setCurrentProblem] = useState<FractionProblem | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (gameStarted) {
      generateProblem();
    }
  }, [gameStarted, gameMode, difficulty]);

  const generateProblem = () => {
    let problem: FractionProblem;
    
    switch (gameMode) {
      case 'identify':
        problem = generateIdentifyProblem();
        break;
      case 'compare':
        problem = generateCompareProblem();
        break;
      case 'add':
        problem = generateArithmeticProblem('+');
        break;
      case 'subtract':
        problem = generateArithmeticProblem('-');
        break;
      case 'multiply':
        problem = generateArithmeticProblem('*');
        break;
      case 'divide':
        problem = generateArithmeticProblem('/');
        break;
      default:
        problem = generateIdentifyProblem();
    }
    
    setCurrentProblem(problem);
    setFeedback(null);
  };

  const generateIdentifyProblem = (): FractionProblem => {
    const denominators = difficulty === 'easy' ? [2, 3, 4] : difficulty === 'medium' ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
    const denominator = denominators[Math.floor(Math.random() * denominators.length)];
    const numerator = Math.floor(Math.random() * denominator) + 1;
    
    const fraction = { numerator, denominator };
    const options = generateOptions(fraction);
    
    return {
      fraction1: fraction,
      answer: fraction,
      options
    };
  };

  const generateCompareProblem = (): FractionProblem => {
    const fraction1 = generateRandomFraction();
    const fraction2 = generateRandomFraction();
    
    const decimal1 = fraction1.numerator / fraction1.denominator;
    const decimal2 = fraction2.numerator / fraction2.denominator;
    
    const answer = decimal1 > decimal2 ? fraction1 : fraction2;
    const options = [fraction1, fraction2];
    
    return {
      fraction1,
      fraction2,
      operation: '>',
      answer,
      options
    };
  };

  const generateArithmeticProblem = (operation: string): FractionProblem => {
    const fraction1 = generateRandomFraction();
    const fraction2 = generateRandomFraction();
    let answer: { numerator: number; denominator: number };
    
    switch (operation) {
      case '+':
        answer = addFractions(fraction1, fraction2);
        break;
      case '-':
        answer = subtractFractions(fraction1, fraction2);
        break;
      case '*':
        answer = multiplyFractions(fraction1, fraction2);
        break;
      case '/':
        answer = divideFractions(fraction1, fraction2);
        break;
      default:
        answer = fraction1;
    }
    
    // Simplify answer
    answer = simplifyFraction(answer);
    
    const options = generateArithmeticOptions(answer);
    
    return {
      fraction1,
      fraction2,
      operation,
      answer,
      options
    };
  };

  const generateRandomFraction = () => {
    const maxValue = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 12;
    const denominator = Math.floor(Math.random() * maxValue) + 2;
    const numerator = Math.floor(Math.random() * denominator) + 1;
    return { numerator, denominator };
  };

  const addFractions = (f1: { numerator: number; denominator: number }, f2: { numerator: number; denominator: number }) => {
    const denominator = f1.denominator * f2.denominator;
    const numerator = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
    return { numerator, denominator };
  };

  const subtractFractions = (f1: { numerator: number; denominator: number }, f2: { numerator: number; denominator: number }) => {
    const denominator = f1.denominator * f2.denominator;
    const numerator = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
    return { numerator: Math.abs(numerator), denominator };
  };

  const multiplyFractions = (f1: { numerator: number; denominator: number }, f2: { numerator: number; denominator: number }) => {
    return {
      numerator: f1.numerator * f2.numerator,
      denominator: f1.denominator * f2.denominator
    };
  };

  const divideFractions = (f1: { numerator: number; denominator: number }, f2: { numerator: number; denominator: number }) => {
    return {
      numerator: f1.numerator * f2.denominator,
      denominator: f1.denominator * f2.numerator
    };
  };

  const simplifyFraction = (fraction: { numerator: number; denominator: number }) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(fraction.numerator, fraction.denominator);
    return {
      numerator: fraction.numerator / divisor,
      denominator: fraction.denominator / divisor
    };
  };

  const generateOptions = (correct: { numerator: number; denominator: number }) => {
    const options = [correct];
    
    while (options.length < 4) {
      const wrong = {
        numerator: Math.floor(Math.random() * 12) + 1,
        denominator: Math.floor(Math.random() * 12) + 2
      };
      
      if (!options.some(opt => opt.numerator === wrong.numerator && opt.denominator === wrong.denominator)) {
        options.push(wrong);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const generateArithmeticOptions = (correct: { numerator: number; denominator: number }) => {
    const options = [correct];
    
    // Generate similar but incorrect options
    for (let i = 0; i < 3; i++) {
      const wrong = {
        numerator: correct.numerator + Math.floor(Math.random() * 4) - 2,
        denominator: correct.denominator + Math.floor(Math.random() * 4) - 2
      };
      
      if (wrong.numerator > 0 && wrong.denominator > 0 && 
          !options.some(opt => opt.numerator === wrong.numerator && opt.denominator === wrong.denominator)) {
        options.push(wrong);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selectedFraction: { numerator: number; denominator: number }) => {
    if (!currentProblem) return;
    
    const isCorrect = selectedFraction.numerator === currentProblem.answer.numerator &&
                      selectedFraction.denominator === currentProblem.answer.denominator;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + 10 * level);
    }
    
    setTimeout(() => {
      setLevel(prev => prev + 1);
      generateProblem();
    }, 2000);
  };

  const renderFraction = (fraction: { numerator: number; denominator: number }, size: 'small' | 'medium' | 'large' = 'medium') => {
    const fontSize = size === 'small' ? 'text-lg' : size === 'medium' ? 'text-2xl' : 'text-4xl';
    
    return (
      <div className={`inline-flex flex-col items-center ${fontSize}`}>
        <div className="font-bold">{fraction.numerator}</div>
        <div className="border-t-2 border-black px-2"></div>
        <div className="font-bold">{fraction.denominator}</div>
      </div>
    );
  };

  const renderVisualFraction = (fraction: { numerator: number; denominator: number }) => {
    const segments = [];
    for (let i = 0; i < fraction.denominator; i++) {
      segments.push(
        <div
          key={i}
          className={`w-8 h-8 border border-gray-400 ${
            i < fraction.numerator ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        />
      );
    }
    
    return (
      <div className="flex flex-wrap gap-1 justify-center max-w-xs">
        {segments}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">½ Fraction Master</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Understanding Fractions</DialogTitle>
                <DialogDescription>Learn the fundamentals of fractions through visual and interactive methods</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">½ What are Fractions?</h3>
                  <p>Fractions represent parts of a whole. The top number (numerator) tells us how many parts we have, and the bottom number (denominator) tells us how many equal parts the whole is divided into.</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Fraction_(mathematics)" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Fractions</a>
                    <a href="https://en.wikipedia.org/wiki/Decimal" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Decimals</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Fraction Learning Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Game Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="identify">Identify Fractions</SelectItem>
                      <SelectItem value="compare">Compare Fractions</SelectItem>
                      <SelectItem value="add">Add Fractions</SelectItem>
                      <SelectItem value="subtract">Subtract Fractions</SelectItem>
                      <SelectItem value="multiply">Multiply Fractions</SelectItem>
                      <SelectItem value="divide">Divide Fractions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={() => setGameStarted(true)} className="bg-green-500 hover:bg-green-600">
                  Start Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 bg-white/95">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Level: {level}</span>
                  <span>Score: {score}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {currentProblem && (
                  <>
                    <div className="mb-6">
                      {gameMode === 'identify' && (
                        <div>
                          <p className="text-lg mb-4">What fraction is shown?</p>
                          {renderVisualFraction(currentProblem.fraction1)}
                        </div>
                      )}
                      
                      {gameMode === 'compare' && (
                        <div>
                          <p className="text-lg mb-4">Which fraction is larger?</p>
                          <div className="flex justify-center items-center gap-8">
                            {renderFraction(currentProblem.fraction1)}
                            <span className="text-2xl">vs</span>
                            {renderFraction(currentProblem.fraction2!)}
                          </div>
                        </div>
                      )}
                      
                      {['add', 'subtract', 'multiply', 'divide'].includes(gameMode) && (
                        <div>
                          <p className="text-lg mb-4">Solve the fraction problem:</p>
                          <div className="flex justify-center items-center gap-4">
                            {renderFraction(currentProblem.fraction1)}
                            <span className="text-3xl">{currentProblem.operation}</span>
                            {renderFraction(currentProblem.fraction2!)}
                            <span className="text-3xl">=</span>
                            <span className="text-3xl">?</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      {currentProblem.options.map((option, index) => (
                        <Button
                          key={index}
                          className="h-20 flex items-center justify-center"
                          onClick={() => handleAnswer(option)}
                          disabled={!!feedback}
                        >
                          {renderFraction(option, 'small')}
                        </Button>
                      ))}
                    </div>
                    
                    {feedback && (
                      <div className={`mt-6 p-4 rounded-lg ${
                        feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <p className="text-xl font-bold">
                          {feedback === 'correct' ? '✅ Correct!' : '❌ Try again!'}
                        </p>
                        <div className="mt-2">
                          <span>Answer: </span>
                          {renderFraction(currentProblem.answer, 'small')}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
