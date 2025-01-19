import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Key, Palette, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Settings() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Project Settings</h1>
          <p className="text-gray-400">Manage your project preferences and configurations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <User className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent h-32"
                    placeholder="Enter project description"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Security Settings</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium mb-1">Two-Factor Authentication</h3>
                    <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium mb-1">API Access</h3>
                    <p className="text-gray-400 text-sm">Manage API keys and permissions</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Settings</h2>
              <div className="space-y-4">
                {[
                  { icon: <Bell className="h-5 w-5" />, label: 'Notifications' },
                  { icon: <Globe className="h-5 w-5" />, label: 'Language' },
                  { icon: <Key className="h-5 w-5" />, label: 'Permissions' },
                  { icon: <Palette className="h-5 w-5" />, label: 'Appearance' }
                ].map((setting, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors duration-200 text-gray-300 hover:text-white"
                  >
                    {setting.icon}
                    <span>{setting.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Danger Zone</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full text-red-400 border-red-400/50 hover:border-red-400">
                  Archive Project
                </Button>
                <Button variant="outline" className="w-full text-red-400 border-red-400/50 hover:border-red-400">
                  Delete Project
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}