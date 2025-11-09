import { atom } from 'jotai';
import { generateId } from '../utils';

export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // milliseconds, default 5000
}

// All active toasts
export const toastsAtom = atom<Toast[]>([]);

// Add a toast (write-only atom)
export const addToastAtom = atom(
  null,
  (get, set, toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id };
    set(toastsAtom, [...get(toastsAtom), newToast]);

    // Auto-dismiss after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set(removeToastAtom, id);
      }, duration);
    }
  }
);

// Remove a toast (write-only atom)
export const removeToastAtom = atom(null, (get, set, id: string) => {
  set(
    toastsAtom,
    get(toastsAtom).filter((t) => t.id !== id)
  );
});

// Clear all toasts (write-only atom)
export const clearToastsAtom = atom(null, (_get, set) => {
  set(toastsAtom, []);
});
