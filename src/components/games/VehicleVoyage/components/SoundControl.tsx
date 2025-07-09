import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoundControlProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SoundControl: React.FC<SoundControlProps> = ({
  soundEnabled,
  onToggleSound
}) => {
  return (
    <Button
      onClick={onToggleSound}
      variant="outline"
      size="sm"
      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
    >
      {soundEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </Button>
  );
};