/**
 * Metrics Collection System
 * Tracks and aggregates system metrics
 */
import { MetricsAggregator } from './aggregator';
import { errorTracker } from './errorTracker';

export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram'
}

export interface Metric {
  name: string;
  type: MetricType;
  value: number;
  labels: Record<string, string>;
  timestamp: number;
}

export class MetricsCollector {
  private metrics: Map<string, Metric[]>;
  private aggregator: MetricsAggregator;
  private retentionPeriod: number;

  constructor(retentionPeriod = 7 * 24 * 60 * 60 * 1000) { // 7 days
    this.metrics = new Map();
    this.aggregator = new MetricsAggregator();
    this.retentionPeriod = retentionPeriod;
  }

  // Record a new metric
  record(
    name: string,
    value: number,
    type: MetricType,
    labels: Record<string, string> = {}
  ): void {
    try {
      const metric: Metric = {
        name,
        type,
        value,
        labels,
        timestamp: Date.now()
      };

      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }

      this.metrics.get(name)!.push(metric);
      this.cleanOldMetrics(name);
    } catch (error) {
      errorTracker.track(error as Error);
    }
  }

  // Clean up old metrics
  private cleanOldMetrics(name: string): void {
    const metrics = this.metrics.get(name)!;
    const cutoff = Date.now() - this.retentionPeriod;
    
    this.metrics.set(
      name,
      metrics.filter(m => m.timestamp > cutoff)
    );
  }

  // Get metrics for a specific name and time range
  getMetrics(
    name: string,
    startTime?: number,
    endTime?: number
  ): Metric[] {
    const metrics = this.metrics.get(name) || [];
    return metrics.filter(m => 
      (!startTime || m.timestamp >= startTime) &&
      (!endTime || m.timestamp <= endTime)
    );
  }

  // Get aggregated metrics
  getAggregatedMetrics(
    name: string,
    interval: number = 60000 // 1 minute default
  ): Record<string, number> {
    const metrics = this.getMetrics(name);
    return this.aggregator.aggregate(metrics, interval);
  }

  // Get all metric names
  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
  }
}