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
    <div className="border-2 border-gray-700 bg-gray-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300 font-mono transition-colors"
          aria-label="Previous month"
        >
          ←
        </button>

        <div className="text-center">
          <h3 className="font-mono text-sm uppercase tracking-wide text-gray-100">
            {getMonthName(currentMonth)} {currentYear}
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={goToToday}
              className="text-xs text-green-400 hover:text-green-300 font-mono mt-1"
            >
              [today]
            </button>
          )}
        </div>

        <button
          onClick={nextMonth}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center border-2 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300 font-mono transition-colors"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-px mb-px border-2 border-gray-700">
        {getDayNames(startOfWeek).map((day) => (
          <div
            key={day}
            className="text-center text-xs font-mono text-gray-600 py-2 bg-gray-900 border-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px border-2 border-t-0 border-gray-700">
        {calendarDays.map((day, index) => {
          const isCheckedIn = day !== null && checkInDays.has(day);
          const isToday =
            day !== null &&
            isCurrentMonth &&
            day === today.getDate();

          return (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center text-xs font-mono ${
                day === null
                  ? 'bg-gray-950'
                  : isCheckedIn
                    ? 'bg-green-400/20 text-green-400 font-bold'
                    : 'bg-gray-900 text-gray-600'
              } ${isToday ? 'border-2 border-green-400' : ''}`}
            >
              {day ? (isCheckedIn ? '✓' : day) : ''}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs font-mono text-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span>○</span>
          <span>missed</span>
        </div>
      </div>
    </div>
  );
}
