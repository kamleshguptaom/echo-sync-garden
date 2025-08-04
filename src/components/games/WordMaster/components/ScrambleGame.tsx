import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScrambleGameProps {
  words: string[];
  onWordFound: (word: string, points: number) => Promise<boolean>;
  difficulty: string;
}

export const ScrambleGame: React.FC<ScrambleGameProps> = ({
  words,
  onWordFound,
  difficulty
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    if (words.length > 0) {
      scrambleCurrentWord();
    }
  }, [currentWordIndex, words]);

  const scrambleCurrentWord = () => {
    if (words[currentWordIndex]) {
      const word = words[currentWordIndex];
      const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
      setScrambledWord(scrambled);
      setUserGuess('');
    }
  };

  const handleSubmit = async () => {
    if (userGuess.toUpperCase() === words[currentWordIndex]) {
      const points = words[currentWordIndex].length * 15;
      const success = await onWordFound(words[currentWordIndex], points);
      
      if (success) {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        }
      }
    }
  };

  const getHint = () => {
    if (hintsUsed < 2) {
      setHintsUsed(prev => prev + 1);
      // Show first letter as hint
      setUserGuess(words[currentWordIndex][0]);
    }
  };

  if (words.length === 0 || currentWordIndex >= words.length) {
    return <div>No words available</div>;
  }

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">Unscramble the word!</h3>
        <p className="text-muted-foreground">Word {currentWordIndex + 1} of {words.length}</p>
      </div>
      
      <div className="text-4xl font-bold tracking-widest mb-6">
        {scrambledWord}
      </div>
      
      <div className="space-y-4 max-w-md mx-auto">
        <Input
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
          placeholder="Enter your guess..."
          className="text-center text-lg"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        
        <div className="flex gap-2 justify-center">
          <Button onClick={handleSubmit} disabled={!userGuess.trim()}>
            Submit Guess
          </Button>
          <Button 
            variant="outline" 
            onClick={getHint}
            disabled={hintsUsed >= 2}
          >
            Hint ({2 - hintsUsed} left)
          </Button>
          <Button variant="outline" onClick={scrambleCurrentWord}>
            Rescramble
          </Button>
        </div>
      </div>
    </div>
  );
};