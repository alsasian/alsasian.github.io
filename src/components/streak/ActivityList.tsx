import type { Activity } from '../../lib/streak/types';
import ActivityCard from './ActivityCard';

interface ActivityListProps {
  activities: Activity[];
  allowRecovery: boolean;
  onUpdate: () => void;
}

export default function ActivityList({ activities, allowRecovery, onUpdate }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-3 py-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">No activities yet.</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Add your first habit to start tracking.
        </p>
      </div>
    );
  }

  return (
    <div>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          allowRecovery={allowRecovery}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
