
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
  const [endTime, setEndTime] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState(0);

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

  const initializeGame = () => {
    const settings = getDifficultySettings(difficulty);
    let gameSymbols: any[] = [];
    
    if (gameType === 'colors') {
      gameSymbols = gameContent.colors.slice(0, settings.pairs);
    } else {
      gameSymbols = gameContent[gameType].slice(0, settings.pairs);
    }
    
    const duplicatedSymbols = [...gameSymbols, ...gameSymbols];
    
    const shuffledCards = duplicatedSymbols
      .map((item, index) => ({
        id: index,
        symbol: typeof item === 'object' ? item.symbol : item,
        color: typeof item === 'object' ? item.color : undefined,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(true);
    setGameWon(false);
    setStartTime(Date.now());
    setEndTime(0);
    setHintsUsed(0);
  };

  const flipCard = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCard, secondCard] = newFlippedCards.map(id => newCards[id]);
      
      const isMatch = gameType === 'colors' 
        ? firstCard.color === secondCard.color
        : firstCard.symbol === secondCard.symbol;
      
      if (isMatch) {
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[newFlippedCards[0]].isMatched = true;
          updatedCards[newFlippedCards[1]].isMatched = true;
          setCards(updatedCards);
          setMatches(matches + 1);
          setFlippedCards([]);
          
          if (matches + 1 === getDifficultySettings(difficulty).pairs) {
            setGameWon(true);
            setEndTime(Date.now());
          }
        }, 1000);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[newFlippedCards[0]].isFlipped = false;
          resetCards[newFlippedCards[1]].isFlipped = false;
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
    
    // Find a matching pair
    for (let i = 0; i < unmatched.length; i++) {
      for (let j = i + 1; j < unmatched.length; j++) {
        const isMatch = gameType === 'colors' 
          ? unmatched[i].color === unmatched[j].color
          : unmatched[i].symbol === unmatched[j].symbol;
        
        if (isMatch) {
          // Briefly show the pair
          const newCards = [...cards];
          newCards[unmatched[i].id].isFlipped = true;
          newCards[unmatched[j].id].isFlipped = true;
          setCards(newCards);
          setHintsUsed(hintsUsed + 1);
          
          setTimeout(() => {
            const resetCards = [...newCards];
            resetCards[unmatched[i].id].isFlipped = false;
            resetCards[unmatched[j].id].isFlipped = false;
            setCards(resetCards);
          }, 2000);
          return;
        }
      }
    }
  };

  const getGameTime = () => {
    if (!startTime) return 0;
    const endTimeToUse = endTime || Date.now();
    return Math.floor((endTimeToUse - startTime) / 1000);
  };

  const settings = getDifficultySettings(difficulty);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
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
                {gameStarted ? 'Restart Game' : 'Start Game'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameStarted && (
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
              {gameWon ? (
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-green-600 animate-bounce">🎉 Congratulations! 🎉</h3>
                  <p className="text-xl">You won in {moves} moves and {getGameTime()} seconds!</p>
                  <div className="text-lg">
                    <p>Performance: {moves <= settings.pairs ? '⭐⭐⭐ Perfect!' : moves <= settings.pairs * 1.5 ? '⭐⭐ Great!' : '⭐ Good!'}</p>
                  </div>
                  <Button onClick={initializeGame} className="bg-blue-500 hover:bg-blue-600">
                    Play Again
                  </Button>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
