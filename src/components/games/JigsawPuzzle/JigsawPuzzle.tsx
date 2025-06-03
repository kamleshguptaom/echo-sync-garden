
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const puzzleImages = [
    'photo-1506744038136-46273834b3fb', // nature scene
    'photo-1500673922987-e212871fec22', // yellow lights
    'photo-1470813740244-df37b8c1edcb', // starry night
    'photo-1582562124811-c09040d0a901', // cute cat
  ];

  const [currentImage, setCurrentImage] = useState(puzzleImages[0]);

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
    
    // Shuffle pieces
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

  const size = getSizeNumber(puzzleSize);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Jigsaw Puzzle</h1>
          <div className="w-20"></div>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Puzzle Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center items-center">
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
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={puzzleImages[0]}>🏞️ Nature</SelectItem>
                    <SelectItem value={puzzleImages[1]}>✨ Lights</SelectItem>
                    <SelectItem value={puzzleImages[2]}>🌌 Stars</SelectItem>
                    <SelectItem value={puzzleImages[3]}>🐱 Cat</SelectItem>
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
                  <span>Moves: {moves} | Click two pieces to swap them</span>
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
                    
                    return (
                      <div
                        key={position}
                        className={`relative cursor-pointer transition-all duration-200 ${
                          isSelected ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'
                        }`}
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
