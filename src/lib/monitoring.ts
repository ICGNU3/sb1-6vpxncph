/**
 * Monitoring System
 * Handles error tracking, performance metrics, and user behavior tracking
 */

// Error Tracking
class ErrorTracker {
  private errors: Error[] = [];
  private maxErrors = 100;

  track(error: Error, info?: any, componentStack?: string) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      info,
      componentStack
    };

    console.error('Error tracked:', errorData);
    this.errors.unshift(error);

    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

// Performance Metrics
class Metrics {
  getFCP() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  async getLCP() {
    return new Promise<number>(resolve => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry ? lastEntry.startTime : 0);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    });
  }

  async getCLS() {
    return new Promise<number>(resolve => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        resolve(clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    });
  }

  getNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!navigation) {
      return {
        dns: 0,
        tcp: 0,
        ttfb: 0,
        responseTime: 0,
        domInteractive: 0,
        domComplete: 0
      };
    }

    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      responseTime: navigation.responseEnd - navigation.responseStart,
      domInteractive: navigation.domInteractive,
      domComplete: navigation.domComplete
    };
  }
}

// Behavior Tracking
class BehaviorTracker {
  private events: any[] = [];
  private maxEvents = 1000;

  track(eventName: string, data?: any) {
    const event = {
      eventName,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.events.unshift(event);

    // Keep only the latest events
    if (this.events.length > this.maxEvents) {
      this.events.pop();
    }

    // Log event (in production this would send to analytics service)
    console.log('Behavior tracked:', event);
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}

// Export singleton instances
export const errorTracker = new ErrorTracker();
export const metrics = new Metrics();
export const behaviorTracker = new BehaviorTracker();

// Quick action tracking helper
export const trackQuickAction = (action: string, data?: any) => {
  try {
    behaviorTracker.track('quick_action', { action, data });
    return true;
  } catch (error) {
    errorTracker.track(error as Error);
    return false;
  }
};