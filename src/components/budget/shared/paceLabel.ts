import { formatMoney } from '@/lib/budget/money';

/**
 * A pace value: positive = ahead of plan (spending faster), negative = behind.
 * Returns display text and whether it's a caution (ahead).
 */
export function paceLabel(pace: number | null): { text: string; ahead: boolean } | null {
  if (pace == null) return null;
  const rounded = Math.round(pace / 100) * 100; // steady the noise to whole dollars
  if (Math.abs(rounded) < 100) return { text: 'on plan', ahead: false };
  const ahead = pace > 0;
  return {
    text: `${formatMoney(Math.abs(pace))} ${ahead ? 'ahead' : 'behind'}`,
    ahead,
  };
}
