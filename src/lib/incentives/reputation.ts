/**
 * Reputation System
 * Tracks and manages user reputation scores
 */
import { ActivityType } from './index';
import { SecurityAuditor } from '../security/audit';
import { metrics } from '../monitoring';

export class ReputationSystem {
  private reputationScores: Map<string, number>;
  private activityHistory: Map<string, Activity[]>;
  private securityAuditor: SecurityAuditor;

  constructor(securityAuditor: SecurityAuditor) {
    this.reputationScores = new Map();
    this.activityHistory = new Map();
    this.securityAuditor = securityAuditor;
  }

  // Update reputation based on activity
  async updateReputation(
    userId: string,
    activityType: ActivityType,
    impact: number
  ): Promise<number> {
    const startTime = Date.now();
    metrics.recordRequest('reputation_update');

    try {
      const activity: Activity = {
        type: activityType,
        impact,
        timestamp: Date.now()
      };

      // Record activity
      if (!this.activityHistory.has(userId)) {
        this.activityHistory.set(userId, []);
      }
      this.activityHistory.get(userId)!.push(activity);

      // Calculate reputation change
      const reputationChange = this.calculateReputationChange(activity);
      const currentReputation = this.reputationScores.get(userId) || 0;
      const newReputation = Math.max(0, currentReputation + reputationChange);
      
      this.reputationScores.set(userId, newReputation);

      await this.securityAuditor.auditContractCall(
        'reputation',
        'updateReputation',
        [userId],
        { activityType, reputationChange }
      );

      metrics.recordLatency('reputation_update', Date.now() - startTime);
      return newReputation;
    } catch (error) {
      metrics.recordError('reputation_update');
      throw error;
    }
  }

  // Calculate reputation change based on activity
  private calculateReputationChange(activity: Activity): number {
    const baseChange = REPUTATION_IMPACTS[activity.type] || 0;
    return Math.round(baseChange * activity.impact);
  }

  // Get user reputation level
  getReputationLevel(userId: string): ReputationLevel {
    const score = this.reputationScores.get(userId) || 0;
    
    if (score >= 1000) return ReputationLevel.EXPERT;
    if (score >= 500) return ReputationLevel.ADVANCED;
    if (score >= 100) return ReputationLevel.INTERMEDIATE;
    return ReputationLevel.BEGINNER;
  }

  // Get user reputation metrics
  getMetrics(userId: string): ReputationMetrics {
    const activities = this.activityHistory.get(userId) || [];
    const score = this.reputationScores.get(userId) || 0;

    return {
      score,
      level: this.getReputationLevel(userId),
      activityCount: activities.length,
      topActivities: this.getTopActivities(activities),
      recentActivities: activities.slice(-5)
    };
  }

  // Get user's top activities by impact
  private getTopActivities(activities: Activity[]): Activity[] {
    return [...activities]
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5);
  }
}

interface Activity {
  type: ActivityType;
  impact: number;
  timestamp: number;
}

export enum ReputationLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

const REPUTATION_IMPACTS: Record<ActivityType, number> = {
  [ActivityType.CREATE_PROJECT]: 20,
  [ActivityType.COMPLETE_PROJECT]: 50,
  [ActivityType.CONTRIBUTE]: 10,
  [ActivityType.REVIEW]: 5,
  [ActivityType.SHARE_RESOURCE]: 15,
  [ActivityType.EXCHANGE_RESOURCE]: 10,
  [ActivityType.REFER_USER]: 25,
  [ActivityType.PROVIDE_FEEDBACK]: 5
};

interface ReputationMetrics {
  score: number;
  level: ReputationLevel;
  activityCount: number;
  topActivities: Activity[];
  recentActivities: Activity[];
}