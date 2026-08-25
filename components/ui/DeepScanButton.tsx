'use client';

import React, { useState } from 'react';
import {
  SFMagnifyingglass as ScanSearch,
  SFArrowClockwise as Loader2,
  SFCheckmarkCircle as CheckCircle2,
} from 'sf-symbols-lib/monochrome';
import { cn } from '@/lib/utils';

interface DeepScanButtonProps {
  label?: string;
  className?: string;
}

export function DeepScanButton({ label = 'Run Deep Scan', className }: DeepScanButtonProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');

  const handleScan = () => {
    setStatus('scanning');

    // Simulate a deep market/competitor scan
    setTimeout(() => {
      setStatus('complete');

      // Reset after showing success
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 4000);
  };

  return (
    <button
      onClick={handleScan}
      disabled={status === 'scanning'}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-sm',
        status === 'idle' && 'bg-accent text-[#0A1A10] hover:bg-accent-hover hover:shadow',
        status === 'scanning' && 'bg-background border border-card-border text-accent cursor-wait',
        status === 'complete' && 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]',
        className,
      )}
    >
      {status === 'idle' && (
        <>
          <ScanSearch className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
      {status === 'scanning' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Scanning live sources...</span>
        </>
      )}
      {status === 'complete' && (
        <>
          <CheckCircle2 className="h-4 w-4" />
          <span>Scan Complete</span>
        </>
      )}
    </button>
  );
}
