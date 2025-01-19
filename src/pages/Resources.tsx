import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Book, Code, Palette, Video, Users, MessageSquare, Tag, Clock, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ResourceShareModal } from '../components/ResourceShareModal';
import { useResources } from '../hooks';
import { ErrorMessage } from '../components/ErrorMessage';
import { ResourceSkeleton } from '../components/LoadingSkeleton';
import type { Resource } from '../types';

export function Resources() {
  const { resources, loading, error } = useResources();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showShareModal, setShowShareModal] = useState(false);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'service', label: 'Services' },
    { id: 'skill', label: 'Skills' },
    { id: 'material', label: 'Materials' },
    { id: 'funding', label: 'Funding' }
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'token', label: 'Token Exchange' },
    { id: 'collaboration', label: 'Collaboration' },
    { id: 'future_benefit', label: 'Future Benefit' }
  ];

  const filteredResources = resources?.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory;
    const matchesType = selectedType === 'all' || resource.exchangeType === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">Resource Exchange</h1>
          <p className="text-xl text-gray-300">Connect with resources and collaborators for your projects</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 pl-10 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${selectedCategory === category.id
                    ? 'bg-green-400 text-slate-900'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8">
            <ErrorMessage message={error.message} />
          </div>
        )}

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array(6).fill(0).map((_, index) => (
              <ResourceSkeleton key={index} />
            ))
          ) : filteredResources?.map((resource) => (
            <Card key={resource.id} className="hover:scale-105 transition-transform duration-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${resource.type === 'service' ? 'bg-blue-400/10 text-blue-400' :
                      resource.type === 'skill' ? 'bg-green-400/10 text-green-400' :
                      resource.type === 'material' ? 'bg-purple-400/10 text-purple-400' :
                      'bg-yellow-400/10 text-yellow-400'}`}>
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
                    {resource.exchangeType.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                <p className="text-gray-400 mb-4">{resource.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={resource.provider.avatar || `https://source.unsplash.com/random/100x100?portrait&sig=${resource.id}`}
                      alt={resource.provider.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-300">{resource.provider.name}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="text-center p-8">
          <Sparkles className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Have Resources to Share?</h2>
          <p className="text-gray-300 mb-6">
            List your services, skills, or materials and connect with projects that need them.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/alpha">
              <Button size="lg">Join Alpha</Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => setShowShareModal(true)}>
              Share Resource
            </Button>
          </div>
        </Card>

        <ResourceShareModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      </div>
    </div>
  );
}