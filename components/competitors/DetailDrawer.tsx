import React, { useState } from 'react';
import { SFInfoCircle as Info, SFArrowUpRightSquare as ExternalLink, SFBolt as Zap } from 'sf-symbols-lib/monochrome';
import { Competitor, CompetitorContent } from '@/lib/db';
import { cn } from '@/lib/utils';

interface DetailDrawerProps {
  comp: Competitor;
  contentList: CompetitorContent[];
}

export function DetailDrawer({ comp, contentList }: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'marketing' | 'hiring'>('overview');
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [battlecardText, setBattlecardText] = useState<string | null>(null);

  const generateBattlecard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGeneratingCard(true);
    setBattlecardText('');
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate a tactical 3-point sales battlecard against ${comp.name}. Focus purely on competitor analysis. 
            Format as:
            1. Their Core Weakness
            2. The "Trap" to set for the client
            3. Our Counter-Pitch (Empirisys BOOST is an Intelligence Layer providing decision support, not just another Data Capture System of Record like legacy tools).
            Keep it brief, bulleted, and highly actionable.`,
          system: 'You are an elite sales strategist for Empirisys.'
        })
      });

      if (!response.body) throw new Error('No response body');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setBattlecardText((prev) => (prev || '') + decoder.decode(value, { stream: true }));
      }
    } catch (error) {
      console.error('Failed to generate battlecard:', error);
      setBattlecardText('Failed to generate battlecard. Please try again.');
    } finally {
      setIsGeneratingCard(false);
    }
  };
  
  return (
    <div className="p-6 m-3 bg-card/30 backdrop-blur-lg border border-card-border rounded-xl shadow-inner space-y-6 relative">
      <div className="flex justify-between items-center border-b border-card-border pb-2">
      <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Company Overview' },
          { id: 'content', label: 'Content and Social Feed' },
          { id: 'marketing', label: 'Marketing Strategy Analysis' },
          { id: 'hiring', label: 'Hiring Intelligence' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'content' | 'marketing' | 'hiring')}
            className={cn(
              "pb-1 border-b-2 transition-all",
              activeTab === tab.id
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button 
        className="text-text-secondary hover:text-accent transition-colors group relative"
      >
        <Info className="h-4 w-4" />
        <div className="absolute right-0 top-6 w-64 p-3 bg-card border border-card-border rounded-lg shadow-xl text-sm text-text-primary font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          This panel aggregates live signals, CRM data, and strategic analysis for this competitor. Add this competitor to your target charts to receive realtime notifications.
        </div>
      </button>
    </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Description</span>
              <p className="text-xs text-text-primary leading-relaxed">{comp.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-accent uppercase tracking-wider block">Key Strengths</span>
                <ul className="space-y-1.5">
                  {comp.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-text-primary">
                      <span className="h-1.5 w-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider block">Key Weaknesses</span>
                <ul className="space-y-1.5">
                  {comp.weaknesses.map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-text-primary">
                      <span className="h-1.5 w-1.5 bg-[#EF4444] rounded-full mt-1.5 shrink-0" />
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-background border-l-4 border-accent rounded-r-xl space-y-1">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Recent Positioning Statement</span>
              <p className="text-xs font-semibold text-text-primary italic">&quot;{comp.positioning}&quot;</p>
            </div>

            {/* AI Sales Battlecard Section */}
            <div className="p-5 bg-card/50 border border-card-border rounded-xl space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Sales Battlecard</span>
                </div>
                {!battlecardText && !isGeneratingCard && (
                  <button 
                    type="button"
                    onClick={generateBattlecard}
                    className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    Generate vs {comp.name}
                  </button>
                )}
              </div>

              {isGeneratingCard && !battlecardText && (
                <div className="flex items-center gap-2 text-accent text-xs font-bold animate-pulse">
                  <span className="h-3 w-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Analyzing Threat Vectors...
                </div>
              )}

              {battlecardText && (
                <div className="mt-4 p-4 bg-background border border-card-border rounded-lg text-xs text-text-primary whitespace-pre-wrap leading-relaxed shadow-inner">
                  {battlecardText}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-4 bg-background p-5 rounded-2xl border border-card-border space-y-4">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block border-b border-card-border pb-1.5">Dossier Details</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary mb-0.5">Founded</p>
                <p className="font-bold text-text-primary">{comp.founded}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-0.5">HQ</p>
                <p className="font-bold text-text-primary">{comp.hq}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-0.5">Employees</p>
                <p className="font-bold text-text-primary">{comp.employee_count}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-0.5">Pricing</p>
                <p className="font-bold text-text-primary truncate" title={comp.pricing_model}>{comp.pricing_model}</p>
              </div>
            </div>
            
            <div className="space-y-1.5 pt-2 border-t border-card-border">
              <p className="text-sm text-text-secondary">Key Products</p>
              <div className="flex flex-wrap gap-1.5">
                {comp.products.map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-card border border-card-border rounded text-xs font-semibold text-text-primary">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-card-border">
              <p className="text-sm text-text-secondary">Market Focus</p>
              <div className="flex flex-wrap gap-1.5">
                {comp.market_focus?.map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-card border border-card-border rounded text-xs font-semibold text-text-primary">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-1.5 pt-2 border-t border-card-border">
              <p className="text-sm text-text-secondary">Recent Strategic Move</p>
              <p className="text-sm text-text-primary leading-tight">{comp.recent_move}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-4">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Live Competitor Social content</span>
          {contentList.length === 0 ? (
            <p className="text-xs text-text-secondary italic">No content detected from RSS feed recently.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentList.map((content) => (
                <div key={content.id} className="p-4 bg-background border border-card-border rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-accent/10 text-accent rounded text-xs font-bold uppercase">
                      {content.type}
                    </span>
                    <span className="text-sm text-text-secondary">{content.published_at}</span>
                  </div>
                  <h5 className="font-bold text-xs text-text-primary leading-snug">{content.title}</h5>
                  <p className="text-sm text-text-secondary leading-relaxed">{content.summary}</p>
                  <div className="flex justify-between items-center text-sm text-text-secondary pt-2 border-t border-card-border">
                    <span>Source: {content.source}</span>
                    <a href={content.url} target="_blank" rel="noreferrer" className="text-accent font-bold flex items-center gap-0.5">
                      <span>View post</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'marketing' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-accent/10 border-l-4 border-[var(--accent)] rounded-r-2xl space-y-1">
            <span className="text-xs font-bold text-accent uppercase tracking-wider block">AI Generated Marketing Analysis</span>
            <p className="text-xs text-text-primary leading-relaxed font-semibold">
              Competitor is positioning heavily around sustainability and ESG dashboards. Their messaging focuses on carbon accountability to leverage investor pressure.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-background p-4 rounded-xl space-y-1">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Key Messages</span>
              <p className="text-sm text-text-primary">&quot;Sustainability audit logs ready in twenty four hours.&quot;</p>
            </div>
            <div className="bg-background p-4 rounded-xl space-y-1">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Target Audience</span>
              <p className="text-sm text-text-primary">Chief Sustainability Officers and Compliance Managers in logistics.</p>
            </div>
            <div className="bg-background p-4 rounded-xl space-y-1">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Empirisys Angle</span>
              <p className="text-sm text-text-primary">&quot;BOOST matches culture diagnostics with ESG reporting to prevent risk.&quot;</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hiring' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Strategic Hiring Signals</span>
            <div className="space-y-3">
              {[
                { role: 'Senior Product Manager for ESG Reporting Platform', loc: 'London UK', desc: 'Expanding cloud dashboard integrations for corporate metrics compliance.' },
                { role: 'Lead Data Scientist on NLP safety classification', loc: 'Hovik Norway', desc: 'Working on automating PDF safety log categorization models.' }
              ].map((job, idx) => (
                <div key={idx} className="p-3 bg-background border border-card-border rounded-xl space-y-1">
                  <h5 className="font-bold text-text-primary">{job.role}</h5>
                  <p className="text-sm text-text-secondary">{job.loc}</p>
                  <p className="text-sm text-text-secondary mt-1">{job.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 bg-background p-4 rounded-xl border border-card-border space-y-2 flex flex-col justify-center">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block text-center">Open HSE Tech Roles</span>
            <div className="text-center py-4">
              <span className="text-4xl font-black text-accent block">{comp.open_roles_count || 12}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider font-bold">Open Positions</span>
            </div>
            <p className="text-sm text-text-secondary text-center leading-relaxed">
              Targeted hiring in product development indicates strategic intent to catch up on NLP text ingestion features.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
