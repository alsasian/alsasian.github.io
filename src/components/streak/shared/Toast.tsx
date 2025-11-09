import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { removeToastAtom, type Toast as ToastType } from '@/lib/streak/atoms';

interface ToastProps {
  toast: ToastType;
}

export default function Toast({ toast }: ToastProps) {
  const removeToast = useSetAtom(removeToastAtom);
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 250); // Match animation duration
  };

  useEffect(() => {
    // Accessibility: announce to screen readers
    const announcement = `${toast.title}${toast.description ? `. ${toast.description}` : ''}`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('role', 'status');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.className = 'sr-only';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);

    return () => {
      document.body.removeChild(ariaLive);
    };
  }, [toast.title, toast.description]);

  // Icon based on type
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  // Border color based on type
  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-700 dark:border-green-400';
      case 'error':
        return 'border-red-700 dark:border-red-400';
      case 'warning':
        return 'border-yellow-700 dark:border-yellow-400';
      case 'info':
      default:
        return 'border-gray-900 dark:border-gray-100';
    }
  };

  return (
    <div
      className={`
        toast-item
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        border-2 streak-surface shadow-lg
        ${getBorderColor()}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span
          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center text-sm font-bold"
          aria-hidden="true"
        >
          {getIcon()}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold streak-text-primary">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-xs streak-text-secondary">
              {toast.description}
            </p>
          )}
        </div>

        {/* Action button */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              handleDismiss();
            }}
            className="flex-shrink-0 text-xs font-bold text-gray-900 underline hover:no-underline dark:text-gray-100"
          >
            {toast.action.label}
          </button>
        )}

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          aria-label="Dismiss notification"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          >
            <path d="M1 1L13 13M13 1L1 13" />
          </svg>
        </button>
      </div>
    </div>
  );
}
