
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, DollarSign, RotateCcw } from 'lucide-react';

interface CoinCounterProps {
  onBack: () => void;
}

interface Coin {
  value: number;
  name: string;
  emoji: string;
  count: number;
}

interface Challenge {
  targetAmount: number;
  description: string;
}

export const CoinCounter: React.FC<CoinCounterProps> = ({ onBack }) => {
  const [coins, setCoins] = useState<Coin[]>([
    { value: 25, name: 'Quarter', emoji: '🪙', count: 0 },
    { value: 10, name: 'Dime', emoji: '🥈', count: 0 },
    { value: 5, name: 'Nickel', emoji: '🥉', count: 0 },
    { value: 1, name: 'Penny', emoji: '🪙', count: 0 }
  ]);
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);

  const generateChallenge = () => {
    const amounts = level === 1 ? [5, 10, 15, 20, 25] : 
                   level === 2 ? [30, 35, 40, 45, 50] :
                   [55, 60, 75, 85, 100];
    
    const targetAmount = amounts[Math.floor(Math.random() * amounts.length)];
    const descriptions = [
      `Make ${targetAmount}¢ using coins!`,
      `Count out ${targetAmount} cents!`,
      `Show me ${targetAmount}¢ with coins!`
    ];
    
    setChallenge({
      targetAmount,
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    });
    
    // Reset coins
    setCoins(prev => prev.map(coin => ({ ...coin, count: 0 })));
    setFeedback('');
  };

  useEffect(() => {
    generateChallenge();
  }, [level]);

  const updateCoinCount = (coinIndex: number, change: number) => {
    setCoins(prev => prev.map((coin, index) => 
      index === coinIndex 
        ? { ...coin, count: Math.max(0, Math.min(10, coin.count + change)) }
        : coin
    ));
  };

  const getCurrentTotal = () => {
    return coins.reduce((total, coin) => total + (coin.value * coin.count), 0);
  };

  const checkAnswer = () => {
    if (!challenge) return;
    
    const total = getCurrentTotal();
    
    if (total === challenge.targetAmount) {
      setScore(prev => prev + 10);
      setFeedback(`🎉 Perfect! You made exactly ${challenge.targetAmount}¢!`);
      
      if (score > 0 && (score + 10) % 50 === 0) {
        setLevel(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      setTimeout(generateChallenge, 2000);
    } else if (total > challenge.targetAmount) {
      setFeedback(`Too much! You have ${total}¢ but need ${challenge.targetAmount}¢. Try removing some coins.`);
    } else {
      setFeedback(`Not enough! You have ${total}¢ but need ${challenge.targetAmount}¢. Try adding some coins.`);
    }
  };

  const resetCoins = () => {
    setCoins(prev => prev.map(coin => ({ ...coin, count: 0 })));
    setFeedback('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            💰 Coin Counter
          </h1>
          <div className="flex items-center gap-2 text-white">
            <DollarSign className="w-6 h-6" />
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
                  <span className="font-bold">Total: {getCurrentTotal()}¢</span>
                </div>
              </div>
              <Button onClick={resetCoins} className="bg-red-500 hover:bg-red-600 text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Challenge Display */}
        {challenge && (
          <Card className="mb-6 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">{challenge.description}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-4">
                {challenge.targetAmount}¢
              </div>
              <div className="text-2xl font-bold mb-4">
                Your Total: {getCurrentTotal()}¢
              </div>
              
              <Button 
                onClick={checkAnswer}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-xl mb-4"
              >
                Check My Answer!
              </Button>
              
              {feedback && (
                <div className={`p-3 rounded-lg ${
                  feedback.includes('Perfect') ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  <p className="text-lg font-medium">{feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Coin Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {coins.map((coin, index) => (
            <Card key={coin.name} className="bg-white/95 backdrop-blur">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">{coin.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{coin.name}</h3>
                <p className="text-lg text-gray-600 mb-4">{coin.value}¢</p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Button
                    onClick={() => updateCoinCount(index, -1)}
                    disabled={coin.count === 0}
                    className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold w-8">{coin.count}</span>
                  <Button
                    onClick={() => updateCoinCount(index, 1)}
                    disabled={coin.count === 10}
                    className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    +
                  </Button>
                </div>
                
                <div className="text-lg font-bold text-green-600">
                  Total: {coin.value * coin.count}¢
                </div>
                
                {/* Visual representation */}
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {[...Array(coin.count)].map((_, i) => (
                    <div key={i} className="text-xl">{coin.emoji}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're becoming a Money Master!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <DollarSign key={i} className="w-8 h-8 text-green-500 animate-bounce" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
