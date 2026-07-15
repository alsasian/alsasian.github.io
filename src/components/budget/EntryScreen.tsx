import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  mruItemsAtom,
  addTransactionAtom,
  createItemAtom,
  goHomeAtom,
  navAtom,
} from '@/lib/budget/atoms';
import { parseMoney, formatMoney } from '@/lib/budget/money';
import { todayISO } from '@/lib/budget/dates';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export default function EntryScreen() {
  const items = useAtomValue(mruItemsAtom);
  const addTxn = useSetAtom(addTransactionAtom);
  const createItem = useSetAtom(createItemAtom);
  const goHome = useSetAtom(goHomeAtom);
  const nav = useAtomValue(navAtom);

  const [raw, setRaw] = useState('');
  const [selected, setSelected] = useState<string | null>(nav.prefillItemId ?? null);
  const [date, setDate] = useState(todayISO());
  const [planned, setPlanned] = useState(false);
  const [note, setNote] = useState('');
  const [creating, setCreating] = useState(false);

  const today = todayISO();
  const futureDate = date > today;
  const effectivePlanned = planned || futureDate;

  const cents = parseMoney(raw);
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
    await addTxn({
      itemId: selected ?? 'uncategorized',
      amount: cents,
      date,
      status: effectivePlanned ? 'planned' : 'actual',
      note: note || undefined,
    });
    goHome();
  };

  const display = raw === '' ? '0' : raw;
  const target = selected ? items.find((i) => i.id === selected)?.name : 'Uncategorized';

  return (
    <div className="b-view">
      <div className="b-entry-top">
        <button type="button" className="b-cancel" aria-label="Cancel" onClick={goHome}>
          ×
        </button>
        <button type="button" className="b-save" disabled={!canSave} onClick={save}>
          Save
        </button>
      </div>

      <div className="b-amount">
        <span className="v">
          <span className="u">$</span> {display}
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
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
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
          className={`b-toggle ${effectivePlanned ? 'on' : ''}`}
          disabled={futureDate}
          onClick={() => !futureDate && setPlanned((p) => !p)}
        >
          {effectivePlanned ? '○ planned' : 'actual'}
        </button>
      </div>

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

function NewItemForm({
  onCreate,
  onCancel,
}: {
  onCreate: (input: { name: string; period: 'monthly' | 'yearly'; base: number | null }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [budget, setBudget] = useState('');
  const base = useMemo(() => parseMoney(budget), [budget]);
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  return (
    <div className="b-card" style={{ marginBottom: 20 }}>
      <input
        ref={nameRef}
        type="text"
        className="b-input"
        style={{ marginBottom: 12 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name (e.g. Steam)"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {(['monthly', 'yearly'] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={`b-toggle ${period === p ? 'on' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
        <input
          type="text"
          inputMode="decimal"
          className="b-input mono"
          style={{ marginLeft: 'auto', width: '7rem', textAlign: 'right' }}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder={period === 'yearly' ? '$ / year' : '$ / month'}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button type="button" className="b-btn ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="b-btn primary"
          disabled={!name.trim()}
          onClick={() => onCreate({ name, period, base })}
        >
          Create
        </button>
      </div>
    </div>
  );
}
