
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface JigsawPuzzleProps {
  onBack: () => void;
}

type PuzzleSize = '3x3' | '4x4' | '5x5';

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  image: string;
}

export const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({ onBack }) => {
  const [puzzleSize, setPuzzleSize] = useState<PuzzleSize>('3x3');
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const puzzleImages = [
    { id: 'nature1', name: '🏞️ Mountain Lake', image: 'photo-1506744038136-46273834b3fb' },
    { id: 'nature2', name: '🌲 Forest', image: 'photo-1441974231531-c6227db76b6e' },
    { id: 'nature3', name: '🌅 Sunset', image: 'photo-1506905925346-21bda4d32df4' },
    { id: 'nature4', name: '🌊 Ocean', image: 'photo-1439066615861-d1af74d74000' },
    { id: 'space1', name: '🌌 Starry Night', image: 'photo-1470813740244-df37b8c1edcb' },
    { id: 'space2', name: '🌙 Moon', image: 'photo-1446776877081-d282a0f896e2' },
    { id: 'animals1', name: '🐱 Cat', image: 'photo-1582562124811-c09040d0a901' },
    { id: 'animals2', name: '🦌 Deer', image: 'photo-1472396961693-142e6e269027' },
    { id: 'animals3', name: '🐧 Penguins', image: 'photo-1441057206919-63d19fac2369' },
    { id: 'city1', name: '🏢 Architecture', image: 'photo-1449824913935-59a10b8d2000' },
    { id: 'city2', name: '🌆 Cityscape', image: 'photo-1477959858617-67f85cf4f1df' },
    { id: 'flowers1', name: '🌸 Cherry Blossoms', image: 'photo-1522383225653-ed111181a951' },
    { id: 'flowers2', name: '🌻 Sunflowers', image: 'photo-1470509037663-253afd7f0f51' }
  ];

  const [currentImage, setCurrentImage] = useState(puzzleImages[0].image);

  const getSizeNumber = (size: PuzzleSize) => {
    return parseInt(size.split('x')[0]);
  };

  const createPuzzle = () => {
    const size = getSizeNumber(puzzleSize);
    const totalPieces = size * size;
    
    const newPieces: PuzzlePiece[] = [];
    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        image: currentImage
      });
    }
    
    // Shuffle pieces (ensure solvable puzzle)
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newPieces[i].currentPosition;
      newPieces[i].currentPosition = newPieces[j].currentPosition;
      newPieces[j].currentPosition = temp;
    }
    
    setPieces(newPieces);
    setGameStarted(true);
    setIsComplete(false);
    setMoves(0);
    setHintsUsed(0);
    setSelectedPiece(null);
  };

  const swapPieces = (position1: number, position2: number) => {
    const newPieces = [...pieces];
    const piece1Index = newPieces.findIndex(p => p.currentPosition === position1);
    const piece2Index = newPieces.findIndex(p => p.currentPosition === position2);
    
    if (piece1Index !== -1 && piece2Index !== -1) {
      const temp = newPieces[piece1Index].currentPosition;
      newPieces[piece1Index].currentPosition = newPieces[piece2Index].currentPosition;
      newPieces[piece2Index].currentPosition = temp;
      
      setPieces(newPieces);
      setMoves(moves + 1);
      
      // Check if puzzle is complete
      const isCompleted = newPieces.every(piece => piece.currentPosition === piece.correctPosition);
      if (isCompleted) {
        setIsComplete(true);
      }
    }
  };

  const handlePieceClick = (position: number) => {
    if (selectedPiece === null) {
      setSelectedPiece(position);
    } else if (selectedPiece === position) {
      setSelectedPiece(null);
    } else {
      swapPieces(selectedPiece, position);
      setSelectedPiece(null);
    }
  };

  const getPieceAtPosition = (position: number) => {
    return pieces.find(piece => piece.currentPosition === position);
  };

  const useHint = () => {
    if (hintsUsed >= 3) return;
    
    const incorrectPieces = pieces.filter(piece => piece.currentPosition !== piece.correctPosition);
    if (incorrectPieces.length === 0) return;
    
    const randomPiece = incorrectPieces[Math.floor(Math.random() * incorrectPieces.length)];
    const correctPiece = pieces.find(piece => piece.currentPosition === randomPiece.correctPosition);
    
    if (correctPiece) {
      swapPieces(randomPiece.currentPosition, correctPiece.currentPosition);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const resetGame = () => {
    if (pieces.length > 0) {
      createPuzzle();
    }
  };

  const size = getSizeNumber(puzzleSize);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Jigsaw Puzzle</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Jigsaw Puzzle</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p>1. Choose your puzzle size and image</p>
                <p>2. Click on two pieces to swap their positions</p>
                <p>3. Try to arrange all pieces in the correct order</p>
                <p>4. Use hints if you get stuck (max 3 per game)</p>
                <p>5. Complete the puzzle with minimum moves!</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Puzzle Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div>
                <label className="block text-sm font-medium mb-1">Puzzle Size</label>
                <Select value={puzzleSize} onValueChange={(value) => setPuzzleSize(value as PuzzleSize)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3x3">3×3 (Easy)</SelectItem>
                    <SelectItem value="4x4">4×4 (Medium)</SelectItem>
                    <SelectItem value="5x5">5×5 (Hard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <Select value={currentImage} onValueChange={setCurrentImage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {puzzleImages.map((img) => (
                      <SelectItem key={img.id} value={img.image}>{img.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={createPuzzle} className="bg-green-500 hover:bg-green-600 mt-6">
                {gameStarted ? 'New Puzzle' : 'Start Puzzle'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {gameStarted && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">
                {isComplete ? (
                  <span className="text-green-600">🎉 Puzzle Complete! 🎉</span>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>Moves: {moves}</span>
                    <span>Hints Used: {hintsUsed}/3</span>
                    <div className="flex gap-2">
                      <Button onClick={useHint} disabled={hintsUsed >= 3} size="sm" variant="outline">
                        💡 Hint
                      </Button>
                      <Button onClick={resetGame} size="sm" variant="outline">
                        🔄 Reset
                      </Button>
                    </div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div 
                  className={`grid gap-1 bg-gray-200 p-2 rounded-lg`}
                  style={{ 
                    gridTemplateColumns: `repeat(${size}, 1fr)`,
                    maxWidth: `${size * 100}px`
                  }}
                >
                  {Array.from({ length: size * size }, (_, position) => {
                    const piece = getPieceAtPosition(position);
                    const isSelected = selectedPiece === position;
                    const isCorrect = piece && piece.currentPosition === piece.correctPosition;
                    
                    return (
                      <div
                        key={position}
                        className={`relative cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'
                        } ${isCorrect ? 'ring-2 ring-green-400' : ''}`}
                        onClick={() => handlePieceClick(position)}
                      >
                        {piece && (
                          <div
                            className="w-24 h-24 bg-cover bg-center rounded border-2 border-white shadow-md"
                            style={{
                              backgroundImage: `url(https://images.unsplash.com/${piece.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400)`,
                              backgroundPosition: `${-(piece.correctPosition % size) * 100}% ${-Math.floor(piece.correctPosition / size) * 100}%`,
                              backgroundSize: `${size * 100}% ${size * 100}%`
                            }}
                          >
                            <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                              {piece.correctPosition + 1}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Reference Image:</h3>
                  <img 
                    src={`https://images.unsplash.com/${currentImage}?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200`}
                    alt="Reference"
                    className="mx-auto rounded-lg shadow-md"
                    style={{ width: '150px', height: '150px' }}
                  />
                </div>
                
                {isComplete && (
                  <Button onClick={createPuzzle} className="bg-green-500 hover:bg-green-600">
                    Play Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
