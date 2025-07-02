
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface GameCreatorProps {
  onCreateGame: (game: GameTemplate) => void;
}

export const GameCreator: React.FC<GameCreatorProps> = ({ onCreateGame }) => {
  const [newGame, setNewGame] = useState<Partial<GameTemplate>>({
    name: '',
    type: 'quiz',
    description: '',
    difficulty: 'easy',
    ageGroup: '',
    subject: '',
    learningObjectives: [],
    gameRules: '',
    scoringSystem: '',
    timeLimit: 300,
    maxPlayers: 1,
    features: [],
    assets: [],
    instructions: ''
  });

  const [newObjective, setNewObjective] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newAsset, setNewAsset] = useState('');

  const gameTypes = [
    { value: 'quiz', label: '📝 Quiz Game', description: 'Question and answer based games' },
    { value: 'memory', label: '🧠 Memory Game', description: 'Card matching and memorization' },
    { value: 'puzzle', label: '🧩 Puzzle Game', description: 'Problem solving and logic puzzles' },
    { value: 'matching', label: '🔗 Matching Game', description: 'Connect related items' },
    { value: 'sorting', label: '📊 Sorting Game', description: 'Categorize and organize items' },
    { value: 'drawing', label: '🎨 Drawing Game', description: 'Creative drawing and design' },
    { value: 'interactive', label: '⚡ Interactive Game', description: 'Dynamic interaction games' }
  ];

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Music', 'General'];
  const ageGroups = ['3-5 years', '6-8 years', '9-11 years', '12-14 years', '15-17 years', '18+ years'];

  const addObjective = () => {
    if (newObjective.trim()) {
      setNewGame({ 
        ...newGame, 
        learningObjectives: [...(newGame.learningObjectives || []), newObjective.trim()] 
      });
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    const updated = newGame.learningObjectives?.filter((_, i) => i !== index) || [];
    setNewGame({ ...newGame, learningObjectives: updated });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setNewGame({ 
        ...newGame, 
        features: [...(newGame.features || []), newFeature.trim()] 
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updated = newGame.features?.filter((_, i) => i !== index) || [];
    setNewGame({ ...newGame, features: updated });
  };

  const addAsset = () => {
    if (newAsset.trim()) {
      setNewGame({ 
        ...newGame, 
        assets: [...(newGame.assets || []), newAsset.trim()] 
      });
      setNewAsset('');
    }
  };

  const removeAsset = (index: number) => {
    const updated = newGame.assets?.filter((_, i) => i !== index) || [];
    setNewGame({ ...newGame, assets: updated });
  };

  const handleCreateGame = () => {
    if (newGame.name && newGame.type) {
      const game: GameTemplate = {
        id: Date.now().toString(),
        name: newGame.name,
        type: newGame.type as any,
        description: newGame.description || '',
        difficulty: newGame.difficulty || 'easy',
        ageGroup: newGame.ageGroup || '',
        subject: newGame.subject || 'General',
        learningObjectives: newGame.learningObjectives || [],
        gameRules: newGame.gameRules || '',
        scoringSystem: newGame.scoringSystem || '',
        timeLimit: newGame.timeLimit || 300,
        maxPlayers: newGame.maxPlayers || 1,
        features: newGame.features || [],
        assets: newGame.assets || [],
        instructions: newGame.instructions || ''
      };
      
      onCreateGame(game);
      
      // Reset form
      setNewGame({
        name: '',
        type: 'quiz',
        description: '',
        difficulty: 'easy',
        ageGroup: '',
        subject: '',
        learningObjectives: [],
        gameRules: '',
        scoringSystem: '',
        timeLimit: 300,
        maxPlayers: 1,
        features: [],
        assets: [],
        instructions: ''
      });
    }
  };

  const selectedGameType = gameTypes.find(type => type.value === newGame.type);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-300 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          🎮 Learning Game Creator
          <span className="text-lg animate-pulse">🚀</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">🎯 Setup</TabsTrigger>
            <TabsTrigger value="rules">📋 Rules</TabsTrigger>
            <TabsTrigger value="features">⭐ Features</TabsTrigger>
            <TabsTrigger value="assets">🎨 Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label className="text-purple-700 font-semibold">Game Name *</Label>
                <Input
                  placeholder="Enter game name..."
                  value={newGame.name || ''}
                  onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                  className="bg-white/80 border-purple-200"
                />
              </div>
              <div>
                <Label className="text-purple-700 font-semibold">Game Type *</Label>
                <Select value={newGame.type || 'quiz'} onValueChange={(value) => setNewGame({ ...newGame, type: value as any })}>
                  <SelectTrigger className="bg-white/80 border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedGameType && (
              <div className="bg-purple-100 p-4 rounded-lg border border-purple-300">
                <p className="text-purple-700 font-medium">{selectedGameType.description}</p>
              </div>
            )}

            <div>
              <Label className="text-purple-700 font-semibold">Description</Label>
              <Textarea
                placeholder="Describe what this game is about and how it helps learning..."
                value={newGame.description || ''}
                onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                className="bg-white/80 border-purple-200"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-purple-700 font-semibold">Subject</Label>
                <Select value={newGame.subject || ''} onValueChange={(value) => setNewGame({ ...newGame, subject: value })}>
                  <SelectTrigger className="bg-white/80 border-purple-200">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-purple-700 font-semibold">Difficulty</Label>
                <Select value={newGame.difficulty || 'easy'} onValueChange={(value) => setNewGame({ ...newGame, difficulty: value as any })}>
                  <SelectTrigger className="bg-white/80 border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🟢 Easy</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="hard">🔴 Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-purple-700 font-semibold">Age Group</Label>
                <Select value={newGame.ageGroup || ''} onValueChange={(value) => setNewGame({ ...newGame, ageGroup: value })}>
                  <SelectTrigger className="bg-white/80 border-purple-200">
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map(age => (
                      <SelectItem key={age} value={age}>{age}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-purple-700 font-semibold">Max Players</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={newGame.maxPlayers || 1}
                  onChange={(e) => setNewGame({ ...newGame, maxPlayers: parseInt(e.target.value) || 1 })}
                  className="bg-white/80 border-purple-200"
                />
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Label className="text-purple-700 font-semibold mb-3 block">Learning Objectives</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add learning objective..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="bg-white border-blue-300"
                  onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                />
                <Button onClick={addObjective} className="bg-blue-500 hover:bg-blue-600">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newGame.learningObjectives?.map((objective, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-blue-100 text-blue-700 cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeObjective(index)}
                  >
                    {objective} ×
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <div>
              <Label className="text-purple-700 font-semibold">Game Rules</Label>
              <Textarea
                placeholder="Explain how the game is played, what players need to do..."
                value={newGame.gameRules || ''}
                onChange={(e) => setNewGame({ ...newGame, gameRules: e.target.value })}
                className="bg-white/80 border-purple-200 h-32"
              />
            </div>

            <div>
              <Label className="text-purple-700 font-semibold">Scoring System</Label>
              <Textarea
                placeholder="How are points awarded? What determines the winner?"
                value={newGame.scoringSystem || ''}
                onChange={(e) => setNewGame({ ...newGame, scoringSystem: e.target.value })}
                className="bg-white/80 border-purple-200 h-24"
              />
            </div>

            <div>
              <Label className="text-purple-700 font-semibold">Instructions for Players</Label>
              <Textarea
                placeholder="Step-by-step instructions that players will see..."
                value={newGame.instructions || ''}
                onChange={(e) => setNewGame({ ...newGame, instructions: e.target.value })}
                className="bg-white/80 border-purple-200 h-32"
              />
            </div>

            <div>
              <Label className="text-purple-700 font-semibold">Time Limit (seconds)</Label>
              <Input
                type="number"
                min="30"
                max="3600"
                value={newGame.timeLimit || 300}
                onChange={(e) => setNewGame({ ...newGame, timeLimit: parseInt(e.target.value) || 300 })}
                className="bg-white/80 border-purple-200"
              />
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label className="text-purple-700 font-semibold mb-3 block">Game Features</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add game feature (e.g., 'Multiple choice questions', 'Timer', 'Hints'...)"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="bg-white border-green-300"
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button onClick={addFeature} className="bg-green-500 hover:bg-green-600">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newGame.features?.map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-green-100 text-green-700 cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeFeature(index)}
                  >
                    {feature} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-purple-700 mb-2">Suggested Features by Game Type:</h3>
                {newGame.type === 'quiz' && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Multiple choice questions</li>
                    <li>• True/False questions</li>
                    <li>• Timed responses</li>
                    <li>• Progress tracking</li>
                    <li>• Hint system</li>
                  </ul>
                )}
                {newGame.type === 'memory' && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Card flipping animation</li>
                    <li>• Different difficulty levels</li>
                    <li>• Score multipliers</li>
                    <li>• Sound effects</li>
                    <li>• Theme customization</li>
                  </ul>
                )}
                {newGame.type === 'puzzle' && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Drag and drop pieces</li>
                    <li>• Auto-snap functionality</li>
                    <li>• Piece rotation</li>
                    <li>• Preview image</li>
                    <li>• Completion celebration</li>
                  </ul>
                )}
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-purple-700 mb-2">Enhancement Ideas:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Leaderboards</li>
                  <li>• Achievement badges</li>
                  <li>• Power-ups</li>
                  <li>• Multiplayer support</li>
                  <li>• Custom themes</li>
                  <li>• Progress saving</li>
                  <li>• Statistics tracking</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <Label className="text-purple-700 font-semibold mb-3 block">Required Assets</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add asset (e.g., 'Background music', 'Card images', 'Sound effects'...)"
                  value={newAsset}
                  onChange={(e) => setNewAsset(e.target.value)}
                  className="bg-white border-pink-300"
                  onKeyPress={(e) => e.key === 'Enter' && addAsset()}
                />
                <Button onClick={addAsset} className="bg-pink-500 hover:bg-pink-600">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newGame.assets?.map((asset, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-pink-100 text-pink-700 cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeAsset(index)}
                  >
                    {asset} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Visual Assets</h4>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Background images</li>
                  <li>• Character sprites</li>
                  <li>• UI elements</li>
                  <li>• Icons and buttons</li>
                  <li>• Animations</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Audio Assets</h4>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Background music</li>
                  <li>• Sound effects</li>
                  <li>• Voice narration</li>
                  <li>• Feedback sounds</li>
                  <li>• Ambient sounds</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">Data Assets</h4>
                <ul className="text-xs text-orange-600 space-y-1">
                  <li>• Question databases</li>
                  <li>• Answer keys</li>
                  <li>• Game configurations</li>
                  <li>• Progress data</li>
                  <li>• User preferences</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-6 border-t border-purple-200 mt-6">
          <Button 
            onClick={handleCreateGame} 
            disabled={!newGame.name || !newGame.type}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎮 Create Learning Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
