/**
 * The budget engine: cap resolution, plan shape, pace, free, and drift.
 *
 * This is where the tool earns its keep. "Am I over or under?" is ambiguous
 * for yearly spend, so we compare actual spending against a PLAN that already
 * knows November and December are coming — not against a naive straight line.
 */

import type { Item, Transaction } from './types';
import { daysInMonth, daysInYear, dayOfYear, parseYMD, todayYMD, type YMD } from './dates';

/* ------------------------------------------------------------------ */
/* Cap resolution (the headline budget)                                */
/* ------------------------------------------------------------------ */

interface SteppedOverride {
  key: number;
  amount: number;
  scope: 'once' | 'onward';
}

function resolveStepped(
  base: number | null,
  overrides: SteppedOverride[],
  targetKey: number
): number | null {
  // A `once` override for the exact target period wins outright.
  const once = overrides.find((o) => o.scope === 'once' && o.key === targetKey);
  if (once) return once.amount;

  // Otherwise take the latest `onward` change at or before the target.
  let value = base;
  let bestKey = Number.NEGATIVE_INFINITY;
  for (const o of overrides) {
    if (o.scope === 'onward' && o.key <= targetKey && o.key > bestKey) {
      bestKey = o.key;
      value = o.amount;
    }
  }
  return value;
}

const monthKey = (year: number, month: number) => year * 12 + (month - 1);

/** The effective cap for an item in a given period. `null` = untracked/unlimited. */
export function effectiveCap(item: Item, year: number, month: number): number | null {
  if (item.period === 'yearly') {
    const overrides = item.capOverrides.map((o) => ({
      key: o.year,
      amount: o.amount,
      scope: o.scope,
    }));
    return resolveStepped(item.base, overrides, year);
  }
  const overrides = item.capOverrides.map((o) => ({
    key: monthKey(o.year, o.month),
    amount: o.amount,
    scope: o.scope,
  }));
  return resolveStepped(item.base, overrides, monthKey(year, month));
}

/* ------------------------------------------------------------------ */
/* Plan shape (yearly items only)                                      */
/* ------------------------------------------------------------------ */

/** The default per-month plan amount for a yearly item in a given year. */
export function monthlyBaseFor(item: Item, year: number): number | null {
  if (item.period !== 'yearly') return effectiveCap(item, year, 1);
  if (item.monthlyBase != null) return item.monthlyBase;
  const cap = effectiveCap(item, year, 1);
  return cap == null ? null : Math.round(cap / 12);
}

/** The planned spend for a single month of a yearly item. */
export function effectivePlan(item: Item, year: number, month: number): number {
  if (item.period !== 'yearly') {
    return effectiveCap(item, year, month) ?? 0;
  }
  // A `once` plan override for this exact month wins.
  const once = item.planOverrides.find(
    (o) => o.scope === 'once' && o.year === year && o.month === month
  );
  if (once) return once.amount;

  // Otherwise the latest `onward` override for this month-of-year.
  let value: number | null = null;
  let bestYear = Number.NEGATIVE_INFINITY;
  for (const o of item.planOverrides) {
    if (o.scope === 'onward' && o.month === month && o.year <= year && o.year > bestYear) {
      bestYear = o.year;
      value = o.amount;
    }
  }
  if (value != null) return value;

  return monthlyBaseFor(item, year) ?? 0;
}

/** The sum of the 12 monthly plan amounts for a yearly item. */
export function planTotal(item: Item, year: number): number {
  let total = 0;
  for (let m = 1; m <= 12; m += 1) total += effectivePlan(item, year, m);
  return total;
}

/**
 * Drift: how far the plan's shape overshoots (or undershoots) the cap.
 * Shown quietly, never enforced. `null` when the item has no cap.
 */
export function drift(item: Item, year: number): number | null {
  if (item.period !== 'yearly') return null;
  const cap = effectiveCap(item, year, 1);
  if (cap == null) return null;
  return planTotal(item, year) - cap;
}

/* ------------------------------------------------------------------ */
/* Transaction aggregation                                             */
/* ------------------------------------------------------------------ */

function inYear(txn: Transaction, year: number): boolean {
  return parseYMD(txn.date).year === year;
}

function inMonth(txn: Transaction, year: number, month: number): boolean {
  const d = parseYMD(txn.date);
  return d.year === year && d.month === month;
}

/* ------------------------------------------------------------------ */
/* Pace: expected spend by a given date                                */
/* ------------------------------------------------------------------ */

/**
 * Cumulative planned spend from the period's start through `ref`.
 * Yearly: months already elapsed count in full, the current month is prorated.
 * Monthly: the cap prorated linearly across the month.
 */
export function expectedByDate(item: Item, ref: YMD): number | null {
  if (item.period === 'yearly') {
    let total = 0;
    for (let m = 1; m < ref.month; m += 1) total += effectivePlan(item, ref.year, m);
    const dim = daysInMonth(ref.year, ref.month);
    total += Math.round(effectivePlan(item, ref.year, ref.month) * (ref.day / dim));
    return total;
  }
  const cap = effectiveCap(item, ref.year, ref.month);
  if (cap == null) return null;
  const dim = daysInMonth(ref.year, ref.month);
  return Math.round(cap * (ref.day / dim));
}

/* ------------------------------------------------------------------ */
/* The per-item summary the UI reads                                   */
/* ------------------------------------------------------------------ */

export interface ItemStats {
  itemId: string;
  period: Item['period'];
  year: number;
  month: number | null; // set for monthly items
  cap: number | null; // effective cap for the current period
  spent: number; // actual, whole current period
  planned: number; // planned, whole current period
  free: number | null; // cap - spent - planned
  expected: number | null; // pace target as of `ref`
  spentToDate: number; // actual dated on/before `ref` (for pace)
  pace: number | null; // spentToDate - expected (>0 = ahead of plan)
  planTotal: number | null; // yearly: sum of plan; monthly: cap
  drift: number | null; // yearly only
  txnCount: number;
}

export function computeItemStats(
  item: Item,
  txns: Transaction[],
  ref: YMD = todayYMD()
): ItemStats {
  const refISO = `${ref.year}-${ref.month.toString().padStart(2, '0')}-${ref.day
    .toString()
    .padStart(2, '0')}`;

  const inPeriod = (t: Transaction) =>
    item.period === 'yearly' ? inYear(t, ref.year) : inMonth(t, ref.year, ref.month);

  let spent = 0;
  let planned = 0;
  let spentToDate = 0;
  let txnCount = 0;
  for (const t of txns) {
    if (!inPeriod(t)) continue;
    txnCount += 1;
    if (t.status === 'planned') {
      planned += t.amount;
    } else {
      spent += t.amount;
      if (t.date <= refISO) spentToDate += t.amount;
    }
  }

  const cap =
    item.period === 'yearly'
      ? effectiveCap(item, ref.year, 1)
      : effectiveCap(item, ref.year, ref.month);
  const expected = expectedByDate(item, ref);
  const free = cap == null ? null : cap - spent - planned;
  const pace = expected == null ? null : spentToDate - expected;

  return {
    itemId: item.id,
    period: item.period,
    year: ref.year,
    month: item.period === 'monthly' ? ref.month : null,
    cap,
    spent,
    planned,
    free,
    expected,
    spentToDate,
    pace,
    planTotal: item.period === 'yearly' ? planTotal(item, ref.year) : cap,
    drift: drift(item, ref.year),
    txnCount,
  };
}

/* ------------------------------------------------------------------ */
/* Burn-down curve (Item screen)                                       */
/* ------------------------------------------------------------------ */

export interface BurndownPoint {
  t: number; // 0..1 position across the period
  v: number; // cumulative cents
}

export interface Burndown {
  cap: number | null;
  todayT: number;
  planLine: BurndownPoint[]; // the plan's shape
  actualLine: BurndownPoint[]; // cumulative actual up to today
  committedLine: BurndownPoint[]; // actual + future planned (the cliff you've committed to)
  maxV: number;
}

export function buildBurndown(item: Item, txns: Transaction[], ref: YMD = todayYMD()): Burndown {
  const cap =
    item.period === 'yearly'
      ? effectiveCap(item, ref.year, 1)
      : effectiveCap(item, ref.year, ref.month);

  const yearly = item.period === 'yearly';
  const periodDays = yearly ? daysInYear(ref.year) : daysInMonth(ref.year, ref.month);

  // Fraction of the period elapsed as of `ref`.
  const elapsed = yearly ? dayOfYear(ref) : ref.day;
  const todayT = Math.min(1, elapsed / periodDays);

  // Plan line: cumulative plan at each month boundary (yearly) or linear (monthly).
  const planLine: BurndownPoint[] = [{ t: 0, v: 0 }];
  if (yearly) {
    let cum = 0;
    let dayCursor = 0;
    for (let m = 1; m <= 12; m += 1) {
      cum += effectivePlan(item, ref.year, m);
      dayCursor += daysInMonth(ref.year, m);
      planLine.push({ t: dayCursor / periodDays, v: cum });
    }
  } else {
    planLine.push({ t: 1, v: cap ?? 0 });
  }

  const dateT = (iso: string): number => {
    const d = parseYMD(iso);
    const day = yearly ? dayOfYear(d) : d.day;
    return Math.min(1, Math.max(0, day / periodDays));
  };

  const inPeriod = (t: Transaction) =>
    yearly ? parseYMD(t.date).year === ref.year : inMonth(t, ref.year, ref.month);

  const refISO = `${ref.year}-${ref.month.toString().padStart(2, '0')}-${ref.day
    .toString()
    .padStart(2, '0')}`;

  const actualTxns = txns
    .filter((t) => inPeriod(t) && t.status === 'actual' && t.date <= refISO)
    .sort((a, b) => a.date.localeCompare(b.date));
  const futureTxns = txns
    .filter((t) => inPeriod(t) && (t.status === 'planned' || t.date > refISO))
    .sort((a, b) => a.date.localeCompare(b.date));

  const actualLine: BurndownPoint[] = [{ t: 0, v: 0 }];
  let cum = 0;
  for (const t of actualTxns) {
    cum += t.amount;
    actualLine.push({ t: dateT(t.date), v: cum });
  }
  // Extend the actual line flat to "today" so the marker sits on the curve.
  actualLine.push({ t: todayT, v: cum });

  const committedLine: BurndownPoint[] = [{ t: todayT, v: cum }];
  let cum2 = cum;
  for (const t of futureTxns) {
    cum2 += t.amount;
    committedLine.push({ t: Math.max(todayT, dateT(t.date)), v: cum2 });
  }

  const maxV = Math.max(cap ?? 0, cum2, ...planLine.map((p) => p.v), 1);

  return { cap, todayT, planLine, actualLine, committedLine, maxV };
}
