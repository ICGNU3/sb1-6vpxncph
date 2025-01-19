import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { secureStorage } from '../lib/security';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  },
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Securely store auth state
    await secureStorage.setItem('auth_state', 'authenticated');
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, session: null });
    
    // Clear secure storage
    secureStorage.clear();
  },
  setUser: (user) => set({ user }),
  setSession: async (session) => {
    set({ session });
    if (session) {
      // Securely store session data
      await secureStorage.setItem('session', JSON.stringify(session));
    }
  },
  setLoading: (loading) => set({ loading }),
}));