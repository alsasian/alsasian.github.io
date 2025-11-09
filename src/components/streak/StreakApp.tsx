import { useState, useEffect } from 'react';
import type { StreakData } from '../../lib/streak/types';
import { loadData } from '../../lib/streak/storage';
import ActivityList from './ActivityList';
import AddActivityForm from './AddActivityForm';
import CalendarView from './CalendarView';

export default function StreakApp() {
  const [data, setData] = useState<StreakData | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Load data on mount
  useEffect(() => {
    setData(loadData());
  }, []);

  const handleUpdate = () => {
    setData(loadData());
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const selectedActivity = selectedActivityId
    ? data.activities.find((a) => a.id === selectedActivityId)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="mb-4 border-b border-gray-300 dark:border-gray-700 pb-4">
        <h1 className="text-4xl mb-2 text-gray-900 dark:text-gray-100">Streak Tracker</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your daily habits and build lasting streaks
        </p>
      </header>

      {/* Calendar View (when activity selected) */}
      {showCalendar && selectedActivity && (
        <div className="mb-6">
          <button
            onClick={() => {
              setShowCalendar(false);
              setSelectedActivityId(null);
            }}
            className="mb-4 min-h-[44px] px-4 text-sm font-bold text-gray-900 dark:text-gray-100 hover:underline"
          >
            ← Back to activities
          </button>
          <div className="mb-4 border-l-4 border-gray-900 dark:border-gray-100 pl-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {selectedActivity.name}
            </h2>
          </div>
          <CalendarView activity={selectedActivity} startOfWeek={data.settings.startOfWeek} />
        </div>
      )}

      {/* Main View */}
      {!showCalendar && (
        <>
          {/* Add Activity Form */}
          <section className="mb-6">
            <AddActivityForm onAdd={handleUpdate} />
          </section>

          {/* Activity List */}
          <section className="mb-6">
            <ActivityList
              activities={data.activities}
              allowRecovery={data.settings.allowStreakRecovery}
              onUpdate={handleUpdate}
            />
          </section>

          {/* View Calendar Section */}
          {data.activities.length > 0 && (
            <section className="mt-6 border-l-4 border-gray-300 dark:border-gray-700 pl-3 py-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                View Calendar
              </h3>
              <div className="space-y-2">
                {data.activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => {
                      setSelectedActivityId(activity.id);
                      setShowCalendar(true);
                    }}
                    className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
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
      <footer className="mt-12 text-center border-t border-gray-300 dark:border-gray-700 pt-6 pb-8">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          All data is stored locally in your browser
        </p>
      </footer>
    </div>
  );
}
