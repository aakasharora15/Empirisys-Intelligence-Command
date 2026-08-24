'use client';

import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import type { ElementType as LucideIcon } from 'react';
import { SFChartLineUptrendXyaxis as TrendingUp } from 'sf-symbols-lib/monochrome';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

export function StatCard({ title, value, icon: Icon, trend, colorClass, borderClass, bgClass }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      }
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "bg-[var(--color-card)] rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all relative overflow-hidden border border-[var(--color-border)] group",
      )}
    >
      <div className={cn("absolute top-0 left-0 right-0 h-[3px]", borderClass)} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl", bgClass, colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 text-[var(--color-lime)] bg-[var(--color-lime-light)] px-2 py-1 rounded-md text-xs font-semibold">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      </div>
      
      <div>
        <h3 className="text-[32px] font-bold text-[var(--color-text-primary)] mb-1 font-sans">{displayValue}</h3>
        <p className="text-caption font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{title}</p>
      </div>
    </motion.div>
  );
}
