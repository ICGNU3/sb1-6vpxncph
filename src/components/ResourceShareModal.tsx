import React, { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { resourceService } from '../lib/services';
import { useAuthStore } from '../store/authStore';
import type { Resource } from '../types';

interface ResourceShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResourceShareModal({ isOpen, onClose }: ResourceShareModalProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    exchangeType: '',
  });

  const resourceTypes = [
    { value: 'service', label: 'Service', description: 'Professional services like consulting, design, development' },
    { value: 'skill', label: 'Skill', description: 'Specific expertise or technical knowledge' },
    { value: 'material', label: 'Material', description: 'Digital assets, templates, or resources' },
    { value: 'funding', label: 'Funding', description: 'Financial support or investment opportunities' }
  ];

  const exchangeTypes = [
    { value: 'token', label: 'Token Exchange', description: 'Exchange for project tokens' },
    { value: 'collaboration', label: 'Collaboration', description: 'Exchange for project collaboration' },
    { value: 'future_benefit', label: 'Future Benefit', description: 'Exchange for future project benefits' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to share resources');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const resourceData: Partial<Resource> = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        exchangeType: formData.exchangeType as 'token' | 'collaboration' | 'future_benefit',
        status: 'available'
      };

      await resourceService.create(resourceData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Share Your Resources</h2>
          <p className="text-gray-400 mb-6">List your services, skills, or materials to connect with projects</p>

          {error && (
            <div className="mb-6 p-4 bg-red-400/10 border border-red-400/20 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resource Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resource Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                {resourceTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-4 rounded-lg text-left transition-colors duration-200 ${
                      formData.type === type.value
                        ? 'bg-green-400/10 border-2 border-green-400'
                        : 'bg-slate-800 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <h3 className="text-white font-semibold mb-1">{type.label}</h3>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent h-32"
                placeholder="Describe your resource in detail"
                required
              />
            </div>

            {/* Exchange Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Exchange Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                {exchangeTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, exchangeType: type.value }))}
                    className={`p-4 rounded-lg text-left transition-colors duration-200 ${
                      formData.exchangeType === type.value
                        ? 'bg-green-400/10 border-2 border-green-400'
                        : 'bg-slate-800 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <h3 className="text-white font-semibold mb-1">{type.label}</h3>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  'Creating...'
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Share Resource
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}