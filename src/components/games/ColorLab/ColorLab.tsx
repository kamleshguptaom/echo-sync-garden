
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Palette, RotateCcw } from 'lucide-react';

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

export const ColorLab: React.FC<ColorLabProps> = ({ onBack }) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mixedColor, setMixedColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleColorSelect = (colorName: string) => {
    if (selectedColors.length < 2 && !selectedColors.includes(colorName)) {
      const newSelection = [...selectedColors, colorName];
      setSelectedColors(newSelection);
      
      if (newSelection.length === 2) {
        mixColors(newSelection);
      }
    }
  };

  const mixColors = (colors: string[]) => {
    const sortedColors = colors.sort().join('-');
    const result = mixingResults[sortedColors];
    
    if (result) {
      setMixedColor(result);
      setScore(prev => prev + 10);
      setShowCelebration(true);
      
      setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
    }
  };

  const resetMixing = () => {
    setSelectedColors([]);
    setMixedColor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🎨 Color Lab
          </h1>
          <Button onClick={resetMixing} className="bg-white/20 hover:bg-white/30 text-white">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">Level {level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">{score}</span>
                </div>
              </div>
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Selection */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Choose Two Colors to Mix!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {primaryColors.map((color) => (
                  <Button
                    key={color.name}
                    onClick={() => handleColorSelect(color.name)}
                    disabled={selectedColors.includes(color.name) || selectedColors.length >= 2}
                    className={`p-6 text-2xl font-bold rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      selectedColors.includes(color.name) 
                        ? 'ring-4 ring-white shadow-lg scale-105' 
                        : 'hover:shadow-lg'
                    }`}
                    style={{ 
                      backgroundColor: color.hex,
                      color: color.name === 'Yellow' ? '#000' : '#fff'
                    }}
                  >
                    {color.name}
                  </Button>
                ))}
              </div>
              
              {selectedColors.length > 0 && (
                <div className="text-center">
                  <p className="text-lg mb-2">Selected Colors:</p>
                  <div className="flex justify-center gap-2">
                    {selectedColors.map((colorName, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                        style={{ 
                          backgroundColor: primaryColors.find(c => c.name === colorName)?.hex 
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Display */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Mixed Color Result</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {mixedColor ? (
                <div className="animate-bounce">
                  <div
                    className="w-40 h-40 rounded-full mx-auto mb-4 border-8 border-white shadow-xl"
                    style={{ backgroundColor: mixedColor.hex }}
                  />
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{mixedColor.name}!</h3>
                  <p className="text-lg text-gray-600">
                    {selectedColors.join(' + ')} = {mixedColor.name}
                  </p>
                </div>
              ) : (
                <div className="py-20">
                  <div className="w-40 h-40 rounded-full mx-auto mb-4 border-8 border-dashed border-gray-300" />
                  <p className="text-xl text-gray-500">
                    {selectedColors.length === 0 
                      ? 'Select two colors to see the magic!' 
                      : 'Select one more color!'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">Amazing!</h3>
              <p className="text-xl text-gray-600">You created {mixedColor?.name}!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
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
