import React, { useState } from 'react';
import { Code, Play, Check, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function ContractPlayground() {
  const [selectedTemplate, setSelectedTemplate] = useState('collaboration');
  const [customizations, setCustomizations] = useState({
    minParticipants: '2',
    maxParticipants: '10',
    votingThreshold: '60',
    reviewRequired: true
  });
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  const templates = {
    collaboration: `// Collaboration Contract Template
contract ProjectCollaboration {
    uint256 public minParticipants;
    uint256 public maxParticipants;
    uint256 public votingThreshold;
    bool public reviewRequired;

    constructor(
        uint256 _min,
        uint256 _max,
        uint256 _threshold,
        bool _review
    ) {
        minParticipants = _min;
        maxParticipants = _max;
        votingThreshold = _threshold;
        reviewRequired = _review;
    }
}`,
    token: `// Project Token Template
contract ProjectToken {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balances;
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
    }
}`,
    resource: `// Resource Exchange Template
contract ResourceExchange {
    struct Resource {
        address provider;
        string resourceType;
        uint256 price;
        bool available;
    }
    
    mapping(uint256 => Resource) public resources;
    uint256 public nextResourceId;
    
    function listResource(
        string memory _type,
        uint256 _price
    ) public returns (uint256) {
        resources[nextResourceId] = Resource(
            msg.sender,
            _type,
            _price,
            true
        );
        return nextResourceId++;
    }
}`
  };

  const handleDeploy = async () => {
    setDeployStatus('deploying');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDeployStatus('success');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Code className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">Smart Contract Playground</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contract Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
          >
            <option value="collaboration">Collaboration Contract</option>
            <option value="token">Project Token</option>
            <option value="resource">Resource Exchange</option>
          </select>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
          <pre>{templates[selectedTemplate as keyof typeof templates]}</pre>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Participants
            </label>
            <input
              type="number"
              value={customizations.minParticipants}
              onChange={(e) => setCustomizations(prev => ({ ...prev, minParticipants: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              value={customizations.maxParticipants}
              onChange={(e) => setCustomizations(prev => ({ ...prev, maxParticipants: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Voting Threshold (%)
            </label>
            <input
              type="number"
              value={customizations.votingThreshold}
              onChange={(e) => setCustomizations(prev => ({ ...prev, votingThreshold: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                checked={customizations.reviewRequired}
                onChange={(e) => setCustomizations(prev => ({ ...prev, reviewRequired: e.target.checked }))}
                className="rounded border-slate-700 text-green-400 focus:ring-green-400"
              />
              Review Required
            </label>
          </div>
        </div>

        <Button
          onClick={handleDeploy}
          disabled={deployStatus === 'deploying'}
          className="w-full"
        >
          {deployStatus === 'deploying' ? (
            'Deploying Contract...'
          ) : deployStatus === 'success' ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Contract Deployed
            </>
          ) : deployStatus === 'error' ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Deployment Failed
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Deploy Contract
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}