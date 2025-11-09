import type { Activity } from '../../lib/streak/types';
import { sortActivitiesByPriority } from '../../lib/streak/streakCalculator';
import ActivityCard from './ActivityCard';

interface ActivityListProps {
  activities: Activity[];
  allowRecovery: boolean;
  onUpdate: () => void;
}

export default function ActivityList({ activities, allowRecovery, onUpdate }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="py-8 pl-3 pt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">No activities yet.</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          Add your first habit to start tracking.
        </p>
      </div>
    );
  }

  // Sort: uncompleted first, then by streak (highest first)
  const sortedActivities = sortActivitiesByPriority(activities);

  return (
    <div className="border-t border-gray-300 pt-6 dark:border-gray-700">
      {sortedActivities.map((activity) => (
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
