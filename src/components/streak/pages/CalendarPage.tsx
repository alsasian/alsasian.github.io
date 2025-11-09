import { useAtomValue } from 'jotai';
import { activitiesAtom } from '@/lib/streak/atoms';
import Calendar from '../calendar/Calendar';

export default function CalendarPage() {
  const activities = useAtomValue(activitiesAtom);

  return (
    <div className="px-4 pt-4">
      <div className="mb-4">
        <h2 className="streak-page-title">Calendar</h2>
        <p className="mt-1 text-xs streak-text-secondary">
          {activities.length === 0
            ? 'No activities yet'
            : `Viewing check-ins for all ${activities.length} ${activities.length === 1 ? 'activity' : 'activities'}`}
        </p>
      </div>

      {activities.length > 0 ? (
        <Calendar />
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm streak-text-secondary">
            Create an activity to start tracking!
          </p>
        </div>
      )}
    </div>
  );
}
