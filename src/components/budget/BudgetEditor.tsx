import { useEffect, useRef, useState } from 'react';
import { useSetAtom } from 'jotai';
import { saveItemAtom, archiveItemAtom } from '@/lib/budget/atoms';
import type { CapOverride, Item, PlanOverride } from '@/lib/budget/types';
import { effectiveCap, effectivePlan, monthlyBaseFor, planTotal, drift } from '@/lib/budget/engine';
import { parseMoney, centsToInput, formatMoney, formatMoneyCompact } from '@/lib/budget/money';
import { monthShort, todayYMD } from '@/lib/budget/dates';

type Scope = 'once' | 'onward';

function upsertCap(list: CapOverride[], next: CapOverride): CapOverride[] {
  const rest = list.filter(
    (o) => !(o.year === next.year && o.month === next.month && o.scope === next.scope)
  );
  return [...rest, next];
}

function upsertPlan(list: PlanOverride[], next: PlanOverride): PlanOverride[] {
  const rest = list.filter(
    (o) => !(o.year === next.year && o.month === next.month && o.scope === next.scope)
  );
  return [...rest, next];
}

/** A value field with the two calendar-style scope choices. */
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
    <div className="rounded-lg border border-gray-300 p-2 dark:border-gray-700">
      <div className="mb-2 flex items-center gap-1">
        <span className="text-gray-400 dark:text-gray-500">$</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full border-b border-gray-300 bg-transparent pb-0.5 tabular-nums outline-none dark:border-gray-700"
        />
      </div>
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          disabled={cents == null}
          onClick={() => cents != null && onApply(cents, 'once')}
          className="flex-1 rounded-md border border-gray-300 py-1.5 no-underline disabled:opacity-30 dark:border-gray-700"
        >
          {onceLabel}
        </button>
        <button
          type="button"
          disabled={cents == null}
          onClick={() => cents != null && onApply(cents, 'onward')}
          className="flex-1 rounded-md border border-gray-900 py-1.5 font-semibold no-underline disabled:opacity-30 dark:border-gray-100"
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
    const override: CapOverride = {
      year,
      month: yearly ? 1 : month,
      amount: cents,
      scope,
    };
    void commit({ ...draft, capOverrides: upsertCap(draft.capOverrides, override) });
    setEditingCap(false);
  };

  const applyPlan = (m: number, cents: number, scope: Scope) => {
    const override: PlanOverride = { year, month: m, amount: cents, scope };
    void commit({ ...draft, planOverrides: upsertPlan(draft.planOverrides, override) });
    setEditingMonth(null);
  };

  const periodWord = yearly ? `${year}` : `${monthShort(month)} ${year}`;

  return (
    <div className="rounded-xl border border-gray-300 p-3 dark:border-gray-700">
      {/* Name */}
      <input
        type="text"
        value={draft.name}
        disabled={draft.system}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        onBlur={() => commit(draft)}
        className="mb-3 w-full border-b border-gray-300 bg-transparent pb-1 text-lg font-bold outline-none disabled:opacity-60 dark:border-gray-700"
      />

      {/* Cap */}
      {!draft.system && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Budget per {yearly ? 'year' : 'month'}
            </span>
            <button
              type="button"
              onClick={() => setEditingCap((v) => !v)}
              className="font-semibold no-underline"
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

      {/* Yearly plan shape */}
      {yearly && !draft.system && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Plan shape · {year}</span>
            <span
              className={
                d && d !== 0
                  ? 'text-gray-500 dark:text-gray-400'
                  : 'text-gray-400 dark:text-gray-500'
              }
            >
              plan {total != null ? formatMoneyCompact(total) : '—'}
              {cap != null &&
                d != null &&
                (d === 0 ? ' ✓' : ` · ${formatMoney(d, { sign: true })}`)}
            </span>
          </div>

          {/* base per month */}
          <label className="mb-2 flex items-center justify-between gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">base / month</span>
            <span className="flex items-center gap-1">
              <span className="text-gray-400 dark:text-gray-500">$</span>
              <input
                type="text"
                inputMode="decimal"
                defaultValue={centsToInput(monthlyBaseFor(draft, year) ?? 0)}
                onBlur={(e) => {
                  const v = parseMoney(e.target.value);
                  void commit({ ...draft, monthlyBase: v });
                }}
                className="w-20 border-b border-gray-300 bg-transparent pb-0.5 text-right tabular-nums outline-none dark:border-gray-700"
              />
            </span>
          </label>

          {/* 12 months */}
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const amt = effectivePlan(draft, year, m);
              const overridden = draft.planOverrides.some((o) => o.month === m && o.year <= year);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setEditingMonth(editingMonth === m ? null : m)}
                  className={`rounded-md border px-2 py-1 text-left text-xs no-underline ${
                    editingMonth === m
                      ? 'border-gray-900 dark:border-gray-100'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{monthShort(m)}</span>
                    {overridden && <span className="text-gray-400">•</span>}
                  </div>
                  <div className="tabular-nums">{formatMoneyCompact(amt)}</div>
                </button>
              );
            })}
          </div>

          {editingMonth != null && (
            <div className="mt-2">
              <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                {monthShort(editingMonth)} plan
              </div>
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

      {/* Actions */}
      <div className="mt-3 flex items-center justify-between">
        {!draft.system ? (
          <button
            type="button"
            onClick={async () => {
              await archive(draft.id);
              onClose();
            }}
            className="text-xs text-gray-500 no-underline dark:text-gray-400"
          >
            Archive item
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-900 px-4 py-1.5 text-sm font-bold no-underline dark:border-gray-100"
        >
          Done
        </button>
      </div>
    </div>
  );
}
