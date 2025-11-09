import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Activity, AppSettings } from '../types';
import { loadData } from '../storage';

// Load initial data from localStorage
const initialData = loadData();

// Core data atoms synced with localStorage
// Using atomWithStorage for automatic persistence
export const activitiesAtom = atomWithStorage<Activity[]>(
  'streak-tracker-activities',
  initialData.activities
);

export const settingsAtom = atomWithStorage<AppSettings>(
  'streak-tracker-settings',
  initialData.settings
);

// Combined data atom for full export/import
export const streakDataAtom = atom(
  (get) => ({
    activities: get(activitiesAtom),
    settings: get(settingsAtom),
    version: '1.0.0',
  })
);
