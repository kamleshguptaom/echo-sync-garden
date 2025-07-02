
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionManager } from './QuestionManager';
import { MediaManager } from './MediaManager';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-6">
      <style>{`
        .admin-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border-radius: 16px;
        }
        .admin-tab {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #4a5568;
          transition: all 0.3s ease;
          border-radius: 12px;
          font-weight: 600;
        }
        .admin-tab:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .admin-tab[data-state="active"] {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🎓 Educational Content Manager
            </h1>
            <p className="text-gray-700 text-xl font-medium">
              Create interactive questions and rich media content for enhanced learning
            </p>
          </div>
          <Button 
            onClick={onBack} 
            variant="outline" 
            className="bg-white/80 border-gray-300 text-gray-700 hover:bg-white hover:scale-105 transition-all duration-300 font-semibold shadow-lg"
          >
            ← Back to Games
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 admin-card p-3 gap-3">
            <TabsTrigger value="questions" className="admin-tab">
              📚 Questions & Learning Studio
            </TabsTrigger>
            <TabsTrigger value="media" className="admin-tab">
              🎨 Advanced Media Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <QuestionManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
