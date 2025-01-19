import React, { useEffect, useState } from 'react';
import { BarChart, LineChart, PieChart, TrendingUp, Users, Clock, Target, Zap, Globe, Server } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { metrics } from '../lib/monitoring';

export function Analytics() {
  const [performanceData, setPerformanceData] = useState({
    fcp: 0,
    lcp: 0,
    cls: 0,
    navigation: {
      dns: 0,
      tcp: 0,
      ttfb: 0,
      responseTime: 0,
      domInteractive: 0,
      domComplete: 0
    }
  });

  useEffect(() => {
    const loadMetrics = async () => {
      const [lcp, cls] = await Promise.all([
        metrics.getLCP(),
        metrics.getCLS()
      ]);

      setPerformanceData({
        fcp: metrics.getFCP(),
        lcp,
        cls,
        navigation: metrics.getNavigationTiming()
      });
    };

    loadMetrics();
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your project's performance and metrics</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Views', value: '2.4K', icon: <BarChart className="h-6 w-6" />, change: '+12%' },
            { label: 'Active Users', value: '847', icon: <Users className="h-6 w-6" />, change: '+5%' },
            { label: 'Avg. Session', value: '12m', icon: <Clock className="h-6 w-6" />, change: '-2%' }
          ].map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-400/10 p-3 rounded-full">
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Performance Metrics */}
        <Card className="mb-8 p-6">
          <div className="flex items-center gap-4 mb-6">
            <Zap className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Performance Metrics</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Core Web Vitals</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">First Contentful Paint</span>
                  <span className="text-white">{performanceData.fcp.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">Largest Contentful Paint</span>
                  <span className="text-white">{performanceData.lcp.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">Cumulative Layout Shift</span>
                  <span className="text-white">{performanceData.cls.toFixed(3)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Network</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">DNS Lookup</span>
                  <span className="text-white">{performanceData.navigation.dns.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">TCP Connection</span>
                  <span className="text-white">{performanceData.navigation.tcp.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">Time to First Byte</span>
                  <span className="text-white">{performanceData.navigation.ttfb.toFixed(2)}ms</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Page Load</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">DOM Interactive</span>
                  <span className="text-white">{performanceData.navigation.domInteractive.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">DOM Complete</span>
                  <span className="text-white">{performanceData.navigation.domComplete.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white">{performanceData.navigation.responseTime.toFixed(2)}ms</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Project Growth</h2>
            <div className="h-64 flex items-center justify-center border border-slate-700 rounded-lg">
              <TrendingUp className="h-12 w-12 text-green-400" />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">User Engagement</h2>
            <div className="h-64 flex items-center justify-center border border-slate-700 rounded-lg">
              <Target className="h-12 w-12 text-green-400" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}