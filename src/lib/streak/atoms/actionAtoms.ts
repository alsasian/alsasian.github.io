import { atom } from 'jotai';
import { activitiesAtom, settingsAtom } from './dataAtoms';
import { addToastAtom } from './toastAtoms';
import { showAddActivityModalAtom, expandedActivityIdsAtom } from './uiAtoms';
import { formatDate, generateId, getColorPalette } from '../utils';
import { calculateStats } from '../streakCalculator';
import { updateBadge } from '../notificationManager';
import type { Activity, AppSettings } from '../types';

// Add a new activity
export const addActivityAtom = atom(
  null,
  (get, set, name: string) => {
    const activities = get(activitiesAtom);
    const colors = getColorPalette();

    const newActivity: Activity = {
      id: generateId(),
      name: name.trim(),
      color: colors[activities.length % colors.length],
      createdAt: new Date().toISOString(),
      checkIns: [],
    };

    const updated = [...activities, newActivity];
    set(activitiesAtom, updated);
    set(showAddActivityModalAtom, false);
    set(addToastAtom, {
      type: 'success',
      title: 'Activity created',
      description: `"${name}" added to your tracker`,
    });

    // Update badge
    updateBadge(updated);
  }
);

// Update an activity
export const updateActivityAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<Activity> }) => {
    const activities = get(activitiesAtom);
    const updated = activities.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    set(activitiesAtom, updated);
    set(addToastAtom, {
      type: 'success',
      title: 'Activity updated',
    });
  }
);

// Delete an activity
export const deleteActivityAtom = atom(null, (get, set, id: string) => {
  const activities = get(activitiesAtom);
  const activity = activities.find((a) => a.id === id);
  const filtered = activities.filter((a) => a.id !== id);

  set(activitiesAtom, filtered);
  set(addToastAtom, {
    type: 'info',
    title: 'Activity deleted',
    description: activity ? `"${activity.name}" removed` : undefined,
  });

  // Update badge
  updateBadge(filtered);
});

// Check in to an activity
export const checkInActivityAtom = atom(
  null,
  (get, set, { activityId, date }: { activityId: string; date?: string }) => {
    const activities = get(activitiesAtom);
    const settings = get(settingsAtom);
    const checkInDate = date ?? formatDate(new Date());

    const updated = activities.map((a) => {
      if (a.id !== activityId) return a;
      if (a.checkIns.includes(checkInDate)) return a; // Already checked in

      return {
        ...a,
        checkIns: [...a.checkIns, checkInDate].sort(),
      };
    });

    set(activitiesAtom, updated);

    // Get updated stats for toast
    const activity = updated.find((a) => a.id === activityId);
    if (activity) {
      const stats = calculateStats(activity, settings.allowStreakRecovery);
      set(addToastAtom, {
        type: 'success',
        title: 'Streak updated! 🔥',
        description: `${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''} in a row`,
      });
    }

    // Update badge
    updateBadge(updated);
  }
);

// Remove a check-in
export const removeCheckInAtom = atom(
  null,
  (get, set, { activityId, date }: { activityId: string; date: string }) => {
    const activities = get(activitiesAtom);

    const updated = activities.map((a) => {
      if (a.id !== activityId) return a;
      return {
        ...a,
        checkIns: a.checkIns.filter((d) => d !== date),
      };
    });

    set(activitiesAtom, updated);
    set(addToastAtom, {
      type: 'info',
      title: 'Check-in removed',
    });

    // Update badge
    updateBadge(updated);
  }
);

// Update settings
export const updateSettingsAtom = atom(
  null,
  (get, set, updates: Partial<AppSettings>) => {
    const settings = get(settingsAtom);
    set(settingsAtom, { ...settings, ...updates });
    set(addToastAtom, {
      type: 'success',
      title: 'Settings saved',
    });
  }
);

// Toggle activity expansion
export const toggleActivityExpansionAtom = atom(
  null,
  (get, set, activityId: string) => {
    const expanded = get(expandedActivityIdsAtom);
    const newExpanded = new Set(expanded);

    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }

    set(expandedActivityIdsAtom, newExpanded);
  }
);
