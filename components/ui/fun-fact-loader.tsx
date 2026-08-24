"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SFDotCrosshair as Crosshair } from 'sf-symbols-lib/monochrome';

interface FunFactLoaderProps {
  message?: string;
  className?: string;
}

export function FunFactLoader({ message = "AI Agents scanning parameters...", className = "" }: FunFactLoaderProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] w-full p-8 ${className}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative max-w-md w-full bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-2xl overflow-hidden"
      >
        {/* Scanning Line overlay */}
        <motion.div 
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-[var(--color-primary)]/40 blur-sm z-0"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center mb-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-[var(--color-primary)]/50 rounded-full"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-10 w-10 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center border border-[var(--color-primary)]/40"
            >
              <Crosshair className="h-5 w-5 text-[var(--color-primary)] animate-pulse" />
            </motion.div>
          </div>

          <h3 className="text-sm font-black text-[var(--color-primary)] mb-2 tracking-[0.15em] uppercase font-mono flex items-center gap-2">
            System Processing
          </h3>
          
          <p className="text-xs text-[var(--color-text-secondary)] font-mono tracking-wider h-6">
            {message}{dots}
          </p>

          <div className="w-full mt-6 bg-background/50 h-1.5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="h-full bg-[var(--color-primary)] rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
