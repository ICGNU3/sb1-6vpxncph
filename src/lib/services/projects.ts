/**
 * Project Service
 * Handles all project-related operations with Supabase
 * 
 * Features:
 * - CRUD operations for projects
 * - Relationship management (collaborators)
 * - Real-time data synchronization
 * - Type-safe database operations
 */
import { supabase } from '../supabase';
import type { Project } from '../../types';

export const projectService = {
  /**
   * Retrieves all projects with related data
   * Includes owner and collaboration information
   * 
   * @returns Promise<Project[]> Array of projects with related data
   * @throws Error if database operation fails
   */
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:profiles(name, avatar),
        collaborations(
          user:profiles(id, name, avatar)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Retrieves a single project by ID with related data
   * 
   * @param id - Project identifier
   * @returns Promise<Project> Project with related data
   * @throws Error if project not found or operation fails
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:profiles(name, avatar),
        collaborations(
          user:profiles(id, name, avatar)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Creates a new project
   * 
   * @param project - Project data without system fields
   * @returns Promise<Project> Created project
   * @throws Error if validation fails or operation fails
   */
  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing project
   * 
   * @param id - Project identifier
   * @param updates - Partial project data to update
   * @returns Promise<Project> Updated project
   * @throws Error if project not found or operation fails
   */
  async update(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Adds a collaborator to a project
   * 
   * @param projectId - Project identifier
   * @param userId - User identifier
   * @param role - Collaborator's role in the project
   * @returns Promise<any> Created collaboration record
   * @throws Error if user already collaborator or operation fails
   */
  async addCollaborator(projectId: string, userId: string, role: string) {
    const { data, error } = await supabase
      .from('collaborations')
      .insert({
        project_id: projectId,
        user_id: userId,
        role
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};