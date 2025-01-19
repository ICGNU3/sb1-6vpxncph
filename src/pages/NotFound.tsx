import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-16 w-16 text-green-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4 glow-text">404 - Page Not Found</h1>
        <p className="text-gray-300 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Button onClick={() => window.location.href = '/'}>
          Return Home
        </Button>
      </div>
    </div>
  );
}