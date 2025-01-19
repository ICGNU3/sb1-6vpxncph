/**
 * Governance Tests
 * Tests for governance system functionality
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { GovernanceSystem, ProposalType, ProposalStatus } from '../governance';
import { AccessControl, Role, Permission } from '../security/accessControl';
import { SecurityAuditor } from '../security/audit';

describe('Governance System', () => {
  let governance: GovernanceSystem;
  let accessControl: AccessControl;
  let securityAuditor: SecurityAuditor;

  beforeEach(() => {
    accessControl = new AccessControl();
    securityAuditor = new SecurityAuditor(accessControl);
    governance = GovernanceSystem.getInstance(accessControl, securityAuditor);
  });

  describe('Proposal Creation', () => {
    test('should create new proposal with proper permissions', async () => {
      const creator = 'test-user';
      accessControl.assignRole(creator, Role.CREATOR);
      accessControl.addCustomPermission(creator, Permission.CREATE_PROJECT);

      const proposalData = {
        title: 'Test Proposal',
        description: 'A test proposal',
        changes: { param: 'value' }
      };

      const proposalId = await governance.createProposal(
        creator,
        ProposalType.PARAMETER_CHANGE,
        proposalData
      );

      const proposal = governance.getProposal(proposalId);
      expect(proposal).toBeDefined();
      expect(proposal?.status).toBe(ProposalStatus.ACTIVE);
    });

    test('should reject proposal creation without permissions', async () => {
      const creator = 'unauthorized-user';
      
      await expect(governance.createProposal(
        creator,
        ProposalType.PARAMETER_CHANGE,
        { title: '', description: '', changes: {} }
      )).rejects.toThrow('Unauthorized');
    });
  });

  describe('Voting', () => {
    test('should allow voting on active proposals', async () => {
      const creator = 'test-user';
      const voter = 'test-voter';
      accessControl.assignRole(creator, Role.CREATOR);
      accessControl.addCustomPermission(creator, Permission.CREATE_PROJECT);

      const proposalId = await governance.createProposal(
        creator,
        ProposalType.PARAMETER_CHANGE,
        { title: '', description: '', changes: {} }
      );

      await governance.castVote(voter, proposalId, true);
      const votes = governance.getProposalVotes(proposalId);
      
      expect(votes?.get(voter)).toBeDefined();
      expect(votes?.get(voter)?.support).toBe(true);
    });

    test('should handle vote delegation', async () => {
      const delegator = 'delegator';
      const delegate = 'delegate';
      const proposalId = await governance.createProposal(
        'creator',
        ProposalType.PARAMETER_CHANGE,
        { title: '', description: '', changes: {} }
      );

      await governance.delegateVote(delegator, delegate);
      await governance.castVote(delegate, proposalId, true);

      const votes = governance.getProposalVotes(proposalId);
      expect(votes?.get(delegate)?.weight).toBeGreaterThan(1);
    });
  });

  describe('Proposal Execution', () => {
    test('should execute proposal when quorum is reached', async () => {
      const creator = 'test-user';
      accessControl.assignRole(creator, Role.CREATOR);
      accessControl.addCustomPermission(creator, Permission.CREATE_PROJECT);

      const proposalId = await governance.createProposal(
        creator,
        ProposalType.PARAMETER_CHANGE,
        { title: '', description: '', changes: { param: 'new-value' } }
      );

      // Simulate reaching quorum with positive votes
      for (let i = 0; i < 101; i++) {
        await governance.castVote(`voter-${i}`, proposalId, true);
      }

      const proposal = governance.getProposal(proposalId);
      expect(proposal?.status).toBe(ProposalStatus.EXECUTED);
    });
  });

  describe('Metrics', () => {
    test('should track governance metrics', async () => {
      const creator = 'test-user';
      accessControl.assignRole(creator, Role.CREATOR);
      accessControl.addCustomPermission(creator, Permission.CREATE_PROJECT);

      await governance.createProposal(
        creator,
        ProposalType.PARAMETER_CHANGE,
        { title: '', description: '', changes: {} }
      );

      const metrics = governance.getMetrics();
      expect(metrics.totalProposals).toBe(1);
      expect(metrics.activeProposals).toBe(1);
    });
  });
});