import { useAtomValue } from 'jotai';
import { toastsAtom } from '@/lib/streak/atoms';
import Toast from './Toast';

export default function ToastContainer() {
  const toasts = useAtomValue(toastsAtom);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="toast-container fixed left-4 right-4 top-4 z-50 mx-auto max-w-md space-y-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
