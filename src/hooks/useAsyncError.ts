/**
 * useAsyncError Hook
 * Custom hook for handling asynchronous errors
 * 
 * Features:
 * - Async error state management
 * - Loading state handling
 * - Retry functionality
 * - Error recovery
 */
import { useState, useCallback } from 'react';

export function useAsyncError<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  options: {
    onError?: (error: Error) => void;
    onSuccess?: (result: Awaited<ReturnType<T>>) => void;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: Parameters<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn(...args);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFn, options.onError, options.onSuccess]);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return {
    execute,
    loading,
    error,
    reset
  };
}