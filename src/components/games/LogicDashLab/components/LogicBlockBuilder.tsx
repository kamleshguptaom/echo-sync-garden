
import React from 'react';
import { LogicBlock, GameRule } from '../types';

interface LogicBlockBuilderProps {
  rules: GameRule[];
  onRuleSelect: (rule: GameRule) => void;
  selectedRule: GameRule | null;
  showExplanation: boolean;
  onToggleExplanation: () => void;
}

export const LogicBlockBuilder: React.FC<LogicBlockBuilderProps> = ({
  rules,
  onRuleSelect,
  selectedRule,
  showExplanation,
  onToggleExplanation
}) => {
  return (
    <div className="bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold text-purple-800 mb-3">🧠 Logic Rules</h3>
      
      <div className="space-y-2 mb-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            onClick={() => onRuleSelect(rule)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all duration-200
              border-2 ${selectedRule?.id === rule.id 
                ? 'border-purple-500 bg-purple-100' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
            `}
          >
            <div className="font-semibold text-sm text-gray-800">
              {rule.condition}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              {rule.action}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onToggleExplanation}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        💡 {showExplanation ? 'Hide' : 'Show'} Hints
      </button>

      {showExplanation && selectedRule && (
        <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <div className="text-sm font-semibold text-yellow-800 mb-2">
            💡 Explanation:
          </div>
          <div className="text-sm text-yellow-700 mb-2">
            {selectedRule.explanation}
          </div>
          <div className="text-xs text-yellow-600 font-mono bg-yellow-100 p-2 rounded">
            Example: {selectedRule.example}
          </div>
        </div>
      )}
    </div>
  );
};
