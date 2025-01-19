import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Trophy, Calendar, Search, Filter, Star, Heart, Share2, MessageCircle, Sparkles, 
         Globe, Hash, Zap, MapPin, Code, Palette, Video, Book, Plus, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePosts, useEvents } from '../hooks';
import { ErrorMessage } from '../components/ErrorMessage';
import { PostSkeleton, EventSkeleton } from '../components/LoadingSkeleton';
import type { CommunityPost, CommunityEvent, CommunityGroup } from '../types';

export function Community() {
  const { posts, loading: postsLoading, error: postsError } = usePosts();
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'groups'>('feed');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredGroups: CommunityGroup[] = [
    {
      id: '1',
      name: 'Creators Hub',
      description: 'A space for creators to collaborate and share ideas',
      type: 'interest',
      members: [],
      admins: [],
      posts: [],
      events: [],
      isPrivate: false,
      tags: ['creative', 'collaboration'],
      image: 'https://source.unsplash.com/random/800x600?creative&sig=1'
    },
    {
      id: '2',
      name: 'Tech Innovators',
      description: 'Discussing cutting-edge technology and innovation',
      type: 'interest',
      members: [],
      admins: [],
      posts: [],
      events: [],
      isPrivate: false,
      tags: ['technology', 'innovation'],
      image: 'https://source.unsplash.com/random/800x600?technology&sig=2'
    },
    {
      id: '3',
      name: 'Design Community',
      description: 'For designers to share work and get feedback',
      type: 'skill',
      members: [],
      admins: [],
      posts: [],
      events: [],
      isPrivate: false,
      tags: ['design', 'feedback'],
      image: 'https://source.unsplash.com/random/800x600?design&sig=3'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">Community Hub</h1>
          <p className="text-xl text-gray-300">Connect, collaborate, and grow with fellow creators</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search community..."
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
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'feed', label: 'Feed', icon: <MessageSquare className="h-5 w-5" /> },
            { id: 'events', label: 'Events', icon: <Calendar className="h-5 w-5" /> },
            { id: 'groups', label: 'Groups', icon: <Users className="h-5 w-5" /> }
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

        {/* Tab Content */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Create Post */}
            <Card className="p-6">
              <div className="flex gap-4">
                <img
                  src="https://source.unsplash.com/random/100x100?portrait"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                </div>
                <Button>Post</Button>
              </div>
            </Card>

            {/* Posts */}
            {postsError ? (
              <ErrorMessage message={postsError.message} />
            ) : postsLoading ? (
              Array(3).fill(0).map((_, index) => <PostSkeleton key={index} />)
            ) : posts?.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={post.author.avatar || `https://source.unsplash.com/random/100x100?portrait&sig=${post.id}`}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-white font-medium">{post.author.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-gray-300 mb-4">{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post content"
                        className="rounded-lg mb-4 w-full"
                      />
                    )}
                    <div className="flex items-center gap-6 text-gray-400">
                      <button className="flex items-center gap-2 hover:text-green-400">
                        <Heart className="h-5 w-5" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-green-400">
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-green-400">
                        <Share2 className="h-5 w-5" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsError ? (
                <ErrorMessage message={eventsError.message} />
              ) : eventsLoading ? (
                Array(3).fill(0).map((_, index) => <EventSkeleton key={index} />)
              ) : events?.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:scale-105 transition-transform duration-200">
                  <img
                    src={event.image || `https://source.unsplash.com/random/800x600?event&sig=${event.id}`}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm">
                        {event.type}
                      </span>
                      <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 mb-4">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={event.host.avatar || `https://source.unsplash.com/random/100x100?portrait&sig=${event.id}`}
                          alt={event.host.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-gray-300">{event.host.name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Join Event
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-8">
            {/* Featured Groups */}
            <div className="grid md:grid-cols-3 gap-6">
              {featuredGroups.map((group) => (
                <Card key={group.id} className="overflow-hidden hover:scale-105 transition-transform duration-200">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
                    <p className="text-gray-400 mb-4">{group.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      Join Group
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Create Group CTA */}
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Create Your Own Group</h2>
              <p className="text-gray-300 mb-6">
                Build a community around your interests or project
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/alpha">
                  <Button size="lg">Join Alpha</Button>
                </Link>
                <Button size="lg" variant="outline" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Group
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}