/**
 * LoadingBoundary Component
 * Handles loading states with fallback UI
 * 
 * Features:
 * - Suspense-like functionality for loading states
 * - Customizable loading indicator
 * - Minimum display time to prevent flashing
 * - Delayed loading indicator for fast responses
 */
import React, { useState, useEffect } from 'react';

interface LoadingBoundaryProps {
  children: React.ReactNode;
  loading: boolean;
  fallback?: React.ReactNode;
  minDisplayTime?: number;
  delayMs?: number;
}

export function LoadingBoundary({
  children,
  loading,
  fallback,
  minDisplayTime = 500,
  delayMs = 200
}: LoadingBoundaryProps) {
  const [showLoader, setShowLoader] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (loading && !showLoader) {
      timeout = setTimeout(() => {
        setShowLoader(true);
        setStartTime(Date.now());
      }, delayMs);
    } else if (!loading && showLoader && startTime) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      timeout = setTimeout(() => {
        setShowLoader(false);
        setStartTime(null);
      }, remainingTime);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [loading, showLoader, startTime, delayMs, minDisplayTime]);

  if (showLoader) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}