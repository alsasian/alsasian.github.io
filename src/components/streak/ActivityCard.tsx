import { useState } from 'react';
import type { Activity } from '../../lib/streak/types';
import {
  calculateStats,
  isCheckedInToday,
  isStreakAtRisk,
  getHoursRemainingToday,
} from '../../lib/streak/streakCalculator';
import { checkIn, removeCheckIn, deleteActivity } from '../../lib/streak/storage';
import { getTodayString } from '../../lib/streak/utils';

interface ActivityCardProps {
  activity: Activity;
  allowRecovery: boolean;
  onUpdate: () => void;
}

export default function ActivityCard({ activity, allowRecovery, onUpdate }: ActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const stats = calculateStats(activity, allowRecovery);
  const checkedToday = isCheckedInToday(activity);
  const atRisk = isStreakAtRisk(activity);
  const hoursRemaining = getHoursRemainingToday();

  const handleCheckIn = () => {
    const today = getTodayString();

    if (checkedToday) {
      removeCheckIn(activity.id, today);
    } else {
      checkIn(activity.id, today);
    }

    onUpdate();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${activity.name}"? This cannot be undone.`)) {
      deleteActivity(activity.id);
      onUpdate();
    }
  };

  return (
    <article className="mb-6 border-l-4 border-gray-900 pl-3 dark:border-gray-100">
      <div className="flex flex-row">
        <div className="flex flex-1 flex-col justify-between">
          <div className="mb-2 flex items-start justify-between">
            <button
              className="flex-1 text-left"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <h2 className="text-md font-bold text-gray-900 dark:text-gray-100">
                {activity.name}
              </h2>
              {/* Streak warning */}
              {atRisk && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  ⚠️ {hoursRemaining} {hoursRemaining === 1 ? 'hour' : 'hours'} left to keep your{' '}
                  {stats.currentStreak}-day streak
                </p>
              )}
            </button>
          </div>

          {/* Streak Display */}
          <div className="text-2xl text-gray-600 dark:text-gray-400">
            <p className="">
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {stats.currentStreak}
              </span>
            </p>
          </div>
        </div>

        {/* Check-in Button */}
        <button
          onClick={handleCheckIn}
          className={`min-h-[60px] min-w-[100px] border px-4 text-sm font-bold transition-colors ${
            checkedToday
              ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
              : 'border-gray-300 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {checkedToday ? '✓ Done today' : 'Mark as done'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 border-t border-gray-300 pt-4 dark:border-gray-700">
          <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Best</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Total</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {stats.totalCheckIns} {stats.totalCheckIns === 1 ? 'check-in' : 'check-ins'}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Last Check-in</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {stats.lastCheckIn ? stats.lastCheckIn : 'N/A'}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Completion Rate</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.completionRate}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Last 30 days</div>
            </div>
            <div>
              <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">Created</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {new Date(activity.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="min-h-[50px] w-full border border-gray-300 px-4 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Delete activity
          </button>
        </div>
      )}
    </article>
  );
}
