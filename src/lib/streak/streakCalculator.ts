/**
 * Business logic for calculating streaks and stats
 */

import type { Activity, StreakStats } from './types';
import { formatDate, getDaysDifference, parseDate } from './utils';

/**
 * Calculate comprehensive stats for an activity
 */
export function calculateStats(
  activity: Activity,
  allowRecovery: boolean = false
): StreakStats {
  const checkIns = activity.checkIns.map((d) => parseDate(d)).sort((a, b) => a.getTime() - b.getTime());

  if (checkIns.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCheckIns: 0,
      completionRate: 0,
      lastCheckIn: null,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastCheckIn = checkIns[checkIns.length - 1];
  const daysSinceLastCheckIn = getDaysDifference(lastCheckIn, today);

  // Calculate current streak
  let currentStreak = 0;
  const maxGap = allowRecovery ? 2 : 1; // Allow 1-day gap if recovery enabled

  // Start from today and work backwards
  let checkDate = new Date(today);

  // If last check-in was today or yesterday (or 2 days ago with recovery), start counting
  if (daysSinceLastCheckIn < maxGap) {
    currentStreak = 1;
    checkDate = new Date(lastCheckIn);
    checkDate.setDate(checkDate.getDate() - 1);

    // Count backwards through check-ins
    for (let i = checkIns.length - 2; i >= 0; i--) {
      const checkIn = checkIns[i];
      const gap = getDaysDifference(checkIn, new Date(checkDate.getTime() + 24 * 60 * 60 * 1000));

      if (gap < maxGap) {
        currentStreak++;
        checkDate = new Date(checkIn);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < checkIns.length; i++) {
    const prevDate = checkIns[i - 1];
    const currDate = checkIns[i];
    const gap = getDaysDifference(prevDate, currDate);

    if (gap < maxGap) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate completion rate (last 30 days)
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentCheckIns = checkIns.filter((date) => date >= thirtyDaysAgo);
  const completionRate = Math.round((recentCheckIns.length / 30) * 100);

  return {
    currentStreak,
    longestStreak,
    totalCheckIns: checkIns.length,
    completionRate,
    lastCheckIn: formatDate(lastCheckIn),
  };
}

/**
 * Check if an activity was checked in on a specific date
 */
export function hasCheckIn(activity: Activity, date: Date): boolean {
  const dateStr = formatDate(date);
  return activity.checkIns.includes(dateStr);
}

/**
 * Get check-ins for a specific month
 */
export function getMonthCheckIns(activity: Activity, year: number, month: number): Set<number> {
  const checkInDays = new Set<number>();

  activity.checkIns.forEach((dateStr) => {
    const date = parseDate(dateStr);
    if (date.getFullYear() === year && date.getMonth() === month) {
      checkInDays.add(date.getDate());
    }
  });

  return checkInDays;
}

/**
 * Check if today has been checked in
 */
export function isCheckedInToday(activity: Activity): boolean {
  const today = new Date();
  return hasCheckIn(activity, today);
}
