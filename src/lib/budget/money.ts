/**
 * Money helpers. Everything is integer cents.
 */

/** Format cents as a currency string, e.g. 5990 -> "$59.90". */
export function formatMoney(cents: number, opts: { sign?: boolean } = {}): string {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rem = abs % 100;
  const body = `$${dollars.toLocaleString('en-US')}.${rem.toString().padStart(2, '0')}`;
  if (opts.sign) {
    return `${negative ? '−' : '+'}${body}`;
  }
  return negative ? `−${body}` : body;
}

/** Compact currency without cents when whole, e.g. 60000 -> "$600", 5990 -> "$59.90". */
export function formatMoneyCompact(cents: number): string {
  const abs = Math.abs(cents);
  if (abs % 100 === 0) {
    const dollars = Math.floor(abs / 100);
    return `${cents < 0 ? '−' : ''}$${dollars.toLocaleString('en-US')}`;
  }
  return formatMoney(cents);
}

/**
 * Parse a free-typed amount string ("59.90", "59", "1,299.5") into integer cents.
 * Returns null if it can't be parsed. Rounds to the nearest cent.
 */
export function parseMoney(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  if (!/^-?\d*\.?\d*$/.test(cleaned)) return null;
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) return null;
  return Math.round(value * 100);
}

/** Format cents for editing in an input, e.g. 5990 -> "59.90", 0 -> "". */
export function centsToInput(cents: number): string {
  if (cents === 0) return '';
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const s = `${Math.floor(abs / 100)}.${(abs % 100).toString().padStart(2, '0')}`;
  return negative ? `-${s}` : s;
}
