"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Search, Target, Zap, CheckCircle2, ShieldAlert, AlertTriangle, Briefcase, Lightbulb, Clock, Activity, Building2, X, Network } from "lucide-react";
import { IncidentIntelligence } from "@/types/domain";
import { LeadScoreProfile } from "@/lib/ai/lead-scoring/types";
import { FunFactLoader } from "@/components/ui/fun-fact-loader";
export function LeadScoringMatrix() {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<LeadScoreProfile | null>(null);
  const [liveIncidents, setLiveIncidents] = useState<IncidentIntelligence[]>([]);
  const [priorityTargets, setPriorityTargets] = useState<string[]>([]);

  useEffect(() => {
    fetchLiveIncidents();
  }, []);

  const fetchLiveIncidents = async () => {
    try {
      const res = await fetch('/api/agent/live-incidents');
      const data = await res.json();
      if (data.incidents) {
        setLiveIncidents(data.incidents);
        
        // Extract unique companies from live incidents to populate Priority Targets dynamically
        const companies = data.incidents
          .map((inc: any) => inc.clientDetails.split('-')[0].trim())
          .filter((val: string, ind: number, self: string[]) => self.indexOf(val) === ind)
          .slice(0, 4); // Take up to 4 recent targets
          
        if (companies.length > 0) {
          setPriorityTargets(companies);
        } else {
          setPriorityTargets(["BP", "Shell", "Balfour Beatty"]); // fallback
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyze = async (overrideCompanyName?: string) => {
    const targetCompany = overrideCompanyName || companyName;
    if (!targetCompany.trim()) return;
    
    setCompanyName(targetCompany);
    setIsLoading(true);
    setProfile(null); 
    try {
      const res = await fetch('/api/agent/lead-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: targetCompany }),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const clearReport = () => {
    setProfile(null);
    setCompanyName("");
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Search Engine (Synexis Neural Search) */}
      <div className="rounded-[32px] overflow-hidden bg-card/40 backdrop-blur-md shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/50 dark:border-white/5 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-400/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 dark:bg-violet-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="p-10 relative z-10 flex flex-col items-center text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-[20px] bg-gradient-to-br from-violet-500/20 to-cyan-400/20 flex items-center justify-center border border-violet-500/30 dark:border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
               <Network className="h-8 w-8 text-violet-500 dark:text-cyan-400" />
            </div>
          </div>
          <h3 className="text-[28px] font-bold text-zinc-900 dark:text-white mb-2">Client Acquisition Intelligence (CAI)</h3>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-[14px]">
            Search for a prospective client to instantly generate an AI-driven profile covering HSE compliance, strategic entry points, and competitive intelligence.
          </p>

          <div className="w-full max-w-2xl mx-auto mt-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-zinc-100 dark:bg-[#1A1525] rounded-2xl border border-zinc-200 shadow-inner dark:shadow-none dark:border-white/10 p-2">
              <Search className="h-6 w-6 text-zinc-600 dark:text-zinc-400 ml-4 mr-2" />
              <input 
                type="text"
                placeholder="e.g. Shell, BP, Balfour Beatty..."
                className="w-full bg-transparent border-none outline-none text-[16px] text-zinc-900 dark:text-white placeholder:text-zinc-600 dark:text-zinc-500 dark:placeholder:text-zinc-500 dark:text-zinc-400 p-2"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              {companyName && (
                <button onClick={clearReport} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-white mr-2">
                  <X className="h-5 w-5" />
                </button>
              )}
              <button 
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all flex items-center shrink-0"
                onClick={() => handleAnalyze()}
                disabled={isLoading || !companyName.trim()}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 fill-white" />}
                Analyse Client
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Priority Targets:</span>
            {priorityTargets.length === 0 ? (
              <span className="text-[11px] text-zinc-600 dark:text-zinc-500 italic">Extracting targets from recent pipelines...</span>
            ) : (
              priorityTargets.map((sample) => (
                <button 
                  key={sample} 
                  className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-[#2A233D] text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-transparent transition-colors"
                  onClick={() => handleAnalyze(sample)}
                >
                  {sample}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="animate-in fade-in duration-300">
          <FunFactLoader message="Compiling Client Acquisition Profile..." />
        </div>
      )}

      {/* Live Incident Feed */}
      {!profile && !isLoading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="flex items-center justify-center h-8 w-8 rounded-full bg-violet-500/20 text-cyan-500 border border-violet-500/30">
                 <Activity className="h-4 w-4 animate-pulse" />
               </div>
               <h3 className="text-[20px] font-bold text-zinc-900 dark:text-white">Active Signal Feed</h3>
             </div>
             <div className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div> Live Scanning
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveIncidents.map((incident) => {
              const hoursAgo = Math.floor((Date.now() - new Date(incident.dateTime).getTime()) / (1000 * 60 * 60));
              const timeString = hoursAgo < 24 ? `${Math.max(1, hoursAgo)}h ago` : `${Math.floor(hoursAgo / 24)}d ago`;
              const baseCompany = incident.clientDetails.split('-')[0].trim();

              return (
                <div key={incident.id} className="bg-card/40 backdrop-blur-md rounded-[24px] p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/50 dark:border-white/5 relative flex flex-col group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 to-violet-500"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-[18px] text-zinc-900 dark:text-white flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-cyan-500" />
                        {baseCompany}
                      </h4>
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-500 font-bold uppercase tracking-widest">{timeString}</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-[10px] uppercase border border-violet-500/20">{incident.incidentType}</span>
                  </div>
                  
                  <p className="text-[13px] text-zinc-600 dark:text-zinc-400 mb-5 line-clamp-3 leading-relaxed flex-1">
                    {incident.incidentDescription}
                  </p>
                  
                  <div className="bg-card/20 rounded-xl p-4 border border-zinc-200 dark:border-white/5 mb-5 flex items-center gap-3">
                     <Briefcase className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                     <div>
                       <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold block mb-0.5">Assigned Contractor</span>
                       <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-200">{incident.consultantHired}</span>
                     </div>
                  </div>
                  
                  <button 
                    className="w-full py-3 bg-zinc-100 dark:bg-[#2A233D] hover:bg-zinc-200 dark:hover:bg-[#322A4A] text-zinc-900 dark:text-white font-bold rounded-xl transition-all text-[13px] flex items-center justify-center border border-zinc-200 dark:border-transparent"
                    onClick={() => handleAnalyze(baseCompany)}
                  >
                    <Target className="h-4 w-4 mr-2 text-cyan-500" /> Analyse Client
                  </button>
                </div>
              );
            })}
            
            {liveIncidents.length === 0 && (
              <div className="col-span-2 text-center py-20 text-[13px] text-zinc-600 dark:text-zinc-500 font-bold">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-cyan-500" />
                Scanning global networks for anomalies...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comprehensive Analytical Report */}
      {profile && !isLoading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card/40 backdrop-blur-md p-6 rounded-[24px] border border-zinc-100 dark:border-white/5 shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 flex items-center justify-center border border-violet-500/30 dark:border-white/10">
                <Building2 className="h-7 w-7 text-violet-500 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-[24px] font-bold text-zinc-900 dark:text-white leading-none mb-1">
                  {profile.companyName}
                </h3>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest">{profile.industry} &bull; Verified Target</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex flex-col items-end bg-card/20 p-3 rounded-xl border border-zinc-100 dark:border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">BANT Qualification</span>
                <div className="flex items-center gap-2">
                   <div className="text-[24px] font-bold text-cyan-600 dark:text-cyan-400 leading-none">{profile.overallScore}</div>
                   <div className="text-[12px] text-zinc-600 dark:text-zinc-500 font-bold">/ 100</div>
                </div>
              </div>
              <button 
                className="p-3 rounded-xl bg-zinc-100 dark:bg-[#2A233D] text-zinc-600 dark:text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-colors border border-transparent dark:border-white/5"
                onClick={clearReport}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Intelligence Dossier */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* BANT Radial Metrics */}
              {profile.bant && (
                <div className="bg-card/40 backdrop-blur-md border border-zinc-100 dark:border-white/5 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-center w-full">
                    <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Budget</div>
                    <div className="text-[28px] font-bold text-emerald-500">{profile.bant.budget}</div>
                  </div>
                  <div className="h-10 w-px bg-zinc-200 dark:bg-white/10 hidden md:block"></div>
                  <div className="text-center w-full">
                    <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Authority</div>
                    <div className="text-[28px] font-bold text-violet-500">{profile.bant.authority}</div>
                  </div>
                  <div className="h-10 w-px bg-zinc-200 dark:bg-white/10 hidden md:block"></div>
                  <div className="text-center w-full">
                    <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Need</div>
                    <div className="text-[28px] font-bold text-orange-500">{profile.bant.need}</div>
                  </div>
                  <div className="h-10 w-px bg-zinc-200 dark:bg-white/10 hidden md:block"></div>
                  <div className="text-center w-full">
                    <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Timing</div>
                    <div className="text-[28px] font-bold text-cyan-500">{profile.bant.timing}</div>
                  </div>
                </div>
              )}

              {profile.incident && (
                <div className="bg-card/40 backdrop-blur-md border border-zinc-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-sm relative">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <ShieldAlert className="h-64 w-64 text-zinc-900 dark:text-white" />
                  </div>
                  
                  <div className="p-6 md:p-8 relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="flex items-center justify-center h-10 w-10 rounded-[14px] bg-red-500/10 text-red-500 border border-red-500/20">
                         <AlertTriangle className="h-5 w-5" />
                       </div>
                       <div>
                         <h4 className="text-[18px] font-bold text-zinc-900 dark:text-white">Anomaly Log Detected</h4>
                         <p className="text-[12px] text-zinc-600 dark:text-zinc-400">Classified Near-Miss Reconnaissance</p>
                       </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-8 items-start mb-8">
                      <div className="flex-1 space-y-6 w-full">
                        <div>
                          <h5 className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Official Designation</h5>
                          <p className="text-[20px] font-bold text-zinc-900 dark:text-white leading-snug">{profile.incident.incidentType}</p>
                        </div>
                        
                        <div className="bg-card/20 p-6 rounded-2xl border border-zinc-100 dark:border-white/5">
                          <h5 className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">Event Narrative</h5>
                          <p className="text-[14px] text-zinc-700 dark:text-zinc-300 leading-relaxed">{profile.incident.incidentDescription}</p>
                        </div>
                      </div>

                      <div className="w-full lg:w-72 space-y-4 shrink-0">
                        <div className="bg-card/20 p-5 rounded-2xl border border-zinc-100 dark:border-white/5">
                          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">Timestamp</span>
                          <div className="flex items-center text-[13px] font-bold text-zinc-900 dark:text-white">
                            <Clock className="h-4 w-4 mr-2 text-violet-500" />
                            {new Date(profile.incident.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                        </div>
                        <div className="bg-card/20 p-5 rounded-2xl border border-zinc-100 dark:border-white/5">
                          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">Operating Scenario</span>
                          <div className="flex items-center text-[13px] font-bold text-zinc-900 dark:text-white">
                            <Activity className="h-4 w-4 mr-2 text-cyan-500 shrink-0" />
                            <span className="line-clamp-2">{profile.incident.scenario}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-orange-500/20 rounded-lg shrink-0 text-orange-500">
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Regulatory Intervention</h5>
                          <p className="text-[13px] text-zinc-900 dark:text-white font-bold leading-snug">{profile.incident.regulatoryNotice}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Empirisys Strategy Board */}
            <div className="space-y-6">
              
              <div className="bg-card/40 backdrop-blur-md border border-zinc-100 dark:border-white/5 shadow-sm rounded-[32px] overflow-hidden">
                <div className="bg-card/20 p-6 border-b border-zinc-100 dark:border-white/5 flex items-center gap-3">
                  <Target className="h-5 w-5 text-cyan-500" />
                  <h3 className="text-[16px] font-bold text-zinc-900 dark:text-white">Deployment Strategy</h3>
                </div>
                
                <div className="p-6 space-y-8">
                  
                  {/* Recommended Product */}
                  <div className="bg-gradient-to-br from-violet-500/10 to-cyan-400/10 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden text-center">
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest block mb-2">Target Module</span>
                    <div className="text-[24px] font-bold text-zinc-900 dark:text-white leading-tight">{profile.recommendedProduct}</div>
                    <p className="text-[12px] text-zinc-600 dark:text-zinc-300 mt-3">{profile.rationale}</p>
                  </div>

                  {profile.displacementStrategy && (
                    <>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                          <Briefcase className="h-3 w-3" /> Incumbent Contractor
                        </span>
                        <div className="bg-card/20 px-4 py-3 rounded-xl border border-zinc-100 dark:border-white/5">
                          <p className="font-bold text-[14px] text-zinc-900 dark:text-white">{profile.displacementStrategy.incumbentConsultant}</p>
                          <p className="text-[12px] text-zinc-600 dark:text-zinc-500 mt-1">{profile.displacementStrategy.vulnerability}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                          <Lightbulb className="h-3 w-3" /> Synthesis Angle
                        </span>
                        <div className="bg-cyan-400/5 border border-cyan-400/20 p-5 rounded-xl">
                          <p className="text-[13px] text-zinc-800 dark:text-zinc-200 font-semibold italic leading-relaxed">
                            "{profile.displacementStrategy.pitchAngle}"
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* Risk Factors List */}
              <div className="bg-card/40 backdrop-blur-md border border-zinc-100 dark:border-white/5 shadow-sm rounded-[24px] p-6">
                <h3 className="text-[12px] font-bold text-zinc-600 dark:text-zinc-500 uppercase tracking-widest mb-4">Calculated Risk Vectors</h3>
                <ul className="space-y-3">
                  {profile.keyRiskFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] text-zinc-700 dark:text-zinc-300 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
