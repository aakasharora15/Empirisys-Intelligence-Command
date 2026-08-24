"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useStore } from "@/lib/store";
import { 
  SFSquareGrid2x2 as Grid, 
  SFShield as Shield, 
  SFEye as Eye, 
  SFDesktopcomputer as Bot, 
  SFCylinderSplit1x2 as Database, 
  SFChartBar as ChartBar,
  SFFolder as FolderBadge,
  SFPencil as DocText,
  SFCreditcard as CreditCard,
  SFRadio as Radio,
  SFMoon as Moon,
  SFSunMax as Sun
} from 'sf-symbols-lib/monochrome';
import { useTheme } from "next-themes";

export function CommandPalette({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const { toggleAssistant } = useStore();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh]">
      <div 
        className="w-full max-w-[600px] bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command 
          className="w-full flex flex-col"
          loop
          shouldFilter={true}
        >
          <div className="flex items-center border-b border-white/5 px-4 h-14">
            <Command.Input 
              autoFocus
              placeholder="Type a command or search..." 
              className="flex-1 bg-transparent border-none outline-none text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] h-full"
            />
            <button 
              onClick={() => setOpen(false)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] text-xs font-medium px-2 py-1 bg-white/5 rounded"
            >
              ESC
            </button>
          </div>
          
          <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="py-6 text-center text-sm text-[var(--color-text-muted)]">No results found.</Command.Empty>

            <Command.Group heading="Command Center" className="px-2 py-1 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer mt-1"
              >
                <Grid className="w-4 h-4" /> Executive Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/frameworks'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer"
              >
                <ChartBar className="w-4 h-4" /> Strategic Frameworks
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Competitor Intel" className="px-2 py-1 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-2">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/competitors'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer mt-1"
              >
                <FolderBadge className="w-4 h-4" /> Competitor Directory
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/competitors/battlecards'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer"
              >
                <DocText className="w-4 h-4" /> Sales Battlecards
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/competitors/pricing'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer"
              >
                <CreditCard className="w-4 h-4" /> Pricing & Packaging
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Marketing Intelligence" className="px-2 py-1 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-2">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/marketing/lead-scoring'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer mt-1"
              >
                <Shield className="w-4 h-4" /> Lead Scoring (BANT)
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/marketing/market-analyst'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer"
              >
                <Eye className="w-4 h-4" /> Market Analyst
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/marketing/threats'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer"
              >
                <Radio className="w-4 h-4" /> Threat Monitor
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions" className="px-2 py-1 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-2">
              <Command.Item 
                onSelect={() => runCommand(() => toggleAssistant())}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer mt-1"
              >
                <Bot className="w-4 h-4" /> Toggle AI Knowledge Assistant
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-primary)] aria-selected:bg-[var(--color-primary)]/20 aria-selected:text-[var(--color-primary)] cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Toggle Theme
              </Command.Item>
            </Command.Group>
            
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
