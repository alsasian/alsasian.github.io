import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  mruItemsAtom,
  transactionsAtom,
  addTransactionAtom,
  updateTransactionAtom,
  deleteTransactionAtom,
  createItemAtom,
  goHomeAtom,
  navAtom,
} from '@/lib/budget/atoms';
import { parseMoney, formatMoney, centsToInput } from '@/lib/budget/money';
import { todayISO } from '@/lib/budget/dates';
import type { RecurrenceUnit } from '@/lib/budget/types';
import NewItemForm from './shared/NewItemForm';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];
type Repeat = 'none' | 'monthly' | 'yearly';

export default function EntryScreen() {
  const nav = useAtomValue(navAtom);
  const items = useAtomValue(mruItemsAtom);
  const txns = useAtomValue(transactionsAtom);
  const addTxn = useSetAtom(addTransactionAtom);
  const updateTxn = useSetAtom(updateTransactionAtom);
  const deleteTxn = useSetAtom(deleteTransactionAtom);
  const createItem = useSetAtom(createItemAtom);
  const goHome = useSetAtom(goHomeAtom);
  const setNav = useSetAtom(navAtom);

  const editing = nav.editTxnId ? txns.find((t) => t.id === nav.editTxnId) : undefined;
  const isEdit = !!editing;

  const [raw, setRaw] = useState(editing ? centsToInput(Math.abs(editing.amount)) : '');
  const [sign, setSign] = useState<1 | -1>(editing && editing.amount < 0 ? -1 : 1);
  const [selected, setSelected] = useState<string | null>(
    editing?.itemId ?? nav.prefillItemId ?? null
  );
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [planned, setPlanned] = useState(editing ? editing.status === 'planned' : false);
  const [note, setNote] = useState(editing?.note ?? '');
  const [repeat, setRepeat] = useState<Repeat>(
    editing?.recurrence ? (editing.recurrence.every === 'year' ? 'yearly' : 'monthly') : 'none'
  );
  const [creating, setCreating] = useState(false);

  const today = todayISO();
  const futureDate = date > today;
  const effectivePlanned = planned || futureDate;

  const magnitude = parseMoney(raw);
  const cents = magnitude == null ? null : magnitude * sign;
  const canSave = cents != null && cents !== 0;

  const press = (k: string) => {
    setRaw((prev) => {
      if (k === '⌫') return prev.slice(0, -1);
      if (k === '.') return prev.includes('.') ? prev : prev === '' ? '0.' : `${prev}.`;
      if (prev.includes('.') && prev.split('.')[1]?.length >= 2) return prev;
      return prev + k;
    });
  };

  const save = async () => {
    if (cents == null || cents === 0) return;
    const itemId = selected ?? 'uncategorized';
    const status = effectivePlanned ? 'planned' : 'actual';
    const recurrence =
      effectivePlanned && repeat !== 'none'
        ? { every: (repeat === 'yearly' ? 'year' : 'month') as RecurrenceUnit, interval: 1 }
        : null;
    if (isEdit && editing) {
      await updateTxn({
        id: editing.id,
        amount: cents,
        itemId,
        date,
        status,
        note: note.trim() || undefined,
        recurrence,
      });
      // Return to the item you were viewing rather than jumping home.
      setNav({ screen: 'item', itemId });
    } else {
      await addTxn({ itemId, amount: cents, date, status, note: note || undefined, recurrence });
      goHome();
    }
  };

  const remove = async () => {
    if (!editing) return goHome();
    const itemId = editing.itemId;
    await deleteTxn(editing.id);
    setNav({ screen: 'item', itemId });
  };

  const display = raw === '' ? '0' : raw;
  const target = selected ? items.find((i) => i.id === selected)?.name : 'Uncategorized';

  return (
    <div className="b-view">
      <div className="b-entry-top">
        <button type="button" className="b-cancel" aria-label="Cancel" onClick={goHome}>
          ×
        </button>
        {isEdit && (
          <button type="button" className="b-btn ghost" onClick={remove}>
            Delete
          </button>
        )}
        <button type="button" className="b-save" disabled={!canSave} onClick={save}>
          {isEdit ? 'Save' : 'Add'}
        </button>
      </div>

      <div className="b-amount">
        <span className="v">
          <span className="u">{sign < 0 ? '−$' : '$'}</span> {display}
        </span>
      </div>

      <div className="b-chips">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`b-chip ${selected === item.id ? 'sel' : ''}`}
            onClick={() => setSelected(item.id)}
          >
            {item.name}
          </button>
        ))}
        <button type="button" className="b-chip new" onClick={() => setCreating((c) => !c)}>
          + New
        </button>
      </div>

      {creating && (
        <NewItemForm
          style={{ marginBottom: 20 }}
          onCreate={async (input) => {
            const item = await createItem(input);
            setSelected(item.id);
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <input
          type="date"
          className="b-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Date"
        />
        <button
          type="button"
          className={`b-toggle ${sign < 0 ? 'on' : ''}`}
          onClick={() => setSign((s) => (s < 0 ? 1 : -1))}
          style={{ marginLeft: 'auto' }}
        >
          refund
        </button>
        <button
          type="button"
          className={`b-toggle ${effectivePlanned ? 'on' : ''}`}
          disabled={futureDate}
          onClick={() => !futureDate && setPlanned((p) => !p)}
        >
          {effectivePlanned ? '○ planned' : 'actual'}
        </button>
      </div>

      {effectivePlanned && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className="b-label">Repeats</span>
          {(['none', 'monthly', 'yearly'] as const).map((r) => (
            <button
              key={r}
              type="button"
              className={`b-toggle ${repeat === r ? 'on' : ''}`}
              onClick={() => setRepeat(r)}
            >
              {r === 'none' ? 'one-off' : r}
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        className="b-input"
        style={{ marginBottom: 20 }}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note…"
      />

      <div className="b-keys">
        {KEYS.map((k) => (
          <button key={k} type="button" className="b-key" onClick={() => press(k)}>
            {k}
          </button>
        ))}
      </div>
      {canSave && (
        <p className="b-label" style={{ marginTop: 12, textAlign: 'center' }}>
          {formatMoney(cents)} → {target}
        </p>
      )}
    </div>
  );
}
