import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MemoryChallengeProps {
  onComplete: (correct: boolean) => void;
  difficulty: number;
}

export const MemoryChallenge: React.FC<MemoryChallengeProps> = ({ onComplete, difficulty }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  const sequenceLength = Math.min(3 + difficulty, 8);

  useEffect(() => {
    generateSequence();
  }, [difficulty]);

  const generateSequence = () => {
    const newSequence = Array.from({ length: sequenceLength }, () => 
      Math.floor(Math.random() * colors.length)
    );
    setSequence(newSequence);
    setPlayerSequence([]);
    setCurrentIndex(0);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setShowingSequence(true);
    showSequence();
  };

  const showSequence = () => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentIndex(index);
      index++;
      if (index >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowingSequence(false);
          setCurrentIndex(-1);
        }, 500);
      }
    }, 800);
  };

  const handleColorClick = (colorIndex: number) => {
    if (showingSequence) return;
    
    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      onComplete(false);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      onComplete(true);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-center text-xl">Memory Challenge</CardTitle>
        <p className="text-center text-gray-600">
          Remember the sequence of {sequenceLength} colors!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!gameStarted ? (
          <Button onClick={startGame} className="w-full bg-blue-500 hover:bg-blue-600">
            Start Memory Test
          </Button>
        ) : (
          <>
            <div className="text-center">
              {showingSequence ? (
                <p className="text-lg font-medium">Watch the sequence!</p>
              ) : (
                <p className="text-lg font-medium">Repeat the sequence ({playerSequence.length}/{sequence.length})</p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorClick(index)}
                  disabled={showingSequence}
                  className={`
                    w-16 h-16 rounded-lg border-4 transition-all duration-200
                    ${color}
                    ${showingSequence && currentIndex === index ? 'border-white scale-110' : 'border-gray-300'}
                    ${!showingSequence ? 'hover:scale-105 hover:border-white' : ''}
                    disabled:cursor-not-allowed
                  `}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};