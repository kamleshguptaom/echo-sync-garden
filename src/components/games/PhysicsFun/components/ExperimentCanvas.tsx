import React, { useEffect, forwardRef } from 'react';

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

interface ExperimentCanvasProps {
  experiment: string;
  balls: Ball[];
  pendulums: Pendulum[];
  waveAmplitude: number;
  waveFrequency: number;
  wavePhase: number;
  gravity: number;
}

export const ExperimentCanvas = forwardRef<HTMLCanvasElement, ExperimentCanvasProps>(({
  experiment,
  balls,
  pendulums,
  waveAmplitude,
  waveFrequency,
  wavePhase,
  gravity
}, ref) => {
  useEffect(() => {
    draw();
  }, [experiment, balls, pendulums, waveAmplitude, waveFrequency, wavePhase, gravity]);

  const draw = () => {
    const canvas = ref as React.RefObject<HTMLCanvasElement>;
    if (!canvas.current) return;
    
    const ctx = canvas.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.current.height);
    gradient.addColorStop(0, '#f0f9ff');
    gradient.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    
    switch (experiment) {
      case 'gravity':
      case 'collision':
      case 'projectile':
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
      case 'springs':
        drawSpringsExperiment(ctx);
        break;
      case 'optics':
        drawOpticsExperiment(ctx);
        break;
    }
  };

  const drawGravityExperiment = (ctx: CanvasRenderingContext2D) => {
    // Draw balls with improved graphics
    balls.forEach(ball => {
      // Shadow
      ctx.beginPath();
      ctx.arc(ball.x + 2, ball.y + 2, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fill();
      
      // Ball with gradient
      const gradient = ctx.createRadialGradient(
        ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, 0,
        ball.x, ball.y, ball.radius
      );
      gradient.addColorStop(0, ball.color);
      gradient.addColorStop(1, '#333');
      
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Velocity vector
      if (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) {
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x + ball.vx * 3, ball.y + ball.vy * 3);
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Arrow head
        const angle = Math.atan2(ball.vy, ball.vx);
        const headlen = 8;
        ctx.beginPath();
        ctx.moveTo(ball.x + ball.vx * 3, ball.y + ball.vy * 3);
        ctx.lineTo(
          ball.x + ball.vx * 3 - headlen * Math.cos(angle - Math.PI / 6),
          ball.y + ball.vy * 3 - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(ball.x + ball.vx * 3, ball.y + ball.vy * 3);
        ctx.lineTo(
          ball.x + ball.vx * 3 - headlen * Math.cos(angle + Math.PI / 6),
          ball.y + ball.vy * 3 - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
      
      // Ball info
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(`m=${ball.mass.toFixed(1)}`, ball.x - 15, ball.y + ball.radius + 15);
    });
    
    // Physics info
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Gravity: ${gravity.toFixed(1)} m/s²`, 10, 30);
    
    if (experiment === 'projectile') {
      ctx.fillText('Projectile Motion', 10, 50);
      // Draw trajectory prediction
      if (balls.length > 0) {
        const ball = balls[0];
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        
        for (let t = 0; t < 5; t += 0.1) {
          const x = ball.x + ball.vx * t * 60;
          const y = ball.y + (ball.vy * t + 0.5 * gravity * t * t) * 60;
          
          if (t === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          
          if (y > ctx.canvas.height) break;
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  };

  const drawPendulumExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = 50;
    
    pendulums.forEach((pendulum, index) => {
      const offsetX = index * 150 - 75;
      const bobX = centerX + offsetX + pendulum.length * Math.sin(pendulum.angle);
      const bobY = centerY + pendulum.length * Math.cos(pendulum.angle);
      
      // Draw string
      ctx.beginPath();
      ctx.moveTo(centerX + offsetX, centerY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw pivot
      ctx.beginPath();
      ctx.arc(centerX + offsetX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#666';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw bob with gradient
      const bobRadius = 15 * pendulum.mass;
      const gradient = ctx.createRadialGradient(
        bobX - bobRadius * 0.3, bobY - bobRadius * 0.3, 0,
        bobX, bobY, bobRadius
      );
      gradient.addColorStop(0, index === 0 ? '#ff6b6b' : '#4ecdc4');
      gradient.addColorStop(1, '#333');
      
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw motion trail
      ctx.strokeStyle = `rgba(${index === 0 ? '255, 107, 107' : '78, 205, 196'}, 0.3)`;
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(centerX + offsetX, centerY, pendulum.length, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    
    // Energy information
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Pendulum Motion - Energy Conservation', 10, ctx.canvas.height - 60);
    ctx.font = '14px Arial';
    ctx.fillText('Potential ⇌ Kinetic Energy', 10, ctx.canvas.height - 40);
    ctx.fillText('Period = 2π√(L/g)', 10, ctx.canvas.height - 20);
  };

  const drawWaveExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerY = ctx.canvas.height / 2;
    
    // Draw primary wave
    ctx.beginPath();
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 4;
    
    for (let x = 0; x < ctx.canvas.width; x++) {
      const y = centerY + waveAmplitude * Math.sin((x * 0.02 * waveFrequency) + wavePhase);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw secondary wave for interference
    ctx.beginPath();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 3;
    
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
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Wave properties
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Wave Motion`, 10, 30);
    ctx.font = '14px Arial';
    ctx.fillText(`Amplitude: ${waveAmplitude}px`, 10, 50);
    ctx.fillText(`Frequency: ${waveFrequency.toFixed(1)} Hz`, 10, 70);
    ctx.fillText(`Wavelength: λ = v/f`, 10, 90);
  };

  const drawCircuitExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Draw battery
    ctx.fillStyle = '#333';
    ctx.fillRect(centerX - 100, centerY - 15, 30, 30);
    ctx.fillStyle = '#666';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('+', centerX - 90, centerY + 5);
    ctx.fillText('−', centerX - 110, centerY + 5);
    
    // Draw resistor with zigzag pattern
    ctx.beginPath();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 6;
    ctx.moveTo(centerX - 50, centerY);
    
    for (let i = 0; i < 8; i++) {
      const x = centerX - 40 + i * 10;
      const y = centerY + (i % 2 === 0 ? -15 : 15);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(centerX + 50, centerY);
    ctx.stroke();
    
    // Draw connecting wires
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.moveTo(centerX - 70, centerY);
    ctx.lineTo(centerX - 50, centerY);
    ctx.moveTo(centerX + 50, centerY);
    ctx.lineTo(centerX + 100, centerY);
    ctx.lineTo(centerX + 100, centerY + 80);
    ctx.lineTo(centerX - 100, centerY + 80);
    ctx.lineTo(centerX - 100, centerY);
    ctx.stroke();
    
    // Animated current flow
    const time = Date.now() / 1000;
    for (let i = 0; i < 12; i++) {
      const progress = (time * 0.5 + i * 0.2) % 4;
      let x, y;
      
      if (progress < 1) {
        x = centerX - 100 + progress * 200;
        y = centerY;
      } else if (progress < 2) {
        x = centerX + 100;
        y = centerY + (progress - 1) * 80;
      } else if (progress < 3) {
        x = centerX + 100 - (progress - 2) * 200;
        y = centerY + 80;
      } else {
        x = centerX - 100;
        y = centerY + 80 - (progress - 3) * 80;
      }
      
      // Glowing current particles
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
      gradient.addColorStop(0, '#ffeb3b');
      gradient.addColorStop(1, 'rgba(255, 235, 59, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Circuit information
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Electric Circuit', 10, 30);
    ctx.font = '14px Arial';
    ctx.fillText('Current Flow: I = V/R', 10, 50);
    ctx.fillText('Ohm\'s Law: V = IR', 10, 70);
  };

  const drawMagnetismExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Draw magnet with 3D effect
    const gradient1 = ctx.createLinearGradient(centerX - 50, centerY - 30, centerX - 10, centerY + 30);
    gradient1.addColorStop(0, '#ff8a80');
    gradient1.addColorStop(1, '#d32f2f');
    
    const gradient2 = ctx.createLinearGradient(centerX + 10, centerY - 30, centerX + 50, centerY + 30);
    gradient2.addColorStop(0, '#81c784');
    gradient2.addColorStop(1, '#388e3c');
    
    // North pole
    ctx.fillStyle = gradient1;
    ctx.fillRect(centerX - 50, centerY - 30, 40, 60);
    
    // South pole
    ctx.fillStyle = gradient2;
    ctx.fillRect(centerX + 10, centerY - 30, 40, 60);
    
    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('N', centerX - 35, centerY + 5);
    ctx.fillText('S', centerX + 25, centerY + 5);
    
    // Magnetic field lines with animation
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    
    const time = Date.now() / 2000;
    
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const startRadius = 80;
      const endRadius = 150;
      
      ctx.beginPath();
      ctx.strokeStyle = `hsl(${(angle * 180 / Math.PI + time * 50) % 360}, 50%, 50%)`;
      
      for (let r = startRadius; r <= endRadius; r += 3) {
        const fieldAngle = angle + Math.sin(r * 0.03 + time) * 0.4;
        const x = centerX + Math.cos(fieldAngle) * r;
        const y = centerY + Math.sin(fieldAngle) * r * 0.8;
        
        if (r === startRadius) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Field direction indicators
      const arrowAngle = angle + Math.sin(120 * 0.03 + time) * 0.4;
      const arrowX = centerX + Math.cos(arrowAngle) * 120;
      const arrowY = centerY + Math.sin(arrowAngle) * 120 * 0.8;
      
      ctx.beginPath();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - 8 * Math.cos(arrowAngle - 0.3),
        arrowY - 8 * Math.sin(arrowAngle - 0.3)
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - 8 * Math.cos(arrowAngle + 0.3),
        arrowY - 8 * Math.sin(arrowAngle + 0.3)
      );
      ctx.stroke();
    }
    
    // Information
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Magnetic Field Lines', 10, 30);
    ctx.font = '14px Arial';
    ctx.fillText('Force: F = qvB sin θ', 10, 50);
    ctx.fillText('Like poles repel, unlike attract', 10, 70);
  };

  const drawSpringsExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const baseY = ctx.canvas.height - 100;
    const time = Date.now() / 1000;
    
    // Spring oscillation
    const displacement = 30 * Math.sin(time * 2);
    const springLength = 150 + displacement;
    
    // Draw spring
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const coils = 12;
    for (let i = 0; i <= coils * 10; i++) {
      const t = i / (coils * 10);
      const x = centerX + 15 * Math.sin(t * coils * Math.PI * 2);
      const y = baseY - t * springLength;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw mass
    const massY = baseY - springLength - 20;
    const gradient = ctx.createRadialGradient(centerX - 10, massY - 10, 0, centerX, massY, 25);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#d32f2f');
    
    ctx.beginPath();
    ctx.arc(centerX, massY, 25, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw equilibrium line
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX - 50, baseY - 150);
    ctx.lineTo(centerX + 50, baseY - 150);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Information
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Spring Oscillation', 10, 30);
    ctx.font = '14px Arial';
    ctx.fillText('Hooke\'s Law: F = -kx', 10, 50);
    ctx.fillText(`Displacement: ${displacement.toFixed(1)}cm`, 10, 70);
    ctx.fillText('Energy: E = ½kx² + ½mv²', 10, 90);
  };

  const drawOpticsExperiment = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Draw light source
    const gradient = ctx.createRadialGradient(100, centerY, 0, 100, centerY, 30);
    gradient.addColorStop(0, '#ffeb3b');
    gradient.addColorStop(1, 'rgba(255, 235, 59, 0)');
    
    ctx.beginPath();
    ctx.arc(100, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw prism
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 50);
    ctx.lineTo(centerX - 43, centerY + 25);
    ctx.lineTo(centerX + 43, centerY + 25);
    ctx.closePath();
    ctx.fillStyle = 'rgba(200, 200, 255, 0.7)';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw light rays
    const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0000ff', '#4000ff', '#8000ff'];
    const time = Date.now() / 3000;
    
    // Incident ray
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, centerY);
    ctx.lineTo(centerX - 20, centerY);
    ctx.stroke();
    
    // Refracted rays (spectrum)
    colors.forEach((color, index) => {
      const angle = (index - 3) * 0.1 + time * 0.5;
      const startX = centerX + 20;
      const startY = centerY;
      const endX = startX + 150 * Math.cos(angle);
      const endY = startY + 150 * Math.sin(angle);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    });
    
    // Information
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Light Refraction & Dispersion', 10, 30);
    ctx.font = '14px Arial';
    ctx.fillText('Snell\'s Law: n₁sin θ₁ = n₂sin θ₂', 10, 50);
    ctx.fillText('White light → Spectrum', 10, 70);
  };

  return (
    <div className="relative">
      <canvas
        ref={ref}
        width={600}
        height={400}
        className="border border-border rounded-lg bg-background max-w-full h-auto"
        style={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );
});

ExperimentCanvas.displayName = 'ExperimentCanvas';