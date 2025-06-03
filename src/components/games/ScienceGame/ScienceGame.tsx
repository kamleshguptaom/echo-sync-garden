
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ScienceGameProps {
  onBack: () => void;
}

type QuestionType = 'physics' | 'chemistry' | 'biology' | 'earth-science' | 'astronomy' | 'random';
type Difficulty = 'easy' | 'medium' | 'hard';

interface ScienceQuestion {
  type: QuestionType;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  concept: string;
}

const scienceConcepts = {
  physics: "Physics studies matter, energy, and their interactions. Key concepts include force, motion, energy, waves, and electricity.",
  chemistry: "Chemistry studies the composition, structure, and properties of matter. Key concepts include atoms, molecules, reactions, and bonds.",
  biology: "Biology studies living organisms and life processes. Key concepts include cells, genetics, evolution, and ecosystems.",
  'earth-science': "Earth Science studies our planet and its systems. Key concepts include geology, weather, climate, and natural resources.",
  astronomy: "Astronomy studies celestial objects and space. Key concepts include planets, stars, galaxies, and the universe."
};

export const ScienceGame: React.FC<ScienceGameProps> = ({ onBack }) => {
  const [questionType, setQuestionType] = useState<QuestionType>('physics');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<ScienceQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConcept, setShowConcept] = useState(false);

  const questionBank = {
    physics: {
      easy: [
        {
          question: "What force pulls objects toward Earth?",
          options: ["Magnetism", "Gravity", "Friction", "Pressure"],
          correct: 1,
          explanation: "Gravity is the force that attracts objects with mass toward each other. Earth's gravity pulls everything toward its center.",
          concept: "Gravity is a fundamental force that keeps us on the ground and causes objects to fall."
        },
        {
          question: "What happens to the speed of sound in warmer air?",
          options: ["It decreases", "It increases", "It stays the same", "It stops"],
          correct: 1,
          explanation: "Sound travels faster in warmer air because the molecules move more quickly and can transmit vibrations faster.",
          concept: "Sound speed depends on the medium's temperature and properties."
        }
      ],
      medium: [
        {
          question: "What is the unit of electrical resistance?",
          options: ["Volt", "Ampere", "Ohm", "Watt"],
          correct: 2,
          explanation: "The ohm (Ω) is the unit of electrical resistance, named after Georg Simon Ohm who discovered Ohm's law.",
          concept: "Electrical resistance opposes the flow of electric current in a circuit."
        }
      ],
      hard: [
        {
          question: "What is the speed of light in a vacuum?",
          options: ["300,000 km/s", "299,792,458 m/s", "186,000 mph", "3×10⁸ m/s"],
          correct: 3,
          explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second, often approximated as 3×10⁸ m/s.",
          concept: "Light speed is a fundamental constant and the maximum speed possible in the universe."
        }
      ]
    },
    chemistry: {
      easy: [
        {
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          correct: 0,
          explanation: "Water is H2O - two hydrogen atoms bonded to one oxygen atom.",
          concept: "Chemical formulas show the types and numbers of atoms in a molecule."
        },
        {
          question: "What gas do plants absorb during photosynthesis?",
          options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
          correct: 2,
          explanation: "Plants absorb carbon dioxide (CO2) from the air and use it with water and sunlight to make glucose.",
          concept: "Photosynthesis converts CO2 and water into glucose and oxygen using sunlight."
        }
      ],
      medium: [
        {
          question: "What is the pH of pure water at 25°C?",
          options: ["6", "7", "8", "9"],
          correct: 1,
          explanation: "Pure water has a pH of 7, which is neutral - neither acidic nor basic.",
          concept: "pH measures how acidic or basic a solution is, with 7 being neutral."
        }
      ],
      hard: [
        {
          question: "What is Avogadro's number approximately?",
          options: ["6.022×10²³", "3.14×10⁸", "9.81×10²", "1.602×10⁻¹⁹"],
          correct: 0,
          explanation: "Avogadro's number (6.022×10²³) is the number of particles in one mole of substance.",
          concept: "A mole is a unit used to count very large numbers of tiny particles like atoms or molecules."
        }
      ]
    },
    biology: {
      easy: [
        {
          question: "What is the basic unit of life?",
          options: ["Tissue", "Organ", "Cell", "Organism"],
          correct: 2,
          explanation: "The cell is the smallest unit that can be considered alive and perform all life functions.",
          concept: "All living things are made of one or more cells, which are the building blocks of life."
        },
        {
          question: "Which organ pumps blood through the body?",
          options: ["Brain", "Lungs", "Heart", "Liver"],
          correct: 2,
          explanation: "The heart is a muscular organ that pumps blood throughout the circulatory system.",
          concept: "The circulatory system transports nutrients, oxygen, and waste throughout the body."
        }
      ],
      medium: [
        {
          question: "What process do plants use to make their own food?",
          options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
          correct: 1,
          explanation: "Photosynthesis allows plants to convert sunlight, water, and CO2 into glucose and oxygen.",
          concept: "Photosynthesis is how plants capture and store energy from sunlight."
        }
      ],
      hard: [
        {
          question: "How many chromosomes do humans typically have?",
          options: ["23", "44", "46", "48"],
          correct: 2,
          explanation: "Humans typically have 46 chromosomes - 23 pairs, with one chromosome from each parent in each pair.",
          concept: "Chromosomes carry genetic information (DNA) that determines our traits and characteristics."
        }
      ]
    }
  };

  const getRandomQuestionType = (): QuestionType => {
    const types: QuestionType[] = ['physics', 'chemistry', 'biology', 'earth-science', 'astronomy'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const generateQuestion = (): ScienceQuestion => {
    const actualType = questionType === 'random' ? getRandomQuestionType() : questionType;
    const questions = questionBank[actualType as keyof typeof questionBank]?.[difficulty] || questionBank.physics.easy;
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
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion(generateQuestion());
  };

  const checkAnswer = () => {
    if (!currentQuestion || selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    if (isCorrect) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      setScore(score + points * (streak + 1));
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
    } else {
      setStreak(0);
      setFeedback(`Incorrect. The correct answer was: ${currentQuestion.options[currentQuestion.correct]}`);
    }
    
    setShowExplanation(true);
    setQuestionsAnswered(questionsAnswered + 1);
    
    setTimeout(() => {
      if (questionsAnswered < 9) {
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setShowExplanation(false);
        setFeedback('');
      } else {
        setGameStarted(false);
        setCurrentQuestion(null);
      }
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🔬 Science Challenge</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Science Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>1. Choose your science subject and difficulty level</p>
                <p>2. Answer multiple choice questions about science topics</p>
                <p>3. Read explanations to learn more about each answer</p>
                <p>4. Use concepts to understand the science behind questions</p>
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
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">⚛️ Physics</SelectItem>
                    <SelectItem value="chemistry">🧪 Chemistry</SelectItem>
                    <SelectItem value="biology">🧬 Biology</SelectItem>
                    <SelectItem value="earth-science">🌍 Earth Science</SelectItem>
                    <SelectItem value="astronomy">🌌 Astronomy</SelectItem>
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
                "Test Your Science Knowledge!"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!gameStarted ? (
              <div className="space-y-4">
                <p className="text-lg">Ready to explore science?</p>
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-xl px-8 py-3">
                  Start Challenge
                </Button>
              </div>
            ) : currentQuestion ? (
              <div className="space-y-6">
                <div className="text-sm text-blue-600 font-medium">
                  {currentQuestion.category} | {difficulty.toUpperCase()}
                </div>
                
                <div className="text-xl font-semibold text-gray-800">
                  {currentQuestion.question}
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`p-4 text-left ${selectedAnswer === index ? 'bg-blue-500 text-white' : ''}`}
                      onClick={() => setSelectedAnswer(index)}
                      disabled={showExplanation}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={checkAnswer} 
                    disabled={selectedAnswer === null || showExplanation}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Submit Answer
                  </Button>
                  
                  <Dialog open={showConcept} onOpenChange={setShowConcept}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-purple-100 hover:bg-purple-200">
                        📚 Concept
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{currentQuestion.category} Concepts</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>{scienceConcepts[currentQuestion.type as keyof typeof scienceConcepts]}</p>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-purple-800">
                            <strong>About this question:</strong> {currentQuestion.concept}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {feedback && (
                  <div className={`text-xl font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'} animate-bounce`}>
                    {feedback}
                  </div>
                )}
                
                {showExplanation && (
                  <div className="bg-blue-50 p-4 rounded-lg text-left max-w-md mx-auto">
                    <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                    <p className="text-blue-700">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-600">Science Challenge Complete!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Questions Answered: {questionsAnswered}/10</p>
                <div className="text-sm text-gray-600">
                  Performance: {score >= 200 ? '🏆 Science Master!' : score >= 100 ? '⭐ Excellent!' : '👍 Keep Learning!'}
                </div>
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
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
