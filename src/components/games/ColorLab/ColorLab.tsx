
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Palette, RotateCcw, Sparkles } from 'lucide-react';

interface Color {
  name: string;
  hex: string;
  rgb: [number, number, number];
}

interface ColorLabProps {
  onBack: () => void;
}

const primaryColors: Color[] = [
  { name: 'Red', hex: '#FF0000', rgb: [255, 0, 0] },
  { name: 'Blue', hex: '#0000FF', rgb: [0, 0, 255] },
  { name: 'Yellow', hex: '#FFFF00', rgb: [255, 255, 0] }
];

const mixingResults: Record<string, Color> = {
  'Red-Blue': { name: 'Purple', hex: '#800080', rgb: [128, 0, 128] },
  'Blue-Yellow': { name: 'Green', hex: '#008000', rgb: [0, 128, 0] },
  'Red-Yellow': { name: 'Orange', hex: '#FFA500', rgb: [255, 165, 0] }
};

const colorChallenges = [
  { target: 'Purple', colors: ['Red', 'Blue'], hint: 'Mix fire and ocean!' },
  { target: 'Green', colors: ['Blue', 'Yellow'], hint: 'Mix sky and sun!' },
  { target: 'Orange', colors: ['Red', 'Yellow'], hint: 'Mix fire and sun!' }
];

export const ColorLab: React.FC<ColorLabProps> = ({ onBack }) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mixedColor, setMixedColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameMode, setGameMode] = useState<'free' | 'challenge'>('free');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [paintBrushActive, setPaintBrushActive] = useState(false);

  const handleColorSelect = (colorName: string) => {
    if (selectedColors.length < 2 && !selectedColors.includes(colorName)) {
      const newSelection = [...selectedColors, colorName];
      setSelectedColors(newSelection);
      setPaintBrushActive(true);
      
      if (newSelection.length === 2) {
        setTimeout(() => mixColors(newSelection), 500);
      }
    }
  };

  const mixColors = (colors: string[]) => {
    const sortedColors = colors.sort().join('-');
    const result = mixingResults[sortedColors];
    
    if (result) {
      setMixedColor(result);
      setScore(prev => prev + 10);
      
      if (!discoveries.includes(result.name)) {
        setDiscoveries(prev => [...prev, result.name]);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }

      // Check challenge completion
      if (gameMode === 'challenge') {
        const challenge = colorChallenges[currentChallenge];
        if (challenge && result.name === challenge.target) {
          setScore(prev => prev + 20);
          setTimeout(() => {
            if (currentChallenge < colorChallenges.length - 1) {
              setCurrentChallenge(prev => prev + 1);
              resetMixing();
            } else {
              setLevel(prev => prev + 1);
              setCurrentChallenge(0);
            }
          }, 2000);
        }
      }
    }
    setPaintBrushActive(false);
  };

  const resetMixing = () => {
    setSelectedColors([]);
    setMixedColor(null);
    setPaintBrushActive(false);
  };

  const startChallenge = () => {
    setGameMode('challenge');
    setCurrentChallenge(0);
    resetMixing();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🎨 Magic Color Lab
          </h1>
          <div className="flex gap-2">
            <Button onClick={resetMixing} className="bg-white/20 hover:bg-white/30 text-white">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="text-white font-bold">Level {level}</div>
          </div>
        </div>

        {/* Stats and Mode Toggle */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">Score: {score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">Discoveries: {discoveries.length}/3</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setGameMode('free')}
                  className={gameMode === 'free' ? 'bg-purple-500 text-white' : 'bg-gray-200'}
                >
                  Free Mix
                </Button>
                <Button
                  onClick={startChallenge}
                  className={gameMode === 'challenge' ? 'bg-purple-500 text-white' : 'bg-gray-200'}
                >
                  Challenge
                </Button>
              </div>
            </div>
            <Progress value={(discoveries.length / 3) * 100} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Mixing Station */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
                <Palette className="w-6 h-6 text-purple-600" />
                {gameMode === 'challenge' ? 'Color Challenge!' : 'Mix Colors!'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gameMode === 'challenge' && (
                <div className="mb-6 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300">
                  <h3 className="font-bold text-lg">Challenge #{currentChallenge + 1}</h3>
                  <p className="text-lg">Create: <span className="font-bold text-purple-600">{colorChallenges[currentChallenge]?.target}</span></p>
                  <p className="text-sm text-gray-600">{colorChallenges[currentChallenge]?.hint}</p>
                </div>
              )}

              {/* Paint Palette */}
              <div className="mb-6 p-6 bg-gray-100 rounded-xl border-4 border-gray-300">
                <div className="grid grid-cols-3 gap-4">
                  {primaryColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorSelect(color.name)}
                      disabled={selectedColors.includes(color.name) || selectedColors.length >= 2}
                      className={`relative p-6 text-2xl font-bold rounded-xl transition-all duration-300 transform hover:scale-110 ${
                        selectedColors.includes(color.name) 
                          ? 'ring-4 ring-white shadow-2xl scale-110 animate-pulse' 
                          : 'hover:shadow-xl'
                      } ${color.name === 'Yellow' ? 'text-black' : 'text-white'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {color.name}
                      {selectedColors.includes(color.name) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl animate-spin">🎨</div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mixing Animation */}
              {paintBrushActive && (
                <div className="text-center mb-4">
                  <div className="text-4xl animate-bounce">🖌️</div>
                  <p className="text-lg font-medium text-purple-600">Mixing colors...</p>
                </div>
              )}

              {selectedColors.length > 0 && (
                <div className="text-center mb-4">
                  <p className="text-lg mb-2 font-medium">Selected Colors:</p>
                  <div className="flex justify-center gap-2">
                    {selectedColors.map((colorName, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                          style={{ 
                            backgroundColor: primaryColors.find(c => c.name === colorName)?.hex 
                          }}
                        />
                        {index < selectedColors.length - 1 && (
                          <span className="mx-2 text-2xl">+</span>
                        )}
                      </div>
                    ))}
                    {selectedColors.length === 2 && (
                      <div className="flex items-center">
                        <span className="mx-2 text-2xl">=</span>
                        <div className="text-2xl animate-spin">✨</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Display */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Magic Result!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {mixedColor ? (
                <div className="space-y-4">
                  <div className="relative">
                    <div
                      className="w-48 h-48 rounded-full mx-auto border-8 border-white shadow-2xl animate-pulse"
                      style={{ backgroundColor: mixedColor.hex }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl animate-bounce">✨</div>
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-800 mb-2">{mixedColor.name}!</h3>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                    <p className="text-lg font-medium">
                      🎉 {selectedColors.join(' + ')} = {mixedColor.name}
                    </p>
                  </div>
                  
                  {/* Fun facts */}
                  <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                    <h4 className="font-bold mb-2">Fun Fact:</h4>
                    <p className="text-sm">
                      {mixedColor.name === 'Purple' && 'Purple is the color of royalty and magic!'}
                      {mixedColor.name === 'Green' && 'Green is the color of nature and growth!'}
                      {mixedColor.name === 'Orange' && 'Orange is the color of energy and creativity!'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-20">
                  <div className="w-48 h-48 rounded-full mx-auto border-8 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-6xl">🎨</div>
                  </div>
                  <p className="text-xl text-gray-500 mt-4">
                    {selectedColors.length === 0 
                      ? 'Select two colors to create magic!' 
                      : 'Select one more color!'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Discoveries Gallery */}
        {discoveries.length > 0 && (
          <Card className="mt-6 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Your Color Discoveries!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                {discoveries.map((colorName) => {
                  const color = Object.values(mixingResults).find(c => c.name === colorName);
                  return color ? (
                    <div key={colorName} className="text-center">
                      <div
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2"
                        style={{ backgroundColor: color.hex }}
                      />
                      <p className="font-bold text-sm">{colorName}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">New Discovery!</h3>
              <p className="text-xl text-gray-600">You created {mixedColor?.name}!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-500 fill-current animate-spin" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
