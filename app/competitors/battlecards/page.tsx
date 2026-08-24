"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/ui/HeroSection';
import { SFShield as Shield, SFTarget as Target, SFFlame as Flame, SFCheckmarkCircle as Check } from 'sf-symbols-lib/monochrome';

const battlecards = [
  {
    id: 'sphera',
    name: 'Sphera',
    subtitle: 'The Legacy Incumbent',
    weaknesses: [
      "Rigid, template-based data entry with no real NLP.",
      "Requires heavy professional services for implementation.",
      "Cloud migration (SpheraCloud) is highly disruptive to existing clients."
    ],
    traps: [
      "The client may try to negotiate strictly on license cost.",
      "They will claim 'industry standard'. Ask them about their AI capabilities beyond basic dashboards."
    ],
    howToWin: [
      "Reframe the deal around executive liability, not license cost. Remind them that Sphera is just a 'System of Record' that logs accidents after they happen.",
      "Explain that BOOST predicts incidents before they occur. The cost of one missed weak signal dwarfs the software license fee.",
      "Demo Empirisys's instant contextual NLP without rigid templates."
    ]
  },
  {
    id: 'intelex',
    name: 'Intelex',
    subtitle: 'The Monolithic Suite',
    weaknesses: [
      "Clunky UI/UX that frustrates field workers.",
      "Extremely slow release cycles.",
      "Acquired by Fortive; innovation has stagnated."
    ],
    traps: [
      "They will sell the 'all-in-one' suite. Counter with 'best-in-class predictive AI'.",
      "They will heavily discount their license fee to retain clients. Do not engage in a price war."
    ],
    howToWin: [
      "Shift the conversation to Corporate Liability. A cheap license fee doesn't protect the HSE Director from criminal liability if a fatal incident occurs.",
      "Focus on predictive capabilities (stopping accidents before they happen) vs Intelex's reactive reporting.",
      "Show the Empirisys mobile-first data capture workflow."
    ]
  }
];

export default function SalesBattlecardsPage() {
  const [activeTab, setActiveTab] = useState('sphera');
  const activeCard = battlecards.find(c => c.id === activeTab)!;

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Sales Battlecards"
        subtitle="Tactical, on-the-ground intelligence for displacing legacy incumbents."
        moduleLabel="MODULE 01 COMPETITOR INTELLIGENCE"
        belowContent={
          <div className="flex gap-4 mt-4">
        {battlecards.map(card => (
          <button
            key={card.id}
            onClick={() => setActiveTab(card.id)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === card.id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-panel text-text-secondary hover:text-text-primary'}`}
          >
            {card.name}
          </button>
        ))}
          </div>
        }
      />

      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">
      {/* Battlecard Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Header Card */}
          <div className="col-span-1 md:col-span-3 bg-card/50 backdrop-blur-xl border border-card-border rounded-[24px] p-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">{activeCard.name}</h1>
              <p className="text-lg text-text-secondary">{activeCard.subtitle}</p>
            </div>
            <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center border border-accent/30">
              <Shield className="w-8 h-8 text-accent" />
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-[#EF4444]" />
              <h2 className="text-lg font-bold text-[#EF4444]">Known Weaknesses</h2>
            </div>
            <ul className="space-y-4">
              {activeCard.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-2 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Traps */}
          <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#F59E0B]" />
              <h2 className="text-lg font-bold text-[#F59E0B]">Competitor Traps</h2>
            </div>
            <ul className="space-y-4">
              {activeCard.traps.map((w, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-2 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* How to Win */}
          <div className="bg-accent/5 border border-accent/20 rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-accent">How to Win</h2>
            </div>
            <ul className="space-y-4">
              {activeCard.howToWin.map((w, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}
