import React, { useState, useEffect } from 'react';
import { Shield, Users, Calendar, Star, Share2, Edit2, Plus, ChevronRight, MessageSquare, Settings } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { projectService } from '../lib/services';
import { useAuthStore } from '../store/authStore';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProjectSkeleton } from '../components/LoadingSkeleton';
import type { Project } from '../types';

export function ProjectDetails() {
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Get project ID from URL
  const projectId = window.location.pathname.split('/').pop();

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getById(projectId!);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectSkeleton />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error || 'Project not found'} />
        </div>
      </div>
    );
  }

  const isOwner = user?.id === project.owner_id;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{project.collaborations?.length || 0} Contributors</span>
                </div>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button className="flex items-center gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Project
                </Button>
              </div>
            )}
          </div>

          {/* Project Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Project Progress</h2>
              <span className="text-green-400 font-semibold">{project.progress}% Complete</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Tasks', value: '12/20' },
                { label: 'Milestones', value: '3/5' },
                { label: 'Time Spent', value: '45h' },
                { label: 'Status', value: project.status }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                  <div className="text-white font-semibold">{stat.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: <Shield className="h-5 w-5" /> },
            { id: 'tasks', label: 'Tasks', icon: <Star className="h-5 w-5" /> },
            { id: 'team', label: 'Team', icon: <Users className="h-5 w-5" /> },
            { id: 'discussions', label: 'Discussions', icon: <MessageSquare className="h-5 w-5" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-green-400 text-slate-900'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Project Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{project.description}</p>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  'New team member joined',
                  'Milestone completed: Initial Design',
                  'Task completed: Setup Development Environment'
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    {activity}
                  </div>
                ))}
              </div>
            </Card>

            {/* Tasks */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Tasks</h2>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Design System Implementation', status: 'in-progress', assignee: 'Sarah Chen' },
                  { title: 'API Integration', status: 'pending', assignee: 'Alex Rivera' },
                  { title: 'Documentation', status: 'completed', assignee: 'Marcus Johnson' }
                ].map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full
                        ${task.status === 'completed' ? 'bg-green-400' :
                          task.status === 'in-progress' ? 'bg-blue-400' :
                          'bg-gray-400'}`}
                      />
                      <div>
                        <h3 className="text-white font-medium">{task.title}</h3>
                        <p className="text-gray-400 text-sm">Assigned to {task.assignee}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Team Members */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Team</h2>
                {isOwner && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Invite
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {project.collaborations?.map((collab, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={collab.user.avatar || `https://source.unsplash.com/random/100x100?portrait&sig=${index}`}
                      alt={collab.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-white font-medium">{collab.user.name}</h3>
                      <p className="text-gray-400 text-sm">{collab.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Project Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <p className="text-white">{project.metadata?.category || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <p className="text-white">{project.metadata?.type || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-800 text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}