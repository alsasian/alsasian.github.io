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
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-white mb-2">No activities yet</h3>
        <p className="text-white/80">Add your first habit to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
