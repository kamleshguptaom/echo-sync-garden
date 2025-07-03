
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Volume2, RotateCcw, Star, Trophy, Sparkles } from 'lucide-react';

interface Letter {
  letter: string;
  sound: string;
  word: string;
  emoji: string;
  color: string;
}

interface GameState {
  currentLevel: number;
  score: number;
  stars: number;
  showHint: boolean;
  isCorrect: boolean | null;
  attempts: number;
  theme: string;
}

const themes = {
  forest: {
    name: 'Enchanted Forest',
    colors: ['from-green-400', 'to-emerald-600'],
    accent: 'bg-green-500',
    emoji: '🌲'
  },
  sky: {
    name: 'Sky Adventure',
    colors: ['from-blue-400', 'to-cyan-600'],
    accent: 'bg-blue-500',
    emoji: '☁️'
  },
  candyland: {
    name: 'Sweet Candyland',
    colors: ['from-pink-400', 'to-purple-600'],
    accent: 'bg-pink-500',
    emoji: '🍭'
  },
  underwater: {
    name: 'Ocean Deep',
    colors: ['from-teal-400', 'to-blue-600'],
    accent: 'bg-teal-500',
    emoji: '🐠'
  }
};

const phonicsData: Letter[] = [
  { letter: 'A', sound: 'ay', word: 'Apple', emoji: '🍎', color: 'bg-red-400' },
  { letter: 'B', sound: 'buh', word: 'Ball', emoji: '⚽', color: 'bg-orange-400' },
  { letter: 'C', sound: 'kuh', word: 'Cat', emoji: '🐱', color: 'bg-yellow-400' },
  { letter: 'D', sound: 'duh', word: 'Dog', emoji: '🐶', color: 'bg-green-400' },
  { letter: 'E', sound: 'eh', word: 'Elephant', emoji: '🐘', color: 'bg-blue-400' },
  { letter: 'F', sound: 'fuh', word: 'Fish', emoji: '🐟', color: 'bg-indigo-400' },
  { letter: 'G', sound: 'guh', word: 'Giraffe', emoji: '🦒', color: 'bg-purple-400' },
  { letter: 'H', sound: 'huh', word: 'Horse', emoji: '🐴', color: 'bg-pink-400' },
];

interface PhonicsFunProps {
  onBack: () => void;
}

export const PhonicsFun: React.FC<PhonicsFunProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 0,
    score: 0,
    stars: 0,
    showHint: false,
    isCorrect: null,
    attempts: 0,
    theme: 'forest'
  });

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [gameLetters, setGameLetters] = useState<Letter[]>([]);
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const hintTimeoutRef = useRef<NodeJS.Timeout>();
  const audioContextRef = useRef<AudioContext>();

  const currentTheme = themes[gameState.theme as keyof typeof themes];

  useEffect(() => {
    initializeGame();
    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  const initializeGame = () => {
    const shuffled = [...phonicsData].sort(() => Math.random() - 0.5);
    setGameLetters(shuffled.slice(0, 4));
    setCurrentLetter(shuffled[0]);
    setSelectedOptions(generateOptions(shuffled[0]));
  };

  const generateOptions = (letter: Letter): string[] => {
    const wrongOptions = phonicsData
      .filter(l => l.letter !== letter.letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(l => l.word);
    
    return [letter.word, ...wrongOptions].sort(() => Math.random() - 0.5);
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    
    // Try to use a child-friendly voice
    const voices = window.speechSynthesis.getVoices();
    const childVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('child') || 
      voice.name.toLowerCase().includes('young') ||
      voice.pitch > 1
    );
    if (childVoice) utterance.voice = childVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  const playSuccessSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  };

  const handleLetterClick = () => {
    if (currentLetter) {
      speakText(`${currentLetter.letter}. ${currentLetter.sound}. ${currentLetter.word}`);
      
      // Show hint after 3 seconds
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      hintTimeoutRef.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, showHint: true }));
        speakText(`Find the word that starts with ${currentLetter?.sound}`);
      }, 3000);
    }
  };

  const handleOptionClick = (option: string) => {
    if (!currentLetter) return;

    const isCorrect = option === currentLetter.word;
    setGameState(prev => ({ 
      ...prev, 
      isCorrect,
      attempts: prev.attempts + 1,
      score: isCorrect ? prev.score + 10 : prev.score,
      stars: isCorrect ? prev.stars + 1 : prev.stars
    }));

    if (isCorrect) {
      playSuccessSound();
      speakText(`Great job! ${option} starts with ${currentLetter.sound}!`);
      setShowCelebration(true);
      
      setTimeout(() => {
        setShowCelebration(false);
        nextLevel();
      }, 2000);
    } else {
      speakText(`Try again! Listen for the ${currentLetter.sound} sound.`);
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isCorrect: null }));
      }, 1500);
    }
  };

  const nextLevel = () => {
    const nextIndex = gameState.currentLevel + 1;
    if (nextIndex < gameLetters.length) {
      setGameState(prev => ({ 
        ...prev, 
        currentLevel: nextIndex,
        showHint: false,
        isCorrect: null
      }));
      setCurrentLetter(gameLetters[nextIndex]);
      setSelectedOptions(generateOptions(gameLetters[nextIndex]));
    } else {
      // Game complete
      speakText('Fantastic! You completed all the letters!');
    }
  };

  const randomizeGame = () => {
    initializeGame();
    setGameState(prev => ({ 
      ...prev, 
      currentLevel: 0,
      showHint: false,
      isCorrect: null
    }));
  };

  const changeTheme = (newTheme: string) => {
    setGameState(prev => ({ ...prev, theme: newTheme }));
  };

  if (!currentLetter) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.colors.join(' ')} p-4 relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className={`absolute animate-bounce text-4xl`}
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {currentTheme.emoji}
          </div>
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🔤 Phonics Fun
          </h1>
          <div className="flex gap-2">
            <Select value={gameState.theme} onValueChange={changeTheme}>
              <SelectTrigger className="bg-white/20 text-white border-white/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(themes).map(([key, theme]) => (
                  <SelectItem key={key} value={key}>
                    {theme.emoji} {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={randomizeGame}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress & Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Progress: {gameState.currentLevel + 1}/{gameLetters.length}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">{gameState.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">{gameState.score}</span>
                </div>
              </div>
            </div>
            <Progress 
              value={(gameState.currentLevel / gameLetters.length) * 100} 
              className="h-3"
            />
          </CardContent>
        </Card>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Letter Display */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Listen and Learn! 
                <Button 
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="ml-2 p-2 h-8 w-8"
                  variant={voiceEnabled ? "default" : "outline"}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div 
                className={`${currentLetter.color} rounded-full w-40 h-40 mx-auto flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110 active:scale-95 shadow-lg mb-4`}
                onClick={handleLetterClick}
              >
                <span className="text-6xl font-bold text-white">
                  {currentLetter.letter}
                </span>
              </div>
              
              <div className="text-4xl mb-2">{currentLetter.emoji}</div>
              <p className="text-xl font-semibold text-gray-700">
                Click the letter to hear the sound!
              </p>
              
              {gameState.showHint && (
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg border-2 border-yellow-300 animate-pulse">
                  <Sparkles className="w-5 h-5 inline mr-2 text-yellow-600" />
                  <span className="text-lg font-medium text-yellow-800">
                    Find the word that starts with "{currentLetter.sound}"
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Choose the Right Word!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {selectedOptions.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`p-6 text-xl font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      gameState.isCorrect === true && option === currentLetter.word
                        ? 'bg-green-500 hover:bg-green-600 text-white animate-bounce'
                        : gameState.isCorrect === false && option === currentLetter.word
                        ? currentTheme.accent + ' hover:opacity-80 text-white'
                        : gameState.isCorrect === false
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-shake'
                        : currentTheme.accent + ' hover:opacity-80 text-white'
                    }`}
                    disabled={gameState.isCorrect !== null}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Excellent!</h3>
              <p className="text-xl text-gray-600">You got it right!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-500 fill-current animate-spin" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
