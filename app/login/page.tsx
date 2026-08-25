"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Shield, Loader2 } from 'lucide-react';
import HeroSection from '@/components/ui/HeroSection';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      <HeroSection 
        title="Command Center" 
        subtitle="Empirisys Intelligence Hub" 
      />
      
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 -mt-32">
        <div className="w-full max-w-md bg-card/40 backdrop-blur-md rounded-[24px] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20">
              <Shield className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">Secure Access</h2>
          <p className="text-white/50 text-center mb-8 text-sm">Please authenticate to access the Intelligence Command</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter system password"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm pl-1">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
