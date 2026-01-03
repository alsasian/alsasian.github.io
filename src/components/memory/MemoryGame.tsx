import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, PersonalBest, GameMode } from './types';
import { generateBlitzDeck, generateRapidDeck, cardsMatch, formatTime } from './gameLogic';
import { loadPersonalBest, savePersonalBest, isNewRecord } from './storage';

export default function MemoryGame() {
  const [mode, setMode] = useState<GameMode>('blitz');
  const [gameState, setGameState] = useState<GameState>(() => ({
    mode: 'blitz',
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

  // Pan/drag state for Rapid mode
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Load personal best on mount and mode change
  useEffect(() => {
    setPersonalBest(loadPersonalBest(mode));
  }, [mode]);

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
        savePersonalBest(mode, currentScore);
        setPersonalBest(currentScore);
      } else {
        setIsRecord(false);
      }
    }
  }, [gameState.cards, gameState.isComplete, gameState.elapsedTime, gameState.mistakes, gameState.totalFlips, personalBest, mode]);

  const handleCardClick = useCallback((cardId: string) => {
    // Don't flip card if we just finished dragging
    if (hasDragged) return;

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
  }, [hasDragged]);

  const handleReset = () => {
    const deck = mode === 'blitz' ? generateBlitzDeck() : generateRapidDeck();
    setGameState({
      mode,
      cards: deck,
      flippedCards: [],
      mistakes: 0,
      totalFlips: 0,
      startTime: null,
      elapsedTime: 0,
      isComplete: false,
    });
    setPanOffset({ x: 0, y: 0 });
  };

  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    const deck = newMode === 'blitz' ? generateBlitzDeck() : generateRapidDeck();
    setGameState({
      mode: newMode,
      cards: deck,
      flippedCards: [],
      mistakes: 0,
      totalFlips: 0,
      startTime: null,
      elapsedTime: 0,
      isComplete: false,
    });
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan/drag handlers for Rapid mode
  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== 'rapid') return;

    setIsDragging(true);
    setHasDragged(false);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || mode !== 'rapid') return;
    e.preventDefault();

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Mark as dragged if moved more than 5px
    if (!hasDragged) {
      const distance = Math.sqrt(
        Math.pow(newX - panOffset.x, 2) + Math.pow(newY - panOffset.y, 2)
      );
      if (distance > 5) {
        setHasDragged(true);
      }
    }

    setPanOffset({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (mode !== 'rapid') return;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    // Reset hasDragged after a brief delay to allow click event to be blocked
    setTimeout(() => setHasDragged(false), 50);
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="max-w-2xl mx-auto mb-4">
        <h1 className="text-3xl mb-3 border-b-2 border-gray-900 dark:border-gray-100 pb-2">
          Pair Memory Game
        </h1>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleModeChange('blitz')}
            className={`
              px-4 py-2 rounded font-bold text-sm transition-all
              ${mode === 'blitz'
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700'
              }
            `}
          >
            Blitz (6 pairs)
          </button>
          <button
            onClick={() => handleModeChange('rapid')}
            className={`
              px-4 py-2 rounded font-bold text-sm transition-all
              ${mode === 'rapid'
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700'
              }
            `}
          >
            Rapid (18 pairs)
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {mode === 'rapid' ? 'Drag to pan the grid' : ''}
        </p>
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
      <div className={`mx-auto relative ${mode === 'blitz' ? 'max-w-2xl' : ''}`}>
        {/* Grid Container with Pan/Drag for Rapid mode */}
        <div
          ref={gridRef}
          className={`
            ${mode === 'rapid' ? 'overflow-hidden h-[70vh] relative touch-none' : ''}
          `}
        >
          <div
            className={mode === 'blitz' ? 'mb-6 grid grid-cols-4 gap-2' : 'mb-6'}
            style={{
              perspective: '1000px',
              ...(mode === 'rapid' && {
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 80px)',
                gridAutoRows: '80px',
                gap: '8px',
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                willChange: 'transform',
              }),
            }}
            onPointerDown={mode === 'rapid' ? handlePointerDown : undefined}
            onPointerMove={mode === 'rapid' ? handlePointerMove : undefined}
            onPointerUp={mode === 'rapid' ? handlePointerUp : undefined}
            onPointerCancel={mode === 'rapid' ? handlePointerUp : undefined}
          >
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
                ${mode === 'blitz' ? 'aspect-square' : 'w-20 h-20'}
                rounded-lg relative
                transition-all duration-500 active:scale-95
                ${card.isMatched ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              {/* Card Back (face down) */}
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className="absolute inset-0 rounded-lg border-2 border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100"
              />

              {/* Card Front (face up) */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className={`
                  absolute inset-0 rounded-lg border-2 flex items-center justify-center font-bold
                  ${mode === 'blitz' ? 'text-xl' : 'text-lg'}
                  ${
                    card.isMatched
                      ? 'bg-transparent border-transparent'
                      : 'bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-100'
                  }
                `}
              >
                <span
                  className={`
                    ${card.isMatched ? 'opacity-0' : 'opacity-100'}
                    ${isRedSuit(card.suit) ? 'text-red-600 dark:text-red-500' : ''}
                  `}
                >
                  {card.rank}
                  {card.suit}
                </span>
              </div>
            </button>
          ))}
        </div>
        </div>

        {/* Mini-map for Rapid mode */}
        {mode === 'rapid' && gridRef.current && (
          <div className="fixed bottom-20 right-4 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-2 rounded-lg shadow-lg">
            <div className="grid grid-cols-6 gap-0.5" style={{ width: '60px', height: '60px' }}>
              {gameState.cards.map((card) => (
                <div
                  key={card.id}
                  className={`
                    ${card.isMatched ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-900 dark:bg-gray-100'}
                  `}
                  style={{ aspectRatio: '1' }}
                />
              ))}
            </div>
            {/* Viewport indicator */}
            <div
              className="absolute border-2 border-red-600 dark:border-red-500 pointer-events-none"
              style={{
                // Grid is 6 cards * 80px + 5 gaps * 8px = 520px
                // Container is typically ~320px wide on mobile
                // Minimap is 60px representing 520px grid
                // Scale: 60/520 ≈ 0.115
                left: `${8 + (-panOffset.x * 60) / 520}px`,
                top: `${8 + (-panOffset.y * 60) / 520}px`,
                // Viewport size scales similarly
                width: `${(gridRef.current.offsetWidth * 60) / 520}px`,
                height: `${(gridRef.current.offsetHeight * 60) / 520}px`,
              }}
            />
          </div>
        )}

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
