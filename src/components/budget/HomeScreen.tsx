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
import Meter from './shared/Meter';
import { paceLabel } from './shared/paceLabel';
import Money from './shared/Money';

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
    <div className="b-view">
      <div className="b-top">
        <span className="month">{formatMonthYear(year, month)}</span>
        <button
          type="button"
          className="b-icon"
          aria-label="Settings"
          onClick={() => setNav({ screen: 'settings' })}
        >
          ⚙
        </button>
      </div>

      {inbox.length > 0 && (
        <button type="button" className="b-confirm" onClick={() => setNav({ screen: 'confirm' })}>
          <span className="dot" />
          {inbox.length} to confirm
          <span className="arw">→</span>
        </button>
      )}

      {free != null && (
        <div className="b-hero">
          <div className="val">
            <Money cents={free} />
          </div>
          <div className="sub">free — after everything spent and planned</div>
        </div>
      )}

      <div className="b-rows">
        {items.length === 0 && <p className="b-empty">No items yet. Add a spend to get started.</p>}
        {items.map((item) => {
          const s = stats.get(item.id);
          if (!s) return null;
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
                  {s.planned !== 0 && (
                    <span className="c"> · {formatMoney(s.planned)} planned</span>
                  )}
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

        {uncategorized && uncatStats && uncatStats.txnCount > 0 && (
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
      </div>

      <button
        type="button"
        className="b-fab"
        aria-label="Add spend"
        onClick={() => setNav({ screen: 'entry' })}
      >
        +
      </button>
    </div>
  );
}
