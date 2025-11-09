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
    if (confirm(`Delete "${activity.name}"? This cannot be undone.`)) {
      deleteActivity(activity.id);
      onUpdate();
    }
  };

  return (
    <article className="border-l-4 border-gray-900 dark:border-gray-100 pl-3 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {activity.name}
          </h2>
          {/* Streak warning */}
          {atRisk && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              ⚠️ {hoursRemaining} {hoursRemaining === 1 ? 'hour' : 'hours'} left to keep your {stats.currentStreak}-day streak
            </p>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Streak Display */}
      <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-1">
          <span className="font-bold text-gray-900 dark:text-gray-100">{stats.currentStreak}</span>{' '}
          {stats.currentStreak === 1 ? 'day' : 'days'} streak
        </p>
        <p className="text-xs">
          Best: {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'} ·{' '}
          Total: {stats.totalCheckIns} {stats.totalCheckIns === 1 ? 'check-in' : 'check-ins'}
        </p>
        {stats.lastCheckIn && (
          <p className="text-xs mt-1">Last: {stats.lastCheckIn}</p>
        )}
      </div>

      {/* Check-in Button */}
      <button
        onClick={handleCheckIn}
        className={`w-full min-h-[60px] px-4 border text-sm font-bold transition-colors ${
          checkedToday
            ? 'border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
            : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        {checkedToday ? '✓ Done today' : 'Mark as done'}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-300 dark:border-gray-700 mt-4 pt-4">
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Completion Rate</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.completionRate}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Last 30 days</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Created</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">
                {new Date(activity.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="w-full min-h-[50px] px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors"
          >
            Delete activity
          </button>
        </div>
      )}
    </article>
  );
}
