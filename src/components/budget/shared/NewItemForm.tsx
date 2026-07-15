import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { parseMoney } from '@/lib/budget/money';

export interface NewItemInput {
  name: string;
  period: 'monthly' | 'yearly';
  base: number | null;
}

/**
 * Create-an-item form. Shared by the entry screen (inline "+ New") and the
 * dedicated "New budget" screen, so budget creation looks the same everywhere.
 */
export default function NewItemForm({
  onCreate,
  onCancel,
  submitLabel = 'Create',
  style,
}: {
  onCreate: (input: NewItemInput) => void;
  onCancel: () => void;
  submitLabel?: string;
  style?: CSSProperties;
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
    <div className="b-card" style={style}>
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
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
