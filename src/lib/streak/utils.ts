/**
 * Utility functions for the Streak Tracker app
 */

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a date string (YYYY-MM-DD) into a Date object
 */
export function parseDate(dateStr: string): Date {
  const date = new Date(dateStr + 'T00:00:00');
  return date;
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * Get the number of days between two dates
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get the number of days in a specific month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the first day of the week for a given month (0 = Sunday, 6 = Saturday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get month name
 */
export function getMonthName(month: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
}

/**
 * Get short day names
 */
export function getDayNames(startOfWeek: 0 | 1 = 1): string[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return startOfWeek === 1 ? [...days.slice(1), days[0]] : days;
}

/**
 * Predefined activity colors
 */
export const ACTIVITY_COLORS = [
  '#667eea', // Purple
  '#f56565', // Red
  '#48bb78', // Green
  '#ed8936', // Orange
  '#38b2ac', // Teal
  '#9f7aea', // Purple-light
  '#ed64a6', // Pink
  '#4299e1', // Blue
];

/**
 * Get a random color from predefined palette
 */
export function getRandomColor(): string {
  return ACTIVITY_COLORS[Math.floor(Math.random() * ACTIVITY_COLORS.length)];
}
