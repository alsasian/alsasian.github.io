import { useAtomValue } from 'jotai';
import { todayStatsAtom } from '@/lib/streak/atoms';

export default function Summary() {
  const stats = useAtomValue(todayStatsAtom);

  if (stats.total === 0) {
    return (
      <div className="p-4">
        <p className="streak-text-secondary text-center text-sm">
          No activities yet. Tap + to create your first activity!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 dark:bg-gray-800">
      <div className="mb-3">
        <p className="streak-section-header">Today's Progress</p>
        <p className="streak-text-primary mt-2 text-2xl font-bold">
          {stats.completed} of {stats.total} completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gray-900 transition-all duration-300 dark:bg-gray-100"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>

      <p className="streak-text-secondary mt-2 text-right text-xs font-medium">
        {stats.percentage}%
      </p>
    </div>
  );
}
