"use client";

import { motion } from 'framer-motion';
import { SFPencil as Doc, SFArrowDown as Download } from 'sf-symbols-lib/monochrome';
import { useStore } from '@/lib/store';

export default function BoardLevelExportPage() {
  const { user } = useStore();

  return (
    <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center p-6 space-y-6 overflow-y-auto">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card/50 backdrop-blur-xl border border-card-border rounded-[32px] p-12 max-w-2xl w-full text-center"
      >
        <div className="w-24 h-24 mx-auto bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
          <Doc className="w-10 h-10 text-accent relative z-10" />
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-4">Board-Level Export Generator</h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-8">
          Instantly synthesize Q2 2026 data across all modules (Competitor Intel, Market Signals, Churn Risk) into a highly polished, print-ready PDF presentation.
        </p>

        <button className="flex items-center gap-2 mx-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl transition-all shadow-xl shadow-accent/20">
          <Download className="w-5 h-5" />
          Generate Q2 Intelligence Report
        </button>

        <div className="mt-8 pt-8 border-t border-card-border flex justify-center gap-8">
          <div className="text-center">
            <span className="block text-2xl font-bold text-text-primary">14</span>
            <span className="text-[10px] text-text-secondary uppercase">Pages</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-text-primary">9.2s</span>
            <span className="text-[10px] text-text-secondary uppercase">Gen Time</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-text-primary">{user.name.split(' ')[0]}</span>
            <span className="text-[10px] text-text-secondary uppercase">Author</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
