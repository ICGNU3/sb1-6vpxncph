import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Sparkles, Users, Globe, Target, Shield, Zap, HardDrive, Bot, Coins } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function About() {
  const values = [
    // ... existing values array
  ];

  const stats = [
    // ... existing stats array
  ];

  const phases = [
    {
      number: 1,
      title: "Foundation & Infrastructure",
      icon: <HardDrive className="h-6 w-6 text-green-400" />,
      description: "Core platform features and security infrastructure",
      progress: 75,
      status: 'in-progress'
    },
    // ... rest of phases remain the same
  ];

  // Rest of the component remains the same
}