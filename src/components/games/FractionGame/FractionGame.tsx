
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface FractionGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'add' | 'subtract' | 'multiply' | 'divide' | 'compare' | 'mixed';

interface Fraction {
  numerator: number;
  denominator: number;
}

interface Question {
  fraction1: Fraction;
  fraction2: Fraction;
  operation: string;
  answer: Fraction;
  options: Fraction[];
}

export const FractionGame: React.FC<FractionGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('mixed');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Fraction | null>(null);
  const [showVisualExample, setShowVisualExample] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  
  const simplifyFraction = (fraction: Fraction): Fraction => {
    const divisor = gcd(Math.abs(fraction.numerator), Math.abs(fraction.denominator));
    return {
      numerator: fraction.numerator / divisor,
      denominator: fraction.denominator / divisor
    };
  };

  const generateFraction = (): Fraction => {
    const settings = {
      easy: { maxNum: 10, maxDen: 10 },
      medium: { maxNum: 20, maxDen: 15 },
      hard: { maxNum: 50, maxDen: 25 }
    };
    
    const { maxNum, maxDen } = settings[difficulty];
    return {
      numerator: Math.floor(Math.random() * maxNum) + 1,
      denominator: Math.floor(Math.random() * maxDen) + 1
    };
  };

  const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
      numerator: f1.numerator * f2.denominator + f2.numerator * f1.denominator,
      denominator: f1.denominator * f2.denominator
    });
  };

  const subtractFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
      numerator: f1.numerator * f2.denominator - f2.numerator * f1.denominator,
      denominator: f1.denominator * f2.denominator
    });
  };

  const multiplyFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
      numerator: f1.numerator * f2.numerator,
      denominator: f1.denominator * f2.denominator
    });
  };

  const divideFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
      numerator: f1.numerator * f2.denominator,
      denominator: f1.denominator * f2.numerator
    });
  };

  const generateQuestion = () => {
    const operations = gameMode === 'mixed' ? ['add', 'subtract', 'multiply', 'divide', 'compare'] : [gameMode];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    const fraction1 = generateFraction();
    const fraction2 = generateFraction();
    
    let answer: Fraction;
    let operationSymbol: string;
    
    switch (operation) {
      case 'add':
        answer = addFractions(fraction1, fraction2);
        operationSymbol = '+';
        break;
      case 'subtract':
        answer = subtractFractions(fraction1, fraction2);
        operationSymbol = '-';
        break;
      case 'multiply':
        answer = multiplyFractions(fraction1, fraction2);
        operationSymbol = '×';
        break;
      case 'divide':
        answer = divideFractions(fraction1, fraction2);
        operationSymbol = '÷';
        break;
      default:
        answer = fraction1;
        operationSymbol = '>';
    }
    
    const wrongOptions: Fraction[] = [];
    for (let i = 0; i < 3; i++) {
      wrongOptions.push(generateFraction());
    }
    
    const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      fraction1,
      fraction2,
      operation: operationSymbol,
      answer,
      options
    });
    
    setSelectedAnswer(null);
    setFeedback('');
    setShowVisualExample(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    generateQuestion();
  };

  const checkAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    const isCorrect = selectedAnswer.numerator === currentQuestion.answer.numerator &&
                      selectedAnswer.denominator === currentQuestion.answer.denominator;
    
    if (isCorrect) {
      setScore(score + 10);
      setFeedback('🎉 Excellent! That\'s correct!');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setFeedback(`❌ Not quite right. The correct answer is ${currentQuestion.answer.numerator}/${currentQuestion.answer.denominator}`);
    }
    
    setShowVisualExample(true);
    
    setTimeout(() => {
      setRound(round + 1);
      if (round < 10) {
        generateQuestion();
      } else {
        setGameStarted(false);
        setFeedback(`🏆 Game Complete! Final Score: ${score}/100`);
      }
    }, 3000);
  };

  const renderFraction = (fraction: Fraction, size: 'small' | 'large' = 'small') => {
    const textSize = size === 'large' ? 'text-2xl' : 'text-lg';
    return (
      <div className={`${textSize} font-bold text-center`}>
        <div className="border-b-2 border-black px-2">{fraction.numerator}</div>
        <div className="px-2">{fraction.denominator}</div>
      </div>
    );
  };

  const renderVisualFraction = (fraction: Fraction) => {
    const parts = Array.from({ length: fraction.denominator }, (_, i) => (
      <div
        key={i}
        className={`w-8 h-8 border border-gray-400 ${
          i < fraction.numerator ? 'bg-blue-500' : 'bg-white'
        }`}
      />
    ));
    
    return (
      <div className="flex flex-wrap gap-1 justify-center max-w-xs">
        {parts}
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
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
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
          <h1 className="text-4xl font-bold text-white">🧮 Fraction Master</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Understanding Fractions</DialogTitle>
                <DialogDescription>Master fractions with visual learning</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🧮 What are Fractions?</h3>
                  <p>Fractions represent parts of a whole. The top number (numerator) shows how many parts you have, and the bottom number (denominator) shows how many equal parts the whole is divided into.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">📊 Solution Approaches:</h3>
                  <div className="space-y-2">
                    <p><strong>1. Visual Method:</strong> Draw circles or rectangles, divide them into equal parts, and shade the fraction</p>
                    <p><strong>2. Cross Multiplication:</strong> For adding/subtracting, find common denominators first</p>
                    <p><strong>3. Simplification:</strong> Always reduce fractions to their simplest form using GCD</p>
                  </div>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Pro Tips:</h4>
                  <p>• When multiplying fractions: multiply numerators together and denominators together<br/>
                     • When dividing fractions: multiply by the reciprocal (flip the second fraction)</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white text-6xl font-bold p-8 rounded-full animate-bounce">
              🎉 Correct! 🎉
            </div>
          </div>
        )}

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Fraction Master Settings</CardTitle>
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
                      <SelectItem value="easy">Easy (Small numbers)</SelectItem>
                      <SelectItem value="medium">Medium (Medium numbers)</SelectItem>
                      <SelectItem value="hard">Hard (Large numbers)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Game Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Addition</SelectItem>
                      <SelectItem value="subtract">Subtraction</SelectItem>
                      <SelectItem value="multiply">Multiplication</SelectItem>
                      <SelectItem value="divide">Division</SelectItem>
                      <SelectItem value="compare">Comparison</SelectItem>
                      <SelectItem value="mixed">Mixed Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600">
                  Start Fraction Challenge
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
              {currentQuestion && (
                <div className="text-center">
                  <p className="text-xl mb-6">Solve this fraction problem:</p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {renderFraction(currentQuestion.fraction1, 'large')}
                    <span className="text-3xl font-bold">{currentQuestion.operation}</span>
                    {currentQuestion.operation !== '>' && renderFraction(currentQuestion.fraction2, 'large')}
                    <span className="text-3xl font-bold">=</span>
                    <span className="text-3xl">?</span>
                  </div>
                  
                  {showVisualExample && (
                    <div className="bg-blue-50 p-6 rounded-lg mb-6 animate-fade-in">
                      <h4 className="font-bold mb-4">Visual Representation:</h4>
                      <div className="flex justify-center gap-8">
                        <div>
                          <p className="mb-2">First fraction:</p>
                          {renderVisualFraction(currentQuestion.fraction1)}
                        </div>
                        {currentQuestion.operation !== '>' && (
                          <div>
                            <p className="mb-2">Second fraction:</p>
                            {renderVisualFraction(currentQuestion.fraction2)}
                          </div>
                        )}
                        <div>
                          <p className="mb-2">Result:</p>
                          {renderVisualFraction(currentQuestion.answer)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-20 ${selectedAnswer === option ? 'bg-blue-200' : ''}`}
                        onClick={() => setSelectedAnswer(option)}
                        disabled={!!feedback}
                      >
                        {renderFraction(option)}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={checkAnswer}
                    disabled={!selectedAnswer || !!feedback}
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
