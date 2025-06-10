
import React from 'react';

interface ConceptVisualProps {
  concept: {
    emoji: string;
    visual: string;
    explanation: string;
    example: string;
  };
  isVisible: boolean;
}

export const ConceptVisual: React.FC<ConceptVisualProps> = ({ concept, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl border-2 border-blue-200 mb-4 animate-fade-in">
      <div className="text-center mb-2">
        <span className="text-4xl">{concept.emoji}</span>
      </div>
      <div className="text-center mb-2">
        <span className="text-lg font-mono bg-white px-3 py-1 rounded-lg shadow-sm">
          {concept.visual}
        </span>
      </div>
      <p className="text-sm text-blue-800 text-center font-medium mb-1">
        {concept.explanation}
      </p>
      <p className="text-xs text-blue-600 text-center italic">
        {concept.example}
      </p>
    </div>
  );
};
