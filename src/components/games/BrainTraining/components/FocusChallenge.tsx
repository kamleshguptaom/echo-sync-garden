import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FocusChallengeProps {
  onComplete: (correct: boolean) => void;
  difficulty: number;
}

export const FocusChallenge: React.FC<FocusChallengeProps> = ({ onComplete, difficulty }) => {
  const [targetShape, setTargetShape] = useState<string>('');
  const [shapes, setShapes] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5000);

  const shapeOptions = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🔺', '🔶', '🔷', '⭐'];
  const gridSize = Math.min(4 + difficulty, 8);

  useEffect(() => {
    generateChallenge();
  }, [difficulty]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 100), 100);
      return () => clearTimeout(timer);
    } else if (gameStarted && timeLeft <= 0) {
      onComplete(false);
    }
  }, [gameStarted, timeLeft, onComplete]);

  const generateChallenge = () => {
    const target = shapeOptions[Math.floor(Math.random() * shapeOptions.length)];
    setTargetShape(target);
    
    const totalShapes = gridSize * gridSize;
    const targetCount = Math.max(1, Math.floor(totalShapes * 0.2));
    const newShapes = Array(totalShapes).fill(null).map((_, index) => {
      if (index < targetCount) return target;
      return shapeOptions[Math.floor(Math.random() * shapeOptions.length)];
    });
    
    // Shuffle the array
    for (let i = newShapes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShapes[i], newShapes[j]] = [newShapes[j], newShapes[i]];
    }
    
    setShapes(newShapes);
    setGameStarted(false);
    setTimeLeft(5000 - (difficulty * 500));
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const handleShapeClick = (shape: string) => {
    if (!gameStarted) return;
    onComplete(shape === targetShape);
  };

  const targetCount = shapes.filter(shape => shape === targetShape).length;

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-center text-xl">Focus Challenge</CardTitle>
        <p className="text-center text-gray-600">
          Find and click the target shape: <span className="text-2xl">{targetShape}</span>
        </p>
        <p className="text-center text-sm text-blue-600">
          Count: {targetCount} shapes to find
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!gameStarted ? (
          <Button onClick={startGame} className="w-full bg-green-500 hover:bg-green-600">
            Start Focus Test
          </Button>
        ) : (
          <>
            <div className="text-center">
              <div className="text-lg font-medium">Time Left: {(timeLeft / 1000).toFixed(1)}s</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${(timeLeft / (5000 - (difficulty * 500))) * 100}%` }}
                />
              </div>
            </div>
            
            <div 
              className="grid gap-2 mx-auto"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                maxWidth: `${gridSize * 3}rem`
              }}
            >
              {shapes.map((shape, index) => (
                <button
                  key={index}
                  onClick={() => handleShapeClick(shape)}
                  className="w-10 h-10 text-2xl rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:scale-110 transition-all duration-200"
                >
                  {shape}
                </button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};