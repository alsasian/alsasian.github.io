import { useAtom, useSetAtom } from 'jotai';
import { currentPageAtom, showAddActivityModalAtom, type PageType } from '@/lib/streak/atoms';

export default function BottomNav() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const setShowAddModal = useSetAtom(showAddActivityModalAtom);

  const tabs: { id: PageType; label: string; icon: string }[] = [
    { id: 'main', label: 'Home', icon: '🏠' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t streak-divider streak-surface pb-safe">
      <div className="relative mx-auto flex max-w-2xl items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentPage(tab.id)}
            className={`
              flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors
              ${
                currentPage === tab.id
                  ? 'streak-text-primary font-bold relative'
                  : 'streak-text-secondary hover:streak-text-primary'
              }
            `}
            aria-label={tab.label}
            aria-current={currentPage === tab.id ? 'page' : undefined}
          >
            <span className="text-lg" aria-hidden="true">
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {/* Active indicator - subtle underline */}
            {currentPage === tab.id && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 bg-gray-900 dark:bg-gray-100"></span>
            )}
          </button>
        ))}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowAddModal(true)}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 transform rounded-full bg-gray-900 p-4 text-2xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-gray-100 dark:text-gray-900"
        aria-label="Add new activity"
      >
        <span aria-hidden="true">+</span>
      </button>
    </nav>
  );
}
