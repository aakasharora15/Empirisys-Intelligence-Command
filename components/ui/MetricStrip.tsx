"use client";

import { cn } from "@/lib/utils";

export interface Metric {
  label: string;
  value: string | number;
  badge?: {
    text: string;
    variant: "lime" | "amber" | "danger" | "purple" | "teal" | "muted";
  };
}

interface MetricStripProps {
  metrics: Metric[];
  className?: string;
}

const badgeVariants = {
  lime: "bg-highlight/10 text-highlight border-highlight/20",
  amber: "bg-accent/10 text-accent border-accent/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  purple: "bg-accent/10 text-accent border-accent/20",
  teal: "bg-highlight/10 text-highlight border-highlight/20",
  muted: "bg-background text-text-secondary border-panel",
};

export default function MetricStrip({ metrics, className }: MetricStripProps) {
  return (
    <div className={cn(
      "w-full bg-card rounded-xl border border-panel shadow-sm flex overflow-x-auto hide-scrollbar",
      className
    )}>
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={cn(
            "flex-1 min-w-[140px] p-4 flex flex-col justify-center relative",
            index !== metrics.length - 1 && "border-r border-panel"
          )}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="text-caption font-medium text-text-secondary uppercase tracking-wider truncate">
              {metric.label}
            </p>
            {metric.badge && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-micro font-bold uppercase tracking-wider border",
                badgeVariants[metric.badge.variant]
              )}>
                {metric.badge.text}
              </span>
            )}
          </div>
          <p className="text-2xl font-black text-text-primary font-sans">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
