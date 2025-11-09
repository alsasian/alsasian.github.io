import { useState } from 'react';
import type { NotificationSettings as NotificationSettingsType } from '../../lib/streak/types';
import { requestNotificationPermission, canSendNotifications } from '../../lib/streak/notificationManager';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdate: (settings: NotificationSettingsType) => void;
}

export default function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handleEnableToggle = async () => {
    if (!settings.enabled) {
      // Trying to enable - request permission first
      setIsRequestingPermission(true);
      const granted = await requestNotificationPermission();
      setIsRequestingPermission(false);

      if (granted) {
        onUpdate({
          ...settings,
          enabled: true,
          permissionGranted: true,
        });
      } else {
        // Permission denied or not granted
        alert(
          'Please enable notifications in your browser settings to use this feature. ' +
            'On iOS: Settings > Safari > [This Website] > Notifications'
        );
      }
    } else {
      // Disabling notifications
      onUpdate({
        ...settings,
        enabled: false,
      });
    }
  };

  const handleTimeChange = (field: 'morningReminderTime' | 'eveningReminderTime', value: string) => {
    onUpdate({
      ...settings,
      [field]: value,
    });
  };

  const handleToggle = (field: keyof NotificationSettingsType) => {
    onUpdate({
      ...settings,
      [field]: !settings[field],
    });
  };

  const canNotify = canSendNotifications();
  const showPermissionWarning = settings.enabled && !canNotify;

  return (
    <section className="mb-6 border-l-4 border-gray-300 dark:border-gray-700 pl-3 py-4">
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
        Notifications & Reminders
      </h3>

      {/* Enable notifications toggle */}
      <div className="mb-4">
        <label className="flex items-center justify-between min-h-[44px] cursor-pointer">
          <div className="flex-1">
            <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
              Enable Notifications
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Get reminders to maintain your streaks
            </p>
          </div>
          <div className="ml-4">
            <button
              type="button"
              onClick={handleEnableToggle}
              disabled={isRequestingPermission}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled
                  ? 'bg-gray-900 dark:bg-gray-100'
                  : 'bg-gray-300 dark:bg-gray-700'
              } ${isRequestingPermission ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Toggle notifications"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                  settings.enabled
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
        <div className="mb-4 p-3 border border-yellow-600 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ Notification permission not granted. Check your browser settings.
          </p>
        </div>
      )}

      {/* Settings only visible when enabled */}
      {settings.enabled && (
        <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-800">
          {/* Morning reminder */}
          <div>
            <label className="flex items-center justify-between min-h-[44px] cursor-pointer mb-2">
              <span className="text-sm text-gray-900 dark:text-gray-100">Morning Reminder</span>
              <button
                type="button"
                onClick={() => handleToggle('morningReminderEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.morningReminderEnabled
                    ? 'bg-gray-900 dark:bg-gray-100'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label="Toggle morning reminder"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    settings.morningReminderEnabled
                      ? 'translate-x-6 bg-gray-100 dark:bg-gray-900'
                      : 'translate-x-1 bg-gray-100 dark:bg-gray-900'
                  }`}
                />
              </button>
            </label>
            {settings.morningReminderEnabled && (
              <input
                type="time"
                value={settings.morningReminderTime}
                onChange={(e) => handleTimeChange('morningReminderTime', e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Daily reminder showing activities to track
            </p>
          </div>

          {/* Evening reminder */}
          <div>
            <label className="flex items-center justify-between min-h-[44px] cursor-pointer mb-2">
              <span className="text-sm text-gray-900 dark:text-gray-100">Evening Reminder</span>
              <button
                type="button"
                onClick={() => handleToggle('eveningReminderEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.eveningReminderEnabled
                    ? 'bg-gray-900 dark:bg-gray-100'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label="Toggle evening reminder"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    settings.eveningReminderEnabled
                      ? 'translate-x-6 bg-gray-100 dark:bg-gray-900'
                      : 'translate-x-1 bg-gray-100 dark:bg-gray-900'
                  }`}
                />
              </button>
            </label>
            {settings.eveningReminderEnabled && (
              <input
                type="time"
                value={settings.eveningReminderTime}
                onChange={(e) => handleTimeChange('eveningReminderTime', e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Reminder if you have incomplete activities
            </p>
          </div>

          {/* At-risk streak alerts */}
          <div>
            <label className="flex items-center justify-between min-h-[44px] cursor-pointer">
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">Streak Alerts</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Alert 2 hours before midnight for at-risk streaks
                </p>
              </div>
              <div className="ml-4">
                <button
                  type="button"
                  onClick={() => handleToggle('atRiskAlertsEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.atRiskAlertsEnabled
                      ? 'bg-gray-900 dark:bg-gray-100'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle at-risk alerts"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                      settings.atRiskAlertsEnabled
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
      {!settings.enabled && (
        <div className="mt-4 p-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            📱 Enable notifications to receive:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>Morning reminders for daily activities</li>
            <li>Evening check-ins if activities are incomplete</li>
            <li>Alerts when your streaks are at risk</li>
          </ul>
        </div>
      )}
    </section>
  );
}
