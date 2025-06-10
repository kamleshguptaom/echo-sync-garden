
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionManager } from './QuestionManager';
import { ThemeCustomizer } from './ThemeCustomizer';
import { MediaManager } from './MediaManager';
import { ContentLibrary } from './ContentLibrary';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 p-6">
      <style>{`
        .admin-card {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(25px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-radius: 20px;
        }
        .admin-tab {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1));
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-radius: 15px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .admin-tab:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }
        .admin-tab[data-state="active"] {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3));
          box-shadow: 0 8px 30px rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        .floating-shape {
          position: absolute;
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          33% { transform: translateY(-30px) rotate(120deg); opacity: 1; }
          66% { transform: translateY(-15px) rotate(240deg); opacity: 0.8; }
        }
        .sparkle {
          position: absolute;
          animation: sparkle 3s ease-in-out infinite;
          font-size: 1.5rem;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        .glow-effect {
          position: relative;
        }
        .glow-effect::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b, #eb4d4b, #6c5ce7);
          border-radius: 22px;
          z-index: -1;
          animation: rotate-gradient 3s linear infinite;
          filter: blur(8px);
        }
        @keyframes rotate-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="floating-elements">
        {/* Enhanced floating background elements */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="floating-shape"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${40 + Math.random() * 80}px`,
              height: `${40 + Math.random() * 80}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`
            }}
          />
        ))}
        
        {/* Enhanced sparkles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center glow-effect">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              🎨 Advanced Learning Hub
            </h1>
            <p className="text-white/95 text-xl drop-shadow-lg font-medium">
              Create, customize, and manage educational content with ease
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <span className="px-4 py-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full text-white text-sm font-semibold shadow-lg">📝 Questions</span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full text-white text-sm font-semibold shadow-lg">🎨 Media</span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full text-white text-sm font-semibold shadow-lg">🌈 Themes</span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-full text-white text-sm font-semibold shadow-lg">📚 Content</span>
            </div>
          </div>
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="bg-gradient-to-r from-white/30 to-white/20 border-white/40 text-white hover:from-white/40 hover:to-white/30 hover:scale-110 transition-all duration-300 backdrop-blur-sm font-semibold shadow-xl"
          >
            ← Back to Games
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 admin-card p-3 gap-3">
            <TabsTrigger value="questions" className="admin-tab">
              📝 Questions & Learning
            </TabsTrigger>
            <TabsTrigger value="media" className="admin-tab">
              🎨 Media Library
            </TabsTrigger>
            <TabsTrigger value="themes" className="admin-tab">
              🌈 Theme Studio
            </TabsTrigger>
            <TabsTrigger value="content" className="admin-tab">
              📚 Content Hub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="animate-fade-in">
            <QuestionManager />
          </TabsContent>

          <TabsContent value="media" className="animate-fade-in">
            <MediaManager />
          </TabsContent>

          <TabsContent value="themes" className="animate-fade-in">
            <ThemeCustomizer />
          </TabsContent>

          <TabsContent value="content" className="animate-fade-in">
            <ContentLibrary />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
