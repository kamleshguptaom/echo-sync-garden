
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
type GameMode = 'spelling' | 'grammar' | 'rhyming' | 'synonyms' | 'antonyms' | 'vocabulary' | 'mixed' | 'random';

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
  const [showCelebration, setShowCelebration] = useState(false);

  const wordLists = {
    easy: [
      'cat', 'dog', 'sun', 'run', 'fun', 'big', 'red', 'hat', 'bat', 'mat',
      'pen', 'ten', 'hen', 'men', 'den', 'cup', 'pup', 'hop', 'top', 'pop',
      'car', 'far', 'jar', 'star', 'bar', 'fish', 'dish', 'wish', 'rich', 'which'
    ],
    medium: [
      'house', 'mouse', 'river', 'tiger', 'happy', 'friend', 'school', 'garden',
      'window', 'family', 'purple', 'orange', 'yellow', 'flower', 'mountain',
      'computer', 'telephone', 'butterfly', 'elephant', 'umbrella', 'fantastic'
    ],
    hard: [
      'beautiful', 'wonderful', 'dangerous', 'excellent', 'intelligent', 'mysterious',
      'extraordinary', 'magnificent', 'appreciate', 'responsibility', 'environment',
      'independent', 'consequence', 'achievement', 'imagination', 'opportunity'
    ]
  };

  const grammarQuestions = {
    easy: [
      { question: "Choose correct: I ___ happy", options: ["am", "is", "are"], answer: "am" },
      { question: "Choose correct: She ___ a book", options: ["read", "reads", "reading"], answer: "reads" },
      { question: "Choose correct: They ___ playing", options: ["is", "are", "am"], answer: "are" }
    ],
    medium: [
      { question: "Choose correct: They ___ been here before", options: ["have", "has", "had"], answer: "have" },
      { question: "Choose correct: I wish I ___ fly", options: ["can", "could", "will"], answer: "could" },
      { question: "Choose correct: Neither of them ___ coming", options: ["is", "are", "were"], answer: "is" }
    ],
    hard: [
      { question: "Choose correct: If I ___ you, I would study more", options: ["was", "were", "am"], answer: "were" },
      { question: "Choose correct: The book ___ by millions", options: ["was read", "were read", "is read"], answer: "was read" },
      { question: "Choose correct: ___ you mind if I opened the window?", options: ["Would", "Will", "Could"], answer: "Would" }
    ]
  };

  const synonymQuestions = {
    easy: [
      { word: "big", options: ["small", "large", "tiny", "little"], answer: "large" },
      { word: "happy", options: ["sad", "glad", "angry", "mad"], answer: "glad" },
      { word: "fast", options: ["slow", "quick", "lazy", "tired"], answer: "quick" }
    ],
    medium: [
      { word: "beautiful", options: ["ugly", "pretty", "bad", "poor"], answer: "pretty" },
      { word: "intelligent", options: ["dumb", "smart", "lazy", "slow"], answer: "smart" },
      { word: "difficult", options: ["easy", "hard", "simple", "clear"], answer: "hard" }
    ],
    hard: [
      { word: "enormous", options: ["tiny", "gigantic", "small", "little"], answer: "gigantic" },
      { word: "magnificent", options: ["awful", "splendid", "terrible", "poor"], answer: "splendid" },
      { word: "cautious", options: ["reckless", "careful", "careless", "bold"], answer: "careful" }
    ]
  };

  const vocabularyQuestions = {
    easy: [
      { definition: "A large gray animal with a trunk", options: ["lion", "elephant", "tiger", "bear"], answer: "elephant" },
      { definition: "Something you use to write", options: ["pen", "cup", "hat", "car"], answer: "pen" },
      { definition: "The color of grass", options: ["red", "blue", "green", "yellow"], answer: "green" }
    ],
    medium: [
      { definition: "A person who teaches students", options: ["doctor", "teacher", "farmer", "driver"], answer: "teacher" },
      { definition: "A tool used to cut paper", options: ["hammer", "scissors", "spoon", "brush"], answer: "scissors" },
      { definition: "The season when leaves fall", options: ["spring", "summer", "autumn", "winter"], answer: "autumn" }
    ],
    hard: [
      { definition: "The study of stars and planets", options: ["biology", "chemistry", "astronomy", "geology"], answer: "astronomy" },
      { definition: "A person who designs buildings", options: ["architect", "engineer", "artist", "musician"], answer: "architect" },
      { definition: "The fear of closed spaces", options: ["agoraphobia", "claustrophobia", "arachnophobia", "acrophobia"], answer: "claustrophobia" }
    ]
  };

  const getRandomDifficulty = (): 'easy' | 'medium' | 'hard' => {
    const difficulties = ['easy', 'medium', 'hard'] as const;
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const getRandomGameMode = (): Exclude<GameMode, 'random'> => {
    const modes = ['spelling', 'grammar', 'rhyming', 'synonyms', 'antonyms', 'vocabulary'] as const;
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
    } else if (actualMode === 'synonyms') {
      const questions = synonymQuestions[actualDifficulty];
      const question = questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion({ type: 'synonyms', ...question });
    } else if (actualMode === 'vocabulary') {
      const questions = vocabularyQuestions[actualDifficulty];
      const question = questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion({ type: 'vocabulary', ...question });
    }
    
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
    } else {
      isCorrect = userAnswer === currentQuestion.answer;
    }
    
    if (isCorrect) {
      const points = 10 + (difficulty === 'hard' ? 5 : 0);
      setScore(score + points);
      setFeedback('🎉 Excellent! Perfect answer!');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      setFeedback(`❌ Incorrect. The answer was: ${currentQuestion.word || currentQuestion.answer}`);
    }
    
    setTimeout(() => {
      setRound(round + 1);
      if (round < 15) {
        generateQuestion();
      } else {
        setGameStarted(false);
        setFeedback(`🏆 Game Complete! Final Score: ${score} points`);
      }
    }, 3000);
  };

  const useHint = () => {
    if (hintsUsed >= 3 || !currentQuestion) return;
    
    if (currentQuestion.type === 'spelling') {
      const word = currentQuestion.word;
      const hint = `💡 Hint: The word starts with "${word[0].toUpperCase()}" and has ${word.length} letters. It means: ${getWordMeaning(word)}`;
      setFeedback(hint);
    } else if (currentQuestion.type === 'grammar') {
      setFeedback(`💡 Hint: Think about subject-verb agreement and verb tenses.`);
    } else if (currentQuestion.type === 'synonyms') {
      setFeedback(`💡 Hint: Look for the word that means the same as "${currentQuestion.word}"`);
    } else if (currentQuestion.type === 'vocabulary') {
      setFeedback(`💡 Hint: Think carefully about the definition and match it with the correct word.`);
    }
    
    setHintsUsed(hintsUsed + 1);
  };

  const getWordMeaning = (word: string): string => {
    const meanings: Record<string, string> = {
      'cat': 'a small furry pet animal',
      'dog': 'a loyal pet animal',
      'house': 'a place where people live',
      'beautiful': 'very pretty or attractive',
      'computer': 'a machine for processing information'
    };
    return meanings[word] || 'a common English word';
  };

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
    } else {
      onBack();
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={goBack} variant="outline" className="bg-white/90">
              ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="bg-white/90">
              ← Previous
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">📝 Word Masters</h1>
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
                  <h3 className="font-bold text-lg">📝 Language Skills Development</h3>
                  <p>Word games help develop vocabulary, spelling, grammar, reading comprehension, and critical thinking skills.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🎯 Game Types</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Spelling:</strong> Unscramble letters to form words</li>
                    <li><strong>Grammar:</strong> Choose correct grammatical forms</li>
                    <li><strong>Synonyms:</strong> Find words with similar meanings</li>
                    <li><strong>Vocabulary:</strong> Match definitions with words</li>
                    <li><strong>Antonyms:</strong> Find opposite meanings</li>
                  </ul>
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h4 className="font-bold">💡 Strategy Tips:</h4>
                    <p>• Sound out words phonetically<br/>
                       • Think of word patterns and roots<br/>
                       • Use context clues<br/>
                       • Practice reading regularly!</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-r from-yellow-400 via-green-500 to-blue-600 text-white text-6xl font-bold p-8 rounded-full animate-bounce">
              📝 Word Master! 📝
            </div>
          </div>
        )}

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Word Game Settings</CardTitle>
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
                    <SelectItem value="synonyms">🔄 Synonyms</SelectItem>
                    <SelectItem value="antonyms">↔️ Antonyms</SelectItem>
                    <SelectItem value="vocabulary">📖 Vocabulary</SelectItem>
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
                Round {round}/15 - Score: {score} - Hints: {hintsUsed}/3
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                {currentQuestion.type === 'spelling' && (
                  <div>
                    <p className="text-lg mb-4">Unscramble this word:</p>
                    <p className="text-3xl font-bold text-blue-600 mb-4 animate-pulse">{currentQuestion.scrambled}</p>
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

                {currentQuestion.type === 'synonyms' && (
                  <div>
                    <p className="text-lg mb-4">Find the synonym for:</p>
                    <p className="text-3xl font-bold text-purple-600 mb-4">{currentQuestion.word}</p>
                    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                      {currentQuestion.options.map((option: string) => (
                        <Button
                          key={option}
                          variant="outline"
                          onClick={() => setUserAnswer(option)}
                          className={userAnswer === option ? 'bg-purple-200' : ''}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {currentQuestion.type === 'vocabulary' && (
                  <div>
                    <p className="text-lg mb-4">What word matches this definition?</p>
                    <p className="text-xl font-bold text-green-600 mb-4 bg-green-50 p-4 rounded">{currentQuestion.definition}</p>
                    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                      {currentQuestion.options.map((option: string) => (
                        <Button
                          key={option}
                          variant="outline"
                          onClick={() => setUserAnswer(option)}
                          className={userAnswer === option ? 'bg-green-200' : ''}
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
                    className="text-center text-lg max-w-xs mx-auto"
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
                <div className={`text-center p-4 rounded-lg animate-bounce ${
                  feedback.includes('Excellent') ? 'bg-green-100 text-green-800' : 
                  feedback.includes('Incorrect') ? 'bg-red-100 text-red-800' : 
                  feedback.includes('Game Complete') ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
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
              <h2 className="text-2xl font-bold mb-4">🏆 Game Complete!</h2>
              <p className="text-lg mb-4">Final Score: {score} points</p>
              <p className="text-md mb-4">You completed {round - 1} rounds!</p>
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
