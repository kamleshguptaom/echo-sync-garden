
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface MathRacingProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

interface Question {
  expression: string;
  answer: number;
}

interface Car {
  position: number;
  color: string;
  name: string;
}

export const MathRacing: React.FC<MathRacingProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [operation, setOperation] = useState<Operation>('mixed');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [playerCar, setPlayerCar] = useState<Car>({ position: 0, color: 'blue', name: 'Player' });
  const [aiCars, setAiCars] = useState<Car[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameFinished, setGameFinished] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  const generateQuestion = (): Question => {
    const settings = {
      easy: { max: 10, operations: ['addition', 'subtraction'] },
      medium: { max: 25, operations: ['addition', 'subtraction', 'multiplication'] },
      hard: { max: 50, operations: ['addition', 'subtraction', 'multiplication', 'division'] }
    };
    
    const { max, operations } = settings[difficulty];
    const availableOps = operation === 'mixed' ? operations : [operation];
    const selectedOp = availableOps[Math.floor(Math.random() * availableOps.length)];
    
    let expression: string;
    let answer: number;
    
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    
    switch (selectedOp) {
      case 'addition':
        expression = `${a} + ${b}`;
        answer = a + b;
        break;
      case 'subtraction':
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        expression = `${larger} - ${smaller}`;
        answer = larger - smaller;
        break;
      case 'multiplication':
        const smallA = Math.floor(Math.random() * 12) + 1;
        const smallB = Math.floor(Math.random() * 12) + 1;
        expression = `${smallA} × ${smallB}`;
        answer = smallA * smallB;
        break;
      case 'division':
        const dividend = a * b;
        expression = `${dividend} ÷ ${a}`;
        answer = b;
        break;
      default:
        expression = `${a} + ${b}`;
        answer = a + b;
    }
    
    return { expression, answer };
  };

  const initializeRace = () => {
    setPlayerCar({ position: 0, color: 'blue', name: 'Player' });
    setAiCars([
      { position: 0, color: 'red', name: 'Speed Demon' },
      { position: 0, color: 'green', name: 'Calculator' },
      { position: 0, color: 'yellow', name: 'Math Master' }
    ]);
    setScore(0);
    setTimeLeft(60);
    setQuestionsAnswered(0);
    setStreak(0);
    setGameFinished(false);
    generateNextQuestion();
  };

  const generateNextQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
  };

  const startGame = () => {
    setGameStarted(true);
    initializeRace();
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // AI cars move periodically
    const aiInterval = setInterval(() => {
      if (!gameFinished) {
        setAiCars(prev => prev.map(car => ({
          ...car,
          position: Math.min(car.position + Math.random() * 2, 100)
        })));
      }
    }, 2000);
    
    return () => {
      clearInterval(aiInterval);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const userValue = parseInt(userAnswer);
    const isCorrect = userValue === currentQuestion.answer;
    
    if (isCorrect) {
      const points = 10 + (streak * 2);
      setScore(score + points);
      setStreak(streak + 1);
      setPlayerCar(prev => ({
        ...prev,
        position: Math.min(prev.position + 8 + (streak * 2), 100)
      }));
      
      if (playerCar.position >= 100) {
        setGameFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } else {
      setStreak(0);
    }
    
    setQuestionsAnswered(prev => prev + 1);
    generateNextQuestion();
  };

  const renderRaceTrack = () => {
    const allCars = [playerCar, ...aiCars];
    
    return (
      <div className="bg-gray-200 p-4 rounded-lg mb-6">
        <div className="relative h-64 bg-green-400 rounded-lg overflow-hidden">
          {/* Race track lanes */}
          {allCars.map((car, index) => (
            <div key={index} className="relative h-12 border-b-2 border-white">
              <div className="absolute left-0 top-2 text-xs font-bold">
                {car.name}
              </div>
              <div
                className={`absolute top-1 w-8 h-8 rounded transition-all duration-500 ${
                  car.color === 'blue' ? 'bg-blue-500' :
                  car.color === 'red' ? 'bg-red-500' :
                  car.color === 'green' ? 'bg-green-600' :
                  'bg-yellow-500'
                }`}
                style={{ left: `${car.position}%` }}
              >
                🏎️
              </div>
            </div>
          ))}
          
          {/* Finish line */}
          <div className="absolute right-0 top-0 w-2 h-full bg-black opacity-50">
            <div className="text-white text-xs rotate-90 mt-20">FINISH</div>
          </div>
        </div>
      </div>
    );
  };

  const goBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600">
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
          <h1 className="text-4xl font-bold text-white">🏁 Math Racing</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Speed Math Racing</DialogTitle>
                <DialogDescription>Improve mental math through competitive racing</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🏎️ How Math Racing Works</h3>
                  <p>Answer math questions quickly and correctly to move your car forward. The faster and more accurate you are, the quicker you'll reach the finish line!</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🧠 Benefits</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Improves mental calculation speed</li>
                    <li>Builds arithmetic fluency</li>
                    <li>Enhances number sense</li>
                    <li>Develops competitive mathematical thinking</li>
                  </ul>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">🏆 Racing Tips:</h4>
                  <p>• Answer correctly to boost forward<br/>
                     • Build streaks for bonus speed<br/>
                     • Don't rush - accuracy beats speed<br/>
                     • Practice mental math shortcuts!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Math Racing Settings</CardTitle>
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
                      <SelectItem value="medium">Medium (Larger numbers)</SelectItem>
                      <SelectItem value="hard">Hard (Complex operations)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Operation Type</label>
                  <Select value={operation} onValueChange={(value) => setOperation(value as Operation)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addition">Addition</SelectItem>
                      <SelectItem value="subtraction">Subtraction</SelectItem>
                      <SelectItem value="multiplication">Multiplication</SelectItem>
                      <SelectItem value="division">Division</SelectItem>
                      <SelectItem value="mixed">Mixed Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
                  Start Racing!
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>Score: {score}</span>
                <span>Time: {timeLeft}s</span>
                <span>Streak: {streak}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderRaceTrack()}
              
              {!gameFinished && currentQuestion && (
                <div className="text-center">
                  <p className="text-2xl font-bold mb-4">{currentQuestion.expression} = ?</p>
                  <div className="max-w-xs mx-auto mb-4">
                    <Input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Your answer"
                      className="text-center text-xl"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      autoFocus
                    />
                  </div>
                  <Button
                    onClick={checkAnswer}
                    disabled={!userAnswer}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Submit Answer
                  </Button>
                </div>
              )}
              
              {gameFinished && (
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold">🏁 Race Complete!</h2>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-blue-100 p-4 rounded">
                      <div className="font-bold">Final Score</div>
                      <div className="text-2xl">{score}</div>
                    </div>
                    <div className="bg-green-100 p-4 rounded">
                      <div className="font-bold">Questions</div>
                      <div className="text-2xl">{questionsAnswered}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p>Your Position: {playerCar.position >= 100 ? '🥇 1st Place!' : 
                                      playerCar.position >= 75 ? '🥈 2nd Place' :
                                      playerCar.position >= 50 ? '🥉 3rd Place' : '4th Place'}</p>
                  </div>
                  <Button onClick={() => { setGameStarted(false); }} className="bg-orange-500 hover:bg-orange-600">
                    Race Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
