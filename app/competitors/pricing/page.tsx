"use client";

import { motion } from 'framer-motion';
import { SFCreditcard as CreditCard } from 'sf-symbols-lib/monochrome';

const pricingData = [
  { vendor: 'Sphera', basePlatform: '£42,500/yr', perUser: '£85/yr', implementation: '£95,000+', dataMigration: '£12k Add-on', aiCapabilities: 'Separate SKU (£24k)' },
  { vendor: 'Intelex', basePlatform: '£38,200/yr', perUser: '£75/yr', implementation: '£75,000+', dataMigration: 'Included', aiCapabilities: 'Not Available' },
  { vendor: 'Empirisys', basePlatform: '£68,450/yr', perUser: 'Unlimited', implementation: 'Included', dataMigration: 'AI Automated', aiCapabilities: 'Core Feature' }
];

export default function PricingPackagingPage() {
  return (
    <div className="flex-1 w-full min-h-0 flex flex-col p-6 space-y-6 overflow-y-auto">
      
      <div className="bg-card/50 backdrop-blur-xl border border-card-border rounded-[32px] p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">Pricing & Packaging Analyzer</h2>
          <p className="text-sm text-text-secondary">Enterprise contract estimates based on scraped RFP data (Q2 2026).</p>
        </div>
        <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
          <CreditCard className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-xl border border-card-border rounded-[24px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border bg-panel/30">
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Vendor</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Base Platform</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Per-User License</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Implementation</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Data Migration</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Predictive AI</th>
            </tr>
          </thead>
          <tbody>
            {pricingData.map((data, idx) => (
              <motion.tr 
                key={data.vendor}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`border-b border-card-border transition-colors ${data.vendor === 'Empirisys' ? 'bg-accent/5' : 'hover:bg-panel/50'}`}
              >
                <td className="p-4">
                  <span className={`font-bold ${data.vendor === 'Empirisys' ? 'text-accent' : 'text-text-primary'}`}>{data.vendor}</span>
                </td>
                <td className="p-4 text-sm text-text-secondary">{data.basePlatform}</td>
                <td className="p-4 text-sm text-text-secondary">{data.perUser}</td>
                <td className="p-4 text-sm text-text-secondary">{data.implementation}</td>
                <td className="p-4 text-sm text-text-secondary">{data.dataMigration}</td>
                <td className="p-4 text-sm font-bold text-text-primary">{data.aiCapabilities}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-panel border border-card-border rounded-[24px] p-6">
        <h3 className="text-sm font-bold text-text-primary mb-2">Strategic Pricing Insight</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          While Empirisys has a higher base platform cost, eliminating per-user licensing and professional services for implementation makes the Total Cost of Ownership (TCO) 22% lower over a 3-year enterprise contract compared to Sphera.
        </p>
      </div>
    </div>
  );
}
