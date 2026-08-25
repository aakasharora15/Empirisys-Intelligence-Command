import React, { useState } from 'react';
import { SFInfoCircle as Info, SFXmark as X } from 'sf-symbols-lib/monochrome';
import { cn } from '@/lib/utils';

interface ChartInfoButtonProps {
  title: string;
  description: string;
  metrics?: { label: string; desc: string }[];
}

export function ChartInfoButton({ title, description, metrics }: ChartInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-7 w-7 rounded-full flex items-center justify-center transition-all border',
          isOpen
            ? 'bg-card text-accent border-card-border shadow-sm'
            : 'bg-background text-text-secondary border-card-border hover:bg-accent/10 hover:text-accent hover:border-accent/30',
        )}
        title="View Chart Information"
      >
        <Info className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-10 w-72 bg-card/70 backdrop-blur-xl border border-card-border/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-text-secondary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-accent" />
              <h4 className="text-sm font-bold text-text-primary pr-6">{title}</h4>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mb-4">{description}</p>

            {metrics && metrics.length > 0 && (
              <div className="space-y-2 border-t border-card-border pt-3">
                <span className="text-micro font-bold text-text-secondary uppercase tracking-wider block">
                  How to read this data
                </span>
                {metrics.map((m, i) => (
                  <div
                    key={i}
                    className="bg-transparent rounded-lg p-2.5 border border-card-border/60"
                  >
                    <span className="text-micro font-bold text-text-primary block mb-0.5">
                      {m.label}
                    </span>
                    <span className="text-micro text-text-secondary leading-tight block">
                      {m.desc}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
