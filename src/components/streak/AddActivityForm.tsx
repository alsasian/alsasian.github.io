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
      color: '#6b7280', // Default gray - not used in newspaper design
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
        className="w-full min-h-[60px] px-4 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold transition-colors"
      >
        + Add new activity
      </button>
    );
  }

  return (
    <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-3 py-4 mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Add New Activity
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
            Activity name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Exercise, Reading, Meditation"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100"
            autoFocus
            maxLength={50}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 min-h-[50px] px-4 border border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:border-gray-300 dark:disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-bold transition-colors"
          >
            Add activity
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
            }}
            className="px-4 min-h-[50px] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
