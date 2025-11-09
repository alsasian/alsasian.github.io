import type { Activity } from '../../lib/streak/types';
import { isCheckedInToday } from '../../lib/streak/streakCalculator';

interface TodaySummaryProps {
  activities: Activity[];
}

export default function TodaySummary({ activities }: TodaySummaryProps) {
  if (activities.length === 0) {
    return null;
  }

  const completedToday = activities.filter((activity) => isCheckedInToday(activity)).length;
  const total = activities.length;
  const percentage = Math.round((completedToday / total) * 100);

  return (
    <section className="mb-6 border-gray-900 dark:border-gray-100">
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">Today</h2>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {completedToday} of {total} completed
      </p>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-gray-900 transition-all duration-300 dark:bg-gray-100"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">{percentage}% complete</p>
    </section>
  );
}
