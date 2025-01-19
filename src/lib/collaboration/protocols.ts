/**
 * Collaboration Protocols
 * Core protocols for decentralized collaboration
 */

import { AccessControl, Permission } from '../security/accessControl';
import { SecurityAuditor } from '../security/audit';
import { metrics } from '../monitoring';

export enum CollaborationType {
  PROJECT = 'project',
  RESOURCE = 'resource',
  TASK = 'task',
  REVIEW = 'review'
}

export enum CollaborationStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface CollaborationRules {
  minParticipants?: number;
  maxParticipants?: number;
  requiredRoles?: string[];
  votingThreshold?: number;
  reviewRequirement?: boolean;
  timeLimit?: number;
}

export interface CollaborationMetrics {
  participantCount: number;
  completedTasks: number;
  activeTime: number;
  lastActivity: number;
  score: number;
}

export class CollaborationProtocol {
  private accessControl: AccessControl;
  private securityAuditor: SecurityAuditor;
  private collaborations: Map<string, CollaborationSession>;

  constructor(accessControl: AccessControl, securityAuditor: SecurityAuditor) {
    this.accessControl = accessControl;
    this.securityAuditor = securityAuditor;
    this.collaborations = new Map();
  }

  // Initialize new collaboration
  async initializeCollaboration(
    id: string,
    type: CollaborationType,
    rules: CollaborationRules,
    initiator: string
  ): Promise<CollaborationSession> {
    // Verify permissions
    if (!this.accessControl.hasPermission(initiator, Permission.CREATE_PROJECT)) {
      throw new Error('Unauthorized to initialize collaboration');
    }

    const startTime = Date.now();
    metrics.recordRequest('collaboration_init');

    try {
      const session = new CollaborationSession(
        id,
        type,
        rules,
        initiator,
        this.accessControl,
        this.securityAuditor
      );

      this.collaborations.set(id, session);
      
      await this.securityAuditor.auditContractCall(
        'collaboration',
        'initialize',
        [initiator],
        { type, rules }
      );

      metrics.recordLatency('collaboration_init', Date.now() - startTime);
      return session;
    } catch (error) {
      metrics.recordError('collaboration_init');
      throw error;
    }
  }

  // Join existing collaboration
  async joinCollaboration(
    id: string,
    participant: string,
    role?: string
  ): Promise<void> {
    const session = this.collaborations.get(id);
    if (!session) {
      throw new Error('Collaboration not found');
    }

    await session.addParticipant(participant, role);
  }

  // Get collaboration session
  getCollaboration(id: string): CollaborationSession | undefined {
    return this.collaborations.get(id);
  }

  // Get all active collaborations
  getActiveCollaborations(): CollaborationSession[] {
    return Array.from(this.collaborations.values())
      .filter(session => session.status === CollaborationStatus.ACTIVE);
  }

  // Get collaboration metrics
  getMetrics(id: string): CollaborationMetrics | undefined {
    return this.collaborations.get(id)?.getMetrics();
  }
}

export class CollaborationSession {
  public readonly id: string;
  public readonly type: CollaborationType;
  public status: CollaborationStatus;
  
  private rules: CollaborationRules;
  private participants: Map<string, string>; // participant -> role
  private tasks: Map<string, any>;
  private votes: Map<string, Set<string>>;
  private startTime: number;
  private lastActivityTime: number;

  constructor(
    id: string,
    type: CollaborationType,
    rules: CollaborationRules,
    initiator: string,
    private accessControl: AccessControl,
    private securityAuditor: SecurityAuditor
  ) {
    this.id = id;
    this.type = type;
    this.rules = rules;
    this.status = CollaborationStatus.PENDING;
    this.participants = new Map([[initiator, 'initiator']]);
    this.tasks = new Map();
    this.votes = new Map();
    this.startTime = Date.now();
    this.lastActivityTime = this.startTime;
  }

  // Add participant to collaboration
  async addParticipant(
    participant: string,
    role?: string
  ): Promise<void> {
    // Check participant limit
    if (this.rules.maxParticipants && 
        this.participants.size >= this.rules.maxParticipants) {
      throw new Error('Maximum participants reached');
    }

    // Verify role requirements
    if (this.rules.requiredRoles && role) {
      if (!this.rules.requiredRoles.includes(role)) {
        throw new Error('Invalid role for collaboration');
      }
    }

    this.participants.set(participant, role || 'member');
    this.updateActivity();

    await this.securityAuditor.auditContractCall(
      'collaboration',
      'addParticipant',
      [participant],
      { role }
    );
  }

  // Create new task
  async createTask(
    creator: string,
    taskData: any
  ): Promise<string> {
    if (!this.participants.has(creator)) {
      throw new Error('Not a participant in collaboration');
    }

    const taskId = crypto.randomUUID();
    this.tasks.set(taskId, {
      ...taskData,
      creator,
      status: 'pending',
      created: Date.now()
    });

    this.updateActivity();
    return taskId;
  }

  // Submit vote
  async submitVote(
    participant: string,
    proposal: string,
    vote: boolean
  ): Promise<boolean> {
    if (!this.participants.has(participant)) {
      throw new Error('Not a participant in collaboration');
    }

    if (!this.votes.has(proposal)) {
      this.votes.set(proposal, new Set());
    }

    if (vote) {
      this.votes.get(proposal)!.add(participant);
    } else {
      this.votes.get(proposal)!.delete(participant);
    }

    this.updateActivity();

    // Check if voting threshold is met
    if (this.rules.votingThreshold) {
      const voteCount = this.votes.get(proposal)!.size;
      const threshold = this.participants.size * this.rules.votingThreshold;
      return voteCount >= threshold;
    }

    return false;
  }

  // Complete collaboration
  async complete(): Promise<void> {
    if (this.rules.reviewRequirement) {
      const reviews = Array.from(this.participants.keys())
        .filter(p => this.hasReviewed(p));
      
      if (reviews.length < this.participants.size) {
        throw new Error('Not all participants have reviewed');
      }
    }

    this.status = CollaborationStatus.COMPLETED;
    this.updateActivity();

    await this.securityAuditor.auditContractCall(
      'collaboration',
      'complete',
      Array.from(this.participants.keys()),
      { type: this.type }
    );
  }

  // Get collaboration metrics
  getMetrics(): CollaborationMetrics {
    const completedTasks = Array.from(this.tasks.values())
      .filter(t => t.status === 'completed').length;

    return {
      participantCount: this.participants.size,
      completedTasks,
      activeTime: this.lastActivityTime - this.startTime,
      lastActivity: this.lastActivityTime,
      score: this.calculateScore()
    };
  }

  private updateActivity(): void {
    this.lastActivityTime = Date.now();
  }

  private hasReviewed(participant: string): boolean {
    return Array.from(this.tasks.values())
      .some(task => task.reviews?.includes(participant));
  }

  private calculateScore(): number {
    const duration = this.lastActivityTime - this.startTime;
    const taskCompletion = this.tasks.size > 0 
      ? Array.from(this.tasks.values()).filter(t => t.status === 'completed').length / this.tasks.size
      : 1;
    const participantRatio = this.rules.minParticipants
      ? Math.min(this.participants.size / this.rules.minParticipants, 1)
      : 1;

    return (taskCompletion * 0.4 + participantRatio * 0.4 + (1 - duration / (this.rules.timeLimit || Infinity)) * 0.2) * 100;
  }
}