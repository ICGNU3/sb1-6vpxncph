import { useState, useEffect } from 'react';
import { commentService } from '../lib/services';
import { supabase } from '../lib/supabase';

export function useComments(postId: string) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadComments() {
      try {
        const data = await commentService.getByPostId(postId);
        if (mounted) {
          setComments(data);
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
    loadComments();

    // Set up real-time subscription
    const subscription = supabase
      .channel('comments_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments',
          filter: `post_id=eq.${postId}`
        }, 
        async (payload) => {
          const data = await commentService.getByPostId(postId);
          if (mounted) {
            setComments(data);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [postId]);

  return { comments, loading, error };
}