import { supabase } from '../supabase';
import type { CommunityPost } from '../../types';

export const postService = {
  async getAll() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*),
        comments(
          *,
          author:profiles(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*),
        comments(
          *,
          author:profiles(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(post: Omit<CommunityPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<CommunityPost>) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async like(id: string) {
    const { data, error } = await supabase.rpc('increment_likes', { post_id: id });
    if (error) throw error;
    return data;
  }
};