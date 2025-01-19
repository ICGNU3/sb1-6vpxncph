import React, { useState, useEffect } from 'react';
import { Activity, Users, Hexagon, BarChart, Plus, Rocket, BarChart as ChartBar, Settings, FileText, Target, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { errorTracker } from '../lib/monitoring';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const errors = errorTracker.getErrors();
  const recentErrors = errors.slice(0, 3);

  useEffect(() => {
    // Simulate loading of dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Please sign in to access your dashboard</p>
            <Button onClick={() => navigate('/')}>Return Home</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-64 bg-slate-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-24 animate-pulse" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="h-64 animate-pulse" />
            <Card className="h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.email}</h1>
          <p className="text-gray-400">Here's what's happening with your projects</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Projects', value: '5', icon: <Activity className="h-6 w-6" />, change: '+2' },
            { label: 'Team Members', value: '12', icon: <Users className="h-6 w-6" />, change: '+3' },
            { label: 'Resources', value: '24', icon: <Hexagon className="h-6 w-6" />, change: '+5' },
            { label: 'Total Value', value: '₿2.4K', icon: <BarChart className="h-6 w-6" />, change: '+12%' }
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-400/10 p-3 rounded-full">
                  {stat.icon}
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Recent Projects */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Projects</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'DeFi Platform', progress: 75, status: 'active' },
                { name: 'NFT Marketplace', progress: 45, status: 'planning' },
                { name: 'Smart Contract Audit', progress: 90, status: 'review' }
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200 cursor-pointer">
                  <div>
                    <h3 className="text-white font-medium mb-1">{project.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${
                        project.status === 'active' ? 'bg-green-400' :
                        project.status === 'planning' ? 'bg-blue-400' :
                        'bg-yellow-400'
                      }`} />
                      <span className="text-gray-400 capitalize">{project.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-green-400">{project.progress}%</div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Feed */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {[
                { type: 'project', message: 'New team member joined Project Alpha', time: '2h ago', icon: <Users className="h-5 w-5" /> },
                { type: 'deploy', message: 'Deployed v2.0 to production', time: '5h ago', icon: <Rocket className="h-5 w-5" /> },
                { type: 'update', message: 'Updated project documentation', time: '1d ago', icon: <FileText className="h-5 w-5" /> }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
                  <div className="bg-green-400/10 p-2 rounded-full">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-gray-300">{activity.message}</p>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">System Status</h2>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
              {[
                { label: 'Response Time', value: '45ms' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Error Rate', value: '0.1%' }
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">{metric.label}</span>
                  <span className="text-white">{metric.value}</span>
                </div>
              ))}
            </div>

            {/* Recent Errors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Errors</h3>
              {recentErrors.length > 0 ? recentErrors.map((error, index) => (
                <div key={index} className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error.message}</p>
                  <span className="text-gray-400 text-xs">{new Date(error.timestamp).toLocaleString()}</span>
                </div>
              )) : (
                <div className="p-3 bg-slate-800 rounded-lg">
                  <p className="text-gray-400">No recent errors</p>
                </div>
              )}
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Goals</h3>
              {[
                { label: 'User Growth', target: '10K', current: '8.5K' },
                { label: 'Revenue', target: '₿100K', current: '₿85K' },
                { label: 'Projects', target: '500', current: '423' }
              ].map((goal, index) => (
                <div key={index} className="p-3 bg-slate-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">{goal.label}</span>
                    <span className="text-white">{goal.current} / {goal.target}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(parseInt(goal.current.replace(/\D/g, '')) / parseInt(goal.target.replace(/\D/g, ''))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}