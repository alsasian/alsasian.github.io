/**
 * Core data types for the Budget tool.
 *
 * Design notes (see /budget design doc):
 * - Money is ALWAYS integer cents. Never floats.
 * - Three objects only: Item, Transaction, and budget overrides carried on Item.
 * - No hierarchy, no labels, no income/accounts. This is a spending tool.
 */

export type Period = 'monthly' | 'yearly';

export type TxnStatus = 'actual' | 'planned';

/**
 * Override scope, borrowed from calendar-event semantics.
 * - `once`   → "Just this period" (December is $150 because winter sale, snaps back).
 * - `onward` → "From this period on" (the budget genuinely changed).
 */
export type OverrideScope = 'once' | 'onward';

/**
 * A change to an item's cap (the headline budget).
 * - Monthly item: keyed by (year, month) — a specific month's budget.
 * - Yearly item:  keyed by year (month is ignored, stored as 1) — that year's cap.
 */
export interface CapOverride {
  year: number;
  month: number; // 1-12 for monthly items; 1 (unused) for yearly items
  amount: number; // cents
  scope: OverrideScope;
}

/**
 * Yearly items only: shapes the spending PLAN across the 12 months.
 * The plan is what makes "pace" mean something for lumpy yearly spend.
 */
export interface PlanOverride {
  year: number;
  month: number; // 1-12
  amount: number; // cents
  scope: OverrideScope;
}

export interface Item {
  id: string;
  name: string;
  period: Period;
  /**
   * The cap — the per-period budget.
   * - monthly: the budget for one month.
   * - yearly:  the budget for the whole year.
   * `null` = tracked but not limited.
   */
  base: number | null;
  /**
   * Yearly items only: the default per-MONTH plan amount ($35/mo in the docs).
   * The plan curve is built from this + planOverrides; its total is compared
   * against `base` to surface drift. `null` = derive as base / 12.
   */
  monthlyBase: number | null;
  capOverrides: CapOverride[];
  planOverrides: PlanOverride[];
  archived: boolean;
  /** The one special item: Uncategorized. Cannot be archived or deleted. */
  system: boolean;
  createdAt: string; // ISO timestamp
  sortKey: number; // for stable ordering; MRU is computed separately from txns
}

export type RecurrenceUnit = 'month' | 'year';

export interface Recurrence {
  every: RecurrenceUnit;
  interval: number; // e.g. 1 = every month
}

export interface Transaction {
  id: string;
  itemId: string;
  amount: number; // integer cents. Negative = refund.
  date: string; // YYYY-MM-DD (may be in the future)
  status: TxnStatus;
  note?: string;
  recurrence?: Recurrence | null;
  createdAt: string; // ISO timestamp
}

/** The canonical export shape. `schemaVersion` is present from day one. */
export interface BudgetExport {
  schemaVersion: number;
  exportedAt: string;
  items: Item[];
  transactions: Transaction[];
}

export const SCHEMA_VERSION = 1;

export const UNCATEGORIZED_ID = 'uncategorized';
