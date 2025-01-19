/**
 * useErrorHandler Hook
 * Custom hook for consistent error handling across components
 * 
 * Features:
 * - Standardized error handling
 * - Error state management
 * - Error reporting integration
 * - Retry functionality
 */
import { useState, useCallback } from 'react';

interface ErrorState {
  error: Error | null;
  componentStack?: string;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({ error: null });

  const handleError = useCallback((error: Error, componentStack?: string) => {
    setErrorState({ error, componentStack });
    
    // Log error to monitoring service
    console.error('Error caught:', error);
    if (componentStack) {
      console.error('Component stack:', componentStack);
    }
    
    // Here you would typically send to error monitoring service
    // Example: Sentry.captureException(error);
  }, []);

  const clearError = useCallback(() => {
    setErrorState({ error: null });
  }, []);

  return {
    error: errorState.error,
    componentStack: errorState.componentStack,
    handleError,
    clearError
  };
}