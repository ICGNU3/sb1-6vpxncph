import { useState, useEffect } from 'react';
import { resourceService } from '../lib/services';
import { supabase } from '../lib/supabase';
import type { Resource } from '../types';

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadResources() {
      try {
        const data = await resourceService.getAll();
        if (mounted) {
          setResources(data);
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
    loadResources();

    // Set up real-time subscription
    const subscription = supabase
      .channel('resources_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'resources' 
        }, 
        async (payload) => {
          const data = await resourceService.getAll();
          if (mounted) {
            setResources(data);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { resources, loading, error };
}