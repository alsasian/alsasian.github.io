export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type GameMode = 'blitz' | 'rapid';

export interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  mode: GameMode;
  cards: Card[];
  flippedCards: string[];
  mistakes: number;
  totalFlips: number;
  startTime: number | null;
  elapsedTime: number;
  isComplete: boolean;
}

export interface PersonalBest {
  time: number;
  mistakes: number;
  flips: number;
}
