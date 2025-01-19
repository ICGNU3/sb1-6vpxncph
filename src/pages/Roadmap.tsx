import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Sparkles, Bot, Coins, Globe, ChevronRight, Users, Zap, Shield, Target, HardDrive, Code, Network } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Phase {
  number: number;
  title: string;
  icon: React.ReactNode;
  objective: string;
  keySteps: {
    title: string;
    items: string[];
    progress?: number;
  }[];
  status: 'completed' | 'in-progress' | 'upcoming';
}

export function Roadmap() {
  const phases: Phase[] = [
    {
      number: 1,
      title: "Core Infrastructure",
      icon: <HardDrive className="h-6 w-6 text-green-400" />,
      objective: "Build the foundational layer that enables secure, scalable decentralized collaboration.",
      keySteps: [
        {
          title: "Technical Foundation",
          items: [
            "Design scalable system architecture",
            "Implement secure data storage and encryption",
            "Build authentication and authorization system"
          ],
          progress: 80
        },
        {
          title: "Smart Contract Development",
          items: [
            "Create core contract architecture",
            "Implement access control mechanisms",
            "Develop token standards and interfaces"
          ],
          progress: 60
        },
        {
          title: "Security & Testing",
          items: [
            "Conduct comprehensive security audits",
            "Perform extensive testing and QA",
            "Establish monitoring and alerting systems"
          ],
          progress: 60
        }
      ],
      status: 'in-progress'
    },
    {
      number: 2,
      title: "Protocol Development",
      icon: <Code className="h-6 w-6 text-green-400" />,
      objective: "Create the protocol layer that defines how participants interact and collaborate.",
      keySteps: [
        {
          title: "Protocol Design",
          items: [
            "Define collaboration protocols and standards",
            "Design incentive mechanisms",
            "Create governance framework"
          ]
        },
        {
          title: "Implementation",
          items: [
            "Build core protocol features",
            "Implement reputation system",
            "Develop resource allocation mechanisms"
          ]
        },
        {
          title: "Integration",
          items: [
            "Create SDK and developer tools",
            "Build API infrastructure",
            "Establish documentation standards"
          ]
        }
      ],
      status: 'upcoming'
    },
    {
      number: 3,
      title: "Network Effects",
      icon: <Network className="h-6 w-6 text-green-400" />,
      objective: "Bootstrap the network by onboarding key participants and creating initial value flows.",
      keySteps: [
        {
          title: "Community Building",
          items: [
            "Launch creator onboarding program",
            "Establish partnership network",
            "Create educational resources"
          ]
        },
        {
          title: "Value Creation",
          items: [
            "Launch initial use cases",
            "Create resource marketplace",
            "Implement reward mechanisms"
          ]
        },
        {
          title: "Growth Strategy",
          items: [
            "Deploy growth incentives",
            "Launch referral programs",
            "Create viral loops"
          ]
        }
      ],
      status: 'upcoming'
    },
    {
      number: 4,
      title: "AI Integration",
      icon: <Bot className="h-6 w-6 text-green-400" />,
      objective: "Enhance the platform with AI capabilities to optimize collaboration and value creation.",
      keySteps: [
        {
          title: "AI Development",
          items: [
            "Build recommendation systems",
            "Implement predictive analytics",
            "Create AI-powered matching"
          ]
        },
        {
          title: "Automation",
          items: [
            "Develop workflow automation",
            "Create smart task allocation",
            "Build quality assurance systems"
          ]
        },
        {
          title: "Optimization",
          items: [
            "Implement resource optimization",
            "Create performance analytics",
            "Build decision support systems"
          ]
        }
      ],
      status: 'upcoming'
    },
    {
      number: 5,
      title: "Economic Scaling",
      icon: <Coins className="h-6 w-6 text-green-400" />,
      objective: "Scale the economic model to create a self-sustaining ecosystem.",
      keySteps: [
        {
          title: "Token Economics",
          items: [
            "Launch token utility features",
            "Implement staking mechanisms",
            "Create liquidity programs"
          ]
        },
        {
          title: "Market Development",
          items: [
            "Launch secondary markets",
            "Create derivative products",
            "Implement cross-chain bridges"
          ]
        },
        {
          title: "Sustainability",
          items: [
            "Implement fee structures",
            "Create treasury management",
            "Launch grants program"
          ]
        }
      ],
      status: 'upcoming'
    }
  ];

  const renderPhaseCard = (phase: Phase) => {
    const statusColors = {
      completed: 'bg-green-400/20 text-green-400',
      'in-progress': 'bg-blue-400/20 text-blue-400',
      upcoming: 'bg-slate-700 text-gray-400'
    };

    const overallProgress = phase.keySteps.some(step => step.progress !== undefined)
      ? Math.round(
          phase.keySteps.reduce((acc, step) => acc + (step.progress || 0), 0) / 
          phase.keySteps.length
        )
      : null;

    return (
      <Card key={phase.number} className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full transform translate-x-16 -translate-y-16" />
        
        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-400/10 p-4 rounded-full">
                {phase.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Phase {phase.number}</h3>
                <p className="text-lg text-green-400">{phase.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {overallProgress !== null && (
                <span className="text-blue-400 font-medium">{overallProgress}% Complete</span>
              )}
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[phase.status]}`}>
                {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
              </span>
            </div>
          </div>

          <p className="text-gray-300 mb-6">{phase.objective}</p>

          <div className="space-y-6">
            {phase.keySteps.map((step, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  {step.progress !== undefined && (
                    <span className="text-blue-400">{step.progress}%</span>
                  )}
                </div>
                {step.progress !== undefined && (
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                )}
                <ul className="space-y-2">
                  {step.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-gray-400">
                      <ChevronRight className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">Platform Roadmap</h1>
          <p className="text-xl text-gray-300">Building the future of decentralized collaboration</p>
        </div>

        {/* Timeline Progress */}
        <div className="flex justify-between mb-12 px-4 overflow-x-auto">
          {phases.map((phase, index) => (
            <div key={index} className="flex flex-col items-center min-w-[100px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${phase.status === 'completed' ? 'bg-green-400 text-slate-900' :
                  phase.status === 'in-progress' ? 'bg-blue-400 text-slate-900' :
                  'bg-slate-700 text-gray-400'}`}>
                {phase.number}
              </div>
              {index < phases.length - 1 && (
                <div className={`h-1 w-24 mt-4
                  ${phase.status === 'completed' ? 'bg-green-400' :
                    phase.status === 'in-progress' ? 'bg-gradient-to-r from-blue-400 to-slate-700' :
                    'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Phase Cards */}
        <div className="space-y-8">
          {phases.map(renderPhaseCard)}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Join Our Journey?</h2>
            <p className="text-gray-300 mb-6">
              Be part of the revolution in decentralized collaboration. Join our community and help shape the future of creative work.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/alpha">
                <Button size="lg" className="w-full sm:w-auto">Join Alpha</Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Roadmap;