/**
 * Export / import. JSON is canonical and carries a schemaVersion from day one.
 * Persistent storage is a request, not a guarantee — so exporting matters.
 */

import type { BudgetExport, Item, Transaction } from './types';
import { SCHEMA_VERSION } from './types';
import { nowISO } from './id';
import type { Snapshot } from './db';

export function buildExport(snapshot: Snapshot): BudgetExport {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: nowISO(),
    items: snapshot.items,
    transactions: snapshot.transactions,
  };
}

export function serializeExport(snapshot: Snapshot): string {
  return JSON.stringify(buildExport(snapshot), null, 2);
}

export interface ParseResult {
  ok: boolean;
  snapshot?: Snapshot;
  error?: string;
}

export function parseImport(json: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Not valid JSON.' };
  }
  if (typeof data !== 'object' || data === null) {
    return { ok: false, error: 'Unexpected file shape.' };
  }
  const d = data as Partial<BudgetExport>;
  if (!Array.isArray(d.items) || !Array.isArray(d.transactions)) {
    return { ok: false, error: 'Missing items or transactions.' };
  }
  if (d.schemaVersion !== SCHEMA_VERSION) {
    return {
      ok: false,
      error: `Unsupported schema version ${String(d.schemaVersion)} (expected ${SCHEMA_VERSION}).`,
    };
  }
  return {
    ok: true,
    snapshot: {
      items: d.items as Item[],
      transactions: d.transactions as Transaction[],
    },
  };
}
