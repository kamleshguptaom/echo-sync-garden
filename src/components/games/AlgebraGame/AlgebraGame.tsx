
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface AlgebraGameProps {
  onBack: () => void;
}

type ProblemType = 'linear_equations' | 'quadratic_equations' | 'systems' | 'inequalities' | 'polynomials';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface AlgebraProblem {
  equation: string;
  answer: number | string;
  steps: string[];
  explanation: string;
}

export const AlgebraGame: React.FC<AlgebraGameProps> = ({ onBack }) => {
  const [problemType, setProblemType] = useState<ProblemType>('linear_equations');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentProblem, setCurrentProblem] = useState<AlgebraProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (gameStarted) {
      generateProblem();
    }
  }, [gameStarted, problemType, difficulty]);

  const generateProblem = () => {
    let problem: AlgebraProblem;
    
    switch (problemType) {
      case 'linear_equations':
        problem = generateLinearEquation();
        break;
      case 'quadratic_equations':
        problem = generateQuadraticEquation();
        break;
      case 'systems':
        problem = generateSystemEquation();
        break;
      case 'inequalities':
        problem = generateInequality();
        break;
      case 'polynomials':
        problem = generatePolynomial();
        break;
      default:
        problem = generateLinearEquation();
    }
    
    setCurrentProblem(problem);
    setFeedback(null);
    setShowSteps(false);
    setUserAnswer('');
  };

  const generateLinearEquation = (): AlgebraProblem => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20) - 10;
    const x = Math.floor(Math.random() * 20) - 10;
    const result = a * x + b;
    
    const equation = `${a}x ${b >= 0 ? '+' : ''} ${b} = ${result}`;
    const steps = [
      `${a}x ${b >= 0 ? '+' : ''} ${b} = ${result}`,
      `${a}x = ${result} - ${b} = ${result - b}`,
      `x = ${result - b} / ${a} = ${x}`
    ];
    
    return {
      equation,
      answer: x,
      steps,
      explanation: `Solve for x by isolating the variable on one side of the equation.`
    };
  };

  const generateQuadraticEquation = (): AlgebraProblem => {
    const roots = [Math.floor(Math.random() * 10) - 5, Math.floor(Math.random() * 10) - 5];
    const a = 1;
    const b = -(roots[0] + roots[1]);
    const c = roots[0] * roots[1];
    
    const equation = `x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0`;
    const answer = `x = ${roots[0]}, x = ${roots[1]}`;
    
    const steps = [
      equation,
      `Using factoring: (x - ${roots[0]})(x - ${roots[1]}) = 0`,
      `x = ${roots[0]} or x = ${roots[1]}`
    ];
    
    return {
      equation,
      answer,
      steps,
      explanation: `Factor the quadratic equation to find the roots.`
    };
  };

  const generateSystemEquation = (): AlgebraProblem => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    
    const a1 = Math.floor(Math.random() * 5) + 1;
    const b1 = Math.floor(Math.random() * 5) + 1;
    const c1 = a1 * x + b1 * y;
    
    const a2 = Math.floor(Math.random() * 5) + 1;
    const b2 = Math.floor(Math.random() * 5) + 1;
    const c2 = a2 * x + b2 * y;
    
    const equation = `${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`;
    const answer = `x = ${x}, y = ${y}`;
    
    const steps = [
      `${a1}x + ${b1}y = ${c1}`,
      `${a2}x + ${b2}y = ${c2}`,
      `Solving by substitution or elimination`,
      `x = ${x}, y = ${y}`
    ];
    
    return {
      equation,
      answer,
      steps,
      explanation: `Solve the system of equations using substitution or elimination.`
    };
  };

  const generateInequality = (): AlgebraProblem => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20) - 10;
    const boundary = Math.floor(Math.random() * 20) - 10;
    
    const equation = `${a}x ${b >= 0 ? '+' : ''} ${b} > ${boundary}`;
    const solution = (boundary - b) / a;
    const answer = `x > ${solution.toFixed(2)}`;
    
    const steps = [
      equation,
      `${a}x > ${boundary} - ${b} = ${boundary - b}`,
      `x > ${boundary - b} / ${a} = ${solution.toFixed(2)}`
    ];
    
    return {
      equation,
      answer,
      steps,
      explanation: `Solve the inequality by isolating x.`
    };
  };

  const generatePolynomial = (): AlgebraProblem => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 10) - 5;
    const c = Math.floor(Math.random() * 10) - 5;
    
    const equation = `${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}`;
    const x = 2; // Evaluate at x = 2
    const result = a * x * x + b * x + c;
    
    const answer = result;
    const steps = [
      `Evaluate ${equation} when x = 2`,
      `${a}(2)² + ${b}(2) + ${c}`,
      `${a * 4} + ${b * 2} + ${c} = ${result}`
    ];
    
    return {
      equation: `Evaluate: ${equation} when x = 2`,
      answer,
      steps,
      explanation: `Substitute x = 2 into the polynomial and calculate.`
    };
  };

  const checkAnswer = () => {
    if (!currentProblem) return;
    
    const userAnswerTrimmed = userAnswer.trim().toLowerCase();
    const correctAnswer = currentProblem.answer.toString().toLowerCase();
    
    // Handle different answer formats
    let isCorrect = false;
    
    if (typeof currentProblem.answer === 'number') {
      const userNum = parseFloat(userAnswerTrimmed);
      isCorrect = !isNaN(userNum) && Math.abs(userNum - currentProblem.answer) < 0.01;
    } else {
      isCorrect = userAnswerTrimmed === correctAnswer || 
                  userAnswerTrimmed.replace(/\s/g, '') === correctAnswer.replace(/\s/g, '');
    }
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + 10 * level);
    }
    
    setTimeout(() => {
      setLevel(prev => prev + 1);
      generateProblem();
    }, 3000);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">📊 Algebra Quest</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Algebraic Thinking & Problem Solving</DialogTitle>
                <DialogDescription>Master algebraic concepts through interactive problem solving</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">📊 Algebra Concepts</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Linear Equations:</strong> Solve for unknown variables</li>
                    <li><strong>Quadratic Equations:</strong> Work with x² terms and factoring</li>
                    <li><strong>Systems:</strong> Solve multiple equations simultaneously</li>
                    <li><strong>Inequalities:</strong> Find ranges of solutions</li>
                    <li><strong>Polynomials:</strong> Work with expressions of multiple terms</li>
                  </ul>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Algebra" target="_blank" className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Algebra</a>
                    <a href="https://en.wikipedia.org/wiki/Linear_equation" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Linear Equations</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Algebra Learning Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Problem Type</label>
                  <Select value={problemType} onValueChange={(value) => setProblemType(value as ProblemType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear_equations">Linear Equations</SelectItem>
                      <SelectItem value="quadratic_equations">Quadratic Equations</SelectItem>
                      <SelectItem value="systems">System of Equations</SelectItem>
                      <SelectItem value="inequalities">Inequalities</SelectItem>
                      <SelectItem value="polynomials">Polynomials</SelectItem>
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
                <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600">
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
                      <p className="text-lg mb-4">Solve the equation:</p>
                      <div className="text-2xl font-mono bg-gray-100 p-4 rounded-lg whitespace-pre-line">
                        {currentProblem.equation}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter your answer (e.g., x = 5 or x = 2, y = 3)"
                        className="text-center text-lg max-w-md mx-auto"
                        disabled={!!feedback}
                      />
                    </div>
                    
                    <div className="flex gap-4 justify-center mb-4">
                      <Button 
                        onClick={checkAnswer} 
                        disabled={!userAnswer || !!feedback}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        Check Answer
                      </Button>
                      <Button 
                        onClick={() => setShowSteps(!showSteps)}
                        variant="outline"
                      >
                        {showSteps ? 'Hide' : 'Show'} Steps
                      </Button>
                    </div>
                    
                    {showSteps && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h4 className="font-bold mb-2">Solution Steps:</h4>
                        <ol className="list-decimal list-inside text-left max-w-md mx-auto">
                          {currentProblem.steps.map((step, index) => (
                            <li key={index} className="font-mono">{step}</li>
                          ))}
                        </ol>
                        <p className="text-sm mt-2 italic">{currentProblem.explanation}</p>
                      </div>
                    )}
                    
                    {feedback && (
                      <div className={`p-4 rounded-lg ${
                        feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <p className="text-xl font-bold mb-2">
                          {feedback === 'correct' ? '✅ Correct!' : '❌ Not quite right'}
                        </p>
                        <p>Answer: {currentProblem.answer}</p>
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
