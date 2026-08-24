import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  isAssistantOpen: boolean;
  toggleAssistant: () => void;
  setAssistantOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  isAssistantOpen: false,
  toggleAssistant: () => set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),
  setAssistantOpen: (isOpen) => set({ isAssistantOpen: isOpen }),
}));
