
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HowToPlayDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayDialog: React.FC<HowToPlayDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            How to Play Logic Dash Lab
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">1️⃣</span>
              <div>
                <h4 className="font-semibold">Look at the Items</h4>
                <p className="text-sm text-gray-600">You'll see different food items on the screen</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">2️⃣</span>
              <div>
                <h4 className="font-semibold">Drag & Drop</h4>
                <p className="text-sm text-gray-600">Drag healthy foods to the 🥗 basket and unhealthy foods to the 🗑️ bin</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">3️⃣</span>
              <div>
                <h4 className="font-semibold">Use Hints</h4>
                <p className="text-sm text-gray-600">Click the 💡 hint button if you need help!</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">4️⃣</span>
              <div>
                <h4 className="font-semibold">Learn & Win</h4>
                <p className="text-sm text-gray-600">Sort all items correctly to complete the level!</p>
              </div>
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full bg-purple-500 hover:bg-purple-600">
            Got it! Let's Play 🎯
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
