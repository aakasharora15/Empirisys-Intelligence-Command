"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: ReactNode;
  subtitle: string;
  moduleLabel?: string;
  children?: ReactNode;
  belowContent?: ReactNode;
  className?: string;
}

export default function HeroSection({
  title,
  subtitle,
  moduleLabel,
  children,
  belowContent,
  className
}: HeroSectionProps) {
  return (
    <div className={cn(
      "w-full -mt-[84px] pt-[116px] pb-32 md:pb-36 relative overflow-x-clip",
      "bg-gradient-to-b from-[var(--hero-from)] via-[var(--hero-via)] to-transparent",
      className
    )}>
      {/* Soft ambient glow */}
      <div className="absolute top-[-30%] right-[15%] w-[400px] h-[400px] bg-accent/6 blur-[120px] rounded-full pointer-events-none ambient-glow" />
      <div className="absolute bottom-[-20%] left-[10%] w-[300px] h-[300px] bg-accent/4 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full px-6 md:px-10 flex flex-col">
        <div className="space-y-3">
          {moduleLabel && (
            <span className="inline-flex items-center gap-2 text-micro font-bold tracking-[0.1em] text-accent uppercase">
              <span className="w-5 h-px bg-accent/50" />
              {moduleLabel}
            </span>
          )}
          <h1 className="text-3xl md:text-[2.75rem] font-serif font-bold leading-[1.15] tracking-tight text-text-primary">
            {title}
          </h1>
          <p className="text-sm md:text-footnote text-text-secondary font-sans max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          {belowContent && (
            <div className="pt-3">
              {belowContent}
            </div>
          )}
        </div>

        {children && (
          <div className="mt-6 w-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
