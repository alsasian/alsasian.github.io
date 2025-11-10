import { useAtomValue } from 'jotai';
import { currentPageAtom } from '@/lib/streak/atoms';
import MainPage from './pages/MainPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';

export default function PageContainer() {
  const currentPage = useAtomValue(currentPageAtom);

  return (
    <div className="page-container mb-24 pt-4 pb-4">
      {currentPage === 'main' && (
        <div className="page-enter">
          <MainPage />
        </div>
      )}
      {currentPage === 'calendar' && (
        <div className="page-enter">
          <CalendarPage />
        </div>
      )}
      {currentPage === 'settings' && (
        <div className="page-enter">
          <SettingsPage />
        </div>
      )}
    </div>
  );
}
