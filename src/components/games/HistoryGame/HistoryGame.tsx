
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HistoryGameProps {
  onBack: () => void;
}

type Era = 'ancient' | 'medieval' | 'modern' | 'contemporary' | 'random';
type QuestionType = 'multiple-choice' | 'true-false' | 'timeline' | 'random';

interface Question {
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  concept: string;
  animation: string;
}

export const HistoryGame: React.FC<HistoryGameProps> = ({ onBack }) => {
  const [era, setEra] = useState<Era>('ancient');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');

  const questions = {
    ancient: {
      'multiple-choice': [
        {
          question: "Which ancient wonder of the world was located in Alexandria?",
          options: ["Hanging Gardens", "Lighthouse of Alexandria", "Colossus of Rhodes", "Temple of Artemis"],
          correctAnswer: "Lighthouse of Alexandria",
          explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World and guided ships safely into the harbor.",
          concept: "Ancient Wonders were remarkable constructions that showcased human engineering achievements.",
          animation: "🏛️ Ancient structures were marvels of engineering and artistry! 🌟"
        },
        {
          question: "Who was the first emperor of Rome?",
          options: ["Julius Caesar", "Augustus", "Nero", "Marcus Aurelius"],
          correctAnswer: "Augustus",
          explanation: "Augustus (originally Octavian) became the first Roman Emperor in 27 BCE after the fall of the Roman Republic.",
          concept: "The Roman Empire marked the transition from republic to imperial rule.",
          animation: "👑 Augustus transformed Rome from republic to empire! ⚡"
        }
      ],
      'true-false': [
        {
          question: "The Great Wall of China was built in a single dynasty.",
          correctAnswer: "False",
          explanation: "The Great Wall was built over many dynasties, with major construction during the Ming Dynasty.",
          concept: "Historical monuments often span multiple time periods and rulers.",
          animation: "🏯 The Great Wall grew over centuries! 🔨"
        }
      ]
    },
    medieval: {
      'multiple-choice': [
        {
          question: "Which event marked the beginning of the Middle Ages?",
          options: ["Fall of Rome", "Black Death", "Crusades", "Norman Conquest"],
          correctAnswer: "Fall of Rome",
          explanation: "The fall of the Western Roman Empire in 476 CE is traditionally considered the start of the Middle Ages.",
          concept: "Historical periods are defined by major political and social changes.",
          animation: "🏰 Medieval times began with Rome's fall! ⚔️"
        }
      ]
    },
    modern: {
      'multiple-choice': [
        {
          question: "Which revolution began in 1789?",
          options: ["American Revolution", "French Revolution", "Industrial Revolution", "Russian Revolution"],
          correctAnswer: "French Revolution",
          explanation: "The French Revolution began in 1789 and led to major changes in French society and government.",
          concept: "Revolutions reshape societies and political systems.",
          animation: "🇫🇷 The French Revolution changed the world! 💥"
        }
      ]
    },
    contemporary: {
      'multiple-choice': [
        {
          question: "Which war was known as 'The Great War'?",
          options: ["World War I", "World War II", "Vietnam War", "Korean War"],
          correctAnswer: "World War I",
          explanation: "World War I (1914-1918) was originally called 'The Great War' due to its unprecedented scale.",
          concept: "Global conflicts have shaped modern international relations.",
          animation: "🌍 WWI changed the global landscape forever! 💔"
        }
      ]
    }
  };

  const generateQuestion = () => {
    const actualEra = era === 'random' ? 
      (['ancient', 'medieval', 'modern', 'contemporary'] as const)[Math.floor(Math.random() * 4)] : 
      era;
    
    const actualType = questionType === 'random' ? 
      (['multiple-choice', 'true-false'] as const)[Math.floor(Math.random() * 2)] : 
      questionType === 'timeline' ? 'multiple-choice' : questionType;

    const eraQuestions = questions[actualEra];
    const typeQuestions = eraQuestions[actualType] || eraQuestions['multiple-choice'];
    
    if (typeQuestions && typeQuestions.length > 0) {
      const randomQuestion = typeQuestions[Math.floor(Math.random() * typeQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setCurrentHint('');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setQuestionsAnswered(0);
    setShowResult(false);
    setHintsUsed(0);
    generateQuestion();
  };

  const submitAnswer = () => {
    if (!currentQuestion || !selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer.toString();
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setQuestionsAnswered(questionsAnswered + 1);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer('');
    setShowResult(false);
    setCurrentHint('');
    generateQuestion();
  };

  const useHint = () => {
    if (!currentQuestion || hintsUsed >= 3) return;
    
    if (currentQuestion.options) {
      // Remove one wrong answer
      const wrongAnswers = currentQuestion.options.filter(opt => opt !== currentQuestion.correctAnswer);
      const wrongToRemove = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
      setCurrentHint(`Hint: "${wrongToRemove}" is not the correct answer.`);
    } else {
      setCurrentHint("Hint: Think about the historical context and timeline.");
    }
    
    setHintsUsed(hintsUsed + 1);
  };

  const resetGame = () => {
    startGame();
  };

  // Real-time updates
  useEffect(() => {
    if (gameStarted && currentQuestion) {
      generateQuestion();
    }
  }, [era, questionType]);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">History Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-amber-500 text-white hover:bg-amber-600">
                🏛️ Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>History Learning Concepts</DialogTitle>
                <DialogDescription>Understanding historical thinking and analysis</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">📚 Historical Thinking</h3>
                  <p>History is about understanding cause and effect, change over time, and human experiences.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🕰️ Time Periods</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Ancient:</strong> Earliest civilizations to fall of Rome (3000 BCE - 500 CE)</li>
                    <li><strong>Medieval:</strong> Middle Ages (500 - 1500 CE)</li>
                    <li><strong>Modern:</strong> Renaissance to Industrial Revolution (1500 - 1900)</li>
                    <li><strong>Contemporary:</strong> 20th century to present</li>
                  </ul>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h3 className="font-bold text-lg">🔍 Historical Analysis</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Consider multiple perspectives</li>
                    <li>Examine primary and secondary sources</li>
                    <li>Understand context and causation</li>
                    <li>Connect past events to present day</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg animate-pulse">
                  <h4 className="font-bold">💡 Study Tip:</h4>
                  <p>Create timelines to visualize the sequence of historical events!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div>
                <label className="block text-sm font-medium mb-1">Era</label>
                <Select value={era} onValueChange={(value) => setEra(value as Era)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ancient">Ancient</SelectItem>
                    <SelectItem value="medieval">Medieval</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Question Type</label>
                <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={startGame} className="bg-amber-500 hover:bg-amber-600 mt-6">
                {gameStarted ? 'New Game' : 'Start Game'}
              </Button>

              {gameStarted && (
                <>
                  <Button onClick={resetGame} variant="outline" className="mt-6">
                    🔄 Reset
                  </Button>
                  <Button onClick={() => alert('Answer historical questions from different eras to test your knowledge!')} variant="outline" className="mt-6">
                    📋 Instructions
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {gameStarted && currentQuestion && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center flex-wrap gap-2">
                <div>Score: {score}/{questionsAnswered}</div>
                <div>Era: {era === 'random' ? '🎲 Random' : era}</div>
                <div>Hints: {hintsUsed}/3</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 animate-fade-in">{currentQuestion.question}</h3>
                
                {currentHint && (
                  <div className="bg-blue-100 p-3 rounded-lg mb-4 animate-scale-in">
                    <p className="text-blue-800">{currentHint}</p>
                  </div>
                )}

                {currentQuestion.options ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === option ? "default" : "outline"}
                        className="p-4 h-auto text-left justify-start animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => setSelectedAnswer(option)}
                        disabled={showResult}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-4 justify-center mb-6">
                    <Button
                      variant={selectedAnswer === 'True' ? "default" : "outline"}
                      onClick={() => setSelectedAnswer('True')}
                      disabled={showResult}
                      className="animate-fade-in"
                    >
                      ✅ True
                    </Button>
                    <Button
                      variant={selectedAnswer === 'False' ? "default" : "outline"}
                      onClick={() => setSelectedAnswer('False')}
                      disabled={showResult}
                      className="animate-fade-in"
                    >
                      ❌ False
                    </Button>
                  </div>
                )}

                <div className="flex gap-2 justify-center flex-wrap">
                  <Button 
                    onClick={submitAnswer} 
                    disabled={!selectedAnswer || showResult}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Submit Answer
                  </Button>
                  <Button 
                    onClick={useHint} 
                    disabled={hintsUsed >= 3 || showResult} 
                    variant="outline"
                  >
                    💡 Hint ({hintsUsed}/3)
                  </Button>
                </div>

                {showResult && (
                  <div className={`mt-6 p-6 rounded-lg animate-scale-in ${
                    selectedAnswer === currentQuestion.correctAnswer.toString() ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <h4 className={`text-xl font-bold mb-2 ${
                      selectedAnswer === currentQuestion.correctAnswer.toString() ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {selectedAnswer === currentQuestion.correctAnswer.toString() ? '✅ Correct!' : '❌ Incorrect'}
                    </h4>
                    <p className="mb-2">
                      <strong>Correct Answer:</strong> {currentQuestion.correctAnswer}
                    </p>
                    <p className="mb-4">{currentQuestion.explanation}</p>
                    
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                      <h5 className="font-bold text-blue-800 mb-2">💡 Concept:</h5>
                      <p className="text-blue-700 mb-2">{currentQuestion.concept}</p>
                      <div className="text-2xl animate-bounce">{currentQuestion.animation}</div>
                    </div>
                    
                    <Button onClick={nextQuestion} className="mt-4 bg-blue-500 hover:bg-blue-600">
                      Next Question →
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
