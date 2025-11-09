/**
 * Notification and Badge API management for Streak Tracker
 */

import type { Activity, NotificationSettings } from './types';
import { isCheckedInToday, isStreakAtRisk, getHoursRemainingToday, calculateStats } from './streakCalculator';

/**
 * Update the app badge to show number of incomplete activities
 */
export function updateBadge(activities: Activity[]): void {
  if (typeof navigator === 'undefined' || !('setAppBadge' in navigator)) {
    return;
  }

  const incompleteCount = activities.filter((activity) => !isCheckedInToday(activity)).length;

  if (incompleteCount > 0) {
    navigator.setAppBadge(incompleteCount).catch((error) => {
      console.error('Failed to set app badge:', error);
    });
  } else {
    navigator.clearAppBadge().catch((error) => {
      console.error('Failed to clear app badge:', error);
    });
  }
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
}

/**
 * Check if notifications are supported and permitted
 */
export function canSendNotifications(): boolean {
  return (
    typeof Notification !== 'undefined' &&
    Notification.permission === 'granted' &&
    'serviceWorker' in navigator
  );
}

/**
 * Schedule a notification via service worker
 */
export async function scheduleNotification(
  title: string,
  body: string,
  tag: string,
  timestamp: number
): Promise<void> {
  if (!canSendNotifications()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Calculate delay from now
    const delay = timestamp - Date.now();

    if (delay <= 0) {
      // Send immediately if time has passed
      await registration.showNotification(title, {
        body,
        tag,
        icon: '/icons/streak-icon-192x192.png',
        badge: '/icons/streak-icon-192x192.png',
        requireInteraction: false,
      });
    } else {
      // Schedule for later (store in localStorage for service worker to check)
      const scheduledNotifications = getScheduledNotifications();
      scheduledNotifications.push({
        title,
        body,
        tag,
        timestamp,
      });
      localStorage.setItem('streak-scheduled-notifications', JSON.stringify(scheduledNotifications));
    }
  } catch (error) {
    console.error('Failed to schedule notification:', error);
  }
}

interface ScheduledNotification {
  title: string;
  body: string;
  tag: string;
  timestamp: number;
}

/**
 * Get all scheduled notifications
 */
function getScheduledNotifications(): ScheduledNotification[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem('streak-scheduled-notifications');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear all scheduled notifications
 */
export function clearScheduledNotifications(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem('streak-scheduled-notifications');
}

/**
 * Schedule all notifications based on settings and activities
 */
export async function scheduleAllNotifications(
  activities: Activity[],
  settings: NotificationSettings
): Promise<void> {
  if (!settings.enabled || !canSendNotifications()) {
    clearScheduledNotifications();
    return;
  }

  clearScheduledNotifications();

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Morning reminder
  if (settings.morningReminderEnabled) {
    const [hours, minutes] = settings.morningReminderTime.split(':').map(Number);
    const morningTime = new Date(now);
    morningTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (morningTime <= now) {
      morningTime.setDate(morningTime.getDate() + 1);
    }

    const incompleteCount = activities.filter((a) => !isCheckedInToday(a)).length;
    await scheduleNotification(
      'Good morning! 🌅',
      `You have ${incompleteCount} ${incompleteCount === 1 ? 'activity' : 'activities'} to track today`,
      'morning-reminder',
      morningTime.getTime()
    );
  }

  // Evening reminder (only if there are incomplete activities)
  if (settings.eveningReminderEnabled) {
    const incompleteActivities = activities.filter((a) => !isCheckedInToday(a));

    if (incompleteActivities.length > 0) {
      const [hours, minutes] = settings.eveningReminderTime.split(':').map(Number);
      const eveningTime = new Date(now);
      eveningTime.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (eveningTime <= now) {
        eveningTime.setDate(eveningTime.getDate() + 1);
      }

      const hoursLeft = Math.ceil((new Date(today + 'T23:59:59').getTime() - now.getTime()) / (1000 * 60 * 60));
      await scheduleNotification(
        'Evening check-in ⏰',
        `${hoursLeft} hours left - ${incompleteActivities.length} ${incompleteActivities.length === 1 ? 'activity' : 'activities'} still incomplete`,
        'evening-reminder',
        eveningTime.getTime()
      );
    }
  }

  // At-risk streak alerts (2 hours before midnight)
  if (settings.atRiskAlertsEnabled) {
    const atRiskActivities = activities.filter((a) => isStreakAtRisk(a));

    if (atRiskActivities.length > 0) {
      const alertTime = new Date(now);
      alertTime.setHours(22, 0, 0, 0); // 10 PM

      // Only schedule if we haven't passed this time today
      if (alertTime > now) {
        for (const activity of atRiskActivities) {
          const stats = calculateStats(activity);
          await scheduleNotification(
            '⚠️ Streak at risk!',
            `Your ${stats.currentStreak}-day streak for "${activity.name}" is at risk! ${getHoursRemainingToday()} hours left.`,
            `at-risk-${activity.id}`,
            alertTime.getTime()
          );
        }
      }
    }
  }
}

/**
 * Send immediate notification for check-in
 */
export async function sendCheckInNotification(activityName: string, streakCount: number): Promise<void> {
  if (!canSendNotifications()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(`🔥 ${streakCount}-day streak!`, {
      body: `Great job checking in "${activityName}"!`,
      tag: 'check-in',
      icon: '/icons/streak-icon-192x192.png',
      badge: '/icons/streak-icon-192x192.png',
      requireInteraction: false,
    });
  } catch (error) {
    console.error('Failed to send check-in notification:', error);
  }
}
