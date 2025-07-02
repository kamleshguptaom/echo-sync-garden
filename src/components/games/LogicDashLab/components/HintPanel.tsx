
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameItem } from '../types';

interface HintPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  currentItems: GameItem[];
}

export const HintPanel: React.FC<HintPanelProps> = ({ isVisible, onToggle, currentItems }) => {
  const getHintMessage = () => {
    const goodItems = currentItems.filter(item => item.isHealthy);
    const badItems = currentItems.filter(item => !item.isHealthy);
    
    // Determine the category context
    const categories = [...new Set(currentItems.map(item => item.category))];
    const mainCategory = categories[0];
    
    let contextHint = '';
    let goodLabel = 'Keep these';
    let badLabel = 'Put these aside';
    
    switch (mainCategory) {
      case 'fruit':
      case 'vegetable':
      case 'dairy':
      case 'protein':
        contextHint = 'Sort healthy foods from junk foods!';
        goodLabel = '🥗 Healthy foods (put in basket)';
        badLabel = '🗑️ Junk foods (put in bin)';
        break;
      case 'school':
        contextHint = 'Pack items needed for school!';
        goodLabel = '🎒 School items (put in backpack)';
        badLabel = '🏠 Leave at home (put aside)';
        break;
      case 'sports':
        contextHint = 'Get ready for sports day!';
        goodLabel = '🏃 Sports items (put in bag)';
        badLabel = '🚫 Not for sports (put aside)';
        break;
      case 'hygiene':
        contextHint = 'Prepare for your morning routine!';
        goodLabel = '🧼 Hygiene items (put in bathroom bag)';
        badLabel = '🚫 Not for hygiene (put aside)';
        break;
      case 'bedtime':
        contextHint = 'Get ready for a good night\'s sleep!';
        goodLabel = '😴 Bedtime items (keep for sleep)';
        badLabel = '📵 Distractions (put away)';
        break;
      case 'recyclable':
        contextHint = 'Help save the environment!';
        goodLabel = '♻️ Recyclable items (put in recycle bin)';
        badLabel = '🗑️ Regular trash (put in waste bin)';
        break;
      case 'shape':
        contextHint = 'Find the correct shapes!';
        goodLabel = '🔺 Correct shapes (keep these)';
        badLabel = '❌ Wrong shapes (put aside)';
        break;
      default:
        contextHint = 'Sort the items correctly!';
        goodLabel = '✅ Correct items (keep these)';
        badLabel = '❌ Wrong items (put aside)';
    }
    
    return {
      context: contextHint,
      good: goodItems.map(item => `${item.emoji} ${item.name}`).join(', '),
      bad: badItems.map(item => `${item.emoji} ${item.name}`).join(', '),
      goodLabel,
      badLabel
    };
  };

  const hints = getHintMessage();

  return (
    <div className="mb-4">
      <Button
        onClick={onToggle}
        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-2 px-4 rounded-lg mb-3 w-full"
      >
        💡 {isVisible ? 'Hide' : 'Show'} Hints
      </Button>

      {isVisible && (
        <Card className="bg-yellow-50 border-2 border-yellow-300">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <h4 className="font-bold text-yellow-800 mb-2">🎯 What to do:</h4>
                <p className="text-sm text-yellow-700 font-medium">
                  {hints.context}
                </p>
              </div>
              
              {hints.good && (
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">{hints.goodLabel}:</h4>
                  <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                    {hints.good}
                  </p>
                </div>
              )}
              
              {hints.bad && (
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">{hints.badLabel}:</h4>
                  <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                    {hints.bad}
                  </p>
                </div>
              )}
              
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">
                  💡 Tip: Drag each item to the correct zone. Green means correct, red means try again!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
