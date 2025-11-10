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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
        isClosing ? 'modal-overlay-exit' : 'modal-overlay'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-md glass-strong rounded-2xl p-6 border streak-border-emphasis shadow-elevated dark:shadow-elevated-dark ${
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
              className="w-full rounded-xl border streak-border-emphasis bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-ios ease-ios dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:ring-gray-100"
            />
            <p className="mt-2 text-right text-xs streak-text-secondary">
              {name.length}/50
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="streak-button-primary flex-1"
            >
              Create
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="streak-button-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
