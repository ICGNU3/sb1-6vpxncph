import React from 'react';
import { Shield } from 'lucide-react';

export function InvestorBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/10 text-green-400 rounded-full text-sm font-medium">
      <Shield className="h-4 w-4" />
      <span>Investor Preview</span>
    </div>
  );
}