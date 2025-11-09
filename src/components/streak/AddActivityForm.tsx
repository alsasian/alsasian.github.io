import React, { useState } from 'react';
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
        className="min-h-[40px] w-full text-sm font-light text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
      >
        + Add new activity
      </button>
    );
  }

  return (
    <div className="mb-6 border-l-4 border-gray-300 py-4 pl-3 dark:border-gray-700">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">Add New Activity</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="activity-name"
            className="mb-2 block text-sm text-gray-600 dark:text-gray-400"
          >
            Activity name
          </label>
          <input
            id="activity-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Exercise, Reading, Meditation"
            className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-100"
            maxLength={50}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="min-h-[50px] flex-1 border border-gray-900 bg-gray-900 px-4 text-sm font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:disabled:border-gray-700 dark:disabled:bg-gray-700"
          >
            Add activity
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
            }}
            className="min-h-[50px] border border-gray-300 px-4 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
