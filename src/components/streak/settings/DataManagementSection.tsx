import { useAtomValue, useSetAtom } from 'jotai';
import { streakDataAtom, activitiesAtom, settingsAtom, addToastAtom } from '@/lib/streak/atoms';
import { exportData, importData, clearAllData, loadData } from '@/lib/streak/storage';

export default function DataManagementSection() {
  const data = useAtomValue(streakDataAtom);
  const setActivities = useSetAtom(activitiesAtom);
  const setSettings = useSetAtom(settingsAtom);
  const addToast = useSetAtom(addToastAtom);

  const handleExport = () => {
    try {
      const json = exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `streak-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast({
        type: 'success',
        title: 'Data exported',
        description: 'Backup file downloaded',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const success = importData(text);

        if (success) {
          // Reload data from storage after successful import
          const imported = loadData();
          setActivities(imported.activities);
          setSettings(imported.settings);

          addToast({
            type: 'success',
            title: 'Data imported',
            description: `Restored ${imported.activities.length} activities`,
          });
        } else {
          throw new Error('Import failed');
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Import failed',
          description: error instanceof Error ? error.message : 'Invalid backup file',
        });
      }
    };

    input.click();
  };

  const handleClear = () => {
    if (
      !confirm(
        'Are you sure you want to delete ALL data? This cannot be undone.\n\n' +
          'Consider exporting your data first as a backup.'
      )
    ) {
      return;
    }

    try {
      clearAllData();
      setActivities([]);
      setSettings({
        allowStreakRecovery: true,
        startOfWeek: 1,
        theme: 'auto',
        notifications: {
          enabled: false,
          morningReminderEnabled: false,
          morningReminderTime: '09:00',
          eveningReminderEnabled: false,
          eveningReminderTime: '20:00',
          atRiskAlertsEnabled: false,
          permissionGranted: false,
        },
      });

      addToast({
        type: 'info',
        title: 'All data cleared',
        description: 'Starting fresh',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Clear failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <section className="border streak-border-subtle p-4 ">
      <h3 className="mb-3 text-sm font-bold streak-text-primary">
        Data Management
      </h3>

      <div className="space-y-3">
        <div>
          <p className="mb-2 text-xs streak-text-secondary">
            Backup and restore your streak data
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 border border-gray-900 bg-white px-4 py-2 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-100  dark:text-gray-100 dark:hover:bg-gray-900"
            >
              Export Data
            </button>
            <button
              onClick={handleImport}
              className="flex-1 border border-gray-900 bg-white px-4 py-2 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-100  dark:text-gray-100 dark:hover:bg-gray-900"
            >
              Import Data
            </button>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-3 dark:border-gray-700">
          <p className="mb-2 text-xs streak-text-secondary">
            ⚠️ Danger zone
          </p>
          <button
            onClick={handleClear}
            className="w-full border border-red-600 bg-white px-4 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:bg-gray-950 dark:text-red-400 dark:hover:bg-red-950"
          >
            Clear All Data
          </button>
        </div>

        <div className="border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs streak-text-secondary">
            <strong>Current data:</strong> {data.activities.length} activities,{' '}
            {data.activities.reduce((sum, a) => sum + a.checkIns.length, 0)} total check-ins
          </p>
        </div>
      </div>
    </section>
  );
}
