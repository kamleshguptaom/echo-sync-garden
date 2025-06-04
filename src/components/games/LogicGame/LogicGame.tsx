import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogicGameProps {
  onBack: () => void;
}

type GameType = 'sequences' | 'patterns' | 'riddles' | 'deduction' | 'random';
type Difficulty = 'easy' | 'medium' | 'hard' | 'random';

interface LogicPuzzle {
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  concept: string;
  type: string;
  visualExample?: string;
  relatedLinks?: { title: string; url: string }[];
}

export const LogicGame: React.FC<LogicGameProps> = ({ onBack }) => {
  const [gameType, setGameType] = useState<GameType>('sequences');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentPuzzle, setCurrentPuzzle] = useState<LogicPuzzle | null>(null);
  const [score, setScore] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showDetailedConcept, setShowDetailedConcept] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && gameStarted) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameStarted]);

  const puzzles = {
    sequences: {
      easy: [
        {
          question: "What comes next in the sequence: 2, 4, 6, 8, ?",
          options: ["9", "10", "12", "14"],
          correctAnswer: "10",
          explanation: "This is a sequence of even numbers increasing by 2 each time.",
          concept: "Number sequences follow predictable patterns based on mathematical operations.",
          type: "Arithmetic Sequence",
          visualExample: "Visual: 2 → (+2) → 4 → (+2) → 6 → (+2) → 8 → (+2) → 10",
          relatedLinks: [
            { title: "Khan Academy - Arithmetic Sequences", url: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:sequences" },
            { title: "Math is Fun - Number Patterns", url: "https://www.mathsisfun.com/algebra/sequences-sums-arithmetic.html" }
          ]
        },
        {
          question: "Complete the pattern: A, C, E, G, ?",
          options: ["H", "I", "J", "K"],
          correctAnswer: "I",
          explanation: "This sequence skips one letter each time in the alphabet.",
          concept: "Letter patterns can follow arithmetic progressions through the alphabet.",
          type: "Letter Sequence",
          visualExample: "Visual: A(1) → skip B → C(3) → skip D → E(5) → skip F → G(7) → skip H → I(9)",
          relatedLinks: [
            { title: "Math Playground - Letter Patterns", url: "https://www.mathplayground.com/letter_patterns.html" },
            { title: "Education.com - Alphabet Sequences", url: "https://www.education.com/worksheets/alphabet/" }
          ]
        }
      ],
      medium: [
        {
          question: "What comes next: 1, 1, 2, 3, 5, 8, ?",
          options: ["11", "13", "15", "21"],
          correctAnswer: "13",
          explanation: "This is the Fibonacci sequence where each number is the sum of the two preceding ones.",
          concept: "The Fibonacci sequence appears frequently in nature and mathematics.",
          type: "Fibonacci Sequence",
          visualExample: "Visual: 1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13",
          relatedLinks: [
            { title: "Khan Academy - Fibonacci Sequence", url: "https://www.khanacademy.org/computing/computer-science/algorithms/recursive-algorithms/a/the-fibonacci-sequence" },
            { title: "Math is Fun - Fibonacci", url: "https://www.mathsisfun.com/numbers/fibonacci-sequence.html" }
          ]
        }
      ],
      hard: [
        {
          question: "Find the next number: 2, 6, 12, 20, 30, ?",
          options: ["40", "42", "44", "48"],
          correctAnswer: "42",
          explanation: "Each number follows the pattern n(n+1) where n increases by 1 each time.",
          concept: "Complex sequences may involve polynomial patterns.",
          type: "Polynomial Sequence",
          visualExample: "Visual: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42",
          relatedLinks: [
            { title: "Khan Academy - Polynomial Sequences", url: "https://www.khanacademy.org/math/algebra2/x2ec2f6f830c9fb89:poly-arithmetic" },
            { title: "Wolfram MathWorld - Sequences", url: "https://mathworld.wolfram.com/Sequence.html" }
          ]
        }
      ]
    },
    patterns: {
      easy: [
        {
          question: "Which shape completes the pattern: ○ □ ○ □ ?",
          options: ["○", "□", "△", "◊"],
          correctAnswer: "○",
          explanation: "The pattern alternates between circle and square.",
          concept: "Visual patterns often involve alternating elements.",
          type: "Alternating Pattern",
          visualExample: "Visual: Circle → Square → Circle → Square → Circle",
          relatedLinks: [
            { title: "Education.com - Pattern Recognition", url: "https://www.education.com/worksheets/patterns/" },
            { title: "Math Playground - Visual Patterns", url: "https://www.mathplayground.com/visual_patterns.html" }
          ]
        }
      ],
      medium: [
        {
          question: "What comes next in this pattern: Red, Blue, Red, Blue, Blue, Red, Blue, Blue, Blue, ?",
          options: ["Red", "Blue", "Green", "Yellow"],
          correctAnswer: "Red",
          explanation: "The pattern shows increasing groups: 1 Red, 1 Blue, 1 Red, 2 Blues, 1 Red, 3 Blues, so next is Red.",
          concept: "Complex patterns may involve increasing or decreasing groupings.",
          type: "Grouping Pattern",
          visualExample: "Visual: R|B|R|BB|R|BBB|R (next)",
          relatedLinks: [
            { title: "BrainGymmer - Pattern Games", url: "https://www.braingymmer.com/en/brain-games/pattern-memory/" },
            { title: "Education.com - Advanced Patterns", url: "https://www.education.com/worksheets/fifth-grade/patterns/" }
          ]
        }
      ]
    },
    riddles: {
      easy: [
        {
          question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
          options: ["Fire", "Plant", "Wind", "Cloud"],
          correctAnswer: "Fire",
          explanation: "Fire grows when it spreads, needs oxygen (air) to survive, and water extinguishes it.",
          concept: "Riddles use metaphorical language to describe objects through their properties.",
          type: "Object Riddle",
          visualExample: "Visual: 🔥 grows larger → needs O₂ → H₂O extinguishes it",
          relatedLinks: [
            { title: "Education.com - Brain Teasers", url: "https://www.education.com/worksheets/brain-teasers/" },
            { title: "Math Playground - Logic Puzzles", url: "https://www.mathplayground.com/logic_puzzles.html" }
          ]
        }
      ],
      medium: [
        {
          question: "A man lives on the 20th floor of an apartment building. Every morning he takes the elevator down to the ground floor. When he comes home, he takes the elevator to the 10th floor and walks the rest of the way... except on rainy days, when he takes the elevator all the way to the 20th floor. Why?",
          options: ["He's exercising", "He's short and can't reach the button", "The elevator is broken", "He's afraid of heights"],
          correctAnswer: "He's short and can't reach the button",
          explanation: "The man is too short to reach the 20th floor button, but can reach the 10th. On rainy days, he has an umbrella to help him reach higher buttons.",
          concept: "Logic puzzles often have surprising solutions that require thinking outside conventional assumptions.",
          type: "Situation Puzzle",
          visualExample: "Visual: Short person + elevator buttons at different heights + umbrella as tool",
          relatedLinks: [
            { title: "BrainGymmer - Logic Puzzles", url: "https://www.braingymmer.com/en/brain-games/" },
            { title: "Math Playground - Thinking Blocks", url: "https://www.mathplayground.com/thinking_blocks.html" }
          ]
        }
      ]
    },
    deduction: {
      easy: [
        {
          question: "All roses are flowers. Some flowers are red. Therefore, what can we conclude?",
          options: ["All roses are red", "Some roses are red", "Some roses might be red", "No roses are red"],
          correctAnswer: "Some roses might be red",
          explanation: "We can't definitively conclude about rose colors from the given information, only that it's possible some roses are red.",
          concept: "Logical deduction requires careful analysis of what can and cannot be concluded from given premises.",
          type: "Syllogistic Reasoning",
          visualExample: "Visual: Roses ⊆ Flowers, Some Flowers = Red, Therefore: Roses ∩ Red = Possible",
          relatedLinks: [
            { title: "Khan Academy - Logic", url: "https://www.khanacademy.org/math/geometry/hs-geo-reasoning" },
            { title: "Education.com - Logic Games", url: "https://www.education.com/worksheets/logic/" }
          ]
        }
      ]
    }
  };

  const generatePuzzle = () => {
    const actualType = gameType === 'random' ? 
      (['sequences', 'patterns', 'riddles', 'deduction'] as const)[Math.floor(Math.random() * 4)] : 
      gameType;
    
    const actualDiff = difficulty === 'random' ? 
      (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)] : 
      difficulty;

    const typePuzzles = puzzles[actualType];
    const diffPuzzles = typePuzzles[actualDiff] || typePuzzles['easy'];
    
    if (diffPuzzles && diffPuzzles.length > 0) {
      const randomPuzzle = diffPuzzles[Math.floor(Math.random() * diffPuzzles.length)];
      setCurrentPuzzle(randomPuzzle);
      setCurrentHint('');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameActive(true);
    setScore(0);
    setPuzzlesSolved(0);
    setShowResult(false);
    setHintsUsed(0);
    setTimer(0);
    generatePuzzle();
  };

  const submitAnswer = () => {
    if (!currentPuzzle || !selectedAnswer) return;

    const isCorrect = selectedAnswer === currentPuzzle.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setPuzzlesSolved(puzzlesSolved + 1);
    setShowResult(true);
  };

  const nextPuzzle = () => {
    setSelectedAnswer('');
    setShowResult(false);
    setCurrentHint('');
    generatePuzzle();
  };

  const useHint = () => {
    if (!currentPuzzle || hintsUsed >= 3) return;
    
    const hints = [
      "Think about the relationship between consecutive elements.",
      "Look for mathematical or logical patterns.",
      "Consider what rule or principle might govern this sequence."
    ];
    
    setCurrentHint(hints[hintsUsed] || "Consider the context and logical reasoning.");
    setHintsUsed(hintsUsed + 1);
  };

  const resetGame = () => {
    startGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Real-time updates
  useEffect(() => {
    if (gameStarted && currentPuzzle) {
      generatePuzzle();
    }
  }, [gameType, difficulty]);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Logic Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Logic & Reasoning Concepts</DialogTitle>
                <DialogDescription>Master logical thinking and problem-solving</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🧩 Types of Logic Puzzles</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Sequences:</strong> Find patterns in numbers or letters</li>
                    <li><strong>Patterns:</strong> Identify visual or conceptual repetitions</li>
                    <li><strong>Riddles:</strong> Solve word-based logic problems</li>
                    <li><strong>Deduction:</strong> Draw conclusions from given premises</li>
                  </ul>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎯 Problem-Solving Strategies</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Look for mathematical relationships</li>
                    <li>Consider multiple possible patterns</li>
                    <li>Test your hypothesis with given examples</li>
                    <li>Think outside conventional assumptions</li>
                  </ul>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h3 className="font-bold text-lg">🔍 Logical Reasoning</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Deductive reasoning: General to specific</li>
                    <li>Inductive reasoning: Specific to general</li>
                    <li>Abductive reasoning: Best explanation</li>
                    <li>Pattern recognition and extrapolation</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg animate-pulse">
                  <h4 className="font-bold">💡 Pro Tip:</h4>
                  <p>Break complex problems into smaller, manageable parts!</p>
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
                <label className="block text-sm font-medium mb-1">Game Type</label>
                <Select value={gameType} onValueChange={(value) => setGameType(value as GameType)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequences">Sequences</SelectItem>
                    <SelectItem value="patterns">Patterns</SelectItem>
                    <SelectItem value="riddles">Riddles</SelectItem>
                    <SelectItem value="deduction">Deduction</SelectItem>
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
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600 mt-6">
                {gameStarted ? 'New Game' : 'Start Game'}
              </Button>

              {gameStarted && (
                <>
                  <Button onClick={resetGame} variant="outline" className="mt-6">
                    🔄 Reset
                  </Button>
                  <Button onClick={() => alert('Solve logic puzzles using reasoning and pattern recognition!')} variant="outline" className="mt-6">
                    📋 Instructions
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {gameStarted && currentPuzzle && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center flex-wrap gap-2">
                <div>Score: {score}/{puzzlesSolved}</div>
                <div>Time: {formatTime(timer)}</div>
                <div>Hints: {hintsUsed}/3</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {currentPuzzle.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-4 animate-fade-in">{currentPuzzle.question}</h3>
                
                {currentHint && (
                  <div className="bg-blue-100 p-3 rounded-lg mb-4 animate-scale-in">
                    <p className="text-blue-800">{currentHint}</p>
                  </div>
                )}

                {currentPuzzle.options ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {currentPuzzle.options.map((option, index) => (
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
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Enter your answer"
                      className="w-full max-w-md mx-auto p-3 border rounded-lg text-center"
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      disabled={showResult}
                    />
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
                    selectedAnswer === currentPuzzle.correctAnswer ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <h4 className={`text-xl font-bold mb-2 ${
                      selectedAnswer === currentPuzzle.correctAnswer ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {selectedAnswer === currentPuzzle.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                    </h4>
                    <p className="mb-2">
                      <strong>Correct Answer:</strong> {currentPuzzle.correctAnswer}
                    </p>
                    <p className="mb-4">{currentPuzzle.explanation}</p>
                    
                    <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                      <h5 className="font-bold text-purple-800 mb-2">🧠 Concept:</h5>
                      <p className="text-purple-700">{currentPuzzle.concept}</p>
                    </div>
                    
                    <Button onClick={nextPuzzle} className="mt-4 bg-purple-500 hover:bg-purple-600">
                      Next Puzzle →
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Concept Dialog */}
        <Dialog open={showDetailedConcept} onOpenChange={setShowDetailedConcept}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detailed Concept Explanation</DialogTitle>
              <DialogDescription>In-depth understanding with visual examples</DialogDescription>
            </DialogHeader>
            {currentPuzzle && (
              <div className="space-y-6">
                <div className="animate-fade-in">
                  <h3 className="text-lg font-bold mb-2">{currentPuzzle.type}</h3>
                  <p className="text-gray-700 mb-4">{currentPuzzle.concept}</p>
                  {currentPuzzle.visualExample && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Visual Example:</h4>
                      <p className="font-mono text-sm">{currentPuzzle.visualExample}</p>
                    </div>
                  )}
                </div>
                {currentPuzzle.relatedLinks && (
                  <div className="animate-scale-in">
                    <h4 className="font-bold mb-3">🔗 Related Learning Resources:</h4>
                    <div className="grid gap-2">
                      {currentPuzzle.relatedLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 border rounded-lg hover:bg-gray-50 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <span className="font-medium">{link.title}</span>
                          <span className="text-sm text-gray-500 ml-2">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
