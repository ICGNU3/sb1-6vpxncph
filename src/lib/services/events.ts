import { supabase } from '../supabase';
import type { CommunityEvent } from '../../types';

export const eventService = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        host:profiles(*)
      `)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        host:profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(event: Omit<CommunityEvent, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<CommunityEvent>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};