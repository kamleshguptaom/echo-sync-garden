import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface GeometryGameProps {
  onBack: () => void;
}

type QuestionType = 'area' | 'perimeter' | 'angle' | 'volume' | 'coordinate' | 'transform';
type Difficulty = 'easy' | 'medium' | 'hard';

interface GeometryQuestion {
  type: QuestionType;
  shape: string;
  question: string;
  answer: number;
  dimensions: { [key: string]: number };
  visual: JSX.Element;
  hint?: string;
}

export const GeometryGame: React.FC<GeometryGameProps> = ({ onBack }) => {
  const [questionType, setQuestionType] = useState<QuestionType>('area');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<GeometryQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const generateQuestion = (): GeometryQuestion => {
    switch (questionType) {
      case 'area':
        return generateAreaQuestion();
      case 'perimeter':
        return generatePerimeterQuestion();
      case 'angle':
        return generateAngleQuestion();
      case 'volume':
        return generateVolumeQuestion();
      case 'coordinate':
        return generateCoordinateQuestion();
      case 'transform':
        return generateTransformQuestion();
      default:
        return generateAreaQuestion();
    }
  };

  const generateAreaQuestion = (): GeometryQuestion => {
    const shapes = difficulty === 'easy' ? ['rectangle', 'triangle'] : 
                  difficulty === 'medium' ? ['rectangle', 'triangle', 'circle'] : 
                  ['rectangle', 'triangle', 'circle', 'trapezoid', 'parallelogram'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    
    switch (shape) {
      case 'rectangle':
        const width = Math.floor(Math.random() * 10 * multiplier) + 3;
        const height = Math.floor(Math.random() * 10 * multiplier) + 3;
        return {
          type: 'area',
          shape: 'rectangle',
          question: `What is the area of a rectangle with width ${width} and height ${height}?`,
          answer: width * height,
          dimensions: { width, height },
          hint: 'Area of rectangle = width × height',
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-blue-500 bg-blue-100 flex items-center justify-center text-sm"
                style={{ width: Math.min(width * 20, 200), height: Math.min(height * 20, 150) }}
              >
                {width} × {height}
              </div>
            </div>
          )
        };
      
      case 'triangle':
        const base = Math.floor(Math.random() * 10 * multiplier) + 3;
        const triangleHeight = Math.floor(Math.random() * 8 * multiplier) + 2;
        return {
          type: 'area',
          shape: 'triangle',
          question: `What is the area of a triangle with base ${base} and height ${triangleHeight}?`,
          answer: (base * triangleHeight) / 2,
          dimensions: { base, height: triangleHeight },
          hint: 'Area of triangle = (base × height) ÷ 2',
          visual: (
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="border-4 border-green-500"
                  style={{ 
                    width: 0, 
                    height: 0,
                    borderLeft: `${Math.min(base * 10, 100)}px solid transparent`,
                    borderRight: `${Math.min(base * 10, 100)}px solid transparent`,
                    borderBottom: `${Math.min(triangleHeight * 15, 120)}px solid rgba(34, 197, 94, 0.3)`
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
        const radius = Math.floor(Math.random() * 5 * multiplier) + 2;
        return {
          type: 'area',
          shape: 'circle',
          question: `What is the area of a circle with radius ${radius}? (Use π ≈ 3.14)`,
          answer: Math.round(Math.PI * radius * radius * 100) / 100,
          dimensions: { radius },
          hint: 'Area of circle = π × radius²',
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-red-500 bg-red-100 rounded-full flex items-center justify-center text-sm"
                style={{ width: Math.min(radius * 40, 120), height: Math.min(radius * 40, 120) }}
              >
                r = {radius}
              </div>
            </div>
          )
        };

      case 'trapezoid':
        const base1 = Math.floor(Math.random() * 8) + 4;
        const base2 = Math.floor(Math.random() * 8) + 6;
        const trapHeight = Math.floor(Math.random() * 6) + 3;
        return {
          type: 'area',
          shape: 'trapezoid',
          question: `What is the area of a trapezoid with bases ${base1} and ${base2}, and height ${trapHeight}?`,
          answer: ((base1 + base2) * trapHeight) / 2,
          dimensions: { base1, base2, height: trapHeight },
          hint: 'Area of trapezoid = ((base1 + base2) × height) ÷ 2',
          visual: (
            <div className="flex justify-center">
              <svg width="160" height="100" viewBox="0 0 160 100">
                <polygon points="40,80 120,80 100,20 60,20" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="3"/>
                <text x="80" y="95" fontSize="10" fill="#1f2937">{base1}</text>
                <text x="80" y="15" fontSize="10" fill="#1f2937">{base2}</text>
                <text x="15" y="50" fontSize="10" fill="#1f2937">h:{trapHeight}</text>
              </svg>
            </div>
          )
        };

      default:
        return generateAreaQuestion();
    }
  };

  const generateVolumeQuestion = (): GeometryQuestion => {
    const shapes = ['cube', 'rectangular-prism', 'cylinder'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    
    switch (shape) {
      case 'cube':
        const side = Math.floor(Math.random() * 8 * multiplier) + 2;
        return {
          type: 'volume',
          shape: 'cube',
          question: `What is the volume of a cube with side length ${side}?`,
          answer: side * side * side,
          dimensions: { side },
          hint: 'Volume of cube = side³',
          visual: (
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="border-4 border-purple-500 bg-purple-100"
                  style={{ width: 80, height: 80 }}
                />
                <div className="absolute top-2 left-2 w-16 h-16 border-2 border-purple-300 bg-purple-50 transform translate-x-4 -translate-y-4" />
                <div className="text-center mt-2 text-sm">side: {side}</div>
              </div>
            </div>
          )
        };
      
      case 'rectangular-prism':
        const length = Math.floor(Math.random() * 8 * multiplier) + 3;
        const width = Math.floor(Math.random() * 6 * multiplier) + 2;
        const height = Math.floor(Math.random() * 5 * multiplier) + 2;
        return {
          type: 'volume',
          shape: 'rectangular-prism',
          question: `What is the volume of a rectangular prism with length ${length}, width ${width}, and height ${height}?`,
          answer: length * width * height,
          dimensions: { length, width, height },
          hint: 'Volume of rectangular prism = length × width × height',
          visual: (
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="border-4 border-indigo-500 bg-indigo-100"
                  style={{ width: 100, height: 60 }}
                />
                <div className="text-center mt-2 text-xs">
                  {length} × {width} × {height}
                </div>
              </div>
            </div>
          )
        };

      default:
        const radius = Math.floor(Math.random() * 5 * multiplier) + 2;
        const cylHeight = Math.floor(Math.random() * 8 * multiplier) + 3;
        return {
          type: 'volume',
          shape: 'cylinder',
          question: `What is the volume of a cylinder with radius ${radius} and height ${cylHeight}? (Use π ≈ 3.14)`,
          answer: Math.round(Math.PI * radius * radius * cylHeight * 100) / 100,
          dimensions: { radius, height: cylHeight },
          hint: 'Volume of cylinder = π × radius² × height',
          visual: (
            <div className="flex justify-center">
              <svg width="120" height="100" viewBox="0 0 120 100">
                <ellipse cx="60" cy="85" rx="30" ry="10" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="2"/>
                <ellipse cx="60" cy="15" rx="30" ry="10" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="2"/>
                <line x1="30" y1="15" x2="30" y2="85" stroke="#6366f1" strokeWidth="2"/>
                <line x1="90" y1="15" x2="90" y2="85" stroke="#6366f1" strokeWidth="2"/>
                <text x="60" y="50" fontSize="10" fill="#1f2937" textAnchor="middle">r:{radius}</text>
                <text x="100" y="50" fontSize="10" fill="#1f2937">h:{cylHeight}</text>
              </svg>
            </div>
          )
        };
    }
  };

  const generateCoordinateQuestion = (): GeometryQuestion => {
    const x1 = Math.floor(Math.random() * 10) - 5;
    const y1 = Math.floor(Math.random() * 10) - 5;
    const x2 = Math.floor(Math.random() * 10) - 5;
    const y2 = Math.floor(Math.random() * 10) - 5;
    
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
    return {
      type: 'coordinate',
      shape: 'line',
      question: `What is the distance between points (${x1}, ${y1}) and (${x2}, ${y2})? (Round to 2 decimal places)`,
      answer: Math.round(distance * 100) / 100,
      dimensions: { x1, y1, x2, y2 },
      hint: 'Distance formula: √[(x2-x1)² + (y2-y1)²]',
      visual: (
        <div className="flex justify-center">
          <svg width="200" height="200" viewBox="-10 -10 20 20">
            <defs>
              <pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse">
                <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#e5e7eb" strokeWidth="0.2"/>
              </pattern>
            </defs>
            <rect x="-10" y="-10" width="20" height="20" fill="url(#grid)" />
            <line x1="-10" y1="0" x2="10" y2="0" stroke="#6b7280" strokeWidth="0.5"/>
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#6b7280" strokeWidth="0.5"/>
            <circle cx={x1} cy={-y1} r="0.3" fill="#ef4444"/>
            <circle cx={x2} cy={-y2} r="0.3" fill="#3b82f6"/>
            <line x1={x1} y1={-y1} x2={x2} y2={-y2} stroke="#059669" strokeWidth="0.3"/>
            <text x={x1} y={-y1 + 1} fontSize="1" fill="#ef4444" textAnchor="middle">({x1},{y1})</text>
            <text x={x2} y={-y2 + 1} fontSize="1" fill="#3b82f6" textAnchor="middle">({x2},{y2})</text>
          </svg>
        </div>
      )
    };
  };

  const generateTransformQuestion = (): GeometryQuestion => {
    const transformTypes = ['translation', 'rotation', 'reflection'];
    const transform = transformTypes[Math.floor(Math.random() * transformTypes.length)];
    
    const x = Math.floor(Math.random() * 6) + 1;
    const y = Math.floor(Math.random() * 6) + 1;
    
    switch (transform) {
      case 'translation':
        const dx = Math.floor(Math.random() * 6) + 1;
        const dy = Math.floor(Math.random() * 6) + 1;
        return {
          type: 'transform',
          shape: 'point',
          question: `If point (${x}, ${y}) is translated ${dx} units right and ${dy} units up, what is the x-coordinate of the new point?`,
          answer: x + dx,
          dimensions: { x, y, dx, dy },
          hint: 'Translation: new point = (x + dx, y + dy)',
          visual: (
            <div className="flex justify-center">
              <svg width="200" height="150" viewBox="0 0 20 15">
                <defs>
                  <pattern id="grid2" width="1" height="1" patternUnits="userSpaceOnUse">
                    <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#e5e7eb" strokeWidth="0.1"/>
                  </pattern>
                </defs>
                <rect x="0" y="0" width="20" height="15" fill="url(#grid2)" />
                <circle cx={x} cy={15-y} r="0.2" fill="#ef4444"/>
                <circle cx={x+dx} cy={15-y-dy} r="0.2" fill="#3b82f6"/>
                <line x1={x} y1={15-y} x2={x+dx} y2={15-y-dy} stroke="#059669" strokeWidth="0.1" strokeDasharray="0.2,0.2"/>
                <text x={x} y={15-y+0.8} fontSize="0.6" fill="#ef4444" textAnchor="middle">({x},{y})</text>
                <text x={x+dx} y={15-y-dy+0.8} fontSize="0.6" fill="#3b82f6" textAnchor="middle">({x+dx},{y+dy})</text>
              </svg>
            </div>
          )
        };
      
      default:
        return generateTransformQuestion();
    }
  };

  const generatePerimeterQuestion = (): GeometryQuestion => {
    const shapes = ['rectangle', 'triangle', 'circle'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    
    switch (shape) {
      case 'rectangle':
        const width = Math.floor(Math.random() * 8 * multiplier) + 2;
        const height = Math.floor(Math.random() * 8 * multiplier) + 2;
        return {
          type: 'perimeter',
          shape: 'rectangle',
          question: `What is the perimeter of a rectangle with width ${width} and height ${height}?`,
          answer: 2 * (width + height),
          dimensions: { width, height },
          hint: 'Perimeter of rectangle = 2 × (width + height)',
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-purple-500 bg-purple-100 flex items-center justify-center text-sm"
                style={{ width: Math.min(width * 25, 150), height: Math.min(height * 25, 100) }}
              >
                {width} × {height}
              </div>
            </div>
          )
        };
      
      case 'circle':
        const radius = Math.floor(Math.random() * 4 * multiplier) + 2;
        return {
          type: 'perimeter',
          shape: 'circle',
          question: `What is the circumference of a circle with radius ${radius}? (Use π ≈ 3.14)`,
          answer: Math.round(2 * Math.PI * radius * 100) / 100,
          dimensions: { radius },
          hint: 'Circumference = 2 × π × radius',
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-orange-500 bg-orange-100 rounded-full flex items-center justify-center text-sm"
                style={{ width: Math.min(radius * 50, 120), height: Math.min(radius * 50, 120) }}
              >
                r = {radius}
              </div>
            </div>
          )
        };
      
      default:
        const side = Math.floor(Math.random() * 6 * multiplier) + 3;
        return {
          type: 'perimeter',
          shape: 'square',
          question: `What is the perimeter of a square with side length ${side}?`,
          answer: 4 * side,
          dimensions: { side },
          hint: 'Perimeter of square = 4 × side',
          visual: (
            <div className="flex justify-center">
              <div 
                className="border-4 border-indigo-500 bg-indigo-100 flex items-center justify-center text-sm"
                style={{ width: Math.min(side * 30, 120), height: Math.min(side * 30, 120) }}
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
      hint: 'Sum of angles in a triangle = 180°',
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
    setHintsUsed(0);
    setCurrentQuestion(generateQuestion());
  };

  const useHint = () => {
    if (!currentQuestion || hintsUsed >= 2) return;
    
    setFeedback(`💡 Hint: ${currentQuestion.hint}`);
    setHintsUsed(hintsUsed + 1);
    
    setTimeout(() => setFeedback(''), 4000);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const userNum = parseFloat(userAnswer);
    const tolerance = 0.1; // Allow small rounding differences
    
    if (Math.abs(userNum - currentQuestion.answer) <= tolerance) {
      const basePoints = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40;
      const typeMultiplier = currentQuestion.type === 'volume' ? 1.5 : 
                            currentQuestion.type === 'coordinate' ? 1.3 : 
                            currentQuestion.type === 'transform' ? 1.2 : 1;
      const points = Math.floor(basePoints * typeMultiplier * (streak + 1));
      
      setScore(score + points);
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

  const getQuestionTypeDisplay = () => {
    const displays = {
      area: '📐 Area',
      perimeter: '📏 Perimeter',
      angle: '📐 Angles',
      volume: '📦 Volume',
      coordinate: '📍 Coordinates',
      transform: '🔄 Transformations'
    };
    return displays[questionType];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Geometry Challenge</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Geometry Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>Area:</strong> Calculate area of shapes</p>
                <p><strong>Perimeter:</strong> Find perimeter/circumference</p>
                <p><strong>Angles:</strong> Calculate missing angles</p>
                <p><strong>Volume:</strong> Find volume of 3D shapes</p>
                <p><strong>Coordinates:</strong> Work with coordinate geometry</p>
                <p><strong>Transformations:</strong> Calculate after transformations</p>
                <p>💡 Use hints for formulas (max 2 per game)</p>
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
                <label className="block text-sm font-medium mb-1">Question Type</label>
                <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area">📐 Area</SelectItem>
                    <SelectItem value="perimeter">📏 Perimeter</SelectItem>
                    <SelectItem value="angle">📐 Angles</SelectItem>
                    <SelectItem value="volume">📦 Volume</SelectItem>
                    <SelectItem value="coordinate">📍 Coordinates</SelectItem>
                    <SelectItem value="transform">🔄 Transformations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <p className="text-sm text-gray-600">
                  Type: {getQuestionTypeDisplay()} | Difficulty: {difficulty.toUpperCase()}
                </p>
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
                
                <div className="text-sm text-gray-500">
                  Type: {getQuestionTypeDisplay()} | Difficulty: {difficulty.toUpperCase()}
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
                <h3 className="text-2xl font-bold text-blue-600">Challenge Complete!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Questions Answered: {questionsAnswered}/10</p>
                <div className="text-sm text-gray-600">
                  Performance: {streak >= 8 ? '🏆 Geometry Master!' : streak >= 5 ? '⭐ Excellent!' : '👍 Keep Learning!'}
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
