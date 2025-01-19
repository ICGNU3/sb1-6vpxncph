/**
 * useProjects Hook
 * Custom hook for managing projects with real-time updates
 * 
 * Features:
 * - Local caching for improved performance
 * - Real-time updates with debouncing
 * - Optimized state updates
 * - Automatic cleanup of subscriptions
 * 
 * @returns {Object} Projects data and state
 * @property {Project[]} projects - Array of projects
 * @property {boolean} loading - Loading state
 * @property {Error | null} error - Error state
 * @property {Function} refresh - Function to manually refresh data
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { projectService } from '../lib/services';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export function useProjects() {
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Cache reference for storing project data
  const cache = useRef<Map<string, Project>>(new Map());
  
  // Reference for managing debounced updates
  const subscriptionRef = useRef<any>(null);

  /**
   * Loads all projects and updates the cache
   * Memoized to prevent unnecessary re-renders
   */
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      
      // Update cache with new project data
      data.forEach(project => {
        cache.current.set(project.id, project);
      });
      
      setProjects(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles real-time updates from Supabase
   * Implements optimistic updates with cache management
   * 
   * @param payload - Supabase real-time event payload
   */
  const handleRealtimeUpdate = useCallback(async (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setProjects(currentProjects => {
      const updatedProjects = [...currentProjects];
      
      switch (eventType) {
        case 'INSERT':
          // Only fetch if not in cache to prevent duplicate requests
          if (!cache.current.has(newRecord.id)) {
            projectService.getById(newRecord.id).then(project => {
              cache.current.set(project.id, project);
              setProjects(prev => [...prev, project]);
            });
          }
          break;
          
        case 'UPDATE':
          const index = updatedProjects.findIndex(p => p.id === oldRecord.id);
          if (index !== -1) {
            projectService.getById(oldRecord.id).then(project => {
              cache.current.set(project.id, project);
              setProjects(prev => {
                const updated = [...prev];
                updated[index] = project;
                return updated;
              });
            });
          }
          break;
          
        case 'DELETE':
          // Remove from cache and filter out deleted project
          cache.current.delete(oldRecord.id);
          return updatedProjects.filter(p => p.id !== oldRecord.id);
      }
      
      return updatedProjects;
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial data load
    loadProjects();

    // Set up real-time subscription with debouncing
    const subscription = supabase
      .channel('projects_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects' 
        },
        (payload) => {
          // Debounce updates to prevent rapid re-renders
          if (subscriptionRef.current) {
            clearTimeout(subscriptionRef.current);
          }
          
          subscriptionRef.current = setTimeout(() => {
            handleRealtimeUpdate(payload);
          }, 500); // Debounce for 500ms
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        clearTimeout(subscriptionRef.current);
      }
      subscription.unsubscribe();
    };
  }, [loadProjects, handleRealtimeUpdate]);

  return { projects, loading, error, refresh: loadProjects };
}