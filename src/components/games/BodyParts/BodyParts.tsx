
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy } from 'lucide-react';

interface BodyPartsProps {
  onBack: () => void;
}

interface BodyPart {
  name: string;
  emoji: string;
  function: string;
  x: number;
  y: number;
}

const bodyParts: BodyPart[] = [
  { name: 'Head', emoji: '🤯', function: 'Controls thinking and seeing!', x: 50, y: 15 },
  { name: 'Eyes', emoji: '👀', function: 'Help you see the world!', x: 45, y: 20 },
  { name: 'Nose', emoji: '👃', function: 'Helps you smell and breathe!', x: 50, y: 25 },
  { name: 'Mouth', emoji: '👄', function: 'Used for eating and talking!', x: 50, y: 30 },
  { name: 'Arms', emoji: '💪', function: 'Help you lift and carry things!', x: 25, y: 45 },
  { name: 'Hands', emoji: '👋', function: 'Help you grab and touch!', x: 15, y: 60 },
  { name: 'Heart', emoji: '❤️', function: 'Pumps blood through your body!', x: 50, y: 50 },
  { name: 'Legs', emoji: '🦵', function: 'Help you walk and run!', x: 50, y: 75 },
  { name: 'Feet', emoji: '🦶', function: 'Help you stand and balance!', x: 50, y: 90 }
];

export const BodyParts: React.FC<BodyPartsProps> = ({ onBack }) => {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [foundParts, setFoundParts] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState<'explore' | 'quiz'>('explore');

  const handlePartClick = (part: BodyPart) => {
    setSelectedPart(part);
    if (!foundParts.includes(part.name)) {
      setFoundParts(prev => [...prev, part.name]);
      setScore(prev => prev + 10);
    }
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
            🧠 Body Parts Explorer
          </h1>
          <div className="flex items-center gap-2 text-white">
            <Star className="w-6 h-6" />
            <span className="font-bold">Found: {foundParts.length}/{bodyParts.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Body */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Click on body parts to learn!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg">
                {/* Simple body outline */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <ellipse cx="50" cy="15" rx="8" ry="10" fill="#FCD34D" stroke="#000" strokeWidth="0.5"/>
                  <rect x="46" y="25" width="8" height="30" fill="#FCD34D" stroke="#000" strokeWidth="0.5"/>
                  <line x1="46" y1="35" x2="35" y2="50" stroke="#000" strokeWidth="2"/>
                  <line x1="54" y1="35" x2="65" y2="50" stroke="#000" strokeWidth="2"/>
                  <line x1="46" y1="55" x2="40" y2="85" stroke="#000" strokeWidth="2"/>
                  <line x1="54" y1="55" x2="60" y2="85" stroke="#000" strokeWidth="2"/>
                </svg>
                
                {/* Clickable body parts */}
                {bodyParts.map((part) => (
                  <button
                    key={part.name}
                    onClick={() => handlePartClick(part)}
                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-200 hover:scale-125 ${
                      foundParts.includes(part.name) 
                        ? 'bg-green-500 text-white shadow-lg animate-pulse' 
                        : 'bg-yellow-400 hover:bg-yellow-500'
                    }`}
                    style={{
                      left: `${part.x}%`,
                      top: `${part.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {part.emoji}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Information Panel */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {selectedPart ? selectedPart.name : 'Select a body part!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {selectedPart ? (
                <div className="space-y-4">
                  <div className="text-6xl animate-bounce">{selectedPart.emoji}</div>
                  <h3 className="text-3xl font-bold text-purple-600">{selectedPart.name}</h3>
                  <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
                    <p className="text-lg">{selectedPart.function}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-100 p-3 rounded">
                      <p className="font-bold">Fun Fact:</p>
                      <p className="text-sm">Your {selectedPart.name.toLowerCase()} is amazing!</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded">
                      <p className="font-bold">Care Tip:</p>
                      <p className="text-sm">Keep your {selectedPart.name.toLowerCase()} healthy!</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20">
                  <div className="text-6xl mb-4">🧠</div>
                  <p className="text-xl text-gray-600">
                    Click on the yellow buttons to learn about different body parts!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="mt-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Discovery Progress:</span>
              <span className="text-sm">{foundParts.length} / {bodyParts.length} parts found</span>
            </div>
            <Progress value={(foundParts.length / bodyParts.length) * 100} className="h-3" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
