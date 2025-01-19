import { supabase } from '../supabase';
import type { Resource } from '../../types';

export const resourceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        provider:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        provider:profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('resources')
      .insert(resource)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Resource>) {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};