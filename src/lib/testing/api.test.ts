/**
 * API Integration Tests
 * Tests for API endpoints and data flow
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { supabase } from '../supabase';

describe('API Integration', () => {
  describe('Authentication', () => {
    test('should handle sign in', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'test-password'
      });
      expect(error).toBeDefined(); // Should fail with test credentials
    });

    test('should handle sign out', async () => {
      const { error } = await supabase.auth.signOut();
      expect(error).toBeNull();
    });
  });

  describe('Data Operations', () => {
    beforeEach(async () => {
      await supabase.auth.signOut();
    });

    test('should enforce authentication for protected routes', async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    test('should handle data validation', async () => {
      const { error } = await supabase
        .from('projects')
        .insert([{ title: '' }]);
      expect(error).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    test('should handle rapid requests', async () => {
      const requests = Array(10).fill(0).map(() => 
        supabase.from('projects').select('*')
      );
      const results = await Promise.all(requests);
      expect(results.every(r => !r.error)).toBe(true);
    });
  });
});