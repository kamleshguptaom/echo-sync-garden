import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface WordDefinition {
  word: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  pronunciation?: string;
}

interface WordDefinitionDialogProps {
  wordDef: WordDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WordDefinitionDialog: React.FC<WordDefinitionDialogProps> = ({
  wordDef,
  isOpen,
  onClose
}) => {
  if (!wordDef) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            📚 {wordDef.word}
            {wordDef.pronunciation && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                /{wordDef.pronunciation}/
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">DEFINITION</h4>
            <p className="text-base">{wordDef.definition}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">EXAMPLE</h4>
            <p className="text-base italic">"{wordDef.example}"</p>
          </div>
          
          {wordDef.synonyms.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">SYNONYMS</h4>
              <div className="flex flex-wrap gap-2">
                {wordDef.synonyms.map(synonym => (
                  <Badge key={synonym} variant="secondary">
                    {synonym}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {wordDef.antonyms.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">ANTONYMS</h4>
              <div className="flex flex-wrap gap-2">
                {wordDef.antonyms.map(antonym => (
                  <Badge key={antonym} variant="outline">
                    {antonym}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};