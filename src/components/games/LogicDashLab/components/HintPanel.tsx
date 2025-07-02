
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HintPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  currentItems: any[];
}

export const HintPanel: React.FC<HintPanelProps> = ({ isVisible, onToggle, currentItems }) => {
  const getHintMessage = () => {
    const healthyItems = currentItems.filter(item => item.isHealthy);
    const unhealthyItems = currentItems.filter(item => !item.isHealthy);
    
    return {
      healthy: healthyItems.map(item => item.name).join(', '),
      unhealthy: unhealthyItems.map(item => item.name).join(', ')
    };
  };

  const hints = getHintMessage();

  return (
    <div className="mb-4">
      <Button
        onClick={onToggle}
        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-2 px-4 rounded-lg mb-3"
      >
        💡 {isVisible ? 'Hide' : 'Show'} Hints
      </Button>

      {isVisible && (
        <Card className="bg-yellow-50 border-2 border-yellow-300">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">🥗 Healthy Foods (put in basket):</h4>
                <p className="text-sm text-yellow-700">
                  {hints.healthy || 'No healthy items in this level'}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">🗑️ Unhealthy Foods (put in bin):</h4>
                <p className="text-sm text-yellow-700">
                  {hints.unhealthy || 'No unhealthy items in this level'}
                </p>
              </div>
              
              <div className="bg-yellow-100 p-3 rounded">
                <p className="text-xs text-yellow-600 font-mono">
                  💡 Tip: Fruits and vegetables are usually healthy. Candies and junk food should go in the bin!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
