
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface WorkingMemoryProps {
  onBack: () => void;
}

type TaskType = 'n_back' | 'dual_n_back' | 'operation_span' | 'reading_span' | 'spatial_span';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface Trial {
  stimulus: string;
  position?: { x: number; y: number };
  isTarget: boolean;
  operation?: string;
  operationResult?: number;
}

export const WorkingMemory: React.FC<WorkingMemoryProps> = ({ onBack }) => {
  const [taskType, setTaskType] = useState<TaskType>('n_back');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [nBackLevel, setNBackLevel] = useState(2);
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showStimulus, setShowStimulus] = useState(false);
  const [userResponse, setUserResponse] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showConcept, setShowConcept] = useState(false);
  const [sequenceMemory, setSequenceMemory] = useState<string[]>([]);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const positions = [
    { x: 100, y: 100 }, { x: 200, y: 100 }, { x: 300, y: 100 },
    { x: 100, y: 200 }, { x: 200, y: 200 }, { x: 300, y: 200 },
    { x: 100, y: 300 }, { x: 200, y: 300 }, { x: 300, y: 300 }
  ];

  useEffect(() => {
    if (gameStarted) {
      generateTrials();
    }
  }, [gameStarted, taskType, difficulty, nBackLevel]);

  useEffect(() => {
    if (gameStarted && currentTrial < trials.length) {
      setShowStimulus(true);
      setUserResponse(null);
      setFeedback(null);
      
      const timer = setTimeout(() => {
        setShowStimulus(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentTrial, gameStarted]);

  const generateTrials = () => {
    const trialCount = 20;
    const newTrials: Trial[] = [];
    
    for (let i = 0; i < trialCount; i++) {
      let trial: Trial;
      
      switch (taskType) {
        case 'n_back':
          trial = generateNBackTrial(i, newTrials);
          break;
        case 'dual_n_back':
          trial = generateDualNBackTrial(i, newTrials);
          break;
        case 'operation_span':
          trial = generateOperationSpanTrial();
          break;
        case 'reading_span':
          trial = generateReadingSpanTrial();
          break;
        case 'spatial_span':
          trial = generateSpatialSpanTrial();
          break;
        default:
          trial = generateNBackTrial(i, newTrials);
      }
      
      newTrials.push(trial);
    }
    
    setTrials(newTrials);
    setCurrentTrial(0);
  };

  const generateNBackTrial = (index: number, existingTrials: Trial[]): Trial => {
    const stimulus = letters[Math.floor(Math.random() * letters.length)];
    const isTarget = index >= nBackLevel && 
                    existingTrials[index - nBackLevel]?.stimulus === stimulus;
    
    return { stimulus, isTarget };
  };

  const generateDualNBackTrial = (index: number, existingTrials: Trial[]): Trial => {
    const stimulus = letters[Math.floor(Math.random() * letters.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    const letterMatch = index >= nBackLevel && 
                       existingTrials[index - nBackLevel]?.stimulus === stimulus;
    const positionMatch = index >= nBackLevel &&
                         existingTrials[index - nBackLevel]?.position?.x === position.x &&
                         existingTrials[index - nBackLevel]?.position?.y === position.y;
    
    return { 
      stimulus, 
      position, 
      isTarget: letterMatch || positionMatch 
    };
  };

  const generateOperationSpanTrial = (): Trial => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let result: number;
    switch (operation) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = Math.abs(num1 - num2);
        break;
      case '*':
        result = num1 * num2;
        break;
      default:
        result = num1 + num2;
    }
    
    // Sometimes give wrong answer
    const isCorrect = Math.random() > 0.3;
    const displayResult = isCorrect ? result : result + Math.floor(Math.random() * 10) + 1;
    
    return {
      stimulus: letters[Math.floor(Math.random() * letters.length)],
      operation: `${num1} ${operation} ${num2} = ${displayResult}`,
      operationResult: displayResult,
      isTarget: isCorrect
    };
  };

  const generateReadingSpanTrial = (): Trial => {
    const sentences = [
      "The cat sat on the mat",
      "Birds fly in the sky",
      "Water flows down the river",
      "Children play in the park",
      "Books contain many stories"
    ];
    
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    const makes_sense = Math.random() > 0.3;
    
    return {
      stimulus: letters[Math.floor(Math.random() * letters.length)],
      operation: makes_sense ? sentence : sentence.split(' ').reverse().join(' '),
      isTarget: makes_sense
    };
  };

  const generateSpatialSpanTrial = (): Trial => {
    return {
      stimulus: '',
      position: positions[Math.floor(Math.random() * positions.length)],
      isTarget: false
    };
  };

  const handleResponse = (response: boolean) => {
    if (currentTrial >= trials.length) return;
    
    setUserResponse(response);
    const trial = trials[currentTrial];
    const isCorrect = response === trial.isTarget;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    if (taskType === 'spatial_span' || taskType === 'reading_span') {
      setSequenceMemory(prev => [...prev, trial.stimulus]);
    }
    
    setTimeout(() => {
      setCurrentTrial(prev => prev + 1);
    }, 1000);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setSequenceMemory([]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentTrial(0);
    setTrials([]);
    setScore(0);
    setSequenceMemory([]);
  };

  const getCurrentInstructions = () => {
    switch (taskType) {
      case 'n_back':
        return `Press YES if the letter matches the one from ${nBackLevel} trials back`;
      case 'dual_n_back':
        return `Press YES if either the letter OR position matches ${nBackLevel} trials back`;
      case 'operation_span':
        return 'Press YES if the math equation is correct, remember the letter';
      case 'reading_span':
        return 'Press YES if the sentence makes sense, remember the letter';
      case 'spatial_span':
        return 'Remember the sequence of positions shown';
      default:
        return 'Follow the instructions for the current task';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🔄 Working Memory Training</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Working Memory & Cognitive Control</DialogTitle>
                <DialogDescription>Strengthen your brain's ability to hold and manipulate information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">🔄 Working Memory Components</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>N-Back:</strong> Remember stimuli from N steps back in sequence</li>
                    <li><strong>Dual N-Back:</strong> Track both visual and auditory information</li>
                    <li><strong>Operation Span:</strong> Math processing while remembering items</li>
                    <li><strong>Reading Span:</strong> Sentence comprehension with memory load</li>
                    <li><strong>Spatial Span:</strong> Remember sequences of spatial locations</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Working_memory" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Working Memory</a>
                    <a href="https://en.wikipedia.org/wiki/N-back" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">N-Back Task</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Working Memory Training Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Type</label>
                  <Select value={taskType} onValueChange={(value) => setTaskType(value as TaskType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="n_back">N-Back</SelectItem>
                      <SelectItem value="dual_n_back">Dual N-Back</SelectItem>
                      <SelectItem value="operation_span">Operation Span</SelectItem>
                      <SelectItem value="reading_span">Reading Span</SelectItem>
                      <SelectItem value="spatial_span">Spatial Span</SelectItem>
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
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(taskType === 'n_back' || taskType === 'dual_n_back') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">N-Back Level</label>
                    <Select value={nBackLevel.toString()} onValueChange={(value) => setNBackLevel(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1-Back</SelectItem>
                        <SelectItem value="2">2-Back</SelectItem>
                        <SelectItem value="3">3-Back</SelectItem>
                        <SelectItem value="4">4-Back</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
                  Start Training
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 bg-white/95">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Trial: {currentTrial + 1}/20</span>
                  <span>Score: {score}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg mb-4">{getCurrentInstructions()}</p>
                
                {currentTrial < trials.length && (
                  <div className="mb-6">
                    {showStimulus && (
                      <div className="relative">
                        {trials[currentTrial].position && (
                          <div 
                            className="absolute w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                            style={{
                              left: trials[currentTrial].position!.x,
                              top: trials[currentTrial].position!.y
                            }}
                          >
                            {trials[currentTrial].stimulus}
                          </div>
                        )}
                        {!trials[currentTrial].position && (
                          <div className="text-6xl font-bold mb-4">
                            {trials[currentTrial].stimulus}
                          </div>
                        )}
                        {trials[currentTrial].operation && (
                          <div className="text-2xl mt-4">
                            {trials[currentTrial].operation}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {!showStimulus && userResponse === null && (
                      <div className="space-x-4">
                        <Button 
                          onClick={() => handleResponse(true)}
                          className="bg-green-500 hover:bg-green-600 px-8"
                        >
                          YES
                        </Button>
                        <Button 
                          onClick={() => handleResponse(false)}
                          className="bg-red-500 hover:bg-red-600 px-8"
                        >
                          NO
                        </Button>
                      </div>
                    )}
                    
                    {feedback && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <p className="text-lg font-bold">
                          {feedback === 'correct' ? '✅ Correct!' : '❌ Incorrect'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {currentTrial >= trials.length && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Training Complete!</h2>
                    <p className="text-xl mb-6">Final Score: {score}/200</p>
                    <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600">
                      Train Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
