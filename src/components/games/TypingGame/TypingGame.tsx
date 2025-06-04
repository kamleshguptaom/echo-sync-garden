
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface TypingGameProps {
  onBack: () => void;
}

export const TypingGame: React.FC<TypingGameProps> = ({ onBack }) => {
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showConcept, setShowConcept] = useState(false);

  const texts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all letters of the alphabet.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "Practice makes perfect. The more you type, the faster and more accurate you become.",
    "Technology is best when it brings people together and makes complex tasks simple."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive) {
      interval = setInterval(() => setTimer(timer => timer + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  const startGame = () => {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setCurrentText(randomText);
    setUserInput('');
    setGameStarted(true);
    setGameActive(true);
    setTimer(0);
    setWpm(0);
    setAccuracy(100);
  };

  const handleInputChange = (value: string) => {
    setUserInput(value);
    
    // Calculate WPM
    const wordsTyped = value.trim().split(' ').length;
    const timeInMinutes = timer / 60;
    if (timeInMinutes > 0) {
      setWpm(Math.round(wordsTyped / timeInMinutes));
    }
    
    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < Math.min(value.length, currentText.length); i++) {
      if (value[i] === currentText[i]) {
        correctChars++;
      }
    }
    const accuracyPercent = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
    setAccuracy(accuracyPercent);
    
    // Check if completed
    if (value === currentText) {
      setGameActive(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Typing Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Touch Typing Skills</DialogTitle>
                <DialogDescription>Improve typing speed and accuracy</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">⌨️ Typing Fundamentals</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use all ten fingers</li>
                    <li>Keep wrists straight</li>
                    <li>Don't look at the keyboard</li>
                    <li>Practice regularly</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h4 className="font-bold">💡 Speed Goals:</h4>
                  <p>Beginner: 20-30 WPM | Intermediate: 40-50 WPM | Advanced: 60+ WPM</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">
              {gameActive ? `WPM: ${wpm} | Accuracy: ${accuracy}% | Time: ${Math.floor(timer/60)}:${(timer%60).toString().padStart(2,'0')}` : 'Typing Challenge'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!gameStarted ? (
              <div className="text-center">
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600">
                  Start Typing Test
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-lg leading-relaxed font-mono">
                    {currentText.split('').map((char, index) => (
                      <span
                        key={index}
                        className={
                          index < userInput.length
                            ? userInput[index] === char
                              ? 'bg-green-200'
                              : 'bg-red-200'
                            : index === userInput.length
                            ? 'bg-yellow-200'
                            : ''
                        }
                      >
                        {char}
                      </span>
                    ))}
                  </p>
                </div>
                
                <textarea
                  value={userInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full h-32 p-4 border rounded-lg font-mono"
                  placeholder="Start typing here..."
                  disabled={!gameActive}
                />
                
                {!gameActive && userInput === currentText && (
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Completed!</h3>
                    <p>Final WPM: {wpm} | Accuracy: {accuracy}%</p>
                    <Button onClick={startGame} className="mt-4 bg-blue-500 hover:bg-blue-600">
                      Try Another Text
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
