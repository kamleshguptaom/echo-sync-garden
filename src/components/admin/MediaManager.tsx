
import React, { useState } from 'react';
import { MediaForm } from './MediaManager/MediaForm';
import { MediaLibrary } from './MediaManager/MediaLibrary';

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

  return (
    <div className="space-y-8">
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
    </div>
  );
};
