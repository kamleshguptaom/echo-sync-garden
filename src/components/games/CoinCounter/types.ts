export interface Coin {
  id: string;
  value: number;
  name: string;
  emoji: string;
  count: number;
  color: string;
  description: string;
}

export interface Challenge {
  id: string;
  targetAmount: number;
  description: string;
  hint: string;
  difficulty: number;
  timeLimit?: number;
}

export interface Purchase {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
}