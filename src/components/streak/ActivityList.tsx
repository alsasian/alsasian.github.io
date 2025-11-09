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
      <div className="border-2 border-gray-700 p-12 text-center">
        <div className="font-mono text-4xl text-gray-600 mb-4">[ ]</div>
        <h3 className="font-mono text-sm uppercase tracking-wide text-gray-400 mb-2">
          No activities tracked
        </h3>
        <p className="text-xs text-gray-600">Add your first habit to begin</p>
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
