import { useAtomValue, useSetAtom } from 'jotai';
import {
  budgetedItemsAtom,
  statsByItemAtom,
  aggregateFreeAtom,
  confirmInboxAtom,
  visibleItemsAtom,
  navAtom,
} from '@/lib/budget/atoms';
import { UNCATEGORIZED_ID } from '@/lib/budget/types';
import { formatMoney, formatMoneyCompact } from '@/lib/budget/money';
import { formatMonthYear, todayYMD } from '@/lib/budget/dates';
import PaceBar from './shared/PaceBar';
import { paceLabel } from './shared/paceLabel';

export default function HomeScreen() {
  const items = useAtomValue(budgetedItemsAtom);
  const allVisible = useAtomValue(visibleItemsAtom);
  const stats = useAtomValue(statsByItemAtom);
  const free = useAtomValue(aggregateFreeAtom);
  const inbox = useAtomValue(confirmInboxAtom);
  const setNav = useSetAtom(navAtom);
  const { year, month } = todayYMD();

  const uncategorized = allVisible.find((i) => i.id === UNCATEGORIZED_ID);
  const uncatStats = uncategorized ? stats.get(uncategorized.id) : undefined;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-28 pt-4">
      {/* Title row */}
      <header className="mb-3 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{formatMonthYear(year, month)}</h1>
        <button
          type="button"
          onClick={() => setNav({ screen: 'settings' })}
          className="rounded-md px-2 py-1 text-sm text-gray-500 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          aria-label="Settings"
        >
          ⚙
        </button>
      </header>

      {/* Confirm nudge */}
      {inbox.length > 0 && (
        <button
          type="button"
          onClick={() => setNav({ screen: 'confirm' })}
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-left text-sm no-underline dark:border-gray-700 dark:bg-gray-800/60"
        >
          <span className="font-semibold">⚠ {inbox.length} to confirm</span>
          <span className="text-gray-500 dark:text-gray-400" aria-hidden>
            →
          </span>
        </button>
      )}

      {/* Free number */}
      {free != null && (
        <div className="mb-5">
          <div className="text-3xl font-bold">{formatMoney(free)} free</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            after everything spent and planned
          </div>
        </div>
      )}

      {/* Item list */}
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No items yet. Add a spend to get started.
          </p>
        )}
        {items.map((item) => {
          const s = stats.get(item.id);
          if (!s) return null;
          const pace = paceLabel(s.pace);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setNav({ screen: 'item', itemId: item.id })}
              className="w-full py-3 text-left no-underline"
            >
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-semibold">{item.name}</span>
                <span className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {item.period}
                </span>
              </div>
              <PaceBar spent={s.spent} cap={s.cap} expected={s.expected} />
              <div className="mt-1.5 flex items-baseline justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatMoney(s.spent)}
                  {s.cap != null && (
                    <span className="text-gray-400 dark:text-gray-500">
                      {' / '}
                      {formatMoneyCompact(s.cap)}
                    </span>
                  )}
                  {s.planned !== 0 && (
                    <span className="text-gray-400 dark:text-gray-500">
                      {' · '}
                      {formatMoney(s.planned)} planned
                    </span>
                  )}
                </span>
                {pace && (
                  <span
                    className={
                      pace.ahead
                        ? 'font-semibold text-gray-900 dark:text-gray-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  >
                    {pace.text}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Uncategorized escape hatch */}
        {uncategorized && uncatStats && uncatStats.txnCount > 0 && (
          <button
            type="button"
            onClick={() => setNav({ screen: 'item', itemId: uncategorized.id })}
            className="w-full py-3 text-left no-underline"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-gray-600 dark:text-gray-400">Uncategorized</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatMoney(uncatStats.spent)} · {uncatStats.txnCount} txn
                {uncatStats.txnCount === 1 ? '' : 's'}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Add FAB */}
      <button
        type="button"
        onClick={() => setNav({ screen: 'entry' })}
        className="fixed bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gray-900 text-2xl text-white no-underline shadow-elevated dark:bg-gray-100 dark:text-gray-900 dark:shadow-elevated-dark"
        aria-label="Add spend"
      >
        +
      </button>
    </div>
  );
}
