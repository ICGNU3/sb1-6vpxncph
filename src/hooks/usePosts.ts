import { useState, useEffect } from 'react';
import { postService } from '../lib/services';
import { supabase } from '../lib/supabase';
import type { CommunityPost } from '../types';

export function usePosts() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        const data = await postService.getAll();
        if (mounted) {
          setPosts(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    // Initial load
    loadPosts();

    // Set up real-time subscription for posts and comments
    const subscription = supabase
      .channel('posts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts' 
        }, 
        async (payload) => {
          const data = await postService.getAll();
          if (mounted) {
            setPosts(data);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { posts, loading, error };
}