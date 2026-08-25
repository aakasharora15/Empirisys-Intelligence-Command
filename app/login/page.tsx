"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import HeroSection from '@/components/ui/HeroSection';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      <HeroSection 
        title="Empirisys Intelligence Hub" 
        subtitle="Authentication integration in progress" 
      />
      
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 -mt-32">
        <div className="w-full max-w-md bg-card/40 backdrop-blur-md rounded-[24px] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"></div>
          
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="mb-4">
              <Logo className="h-10 w-auto text-text-primary" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">Command Center</h2>
          <p className="text-white/50 text-center mb-8 text-sm">
            Google OAuth and Supabase authentication modules are currently being integrated.
          </p>
          
          <form onSubmit={handleEnter} className="space-y-6">
            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Demo Mode</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
