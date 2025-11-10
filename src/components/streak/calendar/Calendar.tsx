import { useAtom, useAtomValue } from 'jotai';
import { calendarMonthAtom, activitiesAtom, settingsAtom } from '@/lib/streak/atoms';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  getDayNames,
  formatDate,
} from '@/lib/streak/utils';

export default function Calendar() {
  const [{ year, month }, setCalendarMonth] = useAtom(calendarMonthAtom);
  const activities = useAtomValue(activitiesAtom);
  const settings = useAtomValue(settingsAtom);

  const today = new Date();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Adjust first day based on start of week preference
  const adjustedFirstDay =
    settings.startOfWeek === 1 ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;

  const previousMonth = () => {
    if (month === 0) {
      setCalendarMonth({ month: 11, year: year - 1 });
    } else {
      setCalendarMonth({ month: month - 1, year });
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setCalendarMonth({ month: 0, year: year + 1 });
    } else {
      setCalendarMonth({ month: month + 1, year });
    }
  };

  const goToToday = () => {
    setCalendarMonth({
      month: today.getMonth(),
      year: today.getFullYear(),
    });
  };

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

  // Helper to get activities checked in on a specific day
  const getActivitiesForDay = (day: number): string[] => {
    const dateStr = formatDate(new Date(year, month, day));
    return activities
      .filter((a) => a.checkIns.includes(dateStr))
      .map((a) => a.name);
  };

  return (
    <div className="glass-elevated border streak-border-subtle rounded-2xl p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between pb-3 border-b streak-divider">
        <button
          onClick={previousMonth}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center streak-text-secondary hover:streak-text-primary transition-colors duration-ios ease-ios"
          aria-label="Previous month"
        >
          ←
        </button>

        <div className="text-center">
          <h3 className="text-base font-bold streak-text-primary">
            {getMonthName(month)} {year}
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={goToToday}
              className="mt-1 text-xs streak-text-secondary hover:underline transition-colors duration-ios ease-ios"
            >
              Go to today
            </button>
          )}
        </div>

        <button
          onClick={nextMonth}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center streak-text-secondary hover:streak-text-primary transition-colors duration-ios ease-ios"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="mb-2 grid grid-cols-7">
        {getDayNames(settings.startOfWeek).map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-bold streak-text-secondary"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={index}
                className="aspect-square"
              />
            );
          }

          const isToday =
            isCurrentMonth &&
            day === today.getDate();

          const activitiesOnDay = getActivitiesForDay(day);
          const hasCheckIns = activitiesOnDay.length > 0;

          return (
            <div
              key={index}
              className={`
                aspect-square flex flex-col items-center justify-center text-xs rounded transition-all duration-ios ease-ios
                ${hasCheckIns
                  ? 'bg-gray-900 font-bold text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'streak-text-secondary'
                }
                ${isToday ? 'ring-2 ring-inset ring-gray-900 dark:ring-gray-100' : ''}
              `}
              title={hasCheckIns ? activitiesOnDay.join(', ') : undefined}
            >
              <div>{day}</div>
              {hasCheckIns && (
                <div className="mt-0.5 text-[10px]">
                  {activitiesOnDay.length === 1 ? '✓' : `${activitiesOnDay.length}✓`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 border-t streak-divider pt-3 text-xs streak-text-secondary">
        <div className="flex items-center gap-2">
          <span className="font-bold">✓</span>
          <span>Activities completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 border streak-border-subtle rounded"></span>
          <span>No check-ins</span>
        </div>
      </div>
    </div>
  );
}
