
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface ColorMemoryProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface ColorSequence {
  color: string;
  sound?: string;
}

export const ColorMemory: React.FC<ColorMemoryProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [sequence, setSequence] = useState<ColorSequence[]>([]);
  const [userSequence, setUserSequence] = useState<ColorSequence[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showConcept, setShowConcept] = useState(false);

  const colors = [
    { name: 'red', value: '#ef4444', sound: 'C' },
    { name: 'blue', value: '#3b82f6', sound: 'D' },
    { name: 'green', value: '#10b981', sound: 'E' },
    { name: 'yellow', value: '#f59e0b', sound: 'F' },
    { name: 'purple', value: '#8b5cf6', sound: 'G' },
    { name: 'orange', value: '#f97316', sound: 'A' },
    { name: 'pink', value: '#ec4899', sound: 'B' }
  ];

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy': return { speed: 1000, colors: 4 };
      case 'medium': return { speed: 800, colors: 6 };
      case 'hard': return { speed: 600, colors: 7 };
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentRound(1);
    setGameOver(false);
    setSequence([]);
    setUserSequence([]);
    generateNextRound();
  };

  const generateNextRound = () => {
    const settings = getDifficultySettings();
    const availableColors = colors.slice(0, settings.colors);
    const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    
    const newSequence = [...sequence, { color: newColor.name, sound: newColor.sound }];
    setSequence(newSequence);
    setUserSequence([]);
    setShowingSequence(true);
    setCurrentIndex(0);
    setFeedback('');
    
    playSequence(newSequence);
  };

  const playSequence = async (seq: ColorSequence[]) => {
    const settings = getDifficultySettings();
    
    for (let i = 0; i < seq.length; i++) {
      setCurrentIndex(i);
      await new Promise(resolve => setTimeout(resolve, settings.speed));
    }
    
    setCurrentIndex(-1);
    setShowingSequence(false);
  };

  const handleColorClick = (colorName: string) => {
    if (showingSequence || gameOver) return;
    
    const newUserSequence = [...userSequence, { color: colorName }];
    setUserSequence(newUserSequence);
    
    // Check if current input is correct
    const currentStep = newUserSequence.length - 1;
    if (newUserSequence[currentStep].color !== sequence[currentStep].color) {
      setGameOver(true);
      setFeedback('❌ Game Over! Wrong color in sequence.');
      return;
    }
    
    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      setScore(score + (currentRound * 10));
      setCurrentRound(currentRound + 1);
      setFeedback('✅ Correct! Get ready for the next round...');
      
      setTimeout(() => {
        generateNextRound();
      }, 1500);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setSequence([]);
    setUserSequence([]);
    setCurrentRound(1);
    setScore(0);
    setFeedback('');
  };

  const goBack = () => {
    if (gameStarted) {
      resetGame();
    } else {
      onBack();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={goBack} variant="outline">
              ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white">🌈 Color Memory</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white">🧠 Concept</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Color Memory Training</DialogTitle>
                <DialogDescription>Enhance your sequential memory and pattern recognition</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🌈 How it Works</h3>
                  <p>Watch the sequence of colors carefully, then repeat it back in the exact same order. Each round adds one more color to remember!</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🧠 Benefits</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Improves working memory</li>
                    <li>Enhances attention span</li>
                    <li>Develops pattern recognition</li>
                    <li>Strengthens sequential processing</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Strategy Tips:</h4>
                  <p>Try to create mental associations or stories with the colors. Some people find it helpful to say the colors out loud or create a rhythm!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Color Memory Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger className="w-48 mx-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (4 colors, slower)</SelectItem>
                      <SelectItem value="medium">Medium (6 colors, medium)</SelectItem>
                      <SelectItem value="hard">Hard (7 colors, faster)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Memorize and repeat color sequences. Each round adds one more color!
                </p>
                
                <Button onClick={startGame} className="bg-rainbow bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white px-8 py-3 text-lg">
                  Start Color Memory Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>Round: {currentRound}</span>
                <span>Score: {score}</span>
                <span>Length: {sequence.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                {showingSequence ? (
                  <div className="mb-6">
                    <p className="text-lg mb-4">Watch the sequence carefully...</p>
                    <div className="text-sm text-gray-600">Step {currentIndex + 1} of {sequence.length}</div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-lg mb-4">
                      {gameOver ? 'Game Over!' : 'Repeat the sequence by clicking the colors'}
                    </p>
                    <div className="text-sm text-gray-600">
                      Progress: {userSequence.length} / {sequence.length}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                  {colors.slice(0, getDifficultySettings().colors).map((color, index) => (
                    <Button
                      key={color.name}
                      className={`w-20 h-20 border-4 transition-all duration-300 transform ${
                        showingSequence && currentIndex >= 0 && sequence[currentIndex]?.color === color.name
                          ? 'scale-110 border-white shadow-2xl animate-pulse'
                          : 'border-gray-300 hover:scale-105'
                      } ${
                        userSequence.some(seq => seq.color === color.name) && !showingSequence
                          ? 'ring-4 ring-blue-400'
                          : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorClick(color.name)}
                      disabled={showingSequence}
                    >
                      <span className="text-white font-bold text-sm capitalize">
                        {color.name}
                      </span>
                    </Button>
                  ))}
                </div>

                {feedback && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    feedback.includes('Correct') ? 'bg-green-100 text-green-800' :
                    feedback.includes('Game Over') ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {feedback}
                  </div>
                )}

                {gameOver && (
                  <div className="text-center space-y-4">
                    <p className="text-xl">Final Score: {score}</p>
                    <p className="text-lg">You reached Round {currentRound}</p>
                    <p className="text-lg">Sequence Length: {sequence.length}</p>
                    <Button onClick={resetGame} className="bg-green-500 hover:bg-green-600">
                      Play Again
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
