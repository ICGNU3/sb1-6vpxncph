/**
 * Alerting System
 * Handles alert rules, notifications, and alert management
 */
import { MetricsCollector, MetricType } from './metrics';
import { errorTracker } from './errorTracker';

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface AlertRule {
  id: string;
  name: string;
  metricName: string;
  condition: 'gt' | 'lt' | 'eq' | 'ne';
  threshold: number;
  severity: AlertSeverity;
  labels?: Record<string, string>;
  cooldown?: number;
}

export interface Alert {
  id: string;
  ruleId: string;
  severity: AlertSeverity;
  message: string;
  value: number;
  timestamp: number;
  status: 'active' | 'resolved';
  resolvedAt?: number;
}

export class AlertingSystem {
  private rules: Map<string, AlertRule>;
  private alerts: Map<string, Alert>;
  private metricsCollector: MetricsCollector;
  private lastAlertTime: Map<string, number>;

  constructor(metricsCollector: MetricsCollector) {
    this.rules = new Map();
    this.alerts = new Map();
    this.metricsCollector = metricsCollector;
    this.lastAlertTime = new Map();
  }

  // Add a new alert rule
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  // Remove an alert rule
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  // Check metrics against alert rules
  async checkRules(): Promise<void> {
    try {
      for (const rule of this.rules.values()) {
        const metrics = this.metricsCollector.getMetrics(
          rule.metricName,
          Date.now() - 60000 // Last minute
        );

        if (metrics.length === 0) continue;

        const latestMetric = metrics[metrics.length - 1];
        const shouldAlert = this.evaluateRule(rule, latestMetric.value);

        if (shouldAlert && this.canSendAlert(rule)) {
          await this.createAlert(rule, latestMetric.value);
        } else if (!shouldAlert) {
          await this.resolveAlerts(rule.id);
        }
      }
    } catch (error) {
      errorTracker.track(error as Error);
    }
  }

  // Evaluate a rule against a value
  private evaluateRule(rule: AlertRule, value: number): boolean {
    switch (rule.condition) {
      case 'gt':
        return value > rule.threshold;
      case 'lt':
        return value < rule.threshold;
      case 'eq':
        return value === rule.threshold;
      case 'ne':
        return value !== rule.threshold;
      default:
        return false;
    }
  }

  // Check if we can send an alert (respecting cooldown)
  private canSendAlert(rule: AlertRule): boolean {
    if (!rule.cooldown) return true;

    const lastAlert = this.lastAlertTime.get(rule.id);
    if (!lastAlert) return true;

    return Date.now() - lastAlert > rule.cooldown;
  }

  // Create a new alert
  private async createAlert(rule: AlertRule, value: number): Promise<void> {
    const alert: Alert = {
      id: crypto.randomUUID(),
      ruleId: rule.id,
      severity: rule.severity,
      message: this.generateAlertMessage(rule, value),
      value,
      timestamp: Date.now(),
      status: 'active'
    };

    this.alerts.set(alert.id, alert);
    this.lastAlertTime.set(rule.id, Date.now());

    await this.notifyAlert(alert);
  }

  // Generate alert message
  private generateAlertMessage(rule: AlertRule, value: number): string {
    const condition = {
      gt: 'exceeded',
      lt: 'fell below',
      eq: 'equals',
      ne: 'differs from'
    }[rule.condition];

    return `${rule.name}: ${rule.metricName} ${condition} threshold of ${rule.threshold} (current value: ${value})`;
  }

  // Resolve alerts for a rule
  private async resolveAlerts(ruleId: string): Promise<void> {
    for (const alert of this.alerts.values()) {
      if (alert.ruleId === ruleId && alert.status === 'active') {
        alert.status = 'resolved';
        alert.resolvedAt = Date.now();
        await this.notifyAlertResolution(alert);
      }
    }
  }

  // Notify about new alert
  private async notifyAlert(alert: Alert): Promise<void> {
    // In production, this would send to notification service
    console.warn('Alert triggered:', {
      id: alert.id,
      severity: alert.severity,
      message: alert.message,
      timestamp: new Date(alert.timestamp).toISOString()
    });
  }

  // Notify about alert resolution
  private async notifyAlertResolution(alert: Alert): Promise<void> {
    // In production, this would send to notification service
    console.info('Alert resolved:', {
      id: alert.id,
      severity: alert.severity,
      message: alert.message,
      resolvedAt: new Date(alert.resolvedAt!).toISOString()
    });
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values())
      .filter(alert => alert.status === 'active');
  }

  // Get alert history
  getAlertHistory(
    startTime?: number,
    endTime?: number
  ): Alert[] {
    return Array.from(this.alerts.values())
      .filter(alert => 
        (!startTime || alert.timestamp >= startTime) &&
        (!endTime || alert.timestamp <= endTime)
      );
  }
}