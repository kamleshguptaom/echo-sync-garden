
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionManager } from './QuestionManager';
import { ThemeCustomizer } from './ThemeCustomizer';
import { MediaManager } from './MediaManager';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-700 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🔧 Admin Dashboard</h1>
            <p className="text-white/80">Manage games, content, and customization</p>
          </div>
          <Button onClick={onBack} variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            ← Back to Games
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="questions" className="data-[state=active]:bg-white/20">
              📝 Question Manager
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-white/20">
              🎨 Media Manager
            </TabsTrigger>
            <TabsTrigger value="themes" className="data-[state=active]:bg-white/20">
              🌈 Theme Customizer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <QuestionManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaManager />
          </TabsContent>

          <TabsContent value="themes">
            <ThemeCustomizer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
