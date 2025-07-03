
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Heart } from 'lucide-react';

interface Emotion {
  name: string;
  emoji: string;
  description: string;
  color: string;
  situation: string;
}

interface FeelingFacesProps {
  onBack: () => void;
}

const emotions: Emotion[] = [
  { 
    name: 'Happy', 
    emoji: '😊', 
    description: 'Feeling joyful and cheerful!', 
    color: 'bg-yellow-400',
    situation: 'When you play with friends or get a surprise!'
  },
  { 
    name: 'Sad', 
    emoji: '😢', 
    description: 'Feeling down or upset.', 
    color: 'bg-blue-400',
    situation: 'When something disappointing happens or you miss someone.'
  },
  { 
    name: 'Angry', 
    emoji: '😠', 
    description: 'Feeling mad or frustrated.', 
    color: 'bg-red-400',
    situation: 'When things don\'t go as planned or someone is unfair.'
  },
  { 
    name: 'Surprised', 
    emoji: '😲', 
    description: 'Feeling amazed or shocked!', 
    color: 'bg-orange-400',
    situation: 'When something unexpected happens!'
  },
  { 
    name: 'Scared', 
    emoji: '😨', 
    description: 'Feeling afraid or worried.', 
    color: 'bg-purple-400',
    situation: 'When facing something unknown or frightening.'
  },
  { 
    name: 'Excited', 
    emoji: '🤩', 
    description: 'Feeling very happy and energetic!', 
    color: 'bg-pink-400',
    situation: 'When looking forward to something fun!'
  }
];

export const FeelingFaces: React.FC<FeelingFacesProps> = ({ onBack }) => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<string>('');
  const [showInfo, setShowInfo] = useState(false);
  const [gameMode, setGameMode] = useState<'identify' | 'learn'>('identify');

  useEffect(() => {
    if (gameMode === 'identify') {
      generateNewQuestion();
    }
  }, [gameMode]);

  const generateNewQuestion = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const wrongOptions = emotions
      .filter(e => e.name !== randomEmotion.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    setCurrentEmotion(randomEmotion);
    setOptions([randomEmotion, ...wrongOptions].sort(() => Math.random() - 0.5));
    setFeedback('');
    setShowInfo(false);
  };

  const handleEmotionSelect = (selectedEmotion: Emotion) => {
    if (!currentEmotion) return;

    const isCorrect = selectedEmotion.name === currentEmotion.name;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback(`🎉 Correct! This face shows ${currentEmotion.name}!`);
      setShowInfo(true);
      
      if (score > 0 && score % 50 === 40) {
        setLevel(prev => prev + 1);
      }
    } else {
      setFeedback(`❌ Try again! This face shows ${currentEmotion.name}, not ${selectedEmotion.name}.`);
    }

    setTimeout(() => {
      if (isCorrect) {
        generateNewQuestion();
      } else {
        setFeedback('');
      }
    }, 3000);
  };

  const speakEmotion = (emotion: Emotion) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(
        `This person is feeling ${emotion.name}. ${emotion.description} ${emotion.situation}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 p-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            😊 Feeling Faces
          </h1>
          <Button 
            onClick={() => setGameMode(gameMode === 'identify' ? 'learn' : 'identify')}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            {gameMode === 'identify' ? 'Learn Mode' : 'Quiz Mode'}
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
              <span className="text-sm font-medium">Mode: {gameMode === 'identify' ? 'Identify' : 'Learn'}</span>
            </div>
          </CardContent>
        </Card>

        {gameMode === 'identify' && currentEmotion && (
          <>
            {/* Current Emotion Question */}
            <Card className="mb-6 bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-2xl">How is this person feeling?</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div 
                  className={`${currentEmotion.color} rounded-full w-40 h-40 mx-auto flex items-center justify-center mb-4 cursor-pointer animate-bounce hover:scale-110 transition-transform`}
                  onClick={() => speakEmotion(currentEmotion)}
                >
                  <span className="text-8xl">{currentEmotion.emoji}</span>
                </div>
                <p className="text-lg text-gray-600 mb-4">Click the face to hear more!</p>
                
                {feedback && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <p className="text-lg font-medium">{feedback}</p>
                  </div>
                )}
                
                {showInfo && (
                  <div className="mb-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                    <p className="text-lg font-medium text-blue-800">
                      💡 {currentEmotion.description}
                    </p>
                    <p className="text-md text-blue-700 mt-2">{currentEmotion.situation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {options.map((emotion, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/95 backdrop-blur"
                  onClick={() => handleEmotionSelect(emotion)}
                >
                  <CardContent className="p-6 text-center">
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">{emotion.name}</h4>
                    <p className="text-sm text-gray-600">{emotion.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {gameMode === 'learn' && (
          <>
            {/* Learn Mode - All Emotions */}
            <Card className="mb-6 bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Learn About Different Feelings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-lg text-gray-600 mb-4">
                  Click on any emotion to learn more about it!
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {emotions.map((emotion, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white/95 backdrop-blur"
                  onClick={() => speakEmotion(emotion)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${emotion.color} rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-3`}>
                      <span className="text-4xl">{emotion.emoji}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{emotion.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{emotion.description}</p>
                    <p className="text-xs text-gray-500">{emotion.situation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emotional Tips */}
            <Card className="mt-6 bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  Emotion Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-green-100 rounded-lg">
                    <div className="text-3xl mb-2">🤗</div>
                    <p className="font-semibold text-green-800">It's okay to feel different emotions!</p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="font-semibold text-blue-800">Talk to someone you trust about your feelings!</p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg">
                    <div className="text-3xl mb-2">🌈</div>
                    <p className="font-semibold text-yellow-800">Feelings come and go like weather!</p>
                  </div>
                  <div className="p-4 bg-purple-100 rounded-lg">
                    <div className="text-3xl mb-2">❤️</div>
                    <p className="font-semibold text-purple-800">Be kind to yourself and others!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
