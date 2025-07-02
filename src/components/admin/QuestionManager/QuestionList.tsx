
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';

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

interface QuestionListProps {
  questions: Question[];
  onDeleteQuestion: (id: string) => void;
  onEditQuestion: (question: Question) => void;
  filterSubject: string;
  filterDifficulty: string;
  onFilterSubjectChange: (subject: string) => void;
  onFilterDifficultyChange: (difficulty: string) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onDeleteQuestion,
  onEditQuestion,
  filterSubject,
  filterDifficulty,
  onFilterSubjectChange,
  onFilterDifficultyChange
}) => {
  const subjects = ['All', 'Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];
  const difficulties = ['All', 'easy', 'medium', 'hard'];

  const filteredQuestions = questions.filter(question => {
    const subjectMatch = filterSubject === 'All' || question.subject === filterSubject;
    const difficultyMatch = filterDifficulty === 'All' || question.difficulty === filterDifficulty;
    return subjectMatch && difficultyMatch;
  });

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-t-lg">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-bold">📚 Questions Library ({filteredQuestions.length})</span>
          <div className="flex gap-2">
            <Select value={filterSubject} onValueChange={onFilterSubjectChange}>
              <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={onFilterDifficultyChange}>
              <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === 'All' ? 'All Levels' : 
                     difficulty === 'easy' ? '🟢 Easy' :
                     difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-gradient-to-r from-white/80 to-gray-50/80 p-6 rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{question.emoji}</span>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={`${
                    question.difficulty === 'easy' ? 'bg-green-500' :
                    question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white`}>
                    {question.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    {question.subject}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    {question.points} pts
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEditQuestion(question)}
                  variant="outline"
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onDeleteQuestion(question.id)}
                  variant="destructive"
                  size="sm" 
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <h3 className="text-gray-800 font-semibold mb-3 text-lg">{question.question}</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              {question.options.map((option, index) => (
                <div key={index} className={`p-3 rounded-lg ${index === question.correctAnswer ? 'bg-green-100 border border-green-400' : 'bg-gray-100 border border-gray-300'}`}>
                  <span className="text-gray-800 text-sm">
                    {index === question.correctAnswer && '✅ '}{option}
                  </span>
                </div>
              ))}
            </div>
            
            {question.explanation && (
              <div className="bg-blue-100 p-3 rounded-lg mb-3 border border-blue-300">
                <p className="text-blue-800 text-sm"><strong>Explanation:</strong> {question.explanation}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-1">
              {question.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
