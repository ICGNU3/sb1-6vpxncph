/**
 * Performance Tests
 * Tests for application performance and optimization
 */
import { describe, test, expect } from 'vitest';
import { metrics } from '../monitoring';

describe('Performance', () => {
  test('should measure Core Web Vitals', async () => {
    const fcp = metrics.getFCP();
    const lcp = await metrics.getLCP();
    const cls = await metrics.getCLS();

    expect(fcp).toBeGreaterThanOrEqual(0);
    expect(lcp).toBeGreaterThanOrEqual(0);
    expect(cls).toBeGreaterThanOrEqual(0);
  });

  test('should measure navigation timing', () => {
    const timing = metrics.getNavigationTiming();
    
    expect(timing).toHaveProperty('dns');
    expect(timing).toHaveProperty('tcp');
    expect(timing).toHaveProperty('ttfb');
    expect(timing).toHaveProperty('responseTime');
    expect(timing).toHaveProperty('domInteractive');
    expect(timing).toHaveProperty('domComplete');
  });
});