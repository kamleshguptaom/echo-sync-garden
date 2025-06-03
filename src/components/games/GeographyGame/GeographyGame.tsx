
import React, { useState, useEffect } from 'react';
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
  animation?: string;
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
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [showConcept, setShowConcept] = useState(false);

  // Real-time updates when settings change
  useEffect(() => {
    if (gameStarted && currentQuestion) {
      generateNewQuestion();
    }
  }, [questionType, difficulty]);

  const questionBank = {
    capitals: {
      easy: [
        {
          question: "What is the capital of France?",
          answer: "Paris",
          hint: "City of Light, famous for the Eiffel Tower",
          concept: "Paris has been France's capital since 987 AD and is a global center for art, fashion, and culture.",
          isMultiple: true,
          options: ["Paris", "Lyon", "Marseille", "Nice"],
          animation: "🇫🇷 → 🗼 Paris (Eiffel Tower city)"
        },
        {
          question: "What is the capital of Japan?",
          answer: "Tokyo",
          hint: "Formerly called Edo, home to the Emperor",
          concept: "Tokyo became Japan's capital in 1868, replacing Kyoto.",
          isMultiple: true,
          options: ["Tokyo", "Osaka", "Kyoto", "Yokohama"],
          animation: "🇯🇵 → 🏯 Tokyo (Former Edo)"
        },
        {
          question: "What is the capital of Brazil?",
          answer: "Brasília",
          hint: "Planned city built in the 1950s, not Rio or São Paulo",
          concept: "Brasília was built as a planned capital to promote development in Brazil's interior.",
          isMultiple: true,
          options: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
          animation: "🇧🇷 → 🏗️ Brasília (Planned capital)"
        },
        {
          question: "What is the capital of Egypt?",
          answer: "Cairo",
          hint: "Ancient city near the pyramids",
          concept: "Cairo is one of the largest cities in Africa and the Arab world.",
          isMultiple: true,
          options: ["Cairo", "Alexandria", "Luxor", "Aswan"],
          animation: "🇪🇬 → 🏺 Cairo (City of pyramids)"
        }
      ],
      medium: [
        {
          question: "What is the capital of Australia?",
          answer: "Canberra",
          hint: "Not Sydney or Melbourne, but a planned city",
          concept: "Canberra was specifically designed as Australia's capital in 1913 to resolve rivalry between Sydney and Melbourne.",
          isMultiple: true,
          options: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
          animation: "🇦🇺 → 🏛️ Canberra (Compromise capital)"
        },
        {
          question: "What is the capital of Switzerland?",
          answer: "Bern",
          hint: "Not Zurich or Geneva, but the de facto capital",
          concept: "Bern is the de facto capital of Switzerland, though the country has no official capital.",
          isMultiple: true,
          options: ["Bern", "Zurich", "Geneva", "Basel"],
          animation: "🇨🇭 → 🐻 Bern (Bear city)"
        }
      ],
      hard: [
        {
          question: "What is the capital of Kazakhstan?",
          answer: "Nur-Sultan",
          hint: "Formerly known as Astana, renamed in 2019",
          concept: "The capital was moved from Almaty to this planned city in 1997.",
          isMultiple: false,
          animation: "🇰🇿 → 🏗️ Nur-Sultan (New planned capital)"
        },
        {
          question: "What is the capital of Myanmar?",
          answer: "Naypyidaw",
          hint: "New capital city built in the 2000s, not Yangon",
          concept: "Myanmar moved its capital from Yangon to Naypyidaw in 2006.",
          isMultiple: false,
          animation: "🇲🇲 → 🏛️ Naypyidaw (New capital)"
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
          options: ["Italy", "Spain", "Greece", "Portugal"],
          animation: "🇮🇹 → 👢 Italy (Boot-shaped peninsula)"
        },
        {
          question: "Which country has the maple leaf on its flag?",
          answer: "Canada",
          hint: "North American country known for maple syrup",
          concept: "The maple leaf is a symbol of Canada and appears prominently on their flag.",
          isMultiple: true,
          options: ["Canada", "USA", "Mexico", "Greenland"],
          animation: "🇨🇦 → 🍁 Canada (Maple leaf country)"
        }
      ],
      medium: [
        {
          question: "Which country has the most time zones?",
          answer: "Russia",
          hint: "The largest country by land area",
          concept: "Russia spans 11 time zones due to its vast territory stretching from Eastern Europe to the Pacific Ocean.",
          isMultiple: true,
          options: ["Russia", "USA", "China", "Canada"],
          animation: "🇷🇺 → 🌍🕐🕑🕒... Russia (11 time zones)"
        },
        {
          question: "Which country is known as the Land of the Rising Sun?",
          answer: "Japan",
          hint: "Island nation in East Asia",
          concept: "Japan is called the Land of the Rising Sun because of its position east of Asia.",
          isMultiple: true,
          options: ["Japan", "China", "South Korea", "Philippines"],
          animation: "🇯🇵 → 🌅 Japan (Rising sun)"
        }
      ],
      hard: [
        {
          question: "Which country is completely surrounded by South Africa?",
          answer: "Lesotho",
          hint: "A mountainous kingdom in southern Africa",
          concept: "Lesotho is one of only three countries completely surrounded by another country (enclaves).",
          isMultiple: false,
          animation: "🇿🇦 → ⭕ → 🇱🇸 Lesotho (Enclave in South Africa)"
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
          options: ["Peru", "Bolivia", "Ecuador", "Colombia"],
          animation: "🇵🇪 → ⛰️ Machu Picchu (Inca ruins)"
        },
        {
          question: "Where is the Statue of Liberty located?",
          answer: "New York",
          hint: "Harbor of America's largest city",
          concept: "The Statue of Liberty stands on Liberty Island in New York Harbor as a symbol of freedom.",
          isMultiple: true,
          options: ["New York", "Boston", "Philadelphia", "Washington DC"],
          animation: "🇺🇸 → 🗽 New York (Liberty Island)"
        }
      ],
      medium: [
        {
          question: "Which landmark is located on the border of Brazil and Argentina?",
          answer: "Iguazu Falls",
          hint: "One of the world's largest waterfall systems",
          concept: "Iguazu Falls consists of 275 individual waterfalls along the Iguazu River.",
          isMultiple: true,
          options: ["Iguazu Falls", "Angel Falls", "Victoria Falls", "Niagara Falls"],
          animation: "🇧🇷🇦🇷 → 💦 Iguazu Falls (Border falls)"
        }
      ],
      hard: [
        {
          question: "What ancient city is carved into rose-red cliffs in Jordan?",
          answer: "Petra",
          hint: "Also known as the Rose City",
          concept: "Petra was the capital of the Nabataean Kingdom and is famous for its rock-cut architecture.",
          isMultiple: false,
          animation: "🇯🇴 → 🏛️ Petra (Rose city in stone)"
        }
      ]
    },
    rivers: {
      easy: [
        {
          question: "What is the longest river in the world?",
          answer: "Nile",
          hint: "Flows through Egypt",
          concept: "The Nile River is about 6,650 kilometers long and flows through 11 countries in northeastern Africa.",
          isMultiple: true,
          options: ["Nile", "Amazon", "Mississippi", "Yangtze"],
          animation: "🇪🇬🇸🇩 → 🌊 Nile (Egypt's lifeline)"
        },
        {
          question: "Which river flows through London?",
          answer: "Thames",
          hint: "Famous river with many bridges",
          concept: "The River Thames is 346 kilometers long and has been central to London's development.",
          isMultiple: true,
          options: ["Thames", "Seine", "Danube", "Rhine"],
          animation: "🇬🇧 → 🌉 Thames (London's river)"
        }
      ],
      medium: [
        {
          question: "Which river forms part of the border between the US and Mexico?",
          answer: "Rio Grande",
          hint: "Spanish name meaning 'Big River'",
          concept: "The Rio Grande forms a natural boundary between the US and Mexico for 1,885 kilometers.",
          isMultiple: true,
          options: ["Rio Grande", "Colorado", "Mississippi", "St. Lawrence"],
          animation: "🇺🇸🇲🇽 → 🚣 Rio Grande (Border river)"
        }
      ],
      hard: [
        {
          question: "Which river is considered sacred in Hinduism?",
          answer: "Ganges",
          hint: "Flows through India's populous northern plains",
          concept: "The Ganges is worshipped as the goddess Ganga in Hinduism and is central to many religious practices.",
          isMultiple: false,
          animation: "🇮🇳 → 🙏 Ganges (Sacred river)"
        }
      ]
    },
    mountains: {
      easy: [
        {
          question: "What is the tallest mountain in the world?",
          answer: "Mount Everest",
          hint: "Located in the Himalayas",
          concept: "Mount Everest reaches 8,848.86 meters (29,031.7 ft) above sea level.",
          isMultiple: true,
          options: ["Mount Everest", "K2", "Kilimanjaro", "Mont Blanc"],
          animation: "🇳🇵🇨🇳 → 🏔️ Everest (Tallest peak)"
        },
        {
          question: "Which mountain range runs through the western United States?",
          answer: "Rocky Mountains",
          hint: "Extends from Canada to New Mexico",
          concept: "The Rocky Mountains stretch more than 3,000 kilometers and form part of the North American Cordillera.",
          isMultiple: true,
          options: ["Rocky Mountains", "Appalachian", "Sierra Nevada", "Cascade Range"],
          animation: "🇺🇸 → ⛰️⛰️⛰️ Rockies (Western mountains)"
        }
      ],
      medium: [
        {
          question: "Which is the highest mountain in Africa?",
          answer: "Mount Kilimanjaro",
          hint: "Located in Tanzania, a dormant volcano",
          concept: "Mount Kilimanjaro is a dormant volcano with three cones: Kibo, Mawenzi, and Shira.",
          isMultiple: true,
          options: ["Mount Kilimanjaro", "Mount Kenya", "Atlas Mountains", "Mount Meru"],
          animation: "🇹🇿 → 🏔️ Kilimanjaro (Africa's peak)"
        }
      ],
      hard: [
        {
          question: "Which mountain is known as the 'Savage Mountain' due to its difficulty?",
          answer: "K2",
          hint: "The second-highest mountain in the world",
          concept: "K2 has one of the highest fatality rates among the world's highest mountains.",
          isMultiple: false,
          animation: "🇵🇰🇨🇳 → 🏔️☠️ K2 (Deadly mountain)"
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

  const generateNewQuestion = () => {
    setCurrentQuestion(generateQuestion());
    setUserAnswer('');
    setSelectedAnswer(null);
    setFeedback('');
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setFeedback('');
    setHintsUsed(0);
    setSkipsUsed(0);
    setUserAnswer('');
    setSelectedAnswer(null);
    setCurrentQuestion(generateQuestion());
  };

  const useHint = () => {
    if (!currentQuestion) return;
    
    const hints = [
      `💡 Hint: ${currentQuestion.hint}`,
      `💡 Category: ${currentQuestion.category}`,
      `💡 Visual: ${currentQuestion.animation || 'Think about the region or continent'}`
    ];
    
    const hintIndex = hintsUsed % hints.length;
    setFeedback(hints[hintIndex]);
    setHintsUsed(hintsUsed + 1);
    
    setTimeout(() => setFeedback(''), 4000);
  };

  const skipQuestion = () => {
    if (skipsUsed >= 2) return;
    
    setSkipsUsed(skipsUsed + 1);
    setStreak(0);
    setQuestionsAnswered(questionsAnswered + 1);
    
    if (questionsAnswered < 9) {
      generateNewQuestion();
    } else {
      setGameStarted(false);
      setCurrentQuestion(null);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(null);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setFeedback('');
    setUserAnswer('');
    setSelectedAnswer(null);
    setHintsUsed(0);
    setSkipsUsed(0);
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
        generateNewQuestion();
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
                <p>3. Use hints if you need help (unlimited hints available)</p>
                <p>4. Skip difficult questions (max 2 per game)</p>
                <p>5. Learn concepts to understand geographic principles</p>
                <p>6. Build streaks for bonus points!</p>
                <p>7. Settings update in real-time during gameplay</p>
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
                
                <div className="flex justify-center gap-2 flex-wrap">
                  <Button 
                    onClick={checkAnswer} 
                    disabled={currentQuestion.isMultiple ? selectedAnswer === null : !userAnswer.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Submit
                  </Button>
                  
                  <Button 
                    onClick={useHint} 
                    variant="outline"
                    className="bg-yellow-100 hover:bg-yellow-200"
                  >
                    💡 Hint ({hintsUsed})
                  </Button>
                  
                  <Button 
                    onClick={skipQuestion} 
                    disabled={skipsUsed >= 2}
                    variant="outline"
                    className="bg-orange-100 hover:bg-orange-200"
                  >
                    ⏭️ Skip ({skipsUsed}/2)
                  </Button>
                  
                  <Button 
                    onClick={resetGame}
                    variant="outline"
                    className="bg-red-100 hover:bg-red-200"
                  >
                    🔄 Reset
                  </Button>
                  
                  <Dialog open={showConcept} onOpenChange={setShowConcept}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-green-100 hover:bg-green-200">
                        📚 Concept
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{currentQuestion.category} Concepts</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm">{geographyConcepts[currentQuestion.type as keyof typeof geographyConcepts]}</p>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">About this question:</h4>
                          <p className="text-sm text-green-700 mb-3">{currentQuestion.concept}</p>
                          {currentQuestion.animation && (
                            <div className="bg-white p-3 rounded border-2 border-green-200">
                              <h5 className="font-medium text-green-800 mb-2">Visual Guide:</h5>
                              <p className="text-lg font-mono text-center animate-pulse">{currentQuestion.animation}</p>
                            </div>
                          )}
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
