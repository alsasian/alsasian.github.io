import { useState } from 'react';
import type { Activity } from '../../lib/streak/types';
import { addActivity } from '../../lib/streak/storage';
import { generateId } from '../../lib/streak/utils';

interface AddActivityFormProps {
  onAdd: () => void;
}

export default function AddActivityForm({ onAdd }: AddActivityFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const newActivity: Activity = {
      id: generateId(),
      name: name.trim(),
      color: '#6b7280', // Default gray - not used in TUI design
      createdAt: new Date().toISOString(),
      checkIns: [],
    };

    addActivity(newActivity);
    setName('');
    setIsOpen(false);
    onAdd();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full min-h-[60px] border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300 font-mono text-sm uppercase tracking-wide transition-colors"
      >
        + NEW ACTIVITY
      </button>
    );
  }

  return (
    <div className="border-2 border-gray-700 bg-gray-950 p-6 mb-4">
      <h3 className="font-mono text-xs uppercase tracking-wide text-gray-500 mb-4">
        $ new-activity
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block font-mono text-xs uppercase text-gray-600 mb-2">
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise, Reading, etc..."
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-gray-100 font-mono text-sm focus:border-green-400 focus:outline-none placeholder-gray-600"
            autoFocus
            maxLength={50}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 min-h-[50px] border-2 border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20 disabled:border-gray-700 disabled:bg-transparent disabled:text-gray-700 disabled:cursor-not-allowed font-mono text-xs uppercase tracking-wide transition-colors"
          >
            [ENTER] Create
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
            }}
            className="px-4 min-h-[50px] border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300 font-mono text-xs uppercase tracking-wide transition-colors"
          >
            [ESC]
          </button>
        </div>
      </form>
    </div>
  );
}
