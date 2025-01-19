import React, { useState, useEffect } from 'react';
import { Shield, Users, Database, Settings, Terminal, AlertTriangle, Search, Filter, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { ErrorMessage } from '../components/ErrorMessage';

export function Admin() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    resources: 0,
    events: 0
  });
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'resources' | 'settings'>('users');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        { count: userCount },
        { count: projectCount },
        { count: resourceCount },
        { count: eventCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        users: userCount || 0,
        projects: projectCount || 0,
        resources: resourceCount || 0,
        events: eventCount || 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.email?.endsWith('@neplus.com')) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-6">You don't have permission to access this area.</p>
            <Button onClick={() => window.location.href = '/'}>Return Home</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage and monitor platform activity</p>
        </div>

        {error && (
          <div className="mb-8">
            <ErrorMessage message={error} onRetry={loadStats} />
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats.users, icon: <Users className="h-6 w-6" /> },
            { label: 'Active Projects', value: stats.projects, icon: <Terminal className="h-6 w-6" /> },
            { label: 'Resources', value: stats.resources, icon: <Database className="h-6 w-6" /> },
            { label: 'Events', value: stats.events, icon: <Shield className="h-6 w-6" /> }
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-400/10 p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'users', label: 'Users', icon: <Users className="h-5 w-5" /> },
            { id: 'projects', label: 'Projects', icon: <Terminal className="h-5 w-5" /> },
            { id: 'resources', label: 'Resources', icon: <Database className="h-5 w-5" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${activeTab === tab.id
                  ? 'bg-green-400 text-slate-900'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 pl-10 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <Card className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://source.unsplash.com/random/100x100?portrait&sig=${i}`}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="text-white font-medium">User Name</h3>
                      <p className="text-gray-400 text-sm">user@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm">Active</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200 cursor-pointer">
                  <div>
                    <h3 className="text-white font-medium">Project Title</h3>
                    <p className="text-gray-400 text-sm">Created 2 days ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-full text-sm">In Progress</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200 cursor-pointer">
                  <div>
                    <h3 className="text-white font-medium">Resource Name</h3>
                    <p className="text-gray-400 text-sm">Type: Service</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-purple-400/10 text-purple-400 rounded-full text-sm">Available</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Platform Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">User Registration</h4>
                      <p className="text-gray-400 text-sm">Allow new user registrations</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Email Settings</h4>
                      <p className="text-gray-400 text-sm">Configure email notifications</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">API Access</h4>
                      <p className="text-gray-400 text-sm">Manage API keys and permissions</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                      <p className="text-gray-400 text-sm">Require 2FA for admin accounts</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Session Management</h4>
                      <p className="text-gray-400 text-sm">Configure session timeouts</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}