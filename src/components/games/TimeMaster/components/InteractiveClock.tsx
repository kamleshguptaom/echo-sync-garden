import React, { useState } from 'react';

interface InteractiveClockProps {
  hour: number;
  minute: number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  size?: number;
  showNumbers?: boolean;
}

export const InteractiveClock: React.FC<InteractiveClockProps> = ({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  size = 240,
  showNumbers = true
}) => {
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null);

  const handleMouseDown = (e: React.MouseEvent, hand: 'hour' | 'minute') => {
    e.preventDefault();
    setDragging(hand);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    const angle = Math.atan2(y, x) * 180 / Math.PI + 90;
    const normalizedAngle = (angle + 360) % 360;
    
    if (dragging === 'hour') {
      const newHour = Math.round(normalizedAngle / 30) || 12;
      onHourChange(newHour > 12 ? newHour - 12 : newHour);
    } else if (dragging === 'minute') {
      const newMinute = Math.round(normalizedAngle / 6) * 5;
      onMinuteChange(newMinute % 60);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleClockClick = (e: React.MouseEvent) => {
    if (dragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    const angle = Math.atan2(y, x) * 180 / Math.PI + 90;
    const normalizedAngle = (angle + 360) % 360;
    
    // Determine if click is closer to hour or minute hand
    const distance = Math.sqrt(x * x + y * y);
    const hourHandLength = size * 0.3;
    const minuteHandLength = size * 0.4;
    
    if (distance < hourHandLength + 20) {
      // Clicked near hour hand
      const newHour = Math.round(normalizedAngle / 30) || 12;
      onHourChange(newHour > 12 ? newHour - 12 : newHour);
    } else if (distance < minuteHandLength + 20) {
      // Clicked near minute hand
      const newMinute = Math.round(normalizedAngle / 6) * 5;
      onMinuteChange(newMinute % 60);
    }
  };

  const getClockHandStyle = (value: number, isHour: boolean) => {
    const angle = isHour ? (value % 12) * 30 - 90 : value * 6 - 90;
    return {
      transform: `rotate(${angle}deg)`,
      transformOrigin: '50% 100%'
    };
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div 
        className="w-full h-full rounded-full border-8 border-gray-800 bg-white relative cursor-pointer shadow-2xl"
        onClick={handleClockClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Clock Numbers */}
        {showNumbers && [...Array(12)].map((_, i) => {
          const number = i + 1;
          const angle = (i * 30) - 90;
          const radius = size * 0.35;
          const x = Math.cos(angle * Math.PI / 180) * radius;
          const y = Math.sin(angle * Math.PI / 180) * radius;
          return (
            <div
              key={i}
              className="absolute text-2xl font-bold text-gray-800 select-none"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {number}
            </div>
          );
        })}
        
        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30;
          return (
            <div
              key={i}
              className="absolute w-1 bg-gray-600"
              style={{
                height: size * 0.08,
                left: '50%',
                top: size * 0.05,
                transformOrigin: `50% ${size * 0.45}px`,
                transform: `translateX(-50%) rotate(${angle}deg)`
              }}
            />
          );
        })}
        
        {/* Minute Markers */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 !== 0) {
            const angle = i * 6;
            return (
              <div
                key={i}
                className="absolute w-px bg-gray-400"
                style={{
                  height: size * 0.04,
                  left: '50%',
                  top: size * 0.05,
                  transformOrigin: `50% ${size * 0.45}px`,
                  transform: `translateX(-50%) rotate(${angle}deg)`
                }}
              />
            );
          }
          return null;
        })}
        
        {/* Hour Hand */}
        <div
          className={`absolute bg-black rounded-full z-10 cursor-grab ${dragging === 'hour' ? 'cursor-grabbing scale-110' : ''}`}
          style={{
            width: 6,
            height: size * 0.3,
            left: '50%',
            top: '50%',
            marginLeft: '-3px',
            marginTop: -size * 0.3,
            ...getClockHandStyle(hour + minute / 60, true)
          }}
          onMouseDown={(e) => handleMouseDown(e, 'hour')}
        />
        
        {/* Minute Hand */}
        <div
          className={`absolute bg-red-500 rounded-full z-10 cursor-grab ${dragging === 'minute' ? 'cursor-grabbing scale-110' : ''}`}
          style={{
            width: 4,
            height: size * 0.4,
            left: '50%',
            top: '50%',
            marginLeft: '-2px',
            marginTop: -size * 0.4,
            ...getClockHandStyle(minute, false)
          }}
          onMouseDown={(e) => handleMouseDown(e, 'minute')}
        />
        
        {/* Center dot */}
        <div 
          className="absolute w-4 h-4 bg-black rounded-full z-20" 
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }} 
        />
      </div>
      
      {/* Digital Display */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black text-green-400 font-mono text-2xl px-4 py-2 rounded">
        {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
      </div>
    </div>
  );
};