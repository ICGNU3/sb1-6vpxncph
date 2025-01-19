import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Project } from '../types';

export function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const projects: Project[] = [
    {
      id: '1',
      title: 'Decentralized Art Gallery',
      description: 'A virtual gallery space powered by blockchain technology.',
      image: 'https://source.unsplash.com/random/800x600?art&sig=1',
      progress: 75,
      contributors: 12
    },
    {
      id: '2',
      title: 'EcoTech Innovation Hub',
      description: 'Sustainable technology solutions for urban environments.',
      image: 'https://source.unsplash.com/random/800x600?technology&sig=2',
      progress: 45,
      contributors: 8
    },
    {
      id: '3',
      title: 'Community Music Platform',
      description: 'Collaborative music creation and distribution platform.',
      image: 'https://source.unsplash.com/random/800x600?music&sig=3',
      progress: 90,
      contributors: 15
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">Explore Projects</h1>
          <p className="text-gray-300">Discover innovative projects and join the next big thing.</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </Button>
        </div>

        {/* Featured Section */}
        <Card className="mb-12 p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:scale-105 transition-transform duration-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      {project.contributors} contributors
                    </div>
                    <div className="text-green-400 font-semibold">
                      {project.progress}% complete
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Technology', 'Art & Design', 'Social Impact', 'Innovation'].map((category) => (
            <Card key={category} className="hover:scale-105 transition-transform duration-200 cursor-pointer">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{category}</h3>
                <p className="text-gray-400">Explore projects in {category.toLowerCase()}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-12 p-8 text-center">
          <Sparkles className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-300 mb-6">Join our community and bring your ideas to life</p>
          <div className="flex justify-center space-x-4">
            <Link to="/alpha">
              <Button size="lg">Join Alpha</Button>
            </Link>
            <Link to="/create">
              <Button size="lg" variant="outline">Create Project</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}