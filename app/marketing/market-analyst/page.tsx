"use client";

import { motion } from "framer-motion";

import React, { useState } from "react";
import HeroSection from "@/components/ui/HeroSection";
import { Button } from "@/components/ui/Button";
import { FunFactLoader } from "@/components/ui/FunFactLoader";
import {
  Loader2,
  Zap,
  CheckCircle2,
  XCircle,
  Shield,
  Activity,
  Network,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Map,
  Clock,
  Target,
} from "lucide-react";
import { toast } from "@/components/ui/toaster";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  ZAxis,
  Legend
} from "recharts";
// ─── Types matching pipeline output ───
interface MarketEvent {
  id: string;
  entityName: string;
  entityType: string;
  eventType: string;
  steepleCategory: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  sourceTier: string;
  geography: string;
  sector: string;
  eventDate: string;
  relevanceScore: number;
  evidenceStrength: number;
  confirmationCount: number;
  isDuplicate: boolean;
  lifecycleStatus: string;
}

interface AggregatedTheme {
  id: string;
  title: string;
  description: string;
  events: MarketEvent[];
  interpretation: {
    impact: string;
    relevantProduct: string;
    suggestedAction: string;
    scenarioForecasts: {
      bearCase: string;
      baseCase: string;
      bullCase: string;
    };
    stakeholderViews: {
      ceoSummary: string;
      ctoSummary: string;
    };
    vrioAnalysis: {
      valuable: string;
      rare: string;
      inimitable: string;
      organization: string;
      competitiveImplication: string;
    };
  };
  status: string;
  deltaStatus: string;
  relevanceScore: number;
  timestamp: string;
}

export interface QuantitativeMetrics {
  trendVelocity: any[];
  competitorPositioning: any[];
  budgetAllocation: any[];
}

interface MarketSegment {
  id: string;
  name: string;
  geography: string;
  readiness: 'high' | 'medium' | 'low';
  trigger: { name: string; value: string; deadline: string; };
  mechanism: string;
  entryBarriers: string;
  bestFitProduct: string;
  squeezeOpportunity: string;
}

interface GrowthAction {
  action: string;
  segment: string;
  rationale: string;
}

interface GrowthHorizon {
  id: 'now' | 'next' | 'later';
  label: string;
  timeframe: string;
  actions: GrowthAction[];
}

interface MarketLandscape {
  segments: MarketSegment[];
  horizons: GrowthHorizon[];
  strategicPrecondition: string;
  landscapeSummary: string;
}

interface PipelineResult {
  events: MarketEvent[];
  themes: AggregatedTheme[];
  metrics: QuantitativeMetrics;
  landscape: MarketLandscape | null;
  meta: {
    totalEventsExtracted: number;
    totalThemes: number;
    totalSegments: number;
    generatedAt: string;
  };
}

// ─── Framer Motion Variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 70, damping: 15 }
  }
} as const;

// ─── Tier badge colors ───
const tierColors: Record<string, { bg: string; text: string; label: string }> = {
  A: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", label: "Tier A · Regulatory" },
  B: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-600 dark:text-blue-400", label: "Tier B · Procurement" },
  C: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600 dark:text-amber-400", label: "Tier C · Trade Press" },
  D: { bg: "bg-panel0/10 border-zinc-500/20", text: "text-text-secondary", label: "Tier D · Business Press" },
};

const deltaLabels: Record<string, { color: string; icon: React.ReactNode }> = {
  new: { color: "text-emerald-500 bg-emerald-500/10", icon: <Zap className="h-3 w-3" /> },
  intensified: { color: "text-red-500 bg-red-500/10", icon: <AlertTriangle className="h-3 w-3" /> },
  faded: { color: "text-text-secondary bg-card-border/50", icon: <ChevronDown className="h-3 w-3" /> },
  stable: { color: "text-blue-500 bg-blue-500/10", icon: <Activity className="h-3 w-3" /> },
};

const eventTypeLabels: Record<string, string> = {
  incident: "🔴 Incident",
  contract_award: "💰 Contract Award",
  regulatory_action: "📋 Regulatory Action",
  m_and_a: "🤝 M&A",
  leadership_change: "👤 Leadership Change",
  product_launch: "🚀 Product Launch",
  partnership: "🔗 Partnership",
  capex_announcement: "📊 Capex Announcement",
};

// ─── Component ───
export default function MarketAnalystPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [activeView, setActiveView] = useState<"dashboard" | "themes" | "events" | "landscape">("dashboard");
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);
  const [validationState, setValidationState] = useState<Record<string, string>>({});

  const handleRunPipeline = async () => {
    setIsLoading(true);
    setResult(null);
    setValidationState({});

    try {
      const res = await fetch("/api/agent/market-analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.error === "ANTHROPIC_API_KEY_MISSING") {
          throw new Error(
            "ANTHROPIC_API_KEY is not configured on the server, so the pipeline cannot run.",
          );
        }
        throw new Error(body?.detail || `Pipeline failed (HTTP ${res.status})`);
      }

      const data: PipelineResult = await res.json();
      setResult(data);
      toast({
        title: "Pipeline Complete",
        description: `Extracted ${data.meta.totalEventsExtracted} events → ${data.meta.totalThemes} themes`,
      });
    } catch (e: unknown) {
      console.error(e);
      toast({
        title: "Pipeline Error",
        description:
          e instanceof Error
            ? e.message
            : "Failed to execute the intelligence pipeline. Check console.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = (themeId: string, action: "approved" | "rejected") => {
    setValidationState((prev) => ({ ...prev, [themeId]: action }));
    toast({
      title: action === "approved" ? "Theme Approved" : "Theme Rejected",
      description: `Theme has been ${action} and logged for feedback calibration.`,
    });
  };

  const pendingThemes = result?.themes.filter(
    (t) => (validationState[t.id] || t.status) === "pending_review"
  ) ?? [];
  const processedThemes = result?.themes.filter(
    (t) => (validationState[t.id] || t.status) !== "pending_review"
  ) ?? [];

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Analytics Dashboard"
        subtitle="Event-driven intelligence pipeline: Source Ingestion → Entity Extraction → Deterministic Scoring → Theme Aggregation → Strategic Interpretation"
        moduleLabel="MARKETING INTELLIGENCE"
        belowContent={
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={handleRunPipeline}
              disabled={isLoading}
              className="rounded-full bg-accent text-text-primary hover:bg-accent/80 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.2)] transition-all duration-300 px-6 h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Pipeline...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4 fill-current" />
                  Run Intelligence Pipeline
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Main Content Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20"
      >

      {/* Loading State */}
      {isLoading && (
        <div className="animate-in fade-in duration-300">
          <FunFactLoader message="Executing Market Intelligence Pipeline..." />
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* KPI Strip */}
          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Events Extracted", value: result.meta.totalEventsExtracted, bg: "bg-[var(--color-primary)]/10", border: "border-[var(--color-primary)]/20", color: "text-text-primary" },
              { label: "Themes Identified", value: result.meta.totalThemes, bg: "bg-[var(--color-primary)]/10", border: "border-[var(--color-primary)]/20", color: "text-text-primary" },
              { label: "Segments Found", value: result.meta.totalSegments, bg: "bg-emerald-500/10", border: "border-emerald-500/20", color: "text-emerald-500" },
              { label: "Pending Review", value: pendingThemes.length, bg: "bg-amber-500/10", border: "border-amber-500/20", color: "text-amber-500" },
              { label: "Pipeline Run", value: new Date(result.meta.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), bg: "bg-panel0/10", border: "border-zinc-500/20", color: "text-text-primary", textClass: "text-sm mt-2" }
            ].map((kpi, i) => (
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                key={i} 
                className={`bg-card/40 backdrop-blur-md/80 backdrop-blur-md rounded-2xl p-5 border ${kpi.border} shadow-lg shadow-sm relative overflow-hidden group`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 ${kpi.bg} rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-widest text-text-secondary  uppercase">{kpi.label}</span>
                  <div className={`${kpi.textClass || 'text-3xl mt-1'} font-bold ${kpi.color}`}>{kpi.value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View Toggle */}
          <div className="flex bg-panel p-1.5 rounded-full border border-card-border w-fit">
            <button
              onClick={() => setActiveView("dashboard")}
              className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                activeView === "dashboard"
                  ? "bg-[var(--color-primary)] text-text-alert text-text-primary shadow-lg"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Activity className="h-3.5 w-3.5 inline mr-1.5" />
              Strategic Dashboard
            </button>
            <button
              onClick={() => setActiveView("themes")}
              className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                activeView === "themes"
                  ? "bg-[var(--color-primary)] text-text-alert text-text-primary shadow-lg"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Shield className="h-3.5 w-3.5 inline mr-1.5" />
              Strategic Themes ({result.themes.length})
            </button>
            <button
              onClick={() => setActiveView("events")}
              className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                activeView === "events"
                  ? "bg-[var(--color-primary)] text-text-alert text-text-primary shadow-lg"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Network className="h-3.5 w-3.5 inline mr-1.5" />
              Event Feed ({result.events.length})
            </button>
            <button
              onClick={() => setActiveView("landscape")}
              className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                activeView === "landscape"
                  ? "bg-[var(--color-primary)] text-text-alert text-text-primary shadow-lg"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Map className="h-3.5 w-3.5 inline mr-1.5" />
              Market Landscape
            </button>
          </div>

          {/* ═══════════════ DASHBOARD VIEW ═══════════════ */}
          {activeView === "dashboard" && result.metrics && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Budget Allocation (Donut) */}
                <motion.div variants={itemVariants} className="bg-card backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-card-border shadow-xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <h3 className="text-lg font-bold text-text-primary mb-6 uppercase tracking-wider flex items-center gap-2 relative z-10">
                    <Network className="h-5 w-5 text-emerald-500" /> Budget CapEx Allocation
                  </h3>
                  <div className="h-[300px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.metrics.budgetAllocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="allocationPercentage"
                          nameKey="category"
                          stroke="none"
                          cornerRadius={8}
                        >
                          {result.metrics.budgetAllocation.map((entry: any, index: number) => {
                            const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} style={{ filter: `drop-shadow(0px 0px 8px ${colors[index % colors.length]}40)` }} />;
                          })}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(26,21,37,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 500 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Competitor Positioning Matrix */}
                <motion.div variants={itemVariants} className="bg-card backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-card-border shadow-xl shadow-sm relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>
                  <h3 className="text-lg font-bold text-text-primary mb-6 uppercase tracking-wider flex items-center gap-2 relative z-10">
                    <Shield className="h-5 w-5 text-[var(--color-primary)]" /> Competitive Positioning Matrix
                  </h3>
                  <div className="h-[300px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.15} />
                        <XAxis type="number" dataKey="marketShareScore" name="Market Share" domain={[0, 100]} stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis type="number" dataKey="innovationScore" name="Innovation" domain={[0, 100]} stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                        <ZAxis type="category" dataKey="competitorName" name="Competitor" />
                        <Tooltip cursor={{ strokeDasharray: '3 3', opacity: 0.1 }} 
                          contentStyle={{ backgroundColor: 'rgba(26,21,37,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                          itemStyle={{ color: '#fff' }}
                        />
                        <Scatter name="Competitors" data={result.metrics.competitorPositioning} fill="#8b5cf6">
                          {result.metrics.competitorPositioning.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.competitorName === 'Empirisys' ? '#06b6d4' : '#8b5cf6'} style={{ filter: `drop-shadow(0px 0px 10px ${entry.competitorName === 'Empirisys' ? '#06b6d4' : '#8b5cf6'})` }} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
              
              {/* STEEPLE Trend Velocity (Full Width, Below) */}
              <motion.div variants={itemVariants} className="bg-card backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-card-border shadow-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="text-lg font-bold text-text-primary mb-8 uppercase tracking-wider flex items-center gap-2 relative z-10">
                  <Activity className="h-5 w-5 text-[var(--color-primary)]" /> STEEPLE Trend Velocity (7 Days)
                </h3>
                <div className="h-[400px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.metrics.trendVelocity.map((d: any) => {
                      let dataObj = d;
                      let dayStr = d.day || d.Day || '';
                      
                      // Handle LLM sometimes nesting data like { "Mon": { sociocultural: 5, ... } }
                      if (!d.day && !d.Day) {
                        const keys = Object.keys(d);
                        if (keys.length === 1 && typeof d[keys[0]] === 'object') {
                           dayStr = keys[0];
                           dataObj = d[keys[0]];
                        }
                      }

                      const normalize = (keys: string[]) => {
                        for (const k of keys) { if (dataObj[k] !== undefined) return dataObj[k]; }
                        return 0;
                      };
                      
                      return {
                        day: dayStr,
                        sociocultural: normalize(['sociocultural', 'Sociocultural', 'socio-cultural', 'Socio-cultural', 'socio_cultural']),
                        technological: normalize(['technological', 'Technological']),
                        economic: normalize(['economic', 'Economic']),
                        environmental: normalize(['environmental', 'Environmental']),
                        political: normalize(['political', 'Political']),
                        legal: normalize(['legal', 'Legal']),
                        ethical: normalize(['ethical', 'Ethical']),
                      };
                    })}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.15} />
                      <XAxis dataKey="day" stroke="#a1a1aa" fontSize={13} fontWeight={500} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#a1a1aa" fontSize={13} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(26,21,37,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontSize: '13px' }}
                        labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', marginBottom: '8px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '20px', fontWeight: 500 }} />
                      <Line type="monotone" dataKey="sociocultural" stroke="#f472b6" strokeWidth={3} name="Socio-cultural" dot={{ r: 4, fill: '#f472b6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#f472b6', strokeWidth: 2, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="technological" stroke="#3b82f6" strokeWidth={3} name="Technological" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="economic" stroke="#f59e0b" strokeWidth={3} name="Economic" dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="environmental" stroke="#10b981" strokeWidth={3} name="Environmental" dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="political" stroke="#a78bfa" strokeWidth={3} name="Political" dot={{ r: 4, fill: '#a78bfa', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#a78bfa', strokeWidth: 2, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="legal" stroke="#ef4444" strokeWidth={3} name="Legal" dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="ethical" stroke="#06b6d4" strokeWidth={3} name="Ethical" dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

            </motion.div>
          )}

          {/* ═══════════════ THEMES VIEW ═══════════════ */}
          {activeView === "themes" && (
            <div className="space-y-4">
              {/* Pending Review Section */}
              {pendingThemes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Pending Analyst Review ({pendingThemes.length})
                  </h3>
                  {pendingThemes.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      expanded={expandedTheme === theme.id}
                      onToggle={() => setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
                      onValidate={handleValidate}
                      isPending
                    />
                  ))}
                </div>
              )}

              {/* Processed Themes */}
              {processedThemes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-text-secondary  uppercase tracking-wider mt-6">
                    Processed Themes ({processedThemes.length})
                  </h3>
                  {processedThemes.map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      validationOverride={validationState[theme.id]}
                      expanded={expandedTheme === theme.id}
                      onToggle={() => setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
                      onValidate={handleValidate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ EVENTS VIEW ═══════════════ */}
          {activeView === "events" && (
            <div className="space-y-3">
              {result.events.map((event, idx) => (
                <div
                  key={event.id}
                  className="bg-card/40 backdrop-blur-md rounded-2xl p-5 border border-card-border flex gap-4 animate-in fade-in duration-300"
                  style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
                >
                  {/* Tier Badge */}
                  <div className="shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase ${tierColors[event.sourceTier]?.bg} ${tierColors[event.sourceTier]?.text}`}>
                      {event.sourceTier}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-[14px] font-bold text-text-primary leading-tight">
                        {event.title}
                      </h4>
                      <span className="text-[10px] text-text-secondary shrink-0 whitespace-nowrap">
                        {eventTypeLabels[event.eventType] || event.eventType}
                      </span>
                    </div>
                    <p className="text-[12px] text-text-secondary mb-3 line-clamp-2">
                      {event.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="text-text-secondary">
                        📍 {event.geography} · {event.sector}
                      </span>
                      <span className="text-text-secondary">
                        🏢 {event.entityName}
                      </span>
                      <span className="text-text-secondary">
                        📰 {event.sourceName}
                      </span>
                      <span className="px-2 py-0.5 rounded border border-card-border bg-panel text-text-secondary  font-medium">
                        {event.steepleCategory}
                      </span>
                      <div className="flex gap-2 ml-auto">
                        <span className="px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold">
                          Rel: {event.relevanceScore}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold">
                          Evd: {event.evidenceStrength}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══════════════ MARKET LANDSCAPE VIEW ═══════════════ */}
          {activeView === "landscape" && result.landscape && (
            <div className="space-y-6">

              {/* Landscape Summary */}
              <div className="bg-card/60 border border-card-border rounded-2xl p-8 text-text-primary shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-card-border rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-card/50 backdrop-blur-md text-[11px] font-bold tracking-widest uppercase flex items-center">
                      <Map className="h-3 w-3 mr-1.5" /> Market Landscape
                    </span>
                  </div>
                  <p className="text-[16px] leading-relaxed font-medium max-w-4xl">
                    {result.landscape.landscapeSummary}
                  </p>
                </div>
              </div>

              {/* Strategic Precondition Banner */}
              {result.landscape.strategicPrecondition && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-amber-500/10 shrink-0 mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase block mb-1">
                      Strategic Precondition — Must Solve First
                    </span>
                    <p className="text-[14px] text-text-primary  font-medium leading-relaxed">
                      {result.landscape.strategicPrecondition}
                    </p>
                  </div>
                </div>
              )}

              {/* Market Segments — Dynamically Discovered */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-500" /> Discovered Market Segments ({result.landscape.segments.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.landscape.segments.map((segment, idx) => {
                    const readinessConfig = {
                      high: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", label: "🟢 High Readiness" },
                      medium: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600 dark:text-amber-400", label: "🟡 Medium Readiness" },
                      low: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-600 dark:text-red-400", label: "🔴 Low Readiness" },
                    };
                    const config = readinessConfig[segment.readiness] || readinessConfig.medium;

                    return (
                      <div
                        key={segment.id || idx}
                        className="bg-card/40 backdrop-blur-md rounded-2xl p-6 border border-card-border hover:shadow-xl transition-shadow duration-300 animate-in fade-in duration-300 relative overflow-hidden"
                        style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-[16px] font-bold text-text-primary mb-1">
                              {segment.name}
                            </h4>
                            <span className="text-[12px] text-text-secondary">📍 {segment.geography}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${config.bg} ${config.text}`}>
                            {config.label}
                          </span>
                        </div>

                        {/* Trigger */}
                        <div className="bg-card/20 rounded-xl p-3 mb-3 border border-card-border">
                          <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
                            Commercial Trigger
                          </span>
                          <p className="text-[13px] font-semibold text-text-primary">{segment.trigger?.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-text-secondary ">
                            <span>💰 {segment.trigger?.value}</span>
                            <span>📅 {segment.trigger?.deadline}</span>
                          </div>
                        </div>

                        {/* Mechanism */}
                        <div className="mb-3">
                          <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">Why This Creates a Buyer</span>
                          <p className="text-[12px] text-text-secondary leading-relaxed">{segment.mechanism}</p>
                        </div>

                        {/* Entry Barriers */}
                        <div className="mb-3">
                          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block mb-1">Entry Barriers</span>
                          <p className="text-[12px] text-text-secondary">{segment.entryBarriers}</p>
                        </div>

                        {/* Squeeze Opportunity */}
                        <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/10 rounded-xl p-3 border border-[var(--color-primary)]/10 mb-3">
                          <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">🎯 Squeeze Opportunity</span>
                          <p className="text-[13px] font-semibold text-text-primary leading-relaxed">{segment.squeezeOpportunity}</p>
                        </div>

                        {/* Product Pill */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-text-secondary">Best Fit:</span>
                          <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11px] font-bold border border-[var(--color-primary)]/20">
                            {segment.bestFitProduct}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Growth Horizons Timeline */}
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--color-primary)]" /> Growth Strategy Horizons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.landscape.horizons.map((horizon) => {
                    const horizonConfig = {
                      now: { accent: "from-emerald-500 to-emerald-600", glow: "shadow-emerald-500/10", badge: "bg-emerald-500 text-text-primary", icon: "🚀" },
                      next: { accent: "from-amber-500 to-orange-500", glow: "shadow-amber-500/10", badge: "bg-amber-500 text-text-primary", icon: "⚙️" },
                      later: { accent: "from-zinc-400 to-zinc-500", glow: "shadow-sm", badge: "bg-panel0 text-text-primary", icon: "⏸️" },
                    };
                    const config = horizonConfig[horizon.id] || horizonConfig.later;

                    return (
                      <div
                        key={horizon.id}
                        className={`bg-card/40 backdrop-blur-md rounded-2xl border border-card-border overflow-hidden hover:shadow-xl ${config.glow} transition-shadow duration-300`}
                      >
                        {/* Horizon Header */}
                        <div className={`bg-gradient-to-r ${config.accent} p-4 text-text-primary`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[20px] mr-2">{config.icon}</span>
                              <span className="text-[18px] font-bold">{horizon.label}</span>
                            </div>
                            <span className="text-[12px] font-medium opacity-80">{horizon.timeframe}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 space-y-3">
                          {horizon.actions?.map((action, aIdx) => (
                            <div key={aIdx} className="bg-card/20 rounded-xl p-3 border border-card-border">
                              <p className="text-[13px] font-semibold text-text-primary mb-1.5">{action.action}</p>
                              <div className="flex items-center gap-2 text-[11px] text-text-secondary  mb-1">
                                <span className="px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold">{action.segment}</span>
                              </div>
                              <p className="text-[11px] text-text-secondary italic">{action.rationale}</p>
                            </div>
                          ))}
                          {(!horizon.actions || horizon.actions.length === 0) && (
                            <p className="text-[12px] text-text-secondary italic text-center py-4">No actions identified for this horizon.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Landscape Not Available */}
          {activeView === "landscape" && !result.landscape && (
            <div className="bg-card/40 backdrop-blur-md rounded-2xl p-12 border border-card-border text-center">
              <Map className="h-10 w-10 text-text-secondary mx-auto mb-3" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Landscape Analysis Unavailable</h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto">
                The market landscape analysis could not be generated in this pipeline run. Try running the pipeline again.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <div className="bg-card/40 backdrop-blur-md rounded-3xl p-16 border border-card-border text-center">
          <div className="inline-flex items-center justify-center p-5 rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/10 mb-5">
            <Network className="h-10 w-10 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Market Intelligence Pipeline
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto mb-8">
            Run the pipeline to extract structured events from tiered sources, apply deterministic scoring, 
            aggregate into strategic themes, and generate actionable intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-[11px] text-text-secondary">
            {["Tier A: Regulatory", "Tier B: Procurement", "Tier C: Trade Press", "Tier D: Business Press"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full border border-card-border bg-panel">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
    </div>
  );
}

// ─── Theme Card Component ───
function ThemeCard({
  theme,
  expanded,
  onToggle,
  onValidate,
  isPending,
  validationOverride,
}: {
  theme: AggregatedTheme;
  expanded: boolean;
  onToggle: () => void;
  onValidate: (id: string, action: "approved" | "rejected") => void;
  isPending?: boolean;
  validationOverride?: string;
}) {
  const [stakeholderView, setStakeholderView] = useState<"ceo" | "cto">("ceo");
  const delta = deltaLabels[theme.deltaStatus] || deltaLabels.stable;
  const status = validationOverride || theme.status;

  return (
    <div
      className={`bg-card/40 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden ${
        isPending
          ? "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
          : status === "approved"
          ? "border-emerald-500/20"
          : status === "rejected"
          ? "border-red-500/20 opacity-60"
          : "border-card-border"
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        {/* Gradient bar */}
        <div className="w-1.5 h-12 bg-[var(--color-primary)] rounded-full shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h4 className="text-[15px] font-bold text-text-primary leading-tight">
              {theme.title}
            </h4>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${delta.color}`}>
                {delta.icon} {theme.deltaStatus}
              </span>
              {status === "approved" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" /> Approved
                </span>
              )}
              {status === "rejected" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500">
                  <XCircle className="h-3 w-3" /> Rejected
                </span>
              )}
            </div>
          </div>
          <p className="text-[13px] text-text-secondary line-clamp-2">
            {theme.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-[11px] text-text-secondary">
            <span>📊 Relevance: <strong className="text-[var(--color-primary)]">{theme.relevanceScore}</strong></span>
            <span>🧩 {theme.events?.length || 0} supporting events</span>
            <span>🎯 Module: <strong className="text-[var(--color-primary)]">{theme.interpretation?.relevantProduct}</strong></span>
          </div>
        </div>

        <div className="shrink-0 mt-1">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-text-secondary" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-card-border pt-4 animate-in fade-in duration-200">
          {/* Strategic Interpretation */}
          <div className="bg-card/20 rounded-xl p-4 border border-card-border">
            <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-2">
              Strategic Interpretation
            </span>
            {/* Stakeholder View Toggle */}
            <div className="flex bg-panel p-1 rounded-full w-fit mb-4 border border-card-border">
              <button
                onClick={(e) => { e.stopPropagation(); setStakeholderView("ceo"); }}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  stakeholderView === "ceo"
                    ? "bg-[var(--color-primary)] text-text-alert text-text-primary shadow"
                    : "text-text-secondary  hover:text-text-primary"
                }`}
              >
                CEO View
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setStakeholderView("cto"); }}
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  stakeholderView === "cto"
                    ? "bg-[var(--color-primary)] text-text-alert text-text-primary shadow"
                    : "text-text-secondary  hover:text-text-primary"
                }`}
              >
                CTO View
              </button>
            </div>

            <p className="text-[13px] text-text-secondary  mb-3 font-medium bg-card-border/50 p-3 rounded-lg border border-card-border border-l-4 border-l-[var(--color-primary)]">
              {stakeholderView === "ceo" 
                ? theme.interpretation?.stakeholderViews?.ceoSummary 
                : theme.interpretation?.stakeholderViews?.ctoSummary}
            </p>

            <div className="flex items-center gap-4 text-[11px] mb-4">
              <span className="text-text-secondary ">
                Strategic Match: <strong className="text-[var(--color-primary)]">{theme.interpretation?.relevantProduct}</strong>
              </span>
            </div>
            
            {/* Scenarios & Action */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-card/40 backdrop-blur-md border border-card-border">
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-2">
                  18-Month Scenario Forecasts
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-red-500/5 p-2 rounded border border-red-500/10">
                    <span className="text-[9px] font-bold text-red-500 block mb-1">BEAR CASE</span>
                    <p className="text-[11px] text-text-secondary">{theme.interpretation?.scenarioForecasts?.bearCase}</p>
                  </div>
                  <div className="bg-blue-500/5 p-2 rounded border border-blue-500/10">
                    <span className="text-[9px] font-bold text-blue-500 block mb-1">BASE CASE</span>
                    <p className="text-[11px] text-text-secondary">{theme.interpretation?.scenarioForecasts?.baseCase}</p>
                  </div>
                  <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                    <span className="text-[9px] font-bold text-emerald-500 block mb-1">BULL CASE</span>
                    <p className="text-[11px] text-text-secondary">{theme.interpretation?.scenarioForecasts?.bullCase}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-card/40 backdrop-blur-md border border-card-border">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">
                  Suggested Action
                </span>
                <p className="text-[12px] text-text-secondary ">
                  {theme.interpretation?.suggestedAction}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card/40 backdrop-blur-md border border-card-border">
              <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-2">
                VRIO Competitive Analysis ({theme.interpretation?.vrioAnalysis?.competitiveImplication})
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-text-secondary">
                <div><strong className="text-text-primary ">V:</strong> {theme.interpretation?.vrioAnalysis?.valuable}</div>
                <div><strong className="text-text-primary ">R:</strong> {theme.interpretation?.vrioAnalysis?.rare}</div>
                <div><strong className="text-text-primary ">I:</strong> {theme.interpretation?.vrioAnalysis?.inimitable}</div>
                <div><strong className="text-text-primary ">O:</strong> {theme.interpretation?.vrioAnalysis?.organization}</div>
              </div>
            </div>
          </div>

          {/* Supporting Events */}
          {theme.events && theme.events.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-2">
                Evidence Chain ({theme.events.length} events)
              </span>
              <div className="space-y-2">
                {theme.events.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-card/20 border border-card-border"
                  >
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border mt-0.5 ${tierColors[evt.sourceTier]?.bg} ${tierColors[evt.sourceTier]?.text}`}>
                      {evt.sourceTier}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-text-primary text-text-primary leading-tight">
                        {evt.title}
                      </p>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        {evt.sourceName} · {evt.geography} · Rel: {evt.relevanceScore}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Actions (only for pending) */}
          {isPending && status === "pending_review" && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={(e) => { e.stopPropagation(); onValidate(theme.id, "approved"); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve for Dashboard
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onValidate(theme.id, "rejected"); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
