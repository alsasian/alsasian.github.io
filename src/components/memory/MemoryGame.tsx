import { useState, useEffect, useCallback } from 'react';
import type { GameState, PersonalBest } from './types';
import { generateBlitzDeck, cardsMatch, formatTime } from './gameLogic';
import { loadPersonalBest, savePersonalBest, isNewRecord } from './storage';

export default function MemoryGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    cards: generateBlitzDeck(),
    flippedCards: [],
    mistakes: 0,
    totalFlips: 0,
    startTime: null,
    elapsedTime: 0,
    isComplete: false,
  }));

  const [personalBest, setPersonalBest] = useState<PersonalBest | null>(null);
  const [isRecord, setIsRecord] = useState(false);

  // Load personal best on mount
  useEffect(() => {
    setPersonalBest(loadPersonalBest());
  }, []);

  // Helper to determine if suit is red
  const isRedSuit = (suit: string) => suit === '♥' || suit === '♦';

  // Timer effect
  useEffect(() => {
    if (!gameState.startTime || gameState.isComplete) return;

    const interval = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        elapsedTime: Date.now() - (prev.startTime || Date.now()),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.startTime, gameState.isComplete]);

  // Check for completion and save personal best
  useEffect(() => {
    const allMatched = gameState.cards.every((card) => card.isMatched);
    if (allMatched && gameState.cards.length > 0 && !gameState.isComplete) {
      setGameState((prev) => ({ ...prev, isComplete: true }));

      // Check and save personal best
      const currentScore = {
        time: gameState.elapsedTime,
        mistakes: gameState.mistakes,
        flips: gameState.totalFlips,
      };

      if (isNewRecord(currentScore, personalBest)) {
        setIsRecord(true);
        savePersonalBest(currentScore);
        setPersonalBest(currentScore);
      } else {
        setIsRecord(false);
      }
    }
  }, [gameState.cards, gameState.isComplete, gameState.elapsedTime, gameState.mistakes, gameState.totalFlips, personalBest]);

  const handleCardClick = useCallback((cardId: string) => {
    setGameState((prev) => {
      // Start timer on first flip
      const startTime = prev.startTime || Date.now();

      // Can't flip if already flipped or matched
      const card = prev.cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prev;

      // Can't flip if already have 2 cards flipped
      if (prev.flippedCards.length >= 2) return prev;

      // Flip the card
      const updatedCards = prev.cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      );

      const newFlippedCards = [...prev.flippedCards, cardId];
      const newTotalFlips = prev.totalFlips + 1;

      // Check for match if we have 2 cards flipped
      if (newFlippedCards.length === 2) {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = updatedCards.find((c) => c.id === firstId);
        const secondCard = updatedCards.find((c) => c.id === secondId);

        if (firstCard && secondCard) {
          if (cardsMatch(firstCard, secondCard)) {
            // Match found - mark both as matched
            const matchedCards = updatedCards.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            );

            return {
              ...prev,
              cards: matchedCards,
              flippedCards: [],
              totalFlips: newTotalFlips,
              startTime,
            };
          } else {
            // No match - flip back after delay
            setTimeout(() => {
              setGameState((current) => ({
                ...current,
                cards: current.cards.map((c) =>
                  c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
                ),
                flippedCards: [],
              }));
            }, 1000);

            return {
              ...prev,
              cards: updatedCards,
              flippedCards: newFlippedCards,
              mistakes: prev.mistakes + 1,
              totalFlips: newTotalFlips,
              startTime,
            };
          }
        }
      }

      return {
        ...prev,
        cards: updatedCards,
        flippedCards: newFlippedCards,
        totalFlips: newTotalFlips,
        startTime,
      };
    });
  }, []);

  const handleReset = () => {
    setGameState({
      cards: generateBlitzDeck(),
      flippedCards: [],
      mistakes: 0,
      totalFlips: 0,
      startTime: null,
      elapsedTime: 0,
      isComplete: false,
    });
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="max-w-2xl mx-auto mb-6">
        <h1 className="text-3xl mb-2 border-b-2 border-gray-900 dark:border-gray-100 pb-2">
          Pair Memory Game
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Blitz Mode - 6 Pairs</p>
      </header>

      {/* Stats */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="flex gap-4 text-sm border-t border-b border-gray-300 dark:border-gray-700 py-3 mb-2">
          <div>
            <span className="font-bold">Time:</span> {formatTime(gameState.elapsedTime)}
          </div>
          <div>
            <span className="font-bold">Mistakes:</span> {gameState.mistakes}
          </div>
          <div>
            <span className="font-bold">Flips:</span> {gameState.totalFlips}
          </div>
        </div>
        {personalBest && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Personal Best: {formatTime(personalBest.time)} • {personalBest.mistakes} mistakes • {personalBest.flips} flips
          </div>
        )}
      </div>

      {/* Game Grid */}
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-4 gap-2 mb-6" style={{ perspective: '1000px' }}>
          {gameState.cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || card.isFlipped}
              style={{
                transformStyle: 'preserve-3d',
                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
              className={`
                aspect-[2/3] rounded-lg border-2
                flex items-center justify-center text-xl font-bold
                transition-all duration-500 active:scale-95
                ${
                  card.isMatched
                    ? 'bg-transparent border-transparent cursor-default'
                    : card.isFlipped
                      ? 'bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-100'
                      : 'bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100 cursor-pointer'
                }
              `}
            >
              <span
                style={{ transform: 'rotateY(180deg)' }}
                className={`
                  ${card.isMatched ? 'opacity-0' : card.isFlipped ? 'opacity-100' : 'opacity-0'}
                  ${isRedSuit(card.suit) ? 'text-red-600 dark:text-red-500' : ''}
                `}
              >
                {card.rank}
                {card.suit}
              </span>
            </button>
          ))}
        </div>


        {/* Reset Button */}
        {!gameState.isComplete && (
          <button
            onClick={handleReset}
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 px-6 py-3 rounded font-bold hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            Reset Game
          </button>
        )}
      </div>

      {/* Win State Modal */}
      {gameState.isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-6 rounded-lg max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-2">Complete!</h2>
            {isRecord && (
              <div className="text-sm font-bold text-red-600 dark:text-red-500 mb-4">
                🎉 New Personal Best!
              </div>
            )}
            <div className="space-y-2 mb-6">
              <p>
                <span className="font-bold">Time:</span> {formatTime(gameState.elapsedTime)}
              </p>
              <p>
                <span className="font-bold">Mistakes:</span> {gameState.mistakes}
              </p>
              <p>
                <span className="font-bold">Flips:</span> {gameState.totalFlips}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded font-bold hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
