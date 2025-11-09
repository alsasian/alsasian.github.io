import { atom } from 'jotai';

// Page routing
export type PageType = 'main' | 'calendar' | 'settings';
export const currentPageAtom = atom<PageType>('main');

// Modal states
export const showAddActivityModalAtom = atom<boolean>(false);

// Activity selection (for detail view)
export const selectedActivityIdAtom = atom<string | null>(null);

// Expanded activity cards (for showing/hiding details)
export const expandedActivityIdsAtom = atom<Set<string>>(new Set<string>());

// Calendar month navigation
export const calendarMonthAtom = atom<{ year: number; month: number }>({
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
});
