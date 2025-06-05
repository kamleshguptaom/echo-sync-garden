
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface VisualPerceptionProps {
  onBack: () => void;
}

type TaskType = 'visual_search' | 'figure_ground' | 'visual_closure' | 'spatial_relations' | 'visual_memory';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface Task {
  id: number;
  type: TaskType;
  target: string;
  items: string[];
  correct: number[];
  timeLimit: number;
}

export const VisualPerception: React.FC<VisualPerceptionProps> = ({ onBack }) => {
  const [taskType, setTaskType] = useState<TaskType>('visual_search');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (timeLeft > 0 && gameStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentTask) {
      checkAnswer();
    }
  }, [timeLeft, gameStarted]);

  const generateTask = (): Task => {
    const shapes = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⭐', '🔺', '🔶', '💎'];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    switch (taskType) {
      case 'visual_search':
        return generateVisualSearchTask(shapes);
      case 'figure_ground':
        return generateFigureGroundTask(shapes);
      case 'visual_closure':
        return generateVisualClosureTask(letters);
      case 'spatial_relations':
        return generateSpatialRelationsTask();
      case 'visual_memory':
        return generateVisualMemoryTask(shapes);
      default:
        return generateVisualSearchTask(shapes);
    }
  };

  const generateVisualSearchTask = (shapes: string[]): Task => {
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    const itemCount = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 20 : difficulty === 'hard' ? 30 : 40;
    const targetCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    
    const items: string[] = [];
    const correct: number[] = [];
    
    // Add target items at random positions
    for (let i = 0; i < targetCount; i++) {
      const position = Math.floor(Math.random() * itemCount);
      if (!correct.includes(position)) {
        correct.push(position);
      }
    }
    
    // Fill all positions
    for (let i = 0; i < itemCount; i++) {
      if (correct.includes(i)) {
        items[i] = target;
      } else {
        let randomShape;
        do {
          randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        } while (randomShape === target);
        items[i] = randomShape;
      }
    }
    
    return {
      id: Date.now(),
      type: 'visual_search',
      target,
      items,
      correct,
      timeLimit: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20
    };
  };

  const generateFigureGroundTask = (shapes: string[]): Task => {
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    const itemCount = 16;
    const items: string[] = [];
    const correct: number[] = [];
    
    // Create overlapping pattern simulation
    for (let i = 0; i < itemCount; i++) {
      if (Math.random() < 0.3) {
        items[i] = target;
        correct.push(i);
      } else {
        items[i] = shapes[Math.floor(Math.random() * shapes.length)];
      }
    }
    
    return {
      id: Date.now(),
      type: 'figure_ground',
      target,
      items,
      correct,
      timeLimit: 25
    };
  };

  const generateVisualClosureTask = (letters: string[]): Task => {
    const target = letters[Math.floor(Math.random() * letters.length)];
    const items = Array(9).fill('').map(() => {
      return Math.random() < 0.3 ? target + '?' : letters[Math.floor(Math.random() * letters.length)];
    });
    
    const correct = items.map((item, index) => item.includes(target) ? index : -1).filter(i => i !== -1);
    
    return {
      id: Date.now(),
      type: 'visual_closure',
      target,
      items,
      correct,
      timeLimit: 20
    };
  };

  const generateSpatialRelationsTask = (): Task => {
    const positions = ['↑', '↓', '←', '→', '↖', '↗', '↙', '↘'];
    const target = positions[Math.floor(Math.random() * positions.length)];
    const items = Array(12).fill('').map(() => positions[Math.floor(Math.random() * positions.length)]);
    const correct = items.map((item, index) => item === target ? index : -1).filter(i => i !== -1);
    
    return {
      id: Date.now(),
      type: 'spatial_relations',
      target,
      items,
      correct,
      timeLimit: 15
    };
  };

  const generateVisualMemoryTask = (shapes: string[]): Task => {
    const itemCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 9 : 12;
    const items = Array(itemCount).fill('').map(() => shapes[Math.floor(Math.random() * shapes.length)]);
    
    return {
      id: Date.now(),
      type: 'visual_memory',
      target: 'Remember the pattern',
      items,
      correct: [],
      timeLimit: difficulty === 'easy' ? 8 : difficulty === 'medium' ? 6 : 4
    };
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLevel(1);
    nextTask();
  };

  const nextTask = () => {
    const task = generateTask();
    setCurrentTask(task);
    setSelectedItems([]);
    setFeedback(null);
    setTimeLeft(task.timeLimit);
  };

  const handleItemClick = (index: number) => {
    if (!currentTask || timeLeft === 0) return;
    
    setSelectedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const checkAnswer = () => {
    if (!currentTask) return;
    
    const isCorrect = currentTask.correct.length === selectedItems.length &&
                      currentTask.correct.every(item => selectedItems.includes(item));
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + (10 * level));
    }
    
    setTimeout(() => {
      setLevel(prev => prev + 1);
      nextTask();
    }, 2000);
  };

  const getTaskInstructions = () => {
    switch (taskType) {
      case 'visual_search':
        return `Find all instances of the target shape: ${currentTask?.target}`;
      case 'figure_ground':
        return `Identify the target shape in the complex pattern: ${currentTask?.target}`;
      case 'visual_closure':
        return `Find incomplete letters that match: ${currentTask?.target}`;
      case 'spatial_relations':
        return `Find all arrows pointing in direction: ${currentTask?.target}`;
      case 'visual_memory':
        return 'Study the pattern, then recreate it from memory';
      default:
        return 'Complete the visual task';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">👁️ Visual Perception Training</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Visual Processing & Perception</DialogTitle>
                <DialogDescription>Strengthen how your brain interprets visual information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">👁️ Visual Perception Skills</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Visual Search:</strong> Quickly locate specific targets among distractors</li>
                    <li><strong>Figure-Ground:</strong> Distinguish objects from their background</li>
                    <li><strong>Visual Closure:</strong> Recognize incomplete or partially hidden objects</li>
                    <li><strong>Spatial Relations:</strong> Understand position and orientation in space</li>
                    <li><strong>Visual Memory:</strong> Remember and reproduce visual patterns</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Visual_perception" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Visual Perception</a>
                    <a href="https://en.wikipedia.org/wiki/Visual_processing" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Visual Processing</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Visual Perception Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Type</label>
                  <Select value={taskType} onValueChange={(value) => setTaskType(value as TaskType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual_search">Visual Search</SelectItem>
                      <SelectItem value="figure_ground">Figure-Ground</SelectItem>
                      <SelectItem value="visual_closure">Visual Closure</SelectItem>
                      <SelectItem value="spatial_relations">Spatial Relations</SelectItem>
                      <SelectItem value="visual_memory">Visual Memory</SelectItem>
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
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600">
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
                  <span>Level: {level}</span>
                  <span>Score: {score}</span>
                  <span>Time: {timeLeft}s</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {currentTask && (
                  <>
                    <p className="text-lg mb-4">{getTaskInstructions()}</p>
                    <div className={`grid gap-2 ${
                      currentTask.items.length <= 12 ? 'grid-cols-4' : 
                      currentTask.items.length <= 20 ? 'grid-cols-5' : 'grid-cols-6'
                    } max-w-2xl mx-auto`}>
                      {currentTask.items.map((item, index) => (
                        <Button
                          key={index}
                          className={`h-16 text-2xl ${
                            selectedItems.includes(index) ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                          onClick={() => handleItemClick(index)}
                          disabled={timeLeft === 0}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                    
                    {feedback && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <p className="text-lg font-bold">
                          {feedback === 'correct' ? '✅ Correct!' : '❌ Try again next time!'}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Button onClick={checkAnswer} disabled={timeLeft === 0 || !!feedback}>
                        Submit Answer
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
