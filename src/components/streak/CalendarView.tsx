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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          ←
        </button>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getMonthName(currentMonth)} {currentYear}
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={goToToday}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Go to today
            </button>
          )}
        </div>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {getDayNames(startOfWeek).map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isCheckedIn = day !== null && checkInDays.has(day);
          const isToday =
            day !== null &&
            isCurrentMonth &&
            day === today.getDate();

          return (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                day === null
                  ? ''
                  : isCheckedIn
                    ? 'bg-green-500 text-white font-semibold'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              } ${isToday ? 'ring-2 ring-purple-500' : ''}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded" />
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}
