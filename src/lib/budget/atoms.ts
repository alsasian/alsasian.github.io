/**
 * Jotai state for the Budget tool.
 *
 * Dexie is the source of truth. We hold a full in-memory snapshot (a personal
 * budget is small) and write through to IndexedDB on every mutation, then
 * reload so derived state stays honest.
 */

import { atom, type Setter } from 'jotai';
import type { Item, Transaction, TxnStatus } from './types';
import { UNCATEGORIZED_ID } from './types';
import { computeItemStats, type ItemStats } from './engine';
import { todayISO, todayYMD, parseYMD, addMonths, addYears, toISODate } from './dates';
import { newId, nowISO } from './id';
import {
  loadSnapshot,
  putItem,
  putTransaction,
  deleteTransaction,
  archiveItem as dbArchiveItem,
  replaceAll,
  ensureSeed,
  type Snapshot,
} from './db';

/* ------------------------------------------------------------------ */
/* Base state                                                          */
/* ------------------------------------------------------------------ */

export const snapshotAtom = atom<Snapshot>({ items: [], transactions: [] });
export const loadedAtom = atom<boolean>(false);

/** Load (and seed) from IndexedDB. Call once on mount. */
export const initAtom = atom(null, async (_get, set) => {
  await ensureSeed();
  const snap = await loadSnapshot();
  set(snapshotAtom, snap);
  set(loadedAtom, true);
});

const reload = async (set: Setter) => {
  const snap = await loadSnapshot();
  set(snapshotAtom, snap);
};

/* ------------------------------------------------------------------ */
/* Derived reads                                                       */
/* ------------------------------------------------------------------ */

export const itemsAtom = atom((get) => get(snapshotAtom).items);
export const transactionsAtom = atom((get) => get(snapshotAtom).transactions);

export const itemsByIdAtom = atom((get) => {
  const map = new Map<string, Item>();
  for (const it of get(itemsAtom)) map.set(it.id, it);
  return map;
});

/** Non-archived items, Uncategorized always last. For the Home list. */
export const visibleItemsAtom = atom((get) => {
  const items = get(itemsAtom).filter((i) => !i.archived);
  return items.sort((a, b) => {
    if (a.system !== b.system) return a.system ? 1 : -1;
    if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
    return a.createdAt.localeCompare(b.createdAt);
  });
});

/** Budgeted items only (Uncategorized excluded) — the ones with bars. */
export const budgetedItemsAtom = atom((get) =>
  get(visibleItemsAtom).filter((i) => i.id !== UNCATEGORIZED_ID)
);

export const transactionsByItemAtom = atom((get) => {
  const map = new Map<string, Transaction[]>();
  for (const t of get(transactionsAtom)) {
    const list = map.get(t.itemId) ?? [];
    list.push(t);
    map.set(t.itemId, list);
  }
  return map;
});

export const statsByItemAtom = atom((get) => {
  const byItem = get(transactionsByItemAtom);
  const ref = todayYMD();
  const map = new Map<string, ItemStats>();
  for (const item of get(itemsAtom)) {
    map.set(item.id, computeItemStats(item, byItem.get(item.id) ?? [], ref));
  }
  return map;
});

/** Aggregate free across all items that carry a cap. */
export const aggregateFreeAtom = atom((get) => {
  const stats = get(statsByItemAtom);
  let total = 0;
  let any = false;
  for (const it of get(budgetedItemsAtom)) {
    const s = stats.get(it.id);
    if (s?.free != null) {
      total += s.free;
      any = true;
    }
  }
  return any ? total : null;
});

/** Planned transactions whose date has already passed — the confirm inbox. */
export const confirmInboxAtom = atom((get) => {
  const today = todayISO();
  return get(transactionsAtom)
    .filter((t) => t.status === 'planned' && t.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));
});

/** Planned transactions still in the future — the wishlist / upcoming view. */
export const upcomingAtom = atom((get) => {
  const today = todayISO();
  return get(transactionsAtom)
    .filter((t) => t.status === 'planned' && t.date > today)
    .sort((a, b) => a.date.localeCompare(b.date));
});

/**
 * Entry-screen chips, most-recently-used first. Ranked by the latest txn date
 * for each item, falling back to creation order. Uncategorized always available.
 */
export const mruItemsAtom = atom((get) => {
  const txns = get(transactionsAtom);
  const lastUsed = new Map<string, string>();
  for (const t of txns) {
    const prev = lastUsed.get(t.itemId);
    if (!prev || t.date > prev) lastUsed.set(t.itemId, t.date);
  }
  const items = get(itemsAtom).filter((i) => !i.archived);
  return items.sort((a, b) => {
    if (a.id === UNCATEGORIZED_ID) return 1;
    if (b.id === UNCATEGORIZED_ID) return -1;
    const la = lastUsed.get(a.id) ?? '';
    const lb = lastUsed.get(b.id) ?? '';
    if (la !== lb) return lb.localeCompare(la);
    return a.createdAt.localeCompare(b.createdAt);
  });
});

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type ScreenName =
  | 'home'
  | 'entry'
  | 'item'
  | 'confirm'
  | 'settings'
  | 'newItem'
  | 'upcoming';

export interface NavState {
  screen: ScreenName;
  itemId?: string;
  prefillItemId?: string;
  editTxnId?: string; // when set on the entry screen, edit this txn instead of adding
}

export const navAtom = atom<NavState>({ screen: 'home' });

/** The captured `beforeinstallprompt` event, if the browser offered one. */
export interface InstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}
export const installPromptAtom = atom<InstallPrompt | null>(null);

export const goHomeAtom = atom(null, (_get, set) => set(navAtom, { screen: 'home' }));

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

export interface NewTxnInput {
  itemId: string;
  amount: number; // cents
  date: string; // YYYY-MM-DD
  status: TxnStatus;
  note?: string;
  recurrence?: Transaction['recurrence'];
}

export const addTransactionAtom = atom(null, async (_get, set, input: NewTxnInput) => {
  const txn: Transaction = {
    id: newId(),
    itemId: input.itemId,
    amount: input.amount,
    date: input.date,
    status: input.status,
    note: input.note?.trim() ? input.note.trim() : undefined,
    recurrence: input.recurrence ?? null,
    createdAt: nowISO(),
  };
  await putTransaction(txn);
  await reload(set);
  return txn;
});

export const updateTransactionAtom = atom(
  null,
  async (get, set, patch: { id: string } & Partial<Transaction>) => {
    const existing = get(transactionsAtom).find((t) => t.id === patch.id);
    if (!existing) return;
    await putTransaction({ ...existing, ...patch });
    await reload(set);
  }
);

export const deleteTransactionAtom = atom(null, async (_get, set, id: string) => {
  await deleteTransaction(id);
  await reload(set);
});

/**
 * Confirm a planned transaction: it becomes actual (amount may be adjusted for
 * price moves). If it recurs, spawn the next planned occurrence.
 */
export const confirmTransactionAtom = atom(
  null,
  async (get, set, input: { id: string; amount?: number }) => {
    const existing = get(transactionsAtom).find((t) => t.id === input.id);
    if (!existing) return;
    const confirmed: Transaction = {
      ...existing,
      status: 'actual',
      amount: input.amount ?? existing.amount,
      recurrence: null,
    };
    await putTransaction(confirmed);

    if (existing.recurrence) {
      const ymd = parseYMD(existing.date);
      const nextYmd =
        existing.recurrence.every === 'year'
          ? addYears(ymd, existing.recurrence.interval)
          : addMonths(ymd, existing.recurrence.interval);
      const next: Transaction = {
        ...existing,
        id: newId(),
        date: toISODate(nextYmd),
        status: 'planned',
        createdAt: nowISO(),
      };
      await putTransaction(next);
    }
    await reload(set);
  }
);

export const saveItemAtom = atom(null, async (_get, set, item: Item) => {
  await putItem(item);
  await reload(set);
});

export const archiveItemAtom = atom(null, async (_get, set, id: string) => {
  await dbArchiveItem(id);
  await reload(set);
});

export interface NewItemInput {
  name: string;
  period: Item['period'];
  base: number | null;
  monthlyBase?: number | null;
}

export const createItemAtom = atom(null, async (get, set, input: NewItemInput) => {
  const count = get(itemsAtom).length;
  const item: Item = {
    id: newId(),
    name: input.name.trim(),
    period: input.period,
    base: input.base,
    monthlyBase: input.monthlyBase ?? null,
    capOverrides: [],
    planOverrides: [],
    archived: false,
    system: false,
    createdAt: nowISO(),
    sortKey: count,
  };
  await putItem(item);
  await reload(set);
  return item;
});

/** Move a budgeted item up/down in the Home order, persisting sortKeys. */
export const reorderItemAtom = atom(
  null,
  async (get, set, input: { id: string; direction: -1 | 1 }) => {
    const ordered = get(budgetedItemsAtom);
    const idx = ordered.findIndex((i) => i.id === input.id);
    const swapWith = idx + input.direction;
    if (idx < 0 || swapWith < 0 || swapWith >= ordered.length) return;
    // Normalize every item's sortKey to its position, then swap the pair.
    const positions = ordered.map((it, i) => ({ it, key: i }));
    positions[idx].key = swapWith;
    positions[swapWith].key = idx;
    for (const { it, key } of positions) {
      if (it.sortKey !== key) await putItem({ ...it, sortKey: key });
    }
    await reload(set);
  }
);

export const importSnapshotAtom = atom(null, async (_get, set, snapshot: Snapshot) => {
  await replaceAll(snapshot);
  await reload(set);
});
