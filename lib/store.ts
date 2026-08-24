import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  plan: string;
  role: string;
}

interface AppState {
  user: User;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  colorTheme: string;
  setColorTheme: (theme: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        name: 'Aakash Arora',
        email: 'Aakash.arora@empirisys.io',
        plan: 'PRO PLAN',
        role: 'AI Strategic Lead',
      },
      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      colorTheme: 'green',
      setColorTheme: (theme) => set({ colorTheme: theme }),
    }),
    {
      name: 'empirisys-storage', // unique name
      partialize: (state) => ({ colorTheme: state.colorTheme, isSidebarOpen: state.isSidebarOpen }), // Only persist these
    }
  )
);
