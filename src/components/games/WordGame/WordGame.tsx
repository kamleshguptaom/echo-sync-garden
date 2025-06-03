
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WordGameProps {
  onBack: () => void;
}

type GameMode = 'anagram' | 'spelling' | 'vocabulary' | 'grammar' | 'rhyming' | 'synonyms';
type Difficulty = 'easy' | 'medium' | 'hard';

interface WordChallenge {
  word: string;
  clue: string;
  scrambled?: string;
  definition?: string;
  options?: string[];
  correctAnswer?: string;
  difficulty: Difficulty;
}

export const WordGame: React.FC<WordGameProps> = ({ onBack }) => {
  const [gameMode, setGameMode] = useState<GameMode>('anagram');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hintsUsed, setHintsUsed] = useState(0);

  const wordDatabase = {
    easy: {
      words: [
        { word: 'APPLE', clue: 'A red or green fruit', definition: 'A round fruit that grows on trees' },
        { word: 'HOUSE', clue: 'Where people live', definition: 'A building where people live' },
        { word: 'HAPPY', clue: 'Feeling of joy', definition: 'Feeling pleased and content' },
        { word: 'WATER', clue: 'Clear liquid we drink', definition: 'A transparent liquid essential for life' },
        { word: 'MUSIC', clue: 'Sounds that make melodies', definition: 'Vocal or instrumental sounds combined in harmony' },
        { word: 'BEACH', clue: 'Sandy shore by the sea', definition: 'A sandy area by the ocean' },
        { word: 'SMILE', clue: 'Happy facial expression', definition: 'A pleased expression on your face' }
      ],
      grammar: [
        { question: 'Choose the correct verb: She ___ to school every day.', options: ['go', 'goes', 'going'], answer: 'goes' },
        { question: 'What is the plural of "child"?', options: ['childs', 'children', 'childes'], answer: 'children' },
        { question: 'Choose the correct article: I saw ___ elephant.', options: ['a', 'an', 'the'], answer: 'an' }
      ],
      rhyming: [
        { word: 'CAT', rhymes: ['BAT', 'HAT', 'RAT', 'MAT'] },
        { word: 'SUN', rhymes: ['FUN', 'RUN', 'BUN', 'GUN'] },
        { word: 'TREE', rhymes: ['BEE', 'SEE', 'FREE', 'KEY'] }
      ],
      synonyms: [
        { word: 'BIG', synonyms: ['LARGE', 'HUGE', 'GIANT'], definition: 'Of great size' },
        { word: 'HAPPY', synonyms: ['GLAD', 'JOYFUL', 'CHEERFUL'], definition: 'Feeling joy' }
      ]
    },
    medium: {
      words: [
        { word: 'ELEPHANT', clue: 'Large animal with trunk', definition: 'A very large mammal with a trunk and tusks' },
        { word: 'MOUNTAIN', clue: 'Very tall landform', definition: 'A large natural elevation of earth and rock' },
        { word: 'COMPUTER', clue: 'Electronic device for processing data', definition: 'An electronic machine for processing information' },
        { word: 'TELESCOPE', clue: 'Device for viewing distant objects', definition: 'An instrument for observing distant objects' },
        { word: 'BUTTERFLY', clue: 'Colorful flying insect', definition: 'An insect with large colorful wings' },
        { word: 'ADVENTURE', clue: 'Exciting journey or experience', definition: 'An exciting or dangerous experience' }
      ],
      grammar: [
        { question: 'Choose the correct tense: Yesterday, I ___ to the store.', options: ['go', 'went', 'will go'], answer: 'went' },
        { question: 'What is the comparative form of "good"?', options: ['gooder', 'better', 'best'], answer: 'better' },
        { question: 'Choose the correct pronoun: ___ is my friend.', options: ['Him', 'He', 'His'], answer: 'He' }
      ],
      rhyming: [
        { word: 'BRIGHT', rhymes: ['LIGHT', 'NIGHT', 'SIGHT', 'FLIGHT'] },
        { word: 'PHONE', rhymes: ['BONE', 'STONE', 'ALONE', 'THRONE'] }
      ],
      synonyms: [
        { word: 'BEAUTIFUL', synonyms: ['PRETTY', 'LOVELY', 'GORGEOUS'], definition: 'Pleasing to look at' },
        { word: 'INTELLIGENT', synonyms: ['SMART', 'CLEVER', 'BRIGHT'], definition: 'Having good understanding' }
      ]
    },
    hard: {
      words: [
        { word: 'EXTRAORDINARY', clue: 'Very unusual or remarkable', definition: 'Going beyond what is normal or expected' },
        { word: 'PHOTOGRAPHY', clue: 'Art of taking pictures', definition: 'The art and science of creating images with light' },
        { word: 'ARCHITECTURE', clue: 'Design of buildings', definition: 'The art and science of designing buildings' },
        { word: 'IMAGINATION', clue: 'Ability to create mental images', definition: 'The faculty of forming new ideas or images' },
        { word: 'ENCYCLOPEDIA', clue: 'Comprehensive reference work', definition: 'A book containing information on many subjects' }
      ],
      grammar: [
        { question: 'Choose the correct subjunctive: If I ___ you, I would study harder.', options: ['was', 'were', 'am'], answer: 'were' },
        { question: 'What is the past participle of "break"?', options: ['broke', 'broken', 'breaking'], answer: 'broken' }
      ],
      rhyming: [
        { word: 'SYMPHONY', rhymes: ['HARMONY', 'COMPANY', 'ACCOMPANY'] },
        { word: 'REVOLUTION', rhymes: ['SOLUTION', 'EVOLUTION', 'CONSTITUTION'] }
      ],
      synonyms: [
        { word: 'MAGNIFICENT', synonyms: ['SPLENDID', 'MAJESTIC', 'GLORIOUS'], definition: 'Very beautiful and impressive' },
        { word: 'PERSEVERANCE', synonyms: ['PERSISTENCE', 'DETERMINATION', 'TENACITY'], definition: 'Continuing despite difficulties' }
      ]
    }
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
    const data = wordDatabase[difficulty];
    
    switch (gameMode) {
      case 'anagram':
        const wordData = data.words[Math.floor(Math.random() * data.words.length)];
        return {
          word: wordData.word,
          clue: wordData.clue,
          scrambled: scrambleWord(wordData.word),
          difficulty
        };
      
      case 'spelling':
        const spellWord = data.words[Math.floor(Math.random() * data.words.length)];
        return {
          word: spellWord.word,
          clue: spellWord.clue,
          difficulty
        };
      
      case 'vocabulary':
        const vocabWord = data.words[Math.floor(Math.random() * data.words.length)];
        return {
          word: vocabWord.word,
          definition: vocabWord.definition,
          clue: vocabWord.definition!,
          difficulty
        };
      
      case 'grammar':
        const grammarQ = data.grammar[Math.floor(Math.random() * data.grammar.length)];
        return {
          word: grammarQ.answer,
          clue: grammarQ.question,
          options: grammarQ.options,
          correctAnswer: grammarQ.answer,
          difficulty
        };
      
      case 'rhyming':
        const rhymeData = data.rhyming[Math.floor(Math.random() * data.rhyming.length)];
        const correctRhyme = rhymeData.rhymes[Math.floor(Math.random() * rhymeData.rhymes.length)];
        return {
          word: correctRhyme,
          clue: `Find a word that rhymes with "${rhymeData.word}"`,
          correctAnswer: correctRhyme,
          difficulty
        };
      
      case 'synonyms':
        const synData = data.synonyms[Math.floor(Math.random() * data.synonyms.length)];
        const correctSyn = synData.synonyms[Math.floor(Math.random() * synData.synonyms.length)];
        return {
          word: correctSyn,
          clue: `Find a synonym for "${synData.word}" (${synData.definition})`,
          correctAnswer: correctSyn,
          difficulty
        };
      
      default:
        return generateChallenge();
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setFeedback('');
    setHintsUsed(0);
    setCurrentChallenge(generateChallenge());
  };

  const useHint = () => {
    if (!currentChallenge || hintsUsed >= 2) return;
    
    let hint = '';
    switch (gameMode) {
      case 'anagram':
        hint = `First letter: ${currentChallenge.word[0]}`;
        break;
      case 'spelling':
      case 'vocabulary':
        hint = `Length: ${currentChallenge.word.length} letters`;
        break;
      case 'grammar':
        hint = 'Think about grammar rules';
        break;
      default:
        hint = `Starts with: ${currentChallenge.word[0]}`;
    }
    
    setFeedback(`💡 Hint: ${hint}`);
    setHintsUsed(hintsUsed + 1);
    
    setTimeout(() => setFeedback(''), 3000);
  };

  const checkAnswer = () => {
    if (!currentChallenge) return;
    
    const userWord = userAnswer.toUpperCase().trim();
    let isCorrect = false;
    
    if (gameMode === 'grammar' && currentChallenge.options) {
      isCorrect = userAnswer.toLowerCase() === currentChallenge.correctAnswer?.toLowerCase();
    } else if (gameMode === 'rhyming' || gameMode === 'synonyms') {
      const data = wordDatabase[difficulty];
      if (gameMode === 'rhyming') {
        const rhymeSet = data.rhyming.find(r => r.rhymes.includes(currentChallenge.word));
        isCorrect = rhymeSet?.rhymes.includes(userWord) || false;
      } else {
        const synSet = data.synonyms.find(s => s.synonyms.includes(currentChallenge.word));
        isCorrect = synSet?.synonyms.includes(userWord) || synSet?.word === userWord || false;
      }
    } else {
      isCorrect = userWord === currentChallenge.word;
    }
    
    if (isCorrect) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      setScore(score + points * (streak + 1));
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
    } else {
      setStreak(0);
      setFeedback(`Incorrect. The answer was ${currentChallenge.word || currentChallenge.correctAnswer}`);
    }
    
    setUserAnswer('');
    if (gameStarted) {
      setTimeout(() => {
        setCurrentChallenge(generateChallenge());
        setFeedback('');
      }, 2000);
    }
  };

  const getGameModeDisplay = () => {
    const modes = {
      anagram: '🔤 Anagrams',
      spelling: '✏️ Spelling',
      vocabulary: '📚 Vocabulary',
      grammar: '📝 Grammar',
      rhyming: '🎵 Rhyming',
      synonyms: '🔄 Synonyms'
    };
    return modes[gameMode];
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
      case 'grammar':
        return currentChallenge.clue;
      case 'rhyming':
      case 'synonyms':
        return currentChallenge.clue;
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Word Games</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>Anagrams:</strong> Unscramble letters to form a word</p>
                <p><strong>Spelling:</strong> Spell the word from the given clue</p>
                <p><strong>Vocabulary:</strong> Find the word from its definition</p>
                <p><strong>Grammar:</strong> Choose the correct grammar option</p>
                <p><strong>Rhyming:</strong> Find words that rhyme</p>
                <p><strong>Synonyms:</strong> Find words with similar meanings</p>
                <p>💡 Use hints if you get stuck (max 2 per game)</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center items-center flex-wrap">
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
                    <SelectItem value="grammar">📝 Grammar</SelectItem>
                    <SelectItem value="rhyming">🎵 Rhyming</SelectItem>
                    <SelectItem value="synonyms">🔄 Synonyms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
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
                "Challenge Your Word Skills!"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!gameStarted && !currentChallenge ? (
              <div className="space-y-4">
                <p className="text-lg">Choose a game mode and difficulty to test your word skills!</p>
                <div className="text-sm text-gray-600">
                  Current Mode: {getGameModeDisplay()} | Difficulty: {difficulty.toUpperCase()}
                </div>
              </div>
            ) : gameStarted && currentChallenge ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    {getHint()}
                  </div>
                  {currentChallenge.options && (
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      {currentChallenge.options.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => setUserAnswer(option)}
                          className={`${userAnswer === option ? 'bg-blue-500' : 'bg-gray-200'} hover:bg-blue-400`}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-2">
                    Difficulty: <span className={`font-bold ${
                      currentChallenge.difficulty === 'easy' ? 'text-green-600' :
                      currentChallenge.difficulty === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{currentChallenge.difficulty.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 items-center">
                  {!currentChallenge.options && (
                    <Input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      placeholder="Your answer"
                      className="w-64 text-xl text-center"
                      autoFocus
                    />
                  )}
                  <Button onClick={checkAnswer} className="bg-blue-500 hover:bg-blue-600">
                    Submit
                  </Button>
                  <Button 
                    onClick={useHint} 
                    disabled={hintsUsed >= 2} 
                    variant="outline"
                    className="bg-yellow-100 hover:bg-yellow-200"
                  >
                    💡 Hint ({hintsUsed}/2)
                  </Button>
                </div>
                
                {feedback && (
                  <div className={`text-xl font-bold ${feedback.includes('Correct') ? 'text-green-600' : feedback.includes('Hint') ? 'text-yellow-600' : 'text-red-600'} animate-bounce`}>
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
