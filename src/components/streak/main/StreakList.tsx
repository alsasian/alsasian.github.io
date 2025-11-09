import { useAtomValue } from 'jotai';
import { sortedActivitiesAtom, settingsAtom } from '@/lib/streak/atoms';
import StreakItem from './StreakItem';

export default function StreakList() {
  const activities = useAtomValue(sortedActivitiesAtom);
  const settings = useAtomValue(settingsAtom);

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 px-4">
      <h2 className="mb-3 streak-section-header">Your Activities</h2>
      <div className="divide-y streak-divider">
        {activities.map((activity) => (
          <StreakItem
            key={activity.id}
            activity={activity}
            allowRecovery={settings.allowStreakRecovery}
          />
        ))}
      </div>
    </div>
  );
}
