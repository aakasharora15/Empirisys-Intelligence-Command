"use client";

import { motion } from 'framer-motion';
import HeroSection from '@/components/ui/HeroSection';

export default function TechStackVulnerabilitiesPage() {
  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Tech Stack Vulnerabilities"
        subtitle="Architectural teardowns of legacy incumbents."
        moduleLabel="MODULE 02 PRODUCT INTELLIGENCE"
      />
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sphera */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">SpheraCloud Architecture</h3>
          <div className="space-y-4">
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-[#EF4444] mb-1">Monolithic Database</h4>
              <p className="text-xs text-text-secondary">Relies heavily on legacy SQL structures, making unstructured data ingestion (like hazard reports or natural language) incredibly slow and rigid.</p>
            </div>
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-[#F59E0B] mb-1">No Native Vector DB</h4>
              <p className="text-xs text-text-secondary">Unable to natively perform semantic search across safety manuals. They rely on basic keyword indexing.</p>
            </div>
          </div>
        </motion.div>

        {/* Intelex */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Intelex Architecture</h3>
          <div className="space-y-4">
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-[#EF4444] mb-1">On-Premises Technical Debt</h4>
              <p className="text-xs text-text-secondary">Many core modules still rely on their older on-prem architecture, requiring VPNs and complex networking for field workers to sync data.</p>
            </div>
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-accent mb-1">Empirisys Advantage</h4>
              <p className="text-xs text-text-secondary">Our cloud-native, edge-computing model allows immediate data sync and AI processing right on the mobile device, completely bypassing Intelex's network bottleneck.</p>
            </div>
          </div>
        </motion.div>

      </div>
      </div>
    </div>
  );
}
