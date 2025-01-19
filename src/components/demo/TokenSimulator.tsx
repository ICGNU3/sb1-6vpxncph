import React, { useState } from 'react';
import { Coins, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function TokenSimulator() {
  const [tokenConfig, setTokenConfig] = useState({
    supply: '1000000',
    creatorAllocation: '20',
    contributorAllocation: '40',
    communityAllocation: '40'
  });

  const [showResults, setShowResults] = useState(false);

  const handleSimulate = () => {
    setShowResults(true);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Coins className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">Token Economics Simulator</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Supply
            </label>
            <input
              type="number"
              value={tokenConfig.supply}
              onChange={(e) => setTokenConfig(prev => ({ ...prev, supply: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Creator Allocation (%)
            </label>
            <input
              type="number"
              value={tokenConfig.creatorAllocation}
              onChange={(e) => setTokenConfig(prev => ({ ...prev, creatorAllocation: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contributor Allocation (%)
            </label>
            <input
              type="number"
              value={tokenConfig.contributorAllocation}
              onChange={(e) => setTokenConfig(prev => ({ ...prev, contributorAllocation: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Community Allocation (%)
            </label>
            <input
              type="number"
              value={tokenConfig.communityAllocation}
              onChange={(e) => setTokenConfig(prev => ({ ...prev, communityAllocation: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
        </div>

        <Button onClick={handleSimulate} className="w-full">
          Simulate Token Distribution
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>

        {showResults && (
          <div className="space-y-4 mt-6">
            <h4 className="text-lg font-semibold text-white mb-4">Distribution Overview</h4>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-400 bg-green-400/10">
                    Creator
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-400">
                    {Number(tokenConfig.supply) * (Number(tokenConfig.creatorAllocation) / 100)} tokens
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                <div style={{ width: `${tokenConfig.creatorAllocation}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-400"></div>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-400/10">
                    Contributors
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-400">
                    {Number(tokenConfig.supply) * (Number(tokenConfig.contributorAllocation) / 100)} tokens
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                <div style={{ width: `${tokenConfig.contributorAllocation}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-400"></div>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-400 bg-purple-400/10">
                    Community
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple-400">
                    {Number(tokenConfig.supply) * (Number(tokenConfig.communityAllocation) / 100)} tokens
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                <div style={{ width: `${tokenConfig.communityAllocation}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-400"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}