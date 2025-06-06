
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface WorkingMemoryProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'nback' | 'sequence' | 'mental-math' | 'visual-span';

interface SequenceItem {
  id: number;
  color: string;
  position: number;
  letter?: string;
  number?: number;
}

export const WorkingMemory: React.FC<WorkingMemoryProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('nback');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSequence, setCurrentSequence] = useState<SequenceItem[]>([]);
  const [userSequence, setUserSequence] = useState<SequenceItem[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showSequence, setShowSequence] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);

  const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ff8844', '#8844ff'];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy': return { sequenceLength: 3, displayTime: 1000, nBackLevel: 1 };
      case 'medium': return { sequenceLength: 5, displayTime: 800, nBackLevel: 2 };
      case 'hard': return { sequenceLength: 7, displayTime: 600, nBackLevel: 3 };
    }
  };

  const generateSequence = useCallback(() => {
    const settings = getDifficultySettings();
    const sequence: SequenceItem[] = [];
    
    for (let i = 0; i < settings.sequenceLength; i++) {
      sequence.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        position: Math.floor(Math.random() * 9),
        letter: letters[Math.floor(Math.random() * letters.length)],
        number: Math.floor(Math.random() * 9) + 1
      });
    }
    
    setCurrentSequence(sequence);
    setUserSequence([]);
    setCurrentItem(0);
    setShowSequence(true);
  }, [difficulty]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    setFeedback('');
    generateSequence();
  };

  const showNextItem = useCallback(() => {
    const settings = getDifficultySettings();
    
    if (currentItem < currentSequence.length) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, settings.displayTime);
    } else {
      setShowSequence(false);
    }
  }, [currentItem, currentSequence.length]);

  useEffect(() => {
    if (showSequence && currentItem <= currentSequence.length) {
      showNextItem();
    }
  }, [showSequence, currentItem, showNextItem]);

  const handleItemClick = (position: number, color: string) => {
    if (showSequence) return;
    
    const newItem: SequenceItem = {
      id: userSequence.length,
      color,
      position,
      letter: letters[position],
      number: position + 1
    };
    
    setUserSequence([...userSequence, newItem]);
  };

  const checkAnswer = () => {
    let correct = false;
    
    if (gameMode === 'sequence') {
      correct = userSequence.length === currentSequence.length &&
               userSequence.every((item, index) => 
                 item.position === currentSequence[index].position &&
                 item.color === currentSequence[index].color
               );
    } else if (gameMode === 'nback') {
      const nBackLevel = getDifficultySettings().nBackLevel;
      correct = userSequence.length > 0 && 
               currentSequence.length >= nBackLevel &&
               userSequence[0].position === currentSequence[currentSequence.length - nBackLevel - 1]?.position;
    }
    
    if (correct) {
      setScore(score + 10);
      setFeedback('✅ Correct! Well done!');
    } else {
      setFeedback('❌ Incorrect. Try to focus on the sequence.');
    }
    
    setTimeout(() => {
      setRound(round + 1);
      if (round < 10) {
        generateSequence();
        setFeedback('');
      } else {
        setGameStarted(false);
        setFeedback(`Game Complete! Final Score: ${score}/100`);
      }
    }, 2000);
  };

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={goBack} variant="outline" className="bg-white/90">
            ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
          </Button>
          <h1 className="text-4xl font-bold text-white">🔄 Working Memory Training</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Working Memory Training</DialogTitle>
                <DialogDescription>Enhance your cognitive processing and memory retention</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🧠 What is Working Memory?</h3>
                  <p>Working memory is your brain's ability to hold and manipulate information temporarily while performing cognitive tasks. It's like a mental workspace where you actively process information.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎯 Game Modes</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>N-Back:</strong> Remember positions from N steps back in sequence</li>
                    <li><strong>Sequence:</strong> Reproduce the exact order shown</li>
                    <li><strong>Mental Math:</strong> Perform calculations while remembering numbers</li>
                    <li><strong>Visual Span:</strong> Remember spatial patterns and colors</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 How to Play:</h4>
                  <p>1. Watch the sequence carefully<br/>
                     2. Remember positions and colors<br/>
                     3. Reproduce the pattern when prompted<br/>
                     4. Practice daily to improve working memory!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Working Memory Training Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (3 items)</SelectItem>
                      <SelectItem value="medium">Medium (5 items)</SelectItem>
                      <SelectItem value="hard">Hard (7 items)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Training Mode</label>
                  <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequence">Sequence Memory</SelectItem>
                      <SelectItem value="nback">N-Back Challenge</SelectItem>
                      <SelectItem value="mental-math">Mental Math</SelectItem>
                      <SelectItem value="visual-span">Visual Span</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center">
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  Start Training
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                Round {round}/10 - Score: {score} - Mode: {gameMode.replace('-', ' ').toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {showSequence ? (
                <div className="text-center">
                  <p className="text-lg mb-4">Watch and remember the sequence...</p>
                  <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                    {Array.from({ length: 9 }, (_, i) => {
                      const item = currentSequence[currentItem - 1];
                      const isActive = item && item.position === i;
                      return (
                        <div
                          key={i}
                          className={`w-16 h-16 rounded-lg border-2 transition-all duration-300 ${
                            isActive 
                              ? 'scale-110 border-yellow-400 animate-pulse' 
                              : 'border-gray-300'
                          }`}
                          style={{ 
                            backgroundColor: isActive ? item.color : '#f3f4f6' 
                          }}
                        />
                      );
                    })}
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Item {currentItem} of {currentSequence.length}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg mb-4">
                    {gameMode === 'nback' 
                      ? `Click the position that was shown ${getDifficultySettings().nBackLevel} steps back`
                      : 'Reproduce the sequence by clicking the positions in order'
                    }
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
                    {Array.from({ length: 9 }, (_, i) => (
                      <Button
                        key={i}
                        className="w-16 h-16 hover:scale-105 transition-transform"
                        onClick={() => handleItemClick(i, colors[i % colors.length])}
                        style={{ backgroundColor: userSequence.some(item => item.position === i) ? '#22c55e' : '#6b7280' }}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <Button onClick={checkAnswer} disabled={userSequence.length === 0}>
                      Submit Answer
                    </Button>
                    <Button onClick={() => setUserSequence([])} variant="outline">
                      Clear
                    </Button>
                    <Button onClick={() => { generateSequence(); }} variant="outline">
                      Skip
                    </Button>
                  </div>
                </div>
              )}

              {feedback && (
                <div className={`text-center p-4 rounded-lg ${
                  feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 
                  feedback.includes('Incorrect') ? 'bg-red-100 text-red-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {feedback}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
