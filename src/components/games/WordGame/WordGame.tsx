import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WordGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'random';
type GameMode = 'spelling' | 'grammar' | 'rhyming' | 'synonyms' | 'mixed' | 'random';

export const WordGame: React.FC<WordGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('spelling');
  const [currentWord, setCurrentWord] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showConcept, setShowConcept] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);

  const wordLists = {
    easy: [
      'cat', 'dog', 'sun', 'run', 'fun', 'big', 'red', 'hat', 'bat', 'mat',
      'pen', 'ten', 'hen', 'men', 'den', 'cup', 'pup', 'hop', 'top', 'pop'
    ],
    medium: [
      'house', 'mouse', 'river', 'tiger', 'happy', 'friend', 'school', 'garden',
      'window', 'family', 'purple', 'orange', 'yellow', 'flower', 'mountain'
    ],
    hard: [
      'beautiful', 'wonderful', 'dangerous', 'excellent', 'intelligent', 'mysterious',
      'extraordinary', 'magnificent', 'appreciate', 'responsibility', 'environment'
    ]
  };

  const grammarQuestions = {
    easy: [
      { question: "Choose correct: I ___ happy", options: ["am", "is", "are"], answer: "am" },
      { question: "Choose correct: She ___ a book", options: ["read", "reads", "reading"], answer: "reads" }
    ],
    medium: [
      { question: "Choose correct: They ___ been here before", options: ["have", "has", "had"], answer: "have" },
      { question: "Choose correct: I wish I ___ fly", options: ["can", "could", "will"], answer: "could" }
    ],
    hard: [
      { question: "Choose correct: If I ___ you, I would study more", options: ["was", "were", "am"], answer: "were" },
      { question: "Choose correct: The book ___ by millions", options: ["was read", "were read", "is read"], answer: "was read" }
    ]
  };

  const getRandomDifficulty = (): 'easy' | 'medium' | 'hard' => {
    const difficulties = ['easy', 'medium', 'hard'] as const;
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const getRandomGameMode = (): Exclude<GameMode, 'random'> => {
    const modes = ['spelling', 'grammar', 'rhyming', 'synonyms', 'mixed'] as const;
    return modes[Math.floor(Math.random() * modes.length)];
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setRound(1);
    setHintsUsed(0);
    generateQuestion();
  };

  const generateQuestion = () => {
    const actualDifficulty = difficulty === 'random' ? getRandomDifficulty() : difficulty;
    const actualMode = gameMode === 'random' ? getRandomGameMode() : gameMode;
    
    if (actualMode === 'spelling') {
      const words = wordLists[actualDifficulty];
      const word = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(word);
      setCurrentQuestion({ type: 'spelling', word, scrambled: scrambleWord(word) });
    } else if (actualMode === 'grammar') {
      const questions = grammarQuestions[actualDifficulty];
      const question = questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion({ type: 'grammar', ...question });
    }
    // Add other modes...
    
    setUserAnswer('');
    setFeedback('');
  };

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    let isCorrect = false;
    if (currentQuestion.type === 'spelling') {
      isCorrect = userAnswer.toLowerCase() === currentQuestion.word.toLowerCase();
    } else if (currentQuestion.type === 'grammar') {
      isCorrect = userAnswer === currentQuestion.answer;
    }
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback('Correct! Well done! 🎉');
    } else {
      setFeedback(`Incorrect. The answer was: ${currentQuestion.word || currentQuestion.answer}`);
    }
    
    setTimeout(() => {
      setRound(round + 1);
      if (round < 10) {
        generateQuestion();
      } else {
        setGameStarted(false);
        setFeedback(`Game Complete! Final Score: ${score}/10`);
      }
    }, 2000);
  };

  const useHint = () => {
    if (hintsUsed >= 3 || !currentQuestion) return;
    
    if (currentQuestion.type === 'spelling') {
      const word = currentQuestion.word;
      const hint = `Hint: The word starts with "${word[0]}" and has ${word.length} letters`;
      setFeedback(hint);
    } else if (currentQuestion.type === 'grammar') {
      setFeedback(`Hint: Think about ${currentQuestion.options.join(', ')}`);
    }
    
    setHintsUsed(hintsUsed + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Word Games</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Word Games Concepts</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">📝 Language Skills</h3>
                  <p>Word games help develop vocabulary, spelling, grammar, and reading comprehension.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎯 Game Types</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Spelling:</strong> Unscramble letters to form words</li>
                    <li><strong>Grammar:</strong> Choose correct grammatical forms</li>
                    <li><strong>Rhyming:</strong> Find words that sound similar</li>
                    <li><strong>Synonyms:</strong> Match words with similar meanings</li>
                  </ul>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h4 className="font-bold">💡 Strategy Tips:</h4>
                    <p>Sound out words, think of word patterns, and use context clues!</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center">
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
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Game Mode</label>
                <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spelling">📝 Spelling</SelectItem>
                    <SelectItem value="grammar">📚 Grammar</SelectItem>
                    <SelectItem value="rhyming">🎵 Rhyming</SelectItem>
                    <SelectItem value="synonyms">🔄 Synonyms</SelectItem>
                    <SelectItem value="mixed">🎯 Mixed</SelectItem>
                    <SelectItem value="random">🎲 Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                {gameStarted ? 'New Game' : 'Start Game'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameStarted && currentQuestion && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                Round {round}/10 - Score: {score} - Hints: {hintsUsed}/3
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                {currentQuestion.type === 'spelling' && (
                  <div>
                    <p className="text-lg mb-4">Unscramble this word:</p>
                    <p className="text-3xl font-bold text-blue-600 mb-4">{currentQuestion.scrambled}</p>
                  </div>
                )}
                
                {currentQuestion.type === 'grammar' && (
                  <div>
                    <p className="text-lg mb-4">{currentQuestion.question}</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {currentQuestion.options.map((option: string) => (
                        <Button
                          key={option}
                          variant="outline"
                          onClick={() => setUserAnswer(option)}
                          className={userAnswer === option ? 'bg-blue-200' : ''}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center space-y-4">
                {currentQuestion.type === 'spelling' && (
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="text-center text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                )}
                
                <div className="flex gap-2 justify-center">
                  <Button onClick={checkAnswer} disabled={!userAnswer} className="bg-blue-500 hover:bg-blue-600">
                    Submit Answer
                  </Button>
                  <Button onClick={useHint} disabled={hintsUsed >= 3} variant="outline">
                    💡 Hint ({hintsUsed}/3)
                  </Button>
                  <Button onClick={() => { setRound(round + 1); generateQuestion(); }} variant="outline">
                    ⏭️ Skip
                  </Button>
                </div>
              </div>

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

        {!gameStarted && round > 1 && (
          <Card className="bg-white/95">
            <CardContent className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
              <p className="text-lg mb-4">Final Score: {score}/10</p>
              <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
                Play Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
