import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface PatternGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
type PatternType = 'colors' | 'shapes' | 'numbers' | 'mixed' | 'random';

interface Pattern {
  sequence: string[];
  missing: number;
  options: string[];
  correct: string;
  explanation: string;
  concept: string;
  visualExample: string;
  relatedLinks: { title: string; url: string }[];
}

export const PatternGame: React.FC<PatternGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [patternType, setPatternType] = useState<PatternType>('colors');
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive) {
      interval = setInterval(() => setTimer(timer => timer + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  // Reset game when settings change
  useEffect(() => {
    if (gameStarted) {
      setGameStarted(false);
      setGameActive(false);
      setCurrentPattern(null);
    }
  }, [difficulty, patternType]);

  const colorPatterns = {
    easy: ['🔴', '🟡', '🔵', '🟢'],
    medium: ['🔴', '🟡', '🔵', '🟢', '🟣', '🟤'],
    hard: ['🔴', '🟡', '🔵', '🟢', '🟣', '🟤', '⚫', '⚪', '🟠']
  };

  const shapePatterns = {
    easy: ['●', '■', '▲', '◆'],
    medium: ['●', '■', '▲', '◆', '★', '♠'],
    hard: ['●', '■', '▲', '◆', '★', '♠', '♥', '♣', '◊', '○']
  };

  const numberPatterns = {
    easy: ['1', '2', '3', '4', '5'],
    medium: ['1', '2', '3', '4', '5', '6', '7', '8'],
    hard: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  };

  const generatePattern = (): Pattern => {
    const actualDiff = difficulty === 'random' ? (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)] : difficulty;
    
    let actualType: 'colors' | 'shapes' | 'numbers';
    if (patternType === 'random' || patternType === 'mixed') {
      actualType = (['colors', 'shapes', 'numbers'] as const)[Math.floor(Math.random() * 3)];
    } else {
      actualType = patternType as 'colors' | 'shapes' | 'numbers';
    }
    
    let elements: string[] = [];
    
    switch (actualType) {
      case 'colors':
        elements = colorPatterns[actualDiff];
        break;
      case 'shapes':
        elements = shapePatterns[actualDiff];
        break;
      case 'numbers':
        elements = numberPatterns[actualDiff];
        break;
    }

    // Generate different pattern types
    const patternTypes = ['alternating', 'repeating', 'increasing'];
    const selectedPatternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    let sequence: string[] = [];
    let correct = '';
    let explanation = '';
    let concept = '';
    let visualExample = '';
    
    switch (selectedPatternType) {
      case 'alternating':
        sequence = [elements[0], elements[1], elements[0], elements[1], elements[0], '?'];
        correct = elements[1];
        explanation = `This is an alternating pattern between ${elements[0]} and ${elements[1]}`;
        concept = 'Alternating patterns repeat two elements in sequence';
        visualExample = `${elements[0]} → ${elements[1]} → ${elements[0]} → ${elements[1]} → ${elements[0]} → ${elements[1]}`;
        break;
      case 'repeating':
        const group = elements.slice(0, 3);
        sequence = [...group, ...group, group[0], '?'];
        correct = group[1];
        explanation = `This pattern repeats the group: ${group.join(', ')}`;
        concept = 'Repeating patterns cycle through a fixed sequence of elements';
        visualExample = `${group.join(' → ')} → ${group.join(' → ')} → ${group[0]} → ${group[1]}`;
        break;
      case 'increasing':
        sequence = [elements[0], elements[1], elements[2], elements[3], '?'];
        correct = elements[4] || elements[0];
        explanation = 'This pattern follows the sequence order';
        concept = 'Sequential patterns follow a logical order or progression';
        visualExample = `${elements[0]} → ${elements[1]} → ${elements[2]} → ${elements[3]} → ${correct}`;
        break;
    }

    const missing = sequence.indexOf('?');
    const options = [correct, ...elements.filter(e => e !== correct).slice(0, 3)].sort(() => Math.random() - 0.5);

    return {
      sequence,
      missing,
      options,
      correct,
      explanation,
      concept,
      visualExample,
      relatedLinks: [
        { title: 'Math Playground - Pattern Games', url: 'https://www.mathplayground.com/pattern_blocks.html' },
        { title: 'Education.com - Pattern Recognition', url: 'https://www.education.com/worksheets/patterns/' },
        { title: 'BrainGymmer - Pattern Memory', url: 'https://www.braingymmer.com/en/brain-games/pattern-memory/' }
      ]
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setGameActive(true);
    setScore(0);
    setRound(1);
    setTimer(0);
    setHintsUsed(0);
    generateNewPattern();
  };

  const generateNewPattern = () => {
    setCurrentPattern(generatePattern());
    setSelectedAnswer('');
    setShowResult(false);
  };

  const submitAnswer = () => {
    if (!currentPattern || !selectedAnswer) return;

    const isCorrect = selectedAnswer === currentPattern.correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const nextRound = () => {
    if (round < 10) {
      setRound(round + 1);
      generateNewPattern();
    } else {
      setGameActive(false);
    }
  };

  const useHint = () => {
    if (!currentPattern || hintsUsed >= 3) return;
    
    const hints = [
      'Look for a repeating pattern in the sequence',
      'Count how many times each element appears',
      `The missing element should be: ${currentPattern.correct}`
    ];
    
    alert(hints[hintsUsed] || 'No more hints available');
    setHintsUsed(hintsUsed + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Pattern Recognition</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-indigo-500 text-white hover:bg-indigo-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Pattern Recognition Concepts</DialogTitle>
                <DialogDescription>Enhance visual and logical pattern detection skills</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Pattern Types</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Alternating:</strong> Two elements that repeat in sequence</li>
                    <li><strong>Repeating:</strong> A group of elements that cycles</li>
                    <li><strong>Sequential:</strong> Elements follow a logical order</li>
                    <li><strong>Growing:</strong> Patterns that increase in complexity</li>
                  </ul>
                </div>
                <div className="animate-scale-in bg-indigo-100 p-4 rounded-lg">
                  <h4 className="font-bold">💡 Recognition Tips:</h4>
                  <p>Look for repetitions, count elements, and identify the rule governing the sequence!</p>
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
                <label className="block text-sm font-medium mb-1">Pattern Type</label>
                <Select value={patternType} onValueChange={(value) => setPatternType(value as PatternType)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colors">🎨 Colors</SelectItem>
                    <SelectItem value="shapes">🔷 Shapes</SelectItem>
                    <SelectItem value="numbers">🔢 Numbers</SelectItem>
                    <SelectItem value="mixed">🎯 Mixed</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={startGame} className="bg-indigo-500 hover:bg-indigo-600">
                {gameStarted ? 'New Game' : 'Start Game'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameStarted && currentPattern && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                Round {round}/10 - Score: {score} - Time: {formatTime(timer)} - Hints: {hintsUsed}/3
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg mb-4">Find the missing element in this pattern:</h3>
                
                <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
                  {currentPattern.sequence.map((item, index) => (
                    <div
                      key={index}
                      className={`w-16 h-16 flex items-center justify-center text-3xl border-2 rounded-lg ${
                        item === '?' ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                      } animate-scale-in`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-md mx-auto">
                  {currentPattern.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className="h-16 text-2xl animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setSelectedAnswer(option)}
                      disabled={showResult}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2 justify-center">
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
                    selectedAnswer === currentPattern.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <h4 className={`text-xl font-bold mb-2 ${
                      selectedAnswer === currentPattern.correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {selectedAnswer === currentPattern.correct ? '✅ Correct!' : '❌ Incorrect'}
                    </h4>
                    <p className="mb-2">
                      <strong>Correct Answer:</strong> {currentPattern.correct}
                    </p>
                    <p className="mb-4">{currentPattern.explanation}</p>
                    
                    <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 mb-4">
                      <h5 className="font-bold text-indigo-800 mb-2">🧠 Concept:</h5>
                      <p className="text-indigo-700 mb-2">{currentPattern.concept}</p>
                      <div className="bg-indigo-50 p-3 rounded mt-2">
                        <p className="text-indigo-600 font-mono text-sm">{currentPattern.visualExample}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h5 className="font-bold text-blue-800 mb-2">🔗 Learn More:</h5>
                      <div className="space-y-1">
                        {currentPattern.relatedLinks.map((link, index) => (
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
                    
                    <Button onClick={nextRound} className="mt-4 bg-indigo-500 hover:bg-indigo-600">
                      {round < 10 ? 'Next Pattern →' : 'View Results'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!gameActive && round > 1 && (
          <Card className="bg-white/95">
            <CardContent className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
              <p className="text-lg mb-2">Final Score: {score}/10</p>
              <p className="text-lg mb-4">Time: {formatTime(timer)}</p>
              <div className="text-lg mb-4">
                Performance: {score >= 8 ? '🏆 Excellent!' : score >= 6 ? '⭐ Great!' : score >= 4 ? '👍 Good!' : '📚 Keep Learning!'}
              </div>
              <Button onClick={startGame} className="bg-indigo-500 hover:bg-indigo-600">
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
