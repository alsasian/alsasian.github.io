import { atom } from 'jotai';
import { activitiesAtom, settingsAtom } from './dataAtoms';
import { selectedActivityIdAtom } from './uiAtoms';
import {
  calculateStats,
  sortActivitiesByPriority,
  isStreakAtRisk,
} from '../streakCalculator';
import { formatDate } from '../utils';
import type { StreakStats } from '../types';

// Sorted activities (uncompleted first, then by streak)
export const sortedActivitiesAtom = atom((get) => {
  const activities = get(activitiesAtom);
  return sortActivitiesByPriority(activities);
});

// Today's completion stats
export const todayStatsAtom = atom((get) => {
  const activities = get(activitiesAtom);
  const today = formatDate(new Date());
  const completed = activities.filter((a) => a.checkIns.includes(today)).length;
  const total = activities.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
});

// Get stats for a specific activity
export const activityStatsAtomFamily = (activityId: string) =>
  atom((get): StreakStats | null => {
    const activities = get(activitiesAtom);
    const settings = get(settingsAtom);
    const activity = activities.find((a) => a.id === activityId);

    if (!activity) return null;

    return calculateStats(activity, settings.allowStreakRecovery);
  });

// Selected activity (for calendar/detail view)
export const selectedActivityAtom = atom((get) => {
  const activities = get(activitiesAtom);
  const selectedId = get(selectedActivityIdAtom);
  return activities.find((a) => a.id === selectedId) ?? null;
});

// Activities at risk today
export const atRiskActivitiesAtom = atom((get) => {
  const activities = get(activitiesAtom);
  return activities.filter((activity) => isStreakAtRisk(activity));
});

// Check if activity is checked in today
export const isActivityCheckedInTodayAtom = (activityId: string) =>
  atom((get) => {
    const activities = get(activitiesAtom);
    const activity = activities.find((a) => a.id === activityId);
    const today = formatDate(new Date());
    return activity?.checkIns.includes(today) ?? false;
  });
