
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface Theme {
  id: string;
  name: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  textColor: string;
  borderRadius: number;
  fontFamily: string;
  animations: string[];
}

export const ThemeCustomizer: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>({
    id: '1',
    name: 'Ocean Breeze',
    background: 'from-blue-400 via-purple-500 to-pink-600',
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    textColor: '#FFFFFF',
    borderRadius: 8,
    fontFamily: 'Inter',
    animations: ['animate-fade-in', 'animate-bounce', 'animate-pulse']
  });

  const [savedThemes, setSavedThemes] = useState<Theme[]>([
    {
      id: '1',
      name: 'Ocean Breeze',
      background: 'from-blue-400 via-purple-500 to-pink-600',
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      textColor: '#FFFFFF',
      borderRadius: 8,
      fontFamily: 'Inter',
      animations: ['animate-fade-in', 'animate-bounce']
    },
    {
      id: '2',
      name: 'Forest Green',
      background: 'from-green-400 via-teal-500 to-blue-600',
      primary: '#10B981',
      secondary: '#14B8A6',
      accent: '#3B82F6',
      textColor: '#FFFFFF',
      borderRadius: 12,
      fontFamily: 'Roboto',
      animations: ['animate-scale-in', 'animate-slide-in-right']
    }
  ]);

  const saveTheme = () => {
    const newTheme = {
      ...currentTheme,
      id: Date.now().toString(),
      name: currentTheme.name || 'Custom Theme'
    };
    setSavedThemes([...savedThemes, newTheme]);
  };

  const loadTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const deleteTheme = (id: string) => {
    setSavedThemes(savedThemes.filter(theme => theme.id !== id));
  };

  const previewStyle = {
    background: `linear-gradient(to bottom right, ${currentTheme.background.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').map(color => `var(--${color})`).join(', ')})`,
    borderRadius: `${currentTheme.borderRadius}px`,
    fontFamily: currentTheme.fontFamily,
    color: currentTheme.textColor
  };

  return (
    <div className="space-y-6">
      {/* Theme Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">🎨 Theme Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Theme Name</Label>
              <Input
                placeholder="Theme name..."
                value={currentTheme.name}
                onChange={(e) => setCurrentTheme({ ...currentTheme, name: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>

            <div>
              <Label className="text-white">Background Gradient</Label>
              <Input
                placeholder="from-blue-400 via-purple-500 to-pink-600"
                value={currentTheme.background}
                onChange={(e) => setCurrentTheme({ ...currentTheme, background: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Primary Color</Label>
                <Input
                  type="color"
                  value={currentTheme.primary}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, primary: e.target.value })}
                  className="bg-white/20 border-white/30 h-10"
                />
              </div>
              <div>
                <Label className="text-white">Secondary Color</Label>
                <Input
                  type="color"
                  value={currentTheme.secondary}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, secondary: e.target.value })}
                  className="bg-white/20 border-white/30 h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Accent Color</Label>
                <Input
                  type="color"
                  value={currentTheme.accent}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, accent: e.target.value })}
                  className="bg-white/20 border-white/30 h-10"
                />
              </div>
              <div>
                <Label className="text-white">Text Color</Label>
                <Input
                  type="color"
                  value={currentTheme.textColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, textColor: e.target.value })}
                  className="bg-white/20 border-white/30 h-10"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Border Radius: {currentTheme.borderRadius}px</Label>
              <Slider
                value={[currentTheme.borderRadius]}
                onValueChange={(value) => setCurrentTheme({ ...currentTheme, borderRadius: value[0] })}
                max={20}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-white">Font Family</Label>
              <select
                value={currentTheme.fontFamily}
                onChange={(e) => setCurrentTheme({ ...currentTheme, fontFamily: e.target.value })}
                className="w-full p-2 bg-white/20 border border-white/30 rounded text-white"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>

            <Button onClick={saveTheme} className="w-full bg-green-500 hover:bg-green-600 text-white">
              💾 Save Theme
            </Button>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">👁️ Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`p-6 rounded-lg bg-gradient-to-br ${currentTheme.background}`}
              style={previewStyle}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme.textColor }}>
                Sample Game Interface
              </h3>
              <div className="space-y-4">
                <button
                  className="px-4 py-2 rounded font-semibold animate-fade-in"
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: 'white',
                    borderRadius: `${currentTheme.borderRadius}px`
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded font-semibold ml-2 animate-bounce"
                  style={{
                    backgroundColor: currentTheme.secondary,
                    color: 'white',
                    borderRadius: `${currentTheme.borderRadius}px`
                  }}
                >
                  Secondary Button
                </button>
                <div
                  className="p-4 rounded border-2 animate-pulse"
                  style={{
                    borderColor: currentTheme.accent,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: `${currentTheme.borderRadius}px`
                  }}
                >
                  <p style={{ color: currentTheme.textColor }}>Sample content area with custom styling applied.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Themes */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">💾 Saved Themes ({savedThemes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedThemes.map((theme) => (
              <div key={theme.id} className="bg-white/20 p-4 rounded-lg border border-white/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold">{theme.name}</h3>
                  <Button
                    onClick={() => deleteTheme(theme.id)}
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-xs px-2 py-1"
                  >
                    🗑️
                  </Button>
                </div>
                <div
                  className={`h-16 rounded mb-2 bg-gradient-to-r ${theme.background}`}
                  style={{ borderRadius: `${theme.borderRadius}px` }}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.primary }} />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.secondary }} />
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.accent }} />
                  </div>
                  <Button
                    onClick={() => loadTheme(theme)}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
                  >
                    📥 Load
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
