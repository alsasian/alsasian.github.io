import { useAtomValue, useSetAtom } from 'jotai';
import { upcomingAtom, itemsByIdAtom, goHomeAtom, navAtom } from '@/lib/budget/atoms';
import { formatMoney } from '@/lib/budget/money';
import { parseYMD, monthLong, formatDayMonth } from '@/lib/budget/dates';
import type { Transaction } from '@/lib/budget/types';

export default function UpcomingScreen() {
  const upcoming = useAtomValue(upcomingAtom);
  const itemsById = useAtomValue(itemsByIdAtom);
  const goHome = useSetAtom(goHomeAtom);
  const setNav = useSetAtom(navAtom);

  // Group by year-month, soonest first.
  const groups = new Map<string, Transaction[]>();
  for (const t of upcoming) {
    const d = parseYMD(t.date);
    const key = `${d.year}-${d.month.toString().padStart(2, '0')}`;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(t);
  }
  const total = upcoming.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="b-view">
      <div className="b-ihead">
        <button type="button" className="b-back" aria-label="Back" onClick={goHome}>
          ←
        </button>
        <span className="t">Upcoming</span>
      </div>

      {upcoming.length === 0 ? (
        <p className="b-empty">
          Nothing planned yet. Add a purchase as “planned” to see whether it fits.
        </p>
      ) : (
        <>
          <div className="b-statline" style={{ marginBottom: 24 }}>
            <span className="free">
              <span className="u">$</span>
              {Math.floor(Math.abs(total) / 100).toLocaleString('en-US')}
              <span className="lbl">planned ahead</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[...groups.entries()].map(([key, list]) => {
              const [gy, gm] = key.split('-').map((n) => Number.parseInt(n, 10));
              return (
                <div key={key}>
                  <p className="b-ledger-h">
                    {monthLong(gm)} {gy}
                  </p>
                  {list.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="b-tx"
                      style={{ width: '100%', textAlign: 'left' }}
                      onClick={() => setNav({ screen: 'entry', editTxnId: t.id })}
                    >
                      <span className="d">{formatDayMonth(t.date)}</span>
                      <span className="n">
                        {t.note || itemsById.get(t.itemId)?.name || '—'}
                        {t.note && <span className="tag">{itemsById.get(t.itemId)?.name}</span>}
                      </span>
                      <span className="a">{formatMoney(t.amount)}</span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
