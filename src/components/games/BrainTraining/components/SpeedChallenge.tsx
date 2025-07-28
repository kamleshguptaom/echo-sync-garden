import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SpeedChallengeProps {
  onComplete: (correct: boolean) => void;
  difficulty: number;
}

export const SpeedChallenge: React.FC<SpeedChallengeProps> = ({ onComplete, difficulty }) => {
  const [problem, setProblem] = useState<{ question: string; answer: number; options: number[] }>({
    question: '', answer: 0, options: []
  });
  const [timeLeft, setTimeLeft] = useState(3000);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    generateProblem();
  }, [difficulty]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 100), 100);
      return () => clearTimeout(timer);
    } else if (gameStarted && timeLeft <= 0) {
      onComplete(false);
    }
  }, [gameStarted, timeLeft, onComplete]);

  const generateProblem = () => {
    const maxNum = 10 + (difficulty * 5);
    const a = Math.floor(Math.random() * maxNum) + 1;
    const b = Math.floor(Math.random() * maxNum) + 1;
    
    const operations = ['+', '-', '*'];
    const op = operations[Math.floor(Math.random() * (difficulty > 2 ? 3 : 2))];
    
    let answer: number;
    let question: string;
    
    switch (op) {
      case '+':
        answer = a + b;
        question = `${a} + ${b}`;
        break;
      case '-':
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        answer = larger - smaller;
        question = `${larger} - ${smaller}`;
        break;
      case '*':
        answer = a * b;
        question = `${a} × ${b}`;
        break;
      default:
        answer = a + b;
        question = `${a} + ${b}`;
    }
    
    // Generate wrong options
    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + (Math.floor(Math.random() * 10) - 5);
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    setProblem({ question, answer, options });
    setGameStarted(false);
    setTimeLeft(3000 - (difficulty * 200));
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const handleOptionClick = (selectedAnswer: number) => {
    if (!gameStarted) return;
    onComplete(selectedAnswer === problem.answer);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-center text-xl">Speed Math</CardTitle>
        <p className="text-center text-gray-600">
          Solve as fast as you can!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!gameStarted ? (
          <Button onClick={startGame} className="w-full bg-purple-500 hover:bg-purple-600">
            Start Speed Test
          </Button>
        ) : (
          <>
            <div className="text-center">
              <div className="text-lg font-medium">Time Left: {(timeLeft / 1000).toFixed(1)}s</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${(timeLeft / (3000 - (difficulty * 200))) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-6">{problem.question} = ?</div>
              <div className="grid grid-cols-2 gap-3">
                {problem.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="text-xl p-4 bg-blue-500 hover:bg-blue-600"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};