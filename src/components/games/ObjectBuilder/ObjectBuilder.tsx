
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ObjectBuilderProps {
  onBack: () => void;
}

type Shape = 'circle' | 'square' | 'triangle' | 'rectangle' | 'pentagon' | 'hexagon';
type BuildMode = 'free' | 'challenge' | 'pattern';

interface DroppedShape {
  id: string;
  shape: Shape;
  color: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

interface Challenge {
  name: string;
  description: string;
  target: DroppedShape[];
  concept: string;
}

const colors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

const challenges = [
  {
    name: "Traffic Light",
    description: "Create a traffic light using three circles",
    target: [
      { id: '1', shape: 'circle' as Shape, color: '#ef4444', x: 200, y: 100, size: 40, rotation: 0 },
      { id: '2', shape: 'circle' as Shape, color: '#eab308', x: 200, y: 160, size: 40, rotation: 0 },
      { id: '3', shape: 'circle' as Shape, color: '#22c55e', x: 200, y: 220, size: 40, rotation: 0 }
    ],
    concept: "Traffic lights use color coding to communicate information. This teaches pattern recognition and color association."
  },
  {
    name: "House",
    description: "Build a simple house using shapes",
    target: [
      { id: '1', shape: 'rectangle' as Shape, color: '#8b4513', x: 150, y: 200, size: 100, rotation: 0 },
      { id: '2', shape: 'triangle' as Shape, color: '#dc2626', x: 200, y: 120, size: 60, rotation: 0 },
      { id: '3', shape: 'square' as Shape, color: '#1f2937', x: 180, y: 240, size: 30, rotation: 0 }
    ],
    concept: "Geometric shapes form the basis of architectural design. Understanding how shapes combine helps develop spatial reasoning."
  }
];

export const ObjectBuilder: React.FC<ObjectBuilderProps> = ({ onBack }) => {
  const [buildMode, setBuildMode] = useState<BuildMode>('free');
  const [selectedShape, setSelectedShape] = useState<Shape>('circle');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(50);
  const [droppedShapes, setDroppedShapes] = useState<DroppedShape[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [showConcept, setShowConcept] = useState(false);

  const shapes: Shape[] = ['circle', 'square', 'triangle', 'rectangle', 'pentagon', 'hexagon'];

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (buildMode === 'challenge' && challengeComplete) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newShape: DroppedShape = {
      id: `shape-${Date.now()}`,
      shape: selectedShape,
      color: selectedColor,
      x,
      y,
      size: selectedSize,
      rotation: 0
    };
    
    setDroppedShapes([...droppedShapes, newShape]);
    
    if (buildMode === 'challenge' && currentChallenge) {
      checkChallenge([...droppedShapes, newShape]);
    }
  };

  const checkChallenge = (shapes: DroppedShape[]) => {
    if (!currentChallenge) return;
    
    // Simple challenge completion check
    if (shapes.length >= currentChallenge.target.length) {
      const hasCorrectShapes = currentChallenge.target.every(targetShape => 
        shapes.some(shape => 
          shape.shape === targetShape.shape && 
          shape.color === targetShape.color
        )
      );
      
      if (hasCorrectShapes) {
        setChallengeComplete(true);
      }
    }
  };

  const clearCanvas = () => {
    setDroppedShapes([]);
    setChallengeComplete(false);
  };

  const startChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setBuildMode('challenge');
    clearCanvas();
  };

  const removeShape = (id: string) => {
    setDroppedShapes(droppedShapes.filter(shape => shape.id !== id));
    setChallengeComplete(false);
  };

  const renderShape = (shape: DroppedShape) => {
    const { shape: type, color, x, y, size, rotation, id } = shape;
    
    const shapeStyle = {
      position: 'absolute' as const,
      left: x - size/2,
      top: y - size/2,
      width: size,
      height: size,
      backgroundColor: color,
      cursor: 'pointer',
      transform: `rotate(${rotation}deg)`,
      transition: 'all 0.2s ease'
    };
    
    switch (type) {
      case 'circle':
        return (
          <div
            key={id}
            style={{ ...shapeStyle, borderRadius: '50%' }}
            onClick={(e) => { e.stopPropagation(); removeShape(id); }}
            className="hover:scale-110 border-2 border-white shadow-lg"
          />
        );
      case 'square':
        return (
          <div
            key={id}
            style={shapeStyle}
            onClick={(e) => { e.stopPropagation(); removeShape(id); }}
            className="hover:scale-110 border-2 border-white shadow-lg"
          />
        );
      case 'triangle':
        return (
          <div
            key={id}
            style={{
              position: 'absolute' as const,
              left: x - size/2,
              top: y - size/2,
              width: 0,
              height: 0,
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              cursor: 'pointer',
              transform: `rotate(${rotation}deg)`,
            }}
            onClick={(e) => { e.stopPropagation(); removeShape(id); }}
            className="hover:scale-110 filter drop-shadow-lg"
          />
        );
      case 'rectangle':
        return (
          <div
            key={id}
            style={{ ...shapeStyle, width: size * 1.5, left: x - (size * 1.5)/2 }}
            onClick={(e) => { e.stopPropagation(); removeShape(id); }}
            className="hover:scale-110 border-2 border-white shadow-lg"
          />
        );
      default:
        return (
          <div
            key={id}
            style={shapeStyle}
            onClick={(e) => { e.stopPropagation(); removeShape(id); }}
            className="hover:scale-110 border-2 border-white shadow-lg"
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🎨 Object Builder</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/90">How to Play</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Object Builder</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p><strong>Free Mode:</strong> Create anything you want using shapes and colors</p>
                <p><strong>Challenge Mode:</strong> Complete specific building tasks</p>
                <p><strong>Pattern Mode:</strong> Follow visual patterns and sequences</p>
                <p>• Click on canvas to place shapes</p>
                <p>• Click on placed shapes to remove them</p>
                <p>• Use concepts to learn about design principles</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Build Mode</label>
                <Select value={buildMode} onValueChange={(value) => setBuildMode(value as BuildMode)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">🎨 Free Build</SelectItem>
                    <SelectItem value="challenge">🎯 Challenge</SelectItem>
                    <SelectItem value="pattern">🔄 Pattern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  {shapes.map(shape => (
                    <Button
                      key={shape}
                      variant={selectedShape === shape ? "default" : "outline"}
                      onClick={() => setSelectedShape(shape)}
                      className="p-2 h-12"
                    >
                      {shape === 'circle' && '●'}
                      {shape === 'square' && '■'}
                      {shape === 'triangle' && '▲'}
                      {shape === 'rectangle' && '▬'}
                      {shape === 'pentagon' && '⬟'}
                      {shape === 'hexagon' && '⬢'}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map(color => (
                    <Button
                      key={color}
                      style={{ backgroundColor: color }}
                      className={`w-8 h-8 p-0 rounded-full ${selectedColor === color ? 'ring-4 ring-blue-500' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Size: {selectedSize}px</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={clearCanvas} variant="outline" className="flex-1">
                  🗑️ Clear
                </Button>
                <Dialog open={showConcept} onOpenChange={setShowConcept}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      📚 Concept
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Design Concepts</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Shape Properties:</h4>
                        <p className="text-sm">• Circles: Continuous curves, represent completeness</p>
                        <p className="text-sm">• Squares: Equal sides, represent stability</p>
                        <p className="text-sm">• Triangles: Three points, represent direction and movement</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Color Theory:</h4>
                        <p className="text-sm">• Warm colors (red, orange, yellow) feel energetic</p>
                        <p className="text-sm">• Cool colors (blue, green, purple) feel calm</p>
                        <p className="text-sm">• Contrast helps shapes stand out</p>
                      </div>
                      {buildMode === 'challenge' && currentChallenge && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-semibold">Challenge Concept:</h4>
                          <p className="text-sm">{currentChallenge.concept}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {buildMode === 'challenge' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Challenges</label>
                  {challenges.map((challenge, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => startChallenge(challenge)}
                      className="w-full text-left"
                    >
                      <div>
                        <div className="font-medium">{challenge.name}</div>
                        <div className="text-xs text-gray-500">{challenge.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="lg:col-span-2 bg-white/95">
            <CardHeader>
              <CardTitle className="text-center flex justify-between items-center">
                <span>Canvas</span>
                {buildMode === 'challenge' && currentChallenge && (
                  <span className="text-sm font-normal">
                    {challengeComplete ? '✅ Complete!' : `🎯 ${currentChallenge.name}`}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair overflow-hidden"
                onClick={handleCanvasClick}
              >
                {droppedShapes.map(renderShape)}
                
                {buildMode === 'challenge' && currentChallenge && !challengeComplete && (
                  <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg shadow-md">
                    <p className="text-sm font-medium">{currentChallenge.description}</p>
                    <p className="text-xs text-gray-600">Shapes placed: {droppedShapes.length}/{currentChallenge.target.length}</p>
                  </div>
                )}
                
                {challengeComplete && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                      <h3 className="text-2xl font-bold text-green-600 mb-2">🎉 Challenge Complete!</h3>
                      <p className="text-gray-600">Great job building the {currentChallenge?.name}!</p>
                      <Button 
                        onClick={() => {
                          setCurrentChallenge(null);
                          setBuildMode('free');
                          clearCanvas();
                        }}
                        className="mt-4 bg-green-500 hover:bg-green-600"
                      >
                        Continue Building
                      </Button>
                    </div>
                  </div>
                )}
                
                {droppedShapes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <p>Click to place shapes and start building!</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                Shapes placed: {droppedShapes.length} | Click shapes to remove them
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
