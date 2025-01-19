import React from 'react';
import { Beaker } from 'lucide-react';
import { Button } from './ui/Button';

interface DemoModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function DemoModeToggle({ enabled, onToggle }: DemoModeToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={`flex items-center gap-2 ${enabled ? 'text-green-400 border-green-400' : ''}`}
    >
      <Beaker className="h-4 w-4" />
      {enabled ? 'Exit Demo Mode' : 'Demo Mode'}
    </Button>
  );
}