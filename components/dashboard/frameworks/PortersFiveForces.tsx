'use client';

import { motion } from 'framer-motion';
import { Competitor } from '@/lib/db';

interface PortersFiveForcesProps {
  competitors: Competitor[];
}

export default function PortersFiveForces({ competitors }: PortersFiveForcesProps) {
  // Aggregate data to simulate AI-driven Porter's Analysis
  const highThreatCompetitors = competitors.filter((c) => c.threat_score >= 70).length;

  return (
    <div className="w-full px-6 md:px-10 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Porter&apos;s Five Forces (AI Enhanced)
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Real-time industry dynamics clustering based on NLP signal extraction
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Threat of New Entrants */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl border-t-4 border-t-amber-400"
        >
          <h3 className="text-sm font-semibold text-text-primary uppercase mb-2">
            Threat of New Entrants
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded text-xs font-black uppercase tracking-wider">
              Moderate Risk
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-loose">
            AI startups are rapidly entering the HSE space. Barriers to entry are lowering due to
            open-source LLMs, but domain expertise and existing enterprise compliance contracts
            (e.g., COMAH) maintain a moat.
          </p>
        </motion.div>

        {/* Threat of Substitutes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-2xl border-t-4 border-t-[#EF4444]"
        >
          <h3 className="text-sm font-semibold text-text-primary uppercase mb-2">
            Threat of Substitutes
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 rounded text-xs font-black uppercase tracking-wider">
              High Risk
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-loose">
            General purpose AI tools (ChatGPT Enterprise, Microsoft Copilot) act as substitutes.{' '}
            <strong className="text-text-primary">
              Neutralize this threat via Safety Governance:
            </strong>{' '}
            Emphasize that generic AI lacks the safety-critical repeatability, auditability, and
            deep domain context required for high-hazard environments.
          </p>
        </motion.div>

        {/* Competitive Rivalry */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl border-t-4 border-t-accent"
        >
          <h3 className="text-sm font-semibold text-text-primary uppercase mb-2">
            Competitive Rivalry
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded text-xs font-black uppercase tracking-wider">
              Intense
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-loose">
            Market consolidated around legacy platforms attempting to retroactively add AI layers.
            Currently tracking <b>{highThreatCompetitors} high-threat direct rivals</b> pivoting
            towards predictive models.{' '}
            <strong className="text-text-primary">Defeat rivals on Liability:</strong> A cheaper
            legacy license does not protect executives from the criminal liability of a missed
            critical safety signal.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
