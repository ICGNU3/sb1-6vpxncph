/**
 * LoadingScreen Component
 * Full-screen loading indicator with animations
 * 
 * Features:
 * - Animated logo
 * - Pulse effects
 * - Blur effects
 * - Loading message
 * - Centered layout
 */
import React from 'react';
import { Hexagon } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-4 transform scale-150">
          <Hexagon className="h-12 w-12 text-green-400 animate-pulse" />
          <Hexagon className="h-12 w-12 text-green-400 absolute top-0 left-0 animate-ping opacity-75" />
          <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">NEPLUS</h2>
        <p className="text-gray-400">Loading amazing things...</p>
      </div>
    </div>
  );
}