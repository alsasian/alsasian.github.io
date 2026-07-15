/**
 * Date helpers. Dates are stored as `YYYY-MM-DD` strings (local calendar days).
 * We never rely on time-of-day, so we parse into y/m/d parts directly and avoid
 * timezone surprises from `new Date('YYYY-MM-DD')` (which parses as UTC).
 */

export interface YMD {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function parseYMD(iso: string): YMD {
  const [y, m, d] = iso.split('-').map((n) => Number.parseInt(n, 10));
  return { year: y, month: m, day: d };
}

export function toISODate(ymd: YMD): string {
  const mm = ymd.month.toString().padStart(2, '0');
  const dd = ymd.day.toString().padStart(2, '0');
  return `${ymd.year}-${mm}-${dd}`;
}

export function todayISO(): string {
  const now = new Date();
  return toISODate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
}

export function todayYMD(): YMD {
  return parseYMD(todayISO());
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Day-of-year (1-based) for a given YMD. */
export function dayOfYear(ymd: YMD): number {
  let total = ymd.day;
  for (let m = 1; m < ymd.month; m += 1) {
    total += daysInMonth(ymd.year, m);
  }
  return total;
}

export function daysInYear(year: number): number {
  return dayOfYear({ year, month: 12, day: 31 });
}

export function monthShort(month: number): string {
  return MONTHS_SHORT[month - 1] ?? '';
}

export function monthLong(month: number): string {
  return MONTHS_LONG[month - 1] ?? '';
}

/** e.g. "12 Jul" */
export function formatDayMonth(iso: string): string {
  const { day, month } = parseYMD(iso);
  return `${day.toString().padStart(2, '0')} ${monthShort(month)}`;
}

/** e.g. "July 2026" */
export function formatMonthYear(year: number, month: number): string {
  return `${monthLong(month)} ${year}`;
}

/** Compare two ISO dates as strings (works because of fixed-width format). */
export function isoIsAfter(a: string, b: string): boolean {
  return a > b;
}

export function isoIsBeforeOrEqual(a: string, b: string): boolean {
  return a <= b;
}

/** Is (year, month) at or before (refYear, refMonth)? */
export function monthAtOrBefore(
  year: number,
  month: number,
  refYear: number,
  refMonth: number
): boolean {
  return year < refYear || (year === refYear && month <= refMonth);
}

/** Advance a YMD by a whole number of months, clamping the day. */
export function addMonths(ymd: YMD, months: number): YMD {
  const zeroBased = ymd.month - 1 + months;
  const year = ymd.year + Math.floor(zeroBased / 12);
  const month = (((zeroBased % 12) + 12) % 12) + 1;
  const day = Math.min(ymd.day, daysInMonth(year, month));
  return { year, month, day };
}

export function addYears(ymd: YMD, years: number): YMD {
  const year = ymd.year + years;
  const day = Math.min(ymd.day, daysInMonth(year, ymd.month));
  return { year, month: ymd.month, day };
}
