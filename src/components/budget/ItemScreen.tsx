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
import {
  buildYearShape,
  effectivePlan,
  monthlyBaseFor,
  drift as driftFor,
} from '@/lib/budget/engine';
import { formatMoney, formatMoneyCompact } from '@/lib/budget/money';
import { parseYMD, monthLong, monthShort, formatDayMonth, todayYMD } from '@/lib/budget/dates';
import type { Item, Transaction } from '@/lib/budget/types';
import YearShapeChart from './shared/YearShape';
import BudgetEditor from './BudgetEditor';
import { paceLabel } from './shared/paceLabel';
import Money from './shared/Money';

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
  const shape = useMemo(() => (item ? buildYearShape(item, txns, ref) : null), [item, txns, ref]);

  if (!item) {
    return (
      <div className="b-view">
        <button type="button" className="b-back" onClick={goHome}>
          ← Back
        </button>
        <p className="b-empty">Item not found.</p>
      </div>
    );
  }

  const s = stats.get(item.id);
  const pace = paceLabel(s?.pace ?? null);
  const yearly = item.period === 'yearly';
  const hasChart = item.base != null || txns.length > 0;

  // Group transactions by year-month, newest first.
  const groups = new Map<string, Transaction[]>();
  for (const t of [...txns].sort((a, b) => b.date.localeCompare(a.date))) {
    const d = parseYMD(t.date);
    const key = `${d.year}-${d.month.toString().padStart(2, '0')}`;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(t);
  }

  return (
    <div className="b-view">
      <div className="b-ihead">
        <button type="button" className="b-back" aria-label="Back" onClick={goHome}>
          ←
        </button>
        <span className="t">{item.name}</span>
        <span className="per">{item.period}</span>
      </div>

      {/* Hero: the one number that matters, plus pace */}
      {s && (
        <div className="b-statline">
          <span className="free">
            {s.free != null ? <Money cents={s.free} /> : <Money cents={s.spent} />}
            <span className="lbl">{s.free != null ? 'free' : 'spent'}</span>
          </span>
          {pace && (
            <span className={`pace b-pace ${pace.ahead ? 'ahead' : 'behind'}`}>
              <span className="arw">{pace.ahead ? '▲' : '▼'}</span>
              {pace.text} of plan
            </span>
          )}
        </div>
      )}

      {/* Stat strip: the inputs behind the free number */}
      {s && !item.system && (
        <div className="b-stats">
          <div className="cell">
            <span className="k">Spent</span>
            <span className="v">{formatMoney(s.spent)}</span>
          </div>
          <div className="cell">
            <span className="k">Planned</span>
            <span className="v">{formatMoney(s.planned)}</span>
          </div>
          <div className="cell">
            <span className="k">{yearly ? 'Year cap' : 'Cap'}</span>
            <span className="v">{s.cap != null ? formatMoneyCompact(s.cap) : '—'}</span>
          </div>
        </div>
      )}

      {/* Year shape */}
      {shape && hasChart && <YearShapeChart data={shape} />}

      {/* Budget (editable) — drift lives here, where you'd act on it */}
      {!item.system &&
        (editing ? (
          <div style={{ marginBottom: 22 }}>
            <BudgetEditor item={item} onClose={() => setEditing(false)} />
          </div>
        ) : (
          <button type="button" className="b-budget" onClick={() => setEditing(true)}>
            <span>
              <span className="k">Budget </span>
              <span className="v">
                {item.base != null
                  ? `${formatMoneyCompact(s?.cap ?? item.base)} / ${yearly ? 'year' : 'month'}`
                  : 'not limited'}
              </span>
              {yearly && item.base != null && (
                <span className="base">
                  base {formatMoneyCompact(monthlyBaseFor(item, ref.year) ?? 0)}/mo
                  {overridesSummary(item, ref.year)}
                </span>
              )}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {yearly && item.base != null && <DriftTag item={item} year={ref.year} />}
              <span className="b-edit" aria-hidden>
                ✎
              </span>
            </span>
          </button>
        ))}

      {/* Ledger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[...groups.entries()].map(([key, list]) => {
          const [gy, gm] = key.split('-').map((n) => Number.parseInt(n, 10));
          return (
            <div key={key}>
              <p className="b-ledger-h">
                {monthLong(gm)} {gy}
              </p>
              {list.map((t) => (
                <TxnRow key={t.id} txn={t} onDelete={() => delTxn(t.id)} />
              ))}
            </div>
          );
        })}
        {txns.length === 0 && <p className="b-empty">No transactions yet.</p>}
      </div>
    </div>
  );
}

function DriftTag({ item, year }: { item: Item; year: number }) {
  const d = driftFor(item, year);
  if (d == null) return null;
  return (
    <span className="drift">
      {d === 0 ? <span className="ok">✓</span> : formatMoney(d, { sign: true })}
    </span>
  );
}

function overridesSummary(item: Item, year: number): string {
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
    <div className={`b-tx ${txn.status === 'planned' ? 'planned' : ''}`}>
      <span className="d">{formatDayMonth(txn.date)}</span>
      <span className="n">
        {txn.note || '—'}
        {txn.status === 'planned' && <span className="tag">planned</span>}
        {txn.recurrence && <span className="tag">↻</span>}
      </span>
      <span className="a">{formatMoney(txn.amount)}</span>
      {confirming ? (
        <button type="button" className="del" style={{ opacity: 1 }} onClick={onDelete}>
          delete?
        </button>
      ) : (
        <button
          type="button"
          className="del"
          aria-label="Delete transaction"
          onClick={() => setConfirming(true)}
          onBlur={() => setConfirming(false)}
        >
          ×
        </button>
      )}
    </div>
  );
}
