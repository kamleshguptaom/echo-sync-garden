import React, { useState } from 'react';
import { QuestionBuilder } from './QuestionManager/QuestionBuilder';
import { QuestionList } from './QuestionManager/QuestionList';
import { QuestionEdit } from './QuestionManager/QuestionEdit';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  emoji: string;
  points: number;
  subject: string;
  topic: string;
  concept: string;
  visualAid: string;
  animation: string;
  timeLimit: number;
  tags: string[];
  learningObjective: string;
  hints: string[];
  relatedTopics: string[];
  cognitiveLevel: string;
  ageGroup: string;
  prerequisites: string[];
}

export const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'What is the chemical symbol for water?',
      options: ['H2O', 'CO2', 'NaCl', 'O2'],
      correctAnswer: 0,
      explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.',
      category: 'chemistry',
      difficulty: 'easy',
      emoji: '💧',
      points: 10,
      subject: 'Science',
      topic: 'Chemistry',
      concept: 'Chemical Formulas',
      visualAid: 'molecule-diagram',
      animation: 'bounce',
      timeLimit: 30,
      tags: ['chemistry', 'molecules', 'basic'],
      learningObjective: 'Understand basic chemical formulas and molecular composition',
      hints: ['Think about the elements in water', 'Hydrogen and Oxygen combine'],
      relatedTopics: ['Molecular Structure', 'Chemical Bonds'],
      cognitiveLevel: 'Remember',
      ageGroup: '9-11 years',
      prerequisites: ['Basic Chemistry Knowledge']
    },
    {
      id: '2',
      question: 'What is 7 × 8?',
      options: ['54', '56', '48', '64'],
      correctAnswer: 1,
      explanation: '7 × 8 = 56. This is a basic multiplication fact.',
      category: 'arithmetic',
      difficulty: 'easy',
      emoji: '🔢',
      points: 5,
      subject: 'Mathematics',
      topic: 'Multiplication',
      concept: 'Times Tables',
      visualAid: 'grid-visualization',
      animation: 'fade',
      timeLimit: 20,
      tags: ['multiplication', 'arithmetic', 'basic'],
      learningObjective: 'Master multiplication tables up to 10',
      hints: ['Think of 8 × 7', 'Count by 7s eight times'],
      relatedTopics: ['Division', 'Number Patterns'],
      cognitiveLevel: 'Remember',
      ageGroup: '6-8 years',
      prerequisites: ['Basic Addition']
    }
  ]);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    category: '',
    difficulty: 'easy',
    emoji: '',
    points: 10,
    subject: '',
    topic: '',
    concept: '',
    visualAid: '',
    animation: 'none',
    timeLimit: 30,
    tags: [],
    learningObjective: '',
    hints: [],
    relatedTopics: [],
    cognitiveLevel: '',
    ageGroup: '',
    prerequisites: []
  });

  const [newTag, setNewTag] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options?.every(opt => opt.trim())) {
      const question: Question = {
        id: Date.now().toString(),
        question: newQuestion.question,
        options: newQuestion.options as string[],
        correctAnswer: newQuestion.correctAnswer || 0,
        explanation: newQuestion.explanation || '',
        category: newQuestion.category || 'general',
        difficulty: newQuestion.difficulty || 'easy',
        emoji: newQuestion.emoji || '❓',
        points: newQuestion.points || 10,
        subject: newQuestion.subject || 'General',
        topic: newQuestion.topic || '',
        concept: newQuestion.concept || '',
        visualAid: newQuestion.visualAid || 'none',
        animation: newQuestion.animation || 'none',
        timeLimit: newQuestion.timeLimit || 30,
        tags: newQuestion.tags || [],
        learningObjective: newQuestion.learningObjective || '',
        hints: newQuestion.hints || [],
        relatedTopics: newQuestion.relatedTopics || [],
        cognitiveLevel: newQuestion.cognitiveLevel || '',
        ageGroup: newQuestion.ageGroup || '',
        prerequisites: newQuestion.prerequisites || []
      };
      
      setQuestions([...questions, question]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        category: '',
        difficulty: 'easy',
        emoji: '',
        points: 10,
        subject: '',
        topic: '',
        concept: '',
        visualAid: '',
        animation: 'none',
        timeLimit: 30,
        tags: [],
        learningObjective: '',
        hints: [],
        relatedTopics: [],
        cognitiveLevel: '',
        ageGroup: '',
        prerequisites: []
      });
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const saveEditedQuestion = (editedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === editedQuestion.id ? editedQuestion : q));
    setEditingQuestion(null);
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
  };

  const addTag = () => {
    if (newTag.trim() && !newQuestion.tags?.includes(newTag.trim())) {
      setNewQuestion({ 
        ...newQuestion, 
        tags: [...(newQuestion.tags || []), newTag.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewQuestion({ 
      ...newQuestion, 
      tags: newQuestion.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  if (editingQuestion) {
    return (
      <QuestionEdit
        question={editingQuestion}
        onSave={saveEditedQuestion}
        onCancel={cancelEdit}
      />
    );
  }

  return (
    <div className="space-y-8">
      <QuestionBuilder
        question={newQuestion}
        onQuestionChange={setNewQuestion}
        onSubmit={addQuestion}
        newTag={newTag}
        onNewTagChange={setNewTag}
        onAddTag={addTag}
        onRemoveTag={removeTag}
      />

      <QuestionList
        questions={questions}
        onDeleteQuestion={deleteQuestion}
        onEditQuestion={editQuestion}
        filterSubject={filterSubject}
        filterDifficulty={filterDifficulty}
        onFilterSubjectChange={setFilterSubject}
        onFilterDifficultyChange={setFilterDifficulty}
      />
    </div>
  );
};
