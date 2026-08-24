import {
  getCompetitors, getQueries, getDiscoveryLogs, getTriggerEvents,
} from '@/lib/db';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DeepResearchEngine from '@/components/dashboard/DeepResearchEngine';
import PortersFiveForces from '@/components/dashboard/frameworks/PortersFiveForces';
import BlueOceanCanvas from '@/components/dashboard/frameworks/BlueOceanCanvas';
import VrioAnalysis from '@/components/dashboard/frameworks/VrioAnalysis';

export const revalidate = 0;

export default async function DashboardPage() {

  const [
    competitors,
    _queries,
    discoveryLogs,
    triggerEvents,
  ] = await Promise.all([
    getCompetitors(),
    getQueries(),
    getDiscoveryLogs(),
    getTriggerEvents(),
  ]);

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative" id="dashboard-content">

      <DashboardHeader
        competitors={competitors}
        discoveryLogs={discoveryLogs}
        triggerEvents={triggerEvents}
      />

      {/* Automated Deep Research Engine (Phase 2 Feature) */}
      <div className="mt-8 border-t border-card-border/50 pt-10">
        <DeepResearchEngine />
      </div>

      {/* Advanced Competitor Analysis Frameworks */}
      <div className="mt-8 border-t border-card-border/50 pt-16">
        
        {/* Explanatory Header */}
        <div className="w-full px-6 md:px-10 mb-16 max-w-[1600px] mx-auto">
          <h2 className="text-4xl font-black text-text-primary tracking-tight mb-4">Strategic Intelligence Deep Dive</h2>
          <p className="text-lg text-text-secondary max-w-4xl leading-relaxed mb-10">
            This section translates raw market signals into executive-level MBA strategy. Rather than just listing what competitors are doing, the Intelligence Hub automatically processes those actions through three gold-standard strategic frameworks to tell you exactly <b>how to defeat them</b>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-card-border/50 shadow-lg">
              <h3 className="text-accent text-xs font-black uppercase tracking-widest mb-3">01. Market Forces</h3>
              <h4 className="text-xl font-bold text-text-primary mb-3">Porter&apos;s Five Forces</h4>
              <p className="text-base text-text-secondary leading-relaxed">
                <b>What it provides:</b> A real-time clustering of industry dynamics. It constantly measures the threat of new AI startups (New Entrants), generic LLMs (Substitutes), and legacy incumbents (Rivalry).<br/><br/><b>Why it matters:</b> It tells leadership whether the current market environment is favorable for expansion or if defensive moats need strengthening.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-card-border/50 shadow-lg">
              <h3 className="text-accent text-xs font-black uppercase tracking-widest mb-3">02. Value Innovation</h3>
              <h4 className="text-xl font-bold text-text-primary mb-3">Blue Ocean Strategy</h4>
              <p className="text-base text-text-secondary leading-relaxed">
                <b>What it provides:</b> A visual radar canvas comparing Empirisys against legacy incumbents across key value vectors.<br/><br/><b>Why it matters:</b> It explicitly proves to clients and investors that Empirisys isn&apos;t fighting a bloody pricing war in the &quot;Red Ocean&quot; of retrospective logging, but has created an uncontested &quot;Blue Ocean&quot; of predictive Safety AI.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-accent/30 shadow-[0_0_20px_rgba(122,224,59,0.05)]">
              <h3 className="text-accent text-xs font-black uppercase tracking-widest mb-3">03. Durable Advantage</h3>
              <h4 className="text-xl font-bold text-text-primary mb-3">VRIO Capability Matrix</h4>
              <p className="text-base text-text-secondary leading-relaxed">
                <b>What it provides:</b> A strict audit of Empirisys&apos;s internal resources based on Value, Rarity, Imitability, and Organization.<br/><br/><b>Why it matters:</b> It mathematically isolates the <i>Predictive NLP Engine</i> as your only uncopyable asset, directing the sales team to focus their pitches entirely on sustained advantages rather than temporary parity.
              </p>
            </div>
          </div>
        </div>

        <PortersFiveForces competitors={competitors} />
        <BlueOceanCanvas competitors={competitors} />
        <VrioAnalysis />
      </div>
    </div>
  );
}
