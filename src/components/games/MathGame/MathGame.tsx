
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { MathQuestionService } from './MathQuestionService';
import { ConceptVisual } from './ConceptVisual';
import { GameStats } from './GameStats';
import { QuestionCard } from './QuestionCard';

interface MathGameProps {
  onBack: () => void;
}

export const MathGame: React.FC<MathGameProps> = ({ onBack }) => {
  const [questionService] = useState(new MathQuestionService());
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showConcept, setShowConcept] = useState(false);
  const [showConceptVisual, setShowConceptVisual] = useState(false);

  const startGame = () => {
    setScore(0);
    setQuestionCount(0);
    setTimeLeft(60);
    setGameActive(true);
    setStreak(0);
    setMaxStreak(0);
    setFeedback({ type: null, message: '' });
    setCurrentQuestion(questionService.generateQuestion(difficulty));
    setShowConceptVisual(true);
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
        message: `🎉 Correct! +${points} points${streak >= 2 ? ` (Streak: ${streak + 1})` : ''}` 
      });
    } else {
      setStreak(0);
      setFeedback({ 
        type: 'incorrect', 
        message: `❌ Incorrect. Answer was ${currentQuestion.answer}` 
      });
    }

    setQuestionCount(prev => prev + 1);
    setUserAnswer('');
    
    setTimeout(() => {
      setFeedback({ type: null, message: '' });
      setCurrentQuestion(questionService.generateQuestion(difficulty));
      setShowConceptVisual(true);
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

  useEffect(() => {
    if (showConceptVisual) {
      const timer = setTimeout(() => {
        setShowConceptVisual(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConceptVisual]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/80 border-gray-300 text-gray-700 hover:bg-white">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
            🔢 Math Challenge
          </h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500/80 text-white hover:bg-purple-600/80">
                🧠 Learn Math
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Mathematical Fluency & Problem Solving</DialogTitle>
                <DialogDescription>Build computational skills and number sense</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">🎯 Learning Goals</h3>
                  <p>Math fluency games develop automatic recall of number facts, improve computational speed, and strengthen number sense through repeated practice.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">💡 Tips</h3>
                  <p>{questionService.getRandomTip()}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameActive && questionCount === 0 ? (
          <Card className="bg-white/80 backdrop-blur-md border-2 border-white/50 max-w-2xl mx-auto shadow-xl">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">Choose Difficulty</h2>
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <Button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    variant={difficulty === level ? "default" : "outline"}
                    className={`p-6 h-auto flex flex-col items-center gap-2 ${
                      difficulty === level 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                        : 'bg-white/70 border-gray-300 text-gray-700 hover:bg-white/90'
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
            <GameStats 
              timeLeft={timeLeft}
              score={score}
              streak={streak}
              questionCount={questionCount}
              totalTime={60}
            />

            {currentQuestion && showConceptVisual && (
              <ConceptVisual 
                concept={currentQuestion.concept}
                isVisible={showConceptVisual}
              />
            )}

            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                userAnswer={userAnswer}
                onAnswerChange={setUserAnswer}
                onSubmit={submitAnswer}
                feedback={feedback}
              />
            )}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 max-w-2xl mx-auto border-2 border-white/40 shadow-xl">
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl">
                {score >= 50 ? '🏆' : score >= 30 ? '🎉' : '👏'}
              </div>
              <h2 className="text-3xl font-bold text-white">Time's Up!</h2>
              <div className="space-y-2 text-white text-lg">
                <p>Final Score: <span className="font-bold">{score}</span></p>
                <p>Questions Answered: <span className="font-bold">{questionCount}</span></p>
                <p>Best Streak: <span className="font-bold">{maxStreak}</span></p>
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
