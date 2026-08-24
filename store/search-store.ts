import { create } from 'zustand';

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  recentQueries: string[];
  addRecentQuery: (query: string) => void;
}

// Client-side initialization for localStorage persistence
const getInitialRecentQueries = (): string[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('empirisys_recent_queries');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
};

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  recentQueries: getInitialRecentQueries(),
  addRecentQuery: (query) => set((state) => {
    if (!query.trim() || state.recentQueries.includes(query)) return state;
    const newQueries = [query, ...state.recentQueries].slice(0, 5);
    if (typeof window !== 'undefined') {
      localStorage.setItem('empirisys_recent_queries', JSON.stringify(newQueries));
    }
    return { recentQueries: newQueries };
  }),
}));
