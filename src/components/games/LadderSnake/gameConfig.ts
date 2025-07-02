
import { GameMode, LadderSnake, PowerUpItem } from './types';

export const ladders: LadderSnake[] = [
  { start: 1, end: 38, type: 'ladder', concept: 'Hard work pays off!' },
  { start: 4, end: 14, type: 'ladder', concept: 'Learning is growing!' },
  { start: 9, end: 31, type: 'ladder', concept: 'Kindness lifts everyone!' },
  { start: 21, end: 42, type: 'ladder', concept: 'Persistence leads to success!' },
  { start: 28, end: 84, type: 'ladder', concept: 'Dream big, achieve bigger!' },
  { start: 36, end: 44, type: 'ladder', concept: 'Small steps, big results!' },
  { start: 51, end: 67, type: 'ladder', concept: 'Knowledge is power!' },
  { start: 71, end: 91, type: 'ladder', concept: 'Practice makes perfect!' },
  { start: 80, end: 100, type: 'ladder', concept: 'Victory through effort!' }
];

export const snakes: LadderSnake[] = [
  { start: 16, end: 6, type: 'snake', concept: 'Shortcuts have consequences!' },
  { start: 47, end: 26, type: 'snake', concept: 'Stay focused on your goals!' },
  { start: 49, end: 11, type: 'snake', concept: 'Learn from your mistakes!' },
  { start: 56, end: 53, type: 'snake', concept: 'Even small setbacks teach us!' },
  { start: 62, end: 19, type: 'snake', concept: 'Overconfidence can trip you up!' },
  { start: 64, end: 60, type: 'snake', concept: 'Stay humble and keep learning!' },
  { start: 87, end: 24, type: 'snake', concept: 'Pride comes before a fall!' },
  { start: 93, end: 73, type: 'snake', concept: 'Always be careful near the top!' },
  { start: 95, end: 75, type: 'snake', concept: 'Victory requires vigilance!' },
  { start: 98, end: 78, type: 'snake', concept: 'Never give up, even when close!' }
];

export const getAllLaddersSnakes = (): LadderSnake[] => [...ladders, ...snakes];

export const getGameConfig = (mode: GameMode) => {
  const baseConfig = {
    boardSize: 100,
    laddersSnakes: getAllLaddersSnakes(),
    diceRange: { min: 1, max: 6 }
  };

  switch (mode) {
    case 'educational':
      return {
        ...baseConfig,
        powerUps: getEducationalPowerUps(),
        specialRules: ['Educational concepts appear on ladders and snakes']
      };
    case 'challenge':
      return {
        ...baseConfig,
        powerUps: getChallengePowerUps(),
        specialRules: ['Extra snakes', 'Fewer ladders', 'Power-ups required']
      };
    case 'speed':
      return {
        ...baseConfig,
        powerUps: getSpeedPowerUps(),
        timeLimit: 300,
        specialRules: ['5 minute time limit', 'Bonus for quick moves']
      };
    case 'extreme':
      return {
        ...baseConfig,
        powerUps: getExtremePowerUps(),
        specialRules: ['All power-ups active', 'Dynamic board changes']
      };
    default:
      return {
        ...baseConfig,
        powerUps: getClassicPowerUps(),
        specialRules: ['Classic ladder snake rules']
      };
  }
};

const getClassicPowerUps = (): PowerUpItem[] => [
  { position: 15, type: 'double-move', icon: '⚡', description: 'Roll twice next turn' },
  { position: 35, type: 'skip-snake', icon: '🛡️', description: 'Immune to next snake' },
  { position: 65, type: 'extra-turn', icon: '🔄', description: 'Take another turn' }
];

const getEducationalPowerUps = (): PowerUpItem[] => [
  { position: 12, type: 'double-move', icon: '🧠', description: 'Knowledge doubles your move' },
  { position: 34, type: 'skip-snake', icon: '📚', description: 'Wisdom protects you' },
  { position: 56, type: 'extra-turn', icon: '✨', description: 'Learning never stops' },
  { position: 78, type: 'teleport', icon: '🚀', description: 'Innovation leaps forward' }
];

const getChallengePowerUps = (): PowerUpItem[] => [
  { position: 25, type: 'double-move', icon: '💪', description: 'Strength doubles your move' },
  { position: 45, type: 'skip-snake', icon: '🏃', description: 'Speed avoids danger' },
  { position: 75, type: 'teleport', icon: '🎯', description: 'Precision jump ahead' }
];

const getSpeedPowerUps = (): PowerUpItem[] => [
  { position: 18, type: 'double-move', icon: '⚡', description: 'Lightning speed boost' },
  { position: 38, type: 'extra-turn', icon: '🏃‍♂️', description: 'Quick thinking extra turn' },
  { position: 58, type: 'teleport', icon: '💨', description: 'Instant travel boost' }
];

const getExtremePowerUps = (): PowerUpItem[] => [
  { position: 8, type: 'double-move', icon: '🔥', description: 'Extreme double move' },
  { position: 22, type: 'skip-snake', icon: '🛡️', description: 'Ultimate protection' },
  { position: 40, type: 'extra-turn', icon: '🌟', description: 'Bonus turn power' },
  { position: 60, type: 'teleport', icon: '🌀', description: 'Warp speed ahead' }
];
