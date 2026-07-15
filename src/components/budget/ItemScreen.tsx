import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  itemsByIdAtom,
  transactionsByItemAtom,
  statsByItemAtom,
  deleteTransactionAtom,
  goHomeAtom,
  navAtom,
} from '@/lib/budget/atoms';
import { buildBurndown } from '@/lib/budget/engine';
import { formatMoney, formatMoneyCompact } from '@/lib/budget/money';
import { effectivePlan, monthlyBaseFor } from '@/lib/budget/engine';
import { parseYMD, monthLong, monthShort, formatDayMonth, todayYMD } from '@/lib/budget/dates';
import type { Transaction } from '@/lib/budget/types';
import BurndownChart from './shared/Burndown';
import BudgetEditor from './BudgetEditor';
import { paceLabel } from './shared/paceLabel';

export default function ItemScreen() {
  const nav = useAtomValue(navAtom);
  const itemsById = useAtomValue(itemsByIdAtom);
  const txnsByItem = useAtomValue(transactionsByItemAtom);
  const stats = useAtomValue(statsByItemAtom);
  const goHome = useSetAtom(goHomeAtom);
  const delTxn = useSetAtom(deleteTransactionAtom);
  const [editing, setEditing] = useState(false);

  const item = nav.itemId ? itemsById.get(nav.itemId) : undefined;
  const txns = useMemo(
    () => (item ? [...(txnsByItem.get(item.id) ?? [])] : []),
    [item, txnsByItem]
  );
  const ref = todayYMD();
  const burndown = useMemo(() => (item ? buildBurndown(item, txns, ref) : null), [item, txns, ref]);

  if (!item) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <button type="button" onClick={goHome} className="text-sm no-underline">
          ← Back
        </button>
        <p className="mt-4 text-gray-500">Item not found.</p>
      </div>
    );
  }

  const s = stats.get(item.id);
  const pace = paceLabel(s?.pace ?? null);
  const yearly = item.period === 'yearly';

  // Group transactions by year-month, newest first.
  const groups = new Map<string, Transaction[]>();
  for (const t of [...txns].sort((a, b) => b.date.localeCompare(a.date))) {
    const d = parseYMD(t.date);
    const key = `${d.year}-${d.month.toString().padStart(2, '0')}`;
    const list = groups.get(key) ?? [];
    list.push(t);
    groups.set(key, list);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-12 pt-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goHome}
            className="rounded-md px-1 py-1 text-lg text-gray-500 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">{item.name}</h1>
        </div>
        <span className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {item.period}
        </span>
      </div>

      {/* Burn-down */}
      {burndown && (item.base != null || txns.length > 0) && (
        <div className="mb-3 rounded-xl border border-gray-200 p-2 dark:border-gray-800">
          <BurndownChart data={burndown} />
          <div className="flex justify-between px-1 text-[10px] text-gray-400 dark:text-gray-500">
            <span>{yearly ? 'Jan' : '1'}</span>
            <span>today</span>
            <span>{yearly ? 'Dec' : monthShort(ref.month)}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      {s && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formatMoney(s.spent)} spent
            {s.planned !== 0 && <> · {formatMoney(s.planned)} planned</>}
          </div>
          <div className="mt-0.5 flex items-baseline gap-3">
            {s.free != null && (
              <span className="text-2xl font-bold">{formatMoney(s.free)} free</span>
            )}
            {pace && (
              <span
                className={
                  pace.ahead
                    ? 'text-sm font-semibold text-gray-900 dark:text-gray-100'
                    : 'text-sm text-gray-500 dark:text-gray-400'
                }
              >
                {pace.text}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Budget */}
      {!item.system && (
        <div className="mb-4">
          {editing ? (
            <BudgetEditor item={item} onClose={() => setEditing(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 text-left text-sm no-underline dark:border-gray-800"
            >
              <span>
                <span className="text-gray-500 dark:text-gray-400">Budget </span>
                <span className="font-semibold">
                  {item.base != null
                    ? `${formatMoneyCompact(s?.cap ?? item.base)} / ${yearly ? 'year' : 'month'}`
                    : 'not limited'}
                </span>
                {yearly && item.base != null && (
                  <span className="block text-xs text-gray-400 dark:text-gray-500">
                    base {formatMoneyCompact(monthlyBaseFor(item, ref.year) ?? 0)}/mo
                    {overridesSummary(item, ref.year)}
                  </span>
                )}
              </span>
              <span aria-hidden>✎</span>
            </button>
          )}
        </div>
      )}

      {/* Transactions */}
      <div className="flex flex-col gap-4">
        {[...groups.entries()].map(([key, list]) => {
          const [gy, gm] = key.split('-').map((n) => Number.parseInt(n, 10));
          return (
            <div key={key}>
              <div className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {monthLong(gm)} {gy}
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {list.map((t) => (
                  <TxnRow key={t.id} txn={t} onDelete={() => delTxn(t.id)} />
                ))}
              </div>
            </div>
          );
        })}
        {txns.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No transactions yet.
          </p>
        )}
      </div>
    </div>
  );
}

function overridesSummary(item: Parameters<typeof effectivePlan>[0], year: number): string {
  const base = monthlyBaseFor(item, year);
  const parts: string[] = [];
  for (let m = 1; m <= 12; m += 1) {
    const amt = effectivePlan(item, year, m);
    if (base == null || amt !== base) parts.push(`${monthShort(m)} ${formatMoneyCompact(amt)}`);
  }
  return parts.length ? ` · ${parts.join(' · ')}` : '';
}

function TxnRow({ txn, onDelete }: { txn: Transaction; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-12 tabular-nums text-gray-400 dark:text-gray-500">
          {formatDayMonth(txn.date)}
        </span>
        <span className={txn.status === 'planned' ? 'text-gray-500 dark:text-gray-400' : ''}>
          {txn.note || '—'}
          {txn.status === 'planned' && (
            <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">planned</span>
          )}
          {txn.recurrence && (
            <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">↻</span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="tabular-nums">{formatMoney(txn.amount)}</span>
        {confirming ? (
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-gray-500 no-underline dark:text-gray-400"
          >
            delete?
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            onBlur={() => setConfirming(false)}
            className="text-gray-300 no-underline hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300"
            aria-label="Delete transaction"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
