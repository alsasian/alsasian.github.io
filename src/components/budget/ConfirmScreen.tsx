import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  confirmInboxAtom,
  itemsByIdAtom,
  confirmTransactionAtom,
  deleteTransactionAtom,
  goHomeAtom,
} from '@/lib/budget/atoms';
import { centsToInput, parseMoney, formatMoney } from '@/lib/budget/money';
import { formatDayMonth } from '@/lib/budget/dates';
import type { Transaction } from '@/lib/budget/types';

export default function ConfirmScreen() {
  const inbox = useAtomValue(confirmInboxAtom);
  const itemsById = useAtomValue(itemsByIdAtom);
  const goHome = useSetAtom(goHomeAtom);

  return (
    <div className="b-view">
      <div className="b-ihead">
        <button type="button" className="b-back" aria-label="Back" onClick={goHome}>
          ←
        </button>
        <span className="t">{inbox.length} to confirm</span>
      </div>

      {inbox.length === 0 ? (
        <p className="b-empty">Nothing to confirm. The plan is honest.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {inbox.map((txn) => (
            <ConfirmRow key={txn.id} txn={txn} itemName={itemsById.get(txn.itemId)?.name ?? '—'} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConfirmRow({ txn, itemName }: { txn: Transaction; itemName: string }) {
  const confirm = useSetAtom(confirmTransactionAtom);
  const del = useSetAtom(deleteTransactionAtom);
  const [amount, setAmount] = useState(centsToInput(txn.amount));
  const cents = parseMoney(amount);

  return (
    <div className="b-card">
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 12,
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>{txn.note || itemName}</div>
          <div className="b-label" style={{ marginTop: 4 }}>
            {itemName} · planned {formatDayMonth(txn.date)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="b-muted">$</span>
          <input
            type="text"
            inputMode="decimal"
            className="b-input mono"
            style={{ width: '5rem', textAlign: 'right' }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Amount"
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="b-btn primary block"
          disabled={cents == null}
          onClick={() => confirm({ id: txn.id, amount: cents ?? undefined })}
        >
          Confirm{cents != null && cents !== txn.amount ? ` ${formatMoney(cents)}` : ''}
        </button>
        <button type="button" className="b-btn block" onClick={() => del(txn.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
