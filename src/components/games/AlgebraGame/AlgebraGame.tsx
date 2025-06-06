
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface AlgebraGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type EquationType = 'linear' | 'quadratic' | 'system' | 'mixed';

interface Equation {
  expression: string;
  variable: string;
  answer: number;
  steps: string[];
}

export const AlgebraGame: React.FC<AlgebraGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [equationType, setEquationType] = useState<EquationType>('linear');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const generateLinearEquation = (): Equation => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20) - 10;
    const c = Math.floor(Math.random() * 20) - 10;
    
    const answer = (c - b) / a;
    
    const steps = [
      `${a}x + ${b} = ${c}`,
      `${a}x = ${c} - ${b}`,
      `${a}x = ${c - b}`,
      `x = ${c - b}/${a}`,
      `x = ${answer}`
    ];
    
    return {
      expression: `${a}x + ${b} = ${c}`,
      variable: 'x',
      answer: Math.round(answer * 100) / 100,
      steps
    };
  };

  const generateQuadraticEquation = (): Equation => {
    const a = Math.floor(Math.random() * 3) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 5);
    
    const discriminant = b * b - 4 * a * c;
    const answer1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const answer2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    
    const answer = Math.round(answer1 * 100) / 100;
    
    const steps = [
      `${a}x² + ${b}x + ${c} = 0`,
      `Using quadratic formula: x = (-b ± √(b² - 4ac)) / 2a`,
      `x = (-${b} ± √(${b}² - 4(${a})(${c}))) / 2(${a})`,
      `x = (-${b} ± √${discriminant}) / ${2 * a}`,
      `x = ${answer} or x = ${Math.round(answer2 * 100) / 100}`
    ];
    
    return {
      expression: `${a}x² + ${b}x + ${c} = 0`,
      variable: 'x',
      answer,
      steps
    };
  };

  const generateEquation = () => {
    let equation: Equation;
    
    if (equationType === 'mixed') {
      const types = ['linear', 'quadratic'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      equation = randomType === 'linear' ? generateLinearEquation() : generateQuadraticEquation();
    } else if (equationType === 'quadratic') {
      equation = generateQuadraticEquation();
    } else {
      equation = generateLinearEquation();
    }
    
    setCurrentEquation(equation);
    setUserAnswer('');
    setFeedback('');
    setShowSteps(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    generateEquation();
  };

  const checkAnswer = () => {
    if (!currentEquation) return;
    
    const userValue = parseFloat(userAnswer);
    const isCorrect = Math.abs(userValue - currentEquation.answer) < 0.01;
    
    if (isCorrect) {
      setScore(score + 10);
      setFeedback('🎉 Perfect! You solved it correctly!');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setFeedback(`❌ Not quite right. The correct answer is ${currentEquation.answer}`);
    }
    
    setShowSteps(true);
    
    setTimeout(() => {
      setRound(round + 1);
      if (round < 10) {
        generateEquation();
      } else {
        setGameStarted(false);
        setFeedback(`🏆 Game Complete! Final Score: ${score}/100`);
      }
    }, 4000);
  };

  const renderAlgebraVisualization = () => {
    if (!currentEquation) return null;
    
    return (
      <div className="bg-blue-50 p-6 rounded-lg animate-fade-in">
        <h4 className="font-bold mb-4">🧮 Equation Balance Visualization:</h4>
        <div className="flex justify-center items-center gap-4">
          <div className="bg-yellow-200 p-4 rounded-lg border-2 border-yellow-400">
            <p className="text-center font-bold">Left Side</p>
            <p className="text-xl text-center">{currentEquation.expression.split('=')[0]}</p>
          </div>
          <div className="text-3xl font-bold">=</div>
          <div className="bg-green-200 p-4 rounded-lg border-2 border-green-400">
            <p className="text-center font-bold">Right Side</p>
            <p className="text-xl text-center">{currentEquation.expression.split('=')[1]}</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            💡 Keep both sides balanced while isolating the variable!
          </p>
        </div>
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
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
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
          <h1 className="text-4xl font-bold text-white">📊 Algebra Quest</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Mastering Algebra</DialogTitle>
                <DialogDescription>Learn systematic approaches to solve equations</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 What is Algebra?</h3>
                  <p>Algebra is about finding unknown values (variables) using mathematical operations and keeping equations balanced.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">📊 Solution Approaches:</h3>
                  <div className="space-y-2">
                    <p><strong>1. Balance Method:</strong> Whatever you do to one side, do to the other side</p>
                    <p><strong>2. Isolation Strategy:</strong> Move terms to isolate the variable step by step</p>
                    <p><strong>3. PEMDAS Order:</strong> Undo operations in reverse order (addition/subtraction first, then multiplication/division)</p>
                  </div>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Pro Strategies:</h4>
                  <p>• For linear equations: Work backwards from the variable<br/>
                     • For quadratics: Use factoring or quadratic formula<br/>
                     • Always check your answer by substituting back!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white text-6xl font-bold p-8 rounded-full animate-bounce">
              🎉 Solved! 🎉
            </div>
          </div>
        )}

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Algebra Quest Settings</CardTitle>
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
                      <SelectItem value="easy">Easy (Simple numbers)</SelectItem>
                      <SelectItem value="medium">Medium (Mixed operations)</SelectItem>
                      <SelectItem value="hard">Hard (Complex equations)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Equation Type</label>
                  <Select value={equationType} onValueChange={(value) => setEquationType(value as EquationType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear Equations</SelectItem>
                      <SelectItem value="quadratic">Quadratic Equations</SelectItem>
                      <SelectItem value="mixed">Mixed Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600">
                  Start Algebra Quest
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
              {currentEquation && (
                <div className="text-center">
                  <p className="text-xl mb-6">Solve for {currentEquation.variable}:</p>
                  <div className="bg-gray-100 p-6 rounded-lg mb-6">
                    <p className="text-3xl font-bold">{currentEquation.expression}</p>
                  </div>
                  
                  {renderAlgebraVisualization()}
                  
                  <div className="max-w-xs mx-auto mb-6">
                    <label className="block text-sm font-medium mb-1">Your Answer:</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter the value"
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
                  
                  {showSteps && (
                    <div className="bg-yellow-50 p-6 rounded-lg mt-6 animate-fade-in">
                      <h4 className="font-bold mb-4">📝 Solution Steps:</h4>
                      <div className="space-y-2">
                        {currentEquation.steps.map((step, index) => (
                          <div key={index} className="text-left bg-white p-2 rounded border">
                            <span className="font-bold text-blue-600">Step {index + 1}:</span> {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {feedback && (
                <div className={`text-center p-4 rounded-lg animate-bounce ${
                  feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 
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
