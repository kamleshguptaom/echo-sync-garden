
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionManager } from './QuestionManager';
import { ThemeCustomizer } from './ThemeCustomizer';
import { MediaManager } from './MediaManager';
import { GameAnalytics } from './GameAnalytics';
import { UserManager } from './UserManager';
import { ContentLibrary } from './ContentLibrary';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-fuchsia-500 to-pink-500 p-6">
      <style>{`
        .admin-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .admin-tab {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          transition: all 0.3s ease;
        }
        .admin-tab:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .admin-tab[data-state="active"] {
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
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
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .sparkle {
          position: absolute;
          animation: sparkle 2s ease-in-out infinite;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="floating-elements">
        {/* Floating background elements */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-shape"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${30 + Math.random() * 50}px`,
              height: `${30 + Math.random() * 50}px`,
              background: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.1})`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Sparkles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle text-white text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
              🔧 Advanced Admin Dashboard
            </h1>
            <p className="text-white/90 text-lg drop-shadow">
              Complete control center for games, content, and customization
            </p>
            <div className="flex gap-2 justify-center mt-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">🎮 Game Manager</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">📊 Analytics</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">🎨 Customizer</span>
            </div>
          </div>
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            ← Back to Games
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 admin-card p-2 gap-2">
            <TabsTrigger value="questions" className="admin-tab">
              📝 Questions
            </TabsTrigger>
            <TabsTrigger value="media" className="admin-tab">
              🎨 Media
            </TabsTrigger>
            <TabsTrigger value="themes" className="admin-tab">
              🌈 Themes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="admin-tab">
              📊 Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="admin-tab">
              👥 Users
            </TabsTrigger>
            <TabsTrigger value="content" className="admin-tab">
              📚 Content
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

          <TabsContent value="analytics" className="animate-fade-in">
            <GameAnalytics />
          </TabsContent>

          <TabsContent value="users" className="animate-fade-in">
            <UserManager />
          </TabsContent>

          <TabsContent value="content" className="animate-fade-in">
            <ContentLibrary />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
