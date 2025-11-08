import type { ReactNode } from 'react';

interface ActionButtonProps {
  onClick: () => void;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  children: ReactNode;
}

export function ActionButton({
  onClick,
  loading = false,
  loadingText,
  disabled = false,
  children
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full px-3 py-2 bg-gray-900 text-white font-bold text-sm hover:bg-gray-700 disabled:opacity-50"
    >
      {loading ? (loadingText || 'Loading...') : children}
    </button>
  );
}
