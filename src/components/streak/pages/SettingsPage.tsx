import NotificationSettingsSection from '../settings/NotificationSettingsSection';
import AppSettingsSection from '../settings/AppSettingsSection';
import DataManagementSection from '../settings/DataManagementSection';

export default function SettingsPage() {
  return (
    <div className="px-4 pt-4">
      <div className="mb-4">
        <h2 className="streak-page-title">Settings</h2>
        <p className="mt-1 text-xs streak-text-secondary">
          Customize your streak tracking experience
        </p>
      </div>

      <div className="space-y-6">
        <NotificationSettingsSection />
        <AppSettingsSection />
        <DataManagementSection />
      </div>
    </div>
  );
}
