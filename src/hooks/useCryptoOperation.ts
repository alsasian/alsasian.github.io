import { useState } from 'react';

/**
 * Custom hook for handling crypto operations with consistent loading and error handling
 */
export function useCryptoOperation() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const execute = async (handler: () => Promise<string>) => {
    setLoading(true);
    try {
      const result = await handler();
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  return { output, loading, execute, setOutput };
}
