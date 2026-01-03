import type { PersonalBest, GameMode } from './types';

const STORAGE_KEY_PREFIX = 'memory-game-pb';

function getStorageKey(mode: GameMode): string {
  return `${STORAGE_KEY_PREFIX}-${mode}`;
}

/**
 * Load personal best from localStorage for a specific mode
 */
export function loadPersonalBest(mode: GameMode): PersonalBest | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(getStorageKey(mode));
    if (!stored) return null;

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load personal best:', error);
    return null;
  }
}

/**
 * Save personal best to localStorage for a specific mode
 */
export function savePersonalBest(mode: GameMode, best: PersonalBest): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getStorageKey(mode), JSON.stringify(best));
  } catch (error) {
    console.error('Failed to save personal best:', error);
  }
}

/**
 * Check if current game is a new personal best
 */
export function isNewRecord(
  current: { time: number; mistakes: number; flips: number },
  previous: PersonalBest | null
): boolean {
  if (!previous) return true;

  // Better record if: faster time OR (same time but fewer mistakes) OR (same time and mistakes but fewer flips)
  if (current.time < previous.time) return true;
  if (current.time === previous.time && current.mistakes < previous.mistakes) return true;
  if (
    current.time === previous.time &&
    current.mistakes === previous.mistakes &&
    current.flips < previous.flips
  )
    return true;

  return false;
}
