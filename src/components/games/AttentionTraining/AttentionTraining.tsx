
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface AttentionTrainingProps {
  onBack: () => void;
}

type TaskType = 'sustained_attention' | 'selective_attention' | 'divided_attention' | 'attention_switching';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export const AttentionTraining: React.FC<AttentionTrainingProps> = ({ onBack }) => {
  const [taskType, setTaskType] = useState<TaskType>('sustained_attention');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStimulus, setCurrentStimulus] = useState<string>('');
  const [showStimulus, setShowStimulus] = useState(false);
  const [targetStimulus, setTargetStimulus] = useState<string>('X');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [stimulusStartTime, setStimulusStartTime] = useState<number>(0);
  const [showConcept, setShowConcept] = useState(false);
  const [trial, setTrial] = useState(0);
  const [maxTrials] = useState(50);

  const stimuli = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'X', 'Y', 'Z'];
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

  useEffect(() => {
    if (gameStarted && trial < maxTrials) {
      const isTarget = Math.random() < 0.3; // 30% target trials
      const stimulus = isTarget ? targetStimulus : stimuli[Math.floor(Math.random() * (stimuli.length - 1))];
      
      setTimeout(() => {
        setCurrentStimulus(stimulus);
        setShowStimulus(true);
        setStimulusStartTime(Date.now());
        
        setTimeout(() => {
          setShowStimulus(false);
          setTrial(prev => prev + 1);
        }, getDifficultySettings().stimulusDuration);
      }, getDifficultySettings().interStimulusInterval);
    }
  }, [trial, gameStarted]);

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy':
        return { stimulusDuration: 1000, interStimulusInterval: 2000 };
      case 'medium':
        return { stimulusDuration: 800, interStimulusInterval: 1500 };
      case 'hard':
        return { stimulusDuration: 600, interStimulusInterval: 1000 };
      case 'expert':
        return { stimulusDuration: 400, interStimulusInterval: 800 };
    }
  };

  const handleResponse = () => {
    if (!showStimulus) return;
    
    const reactionTime = Date.now() - stimulusStartTime;
    
    if (currentStimulus === targetStimulus) {
      setScore(prev => prev + 10);
      setReactionTimes(prev => [...prev, reactionTime]);
    }
    
    setShowStimulus(false);
    setTrial(prev => prev + 1);
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTrial(0);
    setReactionTimes([]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setTrial(0);
    setScore(0);
    setReactionTimes([]);
  };

  const getAverageReactionTime = () => {
    if (reactionTimes.length === 0) return 0;
    return Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🎯 Attention Training</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-orange-500 text-white hover:bg-orange-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Attention & Focus Training</DialogTitle>
                <DialogDescription>Improve your ability to focus and maintain attention</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">🎯 Types of Attention</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Sustained:</strong> Maintaining focus over extended periods</li>
                    <li><strong>Selective:</strong> Focusing on relevant information while ignoring distractors</li>
                    <li><strong>Divided:</strong> Splitting attention between multiple tasks</li>
                    <li><strong>Switching:</strong> Rapidly shifting focus between different tasks</li>
                  </ul>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Attention" target="_blank" className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">Attention</a>
                    <a href="https://en.wikipedia.org/wiki/Sustained_attention" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Sustained Attention</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Attention Training Setup</CardTitle>
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
                      <SelectItem value="sustained_attention">Sustained Attention</SelectItem>
                      <SelectItem value="selective_attention">Selective Attention</SelectItem>
                      <SelectItem value="divided_attention">Divided Attention</SelectItem>
                      <SelectItem value="attention_switching">Attention Switching</SelectItem>
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
                <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
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
                  <span>Trial: {trial}/{maxTrials}</span>
                  <span>Score: {score}</span>
                  <span>Avg RT: {getAverageReactionTime()}ms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg mb-4">Press SPACEBAR when you see the target: <strong>{targetStimulus}</strong></p>
                
                <div className="h-48 flex items-center justify-center">
                  {showStimulus && (
                    <div className="text-8xl font-bold animate-pulse">
                      {currentStimulus}
                    </div>
                  )}
                  {!showStimulus && trial < maxTrials && (
                    <div className="text-4xl text-gray-400">+</div>
                  )}
                </div>
                
                {trial >= maxTrials && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Training Complete!</h2>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold">{score}</div>
                        <div className="text-sm">Total Score</div>
                      </div>
                      <div className="bg-green-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold">{getAverageReactionTime()}ms</div>
                        <div className="text-sm">Avg Reaction Time</div>
                      </div>
                      <div className="bg-purple-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold">{Math.round((score / (maxTrials * 3)) * 100)}%</div>
                        <div className="text-sm">Accuracy</div>
                      </div>
                    </div>
                    <Button onClick={resetGame} className="bg-orange-500 hover:bg-orange-600">
                      Train Again
                    </Button>
                  </div>
                )}
                
                <div className="mt-6">
                  <Button 
                    onClick={handleResponse}
                    disabled={!showStimulus}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Respond (Spacebar)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
