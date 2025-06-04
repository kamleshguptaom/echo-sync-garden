
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
  visualExample: string;
  relatedTopics: { title: string; url: string }[];
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
          question: "Which civilization built the magnificent pyramids of Giza?",
          options: ["Mesopotamians", "Egyptians", "Greeks", "Romans"],
          correctAnswer: "Egyptians",
          explanation: "The ancient Egyptians built the pyramids around 2580-2510 BCE as eternal resting places for their pharaohs.",
          concept: "Ancient civilizations created monumental architecture that reflected their beliefs about afterlife and divine power.",
          animation: "🏜️ The pyramids rise majestically from the desert sands! ⬆️🔺✨",
          visualExample: "Imagine massive limestone blocks, each weighing 2.5 tons, being moved without modern machinery! Workers used ramps, levers, and pure human determination. 🏗️",
          relatedTopics: [
            { title: "Ancient Egyptian Religion", url: "https://en.wikipedia.org/wiki/Ancient_Egyptian_religion" },
            { title: "Pyramid Construction", url: "https://en.wikipedia.org/wiki/Egyptian_pyramid_construction_techniques" }
          ]
        },
        {
          question: "Who was the legendary king who created the first code of laws?",
          options: ["Hammurabi", "Nebuchadnezzar", "Gilgamesh", "Sargon"],
          correctAnswer: "Hammurabi",
          explanation: "Hammurabi of Babylon created one of the world's first written legal codes around 1750 BCE, featuring 282 laws.",
          concept: "Early legal systems established order and justice in growing civilizations through written laws.",
          animation: "⚖️ Justice carved in stone for all to see! 📜⚡",
          visualExample: "Picture a massive stone pillar with cuneiform writing, where citizens could read 'an eye for an eye' - the birth of written justice! ⚖️",
          relatedTopics: [
            { title: "Code of Hammurabi", url: "https://en.wikipedia.org/wiki/Code_of_Hammurabi" },
            { title: "Ancient Mesopotamia", url: "https://en.wikipedia.org/wiki/Mesopotamia" }
          ]
        },
        {
          question: "Which ancient wonder was located in the harbor of Alexandria?",
          options: ["Hanging Gardens", "Lighthouse of Alexandria", "Colossus of Rhodes", "Temple of Artemis"],
          correctAnswer: "Lighthouse of Alexandria",
          explanation: "The Lighthouse of Alexandria, built around 280 BCE, stood over 100 meters tall and guided ships safely into the busy harbor.",
          concept: "Ancient engineering marvels served both practical and symbolic purposes in great cities.",
          animation: "🏛️ A beacon of light cutting through the darkness! 💡🌊",
          visualExample: "Envision a towering structure with mirrors reflecting fire at its peak, visible from 50 kilometers away, helping merchants navigate safely! 🔥",
          relatedTopics: [
            { title: "Lighthouse of Alexandria", url: "https://en.wikipedia.org/wiki/Lighthouse_of_Alexandria" },
            { title: "Seven Wonders of the Ancient World", url: "https://en.wikipedia.org/wiki/Seven_Wonders_of_the_Ancient_World" }
          ]
        }
      ],
      'true-false': [
        {
          question: "The Great Wall of China was built entirely during the Ming Dynasty.",
          correctAnswer: "False",
          explanation: "The Great Wall was built over many dynasties spanning over 2,000 years, with major construction during multiple periods including the Ming Dynasty.",
          concept: "Historical monuments often span multiple time periods and represent the work of many generations.",
          animation: "🏯 Walls growing across centuries like a dragon across mountains! 🐉⛰️",
          visualExample: "Imagine thousands of workers across different eras, each adding their piece to this massive fortification stretching across mountains and deserts! 🧱",
          relatedTopics: [
            { title: "Great Wall of China", url: "https://en.wikipedia.org/wiki/Great_Wall_of_China" },
            { title: "Chinese Dynasties", url: "https://en.wikipedia.org/wiki/Dynasties_in_Chinese_history" }
          ]
        }
      ]
    },
    medieval: {
      'multiple-choice': [
        {
          question: "Which plague devastated Europe in the 14th century?",
          options: ["Black Death", "Spanish Flu", "Smallpox", "Cholera"],
          correctAnswer: "Black Death",
          explanation: "The Black Death (1347-1351) killed an estimated 75-200 million people, fundamentally changing European society.",
          concept: "Pandemics have repeatedly shaped human history, affecting social structures, economics, and culture.",
          animation: "💀 Dark clouds of disease spreading across medieval Europe! ⚡🏰",
          visualExample: "Picture medieval towns with empty streets, abandoned fields, and profound social changes as one-third of Europe's population perished. 🏘️",
          relatedTopics: [
            { title: "Black Death", url: "https://en.wikipedia.org/wiki/Black_Death" },
            { title: "Medieval Medicine", url: "https://en.wikipedia.org/wiki/Medieval_medicine_of_Western_Europe" }
          ]
        },
        {
          question: "What was the primary purpose of medieval castles?",
          options: ["Entertainment", "Defense", "Agriculture", "Trade"],
          correctAnswer: "Defense",
          explanation: "Medieval castles were primarily built as fortified residences to protect nobles and control surrounding territories during times of conflict.",
          concept: "Medieval architecture reflected the violent nature of the times and the need for protection.",
          animation: "🏰 Mighty fortresses standing guard against enemy attacks! ⚔️🛡️",
          visualExample: "Envision thick stone walls, arrow slits, moats, and drawbridges designed to withstand siege warfare and protect those inside! 🗡️",
          relatedTopics: [
            { title: "Medieval Castle", url: "https://en.wikipedia.org/wiki/Castle" },
            { title: "Medieval Warfare", url: "https://en.wikipedia.org/wiki/Medieval_warfare" }
          ]
        }
      ]
    },
    modern: {
      'multiple-choice': [
        {
          question: "Which revolution sparked the phrase 'Let them eat cake'?",
          options: ["American Revolution", "French Revolution", "Industrial Revolution", "Russian Revolution"],
          correctAnswer: "French Revolution",
          explanation: "This phrase (though likely apocryphal) symbolized the disconnect between French nobility and common people during the French Revolution (1789-1799).",
          concept: "Social inequality and economic hardship often trigger revolutionary movements that reshape entire societies.",
          animation: "🇫🇷 The people rising up against oppression! ✊💥",
          visualExample: "Picture starving peasants outside palace gates while nobles feast lavishly - the spark that ignited revolutionary fire! 🔥",
          relatedTopics: [
            { title: "French Revolution", url: "https://en.wikipedia.org/wiki/French_Revolution" },
            { title: "Marie Antoinette", url: "https://en.wikipedia.org/wiki/Marie_Antoinette" }
          ]
        },
        {
          question: "What invention revolutionized manufacturing in the 18th century?",
          options: ["Steam Engine", "Telegraph", "Printing Press", "Compass"],
          correctAnswer: "Steam Engine",
          explanation: "The steam engine, perfected by James Watt in 1769, powered the Industrial Revolution and transformed manufacturing, transportation, and society.",
          concept: "Technological innovations can fundamentally transform how humans live, work, and organize society.",
          animation: "⚙️ Steam and gears powering the age of industry! 🚂💨",
          visualExample: "Imagine the first steam-powered factories with massive wheels turning, producing goods faster than ever before possible! 🏭",
          relatedTopics: [
            { title: "Industrial Revolution", url: "https://en.wikipedia.org/wiki/Industrial_Revolution" },
            { title: "Steam Engine", url: "https://en.wikipedia.org/wiki/Steam_engine" }
          ]
        }
      ]
    },
    contemporary: {
      'multiple-choice': [
        {
          question: "Which event triggered World War I?",
          options: ["Sinking of Lusitania", "Assassination of Archduke Franz Ferdinand", "German invasion of Belgium", "Russian Revolution"],
          correctAnswer: "Assassination of Archduke Franz Ferdinand",
          explanation: "The assassination of Archduke Franz Ferdinand in Sarajevo on June 28, 1914, triggered the alliance system that led to WWI.",
          concept: "In interconnected political systems, single events can cascade into global conflicts through alliance networks.",
          animation: "💥 One gunshot echoing across the world! 🌍⚡",
          visualExample: "Picture a single moment in Sarajevo setting off a chain reaction of declarations of war across Europe like falling dominoes! 🃏",
          relatedTopics: [
            { title: "World War I", url: "https://en.wikipedia.org/wiki/World_War_I" },
            { title: "Assassination of Archduke Franz Ferdinand", url: "https://en.wikipedia.org/wiki/Assassination_of_Archduke_Franz_Ferdinand" }
          ]
        },
        {
          question: "What was the main goal of the Marshall Plan?",
          options: ["Rebuild Europe after WWII", "Colonize Africa", "Explore space", "Build nuclear weapons"],
          correctAnswer: "Rebuild Europe after WWII",
          explanation: "The Marshall Plan (1948-1951) provided over $12 billion to help rebuild Western European economies devastated by WWII.",
          concept: "Post-war reconstruction efforts can shape international relations and prevent future conflicts through economic cooperation.",
          animation: "🏗️ Rebuilding nations from ashes to prosperity! 💰🌟",
          visualExample: "Envision American aid flowing into war-torn European cities, rebuilding factories, roads, and hope for the future! 🚛",
          relatedTopics: [
            { title: "Marshall Plan", url: "https://en.wikipedia.org/wiki/Marshall_Plan" },
            { title: "Post-WWII Reconstruction", url: "https://en.wikipedia.org/wiki/Reconstruction_of_Germany" }
          ]
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
      if (hintsUsed === 0) {
        const wrongAnswers = currentQuestion.options.filter(opt => opt !== currentQuestion.correctAnswer);
        const wrongToRemove = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        setCurrentHint(`💡 Hint 1: "${wrongToRemove}" is not the correct answer.`);
      } else if (hintsUsed === 1) {
        setCurrentHint(`💡 Hint 2: Think about the historical context and timeline of events.`);
      } else {
        const correctAnswer = currentQuestion.correctAnswer as string;
        setCurrentHint(`💡 Final Hint: The answer starts with "${correctAnswer.charAt(0)}" and has ${correctAnswer.length} letters.`);
      }
    } else {
      if (hintsUsed === 0) {
        setCurrentHint("💡 Hint 1: Consider the historical accuracy and timeline.");
      } else {
        setCurrentHint("💡 Final Hint: Think about what historical evidence supports this statement.");
      }
    }
    
    setHintsUsed(hintsUsed + 1);
  };

  const resetGame = () => {
    startGame();
  };

  // Real-time updates when era or question type changes
  useEffect(() => {
    if (gameStarted) {
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
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>History Learning Concepts</DialogTitle>
                <DialogDescription>Understanding historical thinking and analysis</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
                    
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                      <h5 className="font-bold text-blue-800 mb-2">💡 Concept:</h5>
                      <p className="text-blue-700 mb-2">{currentQuestion.concept}</p>
                      <div className="text-2xl animate-bounce mb-2">{currentQuestion.animation}</div>
                      <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400 mb-3">
                        <h6 className="font-semibold text-yellow-800 mb-1">🎨 Visual Example:</h6>
                        <p className="text-yellow-700">{currentQuestion.visualExample}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                        <h6 className="font-semibold text-purple-800 mb-2">📚 Related Topics:</h6>
                        <div className="space-y-1">
                          {currentQuestion.relatedTopics.map((topic, index) => (
                            <a 
                              key={index} 
                              href={topic.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block text-purple-600 hover:text-purple-800 underline"
                            >
                              🔗 {topic.title}
                            </a>
                          ))}
                        </div>
                      </div>
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
