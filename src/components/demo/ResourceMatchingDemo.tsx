import React, { useState } from 'react';
import { Bot, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function ResourceMatchingDemo() {
  const [projectDescription, setProjectDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  // Simulated AI matching
  const findMatches = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo matches based on music industry expertise
    const demoMatches = [
      {
        type: 'producer',
        name: 'Marcus Chen',
        skills: ['Music Production', 'Sound Design', 'Mixing'],
        match: 94,
        avatar: 'https://source.unsplash.com/random/100x100?musician&sig=1'
      },
      {
        type: 'designer',
        name: 'Sarah Rodriguez',
        skills: ['Merch Design', 'Brand Identity', 'Packaging'],
        match: 89,
        avatar: 'https://source.unsplash.com/random/100x100?designer&sig=2'
      },
      {
        type: 'marketer',
        name: 'James Wilson',
        skills: ['Social Media', 'Fan Engagement', 'Campaign Strategy'],
        match: 87,
        avatar: 'https://source.unsplash.com/random/100x100?marketing&sig=3'
      }
    ];

    setMatches(demoMatches);
    setLoading(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Bot className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">AI Resource Matching</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe your project
          </label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="e.g., Launching an album and merch line with custom artwork and limited edition vinyl..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent h-32"
          />
        </div>

        <Button
          onClick={findMatches}
          disabled={!projectDescription || loading}
          className="w-full"
        >
          {loading ? (
            'Finding matches...'
          ) : (
            <>
              Find Collaborators
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>

        {matches.length > 0 && (
          <div className="space-y-4 mt-6">
            <h4 className="text-lg font-semibold text-white mb-4">Recommended Matches</h4>
            {matches.map((match, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h5 className="text-white font-medium">{match.name}</h5>
                    <p className="text-gray-400 text-sm">{match.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold mb-1">{match.match}% Match</div>
                  <div className="flex gap-2">
                    {match.skills.map((skill: string, i: number) => (
                      <span key={i} className="text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}