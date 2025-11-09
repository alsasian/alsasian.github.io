/**
 * Core data types for the Streak Tracker app
 */

export interface Activity {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string; // ISO date string
  checkIns: string[]; // Array of ISO date strings (YYYY-MM-DD)
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  completionRate: number; // 0-100
  lastCheckIn: string | null; // ISO date string or null
}

export interface AppSettings {
  allowStreakRecovery: boolean; // Allow 1-day grace period
  startOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  theme: 'light' | 'dark' | 'auto';
}

export interface StreakData {
  activities: Activity[];
  settings: AppSettings;
  version: string; // For future data migrations
}
