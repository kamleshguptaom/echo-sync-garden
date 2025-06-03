
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface GeometryGameProps {
  onBack: () => void;
}

type QuestionType = 'area' | 'perimeter' | 'angle' | 'volume';

interface GeometryQuestion {
  type: QuestionType;
  shape: string;
  question: string;
  answer: number;
  dimensions: { [key: string]: number };
  visual: JSX.Element;
}

export const GeometryGame: React.FC<GeometryGameProps> = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState<GeometryQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateQuestion = (): GeometryQuestion => {
    const questionTypes: QuestionType[] = ['area', 'perimeter', 'angle'];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (type) {
      case 'area':
        return generateAreaQuestion();
      case 'perimeter':
        return generatePerimeterQuestion();
      case 'angle':
        return generateAngleQuestion();
      default:
        return generateAreaQuestion();
    }
  };

  const generateAreaQuestion = (): GeometryQuestion => {
    const shapes = ['rectangle', 'triangle', 'circle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    switch (shape) {
      case 'rectangle':
        const width = Math.floor(Math.random() * 10) + 3;
        const height = Math.floor(Math.random() * 10) + 3;
        return {
          type: 'area',
          shape: 'rectangle',
          question: `What is the area of a rectangle with width ${width} and height ${height}?`,
          answer: width * height,
          dimensions: { width, height },
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-blue-500 bg-blue-100 flex items-center justify-center text-sm"
                style={{ width: width * 20, height: height * 20 }}
              >
                {width} × {height}
              </div>
            </div>
          )
        };
      
      case 'triangle':
        const base = Math.floor(Math.random() * 10) + 3;
        const triangleHeight = Math.floor(Math.random() * 8) + 2;
        return {
          type: 'area',
          shape: 'triangle',
          question: `What is the area of a triangle with base ${base} and height ${triangleHeight}?`,
          answer: (base * triangleHeight) / 2,
          dimensions: { base, height: triangleHeight },
          visual: (
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="border-4 border-green-500"
                  style={{ 
                    width: 0, 
                    height: 0,
                    borderLeft: `${base * 10}px solid transparent`,
                    borderRight: `${base * 10}px solid transparent`,
                    borderBottom: `${triangleHeight * 15}px solid rgba(34, 197, 94, 0.3)`
                  }}
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm">
                  base: {base}
                </div>
                <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 text-sm">
                  h: {triangleHeight}
                </div>
              </div>
            </div>
          )
        };
      
      case 'circle':
        const radius = Math.floor(Math.random() * 5) + 2;
        return {
          type: 'area',
          shape: 'circle',
          question: `What is the area of a circle with radius ${radius}? (Use π ≈ 3.14)`,
          answer: Math.round(Math.PI * radius * radius * 100) / 100,
          dimensions: { radius },
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-red-500 bg-red-100 rounded-full flex items-center justify-center text-sm"
                style={{ width: radius * 40, height: radius * 40 }}
              >
                r = {radius}
              </div>
            </div>
          )
        };
      
      default:
        return generateAreaQuestion();
    }
  };

  const generatePerimeterQuestion = (): GeometryQuestion => {
    const shapes = ['rectangle', 'triangle', 'circle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    switch (shape) {
      case 'rectangle':
        const width = Math.floor(Math.random() * 8) + 2;
        const height = Math.floor(Math.random() * 8) + 2;
        return {
          type: 'perimeter',
          shape: 'rectangle',
          question: `What is the perimeter of a rectangle with width ${width} and height ${height}?`,
          answer: 2 * (width + height),
          dimensions: { width, height },
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-purple-500 bg-purple-100 flex items-center justify-center text-sm"
                style={{ width: width * 25, height: height * 25 }}
              >
                {width} × {height}
              </div>
            </div>
          )
        };
      
      case 'circle':
        const radius = Math.floor(Math.random() * 4) + 2;
        return {
          type: 'perimeter',
          shape: 'circle',
          question: `What is the circumference of a circle with radius ${radius}? (Use π ≈ 3.14)`,
          answer: Math.round(2 * Math.PI * radius * 100) / 100,
          dimensions: { radius },
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-orange-500 bg-orange-100 rounded-full flex items-center justify-center text-sm"
                style={{ width: radius * 50, height: radius * 50 }}
              >
                r = {radius}
              </div>
            </div>
          )
        };
      
      default:
        const side = Math.floor(Math.random() * 6) + 3;
        return {
          type: 'perimeter',
          shape: 'square',
          question: `What is the perimeter of a square with side length ${side}?`,
          answer: 4 * side,
          dimensions: { side },
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-indigo-500 bg-indigo-100 flex items-center justify-center text-sm"
                style={{ width: side * 30, height: side * 30 }}
              >
                {side}
              </div>
            </div>
          )
        };
    }
  };

  const generateAngleQuestion = (): GeometryQuestion => {
    const angle1 = Math.floor(Math.random() * 60) + 30;
    const angle2 = Math.floor(Math.random() * 60) + 30;
    const missingAngle = 180 - angle1 - angle2;
    
    return {
      type: 'angle',
      shape: 'triangle',
      question: `In a triangle, two angles are ${angle1}° and ${angle2}°. What is the third angle?`,
      answer: missingAngle,
      dimensions: { angle1, angle2 },
      visual: (
        <div className="flex justify-center">
          <div className="relative">
            <svg width="200" height="120" viewBox="0 0 200 120">
              <polygon points="20,100 180,100 100,20" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="3"/>
              <text x="30" y="95" fontSize="12" fill="#1f2937">{angle1}°</text>
              <text x="160" y="95" fontSize="12" fill="#1f2937">{angle2}°</text>
              <text x="95" y="35" fontSize="12" fill="#ef4444">?</text>
            </svg>
          </div>
        </div>
      )
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setFeedback('');
    setCurrentQuestion(generateQuestion());
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const userNum = parseFloat(userAnswer);
    const tolerance = 0.1; // Allow small rounding differences
    
    if (Math.abs(userNum - currentQuestion.answer) <= tolerance) {
      setScore(score + (streak + 1) * 20);
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
    } else {
      setStreak(0);
      setFeedback(`Incorrect. The answer was ${currentQuestion.answer}`);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
    setUserAnswer('');
    
    setTimeout(() => {
      if (questionsAnswered < 9) {
        setCurrentQuestion(generateQuestion());
        setFeedback('');
      } else {
        setGameStarted(false);
        setCurrentQuestion(null);
      }
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Geometry Challenge</h1>
          <div className="w-20"></div>
        </div>

        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">
              {gameStarted ? (
                <div className="flex justify-between items-center">
                  <span>Score: {score}</span>
                  <span>Question: {questionsAnswered + 1}/10</span>
                  <span>Streak: {streak}</span>
                </div>
              ) : (
                "Test Your Geometry Skills!"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!gameStarted ? (
              <div className="space-y-4">
                <p className="text-lg">Ready to solve geometry problems?</p>
                <p className="text-gray-600">You'll get 10 questions about areas, perimeters, and angles!</p>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-xl px-8 py-3">
                  Start Challenge
                </Button>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  {currentQuestion.visual}
                </div>
                
                <div className="text-xl font-semibold text-blue-600">
                  {currentQuestion.question}
                </div>
                
                <div className="flex justify-center gap-4">
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
                </div>
                
                {feedback && (
                  <div className={`text-xl font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'} animate-bounce`}>
                    {feedback}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-600">Challenge Complete!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Questions Answered: {questionsAnswered}/10</p>
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
