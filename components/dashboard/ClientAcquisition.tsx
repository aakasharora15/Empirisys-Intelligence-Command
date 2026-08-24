"use client";

import { useState } from 'react';
import { SFMagnifyingglass as Search, SFBolt as Zap, SFChartLineUptrendXyaxis as Activity, SFCheckmark as Check, SFDocumentOnClipboard as Copy } from 'sf-symbols-lib/monochrome';
import { NearMissEvent, mockClientAnalyses } from '@/lib/db';
import { cn } from '@/lib/utils';

interface ClientAcquisitionProps {
  initialNearMissEvents: NearMissEvent[];
}

export default function ClientAcquisition({ initialNearMissEvents }: ClientAcquisitionProps) {
  const [clientSearchVal, setClientSearchVal] = useState("");
  const [nearMissEvents] = useState<NearMissEvent[]>(initialNearMissEvents);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyzeClient = async (companyName: string) => {
    if (!companyName.trim()) return;
    setClientSearchVal(companyName);
    setSelectedClient(companyName);
    setIsAnalyzing(true);
    setAnalysisText("");
    
    try {
      const response = await fetch('/api/analyze-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName })
      });

      if (!response.body) {
        setIsAnalyzing(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulatedText += chunk;
          setAnalysisText(accumulatedText);
        }
      }
    } catch (err) {
      console.error("Client analysis error:", err);
      setAnalysisText("An error occurred during live analysis. Falling back to cached database profile.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIncumbentName = (companyName: string) => {
    const match = mockClientAnalyses.find(c => c.company_name.toLowerCase() === companyName.toLowerCase());
    return match ? match.incumbent_consultant.name : "Competitor legacy EHS suite";
  };

  const parseAnalysisText = (text: string) => {
    const sections = {
      overview: '',
      riskProfile: '',
      incumbent: '',
      pitchStrategy: '',
      nextSteps: ''
    };

    const overviewMarker = '## SECTION 1: COMPANY OVERVIEW';
    const riskMarker = '## SECTION 2: HSE RISK PROFILE';
    const incumbentMarker = '## SECTION 3: INCUMBENT CONSULTANT';
    const pitchMarker = '## SECTION 4: EMPIRISYS PITCH STRATEGY';
    const nextStepsMarker = '## SECTION 5: RECOMMENDED NEXT STEPS';

    const overviewIndex = text.indexOf(overviewMarker);
    const riskIndex = text.indexOf(riskMarker);
    const incumbentIndex = text.indexOf(incumbentMarker);
    const pitchIndex = text.indexOf(pitchMarker);
    const nextStepsIndex = text.indexOf(nextStepsMarker);

    if (overviewIndex !== -1) {
      const end = riskIndex !== -1 ? riskIndex : text.length;
      sections.overview = text.substring(overviewIndex + overviewMarker.length, end).trim();
    }
    if (riskIndex !== -1) {
      const end = incumbentIndex !== -1 ? incumbentIndex : text.length;
      sections.riskProfile = text.substring(riskIndex + riskMarker.length, end).trim();
    }
    if (incumbentIndex !== -1) {
      const end = pitchIndex !== -1 ? pitchIndex : text.length;
      sections.incumbent = text.substring(incumbentIndex + incumbentMarker.length, end).trim();
    }
    if (pitchIndex !== -1) {
      const end = nextStepsIndex !== -1 ? nextStepsIndex : text.length;
      sections.pitchStrategy = text.substring(pitchIndex + pitchMarker.length, end).trim();
    }
    if (nextStepsIndex !== -1) {
      sections.nextSteps = text.substring(nextStepsIndex + nextStepsMarker.length).trim();
    }

    return sections;
  };

  const parsedSections = parseAnalysisText(analysisText);

  const extractRiskScore = (text: string) => {
    const match = text.match(/Risk Score\*\*?:\s*(\d+)/i);
    return match ? parseInt(match[1]) : null;
  };
  const extractedScore = extractRiskScore(parsedSections.riskProfile);

  const getSimilarClientsWon = (companyName: string) => {
    const preseedMatch = mockClientAnalyses.find(c => c.company_name.toLowerCase() === companyName.toLowerCase());
    const sector = preseedMatch ? preseedMatch.sector : "Industrial Operations";
    
    const currentLower = companyName.toLowerCase();
    if (sector.toLowerCase().includes('oil') || sector.toLowerCase().includes('gas')) {
      return [
        { name: 'BP', detail: 'Offshore platform log processing using BOOST NLP engine' },
        { name: 'Harbour Energy', detail: 'North Sea oil rig risk models and safety telemetry audits' }
      ].filter(c => c.name.toLowerCase() !== currentLower);
    }
    if (sector.toLowerCase().includes('water') || sector.toLowerCase().includes('utility')) {
      return [
        { name: 'Thames Water', detail: 'Culture and compliance auditing using SENSE diagnostics' },
        { name: 'Wessex Water', detail: 'Regional compliance safety tracking and treatment monitors' }
      ].filter(c => c.name.toLowerCase() !== currentLower);
    }
    if (sector.toLowerCase().includes('energy') || sector.toLowerCase().includes('biomass') || sector.toLowerCase().includes('renew')) {
      return [
        { name: 'SSE', detail: 'Renewable energy safety metrics and wind turbine transfers' },
        { name: 'Drax', detail: 'Biomass handling plant risk dashboards and operator logs' }
      ].filter(c => c.name.toLowerCase() !== currentLower);
    }
    return [
      { name: 'BP', detail: 'Offshore platform log processing using BOOST NLP engine' },
      { name: 'Thames Water', detail: 'Culture and compliance auditing using SENSE diagnostics' }
    ];
  };

  const formatMarkdownToJsx = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let cleanLine = line.trim();
      if (!cleanLine) return <div key={i} className="h-2" />;
      
      const isListItem = cleanLine.startsWith('*');
      if (isListItem) {
        cleanLine = cleanLine.substring(1).trim();
      }

      const parts = [];
      let tempText = cleanLine;
      let boldIndex = tempText.indexOf('**');
      
      while (boldIndex !== -1) {
        const before = tempText.substring(0, boldIndex);
        tempText = tempText.substring(boldIndex + 2);
        const afterBoldIndex = tempText.indexOf('**');
        
        if (afterBoldIndex !== -1) {
          const boldText = tempText.substring(0, afterBoldIndex);
          tempText = tempText.substring(afterBoldIndex + 2);
          
          if (before) parts.push({ text: before, bold: false });
          parts.push({ text: boldText, bold: true });
        } else {
          parts.push({ text: '**' + tempText, bold: false });
          tempText = '';
        }
        boldIndex = tempText.indexOf('**');
      }
      if (tempText) {
        parts.push({ text: tempText, bold: false });
      }

      const content = parts.map((p, idx) => p.bold ? <strong key={idx} className="font-bold text-text-primary">{p.text}</strong> : <span key={idx}>{p.text}</span>);

      if (isListItem) {
        return (
          <li key={i} className="list-disc ml-4 text-xs text-text-secondary mb-1">
            {content}
          </li>
        );
      }

      return (
        <p key={i} className="text-xs text-text-secondary leading-relaxed mb-2">
          {content}
        </p>
      );
    });
  };

  const handleCopyPitch = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderGaugeChart = (score: number) => {
    const percentage = score / 100;
    const radius = 50;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference - (percentage * circumference);

    return (
      <div className="flex flex-col items-center justify-center p-2 bg-background/30 rounded-xl border border-card-border/50">
        <svg className="w-32 h-20" viewBox="0 0 120 70">
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="var(--color-card-border)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke={score > 75 ? '#EF4444' : score > 50 ? 'var(--accent)' : 'var(--accent)'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <text x="60" y="55" textAnchor="middle" className="text-xl font-bold fill-current text-text-primary font-sans">
            {score}
          </text>
          <text x="60" y="68" textAnchor="middle" className="text-micro font-bold uppercase tracking-wider fill-current text-text-secondary">
            HSE Risk Index
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full px-6 md:px-10 mt-8 relative z-20 mb-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Columns: Client Search, Overview, Risk, Incumbent, Pitch, Similar Clients */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Hero Search Card */}
        <div className="p-8 rounded-2xl glass-card bg-card border-card-border text-text-primary shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[120%] bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-serif">Client Acquisition Intelligence</h2>
            <p className="text-xs text-text-secondary max-w-xl leading-relaxed font-sans">
              Enter a target client to instantly aggregate HSE records, uncover near miss incidents, and generate a customised Empirisys pitch strategy.
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="bg-background p-1.5 rounded-full border border-card-border shadow-md flex items-center gap-3">
            <Search className="h-5 w-5 text-text-secondary/60 ml-4 shrink-0" />
            <input
              type="text"
              value={clientSearchVal}
              onChange={(e) => setClientSearchVal(e.target.value)}
              placeholder="Enter company name to analyze: e.g. BP, Shell, SSE..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-text-primary outline-none placeholder:text-text-secondary/50 font-sans"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyzeClient(clientSearchVal);
              }}
            />
            <button
              onClick={() => handleAnalyzeClient(clientSearchVal)}
              className="px-6 py-2.5 bg-accent text-white rounded-full text-xs font-bold hover:bg-accent-hover transition-all flex items-center gap-1.5 shadow cursor-pointer shrink-0"
            >
              <Zap className="h-4 w-4" />
              <span>Analyze Client</span>
            </button>
          </div>

          {/* Quick Search Chips */}
          <div className="space-y-2">
            <span className="text-micro font-bold text-text-secondary uppercase tracking-wider block">
              Quick Search Targets
            </span>
            <div className="flex flex-wrap gap-2">
              {['BP', 'Shell', 'Balfour Beatty', 'Thames Water', 'SSE', 'Harbour Energy', 'Drax'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleAnalyzeClient(chip)}
                  className="px-3.5 py-1.5 bg-background hover:bg-accent/10 border border-card-border rounded-full text-xs font-medium text-text-secondary hover:text-accent transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loader Skeleton overlay when isAnalyzing is active (Zero Spinners) */}
        {isAnalyzing && (
          <div className="space-y-6">
            {/* Overview Card Skeleton */}
            <div className="glass-card p-6 rounded-2xl bg-card border border-card-border animate-pulse space-y-4">
              <div className="h-4 bg-foreground/10 rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-3 bg-foreground/10 rounded w-full" />
                <div className="h-3 bg-foreground/10 rounded w-5/6" />
                <div className="h-3 bg-foreground/10 rounded w-4/5" />
              </div>
            </div>

            {/* Semicircle Gauge Skeleton */}
            <div className="glass-card p-6 rounded-2xl bg-card border border-card-border animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-center md:col-span-1">
                <div className="h-20 w-32 bg-foreground/10 rounded-t-full" />
              </div>
              <div className="md:col-span-2 space-y-2 justify-center flex flex-col">
                <div className="h-3 bg-foreground/10 rounded w-full" />
                <div className="h-3 bg-foreground/10 rounded w-5/6" />
              </div>
            </div>

            {/* Incumbent & Pitch Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl bg-card border border-card-border animate-pulse space-y-3">
                <div className="h-4 bg-foreground/10 rounded w-1/3" />
                <div className="h-3 bg-foreground/10 rounded w-full" />
                <div className="h-3 bg-foreground/10 rounded w-4/5" />
              </div>
              <div className="glass-card p-6 rounded-2xl bg-card border border-card-border animate-pulse space-y-3">
                <div className="h-4 bg-foreground/10 rounded w-1/3" />
                <div className="h-3 bg-foreground/10 rounded w-full" />
                <div className="h-3 bg-foreground/10 rounded w-5/6" />
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no analysis is running and no company is selected */}
        {!selectedClient && !isAnalyzing && (
          <div className="glass-card p-12 rounded-2xl text-center flex flex-col items-center justify-center bg-card">
            <Activity className="h-12 w-12 text-accent mb-4 opacity-75" />
            <h3 className="text-base font-bold text-text-primary uppercase tracking-wider">
              Target Profile Generation
            </h3>
            <p className="text-xs text-text-secondary max-w-sm mt-2 leading-relaxed">
              Select a target client above to parse safety enforcement records, query near miss feeds, and build a tailored value proposition.
            </p>
          </div>
        )}

        {/* Analysis Output Cards (displayed when we have streamed text) */}
        {!isAnalyzing && selectedClient && analysisText && (
          <div className="space-y-6">
            
            {/* Section 1: Overview */}
            {parsedSections.overview && (
              <div className="glass-card p-6 rounded-2xl bg-card space-y-3">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-card-border/60 pb-2">
                  Company Overview
                </h3>
                <div className="space-y-1 font-sans text-xs">
                  {formatMarkdownToJsx(parsedSections.overview)}
                </div>
              </div>
            )}

            {/* Section 2: HSE Risk Profile */}
            {parsedSections.riskProfile && (
              <div className="glass-card p-6 rounded-2xl bg-card space-y-4">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-card-border/60 pb-2">
                  HSE Risk Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="md:col-span-1 flex justify-center">
                    {renderGaugeChart(extractedScore || 65)}
                  </div>
                  <div className="md:col-span-3 space-y-1 text-xs">
                    {formatMarkdownToJsx(parsedSections.riskProfile)}
                  </div>
                </div>
              </div>
            )}

            {/* Section 3 & 4 Grid: Incumbent & Pitch Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 3: Incumbent */}
              {parsedSections.incumbent && (
                <div className="glass-card p-6 rounded-2xl bg-card space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-card-border/60 pb-2">
                      Incumbent Advisor
                    </h3>
                    <div className="text-xs">
                      {formatMarkdownToJsx(parsedSections.incumbent)}
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-micro font-bold text-[#EF4444] uppercase tracking-wider block">
                      Identified Weakness
                    </span>
                    <span className="text-caption text-text-secondary italic">
                      Legacy form configuration delays reporting observations by days.
                    </span>
                  </div>
                </div>
              )}

              {/* Card 4: Pitch Strategy */}
              {parsedSections.pitchStrategy && (
                <div className="glass-card p-6 rounded-2xl bg-card space-y-3 flex flex-col justify-between relative overflow-hidden radial-glow">
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-start border-b border-card-border/60 pb-2">
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                        Pitch Strategy
                      </h3>
                      {/* Product Badges (BOOST / SENSE / Empirisys 360) */}
                      <div className="flex gap-1">
                        {['BOOST', 'SENSE'].map(prod => (
                          <span key={prod} className="px-1.5 py-0.5 bg-accent/10 text-accent rounded text-micro font-bold uppercase">
                            {prod}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs max-h-60 overflow-y-auto pr-1">
                      {formatMarkdownToJsx(parsedSections.pitchStrategy)}
                    </div>
                  </div>

                  {/* Clipboard copy & Contract value */}
                  <div className="pt-4 border-t border-card-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative z-10">
                    <div>
                      <span className="text-micro font-bold text-text-secondary uppercase tracking-wider block">
                        Est Contract Opportunity
                      </span>
                      <span className="text-base font-extrabold text-accent">
                        £1,500,000 to £2,000,000
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleCopyPitch(analysisText)}
                      className="px-4 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? "Copied" : "Copy Pitch"}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Section 5: Similar Clients Won */}
            <div className="glass-card p-6 rounded-2xl bg-card space-y-4">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider border-b border-card-border/60 pb-2">
                Similar Clients Won
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getSimilarClientsWon(selectedClient).map((ref, idx) => (
                  <div key={idx} className="p-4 bg-background border border-card-border/60 rounded-xl space-y-1.5 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-micro font-bold">
                        {ref.name[0]}
                      </span>
                      <h4 className="text-xs font-bold text-text-primary">
                        {ref.name}
                      </h4>
                    </div>
                    <p className="text-caption text-text-secondary leading-relaxed">
                      {ref.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Right Column: Live Near Miss Feed (Columns 3) */}
      <div className="space-y-6">
        
        <div className="glass-card p-6 rounded-2xl bg-card space-y-4">
          <div className="flex flex-col justify-between border-b border-card-border/60 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#EF4444] rounded-full animate-ping" />
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Live Near Miss Feed
              </h3>
            </div>
            <p className="text-micro text-text-secondary mt-1">
              Continuous pipeline near miss feeds monitoring target company sites
            </p>
          </div>

          <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
            {nearMissEvents.map((event) => {
              const logoChar = event.company_name[0] || 'T';
              
              return (
                <div key={event.id} className="p-3.5 bg-background border border-card-border/60 rounded-xl hover:shadow-sm transition-all space-y-2 relative">
                  {/* Top indicators */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                      <span className="h-5 w-5 bg-accent/10 text-accent rounded-full flex items-center justify-center text-micro font-extrabold">
                        {logoChar}
                      </span>
                      <span className="text-xs font-bold text-text-primary">
                        {event.company_name}
                      </span>
                    </div>
                    <span className="text-micro text-text-secondary italic">
                      {event.published_at}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-micro font-bold uppercase tracking-wider",
                      event.severity === 'High' ? "bg-[#EF4444]/10 text-[#EF4444]" :
                      event.severity === 'Medium' ? "bg-accent/10 text-accent" :
                      "bg-accent/10 text-accent"
                    )}>
                      {event.category}
                    </span>
                    <span className="px-1.5 py-0.5 bg-accent/10 text-accent rounded text-micro font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="h-1 w-1 bg-accent rounded-full" />
                      <span>Updating</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-caption text-text-secondary leading-relaxed">
                    {event.description}
                  </p>

                  {/* Incumbent consultant */}
                  <div className="pt-2 border-t border-card-border/40 flex justify-between items-center text-[9.5px]">
                    <span className="text-text-secondary">
                      Incumbent Consultant:
                    </span>
                    <span className="font-bold text-accent">
                      {getIncumbentName(event.company_name)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
