/**
 * Governance System
 * Core governance framework for decentralized decision-making
 */
import { SecurityAuditor } from '../security/audit';
import { AccessControl, Permission } from '../security/accessControl';
import { metrics } from '../monitoring';

// Singleton instance
let instance: GovernanceSystem | null = null;

export class GovernanceSystem {
  private accessControl: AccessControl;
  private securityAuditor: SecurityAuditor;
  private proposals: Map<string, Proposal>;
  private votes: Map<string, Map<string, Vote>>;
  private delegations: Map<string, string>;

  private constructor(accessControl: AccessControl, securityAuditor: SecurityAuditor) {
    this.accessControl = accessControl;
    this.securityAuditor = securityAuditor;
    this.proposals = new Map();
    this.votes = new Map();
    this.delegations = new Map();
  }

  static getInstance(accessControl: AccessControl, securityAuditor: SecurityAuditor): GovernanceSystem {
    if (!instance) {
      instance = new GovernanceSystem(accessControl, securityAuditor);
    }
    return instance;
  }

  // Create new proposal
  async createProposal(
    creator: string,
    type: ProposalType,
    data: ProposalData
  ): Promise<string> {
    const startTime = Date.now();
    metrics.recordRequest('governance_proposal');

    try {
      // Verify creator permissions
      if (!this.accessControl.hasPermission(creator, Permission.CREATE_PROJECT)) {
        throw new Error('Unauthorized to create proposal');
      }

      const proposalId = crypto.randomUUID();
      const proposal: Proposal = {
        id: proposalId,
        type,
        creator,
        data,
        status: ProposalStatus.ACTIVE,
        createdAt: Date.now(),
        votingEndsAt: Date.now() + VOTING_PERIOD
      };

      this.proposals.set(proposalId, proposal);
      this.votes.set(proposalId, new Map());

      await this.securityAuditor.auditContractCall(
        'governance',
        'createProposal',
        [creator],
        { type, data }
      );

      metrics.recordLatency('governance_proposal', Date.now() - startTime);
      return proposalId;
    } catch (error) {
      metrics.recordError('governance_proposal');
      throw error;
    }
  }

  // Cast vote on proposal
  async castVote(
    voter: string,
    proposalId: string,
    support: boolean,
    weight: number = 1
  ): Promise<void> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) throw new Error('Proposal not found');
    if (proposal.status !== ProposalStatus.ACTIVE) throw new Error('Proposal not active');
    if (Date.now() > proposal.votingEndsAt) throw new Error('Voting period ended');

    const vote: Vote = {
      voter,
      support,
      weight,
      timestamp: Date.now()
    };

    // Check for delegation
    const delegate = this.delegations.get(voter);
    if (delegate) {
      vote.delegatedFrom = delegate;
      vote.weight *= 2; // Bonus weight for delegated votes
    }

    this.votes.get(proposalId)!.set(voter, vote);

    await this.securityAuditor.auditContractCall(
      'governance',
      'castVote',
      [voter],
      { proposalId, support, weight }
    );

    // Check if proposal can be executed
    await this.checkProposalExecution(proposalId);
  }

  // Delegate voting power
  async delegateVote(from: string, to: string): Promise<void> {
    if (from === to) throw new Error('Cannot delegate to self');
    if (this.delegations.has(from)) throw new Error('Already delegated');

    this.delegations.set(from, to);

    await this.securityAuditor.auditContractCall(
      'governance',
      'delegateVote',
      [from, to],
      {}
    );
  }

  // Check if proposal can be executed
  private async checkProposalExecution(proposalId: string): Promise<void> {
    const proposal = this.proposals.get(proposalId)!;
    const votes = this.votes.get(proposalId)!;

    const { forVotes, againstVotes } = this.tallyVotes(votes);
    const totalVotes = forVotes + againstVotes;

    // Check quorum
    if (totalVotes >= QUORUM_VOTES) {
      // Check majority
      if (forVotes > againstVotes) {
        await this.executeProposal(proposal);
      } else if (Date.now() > proposal.votingEndsAt) {
        proposal.status = ProposalStatus.REJECTED;
      }
    }
  }

  // Execute approved proposal
  private async executeProposal(proposal: Proposal): Promise<void> {
    try {
      switch (proposal.type) {
        case ProposalType.PARAMETER_CHANGE:
          await this.executeParameterChange(proposal.data);
          break;
        case ProposalType.FEATURE_TOGGLE:
          await this.executeFeatureToggle(proposal.data);
          break;
        case ProposalType.RESOURCE_ALLOCATION:
          await this.executeResourceAllocation(proposal.data);
          break;
      }

      proposal.status = ProposalStatus.EXECUTED;
      proposal.executedAt = Date.now();

    } catch (error) {
      proposal.status = ProposalStatus.FAILED;
      throw error;
    }
  }

  // Execute parameter change proposal
  private async executeParameterChange(data: any): Promise<void> {
    // Implementation would update system parameters
    await this.securityAuditor.auditContractCall(
      'governance',
      'parameterChange',
      [],
      data
    );
  }

  // Execute feature toggle proposal
  private async executeFeatureToggle(data: any): Promise<void> {
    // Implementation would toggle feature flags
    await this.securityAuditor.auditContractCall(
      'governance',
      'featureToggle',
      [],
      data
    );
  }

  // Execute resource allocation proposal
  private async executeResourceAllocation(data: any): Promise<void> {
    // Implementation would allocate resources
    await this.securityAuditor.auditContractCall(
      'governance',
      'resourceAllocation',
      [],
      data
    );
  }

  // Tally votes for a proposal
  private tallyVotes(votes: Map<string, Vote>): { forVotes: number; againstVotes: number } {
    let forVotes = 0;
    let againstVotes = 0;

    for (const vote of votes.values()) {
      if (vote.support) {
        forVotes += vote.weight;
      } else {
        againstVotes += vote.weight;
      }
    }

    return { forVotes, againstVotes };
  }

  // Get proposal details
  getProposal(proposalId: string): Proposal | undefined {
    return this.proposals.get(proposalId);
  }

  // Get proposal votes
  getProposalVotes(proposalId: string): Map<string, Vote> | undefined {
    return this.votes.get(proposalId);
  }

  // Get governance metrics
  getMetrics(): GovernanceMetrics {
    const activeProposals = Array.from(this.proposals.values())
      .filter(p => p.status === ProposalStatus.ACTIVE);

    return {
      totalProposals: this.proposals.size,
      activeProposals: activeProposals.length,
      totalVotes: Array.from(this.votes.values())
        .reduce((acc, votes) => acc + votes.size, 0),
      delegations: this.delegations.size,
      proposalTypes: this.getProposalTypeBreakdown()
    };
  }

  private getProposalTypeBreakdown(): Record<ProposalType, number> {
    const breakdown = {
      [ProposalType.PARAMETER_CHANGE]: 0,
      [ProposalType.FEATURE_TOGGLE]: 0,
      [ProposalType.RESOURCE_ALLOCATION]: 0
    };

    for (const proposal of this.proposals.values()) {
      breakdown[proposal.type]++;
    }

    return breakdown;
  }
}

// Constants
const VOTING_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7 days
const QUORUM_VOTES = 100; // Minimum votes required

// Types
export enum ProposalType {
  PARAMETER_CHANGE = 'parameter_change',
  FEATURE_TOGGLE = 'feature_toggle',
  RESOURCE_ALLOCATION = 'resource_allocation'
}

export enum ProposalStatus {
  ACTIVE = 'active',
  EXECUTED = 'executed',
  REJECTED = 'rejected',
  FAILED = 'failed'
}

export interface ProposalData {
  title: string;
  description: string;
  changes: Record<string, any>;
}

interface Proposal {
  id: string;
  type: ProposalType;
  creator: string;
  data: ProposalData;
  status: ProposalStatus;
  createdAt: number;
  votingEndsAt: number;
  executedAt?: number;
}

interface Vote {
  voter: string;
  support: boolean;
  weight: number;
  timestamp: number;
  delegatedFrom?: string;
}

interface GovernanceMetrics {
  totalProposals: number;
  activeProposals: number;
  totalVotes: number;
  delegations: number;
  proposalTypes: Record<ProposalType, number>;
}

// Export singleton instance
export const governance = GovernanceSystem.getInstance(
  new AccessControl(),
  new SecurityAuditor(new AccessControl())
);