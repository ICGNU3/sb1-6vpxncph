import React from 'react';
import { Target, Flag, Calendar, CheckCircle, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Goals() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Project Goals</h1>
          <p className="text-gray-400">Set and track your project milestones</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Target className="h-6 w-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Active Goals</h2>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Launch Beta Version', progress: 75, deadline: '2024-04-01' },
                  { title: 'Reach 1000 Users', progress: 45, deadline: '2024-05-15' },
                  { title: 'Complete Documentation', progress: 90, deadline: '2024-03-20' }
                ].map((goal, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold">{goal.title}</h3>
                      <span className="text-green-400">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                      <div
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Flag className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Completed Goals</h2>
              </div>
              <div className="space-y-4">
                {[
                  'Initial MVP Release',
                  'Team Formation',
                  'Whitepaper Publication'
                ].map((goal, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">{goal}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Goal Statistics</h2>
              <div className="space-y-4">
                {[
                  { label: 'Total Goals', value: '12' },
                  { label: 'Completed', value: '8' },
                  { label: 'In Progress', value: '3' },
                  { label: 'Upcoming', value: '1' }
                ].map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-400">{stat.label}</span>
                    <span className="text-white font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">Create Milestone</Button>
                <Button variant="outline" className="w-full">Set Deadline</Button>
                <Button variant="outline" className="w-full">Generate Report</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}