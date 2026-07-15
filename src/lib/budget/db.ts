/**
 * IndexedDB persistence via Dexie.
 *
 * Why IndexedDB and not localStorage: Safari evicts script-writable storage
 * after ~7 days without interaction unless the site is installed, and
 * localStorage caps around 5MB. For data you keep for years that's
 * disqualifying. We also request persistent storage on first load.
 */

import Dexie, { type Table } from 'dexie';
import type { Item, Transaction } from './types';
import { SCHEMA_VERSION, UNCATEGORIZED_ID } from './types';
import { nowISO, newId } from './id';

export class BudgetDB extends Dexie {
  items!: Table<Item, string>;
  transactions!: Table<Transaction, string>;

  constructor() {
    super('budget');
    this.version(1).stores({
      // Indexes: primary key + the fields we filter/sort on.
      items: 'id, archived, sortKey',
      transactions: 'id, itemId, date, status',
    });
  }
}

let _db: BudgetDB | null = null;

export function getDB(): BudgetDB {
  if (!_db) _db = new BudgetDB();
  return _db;
}

/** The always-present Uncategorized escape hatch. Never archived, never deleted. */
export function makeUncategorized(): Item {
  return {
    id: UNCATEGORIZED_ID,
    name: 'Uncategorized',
    period: 'monthly',
    base: null,
    monthlyBase: null,
    capOverrides: [],
    planOverrides: [],
    archived: false,
    system: true,
    createdAt: nowISO(),
    sortKey: Number.MAX_SAFE_INTEGER, // always sorts last
  };
}

/** Ensure the DB has its seed data and request persistent storage. */
export async function ensureSeed(): Promise<void> {
  const db = getDB();
  const existing = await db.items.get(UNCATEGORIZED_ID);
  if (!existing) {
    await db.items.put(makeUncategorized());
  }
  await requestPersistence();
}

export async function requestPersistence(): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    }
  } catch {
    /* best effort */
  }
  return false;
}

export interface Snapshot {
  items: Item[];
  transactions: Transaction[];
}

export async function loadSnapshot(): Promise<Snapshot> {
  const db = getDB();
  const [items, transactions] = await Promise.all([db.items.toArray(), db.transactions.toArray()]);
  return { items, transactions };
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

export async function putItem(item: Item): Promise<void> {
  await getDB().items.put(item);
}

export async function putTransaction(txn: Transaction): Promise<void> {
  await getDB().transactions.put(txn);
}

export async function deleteTransaction(id: string): Promise<void> {
  await getDB().transactions.delete(id);
}

/** Items are archived, never deleted — deletion breaks history. */
export async function archiveItem(id: string): Promise<void> {
  if (id === UNCATEGORIZED_ID) return;
  await getDB().items.update(id, { archived: true });
}

export async function replaceAll(snapshot: Snapshot): Promise<void> {
  const db = getDB();
  await db.transaction('rw', db.items, db.transactions, async () => {
    await db.items.clear();
    await db.transactions.clear();
    await db.items.bulkPut(snapshot.items);
    await db.transactions.bulkPut(snapshot.transactions);
  });
  // Guarantee the escape hatch survives an import that omitted it.
  const uncat = await db.items.get(UNCATEGORIZED_ID);
  if (!uncat) await db.items.put(makeUncategorized());
}

export { SCHEMA_VERSION, UNCATEGORIZED_ID, newId, nowISO };
