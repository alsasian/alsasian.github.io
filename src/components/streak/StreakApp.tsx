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
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const selectedActivity = selectedActivityId
    ? data.activities.find((a) => a.id === selectedActivityId)
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <h1 className="text-4xl font-bold text-white mb-2">🔥 Streak Tracker</h1>
        <p className="text-white/80">Build habits, one day at a time</p>
      </div>

      {/* Calendar View (when activity selected) */}
      {showCalendar && selectedActivity && (
        <div className="mb-4">
          <button
            onClick={() => {
              setShowCalendar(false);
              setSelectedActivityId(null);
            }}
            className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all"
          >
            ← Back to Activities
          </button>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedActivity.name}</h2>
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

          {/* View Calendar Button */}
          {data.activities.length > 0 && (
            <div className="mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">View Calendar</h3>
                <div className="space-y-2">
                  {data.activities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => {
                        setSelectedActivityId(activity.id);
                        setShowCalendar(true);
                      }}
                      className="w-full text-left px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: activity.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {activity.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-white/60 text-sm pb-8">
        <p>All data is stored locally in your browser</p>
      </div>
    </div>
  );
}
