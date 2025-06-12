
import { Target, TargetType, Difficulty } from './types';

const balloonColors = ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠', '⚪', '🖤'];
const birdTypes = ['🐦', '🦅', '🦆', '🐧', '🦜', '🕊️', '🦢', '🐤'];
const fruitTypes = ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🍒'];

export const generateTargets = (
  targetType: TargetType,
  difficulty: Difficulty,
  gameArea: { width: number; height: number }
): Target[] => {
  const difficultySettings = {
    easy: { count: 1, speed: 1, size: 60 },
    medium: { count: 2, speed: 2, size: 45 },
    hard: { count: 3, speed: 3, size: 35 },
    expert: { count: 4, speed: 4, size: 25 }
  };

  const settings = difficultySettings[difficulty];
  const targets: Target[] = [];

  for (let i = 0; i < settings.count; i++) {
    const target = createTarget(targetType, settings, gameArea, i);
    targets.push(target);
  }

  return targets;
};

const createTarget = (
  targetType: TargetType,
  settings: { speed: number; size: number },
  gameArea: { width: number; height: number },
  index: number
): Target => {
  const baseTarget = {
    id: Date.now() + index,
    size: settings.size,
    hit: false,
    points: 10,
    type: targetType
  };

  switch (targetType) {
    case 'balloons':
      return {
        ...baseTarget,
        x: Math.random() * (gameArea.width - settings.size),
        y: gameArea.height - 50,
        emoji: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        velocity: { x: (Math.random() - 0.5) * 2, y: -settings.speed },
        gravity: 0
      };

    case 'birds':
      return {
        ...baseTarget,
        x: Math.random() > 0.5 ? -settings.size : gameArea.width,
        y: Math.random() * (gameArea.height / 2) + 50,
        emoji: birdTypes[Math.floor(Math.random() * birdTypes.length)],
        velocity: { 
          x: Math.random() > 0.5 ? settings.speed : -settings.speed, 
          y: (Math.random() - 0.5) * 1 
        },
        gravity: 0
      };

    case 'fruits':
      return {
        ...baseTarget,
        x: Math.random() * (gameArea.width - settings.size),
        y: -settings.size,
        emoji: fruitTypes[Math.floor(Math.random() * fruitTypes.length)],
        velocity: { x: (Math.random() - 0.5) * 1, y: settings.speed },
        gravity: 0.1
      };

    case 'metal':
      return {
        ...baseTarget,
        x: Math.random() * (gameArea.width - settings.size),
        y: Math.random() * (gameArea.height - 100) + 50,
        emoji: '🎯',
        velocity: { x: 0, y: 0 },
        gravity: 0,
        points: 15
      };

    default:
      return {
        ...baseTarget,
        x: gameArea.width / 2,
        y: gameArea.height / 2,
        emoji: '🎯',
        velocity: { x: 0, y: 0 },
        gravity: 0
      };
  }
};

export const updateTargets = (
  targets: Target[],
  gameArea: { width: number; height: number }
): Target[] => {
  return targets.map(target => {
    if (target.hit) return target;

    const newTarget = { ...target };
    
    if (target.velocity) {
      newTarget.x += target.velocity.x;
      newTarget.y += target.velocity.y;
      
      if (target.gravity) {
        newTarget.velocity.y += target.gravity;
      }
    }

    // Remove targets that are out of bounds
    if (
      newTarget.x < -target.size ||
      newTarget.x > gameArea.width ||
      newTarget.y < -target.size ||
      newTarget.y > gameArea.height
    ) {
      return { ...newTarget, hit: true, points: 0 };
    }

    return newTarget;
  }).filter(target => !target.hit || target.points > 0);
};
