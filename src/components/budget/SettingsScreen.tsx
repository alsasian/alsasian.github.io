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
    <div className="b-view">
      <div className="b-ihead">
        <button type="button" className="b-back" aria-label="Back" onClick={goHome}>
          ←
        </button>
        <span className="t">Settings</span>
      </div>

      <section className="b-section">
        <h2>Backup</h2>
        <p>
          Data lives only in this browser. Persistent storage is a request, not a guarantee — export
          regularly.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="b-btn primary" onClick={doExport}>
            Export JSON
          </button>
          <button type="button" className="b-btn" onClick={() => fileRef.current?.click()}>
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = '';
            }}
          />
        </div>
        {msg && (
          <p className="b-label" style={{ marginTop: 10, marginBottom: 0 }}>
            {msg}
          </p>
        )}
      </section>

      <section className="b-section">
        <h2>Storage</h2>
        <button
          type="button"
          className="b-btn"
          onClick={async () => setPersisted(await requestPersistence())}
        >
          Request persistent storage
        </button>
        {persisted != null && (
          <p className="b-label" style={{ marginTop: 10, marginBottom: 0 }}>
            {persisted ? 'Granted — storage is persistent.' : 'Not granted by the browser.'}
          </p>
        )}
      </section>

      {archived.length > 0 && (
        <section className="b-section">
          <h2>Archived items</h2>
          {archived.map((it) => (
            <div key={it.id} className="b-tx">
              <span className="n b-muted">{it.name}</span>
              <button
                type="button"
                className="b-btn ghost"
                onClick={() => saveItem({ ...it, archived: false })}
              >
                Unarchive
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
