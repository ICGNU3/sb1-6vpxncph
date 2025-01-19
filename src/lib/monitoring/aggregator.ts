/**
 * Metrics Aggregator
 * Aggregates and processes metrics data
 */
import type { Metric } from './metrics';

export class MetricsAggregator {
  // Aggregate metrics by time interval
  aggregate(
    metrics: Metric[],
    interval: number
  ): Record<string, number> {
    const buckets = new Map<number, number[]>();
    
    // Group metrics into time buckets
    metrics.forEach(metric => {
      const bucketTime = Math.floor(metric.timestamp / interval) * interval;
      if (!buckets.has(bucketTime)) {
        buckets.set(bucketTime, []);
      }
      buckets.get(bucketTime)!.push(metric.value);
    });

    // Calculate aggregates for each bucket
    const result: Record<string, number> = {};
    buckets.forEach((values, time) => {
      result[new Date(time).toISOString()] = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length
      };
    });

    return result;
  }

  // Calculate percentiles
  calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  // Calculate standard deviation
  calculateStdDev(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - mean;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }
}