import type { ReactNode } from 'react';

interface CryptoSectionProps {
  number: number;
  title: string;
  description: string;
  warning?: string;
  children: ReactNode;
}

export function CryptoSection({
  number,
  title,
  description,
  warning,
  children,
}: CryptoSectionProps) {
  return (
    <section className="border-l-4 border-gray-900 pl-4 dark:border-gray-100">
      <h2 className="mb-2 text-2xl font-bold">
        {number}. {title}
      </h2>
      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
        {description}
        {warning && (
          <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400">{warning}</span>
        )}
      </p>
      <div className="space-y-3 border border-gray-300 p-3 dark:border-gray-600 dark:bg-gray-800">
        {children}
      </div>
    </section>
  );
}
