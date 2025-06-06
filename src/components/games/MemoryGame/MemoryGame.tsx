
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MemoryGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameType = 'symbols' | 'numbers' | 'colors' | 'words' | 'patterns';

interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
  color?: string;
  pairId: number;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameType, setGameType] = useState<GameType>('symbols');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showWinPopup, setShowWinPopup] = useState(false);

  const gameContent = {
    symbols: ['🎮', '🎯', '🎲', '🃏', '🎪', '🎨', '🎭', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎬', '📱', '💎', '⭐'],
    numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
    colors: [
      { symbol: '●', color: '#ff4444' }, { symbol: '●', color: '#44ff44' }, { symbol: '●', color: '#4444ff' },
      { symbol: '●', color: '#ffff44' }, { symbol: '●', color: '#ff44ff' }, { symbol: '●', color: '#44ffff' },
      { symbol: '●', color: '#ff8844' }, { symbol: '●', color: '#8844ff' }, { symbol: '●', color: '#44ff88' },
      { symbol: '●', color: '#ff4488' }, { symbol: '●', color: '#88ff44' }, { symbol: '●', color: '#4488ff' },
      { symbol: '●', color: '#888888' }, { symbol: '●', color: '#ffaa44' }, { symbol: '●', color: '#44aaff' },
      { symbol: '●', color: '#aa44ff' }, { symbol: '●', color: '#ff44aa' }, { symbol: '●', color: '#44ffaa' }
    ],
    words: ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE', 'BOOK', 'FISH', 'BIRD', 'FLOWER', 'HOUSE', 'CAR', 'BOAT', 'PLANE', 'TRAIN', 'BIKE', 'BALL', 'CAKE'],
    patterns: ['▲', '●', '■', '♦', '▼', '♠', '♥', '♣', '⬟', '⬢', '⬡', '⬠', '◆', '◇', '○', '□', '△', '▽']
  };

  const getDifficultySettings = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return { pairs: 6, cols: 3, timeLimit: 120 };
      case 'medium': return { pairs: 8, cols: 4, timeLimit: 90 };
      case 'hard': return { pairs: 12, cols: 4, timeLimit: 60 };
    }
  };

  // Real-time timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  const initializeGame = () => {
    const settings = getDifficultySettings(difficulty);
    let gameSymbols: any[] = [];
    
    if (gameType === 'colors') {
      gameSymbols = gameContent.colors.slice(0, settings.pairs);
    } else {
      gameSymbols = gameContent[gameType].slice(0, settings.pairs);
    }
    
    const cardPairs: MemoryCard[] = [];
    
    gameSymbols.forEach((item, index) => {
      // Create two identical cards with same pairId
      const card1: MemoryCard = {
        id: index * 2,
        symbol: typeof item === 'object' ? item.symbol : item,
        color: typeof item === 'object' ? item.color : undefined,
        isFlipped: false,
        isMatched: false,
        pairId: index
      };
      
      const card2: MemoryCard = {
        id: index * 2 + 1,
        symbol: typeof item === 'object' ? item.symbol : item,
        color: typeof item === 'object' ? item.color : undefined,
        isFlipped: false,
        isMatched: false,
        pairId: index
      };
      
      cardPairs.push(card1, card2);
    });
    
    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(true);
    setGameWon(false);
    setStartTime(Date.now());
    setCurrentTime(Date.now());
    setHintsUsed(0);
    setShowWinPopup(false);
  };

  const flipCard = (cardId: number) => {
    if (flippedCards.length === 2 || cards.find(c => c.id === cardId)?.isMatched || cards.find(c => c.id === cardId)?.isFlipped) {
      return;
    }

    const newCards = [...cards];
    const cardIndex = newCards.findIndex(c => c.id === cardId);
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstCardId);
      const secondCard = newCards.find(c => c.id === secondCardId);
      
      const isMatch = firstCard?.pairId === secondCard?.pairId;
      
      if (isMatch) {
        setTimeout(() => {
          const updatedCards = [...newCards];
          const firstCardIndex = updatedCards.findIndex(c => c.id === firstCardId);
          const secondCardIndex = updatedCards.findIndex(c => c.id === secondCardId);
          updatedCards[firstCardIndex].isMatched = true;
          updatedCards[secondCardIndex].isMatched = true;
          setCards(updatedCards);
          setMatches(matches + 1);
          setFlippedCards([]);
          
          if (matches + 1 === getDifficultySettings(difficulty).pairs) {
            setGameWon(true);
            setShowWinPopup(true);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          const firstCardIndex = resetCards.findIndex(c => c.id === firstCardId);
          const secondCardIndex = resetCards.findIndex(c => c.id === secondCardId);
          resetCards[firstCardIndex].isFlipped = false;
          resetCards[secondCardIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const useHint = () => {
    if (hintsUsed >= 2) return;
    
    const unmatched = cards.filter(card => !card.isMatched && !card.isFlipped);
    if (unmatched.length < 2) return;
    
    // Find a matching pair by pairId
    for (let i = 0; i < unmatched.length; i++) {
      for (let j = i + 1; j < unmatched.length; j++) {
        if (unmatched[i].pairId === unmatched[j].pairId) {
          // Briefly show the pair
          const newCards = [...cards];
          const card1Index = newCards.findIndex(c => c.id === unmatched[i].id);
          const card2Index = newCards.findIndex(c => c.id === unmatched[j].id);
          newCards[card1Index].isFlipped = true;
          newCards[card2Index].isFlipped = true;
          setCards(newCards);
          setHintsUsed(hintsUsed + 1);
          
          setTimeout(() => {
            const resetCards = [...newCards];
            resetCards[card1Index].isFlipped = false;
            resetCards[card2Index].isFlipped = false;
            setCards(resetCards);
          }, 2000);
          return;
        }
      }
    }
  };

  const getGameTime = () => {
    if (!startTime) return 0;
    const endTimeToUse = gameWon ? currentTime : Date.now();
    return Math.floor((endTimeToUse - startTime) / 1000);
  };

  const goBack = () => {
    if (gameStarted) {
      setGameStarted(false);
      setGameWon(false);
    } else {
      onBack();
    }
  };

  const settings = getDifficultySettings(difficulty);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={goBack} variant="outline" className="bg-white/90">
              ← {gameStarted ? 'Back to Settings' : 'Back to Hub'}
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">Memory Game</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Memory Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>1. Choose your difficulty and game type</p>
                <p>2. Click cards to flip them over</p>
                <p>3. Try to find matching pairs</p>
                <p>4. Match all pairs to win!</p>
                <p>💡 Use hints to reveal a matching pair briefly</p>
                <p>🎯 Complete in minimum moves for better score</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted ? (
          <Card className="mb-6 bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Game Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 justify-center items-center flex-wrap">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (6 pairs)</SelectItem>
                      <SelectItem value="medium">Medium (8 pairs)</SelectItem>
                      <SelectItem value="hard">Hard (12 pairs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Game Type</label>
                  <Select value={gameType} onValueChange={(value) => setGameType(value as GameType)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="symbols">🎮 Symbols</SelectItem>
                      <SelectItem value="numbers">🔢 Numbers</SelectItem>
                      <SelectItem value="colors">🎨 Colors</SelectItem>
                      <SelectItem value="words">📝 Words</SelectItem>
                      <SelectItem value="patterns">⬟ Patterns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={initializeGame} className="bg-green-500 hover:bg-green-600 mt-6">
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>Moves: {moves}</span>
                <span>Matches: {matches}/{settings.pairs}</span>
                <span>Time: {getGameTime()}s</span>
                <Button 
                  onClick={useHint} 
                  disabled={hintsUsed >= 2} 
                  size="sm" 
                  variant="outline"
                  className="bg-yellow-100 hover:bg-yellow-200"
                >
                  💡 Hint ({hintsUsed}/2)
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`grid gap-3 justify-center`}
                style={{ 
                  gridTemplateColumns: `repeat(${settings.cols}, 1fr)`,
                  maxWidth: `${settings.cols * 100}px`,
                  margin: '0 auto'
                }}
              >
                {cards.map((card) => (
                  <Button
                    key={card.id}
                    className={`w-20 h-20 text-2xl transition-all duration-500 transform ${
                      card.isFlipped || card.isMatched
                        ? 'bg-blue-500 hover:bg-blue-600 scale-105'
                        : 'bg-gray-400 hover:bg-gray-500 hover:scale-105'
                    } ${card.isMatched ? 'ring-4 ring-green-400' : ''}`}
                    onClick={() => flipCard(card.id)}
                    disabled={card.isMatched || flippedCards.length === 2}
                    style={card.isFlipped || card.isMatched ? { color: card.color } : {}}
                  >
                    {card.isFlipped || card.isMatched ? card.symbol : '?'}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Winning Celebration Popup */}
        <Dialog open={showWinPopup} onOpenChange={setShowWinPopup}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">🎉 Congratulations! 🎉</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4 animate-bounce">
              <div className="text-6xl">🏆</div>
              <p className="text-xl">You won in {moves} moves and {getGameTime()} seconds!</p>
              <div className="text-lg">
                <p>Performance: {moves <= settings.pairs ? '⭐⭐⭐ Perfect!' : moves <= settings.pairs * 1.5 ? '⭐⭐ Great!' : '⭐ Good!'}</p>
              </div>
              <Button onClick={() => { setShowWinPopup(false); initializeGame(); }} className="bg-blue-500 hover:bg-blue-600">
                Play Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
