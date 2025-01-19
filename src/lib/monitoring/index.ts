/**
 * Optimized Monitoring System
 */
import { MetricsCollector, MetricType } from './metrics';
import { AlertingSystem, AlertSeverity } from './alerting';
import { errorTracker } from './errorTracker';

// Singleton instance
let instance: MonitoringSystem | null = null;

class MonitoringSystem {
  private metricsCollector: MetricsCollector;
  private alertingSystem: AlertingSystem;
  private alertRules = [
    {
      id: 'high-error-rate',
      name: 'High Error Rate',
      metricName: 'error_rate',
      condition: 'gt',
      threshold: 0.1,
      severity: AlertSeverity.ERROR,
      cooldown: 300000
    },
    {
      id: 'high-latency',
      name: 'High API Latency',
      metricName: 'api_latency',
      condition: 'gt',
      threshold: 1000,
      severity: AlertSeverity.WARNING,
      cooldown: 60000
    }
  ];

  private constructor() {
    this.metricsCollector = new MetricsCollector();
    this.alertingSystem = new AlertingSystem(this.metricsCollector);
    this.initialize();
  }

  static getInstance(): MonitoringSystem {
    if (!instance) {
      instance = new MonitoringSystem();
    }
    return instance;
  }

  private initialize(): void {
    // Initialize alert rules
    this.alertRules.forEach(rule => this.alertingSystem.addRule(rule));

    // Start monitoring loop
    setInterval(() => this.alertingSystem.checkRules(), 10000);
  }

  recordMetric(name: string, value: number, type: MetricType): void {
    this.metricsCollector.record(name, value, type);
  }
}

// Export optimized interface
export const metrics = {
  recordLatency: (name: string, duration: number) => 
    MonitoringSystem.getInstance().recordMetric(
      `${name}_latency`,
      duration,
      MetricType.HISTOGRAM
    ),

  recordError: (name: string) =>
    MonitoringSystem.getInstance().recordMetric(
      `${name}_error_rate`,
      1,
      MetricType.COUNTER
    ),

  recordRequest: (name: string) =>
    MonitoringSystem.getInstance().recordMetric(
      `${name}_requests`,
      1, 
      MetricType.COUNTER
    )
};

export { errorTracker, MetricType, AlertSeverity };