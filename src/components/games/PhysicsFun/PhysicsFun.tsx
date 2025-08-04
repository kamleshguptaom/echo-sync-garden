import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface PhysicsFunProps {
  onBack: () => void;
}

type ExperimentType = 'gravity' | 'pendulum' | 'collision' | 'waves' | 'circuit' | 'magnetism';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  id: string;
}

interface Pendulum {
  angle: number;
  angularVelocity: number;
  length: number;
  mass: number;
}

export const PhysicsFun: React.FC<PhysicsFunProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [currentExperiment, setCurrentExperiment] = useState<ExperimentType>('gravity');
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gravity, setGravity] = useState(9.8);
  const [restitution, setRestitution] = useState(0.8);
  const [friction, setFriction] = useState(0.02);
  
  // Gravity experiment
  const [balls, setBalls] = useState<Ball[]>([]);
  
  // Pendulum experiment
  const [pendulums, setPendulums] = useState<Pendulum[]>([]);
  
  // Wave experiment
  const [waveAmplitude, setWaveAmplitude] = useState(50);
  const [waveFrequency, setWaveFrequency] = useState(1);
  const [wavePhase, setWavePhase] = useState(0);
  
  const experiments = [
    { id: 'gravity', name: 'Gravity & Motion', icon: '🪨', description: 'Explore gravity and projectile motion' },
    { id: 'pendulum', name: 'Pendulum', icon: '⚖️', description: 'Study pendulum motion and energy' },
    { id: 'collision', name: 'Collisions', icon: '💥', description: 'Analyze elastic and inelastic collisions' },
    { id: 'waves', name: 'Wave Motion', icon: '🌊', description: 'Visualize wave properties and interference' },
    { id: 'circuit', name: 'Electric Circuit', icon: '⚡', description: 'Build and test electrical circuits' },
    { id: 'magnetism', name: 'Magnetism', icon: '🧲', description: 'Explore magnetic fields and forces' }
  ];

  const playSound = useCallback((frequency: number, duration: number = 0.1) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [soundEnabled]);

  const initializeExperiment = useCallback(() => {
    switch (currentExperiment) {
      case 'gravity':
        setBalls([
          {
            id: '1',
            x: 100,
            y: 50,
            vx: 5,
            vy: 0,
            radius: 10,
            mass: 1,
            color: '#ff6b6b'
          },
          {
            id: '2',
            x: 200,
            y: 80,
            vx: 3,
            vy: 2,
            radius: 15,
            mass: 2,
            color: '#4ecdc4'
          }
        ]);
        break;
        
      case 'pendulum':
        setPendulums([
          { angle: Math.PI / 4, angularVelocity: 0, length: 150, mass: 1 },
          { angle: -Math.PI / 6, angularVelocity: 0, length: 120, mass: 1.5 }
        ]);
        break;
        
      case 'waves':
        setWavePhase(0);
        break;
    }
  }, [currentExperiment]);

  useEffect(() => {
    initializeExperiment();
  }, [initializeExperiment]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        updatePhysics();
        draw();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentExperiment, balls, pendulums, gravity, restitution, friction]);

  const updatePhysics = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    switch (currentExperiment) {
      case 'gravity':
      case 'collision':
        setBalls(prevBalls => prevBalls.map(ball => {
          let newVx = ball.vx;
          let newVy = ball.vy + gravity * 0.01; // Apply gravity
          let newX = ball.x + newVx;
          let newY = ball.y + newVy;
          
          // Boundary collisions
          if (newX - ball.radius <= 0 || newX + ball.radius >= canvas.width) {
            newVx = -newVx * restitution;
            newX = ball.radius <= newX ? canvas.width - ball.radius : ball.radius;
            playSound(400, 0.05);
          }
          
          if (newY - ball.radius <= 0 || newY + ball.radius >= canvas.height) {
            newVy = -newVy * restitution;
            newY = ball.radius <= newY ? canvas.height - ball.radius : ball.radius;
            playSound(300, 0.05);
          }
          
          // Apply friction
          newVx *= (1 - friction);
          newVy *= (1 - friction);
          
          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        }));
        break;
        
      case 'pendulum':
        setPendulums(prevPendulums => prevPendulums.map(pendulum => {
          const angularAcceleration = -(gravity / pendulum.length) * Math.sin(pendulum.angle);
          const newAngularVelocity = pendulum.angularVelocity + angularAcceleration * 0.01;
          const newAngle = pendulum.angle + newAngularVelocity * 0.01;
          
          return {
            ...pendulum,
            angle: newAngle,
            angularVelocity: newAngularVelocity * 0.999 // Damping
          };
        }));
        break;
        
      case 'waves':
        setWavePhase(prev => prev + waveFrequency * 0.1);
        break;
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (currentExperiment) {
      case 'gravity':
      case 'collision':
        drawGravityExperiment(ctx);
        break;
      case 'pendulum':
        drawPendulumExperiment(ctx);
        break;
      case 'waves':
        drawWaveExperiment(ctx);
        break;
      case 'circuit':
        drawCircuitExperiment(ctx);
        break;
      case 'magnetism':
        drawMagnetismExperiment(ctx);
        break;
    }
  };

  const drawGravityExperiment = (ctx: CanvasRenderingContext2D) => {
    // Draw balls
    balls.forEach(ball => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw velocity vector
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(ball.x + ball.vx * 5, ball.y + ball.vy * 5);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Draw gravity indicator
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.fillText(`Gravity: ${gravity.toFixed(1)} m/s²`, 10, 30);
  };

  const drawPendulumExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = 50;
    
    pendulums.forEach((pendulum, index) => {
      const offsetX = index * 100 - 50;
      const bobX = centerX + offsetX + pendulum.length * Math.sin(pendulum.angle);
      const bobY = centerY + pendulum.length * Math.cos(pendulum.angle);
      
      // Draw string
      ctx.beginPath();
      ctx.moveTo(centerX + offsetX, centerY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw pivot
      ctx.beginPath();
      ctx.arc(centerX + offsetX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#666';
      ctx.fill();
      
      // Draw bob
      ctx.beginPath();
      ctx.arc(bobX, bobY, 15 * pendulum.mass, 0, Math.PI * 2);
      ctx.fillStyle = index === 0 ? '#ff6b6b' : '#4ecdc4';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Draw energy information
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('Energy is conserved in pendulum motion', 10, ctx.canvas.height - 20);
  };

  const drawWaveExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerY = ctx.canvas.height / 2;
    
    // Draw wave
    ctx.beginPath();
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 3;
    
    for (let x = 0; x < ctx.canvas.width; x++) {
      const y = centerY + waveAmplitude * Math.sin((x * 0.02 * waveFrequency) + wavePhase);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw interference pattern
    ctx.beginPath();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    
    for (let x = 0; x < ctx.canvas.width; x++) {
      const y1 = centerY + waveAmplitude * 0.7 * Math.sin((x * 0.015 * waveFrequency) + wavePhase);
      const y2 = centerY + waveAmplitude * 0.7 * Math.sin((x * 0.025 * waveFrequency) + wavePhase * 1.2);
      const interference = (y1 + y2) / 2;
      
      if (x === 0) {
        ctx.moveTo(x, interference);
      } else {
        ctx.lineTo(x, interference);
      }
    }
    ctx.stroke();
    
    // Draw center line
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(ctx.canvas.width, centerY);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Wave properties
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText(`Amplitude: ${waveAmplitude}px`, 10, 30);
    ctx.fillText(`Frequency: ${waveFrequency.toFixed(1)} Hz`, 10, 50);
  };

  const drawCircuitExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Draw battery
    ctx.fillStyle = '#333';
    ctx.fillRect(centerX - 100, centerY - 10, 20, 20);
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('+', centerX - 95, centerY + 5);
    
    // Draw resistor
    ctx.beginPath();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 4;
    ctx.moveTo(centerX - 50, centerY);
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(centerX - 30 + i * 10, centerY + (i % 2 === 0 ? -10 : 10));
    }
    ctx.lineTo(centerX + 50, centerY);
    ctx.stroke();
    
    // Draw connecting wires
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.moveTo(centerX - 80, centerY);
    ctx.lineTo(centerX - 50, centerY);
    ctx.moveTo(centerX + 50, centerY);
    ctx.lineTo(centerX + 80, centerY);
    ctx.lineTo(centerX + 80, centerY + 50);
    ctx.lineTo(centerX - 80, centerY + 50);
    ctx.lineTo(centerX - 80, centerY);
    ctx.stroke();
    
    // Draw current flow animation
    const time = Date.now() / 1000;
    for (let i = 0; i < 8; i++) {
      const progress = (time + i * 0.3) % 2;
      let x, y;
      
      if (progress < 0.5) {
        x = centerX - 80 + progress * 160 * 2;
        y = centerY;
      } else {
        x = centerX + 80;
        y = centerY + (progress - 0.5) * 100 * 2;
      }
      
      if (progress >= 1) {
        x = centerX + 80 - (progress - 1) * 160 * 2;
        y = centerY + 50;
      }
      
      if (progress >= 1.5) {
        x = centerX - 80;
        y = centerY + 50 - (progress - 1.5) * 100 * 2;
      }
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffeb3b';
      ctx.fill();
    }
    
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('Electric Current Flow', 10, 30);
  };

  const drawMagnetismExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Draw magnet
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(centerX - 50, centerY - 20, 40, 40);
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(centerX + 10, centerY - 20, 40, 40);
    
    // Draw N and S labels
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('N', centerX - 35, centerY + 5);
    ctx.fillText('S', centerX + 25, centerY + 5);
    
    // Draw magnetic field lines
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const startRadius = 60;
      const endRadius = 120;
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * startRadius,
        centerY + Math.sin(angle) * startRadius
      );
      
      // Create curved field lines
      for (let r = startRadius; r <= endRadius; r += 5) {
        const fieldAngle = angle + Math.sin(r * 0.05) * 0.3;
        ctx.lineTo(
          centerX + Math.cos(fieldAngle) * r,
          centerY + Math.sin(fieldAngle) * r
        );
      }
      ctx.stroke();
      
      // Draw field direction arrows
      const arrowAngle = angle + Math.sin(90 * 0.05) * 0.3;
      const arrowX = centerX + Math.cos(arrowAngle) * 90;
      const arrowY = centerY + Math.sin(arrowAngle) * 90;
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - 5 * Math.cos(arrowAngle - 0.3),
        arrowY - 5 * Math.sin(arrowAngle - 0.3)
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - 5 * Math.cos(arrowAngle + 0.3),
        arrowY - 5 * Math.sin(arrowAngle + 0.3)
      );
      ctx.stroke();
    }
    
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('Magnetic Field Lines', 10, 30);
  };

  const resetExperiment = () => {
    setIsPlaying(false);
    initializeExperiment();
  };

  const addBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newBall: Ball = {
      id: Date.now().toString(),
      x: Math.random() * (canvas.width - 40) + 20,
      y: Math.random() * 100 + 20,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 5,
      radius: Math.random() * 10 + 5,
      mass: Math.random() * 2 + 0.5,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };
    
    setBalls(prev => [...prev, newBall]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2 animate-pulse">
            ⚛️ Physics Fun Lab
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Experiment Selection */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🧪 Physics Experiments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {experiments.map(experiment => (
                <div
                  key={experiment.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                    currentExperiment === experiment.id
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 shadow-lg'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border-2 border-transparent'
                  }`}
                  onClick={() => {
                    setCurrentExperiment(experiment.id as ExperimentType);
                    setIsPlaying(false);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg animate-bounce">{experiment.icon}</span>
                    <span className="font-medium text-sm">{experiment.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{experiment.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Canvas */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  🔬 Interactive Physics Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-4 border-gradient-to-r from-blue-300 to-purple-300 rounded-xl overflow-hidden mb-4 shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="block w-full h-auto bg-gradient-to-br from-blue-50 to-purple-50"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`${isPlaying 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    } text-white shadow-lg hover:scale-105 transition-all duration-200`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button 
                    onClick={resetExperiment} 
                    variant="outline"
                    className="hover:scale-105 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  {(currentExperiment === 'gravity' || currentExperiment === 'collision') && (
                    <Button 
                      onClick={addBall} 
                      variant="outline"
                      className="hover:scale-105 transition-all duration-200 bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200"
                    >
                      ➕ Add Ball
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">⚙️ Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(currentExperiment === 'gravity' || currentExperiment === 'collision' || currentExperiment === 'pendulum') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gravity: {gravity.toFixed(1)} m/s²
                  </label>
                  <Slider
                    value={[gravity]}
                    onValueChange={(value) => setGravity(value[0])}
                    max={20}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}

              {(currentExperiment === 'gravity' || currentExperiment === 'collision') && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bounce: {(restitution * 100).toFixed(0)}%
                    </label>
                    <Slider
                      value={[restitution]}
                      onValueChange={(value) => setRestitution(value[0])}
                      max={1}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Friction: {(friction * 100).toFixed(1)}%
                    </label>
                    <Slider
                      value={[friction]}
                      onValueChange={(value) => setFriction(value[0])}
                      max={0.1}
                      min={0}
                      step={0.001}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {currentExperiment === 'waves' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amplitude: {waveAmplitude}px
                    </label>
                    <Slider
                      value={[waveAmplitude]}
                      onValueChange={(value) => setWaveAmplitude(value[0])}
                      max={100}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Frequency: {waveFrequency.toFixed(1)} Hz
                    </label>
                    <Slider
                      value={[waveFrequency]}
                      onValueChange={(value) => setWaveFrequency(value[0])}
                      max={5}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-1">📚 Learn</h4>
                <p className="text-sm text-blue-700">
                  {currentExperiment === 'gravity' && 'Objects fall at the same rate regardless of mass!'}
                  {currentExperiment === 'pendulum' && 'Pendulum period depends only on length and gravity.'}
                  {currentExperiment === 'collision' && 'Momentum is always conserved in collisions.'}
                  {currentExperiment === 'waves' && 'Waves transfer energy without transferring matter.'}
                  {currentExperiment === 'circuit' && 'Electric current flows from positive to negative.'}
                  {currentExperiment === 'magnetism' && 'Magnetic field lines show force direction.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};