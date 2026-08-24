import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeInterpretation {
  impact: string;
  relevantProduct: string;
  suggestedAction: string;
}

export interface MarketTheme {
  id: string;
  title: string;
  description: string;
  interpretation: ThemeInterpretation;
  status: 'pending_validation' | 'approved' | 'rejected';
  deltaStatus: 'new' | 'intensified' | 'stable';
  signalCount: number;
}

const initialThemes: MarketTheme[] = [
  {
    id: 'theme-1',
    title: 'Rotterdam Refining Safety Capex Cycle',
    description: 'Major operators in the Rotterdam area are initiating multi-year safety upgrades following regulatory pressure.',
    interpretation: {
      impact: 'High opportunity for enterprise-wide deployments in the Netherlands.',
      relevantProduct: 'Leadership360',
      suggestedAction: 'Research target accounts at Rotterdam port for Leadership360 entry.'
    },
    status: 'approved',
    deltaStatus: 'intensified',
    signalCount: 8
  },
  {
    id: 'theme-2',
    title: 'Offshore Wind Safety Culture Divergence',
    description: 'Rapid expansion in renewables is leading to a dilution of process safety culture compared to traditional offshore oil & gas.',
    interpretation: {
      impact: 'Growing market need for baseline diagnostics in renewables.',
      relevantProduct: 'SENSE',
      suggestedAction: 'Draft targeted collateral for North Sea offshore wind operators emphasizing cultural baseline.'
    },
    status: 'pending_validation',
    deltaStatus: 'new',
    signalCount: 4
  },
  {
    id: 'theme-3',
    title: 'Ageing Assets Data Harmonisation',
    description: 'Legacy assets are struggling to unify structured and unstructured safety reports into a single risk profile.',
    interpretation: {
      impact: 'Perfect use case for our unstructured data ingestion capabilities.',
      relevantProduct: 'BOOST',
      suggestedAction: 'Prioritise operators with assets >25 years old for BOOST unstructured analytics pitches.'
    },
    status: 'pending_validation',
    deltaStatus: 'intensified',
    signalCount: 12
  }
];

interface MarketState {
  themes: MarketTheme[];
  handleValidation: (id: string, action: 'approve' | 'reject') => void;
  resetMockData: () => void;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      themes: initialThemes,
      handleValidation: (id, action) =>
        set((state) => ({
          themes: state.themes.map((t) =>
            t.id === id ? { ...t, status: action === 'approve' ? 'approved' : 'rejected' } : t
          ),
        })),
      resetMockData: () => set({ themes: initialThemes }),
    }),
    {
      name: 'empirisys-market-storage',
    }
  )
);
