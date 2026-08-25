"use client";

import { motion } from 'framer-motion';
import { Eye, Radio, ArrowRight, Zap, Target } from 'lucide-react';
import Link from 'next/link';

export default function MarketingOverview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } },
  };

  return (
    <div className="w-full px-6 md:px-10 mb-16 max-w-[1600px] mx-auto">
      <div className="mb-10 border-b border-card-border/50 pb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight mb-2 flex items-center gap-3">
            <Zap className="h-7 w-7 text-[var(--color-primary)]" />
            Marketing & Client Acquisition
          </h2>
          <p className="text-base text-text-secondary max-w-3xl">
            Live pipeline of active CAI profiles, automated analytics, and global neural signals routing directly into the marketing engine.
          </p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* CAI Card */}
        <motion.div variants={itemVariants} className="bg-card border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between group hover:border-[var(--color-primary)]/30 transition-all">
          <div>
            <div className="h-12 w-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-6 border border-[var(--color-primary)]/20">
              <Target className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3">Client Acquisition (CAI)</h3>
            <p className="text-sm text-text-secondary leading-loose mb-6">
              AI-driven profiles automatically scoring leads based on HSE compliance and strategic entry points.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="bg-background/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary">BP plc</span>
                <span className="text-xs font-black text-[var(--color-primary)]">85/100 SCORE</span>
              </div>
              <div className="bg-background/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary">Shell</span>
                <span className="text-xs font-black text-[var(--color-primary)]">78/100 SCORE</span>
              </div>
            </div>
          </div>
          <Link href="/marketing/lead-scoring" className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
            Open CAI Pipeline <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Analytics Dashboard */}
        <motion.div variants={itemVariants} className="bg-card border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between group hover:border-blue-500/30 transition-all">
          <div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <Eye className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3">Analytics Dashboard</h3>
            <p className="text-sm text-text-secondary leading-loose mb-6">
              Strategic intelligence pipelines extracting structural events and converting them into actionable marketing themes.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-xs text-text-secondary font-mono">142 Events Extracted (24h)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-xs text-text-secondary font-mono">4 Strategic Themes Active</span>
              </div>
            </div>
          </div>
          <Link href="/marketing/market-analyst" className="flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
            View Analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Neural Signals Feed */}
        <motion.div variants={itemVariants} className="bg-card border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between group hover:border-red-500/30 transition-all">
          <div>
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
              <Radio className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-3">Neural Signals Feed</h3>
            <p className="text-sm text-text-secondary leading-loose mb-6">
              Live automated tracking of high-priority regulatory risks, Tier 1 incidents, and market signals.
            </p>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-2">CRITICAL THREATS</span>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-extrabold text-text-primary leading-none">2</span>
                <span className="text-xs text-text-secondary mb-1">Require immediate action</span>
              </div>
            </div>
          </div>
          <Link href="/marketing/threats" className="flex items-center gap-2 text-sm font-bold text-red-400 group-hover:translate-x-1 transition-transform">
            Monitor Signals <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
