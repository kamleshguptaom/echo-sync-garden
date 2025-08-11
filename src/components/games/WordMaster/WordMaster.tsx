import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { GameModeSelector } from './components/GameModeSelector';
import { WordSearchGame } from './components/WordSearchGame';
import { ScrambleGame } from './components/ScrambleGame';
import { SmartGridGame } from './components/SmartGridGame';
import { WordTrailGame } from './components/WordTrailGame';
import { CrosswordGame } from './components/CrosswordGame';
import { GameStats } from './components/GameStats';
import { WordDefinitionDialog } from './components/WordDefinitionDialog';
import { validateWordWithDictionaryAPI, fetchWordDetails, suggestWordsByDifficulty } from '@/lib/wordApi';
interface WordMasterProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GameMode = 'word-search' | 'crossword' | 'scramble' | 'smart-grid' | 'trail';

interface GameStatsData {
  wordsFound: number;
  totalWords: number;
  score: number;
  timeRemaining: number;
  streak: number;
  level: number;
  lives: number;
  combo: number;
  perfectWords: number;
}

interface WordDefinition {
  word: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  pronunciation?: string;
}

export const WordMaster: React.FC<WordMasterProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('word-search');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTab, setCurrentTab] = useState<GameMode>('word-search');
  
  const [gameStats, setGameStats] = useState<GameStatsData>({
    wordsFound: 0,
    totalWords: 10,
    score: 0,
    timeRemaining: 300,
    streak: 0,
    level: 1,
    lives: 3,
    combo: 0,
    perfectWords: 0
  });

  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentWordDef, setCurrentWordDef] = useState<WordDefinition | null>(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Enhanced word database with Google API integration
  const wordDatabase = {
    easy: [
      { word: 'CAT', definition: 'A small domesticated carnivorous mammal', synonyms: ['feline'], antonyms: ['dog'], example: 'The cat sat on the mat.' },
      { word: 'DOG', definition: 'A loyal domesticated carnivorous mammal', synonyms: ['puppy'], antonyms: ['cat'], example: 'The dog barked loudly.' },
      { word: 'SUN', definition: 'The star around which Earth orbits', synonyms: ['star'], antonyms: ['moon'], example: 'The sun shines brightly.' },
      { word: 'RUN', definition: 'Move at a speed faster than walking', synonyms: ['sprint'], antonyms: ['walk'], example: 'I run every morning.' }
    ],
    medium: [
      { word: 'HOUSE', definition: 'A building for human habitation', synonyms: ['home'], antonyms: [], example: 'We live in a beautiful house.' },
      { word: 'SCHOOL', definition: 'An institution for educating children', synonyms: ['academy'], antonyms: [], example: 'Children go to school to learn.' },
      { word: 'COMPUTER', definition: 'An electronic device for processing data', synonyms: ['laptop'], antonyms: [], example: 'I use my computer for work.' }
    ],
    hard: [
      { word: 'BEAUTIFUL', definition: 'Pleasing the senses aesthetically', synonyms: ['gorgeous'], antonyms: ['ugly'], example: 'The sunset was beautiful.' },
      { word: 'INTELLIGENT', definition: 'Having or showing intelligence', synonyms: ['smart'], antonyms: ['stupid'], example: 'She is very intelligent.' }
    ],
    expert: [
      { word: 'SERENDIPITOUS', definition: 'Occurring by chance in a happy way', synonyms: ['fortuitous'], antonyms: ['planned'], example: 'Their meeting was serendipitous.' },
      { word: 'PERSPICACIOUS', definition: 'Having keen insight', synonyms: ['perceptive'], antonyms: ['oblivious'], example: 'Her analysis was perspicacious.' }
    ]
  };

  // Validate word using Free Dictionary API; fallback to local DB
  const validateWord = async (word: string): Promise<boolean> => {
    try {
      const apiValid = await validateWordWithDictionaryAPI(word);
      if (apiValid) return true;
      const allWords = Object.values(wordDatabase).flat().map(w => w.word);
      return allWords.includes(word.toUpperCase());
    } catch (error) {
      console.error('Word validation error:', error);
      return false;
    }
  };

  const initializeGame = useCallback(async () => {
    const base = wordDatabase[difficulty].slice(0, 8).map(w => w.word);
    const suggested = await suggestWordsByDifficulty(difficulty as any, 10);
    const combined = Array.from(new Set([...base, ...suggested])).slice(0, 12);
    setCurrentWords(combined);
    setFoundWords([]);
    
    const timeLimit = {
      easy: 600,
      medium: 450,
      hard: 300,
      expert: 240
    }[difficulty];

    setGameStats({
      wordsFound: 0,
      totalWords: combined.length,
      score: 0,
      timeRemaining: timeLimit,
      streak: 0,
      level: 1,
      lives: 3,
      combo: 0,
      perfectWords: 0
    });
    
    setGameStarted(true);
  }, [difficulty]);

  const handleWordFound = async (word: string, points: number) => {
    const isValid = await validateWord(word);
    
    if (!isValid) {
      toast({
        title: "❌ Invalid Word",
        description: `"${word}" is not a valid word. Try again!`,
        variant: "destructive"
      });
      return false;
    }

    // Accept words validated by external API, not just local DB
    if (!foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      
      const bonusPoints = gameStats.streak >= 3 ? 50 : 0;
      const finalPoints = points + bonusPoints;
      
      setGameStats(prev => ({
        ...prev,
        wordsFound: newFoundWords.length,
        score: prev.score + finalPoints,
        streak: prev.streak + 1,
        combo: prev.combo + 1
      }));
      
      // Fetch definition details (prefer local DB, then API)
      const localData = wordDatabase[difficulty].find(w => w.word === word);
      let details: WordDefinition | null = null;
      if (localData) {
        details = localData;
      } else {
        const apiDetails = await fetchWordDetails(word);
        if (apiDetails) {
          details = {
            word: apiDetails.word,
            definition: apiDetails.definition,
            synonyms: apiDetails.synonyms,
            antonyms: apiDetails.antonyms,
            example: apiDetails.example,
            pronunciation: apiDetails.pronunciation,
          };
        }
      }
      if (details) {
        setCurrentWordDef(details);
        setShowMeaning(true);
      }
      
      toast({
        title: "🎉 Word Found!",
        description: `"${word}" for ${finalPoints} points!`,
      });
      
      return true;
    }
    return false;
  };

  const handleTabChange = (value: string) => {
    const newMode = value as GameMode;
    setCurrentTab(newMode);
    setGameMode(newMode);
    // Keep the current session running; do not auto-stop on tab change
  };

  const renderGameContent = () => {
    if (!gameStarted) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Configure your settings and click "Start Game" to begin!
          </p>
          <Button onClick={initializeGame} size="lg">
            Start {currentTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Game
          </Button>
        </div>
      );
    }

    switch (currentTab) {
      case 'word-search':
        return <WordSearchGame 
          words={currentWords} 
          difficulty={difficulty}
          onWordFound={handleWordFound}
          foundWords={foundWords}
        />;
      case 'crossword':
        return <CrosswordGame 
          difficulty={difficulty}
          onWordFound={handleWordFound}
          onComplete={() => {
            setGameStarted(false);
          }}
        />;
      case 'scramble':
        return <ScrambleGame 
          words={currentWords}
          onWordFound={handleWordFound}
          difficulty={difficulty}
        />;
      case 'smart-grid':
        return <SmartGridGame 
          words={currentWords}
          onWordFound={handleWordFound}
        />;
      case 'trail':
        return <WordTrailGame 
          words={currentWords}
          onWordFound={handleWordFound}
        />;
      default:
        return <div>Game mode not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline">
            ← Back to Games
          </Button>
          <h1 className="text-4xl font-bold text-center">📚 Word Master Pro</h1>
          <div className="w-24" />
        </div>

        {/* Game Configuration */}
        {!gameStarted && (
          <Card className="mb-6 bg-background/95 backdrop-blur">
            <CardHeader>
              <CardTitle>🎯 Game Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">🟢 Easy</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="hard">🟠 Hard</SelectItem>
                      <SelectItem value="expert">🔴 Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Stats */}
        {gameStarted && (
          <GameStats stats={gameStats} />
        )}

        {/* Game Tabs */}
        <Card className="bg-background/95 backdrop-blur">
          <CardContent className="p-0">
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
                <TabsTrigger value="word-search" className="text-xs">🔍 Search</TabsTrigger>
                <TabsTrigger value="crossword" className="text-xs">📝 Crossword</TabsTrigger>
                <TabsTrigger value="scramble" className="text-xs">🔤 Scramble</TabsTrigger>
                <TabsTrigger value="smart-grid" className="text-xs">🎯 Smart Grid</TabsTrigger>
                <TabsTrigger value="trail" className="text-xs">🛤️ Trail</TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="word-search" className="mt-0">
                  {renderGameContent()}
                </TabsContent>
                <TabsContent value="crossword" className="mt-0">
                  {renderGameContent()}
                </TabsContent>
                <TabsContent value="scramble" className="mt-0">
                  {renderGameContent()}
                </TabsContent>
                <TabsContent value="smart-grid" className="mt-0">
                  {renderGameContent()}
                </TabsContent>
                <TabsContent value="trail" className="mt-0">
                  {renderGameContent()}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Word Definition Dialog */}
        <WordDefinitionDialog
          wordDef={currentWordDef}
          isOpen={showMeaning}
          onClose={() => setShowMeaning(false)}
        />
      </div>
    </div>
  );
};