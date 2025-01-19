import React from 'react';
import { Rocket, CheckCircle, AlertCircle, Server, Globe, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Launch() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Launch Project</h1>
          <p className="text-gray-400">Deploy your project to production</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Pre-launch Checklist</h2>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Security Audit', completed: true },
                  { label: 'Performance Testing', completed: true },
                  { label: 'Documentation', completed: false },
                  { label: 'Backup Configuration', completed: true },
                  { label: 'SSL Certificate', completed: true }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      )}
                      <span className="text-gray-300">{item.label}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      {item.completed ? 'Verified' : 'Verify'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Server className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Deployment Configuration</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Environment</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent">
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent">
                    <option value="us-east">US East</option>
                    <option value="us-west">US West</option>
                    <option value="eu-central">EU Central</option>
                    <option value="ap-southeast">AP Southeast</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Launch Status</h2>
              <div className="space-y-4">
                {[
                  { icon: <Shield className="h-5 w-5" />, label: 'Security', status: 'Ready' },
                  { icon: <Globe className="h-5 w-5" />, label: 'Domain', status: 'Ready' },
                  { icon: <Server className="h-5 w-5" />, label: 'Server', status: 'Ready' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3 text-gray-300">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-green-400">{item.status}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Launch Actions</h2>
              <div className="space-y-4">
                <Button className="w-full flex items-center justify-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Deploy to Production
                </Button>
                <Button variant="outline" className="w-full">Deploy to Staging</Button>
                <Button variant="outline" className="w-full">View Deployment Logs</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}