
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface CodingGameProps {
  onBack: () => void;
}

type ProgrammingConcept = 'sequences' | 'loops' | 'conditionals' | 'functions' | 'variables' | 'debugging';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface CodingChallenge {
  id: number;
  title: string;
  description: string;
  concept: ProgrammingConcept;
  difficulty: Difficulty;
  instructions: string[];
  expectedOutput: string;
  codeTemplate: string;
  solution: string;
  hints: string[];
}

export const CodingGame: React.FC<CodingGameProps> = ({ onBack }) => {
  const [concept, setConcept] = useState<ProgrammingConcept>('sequences');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [currentChallenge, setCurrentChallenge] = useState<CodingChallenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Sample challenges
  const challenges: CodingChallenge[] = [
    {
      id: 1,
      title: 'Print Hello World',
      description: 'Write code to print "Hello, World!" to the output.',
      concept: 'sequences',
      difficulty: 'beginner',
      instructions: ['Use the print() function to display text'],
      expectedOutput: 'Hello, World!',
      codeTemplate: '// Write your code here\n',
      solution: 'print("Hello, World!");',
      hints: ['You need to use the print function', 'Text needs to be in quotes']
    },
    {
      id: 2,
      title: 'Counting Loop',
      description: 'Write code that prints numbers from 1 to 5.',
      concept: 'loops',
      difficulty: 'beginner',
      instructions: ['Use a for loop to count from 1 to 5', 'Print each number'],
      expectedOutput: '1\n2\n3\n4\n5',
      codeTemplate: '// Write a loop to print numbers 1 to 5\n',
      solution: 'for (let i = 1; i <= 5; i++) {\n  print(i);\n}',
      hints: ['Use a for loop', 'Start your counter at 1', 'End when counter > 5']
    },
    {
      id: 3,
      title: 'If-Else Decision',
      description: 'Write code that prints "Even" if a number is even, and "Odd" if it is odd.',
      concept: 'conditionals',
      difficulty: 'beginner',
      instructions: ['Check if number % 2 equals 0', 'Use if-else statement'],
      expectedOutput: 'Even',
      codeTemplate: 'let number = 8;\n// Write your code here\n',
      solution: 'let number = 8;\nif (number % 2 === 0) {\n  print("Even");\n} else {\n  print("Odd");\n}',
      hints: ['Use the modulo operator %', 'If number % 2 equals 0, the number is even']
    },
    {
      id: 4,
      title: 'Simple Function',
      description: 'Write a function that adds two numbers and returns the result.',
      concept: 'functions',
      difficulty: 'intermediate',
      instructions: ['Define a function called "add"', 'The function should take two parameters', 'Return the sum'],
      expectedOutput: '8',
      codeTemplate: '// Define your function here\n\n// Test case:\nprint(add(3, 5));',
      solution: 'function add(a, b) {\n  return a + b;\n}\n\nprint(add(3, 5));',
      hints: ['Start with "function add(a, b) {"', 'Use the return keyword to return a value']
    }
  ];

  useEffect(() => {
    if (gameStarted) {
      const filteredChallenges = challenges.filter(
        c => c.concept === concept && c.difficulty === difficulty
      );
      if (filteredChallenges.length > 0) {
        const challenge = filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
        setCurrentChallenge(challenge);
        setUserCode(challenge.codeTemplate);
        setOutput('');
        setIsCorrect(null);
        setShowSolution(false);
        setCurrentHintIndex(-1);
      }
    }
  }, [gameStarted, concept, difficulty]);

  const runCode = () => {
    try {
      // Simulate code execution (in a real app, you'd have a safe code execution environment)
      const simulateOutput = () => {
        if (!currentChallenge) return '';
        
        // This is just a simplified simulation - it won't actually execute JavaScript
        if (currentChallenge.id === 1 && userCode.includes('print("Hello, World!")')) {
          return 'Hello, World!';
        } else if (currentChallenge.id === 2 && userCode.includes('for') && userCode.includes('print(i)')) {
          return '1\n2\n3\n4\n5';
        } else if (currentChallenge.id === 3 && userCode.includes('if') && userCode.includes('Even')) {
          return 'Even';
        } else if (currentChallenge.id === 4 && userCode.includes('function add') && userCode.includes('return')) {
          return '8';
        }
        
        return 'Output not matching expected result';
      };
      
      const simulatedOutput = simulateOutput();
      setOutput(simulatedOutput);
      
      if (currentChallenge && simulatedOutput === currentChallenge.expectedOutput) {
        setIsCorrect(true);
        setScore(prev => prev + 10);
      } else {
        setIsCorrect(false);
      }
    } catch (error) {
      setOutput('Error executing code');
      setIsCorrect(false);
    }
  };

  const revealHint = () => {
    if (!currentChallenge) return;
    
    if (currentHintIndex < currentChallenge.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const nextChallenge = () => {
    const otherChallenges = challenges.filter(
      c => c.id !== currentChallenge?.id && c.concept === concept && c.difficulty === difficulty
    );
    if (otherChallenges.length > 0) {
      const challenge = otherChallenges[Math.floor(Math.random() * otherChallenges.length)];
      setCurrentChallenge(challenge);
      setUserCode(challenge.codeTemplate);
      setOutput('');
      setIsCorrect(null);
      setShowSolution(false);
      setCurrentHintIndex(-1);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">💻 Coding Adventure</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Learning to Code</DialogTitle>
                <DialogDescription>Develop computational thinking and problem-solving skills</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">💻 Coding Concepts</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Sequences:</strong> Step-by-step instructions executed in order</li>
                    <li><strong>Loops:</strong> Repeating actions multiple times</li>
                    <li><strong>Conditionals:</strong> Making decisions based on conditions</li>
                    <li><strong>Functions:</strong> Reusable blocks of code</li>
                    <li><strong>Variables:</strong> Storing and manipulating data</li>
                    <li><strong>Debugging:</strong> Finding and fixing errors in code</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Computational_thinking" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Computational Thinking</a>
                    <a href="https://en.wikipedia.org/wiki/Computer_programming" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Programming</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Code Learning Center</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Programming Concept</label>
                  <Select value={concept} onValueChange={(value) => setConcept(value as ProgrammingConcept)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequences">Sequences</SelectItem>
                      <SelectItem value="loops">Loops</SelectItem>
                      <SelectItem value="conditionals">Conditionals</SelectItem>
                      <SelectItem value="functions">Functions</SelectItem>
                      <SelectItem value="variables">Variables</SelectItem>
                      <SelectItem value="debugging">Debugging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
                  Start Coding
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {currentChallenge && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/95">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{currentChallenge.title}</span>
                      <span className="text-sm">Score: {score}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-1">Description:</h3>
                      <p>{currentChallenge.description}</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Instructions:</h3>
                      <ol className="list-decimal list-inside space-y-1">
                        {currentChallenge.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Expected Output:</h3>
                      <pre className="bg-gray-100 p-2 rounded-lg whitespace-pre-wrap">{currentChallenge.expectedOutput}</pre>
                    </div>
                    
                    {currentHintIndex >= 0 && (
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <h3 className="font-bold mb-1">Hint:</h3>
                        <p>{currentChallenge.hints[currentHintIndex]}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        onClick={revealHint} 
                        variant="outline" 
                        disabled={currentHintIndex >= currentChallenge.hints.length - 1}
                      >
                        {currentHintIndex < 0 ? 'Get Hint' : 'Next Hint'}
                      </Button>
                      <Button 
                        onClick={() => setShowSolution(!showSolution)} 
                        variant="outline"
                      >
                        {showSolution ? 'Hide Solution' : 'Show Solution'}
                      </Button>
                      <Button 
                        onClick={nextChallenge}
                        disabled={isCorrect !== true}
                      >
                        Next Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/95">
                  <CardHeader>
                    <CardTitle>Code Editor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="font-mono text-sm h-40"
                    />
                    
                    <Button onClick={runCode}>Run Code</Button>
                    
                    <div>
                      <h3 className="font-bold mb-1">Output:</h3>
                      <pre
                        className={`p-2 rounded-lg whitespace-pre-wrap ${
                          isCorrect === null ? 'bg-gray-100' :
                          isCorrect ? 'bg-green-100' :
                          'bg-red-100'
                        }`}
                      >
                        {output || 'No output yet'}
                      </pre>
                    </div>
                    
                    {isCorrect !== null && (
                      <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        <p className="font-bold">
                          {isCorrect ? '✅ Correct! Well done!' : '❌ Not quite right, keep trying!'}
                        </p>
                      </div>
                    )}
                    
                    {showSolution && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h3 className="font-bold mb-1">Solution:</h3>
                        <pre className="bg-gray-100 p-2 rounded-lg whitespace-pre-wrap font-mono text-sm">
                          {currentChallenge.solution}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
