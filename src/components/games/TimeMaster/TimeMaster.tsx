
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Clock, RotateCcw } from 'lucide-react';
import { InteractiveClock } from './components/InteractiveClock';

interface TimeMasterProps {
  onBack: () => void;
}

interface TimeChallenge {
  hour: number;
  minute: number;
  timeString: string;
}

export const TimeMaster: React.FC<TimeMasterProps> = ({ onBack }) => {
  const [targetTime, setTargetTime] = useState<TimeChallenge | null>(null);
  const [userHour, setUserHour] = useState(12);
  const [userMinute, setUserMinute] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);

  const generateTimeChallenge = () => {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = level > 3 ? Math.floor(Math.random() * 12) * 5 : 0; // Start with o'clock times
    const timeString = `${hour}:${minute.toString().padStart(2, '0')}`;
    
    setTargetTime({ hour, minute, timeString });
    setUserHour(12);
    setUserMinute(0);
    setFeedback('');
  };

  useEffect(() => {
    generateTimeChallenge();
  }, [level]);

  const checkAnswer = () => {
    if (!targetTime) return;

    const hourMatch = userHour === targetTime.hour;
    const minuteMatch = userMinute === targetTime.minute;
    
    if (hourMatch && minuteMatch) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setFeedback('🎉 Perfect! You set the clock correctly!');
      
      if (streak > 0 && streak % 3 === 2) {
        setLevel(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      setTimeout(generateTimeChallenge, 2000);
    } else {
      setStreak(0);
      setFeedback('Try again! Look at the time and move the clock hands.');
    }
  };

  const getClockHandStyle = (value: number, isHour: boolean) => {
    const angle = isHour ? (value % 12) * 30 - 90 : value * 6 - 90;
    return {
      transform: `rotate(${angle}deg)`,
      transformOrigin: '50% 100%'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🕐 Time Master
          </h1>
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-6 h-6" />
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
                  <span className="font-bold">Streak: {streak}</span>
                </div>
              </div>
              <Progress value={(streak % 3) * 33.33} className="w-32" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Target Time Display */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Set the clock to show:</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {targetTime && (
                <div className="mb-6">
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {targetTime.timeString}
                  </div>
                  <p className="text-xl text-gray-600">
                    {targetTime.hour} o'clock {targetTime.minute > 0 ? `and ${targetTime.minute} minutes` : ''}
                  </p>
                </div>
              )}
              
              <Button 
                onClick={checkAnswer}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-xl"
              >
                Check My Clock!
              </Button>
              
              {feedback && (
                <div className={`mt-4 p-3 rounded-lg ${
                  feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <p className="text-lg font-medium">{feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Clock */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Move the Clock Hands</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {/* Interactive Clock */}
              <div className="flex justify-center mb-6">
                <InteractiveClock
                  hour={userHour}
                  minute={userMinute}
                  onHourChange={setUserHour}
                  onMinuteChange={setUserMinute}
                  size={320}
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-2">Hour: {userHour}</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={userHour}
                    onChange={(e) => setUserHour(parseInt(e.target.value))}
                    className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Minutes: {userMinute}</label>
                  <input
                    type="range"
                    min="0"
                    max="55"
                    step="5"
                    value={userMinute}
                    onChange={(e) => setUserMinute(parseInt(e.target.value))}
                    className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're becoming a Time Master!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <Clock key={i} className="w-8 h-8 text-blue-500 animate-spin" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
