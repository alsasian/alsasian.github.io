import { useState, useEffect } from 'react';
import type { StreakData, NotificationSettings as NotificationSettingsType } from '../../lib/streak/types';
import { loadData, updateSettings } from '../../lib/streak/storage';
import { updateBadge, scheduleAllNotifications } from '../../lib/streak/notificationManager';
import TodaySummary from './TodaySummary';
import ActivityList from './ActivityList';
import AddActivityForm from './AddActivityForm';
import CalendarView from './CalendarView';
import NotificationSettings from './NotificationSettings';

export default function StreakApp() {
  const [data, setData] = useState<StreakData>(() => loadData());
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Update badge whenever activities change
  useEffect(() => {
    updateBadge(data.activities);
  }, [data.activities]);

  // Schedule notifications whenever settings or activities change
  useEffect(() => {
    scheduleAllNotifications(data.activities, data.settings.notifications);
  }, [data.activities, data.settings.notifications]);

  const handleUpdate = () => {
    setData(loadData());
  };

  const handleNotificationSettingsUpdate = (notificationSettings: NotificationSettingsType) => {
    updateSettings({ notifications: notificationSettings });
    setData(loadData());
  };

  const selectedActivity = selectedActivityId
    ? data.activities.find((a) => a.id === selectedActivityId)
    : null;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header - simplified */}
      <header className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">Streak Tracker</p>
        {!showCalendar && !showSettings && (
          <button
            onClick={() => setShowSettings(true)}
            className="min-h-[44px] px-4 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Settings"
          >
            ⚙️ Settings
          </button>
        )}
      </header>

      {/* Settings View */}
      {showSettings && (
        <div className="mb-6">
          <button
            onClick={() => setShowSettings(false)}
            className="mb-4 min-h-[44px] px-4 text-sm font-bold text-gray-900 dark:text-gray-100 hover:underline"
          >
            ← Back to activities
          </button>
          <div className="mb-4 border-l-4 border-gray-900 dark:border-gray-100 pl-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
          </div>
          <NotificationSettings
            settings={data.settings.notifications}
            onUpdate={handleNotificationSettingsUpdate}
          />
        </div>
      )}

      {/* Calendar View (when activity selected) */}
      {showCalendar && selectedActivity && (
        <div className="mb-6">
          <button
            onClick={() => {
              setShowCalendar(false);
              setSelectedActivityId(null);
            }}
            className="mb-4 min-h-[44px] px-4 text-sm font-bold text-gray-900 hover:underline dark:text-gray-100"
          >
            ← Back to activities
          </button>
          <div className="mb-4 border-l-4 border-gray-900 pl-3 dark:border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {selectedActivity.name}
            </h2>
          </div>
          <CalendarView activity={selectedActivity} startOfWeek={data.settings.startOfWeek} />
        </div>
      )}

      {/* Main View */}
      {!showCalendar && !showSettings && (
        <>
          {/* Today's Summary */}
          <TodaySummary activities={data.activities} />

          {/* Activity List */}
          <section className="mb-6">
            <ActivityList
              activities={data.activities}
              allowRecovery={data.settings.allowStreakRecovery}
              onUpdate={handleUpdate}
            />
          </section>

          {/* Add Activity Form - moved to bottom */}
          <section className="mb-6">
            <AddActivityForm onAdd={handleUpdate} />
          </section>

          {/* View Calendar Section */}
          {data.activities.length > 0 && (
            <section className="mt-6 border-t border-gray-300 pt-6 dark:border-gray-700">
              <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">Calendar</h3>
              <div className="space-y-2">
                {data.activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => {
                      setSelectedActivityId(activity.id);
                      setShowCalendar(true);
                    }}
                    className="flex w-full items-center justify-between border border-gray-300 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {activity.name}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">→</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-300 pb-8 pt-6 text-center dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          All data is stored locally in your browser
        </p>
      </footer>
    </div>
  );
}
