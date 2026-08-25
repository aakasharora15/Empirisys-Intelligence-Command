'use client';

import React, { useState, useEffect } from 'react';
import {
  Loader2,
  Search,
  Target,
  Zap,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Briefcase,
  Lightbulb,
  Clock,
  Activity,
  Building2,
  X,
} from 'lucide-react';
import { IncidentIntelligence } from '@/types/domain';
import { LeadScoreProfile } from '@/lib/ai/lead-scoring/types';
import HeroSection from '@/components/ui/HeroSection';
import { FunFactLoader } from '@/components/ui/FunFactLoader';
export function LeadScoringMatrix() {
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<LeadScoreProfile | null>(null);
  const [liveIncidents, setLiveIncidents] = useState<IncidentIntelligence[]>([]);
  const [priorityTargets, setPriorityTargets] = useState<string[]>([]);
  const [now] = useState(() => Date.now());

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
          setPriorityTargets(['BP', 'Shell', 'Balfour Beatty']); // fallback
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLiveIncidents();
  }, []);

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
    setCompanyName('');
  };

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection
        title="Client Acquisition Intelligence (CAI)"
        subtitle="Search for a prospective client to instantly generate an AI-driven profile covering HSE compliance, strategic entry points, and competitive intelligence."
        moduleLabel="MARKETING INTELLIGENCE"
        belowContent={
          <div className="w-full max-w-2xl mt-8 relative group">
            <div className="absolute -inset-1 bg-[var(--color-primary)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-card/60 backdrop-blur-md rounded-2xl border border-card-border shadow-inner p-2">
              <Search className="h-6 w-6 text-text-secondary ml-4 mr-2" />
              <input
                type="text"
                placeholder="e.g. Shell, BP, Balfour Beatty..."
                className="w-full bg-transparent border-none outline-none text-[16px] text-text-primary placeholder:text-text-secondary p-2"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              {companyName && (
                <button
                  onClick={clearReport}
                  className="p-2 text-text-secondary hover:text-text-primary mr-2"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                className="px-6 py-3 bg-[var(--color-primary)] hover:brightness-110 text-text-alert font-bold rounded-xl shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] transition-all flex items-center shrink-0"
                onClick={() => handleAnalyze()}
                disabled={isLoading || !companyName.trim()}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-5 w-5 text-text-alert" />
                )}
                Analyse Client
              </button>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                Priority Targets:
              </span>
              {priorityTargets.length === 0 ? (
                <span className="text-[11px] text-text-secondary italic">
                  Extracting targets from recent pipelines...
                </span>
              ) : (
                priorityTargets.map((sample) => (
                  <button
                    key={sample}
                    className="px-3 py-1 rounded-full bg-card/60 backdrop-blur-md text-[11px] font-bold text-text-primary hover:bg-[var(--color-primary)] hover:text-text-alert border border-card-border transition-colors"
                    onClick={() => handleAnalyze(sample)}
                  >
                    {sample}
                  </button>
                ))
              )}
            </div>
          </div>
        }
      />

      <div className="space-y-8 max-w-[1600px] w-full mx-auto pb-10 px-6 md:px-10 relative z-20">
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
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
                <h3 className="text-[20px] font-bold text-text-primary">Active Signal Feed</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[11px] font-bold text-[var(--color-primary)] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></div>{' '}
                Live Scanning
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveIncidents.map((incident) => {
                const hoursAgo = Math.floor(
                  (now - new Date(incident.dateTime).getTime()) / (1000 * 60 * 60),
                );
                const timeString =
                  hoursAgo < 24
                    ? `${Math.max(1, hoursAgo)}h ago`
                    : `${Math.floor(hoursAgo / 24)}d ago`;
                const baseCompany = incident.clientDetails.split('-')[0].trim();

                return (
                  <div
                    key={incident.id}
                    className="bg-card/40 backdrop-blur-md rounded-[24px] p-6 border border-card-border relative flex flex-col group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)] opacity-80"></div>

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-[18px] text-text-primary flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
                          {baseCompany}
                        </h4>
                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                          {timeString}
                        </span>
                      </div>
                      <span className="px-2 py-1 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-[10px] uppercase border border-[var(--color-primary)]/20">
                        {incident.incidentType}
                      </span>
                    </div>

                    <p className="text-[13px] text-text-secondary mb-5 line-clamp-3 leading-relaxed flex-1">
                      {incident.incidentDescription}
                    </p>

                    <div className="bg-background/40 rounded-xl p-4 border border-card-border mb-5 flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-text-secondary" />
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold block mb-0.5">
                          Assigned Contractor
                        </span>
                        <span className="text-[13px] font-bold text-text-primary">
                          {incident.consultantHired}
                        </span>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 bg-card/60 hover:bg-[var(--color-primary)] hover:text-text-alert text-text-primary font-bold rounded-xl transition-all text-[13px] flex items-center justify-center border border-card-border"
                      onClick={() => handleAnalyze(baseCompany)}
                    >
                      <Target className="h-4 w-4 mr-2" /> Analyse Client
                    </button>
                  </div>
                );
              })}

              {liveIncidents.length === 0 && (
                <div className="col-span-2 py-10">
                  <FunFactLoader message="Scanning global networks for anomalies..." />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comprehensive Analytical Report */}
        {profile && !isLoading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card/40 backdrop-blur-md p-6 rounded-[24px] border border-card-border shadow-sm gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 border-card-border">
                  <Building2 className="h-7 w-7 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-[24px] font-bold text-text-primary leading-none mb-1">
                    {profile.companyName}
                  </h3>
                  <p className="text-[11px] text-text-secondary font-bold uppercase tracking-widest">
                    {profile.industry} &bull; Verified Target
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex flex-col items-end bg-card/20 p-3 rounded-xl border border-card-border">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">
                    BANT Qualification
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="text-[24px] font-bold text-[var(--color-primary)] leading-none">
                      {profile.overallScore}
                    </div>
                    <div className="text-[12px] text-text-secondary font-bold">/ 100</div>
                  </div>
                </div>
                <button
                  className="p-3 rounded-xl bg-card/50 text-text-secondary hover:text-red-500 text-text-secondary hover:text-red-400 transition-colors border border-transparent border-card-border"
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
                  <div className="bg-card/40 backdrop-blur-md border border-card-border rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center w-full">
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                        Budget
                      </div>
                      <div className="text-[28px] font-bold text-[var(--color-primary)]">
                        {profile.bant.budget}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-card-border hidden md:block"></div>
                    <div className="text-center w-full">
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                        Authority
                      </div>
                      <div className="text-[28px] font-bold text-[var(--color-primary)]">
                        {profile.bant.authority}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-card-border hidden md:block"></div>
                    <div className="text-center w-full">
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                        Need
                      </div>
                      <div className="text-[28px] font-bold text-[var(--color-primary)]">
                        {profile.bant.need}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-card-border hidden md:block"></div>
                    <div className="text-center w-full">
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">
                        Timing
                      </div>
                      <div className="text-[28px] font-bold text-[var(--color-primary)]">
                        {profile.bant.timing}
                      </div>
                    </div>
                  </div>
                )}

                {profile.incident && (
                  <div className="bg-card/40 backdrop-blur-md border border-card-border rounded-[32px] overflow-hidden shadow-sm relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                      <ShieldAlert className="h-64 w-64 text-text-primary" />
                    </div>

                    <div className="p-6 md:p-8 relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="flex items-center justify-center h-10 w-10 rounded-[14px] bg-red-500/10 text-red-500 border border-red-500/20">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-[18px] font-bold text-text-primary">
                            Anomaly Log Detected
                          </h4>
                          <p className="text-[12px] text-text-secondary">
                            Classified Near-Miss Reconnaissance
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-8 items-start mb-8">
                        <div className="flex-1 space-y-6 w-full">
                          <div>
                            <h5 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">
                              Official Designation
                            </h5>
                            <p className="text-[20px] font-bold text-text-primary leading-snug">
                              {profile.incident.incidentType}
                            </p>
                          </div>

                          <div className="bg-card/20 p-6 rounded-2xl border border-card-border">
                            <h5 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-3">
                              Event Narrative
                            </h5>
                            <p className="text-[14px] text-text-secondary text-text-primary leading-relaxed">
                              {profile.incident.incidentDescription}
                            </p>
                          </div>
                        </div>

                        <div className="w-full lg:w-72 space-y-4 shrink-0">
                          <div className="bg-card/20 p-5 rounded-2xl border border-card-border">
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">
                              Timestamp
                            </span>
                            <div className="flex items-center text-[13px] font-bold text-text-primary">
                              <Clock className="h-4 w-4 mr-2 text-[var(--color-primary)]" />
                              {new Date(profile.incident.dateTime).toLocaleString([], {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </div>
                          </div>
                          <div className="bg-card/20 p-5 rounded-2xl border border-card-border">
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">
                              Operating Scenario
                            </span>
                            <div className="flex items-center text-[13px] font-bold text-text-primary">
                              <Activity className="h-4 w-4 mr-2 text-[var(--color-primary)] shrink-0" />
                              <span className="line-clamp-2">{profile.incident.scenario}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-orange-500/20 rounded-lg shrink-0 text-[var(--color-primary)]">
                            <ShieldAlert className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="text-[11px] font-bold text-orange-600 text-orange-400 uppercase tracking-widest mb-1">
                              Regulatory Intervention
                            </h5>
                            <p className="text-[13px] text-text-primary font-bold leading-snug">
                              {profile.incident.regulatoryNotice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2: Empirisys Strategy Board */}
              <div className="space-y-6">
                <div className="bg-card/40 backdrop-blur-md border border-card-border shadow-sm rounded-[32px] overflow-hidden">
                  <div className="bg-card/20 p-6 border-b border-card-border flex items-center gap-3">
                    <Target className="h-5 w-5 text-[var(--color-primary)]" />
                    <h3 className="text-[16px] font-bold text-text-primary">Deployment Strategy</h3>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Recommended Product */}
                    <div className="bg-gradient-to-br bg-card/60 border border-card-border rounded-2xl p-6 relative overflow-hidden text-center">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">
                        Target Module
                      </span>
                      <div className="text-[24px] font-bold text-text-primary leading-tight">
                        {profile.recommendedProduct}
                      </div>
                      <p className="text-[12px] text-text-secondary text-text-primary mt-3">
                        {profile.rationale}
                      </p>
                    </div>

                    {profile.displacementStrategy && (
                      <>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="h-3 w-3" /> Incumbent Contractor
                          </span>
                          <div className="bg-card/20 px-4 py-3 rounded-xl border border-card-border">
                            <p className="font-bold text-[14px] text-text-primary">
                              {profile.displacementStrategy.incumbentConsultant}
                            </p>
                            <p className="text-[12px] text-text-secondary mt-1">
                              {profile.displacementStrategy.vulnerability}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest flex items-center gap-2">
                            <Lightbulb className="h-3 w-3" /> Synthesis Angle
                          </span>
                          <div className="bg-cyan-400/5 border border-cyan-400/20 p-5 rounded-xl">
                            <p className="text-[13px] text-text-primary text-text-primary font-semibold italic leading-relaxed">
                              "{profile.displacementStrategy.pitchAngle}"
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Risk Factors List */}
                <div className="bg-card/40 backdrop-blur-md border border-card-border shadow-sm rounded-[24px] p-6">
                  <h3 className="text-[12px] font-bold text-text-secondary uppercase tracking-widest mb-4">
                    Calculated Risk Vectors
                  </h3>
                  <ul className="space-y-3">
                    {profile.keyRiskFactors.map((factor, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-[13px] text-text-secondary text-text-primary font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
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
    </div>
  );
}
