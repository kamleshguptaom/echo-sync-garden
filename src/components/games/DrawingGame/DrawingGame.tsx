
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DrawingGameProps {
  onBack: () => void;
}

type DrawingTool = 'brush' | 'pencil' | 'marker' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'polygon' | 'text' | 'spray' | 'bucket' | 'eyedropper';
type DrawingMode = 'basic' | 'professional' | 'sketch' | 'paint';
type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light';
type BrushType = 'round' | 'square' | 'texture1' | 'texture2' | 'calligraphy';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  canvas: HTMLCanvasElement;
}

interface DrawingState {
  tool: DrawingTool;
  brushSize: number;
  opacity: number;
  color: string;
  secondaryColor: string;
  brushType: BrushType;
  blendMode: BlendMode;
}

export const DrawingGame: React.FC<DrawingGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('professional');
  const [drawingState, setDrawingState] = useState<DrawingState>({
    tool: 'brush',
    brushSize: 10,
    opacity: 100,
    color: '#000000',
    secondaryColor: '#FFFFFF',
    brushType: 'round',
    blendMode: 'normal'
  });
  
  const [showConcept, setShowConcept] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState(1);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [zoom, setZoom] = useState(100);
  const [gridVisible, setGridVisible] = useState(false);
  const [symmetryMode, setSymmetryMode] = useState<'none' | 'horizontal' | 'vertical' | 'radial'>('none');
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [autoSuggest, setAutoSuggest] = useState(true);

  const prompts = [
    'Draw a futuristic cityscape',
    'Create a magical forest scene',
    'Design a superhero character',
    'Illustrate your dream home',
    'Paint a sunset landscape',
    'Draw a mythical creature',
    'Design a space station',
    'Create an underwater world',
    'Illustrate a steampunk invention',
    'Paint an abstract emotion'
  ];

  const predefinedBrushes = [
    { name: 'Fine Liner', size: 2, opacity: 100, type: 'round' },
    { name: 'Sketch Pencil', size: 8, opacity: 60, type: 'texture1' },
    { name: 'Paint Brush', size: 15, opacity: 80, type: 'round' },
    { name: 'Marker', size: 20, opacity: 70, type: 'square' },
    { name: 'Calligraphy', size: 12, opacity: 90, type: 'calligraphy' },
    { name: 'Texture Brush', size: 25, opacity: 50, type: 'texture2' }
  ];

  const colorPalettes = {
    basic: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    pastel: ['#FFB6C1', '#FFEAA7', '#81ECEC', '#D63031', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E'],
    vibrant: ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E'],
    earth: ['#8B4513', '#D2691E', '#CD853F', '#F4A460', '#DEB887', '#BC8F8F', '#F5DEB3', '#D2B48C'],
    neon: ['#FF073A', '#0BDA51', '#0066FF', '#FF6600', '#FF00FF', '#00FFFF', '#FFFF00', '#9D4EDD']
  };

  useEffect(() => {
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    initializeCanvas();
  }, []);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create initial layer
    const initialLayer: Layer = {
      id: 1,
      name: 'Background',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      canvas: document.createElement('canvas')
    };
    initialLayer.canvas.width = canvas.width;
    initialLayer.canvas.height = canvas.height;
    
    setLayers([initialLayer]);
    saveState();
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-19), imageData]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const current = undoStack[undoStack.length - 1];
      const previous = undoStack[undoStack.length - 2];
      setRedoStack(prev => [...prev, current]);
      setUndoStack(prev => prev.slice(0, -1));
      ctx.putImageData(previous, 0, 0);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const imageData = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, imageData]);
      setRedoStack(prev => prev.slice(0, -1));
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const startDrawing = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    setIsDrawing(true);
    setStartPoint({ x, y });
    
    if (['brush', 'pencil', 'marker', 'eraser', 'spray'].includes(drawingState.tool)) {
      draw(e);
    }
  }, [drawingState.tool]);

  const draw = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    ctx.globalAlpha = drawingState.opacity / 100;
    ctx.globalCompositeOperation = drawingState.blendMode as GlobalCompositeOperation;
    
    switch (drawingState.tool) {
      case 'brush':
      case 'pencil':
      case 'marker':
        drawBrushStroke(ctx, x, y);
        break;
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        drawBrushStroke(ctx, x, y);
        break;
      case 'spray':
        drawSprayPattern(ctx, x, y);
        break;
    }
    
    // Apply symmetry if enabled
    if (symmetryMode !== 'none') {
      applySymmetry(ctx, x, y);
    }
  }, [isDrawing, drawingState, symmetryMode]);

  const drawBrushStroke = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.lineWidth = drawingState.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = drawingState.color;
    
    // Different brush types
    switch (drawingState.brushType) {
      case 'round':
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;
      case 'square':
        ctx.fillStyle = drawingState.color;
        ctx.fillRect(x - drawingState.brushSize/2, y - drawingState.brushSize/2, drawingState.brushSize, drawingState.brushSize);
        break;
      case 'texture1':
        // Simulate pencil texture
        for (let i = 0; i < 5; i++) {
          const offsetX = (Math.random() - 0.5) * drawingState.brushSize * 0.3;
          const offsetY = (Math.random() - 0.5) * drawingState.brushSize * 0.3;
          ctx.fillStyle = drawingState.color;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
        break;
      case 'calligraphy':
        const angle = Math.atan2(y - (startPoint?.y || y), x - (startPoint?.x || x));
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = drawingState.color;
        ctx.fillRect(-drawingState.brushSize/2, -drawingState.brushSize/4, drawingState.brushSize, drawingState.brushSize/2);
        ctx.restore();
        break;
    }
  };

  const drawSprayPattern = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const density = Math.floor(drawingState.brushSize / 2);
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * drawingState.brushSize;
      const offsetY = (Math.random() - 0.5) * drawingState.brushSize;
      ctx.fillStyle = drawingState.color;
      ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
  };

  const applySymmetry = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    switch (symmetryMode) {
      case 'horizontal':
        drawBrushStroke(ctx, canvas.width - x, y);
        break;
      case 'vertical':
        drawBrushStroke(ctx, x, canvas.height - y);
        break;
      case 'radial':
        for (let i = 1; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i;
          const rotatedX = centerX + (x - centerX) * Math.cos(angle) - (y - centerY) * Math.sin(angle);
          const rotatedY = centerY + (x - centerX) * Math.sin(angle) + (y - centerY) * Math.cos(angle);
          drawBrushStroke(ctx, rotatedX, rotatedY);
        }
        break;
    }
  };

  const stopDrawing = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    ctx.globalAlpha = drawingState.opacity / 100;
    ctx.globalCompositeOperation = drawingState.blendMode as GlobalCompositeOperation;
    
    switch (drawingState.tool) {
      case 'line':
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.brushSize;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case 'rectangle':
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.brushSize;
        ctx.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
        break;
      case 'circle':
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.brushSize;
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'text':
        if (textInput) {
          ctx.fillStyle = drawingState.color;
          ctx.font = `${fontSize}px ${fontFamily}`;
          ctx.fillText(textInput, x, y);
          setTextInput('');
        }
        break;
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    saveState();
  }, [isDrawing, startPoint, drawingState, textInput, fontSize, fontFamily]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const applyPredefinedBrush = (brush: typeof predefinedBrushes[0]) => {
    setDrawingState(prev => ({
      ...prev,
      brushSize: brush.size,
      opacity: brush.opacity,
      brushType: brush.type as BrushType
    }));
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: Date.now(),
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      canvas: document.createElement('canvas')
    };
    newLayer.canvas.width = canvasRef.current?.width || 800;
    newLayer.canvas.height = canvasRef.current?.height || 600;
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  };

  const deleteLayer = (layerId: number) => {
    if (layers.length <= 1) return;
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (activeLayerId === layerId) {
      setActiveLayerId(layers[0].id);
    }
  };

  const duplicateLayer = (layerId: number) => {
    const layerToDuplicate = layers.find(l => l.id === layerId);
    if (!layerToDuplicate) return;
    
    const newLayer: Layer = {
      id: Date.now(),
      name: `${layerToDuplicate.name} Copy`,
      visible: true,
      opacity: layerToDuplicate.opacity,
      blendMode: layerToDuplicate.blendMode,
      canvas: document.createElement('canvas')
    };
    
    newLayer.canvas.width = layerToDuplicate.canvas.width;
    newLayer.canvas.height = layerToDuplicate.canvas.height;
    const newCtx = newLayer.canvas.getContext('2d');
    if (newCtx) {
      newCtx.drawImage(layerToDuplicate.canvas, 0, 0);
    }
    
    setLayers(prev => [...prev, newLayer]);
  };

  const exportImage = (format: 'png' | 'jpg' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `artwork.${format}`;
    
    if (format === 'svg') {
      // Create SVG representation (simplified)
      const svg = `<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
        <image href="${canvas.toDataURL()}" width="${canvas.width}" height="${canvas.height}"/>
      </svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
    } else {
      link.href = canvas.toDataURL(`image/${format}`);
    }
    
    link.click();
  };

  const loadReference = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Draw as overlay with low opacity
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        saveState();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">🎨 Professional Art Studio</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-purple-500 text-white hover:bg-purple-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Digital Art & Creative Expression</DialogTitle>
                <DialogDescription>Professional digital art tools for creative exploration</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg mb-3">🎨 Advanced Digital Art Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Professional artistic skill development</li>
                      <li>Advanced color theory application</li>
                      <li>Digital workflow mastery</li>
                      <li>Layer-based composition understanding</li>
                      <li>Brush dynamics and texture creation</li>
                      <li>Creative problem-solving enhancement</li>
                    </ul>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🖌️</div>
                        <div className="text-2xl mb-2">🎭</div>
                        <div className="text-2xl mb-2">🌈</div>
                        <p className="text-sm">Professional tools enable complex artistic expression</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">💡 Professional Features:</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>• Layer-based composition</div>
                    <div>• Multiple brush types and dynamics</div>
                    <div>• Symmetry and pattern tools</div>
                    <div>• Advanced color palettes</div>
                    <div>• Blend modes and effects</div>
                    <div>• Vector and raster capabilities</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🔗 Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://en.wikipedia.org/wiki/Digital_art" target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Digital Art</a>
                    <a href="https://en.wikipedia.org/wiki/Color_theory" target="_blank" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Color Theory</a>
                    <a href="https://en.wikipedia.org/wiki/Computer_graphics" target="_blank" className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">Computer Graphics</a>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 mb-6">
          {/* Tools Panel */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-sm">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Tabs value={drawingMode} onValueChange={(value) => setDrawingMode(value as DrawingMode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
                  <TabsTrigger value="professional" className="text-xs">Pro</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="grid grid-cols-2 gap-1">
                {['brush', 'pencil', 'marker', 'eraser', 'line', 'rectangle', 'circle', 'text'].map(tool => (
                  <Button
                    key={tool}
                    variant={drawingState.tool === tool ? 'default' : 'outline'}
                    onClick={() => setDrawingState(prev => ({ ...prev, tool: tool as DrawingTool }))}
                    className="text-xs p-2 h-8"
                  >
                    {tool === 'brush' && '🖌️'}
                    {tool === 'pencil' && '✏️'}
                    {tool === 'marker' && '🖊️'}
                    {tool === 'eraser' && '🧽'}
                    {tool === 'line' && '📏'}
                    {tool === 'rectangle' && '⬜'}
                    {tool === 'circle' && '⭕'}
                    {tool === 'text' && '📝'}
                  </Button>
                ))}
              </div>
              
              {drawingMode === 'professional' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    {['spray', 'bucket', 'eyedropper', 'polygon'].map(tool => (
                      <Button
                        key={tool}
                        variant={drawingState.tool === tool ? 'default' : 'outline'}
                        onClick={() => setDrawingState(prev => ({ ...prev, tool: tool as DrawingTool }))}
                        className="text-xs p-2 h-8"
                      >
                        {tool === 'spray' && '💨'}
                        {tool === 'bucket' && '🪣'}
                        {tool === 'eyedropper' && '💧'}
                        {tool === 'polygon' && '⬢'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Brush Settings */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-sm">Brush</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium">Size: {drawingState.brushSize}px</label>
                <Slider
                  value={[drawingState.brushSize]}
                  onValueChange={(value) => setDrawingState(prev => ({ ...prev, brushSize: value[0] }))}
                  max={100}
                  min={1}
                  step={1}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Opacity: {drawingState.opacity}%</label>
                <Slider
                  value={[drawingState.opacity]}
                  onValueChange={(value) => setDrawingState(prev => ({ ...prev, opacity: value[0] }))}
                  max={100}
                  min={1}
                  step={1}
                  className="mt-1"
                />
              </div>

              {drawingMode === 'professional' && (
                <>
                  <div>
                    <label className="text-xs font-medium">Type</label>
                    <Select value={drawingState.brushType} onValueChange={(value) => setDrawingState(prev => ({ ...prev, brushType: value as BrushType }))}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="round">Round</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="texture1">Texture</SelectItem>
                        <SelectItem value="calligraphy">Calligraphy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Blend Mode</label>
                    <Select value={drawingState.blendMode} onValueChange={(value) => setDrawingState(prev => ({ ...prev, blendMode: value as BlendMode }))}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="multiply">Multiply</SelectItem>
                        <SelectItem value="screen">Screen</SelectItem>
                        <SelectItem value="overlay">Overlay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-medium">Quick Brushes</label>
                {predefinedBrushes.slice(0, 3).map((brush, index) => (
                  <Button
                    key={index}
                    onClick={() => applyPredefinedBrush(brush)}
                    className="w-full text-xs h-6 p-1"
                    variant="outline"
                  >
                    {brush.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-sm">Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-medium">Primary</label>
                  <input
                    type="color"
                    value={drawingState.color}
                    onChange={(e) => setDrawingState(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-8 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium">Secondary</label>
                  <input
                    type="color"
                    value={drawingState.secondaryColor}
                    onChange={(e) => setDrawingState(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-full h-8 rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium">Palette</label>
                <Select defaultValue="basic">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pastel">Pastel</SelectItem>
                    <SelectItem value="vibrant">Vibrant</SelectItem>
                    <SelectItem value="earth">Earth</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 gap-1">
                {colorPalettes.basic.map((color, index) => (
                  <button
                    key={index}
                    className="w-full h-6 rounded border"
                    style={{ backgroundColor: color }}
                    onClick={() => setDrawingState(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Effects & Advanced */}
          {drawingMode === 'professional' && (
            <Card className="bg-white/95">
              <CardHeader>
                <CardTitle className="text-sm">Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium">Symmetry</label>
                  <Select value={symmetryMode} onValueChange={(value) => setSymmetryMode(value as typeof symmetryMode)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs font-medium">Zoom: {zoom}%</label>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    max={500}
                    min={25}
                    step={25}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={gridVisible}
                    onChange={(e) => setGridVisible(e.target.checked)}
                    className="w-3 h-3"
                  />
                  <label className="text-xs">Show Grid</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoSuggest}
                    onChange={(e) => setAutoSuggest(e.target.checked)}
                    className="w-3 h-3"
                  />
                  <label className="text-xs">Auto Suggest</label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <Button onClick={undo} className="text-xs h-8" variant="outline">
                  ↶ Undo
                </Button>
                <Button onClick={redo} className="text-xs h-8" variant="outline">
                  ↷ Redo
                </Button>
              </div>
              
              <Button onClick={clearCanvas} className="w-full text-xs h-8" variant="outline">
                🗑️ Clear
              </Button>
              
              <Button 
                onClick={() => setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)])} 
                className="w-full text-xs h-8 bg-purple-500 hover:bg-purple-600"
              >
                🎲 New Prompt
              </Button>
              
              {drawingMode === 'professional' && (
                <>
                  <div className="space-y-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={loadReference}
                      className="w-full text-xs"
                    />
                    <Button onClick={addLayer} className="w-full text-xs h-8" variant="outline">
                      ➕ Add Layer
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1">
                    <Button onClick={() => exportImage('png')} className="text-xs h-6" variant="outline">
                      PNG
                    </Button>
                    <Button onClick={() => exportImage('jpg')} className="text-xs h-6" variant="outline">
                      JPG
                    </Button>
                    <Button onClick={() => exportImage('svg')} className="text-xs h-6" variant="outline">
                      SVG
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Prompt: {currentPrompt}</CardTitle>
          </CardHeader>
          <CardContent>
            {drawingState.tool === 'text' && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">Text Input</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text to add"
                    className="flex-1 p-2 border rounded"
                  />
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times">Times</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value) || 24)}
                    className="w-16 p-2 border rounded"
                    min="8"
                    max="72"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={900}
                height={600}
                className="border-2 border-gray-300 rounded-lg cursor-crosshair bg-white shadow-lg"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            
            <div className="text-center text-sm text-gray-600 mt-4">
              {drawingMode === 'professional' ? 
                'Professional tools: Use layers, blend modes, and advanced brushes for complex artwork' :
                'Click and drag to draw • Use different tools and adjust brush settings'
              }
            </div>
          </CardContent>
        </Card>

        {/* Layers Panel (Professional Mode) */}
        {drawingMode === 'professional' && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-sm">Layers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {layers.map(layer => (
                  <div 
                    key={layer.id} 
                    className={`flex items-center gap-2 p-2 rounded ${activeLayerId === layer.id ? 'bg-blue-100' : 'bg-gray-50'}`}
                  >
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={(e) => {
                        setLayers(prev => prev.map(l => l.id === layer.id ? { ...l, visible: e.target.checked } : l));
                      }}
                      className="w-3 h-3"
                    />
                    <span 
                      className="flex-1 text-xs cursor-pointer"
                      onClick={() => setActiveLayerId(layer.id)}
                    >
                      {layer.name}
                    </span>
                    <Button
                      onClick={() => duplicateLayer(layer.id)}
                      className="text-xs h-6 w-6 p-0"
                      variant="outline"
                    >
                      📋
                    </Button>
                    <Button
                      onClick={() => deleteLayer(layer.id)}
                      className="text-xs h-6 w-6 p-0"
                      variant="outline"
                      disabled={layers.length <= 1}
                    >
                      🗑️
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
