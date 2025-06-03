
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MemoryGameProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const symbols = ['🎮', '🎯', '🎲', '🃏', '🎪', '🎨', '🎭', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎬', '📱', '💎', '⭐'];

  const getDifficultySettings = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return { pairs: 6, cols: 3 };
      case 'medium': return { pairs: 8, cols: 4 };
      case 'hard': return { pairs: 12, cols: 4 };
    }
  };

  const initializeGame = () => {
    const settings = getDifficultySettings(difficulty);
    const gameSymbols = symbols.slice(0, settings.pairs);
    const duplicatedSymbols = [...gameSymbols, ...gameSymbols];
    
    const shuffledCards = duplicatedSymbols
      .map((symbol, index) => ({
        id: index,
        symbol,
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
      
      if (firstCard.symbol === secondCard.symbol) {
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
          <div className="w-20"></div>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Game Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center items-center">
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gameWon ? (
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-green-600 animate-bounce">🎉 Congratulations! 🎉</h3>
                  <p className="text-xl">You won in {moves} moves and {getGameTime()} seconds!</p>
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
                      className={`w-20 h-20 text-3xl transition-all duration-500 transform ${
                        card.isFlipped || card.isMatched
                          ? 'bg-blue-500 hover:bg-blue-600 rotate-y-180'
                          : 'bg-gray-400 hover:bg-gray-500 hover:scale-105'
                      } ${card.isMatched ? 'ring-4 ring-green-400' : ''}`}
                      onClick={() => flipCard(card.id)}
                      disabled={card.isMatched || flippedCards.length === 2}
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
