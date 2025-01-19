/**
 * Incentive System
 * Core incentive mechanisms for platform engagement
 */
import { metrics } from '../monitoring';
import { SecurityAuditor } from '../security/audit';
import { AccessControl } from '../security/accessControl';

// Singleton instance
let instance: IncentiveSystem | null = null;

export class IncentiveSystem {
  private accessControl: AccessControl;
  private securityAuditor: SecurityAuditor;
  private rewards: Map<string, number>;
  private streaks: Map<string, number>;
  private lastActivity: Map<string, number>;

  private constructor(accessControl: AccessControl, securityAuditor: SecurityAuditor) {
    this.accessControl = accessControl;
    this.securityAuditor = securityAuditor;
    this.rewards = new Map();
    this.streaks = new Map();
    this.lastActivity = new Map();
  }

  static getInstance(accessControl: AccessControl, securityAuditor: SecurityAuditor): IncentiveSystem {
    if (!instance) {
      instance = new IncentiveSystem(accessControl, securityAuditor);
    }
    return instance;
  }

  // Record activity and calculate rewards
  async recordActivity(userId: string, activityType: ActivityType, data: any): Promise<number> {
    const startTime = Date.now();
    metrics.recordRequest('incentive_activity');

    try {
      const reward = this.calculateReward(activityType, data);
      this.updateStreak(userId);
      this.rewards.set(userId, (this.rewards.get(userId) || 0) + reward);
      
      await this.securityAuditor.auditContractCall(
        'incentives',
        'recordActivity',
        [userId],
        { activityType, reward }
      );

      metrics.recordLatency('incentive_activity', Date.now() - startTime);
      return reward;
    } catch (error) {
      metrics.recordError('incentive_activity');
      throw error;
    }
  }

  // Calculate reward based on activity type and impact
  private calculateReward(type: ActivityType, data: any): number {
    const baseReward = ACTIVITY_REWARDS[type] || 0;
    let multiplier = 1;

    // Quality multiplier
    if (data.quality) {
      multiplier *= Math.min(data.quality, 2);
    }

    // Impact multiplier
    if (data.impact) {
      multiplier *= Math.min(data.impact, 3);
    }

    // Scarcity multiplier
    if (data.scarcity) {
      multiplier *= Math.min(1 + data.scarcity, 2);
    }

    return Math.round(baseReward * multiplier);
  }

  // Update user activity streak
  private updateStreak(userId: string): void {
    const now = Date.now();
    const lastActive = this.lastActivity.get(userId) || 0;
    const daysSinceActive = Math.floor((now - lastActive) / (24 * 60 * 60 * 1000));

    if (daysSinceActive === 1) {
      // Consecutive day
      this.streaks.set(userId, (this.streaks.get(userId) || 0) + 1);
    } else if (daysSinceActive > 1) {
      // Streak broken
      this.streaks.set(userId, 1);
    }

    this.lastActivity.set(userId, now);
  }

  // Get user rewards
  getRewards(userId: string): number {
    return this.rewards.get(userId) || 0;
  }

  // Get user streak
  getStreak(userId: string): number {
    return this.streaks.get(userId) || 0;
  }
}

// Activity types and base rewards
export enum ActivityType {
  CREATE_PROJECT = 'create_project',
  COMPLETE_PROJECT = 'complete_project',
  CONTRIBUTE = 'contribute',
  REVIEW = 'review',
  SHARE_RESOURCE = 'share_resource',
  EXCHANGE_RESOURCE = 'exchange_resource',
  REFER_USER = 'refer_user',
  PROVIDE_FEEDBACK = 'provide_feedback'
}

const ACTIVITY_REWARDS: Record<ActivityType, number> = {
  [ActivityType.CREATE_PROJECT]: 100,
  [ActivityType.COMPLETE_PROJECT]: 500,
  [ActivityType.CONTRIBUTE]: 50,
  [ActivityType.REVIEW]: 30,
  [ActivityType.SHARE_RESOURCE]: 80,
  [ActivityType.EXCHANGE_RESOURCE]: 60,
  [ActivityType.REFER_USER]: 200,
  [ActivityType.PROVIDE_FEEDBACK]: 20
};