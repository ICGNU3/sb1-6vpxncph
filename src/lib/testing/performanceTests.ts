/**
 * Performance Tests
 * Tests for system performance and optimization
 */
import { describe, test, expect } from 'vitest';
import { AISystem } from '../ai/system';
import { SecurityAuditor } from '../security/audit';
import { AccessControl } from '../security/accessControl';

describe('Performance Tests', () => {
  describe('Response Times', () => {
    test('should process AI recommendations within threshold', async () => {
      const aiSystem = new AISystem();
      const start = Date.now();
      
      const input = AISystem.createTextInput('Test input for processing');
      await aiSystem.process(input);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // 1 second threshold
    });

    test('should handle concurrent security audits', async () => {
      const accessControl = new AccessControl();
      const auditor = new SecurityAuditor(accessControl);
      
      const start = Date.now();
      
      // Simulate 100 concurrent audit events
      await Promise.all(Array(100).fill(0).map(() =>
        auditor.auditAuthAttempt('test-user', true, 'password')
      ));
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000); // 2 second threshold
    });
  });

  describe('Memory Usage', () => {
    test('should maintain stable memory usage during operations', async () => {
      const accessControl = new AccessControl();
      const auditor = new SecurityAuditor(accessControl);
      
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Generate large number of events
      for (let i = 0; i < 10000; i++) {
        await auditor.auditAuthAttempt(`user-${i}`, true, 'password');
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
      
      expect(memoryIncrease).toBeLessThan(50); // 50MB threshold
    });
  });

  describe('Load Testing', () => {
    test('should handle high transaction volume', async () => {
      const accessControl = new AccessControl();
      const auditor = new SecurityAuditor(accessControl);
      
      const start = Date.now();
      let successCount = 0;
      
      // Simulate 1000 rapid transactions
      for (let i = 0; i < 1000; i++) {
        try {
          await auditor.auditContractCall(
            'test-program',
            'test-instruction',
            ['test-account'],
            { amount: i }
          );
          successCount++;
        } catch (error) {
          console.error('Transaction failed:', error);
        }
      }
      
      const duration = Date.now() - start;
      expect(successCount).toBeGreaterThan(950); // 95% success rate
      expect(duration).toBeLessThan(10000); // 10 second threshold
    });
  });

  describe('Resource Cleanup', () => {
    test('should properly clean up resources', async () => {
      const aiSystem = new AISystem();
      const input = AISystem.createTextInput('Test cleanup');
      
      // Process multiple requests
      for (let i = 0; i < 100; i++) {
        await aiSystem.process(input);
      }
      
      // Force garbage collection
      if (global.gc) {
        global.gc();
      }
      
      const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      expect(memoryUsage).toBeLessThan(100); // 100MB threshold
    });
  });
});