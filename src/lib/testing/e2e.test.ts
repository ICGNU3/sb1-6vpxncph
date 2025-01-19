/**
 * End-to-End Tests
 * Tests for critical user flows
 */
import { describe, test, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('E2E Flows', () => {
  describe('User Journey', () => {
    test('complete user flow', async () => {
      // 1. Sign Up
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const email = `test-${Date.now()}@example.com`;
      const password = 'test-password';

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });
      expect(signUpError).toBeNull();

      // 2. Create Project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          title: 'Test Project',
          description: 'Test Description'
        }])
        .select()
        .single();

      expect(projectError).toBeNull();
      expect(project).toBeDefined();

      // 3. Add Resource
      const { error: resourceError } = await supabase
        .from('resources')
        .insert([{
          title: 'Test Resource',
          description: 'Test Description',
          type: 'service'
        }]);

      expect(resourceError).toBeNull();

      // 4. Clean Up
      await supabase.auth.signOut();
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      const badClient = createClient('https://invalid-url', 'invalid-key');
      const { error } = await badClient.auth.signIn({
        email: 'test@example.com',
        password: 'password'
      });
      expect(error).toBeDefined();
    });
  });
});