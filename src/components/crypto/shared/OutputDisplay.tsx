import { copyToClipboard } from '../../../utils/encoding';

interface OutputDisplayProps {
  label: string;
  value: string;
  success?: boolean;
  error?: boolean;
}

export function OutputDisplay({ label, value, success, error }: OutputDisplayProps) {
  const getClassName = () => {
    if (success)
      return 'p-2 border bg-green-50 border-green-500 dark:bg-green-900 dark:border-green-600';
    if (error) return 'p-2 border bg-red-50 border-red-500 dark:bg-red-900 dark:border-red-600';
    return 'w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100';
  };

  // For success/error messages, use simple display
  if (success || error) {
    return (
      <div className={getClassName()}>
        <p className="text-sm font-bold">{value}</p>
      </div>
    );
  }

  // For normal output, use pre with copy button
  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-bold">{label}</label>
      <pre className={getClassName()}>{value}</pre>
      <button
        onClick={() => copyToClipboard(value)}
        className="absolute right-2 top-6 border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        Copy
      </button>
    </div>
  );
}
