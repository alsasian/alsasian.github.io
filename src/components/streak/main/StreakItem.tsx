import { useAtomValue, useSetAtom } from 'jotai';
import {
  checkInActivityAtom,
  removeCheckInAtom,
  deleteActivityAtom,
  expandedActivityIdsAtom,
  toggleActivityExpansionAtom,
} from '@/lib/streak/atoms';
import { calculateStats, isStreakAtRisk } from '@/lib/streak/streakCalculator';
import { formatDate } from '@/lib/streak/utils';
import type { Activity } from '@/lib/streak/types';
import StreakItemDetail from './StreakItemDetail';

interface StreakItemProps {
  activity: Activity;
  allowRecovery: boolean;
}

export default function StreakItem({ activity, allowRecovery }: StreakItemProps) {
  const checkIn = useSetAtom(checkInActivityAtom);
  const removeCheckIn = useSetAtom(removeCheckInAtom);
  const deleteActivity = useSetAtom(deleteActivityAtom);
  const expandedIds = useAtomValue(expandedActivityIdsAtom);
  const toggleExpansion = useSetAtom(toggleActivityExpansionAtom);

  const today = formatDate(new Date());
  const isCheckedIn = activity.checkIns.includes(today);
  const isExpanded = expandedIds.has(activity.id);
  const stats = calculateStats(activity, allowRecovery);
  const atRisk = isStreakAtRisk(activity);

  const handleCheckIn = () => {
    if (isCheckedIn) {
      removeCheckIn({ activityId: activity.id, date: today });
    } else {
      checkIn({ activityId: activity.id, date: today });
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete "${activity.name}"? This cannot be undone.`)) {
      deleteActivity(activity.id);
    }
  };

  return (
    <div className="py-4">
      <div className="flex items-center gap-3">
        {/* Check-in Button */}
        <button
          onClick={handleCheckIn}
          className={`
            flex h-11 w-11 flex-shrink-0 items-center justify-center rounded border text-lg transition-all
            ${
              isCheckedIn
                ? 'streak-border-emphasis bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'streak-border-subtle text-transparent hover:streak-border-emphasis'
            }
          `}
          aria-label={isCheckedIn ? 'Undo check-in' : 'Check in'}
          aria-pressed={isCheckedIn}
        >
          ✓
        </button>

        {/* Activity Info */}
        <div className="flex-1 min-w-0">
          <h3 className="streak-card-title">
            {activity.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className={atRisk ? 'text-red-600 dark:text-red-400' : 'streak-text-secondary'}>
              {stats.currentStreak > 0 ? `🔥 ${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}` : 'No streak'}
              {atRisk && ' (at risk!)'}
            </span>
          </div>
        </div>

        {/* Expand/Delete Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleExpansion(activity.id)}
            className="streak-text-secondary hover:streak-text-primary transition-colors"
            aria-label={isExpanded ? 'Hide details' : 'Show details'}
            aria-expanded={isExpanded}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="square" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="streak-text-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete activity"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 5L15 15M15 5L5 15" strokeLinecap="square" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && <StreakItemDetail stats={stats} />}
    </div>
  );
}
