"use client";

import { useState } from 'react';
import { SFShield as Shield, SFExclamationmarkTriangle as AlertTriangle, SFMagnifyingglass as Search, SFInfoCircle as Info, SFGlobe as Globe, SFPaperplane as Send, SFPlusCircle as PlusCircle, SFTablecells as Table, SFSquareGrid2x2 as Grid, SFDesktopcomputer as Bot, SFArrowUpRight as ArrowUpRight } from 'sf-symbols-lib/monochrome';
import HeroSection from '@/components/ui/HeroSection';
import PdfExportButton from '@/components/ui/PdfExportButton';
import CompetitorMatrixTable from '@/components/competitors/CompetitorMatrixTable';
import dynamic from 'next/dynamic';
const CompetitorCharts = dynamic(() => import('@/components/competitors/CompetitorCharts').then(mod => mod.CompetitorCharts), { ssr: false });
import { 
  getDiscoveryLogs, addManualWatchlist,
  Competitor, CompetitorContent, DiscoveryLog 
} from '@/lib/db';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface CompetitorsClientProps {
  initialCompetitors: Competitor[];
  initialContent: CompetitorContent[];
  initialDiscoveryLogs: DiscoveryLog[];
}

export function CompetitorsClient({
  initialCompetitors,
  initialContent,
  initialDiscoveryLogs
}: CompetitorsClientProps) {
  const { searchQuery } = useStore();
  const [competitors, setCompetitors] = useState<Competitor[]>(initialCompetitors);
  const [contentList] = useState<CompetitorContent[]>(initialContent);
  const [discoveryLogs, setDiscoveryLogs] = useState<DiscoveryLog[]>(initialDiscoveryLogs);
  
  const [viewMode, setViewMode] = useState<'matrix' | 'cards' | 'emerging'>('matrix');
  const [searchVal, setSearchVal] = useState("");

  // AI query console states
  const [aiInput, setAiInput] = useState("");
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    if (searchQuery) setAiInput(searchQuery);
  }

  // Watchlist manual addition
  const [watchlistInput, setWatchlistInput] = useState("");
  const [isAddingWatchlist, setIsAddingWatchlist] = useState(false);

  const handleAddWatchlist = async () => {
    let url = watchlistInput.trim();
    if (!url || isAddingWatchlist) return;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    setIsAddingWatchlist(true);
    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!res.ok) {
        throw new Error('Failed to analyze URL');
      }

      const data = await res.json();
      
      const newId = `comp-live-${Date.now()}`;
      
      const newComp: Competitor = {
        id: newId,
        name: data.companyName,
        website: url,
        founded: 'Unknown',
        hq: 'Unknown',
        description: data.description,
        type: 'Indirect',
        pricing_model: 'Unknown',
        ai_analytics: 'yes',
        hse_focus: 'yes',
        uk_presence: 'no',
        saas_model: 'yes',
        threat_score: data.threatScore || 50,
        products: [],
        strengths: [],
        weaknesses: [],
        positioning: '',
        employee_count: 0,
        funding: '',
        client_overlap: 'Low',
        content_activity: 'Low',
        market_focus: [],
        recent_move: '',
        status: 'WATCHLIST'
      };

      const newLog: DiscoveryLog = {
        id: `log-live-${Date.now()}`,
        company_name: data.companyName,
        website: url,
        why_flagged: data.whyFlagged,
        source: 'Live Scraping',
        detected_at: new Date().toISOString().split('T')[0],
        confidence_score: 90,
        status: 'WATCHLIST'
      };

      setCompetitors([newComp, ...competitors]);
      setDiscoveryLogs([newLog, ...discoveryLogs]);
      setWatchlistInput("");
      setViewMode('emerging');
    } catch (e) {
      console.error("Live Analysis failed:", e);
      alert("Failed to extract data from this URL. Make sure it's a valid website.");
    } finally {
      setIsAddingWatchlist(false);
    }
  };

  // Removed useEffect fetching data since it's passed as props

  // Handle suggested query chip click
  const handleSuggestedQuery = (qText: string) => {
    setAiInput(qText);
    triggerAiQuery(qText);
  };

  // Simulated streaming AI response
  const triggerAiQuery = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setIsStreaming(true);
    setStreamedText("");

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text,
          moduleType: "competitors"
        })
      });

      if (!response.ok || !response.body) throw new Error('API Error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamedText(fullText);
      }

      // Log query
      fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, module_type: 'Competitor Intelligence', results_json: { response: fullText } })
      }).catch(err => console.error('Failed to log query:', err));

    } catch (err) {
      console.error(err);
      setStreamedText("Analysis failed. Please verify API configuration.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleAiFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAiQuery(aiInput);
  };

  // Dynamic calculated stats (no dashes)
  const totalCount = competitors.length;
  const directCount = competitors.filter(c => c.type === 'Direct').length;
  const indirectCount = competitors.filter(c => c.type === 'Indirect').length;
  const highThreatCount = competitors.filter(c => c.threat_score >= 80).length;
  
  const avgThreatScore = totalCount > 0
    ? Math.round(competitors.reduce((acc, c) => acc + c.threat_score, 0) / totalCount)
    : 78;

  // Filtered list
  const filteredComps = competitors.filter(c => 
    c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    c.hq.toLowerCase().includes(searchVal.toLowerCase()) ||
    c.description.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      {/* Hero Header */}
      <HeroSection
        title={
          <span className="flex items-center gap-2">
            <span>Know the field.</span>
            <span className="text-accent italic font-serif">Own the field.</span>
          </span>
        }
        subtitle="In depth corporate profile tracking threat scores and live capability indices"
        moduleLabel="MODULE 01 COMPETITOR INTELLIGENCE"
        belowContent={
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-micro font-bold text-text-secondary/60 uppercase tracking-wider">
              Suggested queries:
            </span>
            {[
              "How does BOOST compare to Intelex and Sphera?",
              "What are DNV's weaknesses vs Empirisys?",
              "Which competitors are hiring aggressively right now?"
            ].map((qText, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedQuery(qText)}
                className="px-3 py-1 bg-accent/8 hover:bg-accent border border-accent/15 hover:border-transparent text-caption font-medium text-text-primary hover:text-white rounded-full transition-all"
              >
                {qText}
              </button>
            ))}
          </div>
        }
      />

      {/* Main Container */}
      <div id="competitor-module-container" className="w-full px-6 md:px-10 mt-8 space-y-8">
        
        {/* Metric Strip (8 items, no dashes) */}
        <div className="-mt-16 md:-mt-20 relative z-20 mb-8 glass-card px-6 py-5 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 divide-y md:divide-y-0 md:divide-x divide-card-border bg-card">
          {[
            { label: "Tracked Competitors", val: totalCount },
            { label: "Direct Competitors", val: directCount },
            { label: "Indirect Competitors", val: indirectCount },
            { label: "High Threat Entities", val: highThreatCount },
            { label: "Monitoring Since", val: "2024" },
            { label: "Avg Threat Score", val: avgThreatScore },
            { label: "Most Active", val: "Sphera" },
            { label: "Latest Scan Update", val: "10 mins ago" }
          ].map((metric, i) => (
            <div key={i} className="flex flex-col justify-center px-4 py-2 first:pt-0 md:first:pt-2">
              <span className="text-micro font-bold text-text-secondary uppercase tracking-wider mb-2">
                {metric.label}
              </span>
              <span className="text-3xl font-black text-text-primary">
                {metric.val}
              </span>
            </div>
          ))}
        </div>

        {/* AI Query Console */}
        <div className="glass-card p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Strategic AI Query Console
            </h3>
          </div>
          
          <form onSubmit={handleAiFormSubmit} className="flex items-center gap-3 bg-background border border-card-border p-1.5 rounded-full">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask anything about competitor capabilities hiring or weaknesses..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-4 text-text-primary outline-none placeholder:text-text-secondary"
            />
            <button
              type="submit"
              disabled={isStreaming}
              className="px-5 py-2 bg-accent hover:bg-accent/80 text-white rounded-full text-xs font-bold transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {streamedText && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-background rounded-2xl border border-card-border text-xs text-text-primary leading-relaxed relative">
                <span className="absolute top-2 right-2 text-accent font-serif italic font-bold">RAI Response</span>
                {streamedText}
                {isStreaming && <span className="inline-block h-3.5 w-1 bg-accent animate-pulse ml-0.5" />}
              </div>

              {!isStreaming && (
                <div className="p-4 bg-accent/10 border-l-4 border-l-accent rounded-r-2xl">
                  <span className="text-micro font-bold text-accent uppercase tracking-wider block mb-1">
                    KEY INSIGHT
                  </span>
                  <p className="text-xs font-semibold text-text-primary">
                    Focus sales arguments on BOOST real time NLP ingestion to render competitor legacy forms obsolete.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <CompetitorCharts competitors={competitors} />

        {/* Directory Controls */}
        <div className="flex justify-between items-center glass-card p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Competitor Directory
            </h3>
            <div className="flex bg-background p-0.5 rounded-lg border border-card-border">
              <button
                onClick={() => setViewMode('matrix')}
                className={cn(
                  "px-3 py-1 rounded-md text-micro font-bold flex items-center gap-1.5 transition-all",
                  viewMode === 'matrix' ? "bg-card text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Table className="h-3 w-3" /> Matrix
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={cn(
                  "px-3 py-1 rounded-md text-micro font-bold flex items-center gap-1.5 transition-all",
                  viewMode === 'cards' ? "bg-card text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Grid className="h-3 w-3" /> Cards
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewMode('emerging'); }}
                className={cn(
                  "px-3 py-1 rounded-md text-micro font-bold flex items-center gap-1.5 transition-all relative",
                  viewMode === 'emerging' ? "bg-card text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                )}
              >
                <AlertTriangle className="h-3 w-3" /> 
                Emerging Threats
                {discoveryLogs.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search competitors..."
                className="pl-8 pr-4 py-1.5 bg-background border border-card-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-accent font-sans"
              />
            </div>
            <div className="h-4 w-px bg-card-border mx-1" />
            <div className="flex gap-3">
              <input
                type="text"
                value={watchlistInput}
                onChange={(e) => setWatchlistInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddWatchlist(); }}
                placeholder="Enter competitor URL (e.g. enablon.com)..."
                className="flex-1 max-w-md bg-background border border-card-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent focus:bg-background transition-all font-sans"
              />
              <button
                onClick={handleAddWatchlist}
                disabled={isAddingWatchlist || !watchlistInput.trim()}
                className="px-5 py-2.5 bg-accent hover:bg-accent/80 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
              >
                {isAddingWatchlist ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Analyzing Live Domain...
                  </>
                ) : (
                  <span>Track</span>
                )}
              </button>
            </div>
            <PdfExportButton targetId="competitor-module-container" filename="competitor-intelligence-report" />
          </div>
        </div>

        {/* Matrix View */}
        {viewMode === 'matrix' && (
          <CompetitorMatrixTable data={filteredComps} contentList={contentList} />
        )}

        {/* Cards View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComps.filter(c => c.status === 'TRACKED').map((comp) => {
              const borderCol = comp.threat_score >= 80 
                ? 'border-t-[#EF4444]' 
                : comp.threat_score >= 65 
                ? 'border-t-accent' 
                : 'border-t-accent';

              return (
                <div 
                  key={comp.id}
                  className={cn(
                    "glass-card rounded-2xl p-6 shadow-sm border-t-4 transition-all duration-300 hover:scale-102 hover:shadow-md",
                    borderCol
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold shadow-sm overflow-hidden border border-card-border relative bg-white">
                        <img 
                          src={comp.logoUrl || `https://logo.clearbit.com/${comp.website.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]}`} 
                          alt={comp.name}
                          className="w-full h-full object-contain absolute inset-0 m-auto z-10"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="w-full h-full flex items-center justify-center text-accent font-bold absolute inset-0 z-0 bg-accent/10">
                          {comp.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">
                          {comp.name}
                        </h4>
                        <span className="text-micro text-text-secondary font-medium">
                          HQ: {comp.hq}
                        </span>
                      </div>
                    </div>

                    <span className={cn(
                      "px-2 py-0.5 rounded text-micro font-bold uppercase",
                      comp.threat_score >= 80 ? "bg-[#EF4444]/10 text-[#EF4444]" :
                      comp.threat_score >= 65 ? "bg-accent/10 text-accent" :
                      "bg-accent/10 text-accent"
                    )}>
                      Threat {comp.threat_score}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                    {comp.description}
                  </p>

                  <div className="border-t border-card-border pt-4 flex justify-between items-center text-micro text-text-secondary font-medium">
                    <span>Founded {comp.founded}</span>
                    <button
                      onClick={() => setViewMode('matrix')}
                      className="text-accent font-bold hover:text-accent/80 flex items-center gap-0.5"
                    >
                      <span>Profile Details</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Emerging Threats View */}
        {viewMode === 'emerging' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discoveryLogs.length === 0 ? (
              <div className="col-span-1 md:col-span-2 glass-card p-12 flex flex-col items-center justify-center text-center">
                <Shield className="h-12 w-12 text-accent mb-4 opacity-50" />
                <h4 className="text-lg font-bold text-text-primary mb-2">No Emerging Threats Detected</h4>
                <p className="text-sm text-text-secondary max-w-md">
                  Your automated AI discovery pipeline is active and monitoring the market. 
                  Any newly detected competitors will appear here for your review.
                </p>
              </div>
            ) : (
              discoveryLogs.map((log) => {
                const compData = competitors.find(c => c.name === log.company_name);
                if (!compData) return null;

                return (
                  <div key={log.id} className="glass-card rounded-2xl p-6 shadow-sm border-l-4 border-l-[var(--accent)] relative overflow-hidden group">
                    {log.status === 'EMERGING' ? (
                      <span className="absolute top-0 right-0 bg-[var(--accent)] text-white text-micro font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg">Emerging</span>
                    ) : (
                      <span className="absolute top-0 right-0 bg-accent text-white text-micro font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg">Watchlist</span>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-text-primary mb-1">{log.company_name}</h4>
                      <a href={log.website} target="_blank" rel="noreferrer" className="text-micro text-text-secondary hover:text-accent flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {log.website.replace('https://www.', '').replace('https://', '')}
                      </a>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-micro font-bold text-text-secondary uppercase tracking-wider block mb-1">Initial Threat Assessment</span>
                        <p className="text-xs text-text-primary leading-relaxed">{compData.description}</p>
                      </div>
                      
                      <div className="bg-background border border-card-border p-3 rounded-lg flex items-start gap-3">
                        <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <span className="text-micro font-bold text-accent uppercase tracking-wider block mb-1">Why Flagged</span>
                          <p className="text-caption text-text-primary font-medium">{log.why_flagged}</p>
                          <p className="text-micro text-text-secondary mt-1">First detected: {log.detected_at} via {log.source}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-card-border">
                        <div className="flex flex-col">
                          <span className="text-micro font-bold text-text-secondary uppercase tracking-wider mb-1">Est Threat Score</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-bold text-center inline-block w-max",
                            compData.threat_score >= 80 ? "bg-[#EF4444]/10 text-[#EF4444]" :
                            compData.threat_score >= 65 ? "bg-accent/10 text-accent" :
                            "bg-accent/10 text-accent"
                          )}>
                            {compData.threat_score} / 100
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              const updatedLogs = discoveryLogs.filter(d => d.id !== log.id);
                              setDiscoveryLogs(updatedLogs);
                              const updatedComps = competitors.map(c => c.id === compData.id ? { ...c, status: 'DISMISSED' as const } : c);
                              setCompetitors(updatedComps);
                            }}
                            className="px-4 py-2 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-500 rounded-md text-micro font-bold transition-all"
                          >
                            Dismiss
                          </button>
                          <button 
                            onClick={() => {
                              const updatedLogs = discoveryLogs.filter(d => d.id !== log.id);
                              setDiscoveryLogs(updatedLogs);
                              const updatedComps = competitors.map(c => c.id === compData.id ? { ...c, status: 'TRACKED' as const } : c);
                              setCompetitors(updatedComps);
                              setViewMode('matrix');
                            }}
                            className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-md text-micro font-bold transition-all"
                          >
                            Add to Tracked
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}

