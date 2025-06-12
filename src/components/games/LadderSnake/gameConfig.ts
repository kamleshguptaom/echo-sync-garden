
import { LadderSnake, PowerUp, GameMode } from './types';

export const getGameConfig = (gameMode: GameMode) => {
  const baseConfig = {
    classic: {
      ladders: [
        { start: 4, end: 14, type: 'ladder' as const, concept: 'Hard work pays off!' },
        { start: 9, end: 31, type: 'ladder' as const, concept: 'Knowledge lifts you up!' },
        { start: 21, end: 42, type: 'ladder' as const, concept: 'Persistence leads to success!' },
        { start: 28, end: 56, type: 'ladder' as const, concept: 'Great effort brings rewards!' },
        { start: 51, end: 67, type: 'ladder' as const, concept: 'Teamwork helps you rise!' },
        { start: 71, end: 91, type: 'ladder' as const, concept: 'Wisdom opens new paths!' }
      ],
      snakes: [
        { start: 17, end: 7, type: 'snake' as const, concept: 'Shortcuts often lead backwards' },
        { start: 54, end: 34, type: 'snake' as const, concept: 'Greed brings downfall' },
        { start: 62, end: 19, type: 'snake' as const, concept: 'Pride comes before a fall' },
        { start: 87, end: 24, type: 'snake' as const, concept: 'Overconfidence leads to failure' },
        { start: 93, end: 73, type: 'snake' as const, concept: 'Near success requires caution' },
        { start: 99, end: 78, type: 'snake' as const, concept: 'Final steps need most care' }
      ]
    },
    challenge: {
      ladders: [
        { start: 3, end: 22, type: 'ladder' as const, concept: 'Challenge yourself!' },
        { start: 8, end: 26, type: 'ladder' as const, concept: 'Push your limits!' },
        { start: 15, end: 44, type: 'ladder' as const, concept: 'Overcome obstacles!' },
        { start: 25, end: 64, type: 'ladder' as const, concept: 'Rise above challenges!' },
        { start: 47, end: 83, type: 'ladder' as const, concept: 'Determination wins!' },
        { start: 69, end: 92, type: 'ladder' as const, concept: 'Excellence achieved!' }
      ],
      snakes: [
        { start: 16, end: 6, type: 'snake' as const, concept: 'Hasty decisions backfire' },
        { start: 33, end: 13, type: 'snake' as const, concept: 'Complacency is dangerous' },
        { start: 48, end: 28, type: 'snake' as const, concept: 'Overconfidence hurts' },
        { start: 65, end: 45, type: 'snake' as const, concept: 'Success can blind you' },
        { start: 78, end: 58, type: 'snake' as const, concept: 'Arrogance leads to fall' },
        { start: 95, end: 35, type: 'snake' as const, concept: 'One mistake can cost everything' }
      ]
    },
    extreme: {
      ladders: [
        { start: 2, end: 38, type: 'ladder' as const, concept: 'Extreme dedication!' },
        { start: 7, end: 45, type: 'ladder' as const, concept: 'Breakthrough moment!' },
        { start: 13, end: 59, type: 'ladder' as const, concept: 'Massive leap forward!' },
        { start: 23, end: 77, type: 'ladder' as const, concept: 'Extraordinary effort!' },
        { start: 39, end: 81, type: 'ladder' as const, concept: 'Peak performance!' },
        { start: 63, end: 97, type: 'ladder' as const, concept: 'Ultimate achievement!' }
      ],
      snakes: [
        { start: 14, end: 1, type: 'snake' as const, concept: 'Extreme setback!' },
        { start: 29, end: 9, type: 'snake' as const, concept: 'Major mistake!' },
        { start: 46, end: 16, type: 'snake' as const, concept: 'Severe consequences!' },
        { start: 68, end: 18, type: 'snake' as const, concept: 'Devastating fall!' },
        { start: 82, end: 22, type: 'snake' as const, concept: 'Catastrophic error!' },
        { start: 98, end: 28, type: 'snake' as const, concept: 'Victory snatched away!' }
      ]
    }
  };

  return {
    ...baseConfig.classic,
    ...(baseConfig[gameMode as keyof typeof baseConfig] || baseConfig.classic)
  };
};

export const getPowerUps = (gameMode: GameMode): PowerUp[] => {
  const basePowerUps = [
    { position: 15, type: 'double-move' as const, icon: '⚡', description: 'Double your next move!' },
    { position: 35, type: 'skip-snake' as const, icon: '🛡️', description: 'Immunity to next snake!' },
    { position: 55, type: 'extra-turn' as const, icon: '🎯', description: 'Get an extra turn!' },
    { position: 75, type: 'teleport' as const, icon: '🌟', description: 'Jump forward 10 spaces!' }
  ];

  if (gameMode === 'challenge' || gameMode === 'extreme') {
    basePowerUps.push(
      { position: 25, type: 'mega-jump' as const, icon: '🚀', description: 'Jump forward 15 spaces!' },
      { position: 65, type: 'shield' as const, icon: '🔰', description: 'Immunity to next 2 snakes!' }
    );
  }

  return basePowerUps;
};
