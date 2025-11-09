import { useState, useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { showAddActivityModalAtom, addActivityAtom } from '@/lib/streak/atoms';

export default function AddActivityModal() {
  const showModal = useAtomValue(showAddActivityModalAtom);
  const setShowModal = useSetAtom(showAddActivityModalAtom);
  const addActivity = useSetAtom(addActivityAtom);

  const [name, setName] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (showModal) {
      setIsClosing(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showModal]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setName('');
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      alert('Activity name cannot be empty');
      return;
    }

    if (trimmedName.length > 50) {
      alert('Activity name must be 50 characters or less');
      return;
    }

    addActivity(trimmedName);
    setName('');
  };

  if (!showModal) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isClosing ? 'modal-overlay-exit' : 'modal-overlay'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-md border-2 streak-border-emphasis bg-white p-6 shadow-xl dark:border-gray-100 dark:bg-gray-950 ${
          isClosing ? 'modal-content-exit' : 'modal-content'
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <h2
          id="modal-title"
          className="mb-4 text-lg font-bold streak-text-primary"
        >
          Create New Activity
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="activity-name" className="sr-only">
              Activity name
            </label>
            <input
              ref={inputRef}
              id="activity-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning workout"
              maxLength={50}
              className="w-full border-2 streak-border-emphasis bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-100 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:ring-gray-100"
            />
            <p className="mt-2 text-right text-xs streak-text-secondary">
              {name.length}/50
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 border border-gray-900 bg-gray-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Create
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
