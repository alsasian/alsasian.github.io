import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  budgetedItemsAtom,
  statsByItemAtom,
  aggregateFreeAtom,
  confirmInboxAtom,
  upcomingAtom,
  visibleItemsAtom,
  transactionsAtom,
  navAtom,
  reorderItemAtom,
} from '@/lib/budget/atoms';
import { UNCATEGORIZED_ID } from '@/lib/budget/types';
import { formatMoney, formatMoneyCompact } from '@/lib/budget/money';
import { formatMonthYear, todayYMD } from '@/lib/budget/dates';
import { daysSinceExport } from '@/lib/budget/meta';
import Meter from './shared/Meter';
import { paceLabel } from './shared/paceLabel';
import Money from './shared/Money';

export default function HomeScreen() {
  const items = useAtomValue(budgetedItemsAtom);
  const allVisible = useAtomValue(visibleItemsAtom);
  const stats = useAtomValue(statsByItemAtom);
  const free = useAtomValue(aggregateFreeAtom);
  const inbox = useAtomValue(confirmInboxAtom);
  const upcoming = useAtomValue(upcomingAtom);
  const txns = useAtomValue(transactionsAtom);
  const setNav = useSetAtom(navAtom);
  const reorder = useSetAtom(reorderItemAtom);
  const [reordering, setReordering] = useState(false);
  const { year, month } = todayYMD();

  const uncategorized = allVisible.find((i) => i.id === UNCATEGORIZED_ID);
  const uncatStats = uncategorized ? stats.get(uncategorized.id) : undefined;
  const staleDays = daysSinceExport();
  const showBackup = txns.length >= 5 && (staleDays === null || staleDays >= 21);

  return (
    <div className="b-view fab">
      <div className="b-top">
        <span className="month">{formatMonthYear(year, month)}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {items.length > 1 && (
            <button
              type="button"
              className={`b-icon ${reordering ? 'on' : ''}`}
              aria-label="Reorder items"
              aria-pressed={reordering}
              onClick={() => setReordering((r) => !r)}
            >
              ↕
            </button>
          )}
          <button
            type="button"
            className="b-icon"
            aria-label="Settings"
            onClick={() => setNav({ screen: 'settings' })}
          >
            ⚙
          </button>
        </div>
      </div>

      {/* Attention chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {inbox.length > 0 && (
          <button type="button" className="b-confirm" onClick={() => setNav({ screen: 'confirm' })}>
            <span className="dot" />
            {inbox.length} to confirm
            <span className="arw">→</span>
          </button>
        )}
        {upcoming.length > 0 && (
          <button
            type="button"
            className="b-chip"
            onClick={() => setNav({ screen: 'upcoming' })}
            style={{ minHeight: 34 }}
          >
            {upcoming.length} upcoming →
          </button>
        )}
        {showBackup && (
          <button
            type="button"
            className="b-chip"
            onClick={() => setNav({ screen: 'settings' })}
            style={{ minHeight: 34 }}
          >
            Back up →
          </button>
        )}
      </div>

      {free != null && !reordering && (
        <div className="b-hero">
          <div className="val">
            <Money cents={free} />
          </div>
          <div className="sub">free — after everything spent and planned</div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: '40px 0',
            textAlign: 'center',
          }}
        >
          <p className="b-muted" style={{ margin: 0, fontSize: 14 }}>
            No budgets yet. A budget is a number you want to watch.
          </p>
          <button
            type="button"
            className="b-btn accent"
            onClick={() => setNav({ screen: 'newItem' })}
          >
            ＋ New budget
          </button>
          <p className="b-muted" style={{ margin: 0, fontSize: 12 }}>
            or tap ＋ to just log a spend
          </p>
        </div>
      )}

      {/* Item list */}
      <div className="b-rows">
        {items.map((item, i) => {
          const s = stats.get(item.id);
          if (!s) return null;

          if (reordering) {
            return (
              <div
                key={item.id}
                className="b-row"
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <span className="name" style={{ flex: 1 }}>
                  {item.name}
                </span>
                <button
                  type="button"
                  className="b-icon"
                  aria-label="Move up"
                  disabled={i === 0}
                  style={{ opacity: i === 0 ? 0.3 : 1 }}
                  onClick={() => reorder({ id: item.id, direction: -1 })}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="b-icon"
                  aria-label="Move down"
                  disabled={i === items.length - 1}
                  style={{ opacity: i === items.length - 1 ? 0.3 : 1 }}
                  onClick={() => reorder({ id: item.id, direction: 1 })}
                >
                  ↓
                </button>
              </div>
            );
          }

          const pace = paceLabel(s.pace);
          return (
            <button
              key={item.id}
              type="button"
              className="b-row"
              onClick={() => setNav({ screen: 'item', itemId: item.id })}
            >
              <div className="head">
                <span className="name">{item.name}</span>
                <span className="per">{item.period}</span>
              </div>
              <Meter spent={s.spent} planned={s.planned} cap={s.cap} expected={s.expected} />
              <div className="foot">
                <span className="b-fig">
                  {formatMoney(s.spent)}
                  {s.cap != null && <span className="c"> / {formatMoneyCompact(s.cap)}</span>}
                </span>
                {pace && (
                  <span className={`b-pace ${pace.ahead ? 'ahead' : 'behind'}`}>
                    <span className="arw">{pace.ahead ? '▲' : '▼'}</span>
                    {pace.text}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {uncategorized && uncatStats && uncatStats.txnCount > 0 && !reordering && (
          <button
            type="button"
            className="b-row"
            onClick={() => setNav({ screen: 'item', itemId: uncategorized.id })}
          >
            <div className="head">
              <span className="name b-muted">Uncategorized</span>
              <span className="b-fig">
                {formatMoney(uncatStats.spent)} · {uncatStats.txnCount} txn
                {uncatStats.txnCount === 1 ? '' : 's'}
              </span>
            </div>
          </button>
        )}

        {items.length > 0 && !reordering && (
          <button
            type="button"
            className="b-row b-newrow"
            onClick={() => setNav({ screen: 'newItem' })}
          >
            ＋ New budget
          </button>
        )}
      </div>

      {!reordering && (
        <button
          type="button"
          className="b-fab"
          aria-label="Add spend"
          onClick={() => setNav({ screen: 'entry' })}
        >
          +
        </button>
      )}
    </div>
  );
}
