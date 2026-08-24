import { create } from 'zustand';

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  sources?: string[];
}

interface AssistantState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, 'id'>) => void;
  updateLastMessage: (content: string, sources?: string[]) => void;
  setLoading: (isLoading: boolean) => void;
  clearMessages: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (msg) => set((state) => ({ 
    messages: [...state.messages, { ...msg, id: generateId() }] 
  })),
  updateLastMessage: (content, sources) => set((state) => {
    const messages = [...state.messages];
    if (messages.length === 0) return state;
    
    const lastIndex = messages.length - 1;
    if (messages[lastIndex].role === 'assistant') {
      messages[lastIndex] = { ...messages[lastIndex], content, sources: sources || messages[lastIndex].sources };
    }
    return { messages };
  }),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
}));
