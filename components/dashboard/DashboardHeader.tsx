"use client";
import Image from "next/image";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SFShield as Shield,
  SFExclamationmarkTriangle as AlertTriangle,
  SFXmark as X,
  SFChartLineUptrendXyaxis as Activity,
  SFDesktopcomputer as Bot,
  SFBolt as Zap,
  SFEye as Eye,
} from 'sf-symbols-lib/monochrome';
import { motion } from 'framer-motion';
import HeroSection from '@/components/ui/HeroSection';
import { cn } from '@/lib/utils';
import {
  Competitor,
  DiscoveryLog, TriggerEvent,
} from '@/lib/db';
import { ChartInfoButton } from '@/components/ui/ChartInfoButton';

// ── Animation variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 320, damping: 26 } },
};

// ── Types ────────────────────────────────────────────────────────────────────
interface DashboardHeaderProps {
  competitors: Competitor[];
  discoveryLogs: DiscoveryLog[];
  triggerEvents: TriggerEvent[];
  
}

type FlagVariant = 'red' | 'amber' | 'blue' | 'green';
interface CompetitorFlag { label: string; variant: FlagVariant }

type CompCluster = 'direct' | 'incumbent' | 'substitute';
type ActivitySourceType = 'FENNEX' | 'ENABLON' | 'INTERNAL' | 'DNV';

// ── Hardcoded Competitor Activity Feed (exact brief copy) ────────────────────
const COMP_ACTIVITY_FEED: Array<{
  id: string;
  source: ActivitySourceType;
  title: string;
  detail: string;
  time: string;
}> = [
  {
    id: 'cf1',
    source: 'FENNEX',
    title: 'Released new product iteration — increasing UI complexity.',
    detail: 'LLM Categorization: Feature sprawl signal detected · Embedding Step: UI complexity index rising · Clustering: 3 overlapping module releases',
    time: '2 hours ago',
  },
  {
    id: 'cf2',
    source: 'ENABLON',
    title: 'Published quarterly report — still entirely retrospective data.',
    detail: 'Clustering: Zero predictive AI indicators in filing · Embedding distance from BOOST: 0.95 · Retrospective capture pattern reconfirmed',
    time: '5 hours ago',
  },
  {
    id: 'cf3',
    source: 'INTERNAL',
    title: 'Client X attempted DIY AI for safety logs — project failed due to security compliance.',
    detail: 'LLM Categorization: Substitute threat neutralised · Compliance gap: COMAH security audit failed · Re-engagement signal: High',
    time: '1 day ago',
  },
  {
    id: 'cf4',
    source: 'DNV',
    title: 'Announced new consulting partnership in Middle East.',
    detail: 'Cluster: Geographic expansion event · UK account resource dilution risk detected · Consulting gap widening: opportunity window open',
    time: '1 day ago',
  },
];

// ── Direct Rivals extra metrics ───────────────────────────────────────────────
interface RivalMetrics { sprawl: number; sprawlLabel: string; gap: number; gapLabel: string }

function getDirectRivalMetrics(name: string): RivalMetrics | null {
  const n = name.toLowerCase();
  if (n.includes('fennex') || n.includes('fenx')) return {
    sprawl: 72,
    sprawlLabel: 'High — scattered feature set, poor UX coherence',
    gap: 18,
    gapLabel: 'Low — no dedicated advisory layer',
  };
  if (n.includes('dnv') || n.includes('synergi')) return {
    sprawl: 55,
    sprawlLabel: 'Medium — legacy module sprawl across Synergi Life',
    gap: 88,
    gapLabel: 'High — consulting-led with weak SaaS transition',
  };
  return null;
}

// ── Cluster assignment ────────────────────────────────────────────────────────
function clusterForCompetitor(comp: Competitor): CompCluster {
  const n = comp.name.toLowerCase();
  if (n.includes('copilot') || n.includes('internal') || n.includes('diy')) return 'substitute';
  if (n.includes('fennex') || n.includes('fenx') || n.includes('dnv') || n.includes('synergi')) return 'direct';
  return 'incumbent';
}

// ── Competitor Intel Flags ────────────────────────────────────────────────────
function getCompetitorFlags(name: string): CompetitorFlag[] {
  const n = name.toLowerCase();
  if (n.includes('fennex') || n.includes('fenx')) return [
    { label: 'Product Sprawl Risk', variant: 'amber' },
    { label: 'Unverified LLM Depth', variant: 'amber' },
    { label: 'High Eng Churn (Sentiment)', variant: 'red' },
  ];
  if (n.includes('dnv') || n.includes('synergi')) return [
    { label: 'Consulting Gap', variant: 'amber' },
    { label: 'SaaS Transition Risk', variant: 'amber' },
  ];
  if (n.includes('enablon')) return [
    { label: 'Retrospective Only', variant: 'blue' },
    { label: 'No Predictive AI', variant: 'blue' },
    { label: 'Poor Glassdoor Reviews', variant: 'amber' },
  ];
  if (n.includes('eobs')) return [
    { label: 'Partner / Adjacent Route', variant: 'green' },
  ];
  if (n.includes('copilot') || n.includes('internal') || n.includes('diy')) return [
    { label: 'High Security Risk', variant: 'red' },
    { label: 'Unauditable', variant: 'red' },
    { label: 'One-Off Prompting', variant: 'red' },
  ];
  return [{ label: 'Retrospective Only', variant: 'blue' }];
}

// ── Threat gradient config ────────────────────────────────────────────────────
function getThreatConfig(score: number) {
  if (score >= 90) return { border: 'border-t-[#EF4444]', badge: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', dot: 'bg-[#EF4444]', bar: '#EF4444', label: 'Critical' };
  if (score >= 75) return { border: 'border-t-amber-400', badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20', dot: 'bg-amber-400', bar: '#FBBF24', label: 'High' };
  if (score >= 55) return { border: 'border-t-accent', badge: 'bg-accent/10 text-accent border-accent/20', dot: 'bg-accent', bar: 'var(--accent)', label: 'Medium' };
  return { border: 'border-t-card-border', badge: 'bg-card/50 text-text-secondary border-card-border', dot: 'bg-text-secondary/30', bar: '#6B7280', label: 'Low' };
}

function getActivityStyle(source: ActivitySourceType) {
  if (source === 'INTERNAL') return { badge: 'bg-[#EF4444]/12 text-[#EF4444] border-[#EF4444]/25', accent: '#EF4444' };
  if (source === 'FENNEX') return { badge: 'bg-amber-400/12 text-amber-400 border-amber-400/25', accent: '#FBBF24' };
  if (source === 'DNV')    return { badge: 'bg-amber-400/12 text-amber-400 border-amber-400/25', accent: '#FBBF24' };
  return { badge: 'bg-blue-400/12 text-blue-400 border-blue-400/25', accent: '#60A5FA' };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function CapDot({ val }: { val: 'yes' | 'partial' | 'no' }) {
  return (
    <span className={cn(
      'inline-block h-2 w-2 rounded-full',
      val === 'yes' ? 'bg-accent' : val === 'partial' ? 'bg-amber-400' : 'bg-[#EF4444]',
    )} />
  );
}

function FlagPill({ label, variant }: CompetitorFlag) {
  return (
    <span className={cn(
      'inline-flex items-center px-1.5 py-0.5 rounded text-sm font-bold uppercase tracking-wide border leading-none whitespace-nowrap',
      variant === 'red'   ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
      variant === 'amber' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
      variant === 'blue'  ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                            'bg-accent/10 text-accent border-accent/20',
    )}>
      {label}
    </span>
  );
}

function MetricBar({ label, value, sublabel, color }: { label: string; value: number; sublabel: string; color: string }) {
  return (
    <div className="space-y-3.5">
      <div className="flex justify-between items-center text-base">
        <span className="font-bold text-text-secondary uppercase tracking-wider font-mono">{label}</span>
        <span className="font-black text-text-primary">{value} / 100</span>
      </div>
      <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <p className="text-sm text-text-secondary italic leading-snug">{sublabel}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardHeader({
  competitors,
  discoveryLogs,
  triggerEvents,
  
}: DashboardHeaderProps) {
  const router = useRouter();
  const [dismissedAlert, setDismissedAlert] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour >= 5  && hour < 12 ? 'Good morning' :
    hour >= 12 && hour < 17 ? 'Good afternoon' :
    hour >= 17 && hour < 22 ? 'Good evening' : 'End of the day';

  const currentDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());

  const sortedCompetitors = [...competitors].sort((a, b) => b.threat_score - a.threat_score);

  // Cluster partitions
  const directRivals  = sortedCompetitors.filter(c => clusterForCompetitor(c) === 'direct');
  const incumbents    = sortedCompetitors.filter(c => clusterForCompetitor(c) === 'incumbent');
  const substitutes   = sortedCompetitors.filter(c => clusterForCompetitor(c) === 'substitute');

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes feed-in {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ── Live Trigger Events Ticker ──────────────────────────────────── */}
      <div className="w-full bg-background/95 backdrop-blur-md border-b border-card-border">
        <div className="flex items-stretch">
          <div className="flex-shrink-0 px-4 py-2 bg-[#EF4444]/6 border-r border-[#EF4444]/15 flex items-center gap-4">
            <Zap className="h-3 w-3 text-[#EF4444]" />
            <span className="text-base font-black text-[#EF4444] uppercase tracking-widest whitespace-nowrap">Live Triggers</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div
              className="flex items-center gap-10 py-2 w-max"
              style={{ animation: 'ticker-scroll 55s linear infinite' }}
            >
              {[...triggerEvents, ...triggerEvents].map((event, i) => (
                <div key={i} className="flex items-center gap-4.5 whitespace-nowrap">
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-sm font-black uppercase tracking-wider border',
                    event.severity === 'Critical' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                    event.severity === 'High'     ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                                                    'bg-accent/10 text-accent border-accent/20',
                  )}>
                    {event.severity}
                  </span>
                  <span className="text-base font-medium text-text-primary">{event.title}</span>
                  <span className="text-base text-text-secondary">{event.source} · {event.published_at}</span>
                  <span className="text-card-border mx-1">│</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero: greeting + tabs + de-emphasised agent controls ────────── */}
      <HeroSection
        title={
          <span className="flex flex-col gap-1 text-left">
            <span className="flex items-center gap-4">
              <span>{greeting},</span>
              <span className="text-accent italic font-serif">Empirisys.</span>
            </span>
          </span>
        }
        subtitle={currentDate}
        belowContent={
          <div className="w-full flex justify-end gap-6 mt-8">
            <div className="flex items-center gap-4 pb-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/40 border border-card-border">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-base font-bold text-text-secondary uppercase tracking-widest">Agent Sync Active</span>
              </div>
              <Link
                href="/assistant"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/40 hover:bg-accent/8 border border-card-border hover:border-accent/25 text-base font-bold text-text-secondary hover:text-accent transition-all"
              >
                <Bot className="h-3 w-3" />
                <span>Ask Assistant</span>
              </Link>
            </div>
          </div>
        }
      >
        {discoveryLogs.length > 0 && !dismissedAlert && (
          <div className="bg-accent/8 border border-accent/25 rounded-xl p-6 flex items-center justify-between mt-4 w-full">
            <div className="flex items-center gap-5">
              <div className="p-2 bg-accent/15 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">
                  {discoveryLogs.length} new competitor{discoveryLogs.length > 1 ? 's' : ''} detected in the trailing 7 days.
                </p>
                <Link href="/competitors" className="text-lg text-accent hover:text-accent/80 font-bold mt-0.5 inline-block">
                  Review emerging threats &rarr;
                </Link>
              </div>
            </div>
            <button onClick={() => setDismissedAlert(true)} className="text-text-secondary hover:text-text-primary p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </HeroSection>

      
      {/* ── BENTO BOX GRID ──────────────────────────────────────────────── */}
      <div className="w-full px-4 md:px-8 pb-12 max-w-[1800px] mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-5">
          
          {/* 1. KPIs (1 column each) */}
          {[
            {
              title: 'Direct Rival Threat',
              val: directRivals[0]?.threat_score ?? 95,
              sub: (directRivals[0]?.name.split(' ')[0] ?? 'FENNEX') + ' — highest direct risk',
              icon: Shield,
              danger: true,
            },
            {
              title: 'Competitor Clusters',
              val: competitors.length || 10,
              sub: `${directRivals.length} direct · ${incumbents.length} incumbent · ${substitutes.length} substitute`,
              icon: Activity,
              danger: false,
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="col-span-1 glass-card p-6 rounded-3xl border border-white/5 hover:bg-white/[0.02] transition-colors flex flex-col justify-between min-h-[160px]"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest leading-tight">{card.title}</p>
                  <div className={cn('p-2 rounded-xl shrink-0', card.danger ? 'bg-[#EF4444]/10 text-[#EF4444]' : 'bg-accent/10 text-accent')}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <p className="text-5xl font-black text-text-primary leading-none tracking-tight font-sans mb-2">{card.val}</p>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed">{card.sub}</p>
                </div>
              </motion.div>
            );
          })}

          {/* 2. Direct Rivals (Span 2) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 xl:col-span-2 glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Direct Rivals</h3>
                  <div className="ml-2"><ChartInfoButton title="Direct Rivals" description="Identifies competitors actively contesting your target accounts, highlighting product sprawl and capability gaps." /></div>
                </div>
                <span className="text-xs font-bold tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-md uppercase">{directRivals.length} tracked</span>
             </div>
             <div className="space-y-4 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
               {directRivals.map((comp) => {
                 const threat = getThreatConfig(comp.threat_score);
                 return (
                   <div key={comp.id} className="bg-background/40 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors">
                     <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-accent/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
                           <img
                             src={comp.logoUrl ?? `https://www.google.com/s2/favicons?domain=${(comp.website || '').replace('https://', '').split('/')[0]}&sz=64`}
                             alt={comp.name}
                             className="w-full h-full object-contain absolute inset-0 z-10"
                             onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                           />
                           <span className="absolute inset-0 flex items-center justify-center text-accent text-sm font-black z-0">
                             {comp.name.slice(0, 2).toUpperCase()}
                           </span>
                         </div>
                         <div>
                           <p className="text-lg font-bold text-text-primary leading-tight">{comp.name}</p>
                           <p className="text-xs text-text-secondary mt-0.5">{comp.hq}</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="text-2xl font-black text-text-primary">{comp.threat_score}</span>
                         <span className="text-xs text-text-secondary block">Score</span>
                       </div>
                     </div>
                     <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                       <div className="h-full rounded-full transition-all" style={{ width: `${comp.threat_score}%`, backgroundColor: threat.bar }} />
                     </div>
                   </div>
                 );
               })}
             </div>
          </motion.div>

          {/* 3. Activity Feed (Span 2) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 xl:col-span-2 glass-card rounded-3xl border border-white/5 flex flex-col overflow-hidden max-h-[500px]">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Competitor Activity Feed</h3>
                <div className="ml-2"><ChartInfoButton title="Competitor Activity Feed" description="Real-time ingestion of competitor press releases, product updates, and client signals categorized by LLM." /></div>
              </div>
              <span className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="divide-y divide-white/5 overflow-y-auto flex-1 custom-scrollbar">
              {COMP_ACTIVITY_FEED.map((item) => {
                const style = getActivityStyle(item.source);
                return (
                  <div key={item.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className={cn('px-2 py-1 rounded text-xs font-bold uppercase tracking-wider', style.badge, 'border-0')}>
                        {item.source}
                      </span>
                      <span className="text-xs text-text-secondary">{item.time}</span>
                    </div>
                    <p className="text-base font-bold text-text-primary leading-snug mb-2">{item.title}</p>
                    <p className="text-xs text-text-secondary leading-relaxed font-mono">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 4. Incumbents (Span 2) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 xl:col-span-2 glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Incumbent Systems</h3>
                  <div className="ml-2"><ChartInfoButton title="Incumbent Systems" description="Legacy capture platforms vulnerable to disruption by predictive AI models. Highly likely to contain retrospective data only." /></div>
                </div>
                <span className="text-xs font-bold tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded-md uppercase">{incumbents.length} tracked</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
               {incumbents.map((comp) => {
                 const threat = getThreatConfig(comp.threat_score);
                 return (
                   <div key={comp.id} className="bg-background/40 border border-white/5 rounded-2xl p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-blue-400/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
                         <Image src={comp.logoUrl || ""} alt={comp.name} fill sizes="32px" className="w-full h-full object-contain absolute inset-0 z-10" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                         <span className="absolute inset-0 flex items-center justify-center text-blue-400 text-xs font-black z-0">{comp.name.slice(0, 2).toUpperCase()}</span>
                       </div>
                       <p className="text-sm font-bold text-text-primary leading-tight">{comp.name}</p>
                     </div>
                     <span className="text-lg font-black text-text-primary">{comp.threat_score}</span>
                   </div>
                 );
               })}
             </div>
          </motion.div>

          {/* 5. Pain Points (Span 2) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 xl:col-span-2 glass-card rounded-3xl border border-white/5 flex flex-col overflow-hidden max-h-[400px]">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">HSE Pain Points</h3>
                <div className="ml-2"><ChartInfoButton title="HSE Pain Points" description="Industry-wide Health, Safety, and Environment events or regulatory shifts that create immediate demand for Empirisys." /></div>
              </div>
              <span className="text-xs font-bold text-text-secondary">{triggerEvents.length} active</span>
            </div>
            <div className="divide-y divide-white/5 overflow-y-auto flex-1 custom-scrollbar">
              {triggerEvents.map((event) => (
                <div key={event.id} className="p-6 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                  <span className={cn(
                    'mt-0.5 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider',
                    event.severity === 'Critical' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                    event.severity === 'High'     ? 'bg-amber-400/10 text-amber-400' :
                                                    'bg-accent/10 text-accent',
                  )}>
                    {event.severity}
                  </span>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-sm font-bold text-text-primary leading-snug">{event.title}</p>
                    <p className="text-xs text-accent font-semibold italic">{event.why_relevant}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 6. Substitutes (Span 2) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 xl:col-span-2 glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#EF4444]" />
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Substitute Threats</h3>
                  <div className="ml-2"><ChartInfoButton title="Substitute Threats" description="DIY AI initiatives, internal toolings, or generic copilots that pose high security risks and lack auditability." /></div>
                </div>
                <span className="text-xs font-bold tracking-widest text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-2 py-1 rounded-md uppercase">{substitutes.length} tracked</span>
             </div>
             <div className="space-y-4 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
               {substitutes.map((comp) => {
                 const threat = getThreatConfig(comp.threat_score);
                 return (
                   <div key={comp.id} className="bg-background/40 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors">
                     <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-[#EF4444]/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
                           <span className="absolute inset-0 flex items-center justify-center text-[#EF4444] text-sm font-black z-0">
                             {comp.name.slice(0, 2).toUpperCase()}
                           </span>
                         </div>
                         <div>
                           <p className="text-lg font-bold text-text-primary leading-tight">{comp.name}</p>
                           <p className="text-xs text-[#EF4444] mt-0.5 font-bold uppercase tracking-wider">{threat.label} RISK</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="text-2xl font-black text-[#EF4444]">{comp.threat_score}</span>
                       </div>
                     </div>
                     <p className="text-xs text-text-secondary font-mono leading-relaxed">{comp.description}</p>
                   </div>
                 );
               })}
             </div>
          </motion.div>

          {/* 7. Battlecards (Span 2) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 xl:col-span-2 glass-card p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col">
             <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Sales Battlecards</h3>
                <div className="ml-2"><ChartInfoButton title="Sales Battlecards" description="Instant tactical kill-sheets outlining specific weaknesses and counter-arguments against major competitors to help sales win deals." /></div>
             </div>
             <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
               {[
                 { comp: 'FENNEX', counter: 'Emphasize our consulting advisory layer and complain about their UI complexity.', model: 'Complex SaaS Modules' },
                 { comp: 'ENABLON', counter: 'Highlight predictive AI. Enablon is a legacy system of record.', model: 'Legacy Enterprise License' },
                 { comp: 'DIY AI / COPILOT', counter: 'Attack on security and auditability. Copilot prompts are not repeatable.', model: 'Hidden Compute/Risk Costs' }
               ].map(bc => (
                 <div key={bc.comp} className="bg-background/40 border border-white/5 rounded-2xl p-5">
                   <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{bc.comp}</h4>
                   <p className="text-sm text-accent leading-relaxed font-semibold italic">{bc.counter}</p>
                 </div>
               ))}
             </div>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}
