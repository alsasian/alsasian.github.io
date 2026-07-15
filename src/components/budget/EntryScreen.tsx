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
import type { Item } from '@/lib/budget/types';

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
      // Limit to 2 decimal places.
      if (prev.includes('.') && prev.split('.')[1]?.length >= 2) return prev;
      return prev + k;
    });
  };

  const save = async () => {
    if (cents == null || cents === 0) return;
    const itemId = selected ?? 'uncategorized';
    await addTxn({
      itemId,
      amount: cents,
      date,
      status: effectivePlanned ? 'planned' : 'actual',
      note: note || undefined,
    });
    goHome();
  };

  const display = raw === '' ? '0' : raw;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-4 pt-3">
      {/* Top bar */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={goHome}
          className="rounded-md px-2 py-1 text-lg text-gray-500 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          aria-label="Cancel"
        >
          ×
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className="rounded-lg px-4 py-1.5 text-sm font-bold no-underline disabled:opacity-30"
        >
          Save
        </button>
      </div>

      {/* Amount */}
      <div className="py-6 text-center">
        <span className="text-5xl font-bold tabular-nums">
          <span className="text-gray-400 dark:text-gray-500">$</span> {display}
        </span>
      </div>

      {/* Chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <ChipButton
            key={item.id}
            item={item}
            selected={selected === item.id}
            onSelect={() => setSelected(item.id)}
          />
        ))}
        <button
          type="button"
          onClick={() => setCreating((c) => !c)}
          className="rounded-full border border-dashed border-gray-400 px-4 py-2 text-sm text-gray-600 no-underline dark:border-gray-600 dark:text-gray-400"
        >
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

      {/* Date + status row */}
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">When</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-gray-300 bg-transparent px-2 py-1 dark:border-gray-700"
          />
        </label>
        <button
          type="button"
          onClick={() => !futureDate && setPlanned((p) => !p)}
          disabled={futureDate}
          className={`rounded-full border px-3 py-1 no-underline ${
            effectivePlanned
              ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
              : 'border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400'
          }`}
        >
          {effectivePlanned ? '○ planned' : 'actual'}
        </button>
      </div>

      {/* Note */}
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note…"
        className="mb-4 w-full border-b border-gray-300 bg-transparent pb-1 text-sm outline-none placeholder:text-gray-400 dark:border-gray-700"
      />

      {/* Keypad */}
      <div className="mt-auto grid grid-cols-3 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => press(k)}
            className="rounded-xl bg-gray-100 py-4 text-2xl font-semibold no-underline active:bg-gray-200 dark:bg-gray-800 dark:active:bg-gray-700"
          >
            {k}
          </button>
        ))}
      </div>
      {canSave && (
        <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
          {formatMoney(cents!)} →{' '}
          {selected ? items.find((i) => i.id === selected)?.name : 'Uncategorized'}
        </p>
      )}
    </div>
  );
}

function ChipButton({
  item,
  selected,
  onSelect,
}: {
  item: Item;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-full border px-4 py-2 text-sm no-underline ${
        selected
          ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
          : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
      }`}
    >
      {item.name}
    </button>
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
    <div className="mb-4 rounded-xl border border-gray-300 p-3 dark:border-gray-700">
      <input
        ref={nameRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name (e.g. Steam)"
        className="mb-2 w-full border-b border-gray-300 bg-transparent pb-1 text-sm outline-none dark:border-gray-700"
      />
      <div className="mb-2 flex items-center gap-2 text-sm">
        {(['monthly', 'yearly'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`rounded-full border px-3 py-1 no-underline ${
              period === p
                ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                : 'border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            {p}
          </button>
        ))}
        <input
          type="text"
          inputMode="decimal"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder={period === 'yearly' ? '$ / year' : '$ / month'}
          className="ml-auto w-28 border-b border-gray-300 bg-transparent pb-1 text-right text-sm outline-none dark:border-gray-700"
        />
      </div>
      <div className="flex justify-end gap-2 text-sm">
        <button type="button" onClick={onCancel} className="px-3 py-1 text-gray-500 no-underline">
          Cancel
        </button>
        <button
          type="button"
          disabled={!name.trim()}
          onClick={() => onCreate({ name, period, base })}
          className="rounded-lg px-3 py-1 font-bold no-underline disabled:opacity-30"
        >
          Create
        </button>
      </div>
    </div>
  );
}
