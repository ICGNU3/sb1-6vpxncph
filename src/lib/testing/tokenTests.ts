/**
 * Token System Tests
 * Tests for token functionality and operations
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { TokenInfo, TokenHolder, VestingSchedule } from '../../contracts/program/src/token_standards';
import { SecurityAuditor } from '../security/audit';
import { AccessControl } from '../security/accessControl';

describe('Token System Tests', () => {
  let tokenInfo: TokenInfo;
  let securityAuditor: SecurityAuditor;

  beforeEach(() => {
    const accessControl = new AccessControl();
    securityAuditor = new SecurityAuditor(accessControl);
  });

  describe('Token Operations', () => {
    test('should enforce maximum supply limits', async () => {
      const holder = {
        balance: 0,
        locked_balance: 0
      } as TokenHolder;

      const maxSupply = 1000000;
      const amount = maxSupply + 1;

      await expect(tokenInfo.mint(amount, holder))
        .rejects.toThrow('Supply exceeded');
    });

    test('should prevent unauthorized minting', async () => {
      const holder = {
        balance: 0,
        locked_balance: 0
      } as TokenHolder;

      tokenInfo.config.is_mintable = false;
      
      await expect(tokenInfo.mint(100, holder))
        .rejects.toThrow('Unauthorized operation');
    });

    test('should enforce transfer locks', async () => {
      const from = {
        balance: 1000,
        locked_balance: 0,
        last_transfer: Date.now()
      } as TokenHolder;

      const to = {
        balance: 0,
        locked_balance: 0
      } as TokenHolder;

      tokenInfo.distribution_rules.transfer_lock = Date.now() + 86400000; // 24h lock

      await expect(tokenInfo.transfer(100, from, to))
        .rejects.toThrow('Transfer locked');
    });

    test('should handle vesting schedules correctly', async () => {
      const holder = {
        balance: 0,
        locked_balance: 1000,
        vesting_schedule: {
          total_amount: 1000,
          released_amount: 0,
          start_time: Date.now() - 86400000, // 24h ago
          end_time: Date.now() + 86400000, // 24h from now
          cliff_time: Date.now() - 43200000, // 12h ago
          interval: 3600000 // 1h
        }
      } as TokenHolder;

      await tokenInfo.release_vested(holder);
      expect(holder.balance).toBeGreaterThan(0);
      expect(holder.locked_balance).toBeLessThan(1000);
    });
  });

  describe('Security Checks', () => {
    test('should detect large transfers', async () => {
      const from = {
        balance: 1000000,
        locked_balance: 0
      } as TokenHolder;

      const to = {
        balance: 0,
        locked_balance: 0
      } as TokenHolder;

      await securityAuditor.auditTokenOperation(
        'transfer',
        tokenInfo,
        900000, // 90% of total supply
        from.owner,
        to.owner
      );

      const events = securityAuditor.getEvents();
      expect(events.some(e => e.severity === 'high')).toBe(true);
    });

    test('should track rapid transactions', async () => {
      const holder = {
        balance: 1000,
        locked_balance: 0
      } as TokenHolder;

      // Simulate rapid transfers
      for (let i = 0; i < 10; i++) {
        await securityAuditor.auditTokenOperation(
          'transfer',
          tokenInfo,
          100,
          holder.owner
        );
      }

      const events = securityAuditor.getEvents();
      const rapidTxs = events.filter(e => 
        e.type === 'token_transfer' &&
        e.timestamp > Date.now() - 1000 // Last second
      );

      expect(rapidTxs.length).toBeGreaterThan(5);
    });
  });
});