/**
 * Small bits of app metadata that aren't budget data — kept in localStorage.
 * (The durable data lives in IndexedDB; this is just UI bookkeeping.)
 */

const LAST_EXPORT_KEY = 'budget-last-export';

export function markExported(): void {
  try {
    localStorage.setItem(LAST_EXPORT_KEY, new Date().toISOString());
  } catch {
    /* ignore */
  }
}

export function getLastExport(): Date | null {
  try {
    const v = localStorage.getItem(LAST_EXPORT_KEY);
    return v ? new Date(v) : null;
  } catch {
    return null;
  }
}

/** Whole days since the last export, or null if never exported. */
export function daysSinceExport(): number | null {
  const last = getLastExport();
  if (!last) return null;
  return Math.floor((Date.now() - last.getTime()) / 86_400_000);
}
