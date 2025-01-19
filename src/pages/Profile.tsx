import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Globe, Twitter, Github, Linkedin, Edit2, Camera, Shield, Trophy, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    location: '',
    skills: [] as string[],
    social: {
      twitter: '',
      github: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          role: data.role || '',
          bio: data.bio || '',
          location: data.location || '',
          skills: data.skills || [],
          social: {
            twitter: data.social?.twitter || '',
            github: data.social?.github || '',
            linkedin: data.social?.linkedin || ''
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please sign in to view your profile.</p>
          <Button>Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="relative h-48 bg-gradient-to-r from-green-400/20 to-blue-500/20">
            <button className="absolute top-4 right-4 bg-slate-800/80 p-2 rounded-full text-gray-300 hover:text-white transition-colors duration-200">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
              <div className="relative">
                <img
                  src={profile?.avatar || `https://source.unsplash.com/random/200x200?portrait&sig=${user.id}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-slate-900 object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-slate-800 p-2 rounded-full text-gray-300 hover:text-white transition-colors duration-200">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {profile?.name || user.email}
                  </h1>
                  {profile?.badges?.map((badge, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-gray-400">
                  {profile?.role && (
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span>{profile.role}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span>{user.email}</span>
                  </div>
                  {profile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent h-32"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-300">
                  {profile?.bio || "No bio yet"}
                </p>
              )}
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-800 text-gray-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className="text-gray-400 hover:text-white"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {isEditing && (
                  <input
                    type="text"
                    placeholder="Add skill..."
                    className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSkillAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                )}
              </div>
            </Card>

            {/* Projects */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Projects</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4 hover:scale-105 transition-transform duration-200">
                    <img
                      src={`https://source.unsplash.com/random/400x200?technology&sig=${i}`}
                      alt={`Project ${i}`}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold text-white mb-2">Project Title {i}</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      A brief description of this amazing project and its goals.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">Active</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star className="h-4 w-4" />
                          <span>24</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>8</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Social Links */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Social Links</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Twitter
                    </label>
                    <input
                      type="text"
                      value={formData.social.twitter}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social: { ...prev.social, twitter: e.target.value }
                      }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub
                    </label>
                    <input
                      type="text"
                      value={formData.social.github}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social: { ...prev.social, github: e.target.value }
                      }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={formData.social.linkedin}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social: { ...prev.social, linkedin: e.target.value }
                      }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="username"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile?.social?.twitter && (
                    <a
                      href={`https://twitter.com/${profile.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Twitter className="h-5 w-5" />
                      <span>@{profile.social.twitter}</span>
                    </a>
                  )}
                  {profile?.social?.github && (
                    <a
                      href={`https://github.com/${profile.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Github className="h-5 w-5" />
                      <span>{profile.social.github}</span>
                    </a>
                  )}
                  {profile?.social?.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>{profile.social.linkedin}</span>
                    </a>
                  )}
                </div>
              )}
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Reputation</span>
                  </div>
                  <span className="text-white font-semibold">{profile?.reputation || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Projects</span>
                  </div>
                  <span className="text-white font-semibold">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Collaborators</span>
                  </div>
                  <span className="text-white font-semibold">8</span>
                </div>
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Badges</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Early Adopter', 'Top Creator', 'Innovator', 'Mentor'].map((badge, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center ${
                      profile?.badges?.includes(badge)
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-slate-800 text-gray-400'
                    }`}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}