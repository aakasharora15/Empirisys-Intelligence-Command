"use client";

import { motion } from 'framer-motion';
import { FiTerminal, FiShield, FiUsers, FiServer, FiMessageSquare } from 'react-icons/fi';

export default function DeepResearchEngine() {
  const techVulnerabilities = [
    {
      competitor: "Enablon",
      tech: "Legacy SOAP APIs / Monolithic .NET",
      risk: "Critical",
      impact: "Integration bottleneck. Empirisys can pitch 10x faster deployment.",
    },
    {
      competitor: "Cority",
      tech: "On-Premise Database Clusters",
      risk: "High",
      impact: "High TCO and maintenance. Empirisys pitches zero-ops cloud native.",
    },
    {
      competitor: "Intelex",
      tech: "jQuery / Outdated Frontend Frameworks",
      risk: "Medium",
      impact: "Poor UX on mobile. Empirisys pitches modern, frictionless UI.",
    }
  ];

  const churnSignals = [
    {
      company: "Global Logistics Corp",
      currentVendor: "Enablon",
      source: "Scraped from G2 Reviews",
      sentiment: "Highly Negative",
      quote: "\"System is too clunky. Getting our safety data out requires a PhD. Needs predictive analytics.\"",
      action: "Prime for Poach - Pitch BOOST NLP"
    },
    {
      company: "EuroManufacturing Ltd",
      currentVendor: "Cority",
      source: "Scraped from Capterra",
      sentiment: "Negative",
      quote: "\"Mobile app keeps crashing in offline mode. Workers refuse to log near-misses.\"",
      action: "Pitch Frictionless Mobile PWA"
    }
  ];

  return (
    <div className="w-full px-6 md:px-10 mb-20 max-w-[1600px] mx-auto mt-12">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-text-primary tracking-tight mb-4 flex items-center gap-4">
          <FiTerminal className="h-8 w-8 text-accent" />
          Automated Deep Research Engine
        </h2>
        <p className="text-lg text-text-secondary max-w-4xl leading-relaxed">
          The Hub autonomously scrapes metadata and unstructured sentiment that humans cannot gather at scale. It maps hidden technology vulnerabilities and identifies competitor clients who are highly dissatisfied and ready to churn.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Tech Stack Vulnerability Scanner */}
        <div className="bg-card border border-accent/20 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(122,224,59,0.03)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          
          <div className="flex items-center gap-3 mb-8">
            <FiServer className="h-6 w-6 text-accent" />
            <h3 className="text-xl font-bold text-text-primary tracking-wide">Tech Stack Vulnerability Scanner</h3>
          </div>
          
          <div className="space-y-6">
            {techVulnerabilities.map((vuln, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-panel border border-card-border p-5 rounded-xl flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-text-primary uppercase tracking-widest">{vuln.competitor}</span>
                    <span className="text-xs text-text-secondary font-mono bg-black/50 px-2 py-1 rounded">Footprint detected</span>
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    vuln.risk === 'Critical' ? 'text-red-400 border-red-400/30 bg-red-400/10' : 
                    vuln.risk === 'High' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' : 
                    'text-amber-400 border-amber-400/30 bg-amber-400/10'
                  }`}>
                    {vuln.risk} Risk
                  </span>
                </div>
                <div>
                  <p className="text-base text-text-primary font-mono mb-1">{vuln.tech}</p>
                  <p className="text-sm text-accent font-semibold">Sales Action: {vuln.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Sentiment & Churn Radar */}
        <div className="bg-card border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.03)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="flex items-center gap-3 mb-8">
            <FiUsers className="h-6 w-6 text-blue-400" />
            <h3 className="text-xl font-bold text-text-primary tracking-wide">Customer Sentiment & Churn Radar</h3>
          </div>

          <div className="space-y-6">
            {churnSignals.map((signal, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-panel border border-card-border p-5 rounded-xl flex flex-col gap-4"
              >
                <div className="flex justify-between items-start border-b border-card-border/50 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-text-primary">{signal.company}</h4>
                    <p className="text-xs text-text-secondary font-mono mt-1">Targeting: {signal.currentVendor} • {signal.source}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMessageSquare className="h-4 w-4 text-red-400" />
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{signal.sentiment}</span>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary italic">
                  {signal.quote}
                </p>
                
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Recommended Action</span>
                  <span className="text-sm font-bold text-text-primary">{signal.action}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
