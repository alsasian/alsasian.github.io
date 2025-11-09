import { useEffect } from 'react';
import { Provider, useAtomValue } from 'jotai';
import { activitiesAtom, settingsAtom } from '@/lib/streak/atoms';
import { updateBadge, scheduleAllNotifications } from '@/lib/streak/notificationManager';
import Header from './Header';
import BottomNav from './BottomNav';
import PageContainer from './PageContainer';
import AddActivityModal from './shared/AddActivityModal';
import ToastContainer from './shared/ToastContainer';
import UpdateNotification from './UpdateNotification';

// Internal component that uses atoms (must be inside Provider)
function StreakAppContent() {
  const activities = useAtomValue(activitiesAtom);
  const settings = useAtomValue(settingsAtom);

  // Update badge whenever activities change
  useEffect(() => {
    updateBadge(activities);
  }, [activities]);

  // Schedule notifications whenever settings or activities change
  useEffect(() => {
    scheduleAllNotifications(activities, settings.notifications);
  }, [activities, settings.notifications]);

  return (
    <div className="flex min-h-screen flex-col streak-surface">
      <Header />
      <main className="flex-1">
        <PageContainer />
      </main>
      <BottomNav />
      <AddActivityModal />
      <ToastContainer />
      <UpdateNotification />
    </div>
  );
}

// Root component with Provider
export default function StreakApp() {
  return (
    <Provider>
      <StreakAppContent />
    </Provider>
  );
}
