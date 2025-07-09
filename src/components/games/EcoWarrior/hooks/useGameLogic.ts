import { useState, useCallback } from 'react';
import { RecycleItem, Bin, GameState } from '../types';

const items: RecycleItem[] = [
  { id: '1', name: 'Water Bottle', emoji: '🍶', category: 'plastic', color: 'bg-blue-500', fact: 'Plastic bottles can be recycled into new bottles!', tip: 'Always remove the cap before recycling!' },
  { id: '2', name: 'Newspaper', emoji: '📰', category: 'paper', color: 'bg-yellow-600', fact: 'Recycled paper saves trees!', tip: 'Remove any plastic wrapping first!' },
  { id: '3', name: 'Glass Jar', emoji: '🫙', category: 'glass', color: 'bg-green-600', fact: 'Glass can be recycled infinite times!', tip: 'Rinse clean before recycling!' },
  { id: '4', name: 'Soda Can', emoji: '🥤', category: 'metal', color: 'bg-gray-600', fact: 'Aluminum cans save 95% energy when recycled!', tip: 'Crush it to save space!' },
  { id: '5', name: 'Apple Core', emoji: '🍎', category: 'organic', color: 'bg-green-500', fact: 'Organic waste makes great compost!', tip: 'Compost helps plants grow!' },
  { id: '6', name: 'Cardboard Box', emoji: '📦', category: 'paper', color: 'bg-yellow-600', fact: 'Cardboard is made from recycled paper!', tip: 'Flatten boxes to save space!' },
  { id: '7', name: 'Plastic Bag', emoji: '🛍️', category: 'plastic', color: 'bg-blue-500', fact: 'Plastic bags can harm wildlife!', tip: 'Reuse bags when possible!' },
  { id: '8', name: 'Banana Peel', emoji: '🍌', category: 'organic', color: 'bg-green-500', fact: 'Banana peels are rich in nutrients!', tip: 'Great for composting!' }
];

const initialBins: Omit<Bin, 'items'>[] = [
  { category: 'plastic', name: 'Plastic', emoji: '♻️', color: 'bg-blue-500', description: 'Bottles, containers, bags', examples: ['Bottles', 'Containers', 'Toys', 'Bags'] },
  { category: 'paper', name: 'Paper', emoji: '📄', color: 'bg-yellow-600', description: 'Paper, cardboard, magazines', examples: ['Newspapers', 'Cardboard', 'Books', 'Magazines'] },
  { category: 'glass', name: 'Glass', emoji: '🫙', color: 'bg-green-600', description: 'Bottles, jars, containers', examples: ['Bottles', 'Jars', 'Windows', 'Containers'] },
  { category: 'metal', name: 'Metal', emoji: '🥫', color: 'bg-gray-600', description: 'Cans, foil, metal objects', examples: ['Cans', 'Foil', 'Utensils', 'Wire'] },
  { category: 'organic', name: 'Organic', emoji: '🍃', color: 'bg-green-500', description: 'Food scraps, yard waste', examples: ['Fruits', 'Vegetables', 'Leaves', 'Food scraps'] }
];

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    streak: 0,
    itemsRecycled: 0,
    correctCategories: [],
    showCelebration: false,
    soundEnabled: true
  });

  const [bins, setBins] = useState<Bin[]>(
    initialBins.map(bin => ({ ...bin, items: [] }))
  );

  const [currentItems, setCurrentItems] = useState<RecycleItem[]>(
    items.slice(0, 4)
  );

  const [selectedItem, setSelectedItem] = useState<RecycleItem | null>(null);

  const playSound = useCallback((type: 'success' | 'error') => {
    if (!gameState.soundEnabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    } else {
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [gameState.soundEnabled]);

  const handleItemDrop = useCallback((itemId: string, binCategory: string) => {
    const item = currentItems.find(i => i.id === itemId);
    if (!item) return;

    const isCorrect = item.category === binCategory;
    
    if (isCorrect) {
      playSound('success');
      
      // Add item to correct bin
      setBins(prevBins => 
        prevBins.map(bin => 
          bin.category === binCategory 
            ? { ...bin, items: [...bin.items, item] }
            : bin
        )
      );

      // Remove item from current items
      setCurrentItems(prev => prev.filter(i => i.id !== itemId));

      // Update game state
      setGameState(prev => ({
        ...prev,
        score: prev.score + (10 * prev.streak + 10),
        streak: prev.streak + 1,
        itemsRecycled: prev.itemsRecycled + 1,
        correctCategories: [...new Set([...prev.correctCategories, binCategory])]
      }));

      // Add new item if available
      const availableItems = items.filter(i => !currentItems.some(ci => ci.id === i.id) && i.id !== itemId);
      if (availableItems.length > 0) {
        const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        setTimeout(() => {
          setCurrentItems(prev => [...prev, randomItem]);
        }, 500);
      }

      // Check for level up
      if ((gameState.itemsRecycled + 1) % 5 === 0) {
        setGameState(prev => ({ 
          ...prev, 
          level: prev.level + 1,
          showCelebration: true 
        }));
        setTimeout(() => {
          setGameState(prev => ({ ...prev, showCelebration: false }));
        }, 2000);
      }
    } else {
      playSound('error');
      setGameState(prev => ({ ...prev, streak: 0 }));
    }
  }, [currentItems, gameState.itemsRecycled, playSound]);

  const toggleSound = useCallback(() => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      level: 1,
      score: 0,
      streak: 0,
      itemsRecycled: 0,
      correctCategories: [],
      showCelebration: false,
      soundEnabled: gameState.soundEnabled
    });
    setBins(initialBins.map(bin => ({ ...bin, items: [] })));
    setCurrentItems(items.slice(0, 4));
    setSelectedItem(null);
  }, [gameState.soundEnabled]);

  return {
    gameState,
    bins,
    currentItems,
    selectedItem,
    setSelectedItem,
    handleItemDrop,
    toggleSound,
    resetGame
  };
};