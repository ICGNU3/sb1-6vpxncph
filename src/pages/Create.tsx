import React, { useState } from 'react';
import { Plus, Sparkles, Shield, Users, ArrowLeft, ArrowRight, Check, Bot, User, LogIn } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { projectService } from '../lib/services';
import { useAuthStore } from '../store/authStore';
import { ErrorMessage } from '../components/ErrorMessage';
import { Link } from 'react-router-dom';

export function Create() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    category: '',
    skills: '',
    token: {
      name: '',
      symbol: '',
      supply: '',
    },
    team: {
      roles: '',
      size: '',
      expertise: '',
    }
  });

  // If user is not authenticated, show sign-in prompt
  if (!user) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md mx-auto p-8 text-center">
            <LogIn className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-300 mb-6">
              Please sign in to create a new project and start collaborating with others.
            </p>
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
                className="w-full"
              >
                Sign In
              </Button>
              <Link to="/alpha">
                <Button variant="outline" className="w-full">
                  Join Alpha
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same...
  const projectTypes = [
    // ... existing project types
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    // ... existing handleInputChange function
  };

  const handleSubmit = async () => {
    // ... existing handleSubmit function
  };

  // ... rest of the component implementation
  return (
    <div className="min-h-screen py-12">
      {/* Rest of the JSX remains the same */}
    </div>
  );
}