import { copyToClipboard } from '../../../utils/encoding';

interface OutputDisplayProps {
  label: string;
  value: string;
  success?: boolean;
  error?: boolean;
}

export function OutputDisplay({ label, value, success, error }: OutputDisplayProps) {
  const getClassName = () => {
    if (success) return 'p-2 border bg-green-50 border-green-500';
    if (error) return 'p-2 border bg-red-50 border-red-500';
    return 'w-full px-2 py-1 bg-gray-100 border border-gray-300 text-gray-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all';
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
      <label className="block text-sm font-bold mb-1">{label}</label>
      <pre className={getClassName()}>
        {value}
      </pre>
      <button
        onClick={() => copyToClipboard(value)}
        className="absolute top-6 right-2 px-2 py-1 bg-white hover:bg-gray-200 text-gray-900 text-xs border border-gray-300"
      >
        Copy
      </button>
    </div>
  );
}
