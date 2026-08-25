'use client';

import { useState } from 'react';
import HeroSection from '@/components/ui/HeroSection';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user, updateUser, colorTheme, setColorTheme } = useStore();

  // Competitor Discovery Settings
  const [autoDiscovery, setAutoDiscovery] = useState(true);
  const [autoPromote, setAutoPromote] = useState(false);
  const [scanFrequency, setScanFrequency] = useState('weekly');
  const [focusKeywords, setFocusKeywords] = useState(
    'process safety, HSE analytics, safety culture software, COMAH compliance',
  );

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      {/* Hero Header */}
      <HeroSection
        title={
          <span className="flex items-center gap-2">
            <span>System Configuration &</span>
            <span className="text-accent italic font-serif">Preferences.</span>
          </span>
        }
        subtitle="Manage your profile, adjust active intelligence modules, and tune the AI discovery engine parameters."
      />

      {/* Main Container */}
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">
        {/* Profile Card */}
        <div className="glass-card p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-card-border pb-2">
            Personal Information
          </h3>
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl font-black shrink-0 border border-accent/20 shadow-inner">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-micro font-bold text-text-secondary uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => updateUser({ name: e.target.value })}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-micro font-bold text-text-secondary uppercase tracking-wider">
                  Job Role
                </label>
                <input
                  type="text"
                  value={user.role}
                  onChange={(e) => updateUser({ role: e.target.value })}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-micro font-bold text-text-secondary uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => updateUser({ email: e.target.value })}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme & Appearance */}
        <div className="glass-card p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Theme & Appearance
            </h3>
          </div>

          <div className="flex flex-col gap-6 pt-2">
            {/* Color Theme Selector */}
            <div className="space-y-4">
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">
                Accent Color
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'green', name: 'Empirisys Green', bgClass: 'bg-[#00C2A8]' },
                  { id: 'blue', name: 'Corporate Blue', bgClass: 'bg-[#3B82F6]' },
                  { id: 'orange', name: 'Strategic Orange', bgClass: 'bg-[#F97316]' },
                  { id: 'purple', name: 'Intelligence Purple', bgClass: 'bg-[#8B5CF6]' },
                  { id: 'yellow', name: 'Alert Yellow', bgClass: 'bg-[#EAB308]' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      setColorTheme(
                        t.id as 'default' | 'ocean' | 'forest' | 'sunset' | 'monochrome',
                      )
                    }
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all w-28',
                      colorTheme === t.id
                        ? 'border-text-primary bg-accent/5 shadow-sm'
                        : 'border-card-border hover:border-text-secondary bg-background',
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-full shadow-inner', t.bgClass)} />
                    <span className="text-micro font-bold text-text-primary text-center">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Discovery AI Engine */}
        <div className="glass-card p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Competitor Discovery AI Engine
            </h3>
            <span className="px-2 py-0.5 rounded text-micro font-bold uppercase bg-accent/10 text-accent">
              Active
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
            Configure how the system automatically scans the web for emerging threats, new entrants,
            and stealth mode startups in the process safety and HSE software space.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-primary mb-1">
                    Enable AI Auto-Discovery
                  </h4>
                  <p className="text-micro text-text-secondary">
                    Run background scans on Google News, G2, and Crunchbase
                  </p>
                </div>
                <button
                  onClick={() => setAutoDiscovery(!autoDiscovery)}
                  className={cn(
                    'w-10 h-5 rounded-full transition-colors relative',
                    autoDiscovery ? 'bg-accent' : 'bg-card-border',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                      autoDiscovery ? 'left-[22px]' : 'left-0.5',
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-primary mb-1">
                    Auto-promote High Confidence Threats
                  </h4>
                  <p className="text-micro text-text-secondary">
                    If AI confidence is &gt; 90%, add directly to tracking matrix
                  </p>
                </div>
                <button
                  onClick={() => setAutoPromote(!autoPromote)}
                  className={cn(
                    'w-10 h-5 rounded-full transition-colors relative',
                    autoPromote ? 'bg-accent' : 'bg-card-border',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                      autoPromote ? 'left-[22px]' : 'left-0.5',
                    )}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-micro font-bold text-text-secondary uppercase tracking-wider">
                  Scan Frequency
                </label>
                <select
                  value={scanFrequency}
                  onChange={(e) => setScanFrequency(e.target.value)}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly (Monday 06:00 UTC)</option>
                  <option value="monthly">Monthly (1st day of month)</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-micro font-bold text-text-secondary uppercase tracking-wider">
                  Focus Keywords (comma separated)
                </label>
                <textarea
                  value={focusKeywords}
                  onChange={(e) => setFocusKeywords(e.target.value)}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent min-h-[60px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
