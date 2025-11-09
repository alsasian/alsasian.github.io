import { useState } from 'react';
import type { Activity } from '../../lib/streak/types';
import { addActivity } from '../../lib/streak/storage';
import { generateId, getRandomColor, ACTIVITY_COLORS } from '../../lib/streak/utils';

interface AddActivityFormProps {
  onAdd: () => void;
}

export default function AddActivityForm({ onAdd }: AddActivityFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(getRandomColor());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const newActivity: Activity = {
      id: generateId(),
      name: name.trim(),
      color,
      createdAt: new Date().toISOString(),
      checkIns: [],
    };

    addActivity(newActivity);
    setName('');
    setColor(getRandomColor());
    setIsOpen(false);
    onAdd();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all border-2 border-white/30 hover:border-white/50"
      >
        + Add New Activity
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Add New Activity
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activity Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Exercise, Reading, Meditation"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            autoFocus
            maxLength={50}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {ACTIVITY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add Activity
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
              setColor(getRandomColor());
            }}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
