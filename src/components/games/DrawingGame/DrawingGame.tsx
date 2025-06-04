
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface DrawingGameProps {
  onBack: () => void;
}

export const DrawingGame: React.FC<DrawingGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#000000');
  const [showConcept, setShowConcept] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const prompts = [
    'Draw a house with a garden',
    'Draw your favorite animal',
    'Draw a landscape with mountains',
    'Draw a portrait of a friend',
    'Draw an abstract pattern',
    'Draw your dream vacation spot'
  ];

  useEffect(() => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
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
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const newPrompt = () => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    clearCanvas();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">Creative Drawing</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Art & Creativity</DialogTitle>
                <DialogDescription>Express yourself through digital art</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">🎨 Drawing Benefits</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Enhances creativity and imagination</li>
                    <li>Improves hand-eye coordination</li>
                    <li>Develops visual perception skills</li>
                    <li>Provides stress relief and relaxation</li>
                  </ul>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <h4 className="font-bold">💡 Drawing Tips:</h4>
                  <p>Start with simple shapes, practice regularly, and don't worry about perfection!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Drawing Prompt: {currentPrompt}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div className="flex items-center gap-2">
                <label>Brush Size:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20"
                />
                <span>{brushSize}px</span>
              </div>
              
              <div className="flex items-center gap-2">
                <label>Color:</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-12 h-8 rounded"
                />
              </div>
              
              <Button onClick={clearCanvas} variant="outline">
                🗑️ Clear
              </Button>
              
              <Button onClick={newPrompt} className="bg-purple-500 hover:bg-purple-600">
                🎲 New Prompt
              </Button>
            </div>
            
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border-2 border-gray-300 rounded-lg cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            
            <div className="text-center text-sm text-gray-600">
              Click and drag to draw on the canvas above
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
