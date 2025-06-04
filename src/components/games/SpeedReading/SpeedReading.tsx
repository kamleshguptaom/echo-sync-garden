import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface SpeedReadingProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
type ReadingMode = 'comprehension' | 'speed' | 'scanning' | 'skimming' | 'random';

interface ReadingTest {
  text: string;
  questions: Array<{
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }>;
  concept: string;
  visualExample: string;
  relatedLinks: { title: string; url: string }[];
}

export const SpeedReading: React.FC<SpeedReadingProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [readingMode, setReadingMode] = useState<ReadingMode>('comprehension');
  const [currentTest, setCurrentTest] = useState<ReadingTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [readingPhase, setReadingPhase] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [showConcept, setShowConcept] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (readingPhase && gameStarted) {
      interval = setInterval(() => setReadingTime(time => time + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [readingPhase, gameStarted]);

  // Reset game when settings change
  useEffect(() => {
    if (gameStarted) {
      setGameStarted(false);
      setCurrentTest(null);
    }
  }, [difficulty, readingMode]);

  const readingTexts = {
    easy: {
      text: "The sun is a star at the center of our solar system. It provides light and heat that makes life possible on Earth. The sun is made mostly of hydrogen and helium gases. Every second, the sun converts millions of tons of hydrogen into helium through nuclear fusion. This process releases enormous amounts of energy. The sun is about 93 million miles away from Earth. It takes about 8 minutes for sunlight to travel from the sun to Earth. The sun is so large that about 1.3 million Earths could fit inside it.",
      questions: [
        {
          question: "What is the sun made mostly of?",
          options: ["Oxygen and nitrogen", "Hydrogen and helium", "Carbon and oxygen", "Iron and nickel"],
          correct: "Hydrogen and helium",
          explanation: "The sun is composed primarily of hydrogen (about 73%) and helium (about 25%)."
        },
        {
          question: "How long does it take for sunlight to reach Earth?",
          options: ["4 minutes", "8 minutes", "12 minutes", "16 minutes"],
          correct: "8 minutes",
          explanation: "Light travels at approximately 300,000 km/s, covering the 93 million mile distance in about 8 minutes."
        }
      ],
      concept: "Reading Comprehension",
      visualExample: "☀️ Sun → 8 minutes → 🌍 Earth",
      relatedLinks: [
        { title: "NASA - About the Sun", url: "https://www.nasa.gov/sun" },
        { title: "Education.com - Solar System", url: "https://www.education.com/worksheets/solar-system/" }
      ]
    },
    medium: {
      text: "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process occurs primarily in the chloroplasts of plant cells, which contain chlorophyll - the green pigment that captures light energy. The process consists of two main stages: the light-dependent reactions and the Calvin cycle. During the light-dependent reactions, chlorophyll absorbs photons and uses this energy to split water molecules, releasing oxygen as a byproduct. The Calvin cycle uses the energy from the light reactions to convert carbon dioxide into glucose. This process is crucial for life on Earth as it produces the oxygen we breathe and forms the base of most food chains.",
      questions: [
        {
          question: "Where does photosynthesis primarily occur in plant cells?",
          options: ["Mitochondria", "Nucleus", "Chloroplasts", "Vacuoles"],
          correct: "Chloroplasts",
          explanation: "Chloroplasts contain chlorophyll and are the primary site of photosynthesis in plant cells."
        },
        {
          question: "What are the two main stages of photosynthesis?",
          options: ["Light reactions and Calvin cycle", "Absorption and emission", "Synthesis and breakdown", "Input and output"],
          correct: "Light reactions and Calvin cycle",
          explanation: "Photosynthesis consists of light-dependent reactions and the Calvin cycle (light-independent reactions)."
        }
      ],
      concept: "Biological Processes",
      visualExample: "☀️ + CO₂ + H₂O → 🌱 → O₂ + Glucose",
      relatedLinks: [
        { title: "Khan Academy - Photosynthesis", url: "https://www.khanacademy.org/science/biology/photosynthesis-in-plants" },
        { title: "Education.com - Plant Biology", url: "https://www.education.com/worksheets/plants/" }
      ]
    },
    hard: {
      text: "Quantum entanglement is a physical phenomenon that occurs when a pair or group of particles are generated, interact, or share spatial proximity in a way such that the quantum state of each particle cannot be described independently of the state of the others, including when the particles are separated by a large distance. Measurements of physical properties such as position, momentum, spin, and polarization performed on entangled particles can in some cases be found to be perfectly correlated. When a measurement is made on one entangled particle, it instantaneously affects the quantum state of its partner, regardless of the distance between them. This phenomenon troubled Einstein, who called it 'spooky action at a distance' because it seemed to violate the principle of locality. However, quantum entanglement has been repeatedly verified through experiments and forms the basis for emerging technologies like quantum computing and quantum cryptography.",
      questions: [
        {
          question: "What did Einstein call quantum entanglement?",
          options: ["Mysterious connection", "Spooky action at a distance", "Impossible phenomenon", "Quantum mystery"],
          correct: "Spooky action at a distance",
          explanation: "Einstein was troubled by quantum entanglement and famously referred to it as 'spooky action at a distance'."
        },
        {
          question: "What principle did quantum entanglement seem to violate according to Einstein?",
          options: ["Conservation of energy", "Principle of locality", "Theory of relativity", "Uncertainty principle"],
          correct: "Principle of locality",
          explanation: "Einstein believed quantum entanglement violated locality - the idea that objects are only influenced by their immediate surroundings."
        }
      ],
      concept: "Quantum Physics",
      visualExample: "🔴↔️🔵 (Instant correlation regardless of distance)",
      relatedLinks: [
        { title: "Quantum Physics for Kids", url: "https://www.ducksters.com/science/physics/quantum_physics.php" },
        { title: "Education.com - Physics", url: "https://www.education.com/worksheets/physics/" }
      ]
    }
  };

  const startReading = () => {
    const actualDiff = difficulty === 'random' ? (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)] : difficulty;
    setCurrentTest(readingTexts[actualDiff]);
    setGameStarted(true);
    setReadingPhase(true);
    setReadingTime(0);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  const finishReading = () => {
    if (!currentTest) return;
    
    const wordCount = currentTest.text.split(' ').length;
    const timeInMinutes = readingTime / 60;
    const wpm = Math.round(wordCount / timeInMinutes);
    setWordsPerMinute(wpm);
    setReadingPhase(false);
  };

  const submitAnswer = () => {
    if (!currentTest || !selectedAnswer) return;

    const currentQuestion = currentTest.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentTest!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // Game finished
      setGameStarted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getReadingSpeedFeedback = (wpm: number) => {
    if (wpm >= 300) return { text: '🚀 Speed Demon! Excellent reading speed!', color: 'text-green-600' };
    if (wpm >= 250) return { text: '⭐ Great Reader! Above average speed!', color: 'text-blue-600' };
    if (wpm >= 200) return { text: '👍 Good Reader! Average reading speed!', color: 'text-yellow-600' };
    return { text: '📚 Keep Practicing! Focus on comprehension first!', color: 'text-orange-600' };
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Speed Reading</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Speed Reading Techniques</DialogTitle>
                <DialogDescription>Improve reading speed while maintaining comprehension</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">📖 Reading Techniques</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Skimming:</strong> Quickly identify main ideas</li>
                    <li><strong>Scanning:</strong> Look for specific information</li>
                    <li><strong>Chunking:</strong> Read groups of words together</li>
                    <li><strong>Eliminate subvocalization:</strong> Stop saying words in your head</li>
                  </ul>
                </div>
                <div className="animate-scale-in">
                  <h3 className="font-bold text-lg">🎯 Speed Benchmarks</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Average: 200-250 WPM</li>
                    <li>Good: 250-300 WPM</li>
                    <li>Excellent: 300+ WPM</li>
                    <li>Speed readers: 400-1000+ WPM</li>
                  </ul>
                </div>
                <div className="bg-green-100 p-4 rounded-lg animate-pulse">
                  <h4 className="font-bold">💡 Pro Tip:</h4>
                  <p>Balance is key - maintain comprehension while increasing speed!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Reading Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center">
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Mode</label>
                <Select value={readingMode} onValueChange={(value) => setReadingMode(value as ReadingMode)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehension">📖 Comprehension</SelectItem>
                    <SelectItem value="speed">⚡ Speed</SelectItem>
                    <SelectItem value="scanning">🔍 Scanning</SelectItem>
                    <SelectItem value="skimming">👁️ Skimming</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={startReading} className="bg-green-500 hover:bg-green-600">
                Start Reading Test
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameStarted && currentTest && readingPhase && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                Reading Time: {formatTime(readingTime)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg mb-4">Read the following text carefully:</p>
                <div className="bg-gray-50 p-6 rounded-lg text-left max-w-3xl mx-auto mb-6">
                  <p className="text-base leading-relaxed">{currentTest.text}</p>
                </div>
                <Button onClick={finishReading} className="bg-blue-500 hover:bg-blue-600">
                  I'm Done Reading
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {gameStarted && currentTest && !readingPhase && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                Question {currentQuestionIndex + 1}/{currentTest.questions.length} - WPM: {wordsPerMinute}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">
                  {currentTest.questions[currentQuestionIndex].question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-w-2xl mx-auto">
                  {currentTest.questions[currentQuestionIndex].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className="p-4 h-auto text-left justify-start"
                      onClick={() => setSelectedAnswer(option)}
                      disabled={showResult}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  ))}
                </div>

                <Button 
                  onClick={submitAnswer} 
                  disabled={!selectedAnswer || showResult}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Submit Answer
                </Button>

                {showResult && (
                  <div className={`mt-6 p-6 rounded-lg ${
                    selectedAnswer === currentTest.questions[currentQuestionIndex].correct ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <h4 className={`text-xl font-bold mb-2 ${
                      selectedAnswer === currentTest.questions[currentQuestionIndex].correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {selectedAnswer === currentTest.questions[currentQuestionIndex].correct ? '✅ Correct!' : '❌ Incorrect'}
                    </h4>
                    <p className="mb-4">{currentTest.questions[currentQuestionIndex].explanation}</p>
                    
                    <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 mb-4">
                      <h5 className="font-bold text-green-800 mb-2">🧠 Concept:</h5>
                      <p className="text-green-700 mb-2">{currentTest.concept}</p>
                      <div className="bg-green-50 p-3 rounded mt-2">
                        <p className="text-green-600 font-mono text-sm">{currentTest.visualExample}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h5 className="font-bold text-blue-800 mb-2">🔗 Learn More:</h5>
                      <div className="space-y-1">
                        {currentTest.relatedLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                    
                    <Button onClick={nextQuestion} className="bg-blue-500 hover:bg-blue-600">
                      {currentQuestionIndex < currentTest.questions.length - 1 ? 'Next Question' : 'View Results'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!gameStarted && wordsPerMinute > 0 && (
          <Card className="bg-white/95">
            <CardContent className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Reading Test Complete!</h2>
              <div className="space-y-3 mb-6">
                <p className="text-lg">Reading Speed: {wordsPerMinute} WPM</p>
                <p className="text-lg">Comprehension Score: {score}/{currentTest?.questions.length}</p>
                <p className="text-lg">Reading Time: {formatTime(readingTime)}</p>
                <div className={`text-lg font-bold ${getReadingSpeedFeedback(wordsPerMinute).color}`}>
                  {getReadingSpeedFeedback(wordsPerMinute).text}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h5 className="font-bold text-blue-800 mb-2">🔗 Improve Your Reading:</h5>
                <div className="space-y-1">
                  <a href="https://www.education.com/worksheets/reading-comprehension/" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 text-sm underline">Education.com - Reading Comprehension</a>
                  <a href="https://www.mathplayground.com/reading_comprehension.html" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 text-sm underline">Math Playground - Reading Games</a>
                  <a href="https://www.braingymmer.com/en/brain-games/reading-speed/" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 text-sm underline">BrainGymmer - Speed Reading</a>
                </div>
              </div>
              
              <Button onClick={startReading} className="bg-green-500 hover:bg-green-600">
                Take Another Test
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
