import React from 'react';
import { Users, Sparkles, Target } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ProjectRecommender } from '../lib/ai/recommendations/projectRecommender';
import type { Project } from '../types';

interface ProjectRecommendationsProps {
  project: Project;
}

export function ProjectRecommendations({ project }: ProjectRecommendationsProps) {
  const [loading, setLoading] = React.useState(true);
  const [collaborators, setCollaborators] = React.useState<any[]>([]);
  const [resources, setResources] = React.useState<any[]>([]);
  const [similarProjects, setSimilarProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const recommender = new ProjectRecommender();
        
        const [
          collaboratorRecs,
          resourceRecs,
          projectRecs
        ] = await Promise.all([
          recommender.getCollaboratorRecommendations(project),
          recommender.getResourceRecommendations(project),
          recommender.getSimilarProjects(project)
        ]);

        setCollaborators(collaboratorRecs);
        setResources(resourceRecs);
        setSimilarProjects(projectRecs);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [project]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-slate-700 rounded"></div>
            <div className="h-8 bg-slate-700 rounded"></div>
            <div className="h-8 bg-slate-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collaborator Recommendations */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Users className="h-6 w-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Recommended Collaborators</h2>
        </div>
        <div className="space-y-4">
          {collaborators.map(({ profile, score }) => (
            <div key={profile.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-medium">{profile.name}</h3>
                  <p className="text-gray-400 text-sm">{profile.role}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-medium mb-1">
                  {Math.round(score.score * 100)}% Match
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Resource Recommendations */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Sparkles className="h-6 w-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Recommended Resources</h2>
        </div>
        <div className="space-y-4">
          {resources.map(({ resource, score }) => (
            <div key={resource.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div>
                <h3 className="text-white font-medium mb-1">{resource.title}</h3>
                <p className="text-gray-400 text-sm">{resource.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-green-400/10 text-green-400 rounded-full text-xs">
                    {resource.type}
                  </span>
                  <span className="px-2 py-1 bg-slate-700 rounded-full text-xs text-gray-300">
                    {resource.exchangeType}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Similar Projects */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Target className="h-6 w-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Similar Projects</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {similarProjects.map(({ project, score }) => (
            <Card key={project.id} className="p-4 hover:scale-105 transition-transform duration-200">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="text-white font-medium mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-green-400 font-medium">
                  {Math.round(score.score * 100)}% Similar
                </div>
                <Button variant="outline" size="sm">
                  View Project
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}