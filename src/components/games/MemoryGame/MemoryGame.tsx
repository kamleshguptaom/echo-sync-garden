
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface MemoryGameProps {
  onBack: () => void;
}

interface GameCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showConcept, setShowConcept] = useState(false);

  const cardSets = {
    easy: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼'],
    medium: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯'],
    hard: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🐸', '🐵']
  };

  const initializeGame = () => {
    const cardValues = cardSets[difficulty];
    const gameCards = [...cardValues, ...cardValues].map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeElapsed(0);
    setGameCompleted(false);
    setGameStarted(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !gameCompleted) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          
          if (matches + 1 === cardSets[difficulty].length) {
            setGameCompleted(true);
            setGameStarted(false);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === first || card.id === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards, matches, difficulty]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGridCols = () => {
    switch (difficulty) {
      case 'easy': return 'grid-cols-3';
      case 'medium': return 'grid-cols-4';
      case 'hard': return 'grid-cols-5';
      default: return 'grid-cols-4';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 p-6">
      <style>{`
        .memory-card {
          perspective: 1000px;
          transition: transform 0.3s ease;
        }
        .memory-card:hover {
          transform: scale(1.05);
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .card-flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
        }
        .card-back {
          transform: rotateY(180deg);
        }
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        .sparkle {
          position: absolute;
          animation: sparkle 2s ease-in-out infinite;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="floating-elements">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="sparkle text-white text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">🧠 Memory Challenge</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500/80 text-white hover:bg-purple-600/80">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Memory & Cognitive Development</DialogTitle>
                <DialogDescription>Enhance working memory and pattern recognition</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎯 Game Concept</h3>
                  <p>Memory games strengthen working memory, attention span, and visual processing. They help develop the ability to hold and manipulate information in your mind.</p>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-lg">🧠 Skills Developed</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Working Memory:</strong> Hold multiple items in mind simultaneously</li>
                    <li><strong>Visual Processing:</strong> Quickly identify and remember visual patterns</li>
                    <li><strong>Concentration:</strong> Maintain focus for extended periods</li>
                    <li><strong>Strategic Thinking:</strong> Develop systematic approaches to memorization</li>
                  </ul>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
                  <h4 className="font-bold">💡 Memory Tips:</h4>
                  <p>• Use spatial memory - remember card positions<br/>
                     • Create mental associations between pairs<br/>
                     • Start from corners and work systematically<br/>
                     • Practice daily to improve memory capacity</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!gameStarted && !gameCompleted ? (
          <Card className="bg-white/20 backdrop-blur-md border-2 border-white/30 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">Choose Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <Button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    variant={difficulty === level ? "default" : "outline"}
                    className={`p-6 h-auto flex flex-col items-center gap-2 ${
                      difficulty === level 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                    }`}
                  >
                    <span className="text-2xl">
                      {level === 'easy' ? '🟢' : level === 'medium' ? '🟡' : '🔴'}
                    </span>
                    <span className="font-bold capitalize">{level}</span>
                    <span className="text-sm opacity-80">
                      {level === 'easy' ? '6 pairs' : level === 'medium' ? '8 pairs' : '10 pairs'}
                    </span>
                  </Button>
                ))}
              </div>
              <Button onClick={initializeGame} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 text-lg">
                🎮 Start Game
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="flex justify-center gap-6">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                ⏱️ {formatTime(timeElapsed)}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                🎯 {moves} moves
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                ✅ {matches}/{cardSets[difficulty].length} pairs
              </Badge>
            </div>

            {/* Game Board */}
            <div className={`grid ${getGridCols()} gap-4 max-w-2xl mx-auto`}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`memory-card aspect-square cursor-pointer ${
                    card.isFlipped || card.isMatched ? 'card-flipped' : ''
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className="card-inner h-full">
                    <div className="card-front bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white/30 flex items-center justify-center">
                      <span className="text-3xl">❓</span>
                    </div>
                    <div className="card-back bg-gradient-to-br from-green-400 to-teal-500 border-2 border-white/30 flex items-center justify-center">
                      <span className="text-4xl">{card.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {gameCompleted && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <Card className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6 max-w-md mx-4 border-2 border-white/40">
                  <CardContent className="text-center space-y-4">
                    <div className="text-6xl animate-bounce">🎉</div>
                    <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
                    <div className="space-y-2 text-white">
                      <p>Time: {formatTime(timeElapsed)}</p>
                      <p>Moves: {moves}</p>
                      <p>Difficulty: {difficulty}</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={initializeGame} className="bg-white/20 text-white hover:bg-white/30">
                        🔄 Play Again
                      </Button>
                      <Button onClick={() => {setGameStarted(false); setGameCompleted(false);}} className="bg-white/20 text-white hover:bg-white/30">
                        ⚙️ Change Level
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {gameStarted && (
              <div className="text-center">
                <Button onClick={() => {setGameStarted(false); setGameCompleted(false);}} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  🏠 Back to Menu
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
