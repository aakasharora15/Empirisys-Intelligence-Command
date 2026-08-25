'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const FUN_FACTS = [
  'We ran the largest-ever Process Safety Leadership Survey with Step Change in Safety, gathering input from 450 leaders across 73 organisations. 📊📈',
  "The founding of Empirisys was deeply personal: both founders were driven by their own family's experiences with serious industrial accidents. 🛡️🤝",
  "Our data science team includes a former professional chef. We're still trying to convince him to cook us lunch instead of writing Python scripts. 👨‍🍳🍝🐍",
  "The name Empirisys comes from combining 'Empirical' and 'Systems'. We believe in data-driven safety over guesswork. 💡⚙️",
];

interface FunFactLoaderProps {
  message?: string;
  className?: string;
}

export function FunFactLoader({
  message = 'Compiling Intelligence Dashboard...',
  className = '',
}: FunFactLoaderProps) {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Rotate facts every 4 seconds
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full max-w-lg mx-auto flex flex-col items-center justify-center p-8 ${className}`}
    >
      {/* Animated Spinner Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
        <div className="h-16 w-16 bg-card border border-accent/20 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(122,224,59,0.1)]">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </div>

      {/* Main Loading Message */}
      <motion.h3
        className="text-xl font-bold text-text-primary mb-8 text-center flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-accent text-2xl">✨</span> {message}
      </motion.h3>

      {/* Did You Know Box - Premium Dark UI Style */}
      <div className="w-full bg-card/40 backdrop-blur-xl border border-card-border rounded-2xl p-6 relative overflow-hidden">
        {/* Subtle top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4 text-center">
          Did you know?
        </h4>

        <div className="relative min-h-[80px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm md:text-base text-text-secondary text-center leading-relaxed font-medium"
            >
              &quot;{FUN_FACTS[factIndex]}&quot;
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
