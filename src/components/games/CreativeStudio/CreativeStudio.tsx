import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Palette, Download, RotateCcw, Layers, Music } from 'lucide-react';

interface CreativeStudioProps {
  onBack: () => void;
}

type Tool = 'brush' | 'eraser' | 'fill' | 'line' | 'circle' | 'rectangle' | 'text';
type Mode = 'drawing' | 'animation' | 'music';

interface DrawingState {
  tool: Tool;
  color: string;
  size: number;
  isDrawing: boolean;
}

interface AnimationFrame {
  id: number;
  canvas: string; // base64 data URL
  duration: number;
}

interface MusicNote {
  note: string;
  time: number;
  duration: number;
  instrument: string;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ onBack }) => {
  const [mode, setMode] = useState<Mode>('drawing');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Drawing state
  const [drawingState, setDrawingState] = useState<DrawingState>({
    tool: 'brush',
    color: '#ff6b6b',
    size: 5,
    isDrawing: false
  });

  // Animation state
  const [frames, setFrames] = useState<AnimationFrame[]>([
    { id: 1, canvas: '', duration: 500 }
  ]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Music state
  const [musicNotes, setMusicNotes] = useState<MusicNote[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentInstrument, setCurrentInstrument] = useState('piano');
  const [musicScale, setMusicScale] = useState(['C', 'D', 'E', 'F', 'G', 'A', 'B']);

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#10ac84', '#ee5a24', '#000000', '#ffffff', '#95a5a6'
  ];

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'brush', name: 'Brush', icon: '🖌️' },
    { id: 'eraser', name: 'Eraser', icon: '🧹' },
    { id: 'fill', name: 'Fill', icon: '🪣' },
    { id: 'line', name: 'Line', icon: '📏' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'text', name: 'Text', icon: '📝' }
  ];

  const instruments = [
    { id: 'piano', name: 'Piano', icon: '🎹' },
    { id: 'guitar', name: 'Guitar', icon: '🎸' },
    { id: 'drums', name: 'Drums', icon: '🥁' },
    { id: 'flute', name: 'Flute', icon: '🎵' }
  ];

  const playSound = useCallback((note: string, instrument: string = 'piano') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Note frequencies
    const noteFreq: { [key: string]: number } = {
      'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
      'G': 392.00, 'A': 440.00, 'B': 493.88
    };
    
    oscillator.frequency.setValueAtTime(noteFreq[note] || 440, audioContext.currentTime);
    
    // Instrument simulation
    switch (instrument) {
      case 'piano':
        oscillator.type = 'triangle';
        break;
      case 'guitar':
        oscillator.type = 'sawtooth';
        break;
      case 'drums':
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.type = 'square';
        break;
      case 'flute':
        oscillator.type = 'sine';
        break;
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, [soundEnabled]);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    setIsDrawing(true);
    
    ctx.lineWidth = drawingState.size;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = drawingState.tool === 'eraser' ? 'destination-out' : 'source-over';
    
    if (drawingState.tool === 'brush' || drawingState.tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    ctx.strokeStyle = drawingState.color;
    
    if (drawingState.tool === 'brush' || drawingState.tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveCurrentFrame();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCurrentFrame();
  };

  const saveCurrentFrame = () => {
    if (mode !== 'animation') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    setFrames(prev => 
      prev.map((frame, index) => 
        index === currentFrame 
          ? { ...frame, canvas: dataURL }
          : frame
      )
    );
  };

  const addFrame = () => {
    const newFrame: AnimationFrame = {
      id: frames.length + 1,
      canvas: '',
      duration: animationSpeed
    };
    setFrames(prev => [...prev, newFrame]);
    setCurrentFrame(frames.length);
  };

  const deleteFrame = (index: number) => {
    if (frames.length <= 1) return;
    
    setFrames(prev => prev.filter((_, i) => i !== index));
    setCurrentFrame(Math.max(0, currentFrame - 1));
  };

  const playAnimation = () => {
    if (frames.length <= 1) return;
    
    setIsPlaying(true);
    let frameIndex = 0;
    
    const animateFrame = () => {
      const frame = frames[frameIndex];
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      
      if (canvas && ctx && frame.canvas) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = frame.canvas;
      }
      
      frameIndex = (frameIndex + 1) % frames.length;
      
      setTimeout(() => {
        if (isPlaying) {
          animateFrame();
        }
      }, frame.duration);
    };
    
    animateFrame();
  };

  const stopAnimation = () => {
    setIsPlaying(false);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `creative-studio-${mode}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const playNote = (note: string) => {
    playSound(note, currentInstrument);
    
    if (isRecording) {
      const newNote: MusicNote = {
        note,
        time: Date.now(),
        duration: 500,
        instrument: currentInstrument
      };
      setMusicNotes(prev => [...prev, newNote]);
    }
  };

  const playMelody = () => {
    musicNotes.forEach((note, index) => {
      setTimeout(() => {
        playSound(note.note, note.instrument);
      }, index * 300);
    });
  };

  const clearMelody = () => {
    setMusicNotes([]);
  };

  const renderDrawingMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Tools */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-lg">Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {tools.map(tool => (
              <Button
                key={tool.id}
                onClick={() => setDrawingState(prev => ({ ...prev, tool: tool.id }))}
                variant={drawingState.tool === tool.id ? 'default' : 'outline'}
                className="h-12 text-xs"
              >
                <div className="text-center">
                  <div>{tool.icon}</div>
                  <div>{tool.name}</div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Size: {drawingState.size}px</label>
            <Slider
              value={[drawingState.size]}
              onValueChange={([value]) => setDrawingState(prev => ({ ...prev, size: value }))}
              min={1}
              max={50}
              step={1}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Colors</label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setDrawingState(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded border-2 ${
                    drawingState.color === color ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={clearCanvas} variant="outline" size="sm">
              <RotateCcw size={16} className="mr-1" />
              Clear
            </Button>
            <Button onClick={downloadCanvas} variant="outline" size="sm">
              <Download size={16} className="mr-1" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <div className="lg:col-span-3">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle>Drawing Canvas</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="border border-gray-300 rounded cursor-crosshair w-full max-w-full h-auto"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnimationMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Animation Controls */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-lg">Animation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={isPlaying ? stopAnimation : playAnimation} size="sm">
              {isPlaying ? '⏹️' : '▶️'} {isPlaying ? 'Stop' : 'Play'}
            </Button>
            <Button onClick={addFrame} variant="outline" size="sm">
              <Layers size={16} className="mr-1" />
              Add Frame
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Speed: {animationSpeed}ms</label>
            <Slider
              value={[animationSpeed]}
              onValueChange={([value]) => setAnimationSpeed(value)}
              min={100}
              max={2000}
              step={100}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Frames</label>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`flex items-center justify-between p-2 rounded border ${
                    index === currentFrame ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => setCurrentFrame(index)}
                    className="text-sm font-medium"
                  >
                    Frame {index + 1}
                  </button>
                  {frames.length > 1 && (
                    <Button
                      onClick={() => deleteFrame(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drawing tools for animation */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-lg">Drawing Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {tools.slice(0, 4).map(tool => (
              <Button
                key={tool.id}
                onClick={() => setDrawingState(prev => ({ ...prev, tool: tool.id }))}
                variant={drawingState.tool === tool.id ? 'default' : 'outline'}
                className="h-12 text-xs"
              >
                <div className="text-center">
                  <div>{tool.icon}</div>
                  <div>{tool.name}</div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-5 gap-1">
            {colors.slice(0, 10).map(color => (
              <button
                key={color}
                onClick={() => setDrawingState(prev => ({ ...prev, color }))}
                className={`w-6 h-6 rounded border ${
                  drawingState.color === color ? 'border-black border-2' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          <Button onClick={clearCanvas} variant="outline" size="sm" className="w-full">
            Clear Frame
          </Button>
        </CardContent>
      </Card>

      {/* Canvas */}
      <div className="lg:col-span-2">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle>Animation Canvas - Frame {currentFrame + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border border-gray-300 rounded cursor-crosshair w-full max-w-full h-auto"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMusicMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Instruments */}
      <Card className="bg-white/95">
        <CardHeader>
          <CardTitle className="text-lg">Instruments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {instruments.map(instrument => (
              <Button
                key={instrument.id}
                onClick={() => setCurrentInstrument(instrument.id)}
                variant={currentInstrument === instrument.id ? 'default' : 'outline'}
                className="h-16 text-xs"
              >
                <div className="text-center">
                  <div className="text-2xl">{instrument.icon}</div>
                  <div>{instrument.name}</div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={() => setIsRecording(!isRecording)}
              variant={isRecording ? 'destructive' : 'default'}
              className="w-full"
            >
              {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
            </Button>
            
            <Button onClick={playMelody} variant="outline" className="w-full">
              ▶️ Play Melody
            </Button>
            
            <Button onClick={clearMelody} variant="outline" className="w-full">
              🗑️ Clear Melody
            </Button>
          </div>
          
          {musicNotes.length > 0 && (
            <div className="text-sm">
              <div className="font-medium mb-1">Recorded Notes: {musicNotes.length}</div>
              <div className="text-xs text-gray-600">
                {musicNotes.slice(-5).map((note, index) => (
                  <span key={index} className="mr-2">
                    {note.note}({note.instrument})
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Piano */}
      <div className="lg:col-span-2">
        <Card className="bg-white/95">
          <CardHeader>
            <CardTitle>Virtual Piano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Piano keys */}
              <div className="flex justify-center">
                <div className="flex">
                  {musicScale.map(note => (
                    <button
                      key={note}
                      onClick={() => playNote(note)}
                      className="w-12 h-32 bg-white border border-gray-400 hover:bg-gray-100 active:bg-gray-200 flex items-end justify-center pb-2 text-sm font-bold shadow-inner"
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Note display */}
              <div className="bg-gray-100 rounded p-4 min-h-[100px]">
                <div className="text-sm font-medium mb-2">Sheet Music Preview:</div>
                <div className="flex flex-wrap gap-1">
                  {musicNotes.slice(-20).map((note, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {note.note}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Rhythm section */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Drum Beats:</div>
                <div className="flex gap-2">
                  {['Kick', 'Snare', 'Hi-Hat', 'Crash'].map(drum => (
                    <Button
                      key={drum}
                      onClick={() => playNote('C')}
                      variant="outline"
                      size="sm"
                    >
                      {drum}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/20 text-white border-white/30">
            ← Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">🎨 Creative Studio</h1>
            <p className="text-white/90">Draw, animate, and create music</p>
          </div>
          
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="outline"
            className="bg-white/20 text-white border-white/30"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </Button>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={() => setMode('drawing')}
            variant={mode === 'drawing' ? 'default' : 'outline'}
            className={mode === 'drawing' ? 'bg-white text-purple-600' : 'bg-white/20 text-white border-white/30'}
          >
            <Palette className="mr-2" size={20} />
            Drawing
          </Button>
          <Button
            onClick={() => setMode('animation')}
            variant={mode === 'animation' ? 'default' : 'outline'}
            className={mode === 'animation' ? 'bg-white text-purple-600' : 'bg-white/20 text-white border-white/30'}
          >
            <Layers className="mr-2" size={20} />
            Animation
          </Button>
          <Button
            onClick={() => setMode('music')}
            variant={mode === 'music' ? 'default' : 'outline'}
            className={mode === 'music' ? 'bg-white text-purple-600' : 'bg-white/20 text-white border-white/30'}
          >
            <Music className="mr-2" size={20} />
            Music
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {mode === 'drawing' && renderDrawingMode()}
          {mode === 'animation' && renderAnimationMode()}
          {mode === 'music' && renderMusicMode()}
        </div>
      </div>
    </div>
  );
};

export default CreativeStudio;