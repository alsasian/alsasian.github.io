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
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-8 pt-3">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={goHome}
          className="rounded-md px-2 py-1 text-lg text-gray-500 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">{inbox.length} to confirm</h1>
      </div>

      {inbox.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Nothing to confirm. The plan is honest.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
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
    <div className="rounded-xl border border-gray-300 p-3 dark:border-gray-700">
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <div className="font-semibold">{txn.note || itemName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {itemName} · planned {formatDayMonth(txn.date)}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-400 dark:text-gray-500">$</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-20 border-b border-gray-300 bg-transparent pb-0.5 text-right tabular-nums outline-none dark:border-gray-700"
            aria-label="Amount"
          />
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          disabled={cents == null}
          onClick={() => confirm({ id: txn.id, amount: cents ?? undefined })}
          className="flex-1 rounded-lg border border-gray-900 py-1.5 font-semibold no-underline disabled:opacity-30 dark:border-gray-100"
        >
          Confirm{cents != null && cents !== txn.amount ? ` ${formatMoney(cents)}` : ''}
        </button>
        <button
          type="button"
          onClick={() => del(txn.id)}
          className="flex-1 rounded-lg border border-gray-300 py-1.5 text-gray-600 no-underline dark:border-gray-700 dark:text-gray-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
