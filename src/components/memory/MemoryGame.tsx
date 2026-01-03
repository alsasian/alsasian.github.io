import { useState, useEffect, useCallback } from 'react';
import type { GameState } from './types';
import { generateBlitzDeck, cardsMatch, formatTime } from './gameLogic';

export default function MemoryGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    cards: generateBlitzDeck(),
    flippedCards: [],
    mistakes: 0,
    startTime: null,
    elapsedTime: 0,
    isComplete: false,
  }));

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

  // Check for completion
  useEffect(() => {
    const allMatched = gameState.cards.every((card) => card.isMatched);
    if (allMatched && gameState.cards.length > 0 && !gameState.isComplete) {
      setGameState((prev) => ({ ...prev, isComplete: true }));
    }
  }, [gameState.cards, gameState.isComplete]);

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
              startTime,
            };
          }
        }
      }

      return {
        ...prev,
        cards: updatedCards,
        flippedCards: newFlippedCards,
        startTime,
      };
    });
  }, []);

  const handleReset = () => {
    setGameState({
      cards: generateBlitzDeck(),
      flippedCards: [],
      mistakes: 0,
      startTime: null,
      elapsedTime: 0,
      isComplete: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#fffef9] text-[#1a1a1a] p-4 font-serif">
      {/* Header */}
      <header className="max-w-2xl mx-auto mb-6">
        <h1 className="text-3xl font-bold mb-2 border-b-2 border-[#1a1a1a] pb-2">
          Pair Memory Game
        </h1>
        <p className="text-sm text-gray-600">Blitz Mode - 6 Pairs</p>
      </header>

      {/* Stats */}
      <div className="max-w-2xl mx-auto mb-6 flex gap-6 text-sm border-t border-b border-gray-300 py-3">
        <div>
          <span className="font-bold">Time:</span> {formatTime(gameState.elapsedTime)}
        </div>
        <div>
          <span className="font-bold">Mistakes:</span> {gameState.mistakes}
        </div>
      </div>

      {/* Game Grid */}
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {gameState.cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || card.isFlipped}
              className={`
                aspect-[2/3] rounded-lg border-2 border-[#1a1a1a]
                flex items-center justify-center text-2xl font-bold
                transition-all duration-300 active:scale-95
                ${
                  card.isMatched
                    ? 'bg-transparent border-transparent text-transparent cursor-default'
                    : card.isFlipped
                      ? 'bg-white'
                      : 'bg-[#1a1a1a] text-transparent cursor-pointer'
                }
              `}
            >
              {(card.isFlipped || card.isMatched) && (
                <span className={card.isMatched ? 'opacity-0' : 'opacity-100'}>
                  {card.rank}
                  {card.suit}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Win State */}
        {gameState.isComplete && (
          <div className="bg-white border-2 border-[#1a1a1a] p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Complete!</h2>
            <div className="space-y-2 mb-6">
              <p>
                <span className="font-bold">Time:</span> {formatTime(gameState.elapsedTime)}
              </p>
              <p>
                <span className="font-bold">Mistakes:</span> {gameState.mistakes}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="bg-[#1a1a1a] text-white px-6 py-3 rounded font-bold hover:bg-gray-800 active:scale-95 transition-all"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Reset Button */}
        {!gameState.isComplete && (
          <button
            onClick={handleReset}
            className="w-full bg-white border-2 border-[#1a1a1a] px-6 py-3 rounded font-bold hover:bg-gray-100 active:scale-95 transition-all"
          >
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
}
