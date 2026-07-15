import { useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  snapshotAtom,
  itemsAtom,
  goHomeAtom,
  saveItemAtom,
  importSnapshotAtom,
} from '@/lib/budget/atoms';
import { serializeExport, parseImport } from '@/lib/budget/exchange';
import { requestPersistence } from '@/lib/budget/db';

export default function SettingsScreen() {
  const snapshot = useAtomValue(snapshotAtom);
  const items = useAtomValue(itemsAtom);
  const goHome = useSetAtom(goHomeAtom);
  const saveItem = useSetAtom(saveItemAtom);
  const importSnapshot = useSetAtom(importSnapshotAtom);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);

  const archived = items.filter((i) => i.archived);

  const doExport = () => {
    const json = serializeExport(snapshot);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `budget-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Exported.');
  };

  const doImport = async (file: File) => {
    const text = await file.text();
    const result = parseImport(text);
    if (!result.ok || !result.snapshot) {
      setMsg(result.error ?? 'Import failed.');
      return;
    }
    await importSnapshot(result.snapshot);
    setMsg('Imported — replaced all data.');
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-12 pt-3">
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={goHome}
          className="rounded-md px-2 py-1 text-lg text-gray-500 no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Backup
        </h2>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Data lives only in this browser. Persistent storage is a request, not a guarantee — export
          regularly.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={doExport}
            className="rounded-lg border border-gray-900 px-4 py-1.5 text-sm font-semibold no-underline dark:border-gray-100"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm no-underline dark:border-gray-700"
          >
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = '';
            }}
          />
        </div>
        {msg && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{msg}</p>}
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Storage
        </h2>
        <button
          type="button"
          onClick={async () => setPersisted(await requestPersistence())}
          className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm no-underline dark:border-gray-700"
        >
          Request persistent storage
        </button>
        {persisted != null && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {persisted ? 'Granted — storage is persistent.' : 'Not granted by the browser.'}
          </p>
        )}
      </section>

      {archived.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Archived items
          </h2>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {archived.map((it) => (
              <div key={it.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">{it.name}</span>
                <button
                  type="button"
                  onClick={() => saveItem({ ...it, archived: false })}
                  className="text-xs no-underline"
                >
                  Unarchive
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
