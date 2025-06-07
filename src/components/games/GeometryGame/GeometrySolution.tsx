
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GeometrySolutionProps {
  answer: number;
  explanation: string;
  steps: string[];
  visualElements?: {
    shape: string;
    measurements: { [key: string]: number };
    formula: string;
  };
  isVisible: boolean;
}

export const GeometrySolution: React.FC<GeometrySolutionProps> = ({ 
  answer, 
  explanation, 
  steps, 
  visualElements,
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <Card className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 animate-fade-in">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-purple-700 mb-4 animate-scale-in">
          📐 Solution & Visual Explanation
        </h3>
        
        {/* Answer Display */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-lg font-semibold text-blue-600 mb-2">Answer:</div>
          <div className="text-3xl font-bold text-green-600">{answer}</div>
        </div>

        {/* Visual Representation */}
        {visualElements && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-lg font-semibold text-gray-700 mb-3">Visual Representation:</div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                {/* Shape visualization based on type */}
                {visualElements.shape === 'triangle' && (
                  <svg width="200" height="150" className="animate-fade-in">
                    <polygon 
                      points="100,20 20,130 180,130" 
                      fill="rgba(59, 130, 246, 0.3)" 
                      stroke="#3B82F6" 
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                    <text x="100" y="80" textAnchor="middle" className="text-sm font-bold fill-blue-600">
                      {visualElements.shape.toUpperCase()}
                    </text>
                  </svg>
                )}
                {visualElements.shape === 'rectangle' && (
                  <svg width="200" height="120" className="animate-fade-in">
                    <rect 
                      x="20" y="20" width="160" height="80" 
                      fill="rgba(16, 185, 129, 0.3)" 
                      stroke="#10B981" 
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                    <text x="100" y="65" textAnchor="middle" className="text-sm font-bold fill-green-600">
                      {visualElements.shape.toUpperCase()}
                    </text>
                  </svg>
                )}
                {visualElements.shape === 'circle' && (
                  <svg width="200" height="200" className="animate-fade-in">
                    <circle 
                      cx="100" cy="100" r="80" 
                      fill="rgba(168, 85, 247, 0.3)" 
                      stroke="#A855F7" 
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                    <text x="100" y="105" textAnchor="middle" className="text-sm font-bold fill-purple-600">
                      {visualElements.shape.toUpperCase()}
                    </text>
                  </svg>
                )}
              </div>
            </div>
            
            {/* Formula */}
            <div className="text-center p-3 bg-gray-50 rounded-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-sm text-gray-600 mb-1">Formula Used:</div>
              <div className="text-lg font-mono font-bold text-blue-600">{visualElements.formula}</div>
            </div>
          </div>
        )}
        
        {/* Step-by-step explanation */}
        <div className="space-y-3">
          <div className="text-lg font-semibold text-gray-700">Step-by-step solution:</div>
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm animate-slide-in-right"
              style={{ animationDelay: `${0.8 + (index * 0.2)}s` }}
            >
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="text-gray-700">{step}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="text-sm text-blue-700">
            📐 <strong>Geometry Tip:</strong> {explanation}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
