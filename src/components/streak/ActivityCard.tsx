import { useState } from 'react';
import type { Activity } from '../../lib/streak/types';
import { calculateStats, isCheckedInToday } from '../../lib/streak/streakCalculator';
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: activity.color }}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activity.name}
            </h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>

        {/* Streak Display */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔥</span>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">day streak</div>
            </div>
          </div>

          <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
            <div>Best: {stats.longestStreak} days</div>
            <div>Total: {stats.totalCheckIns} check-ins</div>
          </div>
        </div>

        {/* Check-in Button */}
        <button
          onClick={handleCheckIn}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            checkedToday
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          }`}
        >
          {checkedToday ? '✓ Done Today' : 'Mark as Done'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">Completion Rate</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.completionRate}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Last Check-in</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.lastCheckIn || 'Never'}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Created: {new Date(activity.createdAt).toLocaleDateString()}
          </div>

          <button
            onClick={handleDelete}
            className="w-full py-2 px-4 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition-colors"
          >
            Delete Activity
          </button>
        </div>
      )}
    </div>
  );
}
