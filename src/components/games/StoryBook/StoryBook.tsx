
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

interface StoryBookProps {
  onBack: () => void;
}

type ContentType = 'story' | 'poem';

interface StoryContent {
  title: string;
  content: string[];
  animations: string[];
  type: ContentType;
}

export const StoryBook: React.FC<StoryBookProps> = ({ onBack }) => {
  const [currentContent, setCurrentContent] = useState<StoryContent | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('story');
  const [showConcept, setShowConcept] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const stories: StoryContent[] = [
    {
      title: "The Dancing Stars",
      type: "story",
      content: [
        "Once upon a time, in a magical kingdom above the clouds...",
        "Little stars would dance across the midnight sky.",
        "Each star had a special wish to grant to children below.",
        "One brave little star decided to visit Earth.",
        "It sparkled down through the atmosphere like a shooting star.",
        "The star landed in a garden where a sad child sat alone.",
        "With a gentle glow, the star granted the child's wish for friendship.",
        "From that day on, every child who saw a star remembered to make a wish.",
        "And the dancing stars continued to bring joy to the world.",
        "The End."
      ],
      animations: [
        "animate-fade-in",
        "animate-bounce",
        "animate-pulse",
        "animate-scale-in",
        "animate-slide-in-right",
        "animate-fade-in",
        "animate-pulse",
        "animate-scale-in",
        "animate-bounce",
        "animate-fade-in"
      ]
    },
    {
      title: "The Brave Little Robot",
      type: "story",
      content: [
        "In a futuristic city filled with tall buildings and flying cars...",
        "There lived a small robot named Beep.",
        "Beep had a big heart but was afraid of heights.",
        "One day, a kitten got stuck on top of the tallest building.",
        "All the other robots were too big to fit in the narrow elevator.",
        "Beep knew he had to overcome his fear to help.",
        "With courage in his circuits, he climbed floor by floor.",
        "Finally reaching the top, Beep rescued the grateful kitten.",
        "The city celebrated their tiny hero with lights and cheers.",
        "Beep learned that being small can be a superpower too!"
      ],
      animations: [
        "animate-slide-in-right",
        "animate-bounce",
        "animate-scale-in",
        "animate-pulse",
        "animate-fade-in",
        "animate-scale-in",
        "animate-slide-in-right",
        "animate-bounce",
        "animate-pulse",
        "animate-fade-in"
      ]
    }
  ];

  const poems: StoryContent[] = [
    {
      title: "Rainbow Dreams",
      type: "poem",
      content: [
        "🌈 Red like roses in the morning light,",
        "🧡 Orange like sunset burning bright,",
        "💛 Yellow like the golden sun,",
        "💚 Green like grass where children run,",
        "💙 Blue like oceans deep and wide,",
        "💜 Purple like the flowers that hide,",
        "✨ Colors dancing in the sky,",
        "🦋 Making rainbows way up high!",
        "🌟 In our dreams, they come alive,",
        "🎨 Painting joy for all to thrive!"
      ],
      animations: [
        "animate-bounce",
        "animate-pulse",
        "animate-scale-in",
        "animate-fade-in",
        "animate-slide-in-right",
        "animate-bounce",
        "animate-pulse",
        "animate-scale-in",
        "animate-fade-in",
        "animate-bounce"
      ]
    },
    {
      title: "The Counting Song",
      type: "poem",
      content: [
        "1️⃣ One little bird sits in a tree,",
        "2️⃣ Two busy bees buzz happily,",
        "3️⃣ Three spotted frogs hop by the pond,",
        "4️⃣ Four dancing butterflies respond,",
        "5️⃣ Five colorful fish swim all around,",
        "6️⃣ Six jumping rabbits on the ground,",
        "7️⃣ Seven twinkling stars at night,",
        "8️⃣ Eight fireflies glowing bright,",
        "9️⃣ Nine singing birds welcome the day,",
        "🔟 Ten happy children come out to play!"
      ],
      animations: [
        "animate-fade-in",
        "animate-bounce",
        "animate-scale-in",
        "animate-pulse",
        "animate-slide-in-right",
        "animate-bounce",
        "animate-fade-in",
        "animate-pulse",
        "animate-scale-in",
        "animate-bounce"
      ]
    }
  ];

  useEffect(() => {
    if (isPlaying && currentContent) {
      const timer = setTimeout(() => {
        if (currentPage < currentContent.content.length - 1) {
          setCurrentPage(currentPage + 1);
          setAnimationClass(currentContent.animations[currentPage + 1]);
        } else {
          setIsPlaying(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentPage, currentContent]);

  const selectContent = () => {
    const contents = contentType === 'story' ? stories : poems;
    const selected = contents[Math.floor(Math.random() * contents.length)];
    setCurrentContent(selected);
    setCurrentPage(0);
    setIsPlaying(false);
    setAnimationClass(selected.animations[0]);
  };

  const playContent = () => {
    if (currentContent) {
      setCurrentPage(0);
      setIsPlaying(true);
      setAnimationClass(currentContent.animations[0]);
    }
  };

  const nextPage = () => {
    if (currentContent && currentPage < currentContent.content.length - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setAnimationClass(currentContent.animations[newPage]);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setAnimationClass(currentContent?.animations[newPage] || '');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-white/90">
            ← Back to Hub
          </Button>
          <h1 className="text-4xl font-bold text-white">📚 Animated Story Book</h1>
          <Dialog open={showConcept} onOpenChange={setShowConcept}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-pink-500 text-white hover:bg-pink-600">
                🧠 Concept
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Storytelling & Literature</DialogTitle>
                <DialogDescription>Experience animated stories and poems</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="animate-fade-in">
                  <h3 className="font-bold text-lg">📖 Reading Benefits</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Enhances imagination and creativity</li>
                    <li>Improves vocabulary and language skills</li>
                    <li>Develops emotional intelligence</li>
                    <li>Promotes better concentration</li>
                  </ul>
                </div>
                <div className="bg-pink-100 p-4 rounded-lg">
                  <h4 className="font-bold">💡 Interactive Features:</h4>
                  <p>Watch stories come alive with animations and visual effects!</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 bg-white/95">
          <CardHeader>
            <CardTitle className="text-center">Content Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center">
              <div>
                <label className="block text-sm font-medium mb-1">Content Type</label>
                <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="story">📚 Stories</SelectItem>
                    <SelectItem value="poem">🎵 Poems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={selectContent} className="bg-pink-500 hover:bg-pink-600">
                📖 Get Random {contentType === 'story' ? 'Story' : 'Poem'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {currentContent && (
          <Card className="bg-white/95">
            <CardHeader>
              <CardTitle className="text-center">{currentContent.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-8 rounded-lg min-h-64 flex items-center justify-center">
                <div className={`text-center ${animationClass}`}>
                  <p className="text-2xl leading-relaxed font-serif text-gray-800">
                    {currentContent.content[currentPage]}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  onClick={prevPage} 
                  disabled={currentPage === 0}
                  variant="outline"
                >
                  ← Previous
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={playContent} 
                    className="bg-green-500 hover:bg-green-600"
                    disabled={isPlaying}
                  >
                    {isPlaying ? '⏸️ Playing...' : '▶️ Auto Play'}
                  </Button>
                  
                  <Button 
                    onClick={() => setIsPlaying(false)} 
                    variant="outline"
                    disabled={!isPlaying}
                  >
                    ⏹️ Stop
                  </Button>
                </div>
                
                <Button 
                  onClick={nextPage} 
                  disabled={currentPage === currentContent.content.length - 1}
                  variant="outline"
                >
                  Next →
                </Button>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Page {currentPage + 1} of {currentContent.content.length}
                </div>
                <div className="flex justify-center gap-1">
                  {currentContent.content.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPage ? 'bg-pink-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {currentPage === currentContent.content.length - 1 && (
                <div className="text-center p-4 bg-yellow-100 rounded-lg">
                  <h3 className="text-xl font-bold text-yellow-800 mb-2">🎉 The End!</h3>
                  <p className="text-yellow-700">Did you enjoy this {contentType}?</p>
                  <Button onClick={selectContent} className="mt-3 bg-pink-500 hover:bg-pink-600">
                    📖 Read Another {contentType === 'story' ? 'Story' : 'Poem'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
