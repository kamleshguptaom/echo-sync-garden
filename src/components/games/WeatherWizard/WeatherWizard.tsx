
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Cloud, Sun, CloudRain } from 'lucide-react';

interface WeatherWizardProps {
  onBack: () => void;
}

interface WeatherScenario {
  condition: string;
  emoji: string;
  description: string;
  activities: string[];
  clothing: string[];
  correctActivities: string[];
  correctClothing: string[];
}

const weatherScenarios: WeatherScenario[] = [
  {
    condition: 'Sunny',
    emoji: '☀️',
    description: 'It\'s a bright, sunny day with clear skies!',
    activities: ['Swimming', 'Skiing', 'Beach volleyball', 'Building snowman', 'Picnic', 'Ice skating'],
    clothing: ['Sunglasses', 'Winter coat', 'Swimsuit', 'Snow boots', 'T-shirt', 'Heavy scarf'],
    correctActivities: ['Swimming', 'Beach volleyball', 'Picnic'],
    correctClothing: ['Sunglasses', 'Swimsuit', 'T-shirt']
  },
  {
    condition: 'Rainy',
    emoji: '🌧️',
    description: 'It\'s raining with dark clouds in the sky!',
    activities: ['Reading indoors', 'Skiing', 'Swimming outside', 'Board games', 'Jumping in puddles', 'Sunbathing'],
    clothing: ['Raincoat', 'Flip-flops', 'Umbrella', 'Sunglasses', 'Rain boots', 'Tank top'],
    correctActivities: ['Reading indoors', 'Board games', 'Jumping in puddles'],
    correctClothing: ['Raincoat', 'Umbrella', 'Rain boots']
  },
  {
    condition: 'Snowy',
    emoji: '❄️',
    description: 'It\'s snowing and very cold outside!',
    activities: ['Building snowman', 'Swimming', 'Skiing', 'Beach volleyball', 'Sledding', 'Ice skating'],
    clothing: ['Winter coat', 'Swimsuit', 'Snow boots', 'Sunglasses', 'Warm hat', 'Shorts'],
    correctActivities: ['Building snowman', 'Skiing', 'Sledding', 'Ice skating'],
    correctClothing: ['Winter coat', 'Snow boots', 'Warm hat']
  }
];

export const WeatherWizard: React.FC<WeatherWizardProps> = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState<WeatherScenario | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedClothing, setSelectedClothing] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gamePhase, setGamePhase] = useState<'activities' | 'clothing'>('activities');
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    generateNewScenario();
  }, []);

  const generateNewScenario = () => {
    const scenario = weatherScenarios[Math.floor(Math.random() * weatherScenarios.length)];
    setCurrentScenario(scenario);
    setSelectedActivities([]);
    setSelectedClothing([]);
    setGamePhase('activities');
    setFeedback('');
  };

  const handleActivitySelect = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(prev => prev.filter(a => a !== activity));
    } else if (selectedActivities.length < 3) {
      setSelectedActivities(prev => [...prev, activity]);
    }
  };

  const handleClothingSelect = (clothing: string) => {
    if (selectedClothing.includes(clothing)) {
      setSelectedClothing(prev => prev.filter(c => c !== clothing));
    } else if (selectedClothing.length < 3) {
      setSelectedClothing(prev => [...prev, clothing]);
    }
  };

  const checkActivities = () => {
    if (!currentScenario) return;
    
    const correctSelections = selectedActivities.filter(activity => 
      currentScenario.correctActivities.includes(activity)
    );
    
    if (correctSelections.length >= 2) {
      setScore(prev => prev + 10);
      setFeedback('🎉 Great job! Now choose the right clothes for this weather.');
      setGamePhase('clothing');
    } else {
      setFeedback('Try again! Think about what activities are good for this weather.');
    }
  };

  const checkClothing = () => {
    if (!currentScenario) return;
    
    const correctSelections = selectedClothing.filter(clothing => 
      currentScenario.correctClothing.includes(clothing)
    );
    
    if (correctSelections.length >= 2) {
      setScore(prev => prev + 10);
      setFeedback('🌟 Perfect! You\'re a Weather Wizard!');
      
      if (score > 0 && (score + 10) % 40 === 0) {
        setLevel(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      setTimeout(generateNewScenario, 2000);
    } else {
      setFeedback('Try again! Think about what clothes keep you comfortable in this weather.');
    }
  };

  if (!currentScenario) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🌤️ Weather Wizard
          </h1>
          <div className="flex items-center gap-2 text-white">
            <Cloud className="w-6 h-6" />
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
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <span className="font-bold">{gamePhase === 'activities' ? 'Choose Activities' : 'Choose Clothes'}</span>
                </div>
              </div>
              <Progress value={gamePhase === 'activities' ? 50 : 100} className="w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Weather Scenario */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Today's Weather</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-8xl mb-4 animate-bounce">{currentScenario.emoji}</div>
            <h3 className="text-3xl font-bold text-blue-600 mb-2">{currentScenario.condition}</h3>
            <p className="text-xl text-gray-600 mb-4">{currentScenario.description}</p>
            
            {feedback && (
              <div className={`p-3 rounded-lg mb-4 ${
                feedback.includes('Great') || feedback.includes('Perfect') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                <p className="text-lg font-medium">{feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Selection */}
        {gamePhase === 'activities' && (
          <Card className="mb-6 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                What activities are good for {currentScenario.condition.toLowerCase()} weather?
                <br />
                <span className="text-sm text-gray-500">Choose 2-3 activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {currentScenario.activities.map((activity) => (
                  <Button
                    key={activity}
                    onClick={() => handleActivitySelect(activity)}
                    className={`p-4 h-auto text-center ${
                      selectedActivities.includes(activity)
                        ? 'bg-blue-500 text-white scale-105'
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    } transition-all`}
                  >
                    <div className="text-lg font-medium">{activity}</div>
                  </Button>
                ))}
              </div>
              
              <div className="text-center">
                <Button
                  onClick={checkActivities}
                  disabled={selectedActivities.length < 2}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-xl"
                >
                  Check Activities ({selectedActivities.length}/3)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clothing Selection */}
        {gamePhase === 'clothing' && (
          <Card className="mb-6 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                What should you wear in {currentScenario.condition.toLowerCase()} weather?
                <br />
                <span className="text-sm text-gray-500">Choose 2-3 items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {currentScenario.clothing.map((clothing) => (
                  <Button
                    key={clothing}
                    onClick={() => handleClothingSelect(clothing)}
                    className={`p-4 h-auto text-center ${
                      selectedClothing.includes(clothing)
                        ? 'bg-green-500 text-white scale-105'
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                    } transition-all`}
                  >
                    <div className="text-lg font-medium">{clothing}</div>
                  </Button>
                ))}
              </div>
              
              <div className="text-center">
                <Button
                  onClick={checkClothing}
                  disabled={selectedClothing.length < 2}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-xl"
                >
                  Check Clothing ({selectedClothing.length}/3)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🌦️</div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're becoming a Weather Expert!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[Sun, Cloud, CloudRain].map((Icon, i) => (
                  <Icon key={i} className="w-8 h-8 text-blue-500 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
