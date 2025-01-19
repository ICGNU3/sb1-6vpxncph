/**
 * Optimized Collaboration System
 */
import { CollaborationProtocol, CollaborationType, CollaborationRules } from './protocols';
import { accessControl } from '../security';
import { SecurityAuditor } from '../security/audit';

// Singleton instance
let instance: CollaborationSystem | null = null;

class CollaborationSystem {
  private protocol: CollaborationProtocol;
  private securityAuditor: SecurityAuditor;

  private constructor() {
    this.securityAuditor = new SecurityAuditor(accessControl);
    this.protocol = new CollaborationProtocol(accessControl, this.securityAuditor);
  }

  static getInstance(): CollaborationSystem {
    if (!instance) {
      instance = new CollaborationSystem();
    }
    return instance;
  }

  async initializeProject(
    projectId: string,
    initiator: string,
    rules: Partial<CollaborationRules> = {}
  ): Promise<void> {
    const defaultRules: CollaborationRules = {
      minParticipants: 2,
      maxParticipants: 10,
      requiredRoles: ['developer', 'designer', 'manager'],
      votingThreshold: 0.6,
      reviewRequirement: true,
      timeLimit: 30 * 24 * 60 * 60 * 1000,
      ...rules
    };

    await this.protocol.initializeCollaboration(
      projectId,
      CollaborationType.PROJECT,
      defaultRules,
      initiator
    );
  }

  async initializeResourceExchange(
    resourceId: string,
    initiator: string,
    rules: Partial<CollaborationRules> = {}
  ): Promise<void> {
    const defaultRules: CollaborationRules = {
      minParticipants: 2,
      maxParticipants: 2,
      votingThreshold: 1,
      reviewRequirement: true,
      timeLimit: 7 * 24 * 60 * 60 * 1000,
      ...rules
    };

    await this.protocol.initializeCollaboration(
      resourceId,
      CollaborationType.RESOURCE,
      defaultRules,
      initiator
    );
  }

  getProtocol(): CollaborationProtocol {
    return this.protocol;
  }
}

// Export optimized interface
const collaboration = CollaborationSystem.getInstance();
export const collaborationProtocol = collaboration.getProtocol();

export const initializeProjectCollaboration = (
  projectId: string,
  initiator: string,
  rules?: Partial<CollaborationRules>
) => collaboration.initializeProject(projectId, initiator, rules);

export const initializeResourceExchange = (
  resourceId: string,
  initiator: string,
  rules?: Partial<CollaborationRules>
) => collaboration.initializeResourceExchange(resourceId, initiator, rules);

export {
  CollaborationType,
  CollaborationStatus,
  type CollaborationRules,
  type CollaborationMetrics
} from './protocols';