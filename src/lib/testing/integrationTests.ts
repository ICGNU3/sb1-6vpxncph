/**
 * Integration Tests
 * End-to-end testing of system components
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { AISystem } from '../ai/system';
import { ProjectRecommender } from '../ai/recommendations/projectRecommender';
import { SolanaClient } from '../solana/client';
import { SecurityAuditor } from '../security/audit';
import { AccessControl } from '../security/accessControl';

describe('Integration Tests', () => {
  let aiSystem: AISystem;
  let recommender: ProjectRecommender;
  let solanaClient: SolanaClient;
  let securityAuditor: SecurityAuditor;

  beforeEach(() => {
    aiSystem = new AISystem();
    recommender = new ProjectRecommender();
    const accessControl = new AccessControl();
    securityAuditor = new SecurityAuditor(accessControl);
  });

  describe('Project Creation Flow', () => {
    test('should create project with token initialization', async () => {
      // Create project
      const { tx: projectTx, projectPda } = await solanaClient.initializeProject(
        'Test Project',
        'A test project',
        1000000
      );

      expect(projectTx).toBeDefined();
      expect(projectPda).toBeDefined();

      // Verify security audit
      const auditEvents = securityAuditor.getEvents();
      expect(auditEvents.some(e => 
        e.type === 'contract_call' && 
        e.details.instruction === 'initializeProject'
      )).toBe(true);
    });

    test('should handle collaborator addition', async () => {
      const projectPda = 'test-project';
      const collaborator = 'test-collaborator';

      const { tx, collaborationPda } = await solanaClient.addCollaborator(
        projectPda,
        collaborator,
        'developer',
        100000
      );

      expect(tx).toBeDefined();
      expect(collaborationPda).toBeDefined();

      // Verify security audit
      const auditEvents = securityAuditor.getEvents();
      expect(auditEvents.some(e =>
        e.type === 'contract_call' &&
        e.details.instruction === 'addCollaborator'
      )).toBe(true);
    });
  });

  describe('AI Recommendations', () => {
    test('should provide relevant collaborator recommendations', async () => {
      const project = {
        title: 'AI Development Project',
        description: 'Building machine learning models',
        metadata: {
          skills: ['Python', 'TensorFlow', 'Machine Learning']
        }
      };

      const recommendations = await recommender.getCollaboratorRecommendations(project);
      
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].score.score).toBeGreaterThan(0.7);
    });

    test('should provide matching resource recommendations', async () => {
      const project = {
        title: 'DeFi Platform',
        description: 'Building a decentralized exchange',
        metadata: {
          needs: ['Smart Contract Audit', 'UI/UX Design']
        }
      };

      const recommendations = await recommender.getResourceRecommendations(project);
      
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].score.score).toBeGreaterThan(0.7);
    });
  });

  describe('Security Integration', () => {
    test('should enforce access control across operations', async () => {
      const userId = 'test-user';
      const accessControl = new AccessControl();
      
      // Attempt operation without permission
      const result = accessControl.hasPermission(userId, 'manage:platform');
      expect(result).toBe(false);

      // Add permission and retry
      accessControl.addCustomPermission(userId, 'manage:platform');
      const updatedResult = accessControl.hasPermission(userId, 'manage:platform');
      expect(updatedResult).toBe(true);
    });

    test('should track security events across system', async () => {
      // Simulate various operations
      await securityAuditor.auditAuthAttempt('user1', false, 'password');
      await securityAuditor.auditAuthAttempt('user1', false, 'password');
      await securityAuditor.auditAuthAttempt('user1', false, 'password');

      const metrics = securityAuditor.getMetrics();
      expect(metrics.recentEvents).toBeGreaterThan(0);
      expect(metrics.severityBreakdown.high).toBeGreaterThan(0);
    });
  });
});