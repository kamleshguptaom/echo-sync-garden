
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface GeographyGameProps {
  onBack: () => void;
}

type QuestionType = 'capitals' | 'countries' | 'landmarks' | 'rivers' | 'mountains' | 'random';
type Difficulty = 'easy' | 'medium' | 'hard';

interface GeographyQuestion {
  type: QuestionType;
  category: string;
  question: string;
  answer: string;
  hint: string;
  concept: string;
  options?: string[];
  isMultiple?: boolean;
}

const geographyConcepts = {
  capitals: "Capital cities are the primary administrative centers of countries or states, often housing government institutions.",
  countries: "Countries are distinct territorial entities with defined borders, governments, and sovereignty over their territory.",
  landmarks: "Landmarks are recognizable natural or artificial features that serve as navigation points or cultural symbols.",
  rivers: "Rivers are natural watercourses that flow from higher to lower elevations, often forming important geographic boundaries.",
  mountains: "Mountains are elevated landforms rising significantly above their surroundings, often formed by tectonic activity."
};

export const GeographyGame: React.FC<GeographyGameProps> = ({ onBack }) => {
  const [questionType, setQuestionType] = useState<QuestionType>('capitals');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<GeographyQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showConcept, setShowConcept] = useState(false);

  const questionBank = {
    capitals: {
      easy: [
        {
          question: "What is the capital of France?",
          answer: "Paris",
          hint: "City of Light, famous for the Eiffel Tower",
          concept: "Paris has been France's capital since 987 AD and is a global center for art, fashion, and culture.",
          isMultiple: true,
          options: ["Paris", "Lyon", "Marseille", "Nice"]
        },
        {
          question: "What is the capital of Japan?",
          answer: "Tokyo",
          hint: "Formerly called Edo, home to the Emperor",
          concept: "Tokyo became Japan's capital in 1868, replacing Kyoto.",
          isMultiple: true,
          options: ["Tokyo", "Osaka", "Kyoto", "Yokohama"]
        }
      ],
      medium: [
        {
          question: "What is the capital of Australia?",
          answer: "Canberra",
          hint: "Not Sydney or Melbourne, but a planned city",
          concept: "Canberra was specifically designed as Australia's capital in 1913 to resolve rivalry between Sydney and Melbourne.",
          isMultiple: true,
          options: ["Canberra", "Sydney", "Melbourne", "Brisbane"]
        }
      ],
      hard: [
        {
          question: "What is the capital of Kazakhstan?",
          answer: "Nur-Sultan",
          hint: "Formerly known as Astana, renamed in 2019",
          concept: "The capital was moved from Almaty to this planned city in 1997.",
          isMultiple: false
        }
      ]
    },
    countries: {
      easy: [
        {
          question: "Which country is shaped like a boot?",
          answer: "Italy",
          hint: "Famous for pizza and pasta",
          concept: "Italy's distinctive boot shape is formed by the Italian Peninsula extending into the Mediterranean Sea.",
          isMultiple: true,
          options: ["Italy", "Spain", "Greece", "Portugal"]
        }
      ],
      medium: [
        {
          question: "Which country has the most time zones?",
          answer: "Russia",
          hint: "The largest country by land area",
          concept: "Russia spans 11 time zones due to its vast territory stretching from Eastern Europe to the Pacific Ocean.",
          isMultiple: true,
          options: ["Russia", "USA", "China", "Canada"]
        }
      ],
      hard: [
        {
          question: "Which country is completely surrounded by South Africa?",
          answer: "Lesotho",
          hint: "A mountainous kingdom in southern Africa",
          concept: "Lesotho is one of only three countries completely surrounded by another country (enclaves).",
          isMultiple: false
        }
      ]
    },
    landmarks: {
      easy: [
        {
          question: "In which country would you find Machu Picchu?",
          answer: "Peru",
          hint: "Ancient Incan city high in the Andes",
          concept: "Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru.",
          isMultiple: true,
          options: ["Peru", "Bolivia", "Ecuador", "Colombia"]
        }
      ],
      medium: [
        {
          question: "Which landmark is located on the border of Brazil and Argentina?",
          answer: "Iguazu Falls",
          hint: "One of the world's largest waterfall systems",
          concept: "Iguazu Falls consists of 275 individual waterfalls along the Iguazu River.",
          isMultiple: true,
          options: ["Iguazu Falls", "Angel Falls", "Victoria Falls", "Niagara Falls"]
        }
      ],
      hard: [
        {
          question: "What ancient city is carved into rose-red cliffs in Jordan?",
          answer: "Petra",
          hint: "Also known as the Rose City",
          concept: "Petra was the capital of the Nabataean Kingdom and is famous for its rock-cut architecture.",
          isMultiple: false
        }
      ]
    }
  };

  const getRandomQuestionType = (): QuestionType => {
    const types: QuestionType[] = ['capitals', 'countries', 'landmarks', 'rivers', 'mountains'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const generateQuestion = (): GeographyQuestion => {
    const actualType = questionType === 'random' ? getRandomQuestionType() : questionType;
    const questions = questionBank[actualType as keyof typeof questionBank]?.[difficulty] || questionBank.capitals.easy;
    const questionData = questions[Math.floor(Math.random() * questions.length)];
    
    return {
      type: actualType,
      category: actualType.charAt(0).toUpperCase() + actualType.slice(1),
      ...questionData
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setFeedback('');
    setHintsUsed(0);
    setUserAnswer('');
    setSelectedAnswer(null);
    setCurrentQuestion(generateQuestion());
  };

  const useHint = () => {
    if (!currentQuestion || hintsUsed >= 3) return;
    
    setFeedback(`💡 Hint: ${currentQuestion.hint}`);
    setHintsUsed(hintsUsed + 1);
    
    setTimeout(() => setFeedback(''), 4000);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    let isCorrect = false;
    
    if (currentQuestion.isMultiple && selectedAnswer !== null) {
      isCorrect = currentQuestion.options![selectedAnswer] === currentQuestion.answer;
    } else {
      isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase();
    }
    
    if (isCorrect) {
      const basePoints = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40;
      const points = Math.floor(basePoints * (streak + 1));
      setScore(score + points);
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
    } else {
      setStreak(0);
      setFeedback(`Incorrect. The answer was: ${currentQuestion.answer}`);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
    setUserAnswer('');
    setSelectedAnswer(null);
    
    setTimeout(() => {
      if (questionsAnswered < 9) {
        setCurrentQuestion(generateQuestion());
        setFeedback('');
      } else {
        setGameStarted(false);
        setCurrentQuestion(null);
      }
    }, 2500);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🌍 Geography Challenge</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Geography Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>1. Choose your geography topic and difficulty level</p>
                <p>2. Answer questions about world geography</p>
                <p>3. Use hints if you need help (max 3 per game)</p>
                <p>4. Learn concepts to understand geographic principles</p>
                <p>5. Build streaks for bonus points!</p>
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
                <label className="block text-sm font-medium mb-1">Topic</label>
                <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="capitals">🏛️ Capitals</SelectItem>
                    <SelectItem value="countries">🌎 Countries</SelectItem>
                    <SelectItem value="landmarks">🗿 Landmarks</SelectItem>
                    <SelectItem value="rivers">🌊 Rivers</SelectItem>
                    <SelectItem value="mountains">⛰️ Mountains</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
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
                "Explore the World!"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!gameStarted ? (
              <div className="space-y-4">
                <p className="text-lg">Ready to test your geography knowledge?</p>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-xl px-8 py-3">
                  Start Journey
                </Button>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-6">
                <div className="text-sm text-green-600 font-medium">
                  {currentQuestion.category} | {difficulty.toUpperCase()}
                </div>
                
                <div className="text-xl font-semibold text-gray-800">
                  {currentQuestion.question}
                </div>
                
                {currentQuestion.isMultiple ? (
                  <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                    {currentQuestion.options!.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === index ? "default" : "outline"}
                        className={`p-4 text-left ${selectedAnswer === index ? 'bg-green-500 text-white' : ''}`}
                        onClick={() => setSelectedAnswer(index)}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    placeholder="Type your answer"
                    className="w-64 text-xl text-center mx-auto"
                    autoFocus
                  />
                )}
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Button 
                    onClick={checkAnswer} 
                    disabled={currentQuestion.isMultiple ? selectedAnswer === null : !userAnswer.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Submit
                  </Button>
                  
                  <Button 
                    onClick={useHint} 
                    disabled={hintsUsed >= 3}
                    variant="outline"
                    className="bg-yellow-100 hover:bg-yellow-200"
                  >
                    💡 Hint ({hintsUsed}/3)
                  </Button>
                  
                  <Dialog open={showConcept} onOpenChange={setShowConcept}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-green-100 hover:bg-green-200">
                        📚 Concept
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{currentQuestion.category} Concepts</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>{geographyConcepts[currentQuestion.type as keyof typeof geographyConcepts]}</p>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>About this question:</strong> {currentQuestion.concept}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {feedback && (
                  <div className={`text-xl font-bold ${feedback.includes('Correct') ? 'text-green-600' : feedback.includes('Hint') ? 'text-yellow-600' : 'text-red-600'} animate-bounce`}>
                    {feedback}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-green-600">Geography Journey Complete!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Questions Answered: {questionsAnswered}/10</p>
                <div className="text-sm text-gray-600">
                  Performance: {score >= 300 ? '🏆 Geography Master!' : score >= 150 ? '⭐ World Explorer!' : '👍 Keep Exploring!'}
                </div>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  New Journey
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
