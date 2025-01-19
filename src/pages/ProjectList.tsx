import React, { useState } from 'react';
import { Search, Filter, Sparkles, Users, Calendar, Star, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useProjects } from '../hooks';
import { ErrorMessage } from '../components/ErrorMessage';
import { ProjectSkeleton } from '../components/LoadingSkeleton';

export function ProjectList() {
  const { projects, loading, error } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'progress'>('recent');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'creative', label: 'Creative' },
    { id: 'innovation', label: 'Innovation' },
    { id: 'community', label: 'Community' },
    { id: 'personal', label: 'Personal' },
    { id: 'ai', label: 'AI & ML' }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'progress', label: 'Progress' }
  ];

  const filteredProjects = projects
    ?.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || project.metadata?.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.collaborations?.length || 0) - (a.collaborations?.length || 0);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">Discover Projects</h1>
          <p className="text-xl text-gray-300">Explore innovative projects and find opportunities to collaborate</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 pl-10 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </Button>
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Sort: {sortOptions.find(opt => opt.id === sortBy)?.label}
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg overflow-hidden z-10">
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id as typeof sortBy)}
                      className={`w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors duration-200
                        ${sortBy === option.id ? 'text-green-400' : 'text-gray-300'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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

        {/* Featured Projects */}
        <Card className="mb-12 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects?.slice(0, 3).map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={project.image_url || `https://source.unsplash.com/random/800x600?technology&sig=${project.id}`}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full">
                        {project.metadata?.type || 'Project'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 text-sm">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{project.collaborations?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star className="h-4 w-4" />
                          <span>{project.progress || 0}%</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/projects/${project.id}`}
                      >
                        View Project
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* All Projects */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">All Projects</h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProjectSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects?.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={project.image_url || `https://source.unsplash.com/random/800x600?technology&sig=${project.id}`}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full">
                        {project.metadata?.type || 'Project'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 text-sm">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{project.collaborations?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star className="h-4 w-4" />
                          <span>{project.progress || 0}%</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/projects/${project.id}`}
                      >
                        View Project
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}