import type { ReactNode } from 'react';

interface CryptoSectionProps {
  number: number;
  title: string;
  description: string;
  warning?: string;
  children: ReactNode;
}

export function CryptoSection({ number, title, description, warning, children }: CryptoSectionProps) {
  return (
    <section className="border-l-4 border-gray-900 pl-4">
      <h2 className="text-2xl font-bold mb-2">{number}. {title}</h2>
      <p className="text-sm text-gray-700 mb-3">
        {description}
        {warning && (
          <span className="block mt-1 text-xs text-gray-600">{warning}</span>
        )}
      </p>
      <div className="border border-gray-300 p-3 space-y-3">
        {children}
      </div>
    </section>
  );
}
