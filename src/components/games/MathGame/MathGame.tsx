
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MathGameProps {
  onBack: () => void;
}

interface Question {
  num1: number;
  num2: number;
  operation: '+' | '-' | '*' | '/';
  answer: number;
}

export const MathGame: React.FC<MathGameProps> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showConcept, setShowConcept] = useState(false);

  const generateQuestion = (): Question => {
    let num1: number, num2: number, operation: '+' | '-' | '*' | '/', answer: number;

    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operation = ['+', '-', '*'][Math.floor(Math.random() * 3)] as '+' | '-' | '*';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        if (operation === '*') {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
        }
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        operation = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)] as '+' | '-' | '*' | '/';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        if (operation === '*') {
          num1 = Math.floor(Math.random() * 15) + 1;
          num2 = Math.floor(Math.random() * 15) + 1;
        }
        if (operation === '/') {
          answer = Math.floor(Math.random() * 20) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          num1 = answer * num2;
        }
        break;
    }

    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      case '/':
        answer = Math.round(num1 / num2);
        break;
    }

    return { num1, num2, operation, answer };
  };

  const startGame = () => {
    setScore(0);
    setQuestionCount(0);
    setTimeLeft(60);
    setGameActive(true);
    setStreak(0);
    setMaxStreak(0);
    setFeedback({ type: null, message: '' });
    setCurrentQuestion(generateQuestion());
  };

  const submitAnswer = () => {
    if (!currentQuestion || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;
    
    if (isCorrect) {
      const points = (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3) + Math.floor(streak / 3);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setFeedback({ 
        type: 'correct', 
        message: `Correct! +${points} points${streak >= 2 ? ` (Streak: ${streak + 1})` : ''}` 
      });
    } else {
      setStreak(0);
      setFeedback({ 
        type: 'incorrect', 
        message: `Incorrect. Answer was ${currentQuestion.answer}` 
      });
    }

    setQuestionCount(prev => prev + 1);
    setUserAnswer('');
    
    setTimeout(() => {
      setFeedback({ type: null, message: '' });
      setCurrentQuestion(generateQuestion());
    }, 1500);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-red-400 to-pink-500 p-6">
      <style>{`
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        .number-float {
          position: absolute;
          animation: float-numbers 4s ease-in-out infinite;
          font-size: 2rem;
          opacity: 0.1;
        }
        @keyframes float-numbers {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        .answer-correct {
          animation: bounce-correct 0.5s ease;
        }
        .answer-incorrect {
          animation: shake-incorrect 0.5s ease;
        }
        @keyframes bounce-correct {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes shake-incorrect {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>

      <div className="floating-elements">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="number-float text-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          >
            {Math.floor(Math.random() * 100)}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🔢 Math Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500/80 text-white hover:bg-purple-600/80">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Mathematical Fluency & Problem Solving</DialogTitle>
                <DialogDescription>Build computational skills and number sense</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Learning Goals</h3>
                  <p>Math fluency games develop automatic recall of number facts, improve computational speed, and strengthen number sense through repeated practice.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🧠 Skills Developed</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Computational Fluency:</strong> Quick and accurate calculations</li>
                    <li><strong>Number Sense:</strong> Understanding number relationships</li>
                    <li><strong>Mental Math:</strong> Solving problems without external aids</li>
                    <li><strong>Pattern Recognition:</strong> Identifying mathematical patterns</li>
                  </ul>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Strategy Tips:</h4>
                  <p>• Practice basic facts daily for automaticity<br/>
                     • Use mental math strategies (doubles, near doubles)<br/>
                     • Break complex problems into simpler parts<br/>
                     • Build confidence through regular practice</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameActive && questionCount === 0 ? (
          <Card className="bg-white/20 backdrop-blur-md border-2 border-white/30 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">Choose Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <Button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    variant={difficulty === level ? "default" : "outline"}
                    className={`p-6 h-auto flex flex-col items-center gap-2 ${
                      difficulty === level 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                        : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                    }`}
                  >
                    <span className="text-2xl">
                      {level === 'easy' ? '🟢' : level === 'medium' ? '🟡' : '🔴'}
                    </span>
                    <span className="font-bold capitalize">{level}</span>
                    <span className="text-sm opacity-80">
                      {level === 'easy' ? '+ and -' : level === 'medium' ? '+ - ×' : '+ - × ÷'}
                    </span>
                  </Button>
                ))}
              </div>
              <Button onClick={startGame} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 text-lg">
                🎮 Start Challenge
              </Button>
            </CardContent>
          </Card>
        ) : gameActive ? (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="flex justify-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                ⏱️ {timeLeft}s
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                📊 Score: {score}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                🔥 Streak: {streak}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                📝 {questionCount}
              </Badge>
            </div>

            <Progress value={(timeLeft / 60) * 100} className="w-full max-w-md mx-auto" />

            {/* Question Card */}
            <Card className={`bg-white/20 backdrop-blur-md border-2 border-white/30 max-w-md mx-auto ${
              feedback.type === 'correct' ? 'answer-correct' : 
              feedback.type === 'incorrect' ? 'answer-incorrect' : ''
            }`}>
              <CardContent className="p-8 text-center">
                {currentQuestion && (
                  <div className="space-y-6">
                    <div className="text-4xl font-bold text-white">
                      {currentQuestion.num1} {currentQuestion.operation} {currentQuestion.num2} = ?
                    </div>
                    
                    <Input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Your answer..."
                      className="text-center text-2xl font-bold bg-white/30 border-white/50 text-white placeholder:text-white/70"
                      autoFocus
                    />
                    
                    <Button 
                      onClick={submitAnswer} 
                      disabled={userAnswer === ''}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 text-lg"
                    >
                      Submit Answer
                    </Button>
                    
                    {feedback.message && (
                      <div className={`p-3 rounded-lg font-bold ${
                        feedback.type === 'correct' 
                          ? 'bg-green-500/30 text-green-100' 
                          : 'bg-red-500/30 text-red-100'
                      }`}>
                        {feedback.message}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Game Over Screen
          <Card className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 max-w-2xl mx-auto border-2 border-white/40">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl animate-bounce">
                {score >= 50 ? '🏆' : score >= 30 ? '🎉' : '👏'}
              </div>
              <h2 className="text-3xl font-bold text-white">Time's Up!</h2>
              <div className="space-y-2 text-white text-lg">
                <p>Final Score: <span className="font-bold">{score}</span></p>
                <p>Questions Answered: <span className="font-bold">{questionCount}</span></p>
                <p>Best Streak: <span className="font-bold">{maxStreak}</span></p>
                <p>Accuracy: <span className="font-bold">{questionCount > 0 ? Math.round((score / questionCount) * 100) : 0}%</span></p>
              </div>
              <div className="flex gap-2 justify-center pt-4">
                <Button onClick={startGame} className="bg-white/20 text-white hover:bg-white/30">
                  🔄 Play Again
                </Button>
                <Button onClick={() => setQuestionCount(0)} className="bg-white/20 text-white hover:bg-white/30">
                  ⚙️ Change Level
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
