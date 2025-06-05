import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

interface DrawingGameProps {
  onBack: () => void;
}

type DrawingTool = 'brush' | 'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'spray' | 'fill';
type DrawingMode = 'basic' | 'advanced';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  opacity: number;
  canvas: HTMLCanvasElement;
}

export const DrawingGame: React.FC<DrawingGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(100);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('basic');
  const [showConcept, setShowConcept] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  const prompts = [
    'Draw a house with a garden',
    'Draw your favorite animal',
    'Draw a landscape with mountains',
    'Draw a portrait of a friend',
    'Draw an abstract pattern',
    'Draw your dream vacation spot',
    'Draw a futuristic city',
    'Draw your favorite food',
    'Draw a magical forest',
    'Draw an underwater scene'
  ];

  const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#90EE90', '#87CEEB', '#DDA0DD', '#F0E68C', '#98FB98',
    '#FFB6C1', '#20B2AA', '#87CEFA', '#778899', '#B0C4DE', '#FFFFE0'
  ];

  useEffect(() => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
      }
    }
  }, [backgroundColor]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setUndoStack(prev => [...prev.slice(-19), imageData]);
        setRedoStack([]);
      }
    }
  };

  const undo = () => {
    if (undoStack.length > 1) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const current = undoStack[undoStack.length - 1];
          const previous = undoStack[undoStack.length - 2];
          setRedoStack(prev => [...prev, current]);
          setUndoStack(prev => prev.slice(0, -1));
          ctx.putImageData(previous, 0, 0);
        }
      }
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imageData = redoStack[redoStack.length - 1];
          setUndoStack(prev => [...prev, imageData]);
          setRedoStack(prev => prev.slice(0, -1));
          ctx.putImageData(imageData, 0, 0);
        }
      }
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPoint({ x, y });
    
    if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser' || currentTool === 'spray') {
      draw(e);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.globalAlpha = opacity / 100;
    
    switch (currentTool) {
      case 'brush':
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;
        
      case 'pencil':
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = Math.max(1, brushSize / 2);
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;
        
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;
        
      case 'spray':
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 20; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize;
          const offsetY = (Math.random() - 0.5) * brushSize;
          ctx.fillStyle = brushColor;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        break;
    }
  };

  const stopDrawing = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.globalAlpha = opacity / 100;
    ctx.globalCompositeOperation = 'source-over';
    
    switch (currentTool) {
      case 'line':
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
        
      case 'rectangle':
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
        break;
        
      case 'circle':
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'fill':
        ctx.fillStyle = brushColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
    saveState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
      }
    }
  };

  const newPrompt = () => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'my-artwork.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline" className="bg-white/90">
              ← Back to Hub
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" className="bg-gray-100">
              ← Previous
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white">🎨 Professional Art Studio</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Digital Art & Creative Expression</DialogTitle>
                <DialogDescription>Professional digital art tools for creative development</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">🎨 Digital Art Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Enhances creative expression</li>
                      <li>Develops fine motor skills</li>
                      <li>Improves visual-spatial reasoning</li>
                      <li>Encourages experimentation</li>
                      <li>Provides therapeutic relaxation</li>
                    </ul>
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg text-center">
                      <div className="text-3xl mb-2">🖌️➡️✨➡️🖼️</div>
                      <p className="text-sm">Digital art transforms imagination into visual reality</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🎯 Key Art Concepts:</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Color Theory:</span> Understanding color relationships</div>
                    <div><span className="font-medium">Composition:</span> Arranging elements harmoniously</div>
                    <div><span className="font-medium">Perspective:</span> Creating depth and realism</div>
                    <div><span className="font-medium">Anatomy:</span> Representing accurate forms</div>
                    <div><span className="font-medium">Texture:</span> Simulating surface qualities</div>
                    <div><span className="font-medium">Lighting:</span> Using light and shadow effectively</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Digital_art" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Digital Art</a>
                    <a href="https://en.wikipedia.org/wiki/Color_theory" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Color Theory</a>
                    <a href="https://en.wikipedia.org/wiki/Composition_(visual_arts)" target="_blank" className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Composition</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Toolbar */}
          <div className="col-span-2">
            <Card className="bg-white/95 h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    variant={currentTool === 'brush' ? 'default' : 'outline'}
                    onClick={() => setCurrentTool('brush')}
                    className="h-8 text-xs"
                  >
                    🖌️
                  </Button>
                  <Button
                    variant={currentTool === 'pencil' ? 'default' : 'outline'}
                    onClick={() => setCurrentTool('pencil')}
                    className="h-8 text-xs"
                  >
                    ✏️
                  </Button>
                  <Button
                    variant={currentTool === 'eraser' ? 'default' : 'outline'}
                    onClick={() => setCurrentTool('eraser')}
                    className="h-8 text-xs"
                  >
                    🧽
                  </Button>
                  <Button
                    variant={currentTool === 'spray' ? 'default' : 'outline'}
                    onClick={() => setCurrentTool('spray')}
                    className="h-8 text-xs"
                  >
                    💨
                  </Button>
                  <Button
                    variant={currentTool === 'line' ? 'default' : 'outline'}
                    onClick={() => setCurrentTool('line')}
                    className="h-8 text-xs"
                  >
                    📏
                  </Button>
                  <Button
                    variant={currentTool === 'rectangle' ? 'default' : 'outline'}
                    onClick={() => setCurrentTool('rectangle')}
                    className="h-8 text-xs"
                  >
                    ⬜
                  </Button>
                  <Button
                    variant={currentTool === 'circle' ? 'default' : 'outline'}
                    onClick={() => setCurrentTool('circle')}
                    className="h-8 text-xs"
                  >
                    ⭕
                  </Button>
                  <Button
                    variant={currentTool === 'fill' ? 'default' : 'outline'}
                    onClick={() => setCurrentTool('fill')}
                    className="h-8 text-xs"
                  >
                    🪣
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium">Size: {brushSize}px</label>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(value) => setBrushSize(value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Opacity: {opacity}%</label>
                  <Slider
                    value={[opacity]}
                    onValueChange={(value) => setOpacity(value[0])}
                    max={100}
                    min={10}
                    step={10}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Color</label>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-full h-8 rounded mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="col-span-8">
            <Card className="bg-white/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-sm">Canvas: {currentPrompt}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border-2 border-gray-300 rounded-lg cursor-crosshair bg-white shadow-lg"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={clearCanvas} variant="outline" className="text-xs">
                🗑️ Clear
              </Button>
              <Button onClick={newPrompt} className="bg-purple-500 hover:bg-purple-600 text-xs">
                🎲 New Prompt
              </Button>
              <Button onClick={undo} variant="outline" disabled={undoStack.length <= 1} className="text-xs">
                ↶ Undo
              </Button>
              <Button onClick={redo} variant="outline" disabled={redoStack.length === 0} className="text-xs">
                ↷ Redo
              </Button>
              <Button onClick={downloadImage} className="bg-green-500 hover:bg-green-600 text-xs">
                💾 Save
              </Button>
            </div>
          </div>

          {/* Right Color Palette */}
          <div className="col-span-2">
            <Card className="bg-white/95">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-1">
                  {colorPalette.map((color, index) => (
                    <button
                      key={index}
                      className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-500"
                      style={{ backgroundColor: color }}
                      onClick={() => setBrushColor(color)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
