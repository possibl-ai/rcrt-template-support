import { create } from 'zustand';

interface AppState {
  ticketFilter: 'all' | 'open' | 'pending' | 'resolved';
  setTicketFilter: (filter: 'all' | 'open' | 'pending' | 'resolved') => void;
}

export const useStore = create<AppState>((set) => ({
  ticketFilter: 'all',
  setTicketFilter: (filter) => set({ ticketFilter: filter }),
}));
