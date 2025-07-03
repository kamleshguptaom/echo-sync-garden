
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy } from 'lucide-react';

interface AnimalHomesProps {
  onBack: () => void;
}

interface AnimalMatch {
  animal: string;
  emoji: string;
  home: string;
  homeEmoji: string;
  fact: string;
}

const animalHomes: AnimalMatch[] = [
  { animal: 'Fish', emoji: '🐠', home: 'Ocean', homeEmoji: '🌊', fact: 'Fish breathe through gills underwater!' },
  { animal: 'Bird', emoji: '🐦', home: 'Nest', homeEmoji: '🪹', fact: 'Birds build nests in trees to keep eggs safe!' },
  { animal: 'Bear', emoji: '🐻', home: 'Cave', homeEmoji: '🕳️', fact: 'Bears hibernate in caves during winter!' },
  { animal: 'Bee', emoji: '🐝', home: 'Hive', homeEmoji: '🍯', fact: 'Bees make honey in their hives!' },
  { animal: 'Spider', emoji: '🕷️', home: 'Web', homeEmoji: '🕸️', fact: 'Spiders spin webs to catch their food!' },
  { animal: 'Ant', emoji: '🐜', home: 'Hill', homeEmoji: '⛰️', fact: 'Ants work together to build underground homes!' }
];

export const AnimalHomes: React.FC<AnimalHomesProps> = ({ onBack }) => {
  const [currentMatch, setCurrentMatch] = useState<AnimalMatch | null>(null);
  const [availableHomes, setAvailableHomes] = useState<AnimalMatch[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  useEffect(() => {
    generateNewChallenge();
  }, []);

  const generateNewChallenge = () => {
    const animal = animalHomes[Math.floor(Math.random() * animalHomes.length)];
    setCurrentMatch(animal);
    
    // Create options with correct answer and 2-3 wrong ones
    const wrongHomes = animalHomes.filter(h => h.animal !== animal.animal);
    const shuffledWrong = wrongHomes.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [animal, ...shuffledWrong].sort(() => Math.random() - 0.5);
    
    setAvailableHomes(options);
    setFeedback('');
    setShowFact(false);
  };

  const handleHomeSelect = (selectedHome: AnimalMatch) => {
    if (!currentMatch) return;

    if (selectedHome.home === currentMatch.home) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setFeedback(`🎉 Correct! ${currentMatch.animal}s live in ${currentMatch.home.toLowerCase()}s!`);
      setShowFact(true);
      
      if (streak > 0 && streak % 4 === 3) {
        setLevel(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      setTimeout(generateNewChallenge, 3000);
    } else {
      setStreak(0);
      setFeedback(`Try again! Think about where ${currentMatch.animal.toLowerCase()}s naturally live.`);
    }
  };

  if (!currentMatch) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🦁 Animal Homes
          </h1>
          <div className="flex items-center gap-2 text-white">
            <span className="font-bold">Level {level}</span>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">Score: {score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="font-bold">Streak: {streak}</span>
                </div>
              </div>
              <Progress value={(streak % 4) * 25} className="w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Animal Display */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Where does this animal live?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-8xl mb-4 animate-bounce">{currentMatch.emoji}</div>
            <h3 className="text-4xl font-bold text-green-600 mb-4">{currentMatch.animal}</h3>
            
            {showFact && (
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4">
                <p className="text-lg font-medium">🌟 Fun Fact: {currentMatch.fact}</p>
              </div>
            )}
            
            {feedback && (
              <div className={`p-3 rounded-lg mb-4 ${
                feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                <p className="text-lg font-medium">{feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Home Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableHomes.map((home, index) => (
            <Card 
              key={`${home.home}-${index}`}
              className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/95 backdrop-blur"
              onClick={() => handleHomeSelect(home)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-3">{home.homeEmoji}</div>
                <h4 className="text-xl font-bold text-gray-800">{home.home}</h4>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🦁</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're becoming an Animal Expert!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
