import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { settingsAtom, updateSettingsAtom } from '@/lib/streak/atoms';
import {
  requestNotificationPermission,
  canSendNotifications,
} from '@/lib/streak/notificationManager';
import type { NotificationSettings } from '@/lib/streak/types';

export default function NotificationSettingsSection() {
  const settings = useAtomValue(settingsAtom);
  const updateSettings = useSetAtom(updateSettingsAtom);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const notifSettings = settings.notifications;

  const handleEnableToggle = async () => {
    if (!notifSettings.enabled) {
      setIsRequestingPermission(true);
      const granted = await requestNotificationPermission();
      setIsRequestingPermission(false);

      if (granted) {
        updateSettings({
          notifications: {
            ...notifSettings,
            enabled: true,
            permissionGranted: true,
          },
        });
      } else {
        alert(
          'Please enable notifications in your browser settings to use this feature. ' +
            'On iOS: Settings > Safari > [This Website] > Notifications'
        );
      }
    } else {
      updateSettings({
        notifications: {
          ...notifSettings,
          enabled: false,
        },
      });
    }
  };

  const handleTimeChange = (
    field: 'morningReminderTime' | 'eveningReminderTime',
    value: string
  ) => {
    updateSettings({
      notifications: {
        ...notifSettings,
        [field]: value,
      },
    });
  };

  const handleToggle = (field: keyof NotificationSettings) => {
    updateSettings({
      notifications: {
        ...notifSettings,
        [field]: !notifSettings[field],
      },
    });
  };

  const canNotify = canSendNotifications();
  const showPermissionWarning = notifSettings.enabled && !canNotify;

  return (
    <section className="glass-elevated border streak-border-subtle rounded-2xl p-4">
      <h3 className="mb-3 text-sm font-bold streak-text-primary">
        Notifications & Reminders
      </h3>

      {/* Enable notifications toggle */}
      <div className="mb-4">
        <label className="flex min-h-[44px] cursor-pointer items-center justify-between">
          <div className="flex-1">
            <span className="text-sm font-medium streak-text-primary">
              Enable Notifications
            </span>
            <p className="mt-1 text-xs streak-text-secondary">
              Get reminders to maintain your streaks
            </p>
          </div>
          <div className="ml-4">
            <button
              type="button"
              onClick={handleEnableToggle}
              disabled={isRequestingPermission}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifSettings.enabled
                  ? 'bg-gray-900 dark:bg-gray-100'
                  : 'bg-gray-300 dark:bg-gray-700'
              } ${isRequestingPermission ? 'cursor-not-allowed opacity-50' : ''}`}
              aria-label="Toggle notifications"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                  notifSettings.enabled
                    ? 'translate-x-6 bg-gray-100 dark:bg-gray-900'
                    : 'translate-x-1 bg-gray-100 dark:bg-gray-900'
                }`}
              />
            </button>
          </div>
        </label>
      </div>

      {/* Permission warning */}
      {showPermissionWarning && (
        <div className="mb-4 border border-yellow-600 bg-yellow-50 p-3 dark:border-yellow-500 dark:bg-yellow-950">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ Notification permission not granted. Check your browser settings.
          </p>
        </div>
      )}

      {/* Settings only visible when enabled */}
      {notifSettings.enabled && (
        <div className="space-y-4 border-t border-gray-300 pt-4 dark:border-gray-700">
          {/* Morning reminder */}
          <div>
            <label className="mb-2 flex min-h-[44px] cursor-pointer items-center justify-between">
              <span className="text-sm streak-text-primary">
                Morning Reminder
              </span>
              <button
                type="button"
                onClick={() => handleToggle('morningReminderEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifSettings.morningReminderEnabled
                    ? 'bg-gray-900 dark:bg-gray-100'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label="Toggle morning reminder"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    notifSettings.morningReminderEnabled
                      ? 'translate-x-6 bg-gray-100 dark:bg-gray-900'
                      : 'translate-x-1 bg-gray-100 dark:bg-gray-900'
                  }`}
                />
              </button>
            </label>
            {notifSettings.morningReminderEnabled && (
              <input
                type="time"
                value={notifSettings.morningReminderTime}
                onChange={(e) => handleTimeChange('morningReminderTime', e.target.value)}
                className="min-h-[44px] w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            )}
            <p className="mt-1 text-xs streak-text-secondary">
              Daily reminder showing activities to track
            </p>
          </div>

          {/* Evening reminder */}
          <div>
            <label className="mb-2 flex min-h-[44px] cursor-pointer items-center justify-between">
              <span className="text-sm streak-text-primary">
                Evening Reminder
              </span>
              <button
                type="button"
                onClick={() => handleToggle('eveningReminderEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifSettings.eveningReminderEnabled
                    ? 'bg-gray-900 dark:bg-gray-100'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label="Toggle evening reminder"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    notifSettings.eveningReminderEnabled
                      ? 'translate-x-6 bg-gray-100 dark:bg-gray-900'
                      : 'translate-x-1 bg-gray-100 dark:bg-gray-900'
                  }`}
                />
              </button>
            </label>
            {notifSettings.eveningReminderEnabled && (
              <input
                type="time"
                value={notifSettings.eveningReminderTime}
                onChange={(e) => handleTimeChange('eveningReminderTime', e.target.value)}
                className="min-h-[44px] w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            )}
            <p className="mt-1 text-xs streak-text-secondary">
              Reminder if you have incomplete activities
            </p>
          </div>

          {/* At-risk streak alerts */}
          <div>
            <label className="flex min-h-[44px] cursor-pointer items-center justify-between">
              <div className="flex-1">
                <span className="text-sm streak-text-primary">
                  Streak Alerts
                </span>
                <p className="mt-1 text-xs streak-text-secondary">
                  Alert 2 hours before midnight for at-risk streaks
                </p>
              </div>
              <div className="ml-4">
                <button
                  type="button"
                  onClick={() => handleToggle('atRiskAlertsEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifSettings.atRiskAlertsEnabled
                      ? 'bg-gray-900 dark:bg-gray-100'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle at-risk alerts"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                      notifSettings.atRiskAlertsEnabled
                        ? 'translate-x-6 bg-gray-100 dark:bg-gray-900'
                        : 'translate-x-1 bg-gray-100 dark:bg-gray-900'
                    }`}
                  />
                </button>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Info note */}
      {!notifSettings.enabled && (
        <div className="mt-4 border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs streak-text-secondary">
            📱 Enable notifications to receive:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs streak-text-secondary">
            <li>Morning reminders for daily activities</li>
            <li>Evening check-ins if activities are incomplete</li>
            <li>Alerts when your streaks are at risk</li>
          </ul>
        </div>
      )}
    </section>
  );
}
