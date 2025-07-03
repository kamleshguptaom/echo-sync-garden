
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Music, Play, Pause } from 'lucide-react';

interface RhythmMasterProps {
  onBack: () => void;
}

interface Beat {
  id: number;
  isActive: boolean;
  wasHit: boolean;
  timing: number;
}

export const RhythmMaster: React.FC<RhythmMasterProps> = ({ onBack }) => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Musical instruments with different sounds
  const instruments = [
    { name: 'Drum', emoji: '🥁', frequency: 80 },
    { name: 'Cymbal', emoji: '🥻', frequency: 1200 },
    { name: 'Bell', emoji: '🔔', frequency: 800 },
    { name: 'Triangle', emoji: '📐', frequency: 1000 }
  ];

  const [selectedInstrument, setSelectedInstrument] = useState(0);

  useEffect(() => {
    generateRhythmPattern();
    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [level]);

  const generateRhythmPattern = () => {
    const patternLength = Math.min(4 + level, 12);
    const pattern: Beat[] = [];
    
    for (let i = 0; i < patternLength; i++) {
      pattern.push({
        id: i,
        isActive: Math.random() > 0.4, // 60% chance of beat
        wasHit: false,
        timing: i * 500 // 500ms between beats
      });
    }
    
    setBeats(pattern);
    setCurrentBeat(0);
  };

  const playSound = (frequency: number, duration: number = 0.2) => {
    if (!audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Audio playback not available');
    }
  };

  const startRhythm = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentBeat(0);
    setBeats(prev => prev.map(beat => ({ ...beat, wasHit: false })));
    
    let beatIndex = 0;
    intervalRef.current = setInterval(() => {
      if (beatIndex >= beats.length) {
        endRhythm();
        return;
      }
      
      setCurrentBeat(beatIndex);
      
      // Play reference sound if beat is active
      if (beats[beatIndex]?.isActive) {
        playSound(instruments[selectedInstrument].frequency);
      }
      
      beatIndex++;
    }, 600);
  };

  const endRhythm = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Calculate score
    const activeBeats = beats.filter(beat => beat.isActive);
    const hitBeats = activeBeats.filter(beat => beat.wasHit);
    const accuracy = activeBeats.length > 0 ? (hitBeats.length / activeBeats.length) * 100 : 0;
    
    if (accuracy >= 80) {
      const points = Math.floor(accuracy / 10) * 5;
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setFeedback(`🎵 Great rhythm! ${accuracy.toFixed(0)}% accuracy!`);
      
      if (combo > 0 && combo % 3 === 2) {
        setLevel(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    } else {
      setCombo(0);
      setFeedback('Keep practicing! Try to match the rhythm exactly.');
    }
    
    setTimeout(() => {
      generateRhythmPattern();
      setFeedback('');
    }, 3000);
  };

  const hitBeat = () => {
    if (!isPlaying) return;
    
    playSound(instruments[selectedInstrument].frequency);
    
    // Check if this beat should be hit
    const currentBeatData = beats[currentBeat - 1]; // -1 because we just moved to next beat
    if (currentBeatData && currentBeatData.isActive && !currentBeatData.wasHit) {
      setBeats(prev => prev.map(beat => 
        beat.id === currentBeatData.id 
          ? { ...beat, wasHit: true }
          : beat
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} className="bg-white/20 hover:bg-white/30 text-white">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-white text-center flex items-center gap-2">
            🎵 Rhythm Master
          </h1>
          <div className="flex items-center gap-2 text-white">
            <Music className="w-6 h-6" />
            <span className="font-bold">Level {level}</span>
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold">Score: {score}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span className="font-bold">Combo: {combo}</span>
                </div>
              </div>
              <Progress value={(combo % 3) * 33.33} className="w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Instrument Selection */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-xl">Choose Your Instrument</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {instruments.map((instrument, index) => (
                <Button
                  key={instrument.name}
                  onClick={() => setSelectedInstrument(index)}
                  className={`p-4 text-2xl ${
                    selectedInstrument === index 
                      ? 'bg-purple-500 text-white scale-110' 
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  } transition-all`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-1">{instrument.emoji}</div>
                    <div className="text-sm">{instrument.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rhythm Pattern Display */}
        <Card className="mb-6 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-xl">Rhythm Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center gap-2 mb-6">
              {beats.map((beat, index) => (
                <div
                  key={beat.id}
                  className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-2xl transition-all ${
                    beat.isActive 
                      ? beat.wasHit 
                        ? 'bg-green-500 border-green-600 text-white' 
                        : 'bg-purple-500 border-purple-600 text-white'
                      : 'bg-gray-200 border-gray-300'
                  } ${
                    currentBeat === index && isPlaying ? 'scale-125 animate-pulse' : ''
                  }`}
                >
                  {beat.isActive ? instruments[selectedInstrument].emoji : ''}
                </div>
              ))}
            </div>
            
            <div className="text-center space-y-4">
              {!isPlaying ? (
                <Button
                  onClick={startRhythm}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 text-xl"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Rhythm
                </Button>
              ) : (
                <Button
                  onClick={hitBeat}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-6 text-2xl animate-pulse"
                >
                  🎵 HIT THE BEAT! 🎵
                </Button>
              )}
              
              <p className="text-gray-600">
                {!isPlaying 
                  ? 'Listen to the rhythm, then hit the beat button at the right times!'
                  : 'Tap the button when you see the highlighted beat!'
                }
              </p>
            </div>
            
            {feedback && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                feedback.includes('Great') ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                <p className="text-lg font-medium">{feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🎼</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">Level Up!</h3>
              <p className="text-xl text-gray-600">You're becoming a Rhythm Master!</p>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <Music key={i} className="w-8 h-8 text-purple-500 animate-bounce" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
