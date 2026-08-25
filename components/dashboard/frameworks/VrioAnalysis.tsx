'use client';

import { motion } from 'framer-motion';

export default function VrioAnalysis() {
  const vrioMetrics = [
    {
      capability: 'Predictive NLP Engine',
      sub: 'Domain-trained on safety-critical signals',
      v: true,
      r: true,
      i: true,
      o: true,
      advantage: 'Sustained Advantage',
      color: 'text-[#7AE03B] border-[#7AE03B]/30',
      bg: 'bg-[#7AE03B]/10',
    },
    {
      capability: 'Consulting Advisory Layer',
      sub: 'Expert guidance embedded in product',
      v: true,
      r: true,
      i: true,
      o: true,
      advantage: 'Sustained Advantage',
      color: 'text-[#7AE03B] border-[#7AE03B]/30',
      bg: 'bg-[#7AE03B]/10',
    },
    {
      capability: 'Real-Time Signal Pipeline',
      sub: 'Continuous market monitoring infrastructure',
      v: true,
      r: true,
      i: false,
      o: true,
      advantage: 'Temporary Advantage',
      color: 'text-amber-400 border-amber-400/30',
      bg: 'bg-amber-400/10',
    },
    {
      capability: 'Legacy Vendor APIs',
      sub: 'Bolt-on AI layers over old software',
      v: true,
      r: false,
      i: false,
      o: false,
      advantage: 'Competitive Parity',
      color: 'text-text-secondary border-text-secondary/30',
      bg: 'bg-card-border/50',
    },
  ];

  const Check = () => <span className="text-[#7AE03B] text-lg font-bold">✓</span>;
  const Cross = () => <span className="text-red-500 text-lg font-bold">✗</span>;

  return (
    <div className="w-full px-6 md:px-10 mb-20 mt-16 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h3 className="text-accent text-xs font-bold tracking-widest uppercase mb-2">
          Framework 03 • VRIO Capability Matrix
        </h3>
        <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Which advantages are actually durable.
        </h2>
        <p className="text-base text-text-secondary mt-2">
          Every capability graded on Value • Rarity • Imitability • Organization — sustainable
          advantage requires all four.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-card-border bg-card/30 glass-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-card-border bg-black/20">
              <th className="py-6 px-8 text-xs font-bold text-text-secondary uppercase tracking-widest">
                Capability
              </th>
              <th className="py-6 px-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-center">
                V
              </th>
              <th className="py-6 px-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-center">
                R
              </th>
              <th className="py-6 px-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-center">
                I
              </th>
              <th className="py-6 px-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-center">
                O
              </th>
              <th className="py-6 px-8 text-xs font-bold text-text-secondary uppercase tracking-widest text-right">
                Verdict
              </th>
            </tr>
          </thead>
          <tbody>
            {vrioMetrics.map((item, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-card-border/50 hover:bg-card/40 transition-colors"
              >
                <td className="py-6 px-8">
                  <p className="text-sm font-semibold text-text-primary">{item.capability}</p>
                  <p className="text-sm text-text-secondary mt-0.5">{item.sub}</p>
                </td>
                <td className="py-6 px-4 text-center">{item.v ? <Check /> : <Cross />}</td>
                <td className="py-6 px-4 text-center">{item.r ? <Check /> : <Cross />}</td>
                <td className="py-6 px-4 text-center">{item.i ? <Check /> : <Cross />}</td>
                <td className="py-6 px-4 text-center">{item.o ? <Check /> : <Cross />}</td>
                <td className="py-6 px-8 text-right">
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${item.color} ${item.bg}`}
                  >
                    {item.advantage}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
