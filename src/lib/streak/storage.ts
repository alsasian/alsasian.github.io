/**
 * LocalStorage abstraction for Streak Tracker data
 */

import type { StreakData, Activity, AppSettings } from './types';

const STORAGE_KEY = 'streak-tracker-data';
const CURRENT_VERSION = '1.0.0';

const DEFAULT_SETTINGS: AppSettings = {
  allowStreakRecovery: false,
  startOfWeek: 1, // Monday
  theme: 'auto',
};

const DEFAULT_DATA: StreakData = {
  activities: [],
  settings: DEFAULT_SETTINGS,
  version: CURRENT_VERSION,
};

/**
 * Load all data from localStorage
 */
export function loadData(): StreakData {
  if (typeof window === 'undefined') {
    return DEFAULT_DATA;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_DATA;
    }

    const data = JSON.parse(stored) as StreakData;

    // Merge with defaults to handle new fields
    return {
      ...DEFAULT_DATA,
      ...data,
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
    };
  } catch (error) {
    console.error('Error loading streak data:', error);
    return DEFAULT_DATA;
  }
}

/**
 * Save all data to localStorage
 */
export function saveData(data: StreakData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
}

/**
 * Add a new activity
 */
export function addActivity(activity: Activity): void {
  const data = loadData();
  data.activities.push(activity);
  saveData(data);
}

/**
 * Update an existing activity
 */
export function updateActivity(id: string, updates: Partial<Activity>): void {
  const data = loadData();
  const index = data.activities.findIndex((a) => a.id === id);

  if (index !== -1) {
    data.activities[index] = { ...data.activities[index], ...updates };
    saveData(data);
  }
}

/**
 * Delete an activity
 */
export function deleteActivity(id: string): void {
  const data = loadData();
  data.activities = data.activities.filter((a) => a.id !== id);
  saveData(data);
}

/**
 * Check in for an activity on a specific date
 */
export function checkIn(activityId: string, date: string): void {
  const data = loadData();
  const activity = data.activities.find((a) => a.id === activityId);

  if (activity && !activity.checkIns.includes(date)) {
    activity.checkIns.push(date);
    activity.checkIns.sort(); // Keep dates sorted
    saveData(data);
  }
}

/**
 * Remove a check-in for an activity on a specific date
 */
export function removeCheckIn(activityId: string, date: string): void {
  const data = loadData();
  const activity = data.activities.find((a) => a.id === activityId);

  if (activity) {
    activity.checkIns = activity.checkIns.filter((d) => d !== date);
    saveData(data);
  }
}

/**
 * Update app settings
 */
export function updateSettings(updates: Partial<AppSettings>): void {
  const data = loadData();
  data.settings = { ...data.settings, ...updates };
  saveData(data);
}

/**
 * Export data as JSON string
 */
export function exportData(): string {
  const data = loadData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON string
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as StreakData;

    // Basic validation
    if (!data.activities || !Array.isArray(data.activities)) {
      throw new Error('Invalid data format');
    }

    saveData(data);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}
