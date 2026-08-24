"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/ui/HeroSection';
import { SFShield as Shield, SFExclamationmarkTriangle as Alert } from 'sf-symbols-lib/monochrome';

export default function StrategicFrameworksPage() {
  const [activeTab, setActiveTab] = useState<'porters' | 'vrio'>('porters');

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Strategic Frameworks"
        subtitle="Academic MBA-grade plotting of Empirisys vs. Legacy Incumbents (Sphera, Intelex)."
        moduleLabel="MODULE 03 FRAMEWORKS"
        belowContent={
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('porters')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'porters' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-panel text-text-secondary hover:text-text-primary'}`}
            >
              Porter's Five Forces
            </button>
            <button
              onClick={() => setActiveTab('vrio')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'vrio' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-panel text-text-secondary hover:text-text-primary'}`}
            >
              VRIO Matrix
            </button>
          </div>
        }
      />
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">

      <AnimatePresence mode="wait">
        {activeTab === 'porters' ? (
          <motion.div
            key="porters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Center: Competitive Rivalry */}
            <div className="md:col-span-3 bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] p-6 flex flex-col items-center text-center">
              <Shield className="w-8 h-8 text-[#EF4444] mb-3" />
              <h3 className="text-lg font-bold text-text-primary mb-1">Competitive Rivalry</h3>
              <span className="px-3 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold rounded-full uppercase tracking-wider mb-4">High Threat</span>
              <p className="text-sm text-text-secondary max-w-2xl">
                The HSE market is dominated by legacy giants (Sphera, Intelex, Cority) fighting for enterprise renewals. However, their rivalry is based on pricing and bundling, not technological innovation. Empirisys enters by changing the battleground to predictive AI.
              </p>
            </div>

            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] p-6">
                <h3 className="text-sm font-bold text-text-primary mb-1">Threat of New Entrants</h3>
                <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider block mb-3">Medium Threat</span>
                <p className="text-sm text-text-secondary">
                  High barriers to entry due to the necessity of complex regulatory compliance (ISO, OSHA). Startups struggle to gain enterprise trust. Empirisys overcomes this via superior data ingestion speed.
                </p>
              </div>
              <div className="bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] p-6">
                <h3 className="text-sm font-bold text-text-primary mb-1">Bargaining Power of Suppliers</h3>
                <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-3">Low Threat</span>
                <p className="text-sm text-text-secondary">
                  Cloud infrastructure and LLM APIs (OpenAI, Anthropic) are becoming commoditized. We are not locked into a single supplier for our AI pipeline.
                </p>
              </div>
            </div>

            {/* Middle Diagram visualization (Empty spacer for layout) */}
            <div className="hidden md:flex items-center justify-center relative">
               <div className="w-full h-full border-2 border-dashed border-card-border rounded-full absolute scale-75 opacity-20 animate-[spin_60s_linear_infinite]" />
               <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center border border-accent/30 z-10 backdrop-blur-md">
                 <span className="font-bold text-accent text-center leading-tight">HSE<br/>Market<br/>Dynamics</span>
               </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] p-6">
                <h3 className="text-sm font-bold text-text-primary mb-1">Bargaining Power of Buyers</h3>
                <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider block mb-3">High Threat</span>
                <p className="text-sm text-text-secondary">
                  Enterprise buyers (Chevron, BP) dictate strict procurement terms. They demand proven ROI. Empirisys must lead with hard data on incident reduction and lower TCO vs. Sphera.
                </p>
              </div>
              <div className="bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] p-6">
                <h3 className="text-sm font-bold text-text-primary mb-1">Threat of Substitutes</h3>
                <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-3">Low Threat</span>
                <p className="text-sm text-text-secondary">
                  Excel and manual paper forms are the only true substitutes. Regulatory fines are too severe for enterprises to not adopt dedicated software.
                </p>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="vrio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border bg-panel/30">
                    <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider w-1/3">Resource / Capability</th>
                    <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-center">Valuable?</th>
                    <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-center">Rare?</th>
                    <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-center">Inimitable?</th>
                    <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-center">Organized?</th>
                    <th className="p-4 text-xs font-bold text-accent uppercase tracking-wider">Competitive Implication</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-card-border hover:bg-panel/50 transition-colors">
                    <td className="p-4 font-bold text-text-primary">Real-Time Unstructured NLP</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-center text-text-secondary">No</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-sm font-bold text-[#F59E0B]">Temporary Advantage</td>
                  </tr>
                  <tr className="border-b border-card-border hover:bg-panel/50 transition-colors bg-accent/5">
                    <td className="p-4 font-bold text-accent">Proprietary HSE Safety Vector DB</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-sm font-bold text-accent">Sustained Advantage</td>
                  </tr>
                  <tr className="border-b border-card-border hover:bg-panel/50 transition-colors">
                    <td className="p-4 font-bold text-text-primary">Mobile Data Capture Forms</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-center text-text-secondary">No</td>
                    <td className="p-4 text-center text-text-secondary">No</td>
                    <td className="p-4 text-center text-accent">Yes</td>
                    <td className="p-4 text-sm font-bold text-text-secondary">Competitive Parity</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-panel border border-card-border rounded-[24px] p-6 flex items-start gap-4">
              <Alert className="w-6 h-6 text-accent shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-text-primary mb-1">Strategic Takeaway</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Competitors like Intelex have Competitive Parity in basic mobile data capture. Our Sustained Competitive Advantage lies solely in our proprietary HSE Safety Vector DB and predictive modeling. We must focus all enterprise sales pitches entirely on predictive insights, refusing to compete on basic reporting features.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

    </div>
  );
}
