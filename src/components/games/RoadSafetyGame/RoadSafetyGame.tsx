
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface RoadSafetyGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'traffic-signs' | 'road-rules' | 'pedestrian' | 'emergency' | 'mixed';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  visual?: string;
  category: string;
}

export const RoadSafetyGame: React.FC<RoadSafetyGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('mixed');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const questions: Record<string, Question[]> = {
    'traffic-signs': [
      {
        id: 1,
        question: "What does a red traffic light mean?",
        options: ["Go", "Stop", "Slow down", "Turn left"],
        correct: 1,
        explanation: "Red means stop completely and wait for green. Never enter intersection on red.",
        visual: "🔴",
        category: "Traffic Signals"
      },
      {
        id: 2,
        question: "What does a yellow traffic light mean?",
        options: ["Speed up", "Stop if safe to do so", "Turn only", "Go faster"],
        correct: 1,
        explanation: "Yellow means prepare to stop. Only proceed if you cannot stop safely.",
        visual: "🟡",
        category: "Traffic Signals"
      },
      {
        id: 3,
        question: "What does a STOP sign require you to do?",
        options: ["Slow down", "Come to complete stop", "Yield", "Sound horn"],
        correct: 1,
        explanation: "STOP signs require a complete stop at the stop line or intersection.",
        visual: "🛑",
        category: "Road Signs"
      }
    ],
    'road-rules': [
      {
        id: 4,
        question: "When should you wear a seatbelt?",
        options: ["Only on highways", "Always in a vehicle", "Only when driving", "Only at night"],
        correct: 1,
        explanation: "Seatbelts should always be worn by all passengers for maximum safety.",
        visual: "🔒",
        category: "Vehicle Safety"
      },
      {
        id: 5,
        question: "What is the proper following distance?",
        options: ["1 second", "2 seconds", "3 seconds", "5 seconds"],
        correct: 2,
        explanation: "The 3-second rule provides safe following distance in normal conditions.",
        visual: "🚗↔️🚗",
        category: "Driving Rules"
      }
    ],
    'pedestrian': [
      {
        id: 6,
        question: "Where should pedestrians cross the street?",
        options: ["Anywhere", "At crosswalks", "Between cars", "In parking lots"],
        correct: 1,
        explanation: "Always use designated crosswalks for maximum visibility and safety.",
        visual: "🚶‍♂️🏁",
        category: "Pedestrian Safety"
      },
      {
        id: 7,
        question: "Before crossing, pedestrians should:",
        options: ["Run quickly", "Look both ways", "Use phone", "Look down"],
        correct: 1,
        explanation: "Always look left, right, then left again before crossing any street.",
        visual: "👀↔️",
        category: "Pedestrian Safety"
      }
    ]
  };

  const generateQuestion = () => {
    let availableQuestions: Question[] = [];
    
    if (gameMode === 'mixed') {
      availableQuestions = Object.values(questions).flat();
    } else {
      availableQuestions = questions[gameMode] || [];
    }
    
    if (availableQuestions.length === 0) {
      availableQuestions = Object.values(questions).flat();
    }
    
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setSelectedAnswer(null);
    setFeedback('');
    setShowExplanation(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    generateQuestion();
  };

  const checkAnswer = () => {
    if (!currentQuestion || selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    if (isCorrect) {
      const points = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
      setScore(score + points);
      setFeedback('🎉 Correct! Great job staying safe!');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setFeedback(`❌ Incorrect. The right answer is: ${currentQuestion.options[currentQuestion.correct]}`);
    }
    
    setShowExplanation(true);
    
    setTimeout(() => {
      setRound(round + 1);
      if (round < 15) {
        generateQuestion();
      } else {
        setGameStarted(false);
        setFeedback(`🏆 Course Complete! Final Score: ${score} points`);
      }
    }, 4000);
  };

  const renderTrafficScene = () => {
    if (!currentQuestion) return null;
    
    return (
      <div className="bg-gray-100 p-6 rounded-lg mb-6 animate-fade-in">
        <div className="text-center">
          <div className="text-6xl mb-4">{currentQuestion.visual}</div>
          <div className="bg-gray-300 h-4 rounded-full relative mb-4">
            <div className="bg-yellow-400 h-2 w-full absolute top-1 rounded-full"></div>
          </div>
          <div className="flex justify-center gap-4">
            <div className="text-2xl">🚗</div>
            <div className="text-2xl">🚙</div>
            <div className="text-2xl">🚚</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Traffic Scenario Visualization</p>
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
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-red-400 via-yellow-500 to-green-500">
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
          <h1 className="text-4xl font-bold text-white">🚦 Road Safety Academy</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Road Safety Education</DialogTitle>
                <DialogDescription>Learn essential traffic rules and safety practices</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🚦 Why Road Safety Matters</h3>
                  <p>Road safety education saves lives! Understanding traffic rules, signs, and safe practices protects you and others on the road.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">📚 Key Learning Areas</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Traffic Signs:</strong> Understanding warning, regulatory, and guide signs</li>
                    <li><strong>Road Rules:</strong> Speed limits, right of way, and driving etiquette</li>
                    <li><strong>Pedestrian Safety:</strong> Safe crossing and walking practices</li>
                    <li><strong>Emergency Procedures:</strong> What to do in dangerous situations</li>
                  </ul>
                </div>
                <div className="bg-red-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">🛡️ Safety First Rules:</h4>
                  <p>• Always wear seatbelts<br/>
                     • Follow traffic signals<br/>
                     • Stay alert and avoid distractions<br/>
                     • Respect other road users<br/>
                     • Know emergency procedures</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-green-400 via-yellow-500 to-red-500 text-white text-6xl font-bold p-8 rounded-full animate-bounce">
              🚦 Safe Driver! 🚦
            </div>
          </div>
        )}

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Road Safety Academy Settings</CardTitle>
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
                      <SelectItem value="easy">Easy (Basic signs)</SelectItem>
                      <SelectItem value="medium">Medium (Common rules)</SelectItem>
                      <SelectItem value="hard">Hard (Complex scenarios)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Learning Module</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traffic-signs">Traffic Signs</SelectItem>
                      <SelectItem value="road-rules">Road Rules</SelectItem>
                      <SelectItem value="pedestrian">Pedestrian Safety</SelectItem>
                      <SelectItem value="emergency">Emergency Procedures</SelectItem>
                      <SelectItem value="mixed">Comprehensive Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  Start Safety Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                Question {round}/15 - Score: {score} points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQuestion && (
                <div className="text-center">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm font-bold text-blue-800">{currentQuestion.category}</p>
                  </div>
                  
                  {renderTrafficScene()}
                  
                  <p className="text-xl font-bold mb-6">{currentQuestion.question}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`p-4 h-auto text-left ${
                          selectedAnswer === index 
                            ? 'bg-blue-200 border-blue-400' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedAnswer(index)}
                        disabled={!!feedback}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={checkAnswer}
                    disabled={selectedAnswer === null || !!feedback}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Submit Answer
                  </Button>
                  
                  {showExplanation && (
                    <div className="bg-yellow-50 p-6 rounded-lg mt-6 animate-fade-in">
                      <h4 className="font-bold mb-2">💡 Safety Explanation:</h4>
                      <p>{currentQuestion.explanation}</p>
                      {currentQuestion.category === "Traffic Signals" && (
                        <div className="mt-4 p-4 bg-blue-100 rounded">
                          <p className="text-sm"><strong>Remember:</strong> Traffic lights control traffic flow and prevent accidents. Always obey them!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {feedback && (
                <div className={`text-center p-4 rounded-lg animate-bounce ${
                  feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 
                  feedback.includes('Course Complete') ? 'bg-blue-100 text-blue-800' :
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
