import { useState, useCallback } from 'react';
import { Vehicle, GameProgress } from '../types';

const vehicles: Vehicle[] = [
  { 
    id: '1',
    name: 'Car', 
    emoji: '🚗', 
    category: 'land', 
    sound: 'Vroom vroom!', 
    fact: 'Cars help families travel together on roads!',
    speed: 'Medium',
    environment: 'Roads and streets'
  },
  { 
    id: '2',
    name: 'Airplane', 
    emoji: '✈️', 
    category: 'air', 
    sound: 'Whoosh!', 
    fact: 'Airplanes can fly above the clouds at 30,000 feet!',
    speed: 'Very Fast',
    environment: 'Sky and airports'
  },
  { 
    id: '3',
    name: 'Boat', 
    emoji: '🚤', 
    category: 'water', 
    sound: 'Splash!', 
    fact: 'Boats float on water and can travel across lakes!',
    speed: 'Medium',
    environment: 'Lakes and rivers'
  },
  { 
    id: '4',
    name: 'Train', 
    emoji: '🚂', 
    category: 'land', 
    sound: 'Choo choo!', 
    fact: 'Trains can carry hundreds of people on tracks!',
    speed: 'Fast',
    environment: 'Railway tracks'
  },
  { 
    id: '5',
    name: 'Helicopter', 
    emoji: '🚁', 
    category: 'air', 
    sound: 'Whirr whirr!', 
    fact: 'Helicopters can hover in one place and land anywhere!',
    speed: 'Medium',
    environment: 'Sky and helipads'
  },
  { 
    id: '6',
    name: 'Ship', 
    emoji: '🚢', 
    category: 'water', 
    sound: 'Toot toot!', 
    fact: 'Big ships carry cargo across oceans for thousands of miles!',
    speed: 'Slow',
    environment: 'Oceans and ports'
  },
  { 
    id: '7',
    name: 'Bus', 
    emoji: '🚌', 
    category: 'land', 
    sound: 'Beep beep!', 
    fact: 'Buses help many people travel together in cities!',
    speed: 'Medium',
    environment: 'City streets'
  },
  { 
    id: '8',
    name: 'Submarine', 
    emoji: '🛟', 
    category: 'water', 
    sound: 'Ping ping!', 
    fact: 'Submarines travel underwater like fish!',
    speed: 'Medium',
    environment: 'Underwater'
  }
];

export const useGameLogic = () => {
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    level: 1,
    score: 0,
    vehiclesSorted: 0,
    perfectSorts: 0,
    categoriesMastered: new Set(),
    soundEnabled: true
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleCounts, setVehicleCounts] = useState<Record<string, number>>({
    land: 0,
    air: 0,
    water: 0
  });

  const playSound = useCallback((vehicle: Vehicle) => {
    if (!gameProgress.soundEnabled) return;
    
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(
        `${vehicle.name} goes ${vehicle.sound}. ${vehicle.fact}`
      );
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  }, [gameProgress.soundEnabled]);

  const playSuccessSound = useCallback(() => {
    if (!gameProgress.soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [gameProgress.soundEnabled]);

  const handleVehicleSort = useCallback((vehicleId: string, category: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return false;

    const isCorrect = vehicle.category === category;
    
    if (isCorrect) {
      playSuccessSound();
      
      setGameProgress(prev => ({
        ...prev,
        score: prev.score + 15,
        vehiclesSorted: prev.vehiclesSorted + 1,
        perfectSorts: prev.perfectSorts + 1,
        categoriesMastered: new Set([...prev.categoriesMastered, category])
      }));
      
      setVehicleCounts(prev => ({
        ...prev,
        [category]: prev[category] + 1
      }));

      // Check for level up
      if ((gameProgress.vehiclesSorted + 1) % 5 === 0) {
        setGameProgress(prev => ({ ...prev, level: prev.level + 1 }));
      }
    } else {
      setGameProgress(prev => ({ ...prev, perfectSorts: 0 }));
    }

    return isCorrect;
  }, [gameProgress.vehiclesSorted, playSuccessSound]);

  const handleVehicleSelect = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    playSound(vehicle);
  }, [playSound]);

  const toggleSound = useCallback(() => {
    setGameProgress(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const resetGame = useCallback(() => {
    setGameProgress(prev => ({
      level: 1,
      score: 0,
      vehiclesSorted: 0,
      perfectSorts: 0,
      categoriesMastered: new Set(),
      soundEnabled: prev.soundEnabled
    }));
    setVehicleCounts({ land: 0, air: 0, water: 0 });
    setSelectedVehicle(null);
  }, []);

  return {
    vehicles,
    gameProgress,
    selectedVehicle,
    vehicleCounts,
    handleVehicleSort,
    handleVehicleSelect,
    toggleSound,
    resetGame,
    setSelectedVehicle
  };
};