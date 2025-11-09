import { useState } from 'react';
import type { Activity } from '../../lib/streak/types';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  getDayNames,
} from '../../lib/streak/utils';
import { getMonthCheckIns } from '../../lib/streak/streakCalculator';

interface CalendarViewProps {
  activity: Activity;
  startOfWeek?: 0 | 1;
}

export default function CalendarView({ activity, startOfWeek = 1 }: CalendarViewProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const checkInDays = getMonthCheckIns(activity, currentYear, currentMonth);

  // Adjust first day based on start of week preference
  const adjustedFirstDay = startOfWeek === 1 ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div className="border border-gray-300 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300 dark:border-gray-700">
        <button
          onClick={previousMonth}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          aria-label="Previous month"
        >
          ←
        </button>

        <div className="text-center">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {getMonthName(currentMonth)} {currentYear}
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={goToToday}
              className="text-xs text-gray-600 dark:text-gray-400 hover:underline mt-1"
            >
              Go to today
            </button>
          )}
        </div>

        <button
          onClick={nextMonth}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-px mb-px border border-gray-300 dark:border-gray-700">
        {getDayNames(startOfWeek).map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-gray-700 dark:text-gray-300 py-2 bg-gray-100 dark:bg-gray-800"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px border border-gray-300 dark:border-gray-700 border-t-0">
        {calendarDays.map((day, index) => {
          const isCheckedIn = day !== null && checkInDays.has(day);
          const isToday =
            day !== null &&
            isCurrentMonth &&
            day === today.getDate();

          return (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-xs ${
                day === null
                  ? 'bg-white dark:bg-gray-900'
                  : isCheckedIn
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400'
              } ${isToday ? 'ring-2 ring-inset ring-gray-900 dark:ring-gray-100' : ''}`}
            >
              {day ? (isCheckedIn ? '✓' : day) : ''}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700 flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-bold">✓</span>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 border border-gray-300 dark:border-gray-700"></span>
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}
