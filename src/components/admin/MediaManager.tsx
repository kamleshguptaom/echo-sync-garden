
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaForm } from './MediaManager/MediaForm';
import { MediaLibrary } from './MediaManager/MediaLibrary';
import { GameCreator } from './MediaManager/GameCreator';

interface MediaItem {
  id: string;
  name: string;
  type: 'emoji' | 'image' | 'animation' | 'video' | 'audio' | 'interactive' | '3d-model' | 'ar-content' | 'vr-content';
  content: string;
  category: string;
  description: string;
  subject: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  educationalValue: string;
  usage: string;
  duration?: number;
  size?: string;
  accessibility: string;
  learningOutcome: string;
  ageGroup: string;
  interactivityLevel: string;
  cognitiveLoad: string;
  prerequisites: string[];
}

interface GameTemplate {
  id: string;
  name: string;
  type: 'quiz' | 'memory' | 'puzzle' | 'matching' | 'sorting' | 'drawing' | 'interactive';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: string;
  subject: string;
  learningObjectives: string[];
  gameRules: string;
  scoringSystem: string;
  timeLimit: number;
  maxPlayers: number;
  features: string[];
  assets: string[];
  instructions: string;
}

export const MediaManager: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { 
      id: '1', 
      name: 'Victory Trophy', 
      type: 'emoji', 
      content: '🏆', 
      category: 'celebration', 
      description: 'Victory trophy for achievements',
      subject: 'General',
      tags: ['celebration', 'achievement', 'success'],
      difficulty: 'easy',
      educationalValue: 'Positive reinforcement for learning',
      usage: 'Reward systems, completion badges',
      accessibility: 'High contrast, universal symbol',
      learningOutcome: 'Motivates continued learning',
      ageGroup: '3-5 years',
      interactivityLevel: 'Static',
      cognitiveLoad: 'Low',
      prerequisites: []
    },
    { 
      id: '2', 
      name: 'Thinking Process', 
      type: 'emoji', 
      content: '🤔', 
      category: 'actions', 
      description: 'Thinking face for reflection',
      subject: 'Psychology',
      tags: ['thinking', 'reflection', 'process'],
      difficulty: 'medium',
      educationalValue: 'Encourages critical thinking',
      usage: 'Question prompts, pause moments',
      accessibility: 'Clear facial expression',
      learningOutcome: 'Develops metacognitive awareness',
      ageGroup: '6-8 years',
      interactivityLevel: 'Low',
      cognitiveLoad: 'Medium',
      prerequisites: []
    }
  ]);

  const [gameTemplates, setGameTemplates] = useState<GameTemplate[]>([]);

  const [newMedia, setNewMedia] = useState<Partial<MediaItem>>({
    name: '',
    type: 'emoji',
    content: '',
    category: '',
    description: '',
    subject: '',
    tags: [],
    difficulty: 'easy',
    educationalValue: '',
    usage: '',
    accessibility: '',
    learningOutcome: '',
    ageGroup: '',
    interactivityLevel: '',
    cognitiveLoad: '',
    prerequisites: []
  });

  const [newTag, setNewTag] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  const addMediaItem = () => {
    if (newMedia.name && newMedia.content) {
      const item: MediaItem = {
        id: Date.now().toString(),
        name: newMedia.name,
        type: newMedia.type || 'emoji',
        content: newMedia.content,
        category: newMedia.category || 'general',
        description: newMedia.description || '',
        subject: newMedia.subject || 'General',
        tags: newMedia.tags || [],
        difficulty: newMedia.difficulty || 'easy',
        educationalValue: newMedia.educationalValue || '',
        usage: newMedia.usage || '',
        accessibility: newMedia.accessibility || '',
        learningOutcome: newMedia.learningOutcome || '',
        ageGroup: newMedia.ageGroup || '',
        interactivityLevel: newMedia.interactivityLevel || '',
        cognitiveLoad: newMedia.cognitiveLoad || '',
        prerequisites: newMedia.prerequisites || []
      };
      
      setMediaItems([...mediaItems, item]);
      setNewMedia({
        name: '',
        type: 'emoji',
        content: '',
        category: '',
        description: '',
        subject: '',
        tags: [],
        difficulty: 'easy',
        educationalValue: '',
        usage: '',
        accessibility: '',
        learningOutcome: '',
        ageGroup: '',
        interactivityLevel: '',
        cognitiveLoad: '',
        prerequisites: []
      });
    }
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !newMedia.tags?.includes(newTag.trim())) {
      setNewMedia({ 
        ...newMedia, 
        tags: [...(newMedia.tags || []), newTag.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewMedia({ 
      ...newMedia, 
      tags: newMedia.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleCreateGame = (game: GameTemplate) => {
    setGameTemplates([...gameTemplates, game]);
  };

  return (
    <Tabs defaultValue="media" className="space-y-8">
      <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm p-2 rounded-xl">
        <TabsTrigger value="media" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-400 data-[state=active]:text-white">
          🎨 Media Assets
        </TabsTrigger>
        <TabsTrigger value="games" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white">
          🎮 Game Creator
        </TabsTrigger>
        <TabsTrigger value="library" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-teal-400 data-[state=active]:text-white">
          📚 Content Library
        </TabsTrigger>
      </TabsList>

      <TabsContent value="media" className="space-y-8">
        <MediaForm
          media={newMedia}
          onMediaChange={setNewMedia}
          onSubmit={addMediaItem}
          newTag={newTag}
          onNewTagChange={setNewTag}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />

        <MediaLibrary
          mediaItems={mediaItems}
          onDeleteItem={deleteMediaItem}
          filterType={filterType}
          filterCategory={filterCategory}
          filterSubject={filterSubject}
          onFilterTypeChange={setFilterType}
          onFilterCategoryChange={setFilterCategory}
          onFilterSubjectChange={setFilterSubject}
        />
      </TabsContent>

      <TabsContent value="games">
        <GameCreator onCreateGame={handleCreateGame} />
        
        {gameTemplates.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">🎮 Your Created Games ({gameTemplates.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameTemplates.map((game) => (
                <div key={game.id} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-purple-700">{game.name}</h3>
                    <span className="text-2xl">
                      {game.type === 'quiz' && '📝'}
                      {game.type === 'memory' && '🧠'}
                      {game.type === 'puzzle' && '🧩'}
                      {game.type === 'matching' && '🔗'}
                      {game.type === 'sorting' && '📊'}
                      {game.type === 'drawing' && '🎨'}
                      {game.type === 'interactive' && '⚡'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{game.description}</p>
                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      game.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {game.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                      {game.subject}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Max Players: {game.maxPlayers}</p>
                    <p>Time Limit: {Math.floor(game.timeLimit / 60)}m {game.timeLimit % 60}s</p>
                    <p>Features: {game.features.length}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="library">
        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border-2 border-green-200">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-4">📚 Integrated Content Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 p-4 rounded-lg">
              <h3 className="font-bold text-green-600 mb-2">📝 Questions Created: {/* questions count would go here */}</h3>
              <p className="text-sm text-gray-600">Interactive questions with hints, explanations, and learning objectives</p>
            </div>
            <div className="bg-white/80 p-4 rounded-lg">
              <h3 className="font-bold text-orange-600 mb-2">🎨 Media Assets: {mediaItems.length}</h3>
              <p className="text-sm text-gray-600">Rich multimedia content for enhanced learning experiences</p>
            </div>
            <div className="bg-white/80 p-4 rounded-lg">
              <h3 className="font-bold text-purple-600 mb-2">🎮 Game Templates: {gameTemplates.length}</h3>
              <p className="text-sm text-gray-600">Custom learning games with rules, features, and objectives</p>
            </div>
            <div className="bg-white/80 p-4 rounded-lg">
              <h3 className="font-bold text-blue-600 mb-2">🔗 Integration Ready</h3>
              <p className="text-sm text-gray-600">All content can be seamlessly integrated into learning experiences</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
