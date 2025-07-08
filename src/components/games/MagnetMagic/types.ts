export interface MagnetItem {
  id: string;
  name: string;
  emoji: string;
  isMagnetic: boolean;
  material: string;
  strength?: number;
  description: string;
  realWorldUse: string;
}

export interface MagnetExperiment {
  id: string;
  name: string;
  description: string;
  items: MagnetItem[];
  expectedResults: Record<string, boolean>;
  learningGoal: string;
}