import { useState, useEffect } from 'react';
import { eventService } from '../lib/services';
import { supabase } from '../lib/supabase';
import type { CommunityEvent } from '../types';

export function useEvents() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      try {
        const data = await eventService.getAll();
        if (mounted) {
          setEvents(data);
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
    loadEvents();

    // Set up real-time subscription
    const subscription = supabase
      .channel('events_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'events' 
        }, 
        async (payload) => {
          const data = await eventService.getAll();
          if (mounted) {
            setEvents(data);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { events, loading, error };
}