import { useState, useEffect } from 'react';

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [newVersion, setNewVersion] = useState<string>('');

  useEffect(() => {
    // Listen for service worker update messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          setNewVersion(event.data.version);
          setShowUpdate(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    // Reload the page to activate the new service worker
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="border-2 border-gray-900 bg-white p-4 shadow-lg dark:border-gray-100 dark:bg-gray-950">
        <div className="mb-3">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Update Available
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            A new version ({newVersion}) is ready. Reload to update?
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="flex-1 border border-gray-900 bg-gray-900 px-4 py-2 text-xs font-bold text-gray-100 transition-colors hover:bg-gray-800 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Reload Now
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
