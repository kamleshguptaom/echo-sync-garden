import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Brain, RotateCcw } from 'lucide-react';
import { MemoryChallenge } from './components/MemoryChallenge';
import { FocusChallenge } from './components/FocusChallenge';
import { SpeedChallenge } from './components/SpeedChallenge';
import { useBrainTraining } from './hooks/useBrainTraining';

interface BrainTrainingProps {
  onBack: () => void;
}

const BrainTraining: React.FC<BrainTrainingProps> = ({ onBack }) => {
  const { gameState, startNewChallenge, handleChallengeComplete, resetGame } = useBrainTraining();

  const renderCurrentChallenge = () => {
    switch (gameState.currentChallenge) {
      case 'memory':
        return (
          <MemoryChallenge
            onComplete={handleChallengeComplete}
            difficulty={gameState.level}
          />
        );
      case 'focus':
        return (
          <FocusChallenge
            onComplete={handleChallengeComplete}
            difficulty={gameState.level}
          />
        );
      case 'speed':
        return (
          <SpeedChallenge
            onComplete={handleChallengeComplete}
            difficulty={gameState.level}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🧠 Brain Training
          </h1>
          <div className="flex items-center gap-2">
            <Button onClick={resetGame} className="bg-white/20 hover:bg-white/30 text-white">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-lg">Level {gameState.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-lg">{gameState.score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-lg">Streak: {gameState.streak}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Progress to Next Level</p>
                <Progress value={(gameState.streak % 5) * 20} className="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Content */}
        {gameState.currentChallenge ? (
          <div className="space-y-6">
            {renderCurrentChallenge()}
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-blue-800">
                  Complete challenges to improve your cognitive skills!
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-3xl">Choose Your Challenge</CardTitle>
              <p className="text-center text-gray-600">
                Train different cognitive skills with our brain exercises
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">🧠</div>
                    <h3 className="text-xl font-bold mb-2">Memory Challenge</h3>
                    <p className="text-blue-100">Remember sequences of colors and patterns</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-green-400 to-green-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold mb-2">Focus Challenge</h3>
                    <p className="text-green-100">Find targets quickly and accurately</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold mb-2">Speed Challenge</h3>
                    <p className="text-purple-100">Solve problems as fast as possible</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={startNewChallenge}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl py-6"
              >
                Start Random Challenge
              </Button>

              <div className="text-center text-gray-600">
                <p>Completed: {gameState.challengesCompleted} challenges</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Celebration Modal */}
        {gameState.showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">Your brain is getting stronger!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-500 fill-current animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrainTraining;