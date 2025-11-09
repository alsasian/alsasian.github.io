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
        <div className="font-mono text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  const selectedActivity = selectedActivityId
    ? data.activities.find((a) => a.id === selectedActivityId)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="border-b-2 border-gray-700 pb-6 mb-6">
        <div className="font-mono text-xs text-gray-600 mb-2">$ streak-tracker</div>
        <h1 className="font-mono text-xl uppercase tracking-wide text-gray-100 mb-1">
          STREAK TRACKER
        </h1>
        <p className="font-mono text-xs text-gray-500">Track your daily habits</p>
      </div>

      {/* Calendar View (when activity selected) */}
      {showCalendar && selectedActivity && (
        <div className="mb-6">
          <button
            onClick={() => {
              setShowCalendar(false);
              setSelectedActivityId(null);
            }}
            className="mb-4 min-h-[44px] px-4 border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300 font-mono text-xs uppercase tracking-wide transition-colors"
          >
            ← BACK
          </button>
          <div className="mb-4 border-l-4 border-green-400 pl-4">
            <h2 className="font-mono text-base uppercase tracking-wide text-gray-100">
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
          <div className="mb-6">
            <AddActivityForm onAdd={handleUpdate} />
          </div>

          {/* Activity List */}
          <div className="mb-6">
            <ActivityList
              activities={data.activities}
              allowRecovery={data.settings.allowStreakRecovery}
              onUpdate={handleUpdate}
            />
          </div>

          {/* View Calendar Section */}
          {data.activities.length > 0 && (
            <div className="mt-6 border-2 border-gray-700 p-4">
              <h3 className="font-mono text-xs uppercase text-gray-600 mb-3">View Calendar</h3>
              <div className="space-y-2">
                {data.activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => {
                      setSelectedActivityId(activity.id);
                      setShowCalendar(true);
                    }}
                    className="w-full text-left px-4 py-3 border-2 border-gray-700 bg-gray-950 hover:border-gray-500 transition-colors flex items-center justify-between"
                  >
                    <span className="font-mono text-sm text-gray-100">
                      {activity.name}
                    </span>
                    <span className="font-mono text-xs text-gray-600">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="mt-12 text-center border-t-2 border-gray-700 pt-6 pb-8">
        <p className="font-mono text-xs text-gray-600">
          All data stored locally in browser
        </p>
      </div>
    </div>
  );
}
