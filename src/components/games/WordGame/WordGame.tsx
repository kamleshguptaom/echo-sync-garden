
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WordGameProps {
  onBack: () => void;
}

type GameMode = 'anagram' | 'spelling' | 'vocabulary';

interface WordChallenge {
  word: string;
  clue: string;
  scrambled?: string;
  definition?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const WordGame: React.FC<WordGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('anagram');
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const wordLists = {
    easy: [
      { word: 'APPLE', clue: 'A red or green fruit', definition: 'A round fruit that grows on trees' },
      { word: 'HOUSE', clue: 'Where people live', definition: 'A building where people live' },
      { word: 'HAPPY', clue: 'Feeling of joy', definition: 'Feeling pleased and content' },
      { word: 'WATER', clue: 'Clear liquid we drink', definition: 'A transparent liquid essential for life' },
      { word: 'MUSIC', clue: 'Sounds that make melodies', definition: 'Vocal or instrumental sounds combined in harmony' },
    ],
    medium: [
      { word: 'ELEPHANT', clue: 'Large animal with trunk', definition: 'A very large mammal with a trunk and tusks' },
      { word: 'MOUNTAIN', clue: 'Very tall landform', definition: 'A large natural elevation of earth and rock' },
      { word: 'COMPUTER', clue: 'Electronic device for processing data', definition: 'An electronic machine for processing information' },
      { word: 'TELESCOPE', clue: 'Device for viewing distant objects', definition: 'An instrument for observing distant objects' },
      { word: 'BUTTERFLY', clue: 'Colorful flying insect', definition: 'An insect with large colorful wings' },
    ],
    hard: [
      { word: 'EXTRAORDINARY', clue: 'Very unusual or remarkable', definition: 'Going beyond what is normal or expected' },
      { word: 'PHOTOGRAPHY', clue: 'Art of taking pictures', definition: 'The art and science of creating images with light' },
      { word: 'ARCHITECTURE', clue: 'Design of buildings', definition: 'The art and science of designing buildings' },
      { word: 'IMAGINATION', clue: 'Ability to create mental images', definition: 'The faculty of forming new ideas or images' },
      { word: 'ENCYCLOPEDIA', clue: 'Comprehensive reference work', definition: 'A book containing information on many subjects' },
    ]
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
    }
  }, [gameStarted, timeLeft]);

  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const generateChallenge = (): WordChallenge => {
    const difficulties = ['easy', 'medium', 'hard'] as const;
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const wordList = wordLists[difficulty];
    const wordData = wordList[Math.floor(Math.random() * wordList.length)];
    
    const challenge: WordChallenge = {
      word: wordData.word,
      clue: wordData.clue,
      definition: wordData.definition,
      difficulty
    };
    
    if (gameMode === 'anagram') {
      challenge.scrambled = scrambleWord(wordData.word);
    }
    
    return challenge;
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setFeedback('');
    setCurrentChallenge(generateChallenge());
  };

  const checkAnswer = () => {
    if (!currentChallenge) return;
    
    const userWord = userAnswer.toUpperCase().trim();
    
    if (userWord === currentChallenge.word) {
      const points = currentChallenge.difficulty === 'easy' ? 10 : 
                   currentChallenge.difficulty === 'medium' ? 20 : 30;
      setScore(score + points * (streak + 1));
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
    } else {
      setStreak(0);
      setFeedback(`Incorrect. The answer was ${currentChallenge.word}`);
    }
    
    setUserAnswer('');
    if (gameStarted) {
      setTimeout(() => {
        setCurrentChallenge(generateChallenge());
        setFeedback('');
      }, 2000);
    }
  };

  const getHint = () => {
    if (!currentChallenge) return '';
    
    switch (gameMode) {
      case 'anagram':
        return `Unscramble: ${currentChallenge.scrambled} | Clue: ${currentChallenge.clue}`;
      case 'spelling':
        return `Spell the word: ${currentChallenge.clue}`;
      case 'vocabulary':
        return `What word means: ${currentChallenge.definition}`;
      default:
        return currentChallenge.clue;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Word Games</h1>
          <div className="w-20"></div>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center items-center">
              <div>
                <label className="block text-sm font-medium mb-1">Game Mode</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anagram">🔤 Anagrams</SelectItem>
                    <SelectItem value="spelling">✏️ Spelling</SelectItem>
                    <SelectItem value="vocabulary">📚 Vocabulary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 mt-6">
                {gameStarted ? 'Restart Game' : 'Start Game'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">
              {gameStarted ? (
                <div className="flex justify-between items-center">
                  <span>Score: {score}</span>
                  <span>Streak: {streak}</span>
                  <span>Time: {timeLeft}s</span>
                </div>
              ) : (
                "Challenge Your Vocabulary!"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!gameStarted && !currentChallenge ? (
              <div className="space-y-4">
                <p className="text-lg">Choose a game mode and test your word skills!</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-600">🔤 Anagrams</h3>
                    <p>Unscramble the letters to form a word</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-bold text-green-600">✏️ Spelling</h3>
                    <p>Spell the word from the given clue</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-bold text-purple-600">📚 Vocabulary</h3>
                    <p>Find the word from its definition</p>
                  </div>
                </div>
              </div>
            ) : gameStarted && currentChallenge ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {getHint()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Difficulty: <span className={`font-bold ${
                      currentChallenge.difficulty === 'easy' ? 'text-green-600' :
                      currentChallenge.difficulty === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{currentChallenge.difficulty.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    placeholder="Your answer"
                    className="w-64 text-xl text-center"
                    autoFocus
                  />
                  <Button onClick={checkAnswer} className="bg-blue-500 hover:bg-blue-600">
                    Submit
                  </Button>
                </div>
                
                {feedback && (
                  <div className={`text-xl font-bold ${feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'} animate-bounce`}>
                    {feedback}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-600">Game Over!</h3>
                <p className="text-lg">Final Score: {score}</p>
                <p className="text-lg">Best Streak: {streak}</p>
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                  Play Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
