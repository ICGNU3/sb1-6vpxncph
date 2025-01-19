import React, { createContext, useContext, ReactNode } from 'react';
import { useDemoStore } from '../store/demoStore';

const demoData = {
  projects: {
    total: 12500,
    active: 8750,
    completed: 3750,
    growth: 85
  },
  users: {
    total: 50000,
    active: 35000,
    creators: 15000,
    growth: 127
  },
  tokens: {
    holders: 8200,
    tvl: 2500000,
    volume: 750000,
    growth: 210
  },
  metrics: {
    retention: 0.78,
    engagement: 0.65,
    conversion: 0.12,
    growth: 0.45
  }
};

const DemoContext = createContext<typeof demoData | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const { enabled } = useDemoStore();

  return (
    <DemoContext.Provider value={enabled ? demoData : null}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoData() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
}