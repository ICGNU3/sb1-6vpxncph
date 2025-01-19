/**
 * ErrorMessage Component
 * Displays error messages with optional retry functionality
 * 
 * Features:
 * - Consistent error message styling
 * - Optional retry button
 * - Customizable error message
 * - Visual error indicator
 */
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-400/10 border border-red-400/20 rounded-lg p-6 text-center ${className}`}>
      <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-400 mb-4">
        {message || 'An error occurred while loading the data'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}