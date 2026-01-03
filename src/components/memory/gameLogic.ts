import type { Card, Rank, Suit } from './types';

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a deck of cards for Blitz mode (6 pairs = 12 cards)
 */
export function generateBlitzDeck(): Card[] {
  // Create all possible cards
  const allCards: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      allCards.push({
        id: `${rank}${suit}`,
        rank,
        suit,
        isFlipped: false,
        isMatched: false,
      });
    }
  }

  // Randomly select 6 cards for 6 pairs
  const shuffledDeck = shuffle(allCards);
  const selectedCards = shuffledDeck.slice(0, 6);

  // Duplicate them to create pairs
  const pairs = [...selectedCards, ...selectedCards].map((card, index) => ({
    ...card,
    id: `${card.rank}${card.suit}-${index}`, // Unique ID for each instance
  }));

  // Shuffle the pairs
  return shuffle(pairs);
}

/**
 * Check if two cards match (same rank and suit, different IDs)
 */
export function cardsMatch(card1: Card, card2: Card): boolean {
  return card1.rank === card2.rank && card1.suit === card2.suit && card1.id !== card2.id;
}

/**
 * Format elapsed time in MM:SS format
 */
export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
