import { create } from 'zustand';

interface DemoState {
  enabled: boolean;
  toggleDemo: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  enabled: false,
  toggleDemo: () => set((state) => ({ enabled: !state.enabled })),
}));