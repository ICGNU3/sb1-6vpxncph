/**
 * Error Tracking System
 * Tracks and manages error events
 */

export interface ErrorEvent {
  id: string;
  error: Error;
  timestamp: number;
  context?: Record<string, any>;
  stack?: string;
  handled: boolean;
}

class ErrorTracker {
  private errors: ErrorEvent[] = [];
  private maxErrors = 1000;
  private errorPatterns: Map<string, RegExp>;

  constructor() {
    this.errorPatterns = new Map();
    this.initializePatterns();
  }

  private initializePatterns() {
    this.errorPatterns.set(
      'networkError',
      /failed to fetch|network error|timeout/i
    );
    this.errorPatterns.set(
      'authError',
      /unauthorized|forbidden|invalid token/i
    );
    this.errorPatterns.set(
      'contractError',
      /contract call|transaction|instruction/i
    );
  }

  // Track a new error
  track(
    error: Error,
    context?: Record<string, any>,
    stack?: string
  ): void {
    const errorEvent: ErrorEvent = {
      id: crypto.randomUUID(),
      error,
      timestamp: Date.now(),
      context,
      stack: stack || error.stack,
      handled: true
    };

    this.errors.unshift(errorEvent);

    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Log error (in production this would send to error tracking service)
    console.error('Error tracked:', {
      message: error.message,
      type: this.categorizeError(error),
      timestamp: new Date().toISOString(),
      context
    });
  }

  // Categorize error based on patterns
  private categorizeError(error: Error): string {
    const message = error.message.toLowerCase();
    
    for (const [category, pattern] of this.errorPatterns) {
      if (pattern.test(message)) {
        return category;
      }
    }
    
    return 'unknown';
  }

  // Get error history
  getErrors(
    startTime?: number,
    endTime?: number
  ): ErrorEvent[] {
    return this.errors.filter(event => 
      (!startTime || event.timestamp >= startTime) &&
      (!endTime || event.timestamp <= endTime)
    );
  }

  // Get error metrics
  getMetrics(): Record<string, number> {
    const now = Date.now();
    const hourAgo = now - 3600000;
    const dayAgo = now - 86400000;

    return {
      total: this.errors.length,
      lastHour: this.errors.filter(e => e.timestamp > hourAgo).length,
      lastDay: this.errors.filter(e => e.timestamp > dayAgo).length,
      categories: Array.from(this.errorPatterns.keys()).reduce((acc, category) => ({
        ...acc,
        [category]: this.errors.filter(e => 
          this.categorizeError(e.error) === category
        ).length
      }), {})
    };
  }

  // Clear error history
  clear(): void {
    this.errors = [];
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();