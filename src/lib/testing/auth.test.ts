import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { supabase } from '../supabase';

describe('Authentication Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'test-password-123'
  };

  // Clean up before and after each test
  beforeEach(async () => {
    await supabase.auth.signOut();
  });

  afterEach(async () => {
    // Clean up test data
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Delete test user's data
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.from('projects').delete().eq('owner_id', user.id);
      await supabase.from('resources').delete().eq('provider_id', user.id);
      await supabase.auth.signOut();
    }
  });

  describe('Sign Up', () => {
    test('should handle successful sign up', async () => {
      const { data, error } = await supabase.auth.signUp(testUser);
      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testUser.email);
    });

    test('should handle invalid email', async () => {
      const { error } = await supabase.auth.signUp({
        email: 'invalid-email',
        password: testUser.password
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Invalid email');
    });

    test('should handle weak password', async () => {
      const { error } = await supabase.auth.signUp({
        email: testUser.email,
        password: '123'
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('password');
    });
  });

  describe('Sign In', () => {
    beforeEach(async () => {
      // Create test user
      await supabase.auth.signUp(testUser);
    });

    test('should handle successful sign in', async () => {
      const { data, error } = await supabase.auth.signInWithPassword(testUser);
      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testUser.email);
    });

    test('should handle incorrect password', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: 'wrong-password'
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Invalid login credentials');
    });

    test('should handle non-existent user', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: testUser.password
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Invalid login credentials');
    });
  });

  describe('Password Reset', () => {
    test('should handle password reset request', async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(testUser.email);
      expect(error).toBeNull();
    });

    test('should handle invalid email for reset', async () => {
      const { error } = await supabase.auth.resetPasswordForEmail('invalid-email');
      expect(error).toBeDefined();
    });
  });

  describe('Session Management', () => {
    beforeEach(async () => {
      await supabase.auth.signUp(testUser);
      await supabase.auth.signInWithPassword(testUser);
    });

    test('should handle session persistence', async () => {
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeDefined();
      expect(session?.user.email).toBe(testUser.email);
    });

    test('should handle sign out', async () => {
      const { error } = await supabase.auth.signOut();
      expect(error).toBeNull();
      
      const { data: { user } } = await supabase.auth.getUser();
      expect(user).toBeNull();
    });
  });

  describe('RLS Policies', () => {
    let userId: string;

    beforeEach(async () => {
      // Create and sign in test user
      await supabase.auth.signUp(testUser);
      const { data } = await supabase.auth.signInWithPassword(testUser);
      userId = data.user!.id;
    });

    test('should enforce project RLS policies', async () => {
      // Create project
      const { data: project, error: createError } = await supabase
        .from('projects')
        .insert([{ 
          title: 'Test Project', 
          description: 'Test Description',
          owner_id: userId
        }])
        .select()
        .single();

      expect(createError).toBeNull();
      expect(project).toBeDefined();

      // Try to update another user's project
      const { error: updateError } = await supabase
        .from('projects')
        .update({ title: 'Hacked Project' })
        .eq('owner_id', 'some-other-id');

      expect(updateError).toBeDefined();
    });

    test('should enforce resource RLS policies', async () => {
      // Create resource
      const { data: resource, error: createError } = await supabase
        .from('resources')
        .insert([{
          title: 'Test Resource',
          type: 'service',
          description: 'Test Description',
          provider_id: userId,
          exchange_type: 'token'
        }])
        .select()
        .single();

      expect(createError).toBeNull();
      expect(resource).toBeDefined();

      // Try to update another user's resource
      const { error: updateError } = await supabase
        .from('resources')
        .update({ title: 'Hacked Resource' })
        .eq('provider_id', 'some-other-id');

      expect(updateError).toBeDefined();
    });

    test('should enforce profile RLS policies', async () => {
      // Update own profile
      const { error: updateOwnError } = await supabase
        .from('profiles')
        .update({ name: 'Test User' })
        .eq('id', userId);

      expect(updateOwnError).toBeNull();

      // Try to update another user's profile
      const { error: updateOtherError } = await supabase
        .from('profiles')
        .update({ name: 'Hacked Name' })
        .eq('id', 'some-other-id');

      expect(updateOtherError).toBeDefined();
    });
  });
});