import { useSetAtom } from 'jotai';
import { showAddActivityModalAtom } from '@/lib/streak/atoms';

export default function Header() {
  const setShowAddModal = useSetAtom(showAddActivityModalAtom);

  return (
    <header className="streak-divider streak-surface border-b px-4 py-4">
      <div className="relative flex items-center justify-center">
        <h1 className="streak-page-title">Streaks</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xl text-white shadow-soft dark:shadow-soft-dark transition-all duration-ios-fast ease-ios-spring hover:scale-105 active:scale-95 dark:bg-gray-100 dark:text-gray-900"
          aria-label="Add new activity"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </header>
  );
}
