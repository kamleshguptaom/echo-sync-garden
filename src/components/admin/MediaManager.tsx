
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MediaItem {
  id: string;
  name: string;
  type: 'emoji' | 'image' | 'animation';
  content: string;
  category: string;
  description: string;
}

export const MediaManager: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: '1', name: 'Victory', type: 'emoji', content: '🏆', category: 'celebration', description: 'Victory trophy' },
    { id: '2', name: 'Thinking', type: 'emoji', content: '🤔', category: 'actions', description: 'Thinking face' },
    { id: '3', name: 'Success', type: 'animation', content: 'animate-bounce', category: 'celebration', description: 'Bounce animation' }
  ]);

  const [newMedia, setNewMedia] = useState<Partial<MediaItem>>({
    name: '',
    type: 'emoji',
    content: '',
    category: '',
    description: ''
  });

  const addMediaItem = () => {
    if (newMedia.name && newMedia.content) {
      const item: MediaItem = {
        id: Date.now().toString(),
        name: newMedia.name,
        type: newMedia.type || 'emoji',
        content: newMedia.content,
        category: newMedia.category || 'general',
        description: newMedia.description || ''
      };
      
      setMediaItems([...mediaItems, item]);
      setNewMedia({
        name: '',
        type: 'emoji',
        content: '',
        category: '',
        description: ''
      });
    }
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  const getPreview = (item: MediaItem) => {
    switch (item.type) {
      case 'emoji':
        return <span className="text-3xl">{item.content}</span>;
      case 'animation':
        return <div className={`w-8 h-8 bg-blue-500 rounded ${item.content}`}>📦</div>;
      case 'image':
        return <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center text-xs">IMG</div>;
      default:
        return <div className="w-8 h-8 bg-gray-400 rounded"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Media Form */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">🎨 Add New Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Name</Label>
              <Input
                placeholder="Media name..."
                value={newMedia.name}
                onChange={(e) => setNewMedia({ ...newMedia, name: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white">Type</Label>
              <select
                value={newMedia.type}
                onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as 'emoji' | 'image' | 'animation' })}
                className="w-full p-2 bg-white/20 border border-white/30 rounded text-white"
              >
                <option value="emoji">Emoji</option>
                <option value="image">Image URL</option>
                <option value="animation">CSS Animation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Content</Label>
              <Input
                placeholder={
                  newMedia.type === 'emoji' ? '🎉' :
                  newMedia.type === 'image' ? 'https://example.com/image.png' :
                  'animate-bounce'
                }
                value={newMedia.content}
                onChange={(e) => setNewMedia({ ...newMedia, content: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label className="text-white">Category</Label>
              <Input
                placeholder="celebration, actions, etc..."
                value={newMedia.category}
                onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Description</Label>
            <Textarea
              placeholder="Describe the media item..."
              value={newMedia.description}
              onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
          </div>

          <Button onClick={addMediaItem} className="bg-purple-500 hover:bg-purple-600 text-white">
            🎨 Add Media
          </Button>
        </CardContent>
      </Card>

      {/* Media Library */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">📁 Media Library ({mediaItems.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {mediaItems.map((item) => (
              <div key={item.id} className="bg-white/20 p-4 rounded-lg border border-white/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getPreview(item)}
                    <div>
                      <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                      <span className="text-white/70 text-xs">{item.type}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteMediaItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1"
                  >
                    🗑️
                  </Button>
                </div>
                <p className="text-white/80 text-xs mb-1">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">{item.category}</span>
                  <code className="text-white/80 text-xs bg-black/20 px-2 py-1 rounded">{item.content}</code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
