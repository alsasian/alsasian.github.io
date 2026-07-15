import { useEffect, useRef, useState } from 'react';
import { useSetAtom } from 'jotai';
import { saveItemAtom, archiveItemAtom } from '@/lib/budget/atoms';
import type { CapOverride, Item, PlanOverride } from '@/lib/budget/types';
import { effectiveCap, effectivePlan, monthlyBaseFor, planTotal, drift } from '@/lib/budget/engine';
import { parseMoney, centsToInput, formatMoney, formatMoneyCompact } from '@/lib/budget/money';
import { monthShort, todayYMD } from '@/lib/budget/dates';

type Scope = 'once' | 'onward';

function upsertCap(list: CapOverride[], next: CapOverride): CapOverride[] {
  return [
    ...list.filter(
      (o) => !(o.year === next.year && o.month === next.month && o.scope === next.scope)
    ),
    next,
  ];
}
function upsertPlan(list: PlanOverride[], next: PlanOverride): PlanOverride[] {
  return [
    ...list.filter(
      (o) => !(o.year === next.year && o.month === next.month && o.scope === next.scope)
    ),
    next,
  ];
}

function ScopedField({
  initial,
  onceLabel,
  onwardLabel,
  onApply,
}: {
  initial: string;
  onceLabel: string;
  onwardLabel: string;
  onApply: (cents: number, scope: Scope) => void;
}) {
  const [val, setVal] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const cents = parseMoney(val);
  return (
    <div className="b-card" style={{ marginTop: 8, padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span className="b-muted">$</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          className="b-input mono"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="b-btn block"
          disabled={cents == null}
          onClick={() => cents != null && onApply(cents, 'once')}
        >
          {onceLabel}
        </button>
        <button
          type="button"
          className="b-btn primary block"
          disabled={cents == null}
          onClick={() => cents != null && onApply(cents, 'onward')}
        >
          {onwardLabel}
        </button>
      </div>
    </div>
  );
}

export default function BudgetEditor({ item, onClose }: { item: Item; onClose: () => void }) {
  const saveItem = useSetAtom(saveItemAtom);
  const archive = useSetAtom(archiveItemAtom);
  const { year, month } = todayYMD();

  const [draft, setDraft] = useState<Item>(item);
  const [editingCap, setEditingCap] = useState(false);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);

  const yearly = draft.period === 'yearly';
  const cap = yearly ? effectiveCap(draft, year, 1) : effectiveCap(draft, year, month);
  const total = yearly ? planTotal(draft, year) : cap;
  const d = drift(draft, year);

  const commit = async (next: Item) => {
    setDraft(next);
    await saveItem(next);
  };

  const applyCap = (cents: number, scope: Scope) => {
    void commit({
      ...draft,
      capOverrides: upsertCap(draft.capOverrides, {
        year,
        month: yearly ? 1 : month,
        amount: cents,
        scope,
      }),
    });
    setEditingCap(false);
  };

  const applyPlan = (m: number, cents: number, scope: Scope) => {
    void commit({
      ...draft,
      planOverrides: upsertPlan(draft.planOverrides, { year, month: m, amount: cents, scope }),
    });
    setEditingMonth(null);
  };

  const periodWord = yearly ? `${year}` : `${monthShort(month)} ${year}`;

  return (
    <div className="b-card">
      <input
        type="text"
        className="b-input"
        style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}
        value={draft.name}
        disabled={draft.system}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        onBlur={() => commit(draft)}
      />

      {!draft.system && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 13,
            }}
          >
            <span className="b-muted">Budget per {yearly ? 'year' : 'month'}</span>
            <button
              type="button"
              style={{ fontWeight: 600 }}
              onClick={() => setEditingCap((v) => !v)}
            >
              {cap == null ? 'Set' : formatMoneyCompact(cap)} ✎
            </button>
          </div>
          {editingCap && (
            <ScopedField
              initial={cap != null ? centsToInput(cap) : ''}
              onceLabel={`Just ${periodWord}`}
              onwardLabel={`From ${periodWord} on`}
              onApply={applyCap}
            />
          )}
        </div>
      )}

      {yearly && !draft.system && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <span className="b-label">Plan shape · {year}</span>
            <span className="drift b-mono" style={{ fontSize: 11 }}>
              plan {total != null ? formatMoneyCompact(total) : '—'}
              {cap != null &&
                d != null &&
                (d === 0 ? (
                  <span style={{ color: 'var(--accent)' }}> ✓</span>
                ) : (
                  ` · ${formatMoney(d, { sign: true })}`
                ))}
            </span>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            <span className="b-muted">base / month</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="b-muted">$</span>
              <input
                type="text"
                inputMode="decimal"
                className="b-input mono"
                style={{ width: '5rem', textAlign: 'right' }}
                defaultValue={centsToInput(monthlyBaseFor(draft, year) ?? 0)}
                onBlur={(e) => void commit({ ...draft, monthlyBase: parseMoney(e.target.value) })}
              />
            </span>
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const amt = effectivePlan(draft, year, m);
              const overridden = draft.planOverrides.some((o) => o.month === m && o.year <= year);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setEditingMonth(editingMonth === m ? null : m)}
                  style={{
                    textAlign: 'left',
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: `1px solid ${editingMonth === m ? 'var(--ink)' : 'var(--line)'}`,
                  }}
                >
                  <span
                    className="b-label"
                    style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}
                  >
                    {monthShort(m)}
                    {overridden && <span style={{ color: 'var(--accent)' }}>•</span>}
                  </span>
                  <span className="b-mono" style={{ fontSize: 13 }}>
                    {formatMoneyCompact(amt)}
                  </span>
                </button>
              );
            })}
          </div>

          {editingMonth != null && (
            <div style={{ marginTop: 8 }}>
              <span className="b-label">{monthShort(editingMonth)} plan</span>
              <ScopedField
                initial={centsToInput(effectivePlan(draft, year, editingMonth))}
                onceLabel={`Just ${monthShort(editingMonth)} ${year}`}
                onwardLabel={`${monthShort(editingMonth)} from ${year} on`}
                onApply={(cents, scope) => applyPlan(editingMonth, cents, scope)}
              />
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 14,
        }}
      >
        {!draft.system ? (
          <button
            type="button"
            className="b-btn ghost"
            onClick={async () => {
              await archive(draft.id);
              onClose();
            }}
          >
            Archive item
          </button>
        ) : (
          <span />
        )}
        <button type="button" className="b-btn accent" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
