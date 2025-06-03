import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface ObjectBuilderProps {
  onBack: () => void;
}

type Shape = 'circle' | 'square' | 'triangle' | 'rectangle' | 'pentagon' | 'hexagon' | 'star';
type BuildMode = 'free' | 'challenge' | 'pattern' | 'tutorial';

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
  animation?: string;
}

const colors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

const challenges: Challenge[] = [
  {
    name: "Traffic Light",
    description: "Create a traffic light using three circles",
    target: [
      { id: '1', shape: 'circle' as Shape, color: '#ef4444', x: 200, y: 100, size: 40, rotation: 0 },
      { id: '2', shape: 'circle' as Shape, color: '#eab308', x: 200, y: 160, size: 40, rotation: 0 },
      { id: '3', shape: 'circle' as Shape, color: '#22c55e', x: 200, y: 220, size: 40, rotation: 0 }
    ],
    concept: "Traffic lights use color coding to communicate information. This teaches pattern recognition and color association.",
    animation: "🔴 → 🟡 → 🟢 (Traffic light sequence)"
  },
  {
    name: "House",
    description: "Build a simple house using shapes",
    target: [
      { id: '1', shape: 'rectangle' as Shape, color: '#8b4513', x: 150, y: 200, size: 100, rotation: 0 },
      { id: '2', shape: 'triangle' as Shape, color: '#dc2626', x: 200, y: 120, size: 60, rotation: 0 },
      { id: '3', shape: 'square' as Shape, color: '#1f2937', x: 180, y: 240, size: 30, rotation: 0 }
    ],
    concept: "Geometric shapes form the basis of architectural design. Understanding how shapes combine helps develop spatial reasoning.",
    animation: "🔲 + 🔺 + ◾ = 🏠 (House construction)"
  },
  {
    name: "Flower Pattern",
    description: "Create a simple flower with shapes",
    target: [
      { id: '1', shape: 'circle' as Shape, color: '#f59e0b', x: 200, y: 150, size: 40, rotation: 0 },
      { id: '2', shape: 'circle' as Shape, color: '#ec4899', x: 170, y: 120, size: 30, rotation: 0 },
      { id: '3', shape: 'circle' as Shape, color: '#ec4899', x: 230, y: 120, size: 30, rotation: 0 },
      { id: '4', shape: 'circle' as Shape, color: '#ec4899', x: 170, y: 180, size: 30, rotation: 0 },
      { id: '5', shape: 'circle' as Shape, color: '#ec4899', x: 230, y: 180, size: 30, rotation: 0 },
      { id: '6', shape: 'rectangle' as Shape, color: '#22c55e', x: 200, y: 250, size: 20, rotation: 0 }
    ],
    concept: "Flowers have radial symmetry - petals arranged around a center point. This builds understanding of natural patterns.",
    animation: "🌸 = 🟡 + 🔴🔴🔴🔴 + 🟢 (Flower structure)"
  },
  {
    name: "Robot Design",
    description: "Create a simple robot face",
    target: [
      { id: '1', shape: 'square' as Shape, color: '#9ca3af', x: 200, y: 150, size: 100, rotation: 0 },
      { id: '2', shape: 'circle' as Shape, color: '#3b82f6', x: 170, y: 130, size: 20, rotation: 0 },
      { id: '3', shape: 'circle' as Shape, color: '#3b82f6', x: 230, y: 130, size: 20, rotation: 0 },
      { id: '4', shape: 'rectangle' as Shape, color: '#ef4444', x: 200, y: 180, size: 40, rotation: 0 }
    ],
    concept: "Robots are often represented with geometric shapes to convey mechanical parts. This helps understand design abstractions.",
    animation: "🤖 = ⬜ + 🔵🔵 + 🟥 (Robot face parts)"
  }
];

export const ObjectBuilder: React.FC<ObjectBuilderProps> = ({ onBack }) => {
  const [buildMode, setBuildMode] = useState<BuildMode>('free');
  const [selectedShape, setSelectedShape] = useState<Shape>('circle');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(50);
  const [selectedRotation, setSelectedRotation] = useState(0);
  const [droppedShapes, setDroppedShapes] = useState<DroppedShape[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [dragShape, setDragShape] = useState<DroppedShape | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragOffsetX = useRef<number>(0);
  const dragOffsetY = useRef<number>(0);

  const shapes: Shape[] = ['circle', 'square', 'triangle', 'rectangle', 'pentagon', 'hexagon', 'star'];

  // Real-time updates when switching modes
  useEffect(() => {
    if (buildMode === 'tutorial') {
      setShowTutorial(true);
      setTutorialStep(0);
      clearCanvas();
    } else {
      setShowTutorial(false);
    }
    
    if (buildMode !== 'challenge') {
      setCurrentChallenge(null);
      setChallengeComplete(false);
    }
  }, [buildMode]);

  const handleShapeDragStart = (e: React.MouseEvent, shape: DroppedShape) => {
    e.stopPropagation();
    isDragging.current = true;
    setDragShape(shape);
    
    // Calculate offset to keep dragging from the center of the shape
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      dragOffsetX.current = e.clientX - rect.left - shape.x;
      dragOffsetY.current = e.clientY - rect.top - shape.y;
    }
  };

  const handleShapeDragEnd = () => {
    isDragging.current = false;
    setDragShape(null);
    
    if (buildMode === 'challenge' && currentChallenge) {
      checkChallenge(droppedShapes);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !dragShape || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffsetX.current;
    const y = e.clientY - rect.top - dragOffsetY.current;
    
    // Update the position of the dragged shape
    const updatedShapes = droppedShapes.map(shape => 
      shape.id === dragShape.id ? { ...shape, x, y } : shape
    );
    
    setDroppedShapes(updatedShapes);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't add shapes if we're ending a drag operation
    if (isDragging.current) return;
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
      rotation: selectedRotation,
    };
    
    setDroppedShapes([...droppedShapes, newShape]);
    
    if (buildMode === 'challenge' && currentChallenge) {
      checkChallenge([...droppedShapes, newShape]);
    }
    
    // Tutorial progress
    if (buildMode === 'tutorial') {
      if (tutorialStep === 0) {
        setTutorialStep(1);
        setTimeout(() => {
          setTutorialStep(2);
        }, 1000);
      }
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

  const removeShape = (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setDroppedShapes(droppedShapes.filter(shape => shape.id !== id));
    setChallengeComplete(false);
    
    // Tutorial progress
    if (buildMode === 'tutorial' && tutorialStep === 2) {
      setTutorialStep(3);
    }
  };

  const duplicateShape = (shape: DroppedShape, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newShape: DroppedShape = {
      ...shape,
      id: `shape-${Date.now()}`,
      x: shape.x + 20,
      y: shape.y + 20,
    };
    
    setDroppedShapes([...droppedShapes, newShape]);
  };

  const rotateShape = (id: string, direction: 'clockwise' | 'counter', event: React.MouseEvent) => {
    event.stopPropagation();
    
    const rotation = direction === 'clockwise' ? 15 : -15;
    
    const updatedShapes = droppedShapes.map(shape => 
      shape.id === id ? { ...shape, rotation: shape.rotation + rotation } : shape
    );
    
    setDroppedShapes(updatedShapes);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < 3) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setBuildMode('free');
    }
  };

  const renderShape = (shape: DroppedShape) => {
    const { shape: type, color, x, y, size, rotation, id } = shape;
    
    const isBeingDragged = dragShape && dragShape.id === id;
    
    const shapeStyle = {
      position: 'absolute' as const,
      left: x - size/2,
      top: y - size/2,
      width: size,
      height: size,
      backgroundColor: color,
      cursor: 'move',
      transform: `rotate(${rotation}deg)`,
      transition: isBeingDragged ? 'none' : 'all 0.2s ease',
      boxShadow: isBeingDragged ? '0 0 15px rgba(0,0,0,0.5)' : '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: isBeingDragged ? 1000 : 1
    };
    
    // Common properties for shape container
    const containerClass = `${isBeingDragged ? 'scale-110' : ''} border-2 border-white shadow-lg group relative`;
    
    // Controls overlay for each shape
    const controlsOverlay = (
      <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
        <div className="bg-white/70 p-1 rounded shadow flex gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="w-6 h-6 p-0" 
            onClick={(e) => removeShape(id, e)}
          >
            🗑️
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="w-6 h-6 p-0" 
            onClick={(e) => duplicateShape(shape, e)}
          >
            📋
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="w-6 h-6 p-0" 
            onClick={(e) => rotateShape(id, 'counter', e)}
          >
            ↺
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="w-6 h-6 p-0" 
            onClick={(e) => rotateShape(id, 'clockwise', e)}
          >
            ↻
          </Button>
        </div>
      </div>
    );
    
    switch (type) {
      case 'circle':
        return (
          <div
            key={id}
            style={{ ...shapeStyle, borderRadius: '50%' }}
            onMouseDown={(e) => handleShapeDragStart(e, shape)}
            onMouseUp={handleShapeDragEnd}
            className={containerClass}
          >
            {controlsOverlay}
          </div>
        );
      case 'square':
        return (
          <div
            key={id}
            style={shapeStyle}
            onMouseDown={(e) => handleShapeDragStart(e, shape)}
            onMouseUp={handleShapeDragEnd}
            className={containerClass}
          >
            {controlsOverlay}
          </div>
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
              cursor: 'move',
              transform: `rotate(${rotation}deg)`,
              transition: isBeingDragged ? 'none' : 'transform 0.2s ease',
              zIndex: isBeingDragged ? 1000 : 1
            }}
            onMouseDown={(e) => handleShapeDragStart(e, shape)}
            onMouseUp={handleShapeDragEnd}
            className="group relative"
          >
            {controlsOverlay}
          </div>
        );
      case 'rectangle':
        return (
          <div
            key={id}
            style={{ ...shapeStyle, width: size * 1.5, left: x - (size * 1.5)/2 }}
            onMouseDown={(e) => handleShapeDragStart(e, shape)}
            onMouseUp={handleShapeDragEnd}
            className={containerClass}
          >
            {controlsOverlay}
          </div>
        );
      case 'star':
        // Simple star shape using clip-path
        return (
          <div
            key={id}
            style={{ 
              ...shapeStyle,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
            onMouseDown={(e) => handleShapeDragStart(e, shape)}
            onMouseUp={handleShapeDragEnd}
            className={containerClass}
          >
            {controlsOverlay}
          </div>
        );
      default:
        return (
          <div
            key={id}
            style={shapeStyle}
            onMouseDown={(e) => handleShapeDragStart(e, shape)}
            onMouseUp={handleShapeDragEnd}
            className={containerClass}
          >
            {controlsOverlay}
          </div>
        );
    }
  };

  const tutorials = [
    {
      title: "Welcome to Object Builder!",
      content: "This tutorial will show you how to use the Object Builder tool.",
      action: "Click Next to continue"
    },
    {
      title: "Creating Shapes",
      content: "Click anywhere on the canvas to place a shape. Try it now!",
      action: "Place a shape on the canvas"
    },
    {
      title: "Moving Shapes",
      content: "You can drag shapes by clicking and holding. Try moving the shape you created.",
      action: "Drag your shape to another position"
    },
    {
      title: "Removing Shapes",
      content: "Hover over a shape to see controls. Try removing your shape by clicking the trash icon.",
      action: "Remove the shape from the canvas"
    },
    {
      title: "All Set!",
      content: "Great job! Now you know the basics of Object Builder. You can create simple objects or try challenges to test your skills.",
      action: "Click Finish to start building"
    }
  ];

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
                <p><strong>Tutorial Mode:</strong> Learn the basics step by step</p>
                <p>• Click on canvas to place shapes</p>
                <p>• Drag shapes to move them around</p>
                <p>• Hover over shapes to see options (rotate, delete, duplicate)</p>
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
                    <SelectItem value="tutorial">📚 Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shape</label>
                <div className="grid grid-cols-4 gap-2">
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
                      {shape === 'star' && '★'}
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
                <Slider
                  value={[selectedSize]}
                  onValueChange={(values) => setSelectedSize(values[0])}
                  min={20}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rotation: {selectedRotation}°</label>
                <Slider
                  value={[selectedRotation]}
                  onValueChange={(values) => setSelectedRotation(values[0])}
                  min={0}
                  max={360}
                  step={15}
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
                  <DialogContent className="max-w-md">
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
                          <p className="text-sm mb-2">{currentChallenge.concept}</p>
                          {currentChallenge.animation && (
                            <div className="bg-white p-3 rounded border">
                              <p className="text-lg font-mono text-center animate-pulse">{currentChallenge.animation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {buildMode === 'challenge' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Challenges</label>
                  <div className="max-h-48 overflow-y-auto pr-2">
                    {challenges.map((challenge, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => startChallenge(challenge)}
                        className="w-full text-left mb-2"
                      >
                        <div>
                          <div className="font-medium">{challenge.name}</div>
                          <div className="text-xs text-gray-500">{challenge.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {showTutorial && tutorialStep < tutorials.length && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
                  <h4 className="font-semibold text-blue-700">{tutorials[tutorialStep].title}</h4>
                  <p className="text-sm text-blue-600 mt-1 mb-3">{tutorials[tutorialStep].content}</p>
                  <div className="flex justify-between">
                    <span className="text-xs text-blue-500">{tutorials[tutorialStep].action}</span>
                    <Button size="sm" variant="outline" onClick={nextTutorialStep}>
                      {tutorialStep === tutorials.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
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
                ref={canvasRef}
                className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair overflow-hidden"
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleShapeDragEnd}
                onMouseUp={handleShapeDragEnd}
              >
                {droppedShapes.map(renderShape)}
                
                {buildMode === 'challenge' && currentChallenge && !challengeComplete && (
                  <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg shadow-md">
                    <p className="text-sm font-medium">{currentChallenge.description}</p>
                    <p className="text-xs text-gray-600">Shapes placed: {droppedShapes.length}/{currentChallenge.target.length}</p>
                  </div>
                )}
                
                {challengeComplete && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                      <h3 className="text-2xl font-bold text-green-600 mb-2">🎉 Challenge Complete!</h3>
                      <p className="text-gray-600 mb-4">Great job building the {currentChallenge?.name}!</p>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          onClick={() => {
                            setCurrentChallenge(null);
                            setBuildMode('free');
                            clearCanvas();
                          }}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Continue Building
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">View Concept</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Design Concept - {currentChallenge?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <p>{currentChallenge?.concept}</p>
                              {currentChallenge?.animation && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <p className="text-lg font-mono text-center animate-pulse">{currentChallenge?.animation}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                )}
                
                {droppedShapes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4 animate-bounce">🎨</div>
                      <p>Click to place shapes and start building!</p>
                      <p className="text-xs mt-2">Drag shapes to move them around</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                <div>Shapes placed: {droppedShapes.length}</div>
                <div className="text-xs mt-1">
                  Drag to move shapes • Hover over shapes for more options
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
