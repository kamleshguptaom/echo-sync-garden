import { useState, useCallback } from 'react';

interface BrainTrainingState {
  score: number;
  level: number;
  streak: number;
  currentChallenge: 'memory' | 'focus' | 'speed' | null;
  challengesCompleted: number;
  showCelebration: boolean;
}

export const useBrainTraining = () => {
  const [gameState, setGameState] = useState<BrainTrainingState>({
    score: 0,
    level: 1,
    streak: 0,
    currentChallenge: null,
    challengesCompleted: 0,
    showCelebration: false
  });

  const challenges: ('memory' | 'focus' | 'speed')[] = ['memory', 'focus', 'speed'];

  const startNewChallenge = useCallback(() => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setGameState(prev => ({
      ...prev,
      currentChallenge: randomChallenge
    }));
  }, []);

  const handleChallengeComplete = useCallback((correct: boolean) => {
    setGameState(prev => {
      const newScore = correct ? prev.score + (10 * prev.level) : prev.score;
      const newStreak = correct ? prev.streak + 1 : 0;
      const newChallengesCompleted = prev.challengesCompleted + 1;
      const shouldLevelUp = correct && newStreak > 0 && newStreak % 5 === 0;
      const newLevel = shouldLevelUp ? prev.level + 1 : prev.level;

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        level: newLevel,
        challengesCompleted: newChallengesCompleted,
        currentChallenge: null,
        showCelebration: shouldLevelUp
      };
    });

    setTimeout(() => {
      if (gameState.showCelebration) {
        setGameState(prev => ({ ...prev, showCelebration: false }));
      }
    }, 2000);
  }, [gameState.showCelebration]);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      level: 1,
      streak: 0,
      currentChallenge: null,
      challengesCompleted: 0,
      showCelebration: false
    });
  }, []);

  return {
    gameState,
    startNewChallenge,
    handleChallengeComplete,
    resetGame
  };
};