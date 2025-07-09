import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Palette, RotateCcw, Sparkles, Volume2, Target } from 'lucide-react';

interface Color {
  name: string;
  hex: string;
  rgb: [number, number, number];
  emoji: string;
}

interface ColorLabProps {
  onBack: () => void;
}

const primaryColors: Color[] = [
  { name: 'Red', hex: '#FF0000', rgb: [255, 0, 0], emoji: '🔴' },
  { name: 'Blue', hex: '#0000FF', rgb: [0, 0, 255], emoji: '🔵' },
  { name: 'Yellow', hex: '#FFFF00', rgb: [255, 255, 0], emoji: '🟡' }
];

const secondaryColors: Color[] = [
  { name: 'Purple', hex: '#800080', rgb: [128, 0, 128], emoji: '🟣' },
  { name: 'Green', hex: '#008000', rgb: [0, 128, 0], emoji: '🟢' },
  { name: 'Orange', hex: '#FFA500', rgb: [255, 165, 0], emoji: '🟠' }
];

const tertiaryColors: Color[] = [
  { name: 'Red-Orange', hex: '#FF4500', rgb: [255, 69, 0], emoji: '🔸' },
  { name: 'Yellow-Orange', hex: '#FFAA00', rgb: [255, 170, 0], emoji: '🟨' },
  { name: 'Yellow-Green', hex: '#9ACD32', rgb: [154, 205, 50], emoji: '💚' },
  { name: 'Blue-Green', hex: '#00CED1', rgb: [0, 206, 209], emoji: '🩵' },
  { name: 'Blue-Purple', hex: '#8A2BE2', rgb: [138, 43, 226], emoji: '💜' },
  { name: 'Red-Purple', hex: '#DC143C', rgb: [220, 20, 60], emoji: '❤️' }
];

const mixingRecipes: Record<string, Color> = {
  'Red-Blue': { name: 'Purple', hex: '#800080', rgb: [128, 0, 128], emoji: '🟣' },
  'Blue-Yellow': { name: 'Green', hex: '#008000', rgb: [0, 128, 0], emoji: '🟢' },
  'Red-Yellow': { name: 'Orange', hex: '#FFA500', rgb: [255, 165, 0], emoji: '🟠' },
  'Red-Green': { name: 'Brown', hex: '#8B4513', rgb: [139, 69, 19], emoji: '🤎' },
  'Blue-Orange': { name: 'Gray', hex: '#808080', rgb: [128, 128, 128], emoji: '🩶' },
  'Purple-Yellow': { name: 'Muddy Brown', hex: '#6B4423', rgb: [107, 68, 35], emoji: '🤎' }
};

const challenges = [
  { target: 'Purple', hint: '🦊 Professor Hue says: Mix fire and ocean colors!', level: 1 },
  { target: 'Green', hint: '🦊 Professor Hue says: Mix sky and sunshine!', level: 1 },
  { target: 'Orange', hint: '🦊 Professor Hue says: Mix fire and sunshine!', level: 1 },
  { target: 'Brown', hint: '🦊 Professor Hue says: Try mixing a primary with a secondary!', level: 2 },
  { target: 'Gray', hint: '🦊 Professor Hue says: What happens when opposites meet?', level: 2 }
];

export const ColorLab: React.FC<ColorLabProps> = ({ onBack }) => {
  const [beakerColors, setBeakerColors] = useState<Color[]>([]);
  const [mixedColor, setMixedColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [gameMode, setGameMode] = useState<'free' | 'challenge'>('challenge');
  const [showCelebration, setShowCelebration] = useState(false);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [isSwirling, setIsSwirling] = useState(false);
  const [stars, setStars] = useState(0);
  const [mixingAnimation, setMixingAnimation] = useState(false);
  const [speedBonus, setSpeedBonus] = useState(0);
  const [lastMixTime, setLastMixTime] = useState(Date.now());
  const beakerRef = useRef<HTMLDivElement>(null);

  const playSound = (type: 'success' | 'mix' | 'hint') => {
    if (!window.speechSynthesis) return;
    
    const sounds = {
      success: '🎉 Amazing! You created the perfect color!',
      mix: '✨ Colors are mixing...',
      hint: challenges[currentChallenge]?.hint || 'Keep experimenting!'
    };

    const utterance = new SpeechSynthesisUtterance(sounds[type]);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleDragStart = (e: React.DragEvent, color: Color) => {
    e.dataTransfer.setData('color', JSON.stringify(color));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const colorData = e.dataTransfer.getData('color');
    if (!colorData) return;

    const color = JSON.parse(colorData) as Color;
    if (beakerColors.length < 3 && !beakerColors.find(c => c.name === color.name)) {
      setBeakerColors(prev => [...prev, color]);
      
      if (beakerColors.length >= 1) {
        setMixingAnimation(true);
        setIsSwirling(true);
        playSound('mix');
        setTimeout(() => mixColors([...beakerColors, color]), 1000);
      }
    }
  };

  const mixColors = (colors: Color[]) => {
    if (colors.length < 2) return;

    setMixingAnimation(true);
    
    // Create color mixing effect
    const sortedNames = colors.map(c => c.name).sort().join('-');
    const result = mixingRecipes[sortedNames];
    
    if (result) {
      setMixedColor(result);
      setScore(prev => prev + 15);
      
      // Speed bonus
      const timeDiff = Date.now() - lastMixTime;
      if (timeDiff < 5000) {
        const bonus = Math.max(1, Math.floor((5000 - timeDiff) / 1000));
        setSpeedBonus(bonus);
        setScore(prev => prev + bonus * 5);
      }
      
      if (!discoveries.includes(result.name)) {
        setDiscoveries(prev => [...prev, result.name]);
        setStars(prev => prev + 1);
        setShowCelebration(true);
        playSound('success');
        setTimeout(() => setShowCelebration(false), 3000);
      }

      // Check challenge completion
      if (gameMode === 'challenge') {
        const challenge = challenges[currentChallenge];
        if (challenge && result.name === challenge.target) {
          setScore(prev => prev + 25);
          setStars(prev => prev + 2);
          setTimeout(() => {
            if (currentChallenge < challenges.length - 1) {
              setCurrentChallenge(prev => prev + 1);
              clearBeaker();
            } else {
              setLevel(prev => prev + 1);
              setCurrentChallenge(0);
              clearBeaker();
            }
          }, 2000);
        }
      }
    } else {
      // Create a muddy color for unsuccessful mixes
      setMixedColor({ name: 'Muddy Mix', hex: '#8B4513', rgb: [139, 69, 19], emoji: '🤎' });
    }
    
    setTimeout(() => {
      setMixingAnimation(false);
      setIsSwirling(false);
    }, 1500);
    
    setLastMixTime(Date.now());
  };

  const clearBeaker = () => {
    setBeakerColors([]);
    setMixedColor(null);
    setIsSwirling(false);
    setMixingAnimation(false);
    setSpeedBonus(0);
  };

  const getGradientBackground = () => {
    if (beakerColors.length === 0) return 'bg-gray-100';
    if (beakerColors.length === 1) return `bg-gradient-to-b from-white to-[${beakerColors[0].hex}]`;
    if (beakerColors.length === 2) {
      return `bg-gradient-to-b from-[${beakerColors[0].hex}] via-white to-[${beakerColors[1].hex}]`;
    }
    return `bg-gradient-to-b from-[${beakerColors[0].hex}] via-[${beakerColors[1].hex}] to-[${beakerColors[2]?.hex}]`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white flex items-center gap-2 justify-center">
              🎨 Magic Color Lab
            </h1>
            <p className="text-white/90 text-lg">Mix colors and create magic! 🦊</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => playSound('hint')} className="bg-white/20 hover:bg-white/30 text-white">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button onClick={clearBeaker} className="bg-white/20 hover:bg-white/30 text-white">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats and Mode */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-xl">{stars}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">Score: {score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  <span className="font-bold">Level: {level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-500" />
                  <span className="font-bold">Discoveries: {discoveries.length}</span>
                </div>
                {speedBonus > 0 && (
                  <div className="animate-pulse bg-yellow-100 px-3 py-1 rounded-full">
                    <span className="text-yellow-800 font-bold">⚡ Speed Bonus +{speedBonus * 5}!</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setGameMode('challenge')}
                  className={gameMode === 'challenge' ? 'bg-purple-500 text-white' : 'bg-gray-200'}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Challenge
                </Button>
                <Button
                  onClick={() => setGameMode('free')}
                  className={gameMode === 'free' ? 'bg-purple-500 text-white' : 'bg-gray-200'}
                >
                  Free Mix
                </Button>
              </div>
            </div>
            <Progress value={(discoveries.length / 10) * 100} className="h-3" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paint Palette */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-xl">🎨 Paint Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2">Primary Colors</h3>
                  <div className="flex gap-2">
                    {primaryColors.map((color) => (
                      <div
                        key={color.name}
                        draggable
                        onDragStart={(e) => handleDragStart(e, color)}
                        className="w-16 h-16 rounded-full cursor-grab active:cursor-grabbing transition-transform hover:scale-110 flex items-center justify-center shadow-lg border-4 border-white"
                        style={{ backgroundColor: color.hex }}
                      >
                        <span className="text-2xl">{color.emoji}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {level >= 2 && (
                  <div>
                    <h3 className="font-bold mb-2">Secondary Colors</h3>
                    <div className="flex gap-2">
                      {secondaryColors.map((color) => (
                        <div
                          key={color.name}
                          draggable
                          onDragStart={(e) => handleDragStart(e, color)}
                          className="w-16 h-16 rounded-full cursor-grab active:cursor-grabbing transition-transform hover:scale-110 flex items-center justify-center shadow-lg border-4 border-white"
                          style={{ backgroundColor: color.hex }}
                        >
                          <span className="text-2xl">{color.emoji}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mixing Beaker */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-xl">🧪 Magic Beaker</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {gameMode === 'challenge' && (
                <div className="mb-4 p-3 bg-yellow-100 rounded-lg border-2 border-yellow-300">
                  <h3 className="font-bold text-lg">Challenge #{currentChallenge + 1}</h3>
                  <p className="text-lg">Create: <span className="font-bold text-purple-600">{challenges[currentChallenge]?.target}</span></p>
                  <p className="text-sm text-gray-600">{challenges[currentChallenge]?.hint}</p>
                </div>
              )}

              <div 
                ref={beakerRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative w-40 h-60 mx-auto border-8 border-gray-300 rounded-b-full bg-gray-100 transition-all duration-1000 ${
                  isSwirling ? 'animate-pulse' : ''
                }`}
                style={{
                  background: mixedColor ? 
                    `linear-gradient(to bottom, ${mixedColor.hex}40, ${mixedColor.hex})` :
                    beakerColors.length > 0 ?
                      `linear-gradient(to bottom, ${beakerColors.map(c => c.hex + '60').join(', ')})` :
                      '#f3f4f6'
                }}
              >
                {/* Bubbling effects */}
                {mixingAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/70 rounded-full animate-bounce"></div>
                    <div className="w-6 h-6 bg-white/50 rounded-full animate-bounce delay-150 ml-2"></div>
                    <div className="w-4 h-4 bg-white/30 rounded-full animate-bounce delay-300 ml-1"></div>
                  </div>
                )}

                {/* Swirling effect */}
                {isSwirling && (
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="w-full h-full rounded-b-full border-4 border-white/30"></div>
                  </div>
                )}

                {/* Color drops in beaker */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {beakerColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-white animate-bounce"
                      style={{ 
                        backgroundColor: color.hex,
                        animationDelay: `${index * 200}ms`
                      }}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-4 text-lg font-medium text-gray-600">
                Drag paint drops here to mix! 🎨
              </p>

              {mixedColor && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <div className="text-4xl mb-2">{mixedColor.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800">{mixedColor.name}!</h3>
                  <p className="text-sm text-gray-600">🎉 Amazing color creation!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results & Progress */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-xl">🏆 Progress Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              {discoveries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold">Your Color Discoveries:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {discoveries.map((colorName, index) => {
                      const color = Object.values(mixingRecipes).find(c => c.name === colorName);
                      return color ? (
                        <div key={index} className="text-center p-2 bg-white rounded-lg shadow">
                          <div
                            className="w-12 h-12 rounded-full mx-auto mb-1 flex items-center justify-center"
                            style={{ backgroundColor: color.hex }}
                          >
                            <span className="text-lg">{color.emoji}</span>
                          </div>
                          <p className="text-xs font-medium">{colorName}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-bold mb-2">🦊 Professor Hue's Tips:</h3>
                <div className="space-y-2 text-sm bg-blue-50 p-3 rounded-lg">
                  <p>• Primary colors can't be made - they're pure!</p>
                  <p>• Mix two primaries to get secondary colors</p>
                  <p>• Experiment with different combinations!</p>
                  <p>• Speed mixing gives bonus points! ⚡</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce max-w-md">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">New Discovery!</h3>
              <p className="text-xl text-gray-600 mb-4">You created {mixedColor?.name}!</p>
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-500 fill-current animate-spin" />
                ))}
              </div>
              <p className="text-lg">🦊 Professor Hue is proud of you!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};