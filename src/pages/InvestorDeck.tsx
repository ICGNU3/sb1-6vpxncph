import React from 'react';
import { Rocket, TrendingUp, Users, Globe, Shield, Target, ChevronRight, Download } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InvestorBadge } from '../components/InvestorBadge';

export function InvestorDeck() {
  const metrics = [
    { label: 'Total Users', value: '50K+', growth: '+127% YoY' },
    { label: 'Projects Created', value: '12.5K', growth: '+85% YoY' },
    { label: 'Token Holders', value: '8.2K', growth: '+210% YoY' },
    { label: 'TVL', value: '$2.5M', growth: '+150% YoY' }
  ];

  const highlights = [
    {
      title: 'Market Opportunity',
      description: 'Targeting the $50B creator economy with blockchain-powered collaboration tools',
      icon: <Target className="h-6 w-6 text-green-400" />
    },
    {
      title: 'Traction',
      description: 'Growing user base with 40% month-over-month growth in active projects',
      icon: <TrendingUp className="h-6 w-6 text-green-400" />
    },
    {
      title: 'Technology',
      description: 'Proprietary AI-powered matching system for creators and resources',
      icon: <Shield className="h-6 w-6 text-green-400" />
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-white">Investor Relations</h1>
            <InvestorBadge />
          </div>
          <p className="text-gray-400">Revolutionizing creative collaboration through blockchain technology</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white mb-1">{metric.value}</span>
                <span className="text-sm text-gray-400">{metric.label}</span>
                <span className="text-green-400 text-sm mt-2">{metric.growth}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Investment Highlights */}
        <Card className="mb-12 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Investment Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="space-y-4">
                <div className="bg-green-400/10 p-4 rounded-full w-fit">
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{highlight.title}</h3>
                <p className="text-gray-400">{highlight.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Resources */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Investor Resources</h2>
            <div className="space-y-4">
              {[
                { label: 'Pitch Deck', size: '2.4 MB' },
                { label: 'Financial Projections', size: '1.8 MB' },
                { label: 'Technical Whitepaper', size: '3.2 MB' },
                { label: 'Market Analysis', size: '1.5 MB' }
              ].map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">{resource.label}</p>
                      <p className="text-sm text-gray-400">{resource.size}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Schedule a Call</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent h-32"
                  placeholder="Tell us about your interest"
                />
              </div>
              <Button className="w-full">Schedule Meeting</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}