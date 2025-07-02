
import React from 'react';

export const InfoSection: React.FC = () => {
  return (
    <div className="text-center mt-12 p-8 bg-gradient-to-r from-white/10 to-white/20 rounded-xl backdrop-blur animate-fade-in">
      <h3 className="text-2xl font-bold text-white mb-4">🧠 Comprehensive Brain Training</h3>
      <div className="grid md:grid-cols-4 gap-6 text-white/90">
        <div>
          <div className="text-4xl mb-2">🎯</div>
          <h4 className="font-bold mb-2">Cognitive Skills</h4>
          <p className="text-sm">Memory, attention, and processing speed</p>
        </div>
        <div>
          <div className="text-4xl mb-2">📚</div>
          <h4 className="font-bold mb-2">Academic Skills</h4>
          <p className="text-sm">Math, language, science, and more</p>
        </div>
        <div>
          <div className="text-4xl mb-2">🧩</div>
          <h4 className="font-bold mb-2">Problem Solving</h4>
          <p className="text-sm">Logic, critical thinking, and creativity</p>
        </div>
        <div>
          <div className="text-4xl mb-2">🏆</div>
          <h4 className="font-bold mb-2">Achievement</h4>
          <p className="text-sm">Track progress and celebrate success</p>
        </div>
      </div>
    </div>
  );
};
