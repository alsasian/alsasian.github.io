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

  // Format streak number with leading zeros
  const formatStreakNumber = (num: number) => String(num).padStart(3, '0');

  return (
    <div className="border-2 border-gray-700 bg-gray-950 mb-4">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans text-base uppercase tracking-wide text-gray-100">
            {activity.name}
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-300 font-mono text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>

        {/* Streak Display */}
        <div className="mb-4 border-l-4 border-green-400 pl-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg">🔥</span>
            <span className="font-mono text-4xl tabular-nums text-green-400">
              {formatStreakNumber(stats.currentStreak)}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">days</span>
          </div>

          <div className="flex gap-6 font-mono text-xs text-gray-400">
            <div>
              <span className="text-gray-600">BEST:</span>{' '}
              <span className="text-gray-100 tabular-nums">{formatStreakNumber(stats.longestStreak)}</span>
            </div>
            <div>
              <span className="text-gray-600">TOTAL:</span>{' '}
              <span className="text-gray-100 tabular-nums">{formatStreakNumber(stats.totalCheckIns)}</span>
            </div>
          </div>
        </div>

        {/* Check-in Button */}
        <button
          onClick={handleCheckIn}
          className={`w-full min-h-[60px] border-2 font-mono text-sm uppercase tracking-wide transition-colors ${
            checkedToday
              ? 'border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400/20'
              : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
          }`}
        >
          {checkedToday ? '✓ CHECKED IN' : '○ MARK AS DONE'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t-2 border-gray-700 p-5 bg-gray-900">
          <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-xs">
            <div>
              <div className="text-gray-600 uppercase mb-1">Completion</div>
              <div className="text-2xl tabular-nums text-gray-100">
                {stats.completionRate}%
              </div>
              <div className="text-gray-600 mt-1">Last 30 days</div>
            </div>
            <div>
              <div className="text-gray-600 uppercase mb-1">Last Check-in</div>
              <div className="text-sm text-gray-100 mt-2">
                {stats.lastCheckIn || 'Never'}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 mb-4 font-mono">
            Created: {new Date(activity.createdAt).toLocaleDateString()}
          </div>

          <button
            onClick={handleDelete}
            className="w-full min-h-[50px] border-2 border-red-900 text-red-400 hover:border-red-700 hover:bg-red-900/20 font-mono text-xs uppercase tracking-wide transition-colors"
          >
            [DELETE]
          </button>
        </div>
      )}
    </div>
  );
}
