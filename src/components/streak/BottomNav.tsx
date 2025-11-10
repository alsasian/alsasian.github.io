import { useAtom } from 'jotai';
import { currentPageAtom, type PageType } from '@/lib/streak/atoms';

export default function BottomNav() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  const tabs: { id: PageType; label: string; icon: string }[] = [
    { id: 'main', label: 'Home', icon: '🏠' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t streak-divider glass pb-safe">
      <div className="relative mx-auto flex max-w-2xl items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentPage(tab.id)}
            className={`
              flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors duration-ios ease-ios
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
              <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 transition-all duration-ios ease-ios"></span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
