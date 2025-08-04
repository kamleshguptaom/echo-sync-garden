import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Eye, Zap, Target } from 'lucide-react';

interface SpeedReadingProps {
  onBack: () => void;
}

interface ReadingText {
  title: string;
  content: string;
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

export const SpeedReading: React.FC<SpeedReadingProps> = ({ onBack }) => {
  const [currentText, setCurrentText] = useState<ReadingText | null>(null);
  const [wordsPerMinute, setWordsPerMinute] = useState(250);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const texts: ReadingText[] = [
    {
      title: "The Amazing Octopus",
      content: "The octopus is one of the most intelligent invertebrates on Earth. These fascinating creatures have eight arms, three hearts, and blue blood. They can change color instantly to blend with their surroundings, making them masters of camouflage. Octopuses are problem solvers and have been observed using tools to hunt and protect themselves. They can squeeze through any opening larger than their beak, which is the only hard part of their body. In the wild, octopuses live solitary lives and are known for their complex behaviors and learning abilities.",
      questions: [
        {
          question: "How many hearts does an octopus have?",
          options: ["Two", "Three", "Four", "Five"],
          correct: 1
        },
        {
          question: "What color is octopus blood?",
          options: ["Red", "Blue", "Green", "Purple"],
          correct: 1
        },
        {
          question: "What is the only hard part of an octopus's body?",
          options: ["Brain", "Eyes", "Beak", "Arms"],
          correct: 2
        }
      ]
    },
    {
      title: "The Water Cycle",
      content: "The water cycle is the continuous movement of water on, above, and below the surface of Earth. Water evaporates from oceans, lakes, and rivers due to heat from the sun. This water vapor rises into the atmosphere where it cools and condenses into tiny droplets, forming clouds. When these droplets become too heavy, they fall back to Earth as precipitation in the form of rain, snow, or hail. Some of this water flows into rivers and streams, eventually returning to the ocean. Other water seeps into the ground, becoming groundwater that plants and animals depend on for survival.",
      questions: [
        {
          question: "What causes water to evaporate?",
          options: ["Wind", "Cold", "Heat from the sun", "Gravity"],
          correct: 2
        },
        {
          question: "What forms when water vapor condenses in the atmosphere?",
          options: ["Rain", "Clouds", "Snow", "Rivers"],
          correct: 1
        },
        {
          question: "What is water that seeps into the ground called?",
          options: ["Surface water", "Groundwater", "Ocean water", "River water"],
          correct: 1
        }
      ]
    }
  ];

  const words = currentText ? currentText.content.split(' ') : [];

  const startReading = useCallback(() => {
    if (!currentText) {
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setCurrentText(randomText);
      setTotalQuestions(randomText.questions.length);
    }
    setCurrentWordIndex(0);
    setIsReading(true);
    setReadingComplete(false);
    setShowQuestions(false);
    setTimeElapsed(0);
  }, [currentText, texts]);

  const pauseReading = () => {
    setIsReading(false);
  };

  const resetReading = () => {
    setCurrentWordIndex(0);
    setIsReading(false);
    setReadingComplete(false);
    setShowQuestions(false);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setTimeElapsed(0);
  };

  // Reading timer
  useEffect(() => {
    if (isReading && currentWordIndex < words.length) {
      const interval = 60000 / wordsPerMinute; // milliseconds per word
      const timer = setTimeout(() => {
        setCurrentWordIndex(prev => {
          if (prev + 1 >= words.length) {
            setIsReading(false);
            setReadingComplete(true);
            return prev;
          }
          return prev + 1;
        });
      }, interval);

      return () => clearTimeout(timer);
    }
  }, [isReading, currentWordIndex, words.length, wordsPerMinute]);

  // Time elapsed counter
  useEffect(() => {
    if (isReading) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isReading]);

  const handleQuestionAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentText) return;

    const isCorrect = selectedAnswer === currentText.questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion + 1 < currentText.questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      setShowQuestions(false);
    }
  };

  const startQuiz = () => {
    setShowQuestions(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const getReadingSpeed = () => {
    if (timeElapsed === 0) return 0;
    return Math.round((currentWordIndex / timeElapsed) * 60);
  };

  const getComprehensionScore = () => {
    if (totalQuestions === 0) return 0;
    return Math.round((score / totalQuestions) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90 hover:bg-white">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-white">⚡ Speed Reading Training</h1>
        </div>

        <div className="grid gap-6">
          {/* Controls */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Reading Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <label className="block text-sm font-medium mb-2">
                    Words Per Minute: {wordsPerMinute}
                  </label>
                  <Slider
                    value={[wordsPerMinute]}
                    onValueChange={(value) => setWordsPerMinute(value[0])}
                    min={100}
                    max={1000}
                    step={25}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={startReading} disabled={isReading} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start
                  </Button>
                  <Button onClick={pauseReading} disabled={!isReading} variant="outline">
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                  <Button onClick={resetReading} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getReadingSpeed()}</div>
                  <div className="text-sm text-blue-800">WPM</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{currentWordIndex}</div>
                  <div className="text-sm text-green-800">Words Read</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{timeElapsed}s</div>
                  <div className="text-sm text-purple-800">Time</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{getComprehensionScore()}%</div>
                  <div className="text-sm text-orange-800">Comprehension</div>
                </div>
              </div>

              {words.length > 0 && (
                <Progress 
                  value={(currentWordIndex / words.length) * 100} 
                  className="w-full"
                />
              )}
            </CardContent>
          </Card>

          {/* Reading Area */}
          {currentText && !showQuestions && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">{currentText.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center min-h-32 flex items-center justify-center">
                  {isReading || readingComplete ? (
                    <div className="space-y-4">
                      <div className="text-4xl font-bold p-8 bg-yellow-100 rounded-lg border-2 border-yellow-300 animate-pulse">
                        {words[currentWordIndex] || 'Complete!'}
                      </div>
                      {readingComplete && (
                        <div className="space-y-4">
                          <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                            Reading Complete! 🎉
                          </Badge>
                          <Button onClick={startQuiz} className="bg-blue-500 hover:bg-blue-600">
                            Take Comprehension Quiz
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                      {currentText.content}
                      <div className="mt-4">
                        <Badge variant="secondary">Click Start to begin speed reading</Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quiz Section */}
          {showQuestions && currentText && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Comprehension Quiz ({currentQuestion + 1}/{currentText.questions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-lg font-medium">
                  {currentText.questions[currentQuestion].question}
                </div>
                
                <div className="grid gap-3">
                  {currentText.questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      onClick={() => handleQuestionAnswer(index)}
                      className="text-left justify-start p-4 h-auto"
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Score: {score}/{totalQuestions}
                  </div>
                  <Button 
                    onClick={submitAnswer} 
                    disabled={selectedAnswer === null}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {currentQuestion + 1 === currentText.questions.length ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                How to Use Speed Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Adjust your reading speed using the slider</p>
              <p>• Focus on the highlighted word in the center</p>
              <p>• Try not to move your eyes or subvocalize</p>
              <p>• After reading, test your comprehension with the quiz</p>
              <p>• Gradually increase speed while maintaining understanding</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};