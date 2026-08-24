"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FilterBar } from "@/components/data/filter-bar";
import { ShieldAlert, Activity, ArrowRight, RefreshCw } from "lucide-react";
import HeroSection from "@/components/ui/HeroSection";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ThreatsPage() {
  const [threats, setThreats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<any | null>(null);

  const fetchThreats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/agent/threats");
      const data = await res.json();
      if (data.threats) {
        setThreats(data.threats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  const criticalThreatsCount = threats.filter(t => t.level === "critical").length;

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Threat Monitor"
        subtitle="Live AI tracking of high-priority competitor moves and regulatory risks."
        moduleLabel="MARKETING INTELLIGENCE"
        belowContent={
          <div className="flex items-center mt-4">
            <Button 
              onClick={fetchThreats} 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] rounded-full px-6"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
              {isLoading ? "Scanning Horizons..." : "Force Threat Scan"}
            </Button>
          </div>
        }
      />

      <div className="space-y-6 animate-in fade-in duration-500 w-full px-6 md:px-10 max-w-[1600px] mx-auto relative z-20">

      <FilterBar
        filters={[
          { id: "status", label: "Status", type: "select", options: [{ value: "critical", label: "Critical" }, { value: "high", label: "High" }] }
        ]}
      />

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2 text-lg">
              <ShieldAlert className="h-5 w-5" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-10 w-16 bg-red-200/50 dark:bg-red-900/50 animate-pulse rounded-md"></div>
            ) : (
              <div className="text-4xl font-bold text-red-700 dark:text-red-400">{criticalThreatsCount}</div>
            )}
            <p className="text-sm text-red-600/80 mt-2">Require immediate action plan</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Active Threats</CardTitle>
            <CardDescription>Live prioritized list of strategic risks identified by the AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start justify-between rounded-lg border border-zinc-200 p-4 animate-pulse">
                    <div className="flex gap-4 w-full">
                      <div className="h-5 w-5 bg-zinc-200 rounded-full mt-1"></div>
                      <div className="w-full">
                        <div className="h-5 w-1/3 bg-zinc-200 rounded-md mb-2"></div>
                        <div className="h-4 w-2/3 bg-zinc-200 rounded-md mb-4"></div>
                        <div className="flex gap-4">
                          <div className="h-3 w-24 bg-zinc-200 rounded-md"></div>
                          <div className="h-3 w-32 bg-zinc-200 rounded-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : threats.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">No active threats detected.</div>
              ) : (
                threats.map(threat => (
                  <div key={threat.id} className="flex items-start justify-between rounded-lg border border-zinc-200 dark:border-white/10 p-4">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        {threat.level === "critical" ? (
                          <Activity className="h-5 w-5 text-red-500" />
                        ) : (
                          <ShieldAlert className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-white">{threat.title}</h4>
                          {threat.level === "critical" ? (
                            <Badge variant="destructive">Critical</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900">High</Badge>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {threat.description}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs text-zinc-500 font-medium">
                          <span>Detected: {threat.timeAgo}</span>
                          <span>Source: {threat.source}</span>
                          <button 
                            onClick={() => setSelectedThreat(threat)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                          >
                            View analysis <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedThreat} onOpenChange={(open: boolean) => !open && setSelectedThreat(null)}>
        <DialogContent className="sm:max-w-[600px] bg-card/40 backdrop-blur-md border-zinc-200 dark:border-white/10">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              {selectedThreat?.level === "critical" ? (
                <Badge variant="destructive">Critical Threat</Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900">High Priority</Badge>
              )}
              <span className="text-xs text-zinc-500">Source: {selectedThreat?.source}</span>
            </div>
            <DialogTitle className="text-xl">{selectedThreat?.title}</DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400 pt-2">
              {selectedThreat?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="bg-zinc-50 dark:bg-white/5 p-4 rounded-lg border border-zinc-100 dark:border-white/5">
              <h4 className="font-semibold text-sm mb-2 text-zinc-900 dark:text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--color-primary)]" />
                AI Strategy Recommendation
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                The neural engine suggests immediate cross-functional review of this signal. Recommended actions include auditing compliance with the new parameters mentioned, preparing a responsive PR strategy, and monitoring primary competitors for reactionary moves.
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setSelectedThreat(null)}>Close</Button>
            <Button className="bg-[var(--color-primary)] hover:brightness-110 text-black text-white">Generate Full Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
