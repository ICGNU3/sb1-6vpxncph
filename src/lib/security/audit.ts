/**
 * Security Audit System
 * Comprehensive security auditing for smart contracts and platform infrastructure
 */
import { PublicKey } from '@solana/web3.js';
import { TokenInfo, TokenHolder } from '../contracts/program/src/token_standards';
import { AccessControl, Role, Permission } from './accessControl';
import { errorTracker } from '../lib/monitoring';

// Audit event types
export enum AuditEventType {
  // Contract Events
  CONTRACT_CALL = 'contract_call',
  TOKEN_TRANSFER = 'token_transfer',
  PERMISSION_CHANGE = 'permission_change',
  ROLE_CHANGE = 'role_change',
  
  // Security Events
  AUTH_ATTEMPT = 'auth_attempt',
  ACCESS_VIOLATION = 'access_violation',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  
  // System Events
  CONFIG_CHANGE = 'config_change',
  STATE_CHANGE = 'state_change',
  ERROR = 'error'
}

// Audit event severity
export enum AuditSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Audit event interface
interface AuditEvent {
  id: string;
  type: AuditEventType;
  severity: AuditSeverity;
  timestamp: number;
  actor: string;
  target?: string;
  details: Record<string, any>;
  metadata?: Record<string, any>;
}

export class SecurityAuditor {
  private events: AuditEvent[] = [];
  private accessControl: AccessControl;
  private alertThresholds: Map<AuditEventType, number>;
  private suspiciousPatterns: Map<string, RegExp>;

  constructor(accessControl: AccessControl) {
    this.accessControl = accessControl;
    this.alertThresholds = new Map();
    this.suspiciousPatterns = new Map();
    this.initializeThresholds();
    this.initializePatterns();
  }

  private initializeThresholds() {
    this.alertThresholds.set(AuditEventType.AUTH_ATTEMPT, 5); // 5 failed attempts
    this.alertThresholds.set(AuditEventType.ACCESS_VIOLATION, 3); // 3 violations
    this.alertThresholds.set(AuditEventType.SUSPICIOUS_ACTIVITY, 2); // 2 suspicious events
  }

  private initializePatterns() {
    this.suspiciousPatterns.set(
      'largeTransfer',
      /amount:[0-9]{7,}/
    );
    this.suspiciousPatterns.set(
      'rapidTransactions',
      /timestamp:(\d+).*timestamp:(\d+)/
    );
    this.suspiciousPatterns.set(
      'multipleAccounts',
      /accounts:\[.*\],accounts:\[.*\]/
    );
  }

  // Audit contract calls
  async auditContractCall(
    program: string,
    instruction: string,
    accounts: string[],
    data: any
  ): Promise<void> {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      type: AuditEventType.CONTRACT_CALL,
      severity: AuditSeverity.INFO,
      timestamp: Date.now(),
      actor: accounts[0], // Assuming first account is caller
      target: program,
      details: {
        instruction,
        accounts,
        data
      }
    };

    // Check for suspicious patterns
    if (this.detectSuspiciousActivity(event)) {
      event.severity = AuditSeverity.HIGH;
      await this.handleSuspiciousActivity(event);
    }

    this.events.push(event);
  }

  // Audit token operations
  async auditTokenOperation(
    operation: 'mint' | 'burn' | 'transfer',
    tokenInfo: TokenInfo,
    amount: number,
    from?: PublicKey,
    to?: PublicKey
  ): Promise<void> {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      type: AuditEventType.TOKEN_TRANSFER,
      severity: AuditSeverity.INFO,
      timestamp: Date.now(),
      actor: from?.toString() || tokenInfo.authority.toString(),
      target: to?.toString(),
      details: {
        operation,
        amount,
        token: tokenInfo.metadata.symbol
      }
    };

    // Check large transfers
    if (this.isLargeTransfer(amount, tokenInfo)) {
      event.severity = AuditSeverity.HIGH;
      await this.handleLargeTransfer(event);
    }

    this.events.push(event);
  }

  // Audit permission changes
  async auditPermissionChange(
    userId: string,
    permission: Permission,
    action: 'grant' | 'revoke'
  ): Promise<void> {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      type: AuditEventType.PERMISSION_CHANGE,
      severity: AuditSeverity.MEDIUM,
      timestamp: Date.now(),
      actor: userId,
      details: {
        permission,
        action
      }
    };

    // Check for sensitive permission changes
    if (this.isSensitivePermission(permission)) {
      event.severity = AuditSeverity.HIGH;
      await this.handleSensitivePermissionChange(event);
    }

    this.events.push(event);
  }

  // Audit role changes
  async auditRoleChange(
    userId: string,
    role: Role,
    action: 'assign' | 'remove'
  ): Promise<void> {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      type: AuditEventType.ROLE_CHANGE,
      severity: AuditSeverity.MEDIUM,
      timestamp: Date.now(),
      actor: userId,
      details: {
        role,
        action
      }
    };

    // Check for sensitive role changes
    if (this.isSensitiveRole(role)) {
      event.severity = AuditSeverity.HIGH;
      await this.handleSensitiveRoleChange(event);
    }

    this.events.push(event);
  }

  // Audit authentication attempts
  async auditAuthAttempt(
    userId: string,
    success: boolean,
    method: string
  ): Promise<void> {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      type: AuditEventType.AUTH_ATTEMPT,
      severity: success ? AuditSeverity.INFO : AuditSeverity.LOW,
      timestamp: Date.now(),
      actor: userId,
      details: {
        success,
        method
      }
    };

    // Check for multiple failed attempts
    if (!success && this.hasRepeatedFailures(userId)) {
      event.severity = AuditSeverity.HIGH;
      await this.handleRepeatedAuthFailures(event);
    }

    this.events.push(event);
  }

  // Check for suspicious activity
  private detectSuspiciousActivity(event: AuditEvent): boolean {
    const eventString = JSON.stringify(event);
    
    for (const [_, pattern] of this.suspiciousPatterns) {
      if (pattern.test(eventString)) {
        return true;
      }
    }
    
    return false;
  }

  // Check for large transfers
  private isLargeTransfer(amount: number, tokenInfo: TokenInfo): boolean {
    const threshold = tokenInfo.total_supply * 0.1; // 10% of total supply
    return amount > threshold;
  }

  // Check for sensitive permissions
  private isSensitivePermission(permission: Permission): boolean {
    return [
      Permission.MANAGE_PLATFORM,
      Permission.MANAGE_ROLES,
      Permission.MANAGE_USERS
    ].includes(permission);
  }

  // Check for sensitive roles
  private isSensitiveRole(role: Role): boolean {
    return [Role.ADMIN, Role.CREATOR].includes(role);
  }

  // Check for repeated auth failures
  private hasRepeatedFailures(userId: string): boolean {
    const recentFailures = this.events
      .filter(e => 
        e.type === AuditEventType.AUTH_ATTEMPT &&
        e.actor === userId &&
        !e.details.success &&
        e.timestamp > Date.now() - 3600000 // Last hour
      );
    
    return recentFailures.length >= (
      this.alertThresholds.get(AuditEventType.AUTH_ATTEMPT) || 5
    );
  }

  // Handle suspicious activity
  private async handleSuspiciousActivity(event: AuditEvent): Promise<void> {
    errorTracker.track(new Error('Suspicious activity detected'), {
      event,
      timestamp: new Date().toISOString()
    });
    
    // Add to monitoring queue
    await this.addToMonitoring(event);
  }

  // Handle large transfers
  private async handleLargeTransfer(event: AuditEvent): Promise<void> {
    errorTracker.track(new Error('Large transfer detected'), {
      event,
      timestamp: new Date().toISOString()
    });
    
    // Add to monitoring queue
    await this.addToMonitoring(event);
  }

  // Handle sensitive permission changes
  private async handleSensitivePermissionChange(event: AuditEvent): Promise<void> {
    errorTracker.track(new Error('Sensitive permission change detected'), {
      event,
      timestamp: new Date().toISOString()
    });
    
    // Add to monitoring queue
    await this.addToMonitoring(event);
  }

  // Handle sensitive role changes
  private async handleSensitiveRoleChange(event: AuditEvent): Promise<void> {
    errorTracker.track(new Error('Sensitive role change detected'), {
      event,
      timestamp: new Date().toISOString()
    });
    
    // Add to monitoring queue
    await this.addToMonitoring(event);
  }

  // Handle repeated auth failures
  private async handleRepeatedAuthFailures(event: AuditEvent): Promise<void> {
    errorTracker.track(new Error('Repeated authentication failures detected'), {
      event,
      timestamp: new Date().toISOString()
    });
    
    // Add to monitoring queue
    await this.addToMonitoring(event);
  }

  // Add event to monitoring queue
  private async addToMonitoring(event: AuditEvent): Promise<void> {
    // In production, this would send to a monitoring service
    console.warn('Security event added to monitoring:', {
      id: event.id,
      type: event.type,
      severity: event.severity,
      timestamp: new Date(event.timestamp).toISOString()
    });
  }

  // Get audit events with filtering
  getEvents(
    options: {
      type?: AuditEventType;
      severity?: AuditSeverity;
      startTime?: number;
      endTime?: number;
      actor?: string;
    } = {}
  ): AuditEvent[] {
    let filtered = this.events;

    if (options.type) {
      filtered = filtered.filter(e => e.type === options.type);
    }

    if (options.severity) {
      filtered = filtered.filter(e => e.severity === options.severity);
    }

    if (options.startTime) {
      filtered = filtered.filter(e => e.timestamp >= options.startTime!);
    }

    if (options.endTime) {
      filtered = filtered.filter(e => e.timestamp <= options.endTime!);
    }

    if (options.actor) {
      filtered = filtered.filter(e => e.actor === options.actor);
    }

    return filtered;
  }

  // Get security metrics
  getMetrics(): Record<string, any> {
    const now = Date.now();
    const hourAgo = now - 3600000;

    return {
      totalEvents: this.events.length,
      recentEvents: this.events.filter(e => e.timestamp > hourAgo).length,
      severityBreakdown: {
        critical: this.events.filter(e => e.severity === AuditSeverity.CRITICAL).length,
        high: this.events.filter(e => e.severity === AuditSeverity.HIGH).length,
        medium: this.events.filter(e => e.severity === AuditSeverity.MEDIUM).length,
        low: this.events.filter(e => e.severity === AuditSeverity.LOW).length,
        info: this.events.filter(e => e.severity === AuditSeverity.INFO).length
      },
      typeBreakdown: Object.values(AuditEventType).reduce((acc, type) => ({
        ...acc,
        [type]: this.events.filter(e => e.type === type).length
      }), {})
    };
  }
}