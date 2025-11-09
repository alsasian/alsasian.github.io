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
    <section className="mb-6 border-l-4 border-gray-900 dark:border-gray-100 pl-3 py-3">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Today</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {completedToday} of {total} completed
      </p>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full bg-gray-900 dark:bg-gray-100 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
        {percentage}% complete
      </p>
    </section>
  );
}
