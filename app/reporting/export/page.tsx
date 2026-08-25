'use client';

import { motion } from 'framer-motion';
import HeroSection from '@/components/ui/HeroSection';
import { SFPencil as Doc, SFArrowDown as Download } from 'sf-symbols-lib/monochrome';
import { useStore } from '@/lib/store';
import { FunFactLoader } from '@/components/ui/FunFactLoader';
import { useState } from 'react';

export default function BoardLevelExportPage() {
  const { user } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 8000);
  };

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection
        title="Board-Level Export"
        subtitle="Instantly synthesize Q2 2026 data across all modules into a highly polished, print-ready PDF presentation."
        moduleLabel="MODULE 04 REPORTING"
      />
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20 flex flex-col items-center mt-12">
        {isGenerating ? (
          <FunFactLoader message="Compiling Executive Briefing..." />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/50 backdrop-blur-xl border border-card-border rounded-[32px] p-12 max-w-2xl w-full text-center"
          >
            <div className="w-24 h-24 mx-auto bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
              <Doc className="w-10 h-10 text-accent relative z-10" />
            </div>

            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 mx-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl transition-all shadow-xl shadow-accent/20"
            >
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
                <span className="block text-2xl font-bold text-text-primary">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-text-secondary uppercase">Author</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
