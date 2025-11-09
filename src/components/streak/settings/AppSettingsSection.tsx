import { useAtomValue, useSetAtom } from 'jotai';
import { settingsAtom, updateSettingsAtom } from '@/lib/streak/atoms';

export default function AppSettingsSection() {
  const settings = useAtomValue(settingsAtom);
  const updateSettings = useSetAtom(updateSettingsAtom);

  return (
    <section className="border streak-border-subtle p-4 ">
      <h3 className="mb-3 text-sm font-bold streak-text-primary">
        App Preferences
      </h3>

      <div className="space-y-4">
        {/* Streak Recovery */}
        <div>
          <label className="flex min-h-[44px] cursor-pointer items-center justify-between">
            <div className="flex-1">
              <span className="text-sm font-medium streak-text-primary">
                Streak Recovery
              </span>
              <p className="mt-1 text-xs streak-text-secondary">
                Allow 1-day grace period for maintaining streaks
              </p>
            </div>
            <div className="ml-4">
              <button
                type="button"
                onClick={() =>
                  updateSettings({
                    allowStreakRecovery: !settings.allowStreakRecovery,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowStreakRecovery
                    ? 'bg-gray-900 dark:bg-gray-100'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label="Toggle streak recovery"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    settings.allowStreakRecovery
                      ? 'translate-x-6 bg-gray-100 dark:bg-gray-900'
                      : 'translate-x-1 bg-gray-100 dark:bg-gray-900'
                  }`}
                />
              </button>
            </div>
          </label>
        </div>

        {/* Week Start */}
        <div>
          <label className="block">
            <span className="text-sm font-medium streak-text-primary">
              Week Starts On
            </span>
            <p className="mt-1 text-xs streak-text-secondary">
              Choose the first day of the week for calendar view
            </p>
            <select
              value={settings.startOfWeek}
              onChange={(e) =>
                updateSettings({
                  startOfWeek: Number(e.target.value) as 0 | 1,
                })
              }
              className="mt-2 min-h-[44px] w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
            </select>
          </label>
        </div>

        {/* Theme */}
        <div>
          <label className="block">
            <span className="text-sm font-medium streak-text-primary">
              Theme
            </span>
            <p className="mt-1 text-xs streak-text-secondary">
              Choose your color scheme preference
            </p>
            <select
              value={settings.theme}
              onChange={(e) =>
                updateSettings({
                  theme: e.target.value as 'light' | 'dark' | 'auto',
                })
              }
              className="mt-2 min-h-[44px] w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
