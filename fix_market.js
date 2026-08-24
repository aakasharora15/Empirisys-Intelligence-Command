const fs = require('fs');

let code = fs.readFileSync('app/marketing/market-analyst/page.tsx', 'utf8');

if (!code.includes('import HeroSection')) {
  code = code.replace('import { Button }', 'import HeroSection from "@/components/ui/HeroSection";\nimport { Button }');
}

const originalHeader = `      {/* Header section with elite glassmorphic styling */}
      <motion.div variants={itemVariants} className="relative bg-white/40 bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-[var(--color-primary)]/5 overflow-hidden">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[11px] font-bold tracking-widest uppercase text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <div className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-primary)] text-black"></span>
                </div>
                Intelligence Engine Live
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 mb-3 pb-2">
              Market Analyst
            </h1>
            <p className="text-zinc-400 max-w-2xl text-[16px] leading-relaxed font-medium">
              Event-driven intelligence pipeline: Source Ingestion → Entity Extraction → Deterministic Scoring → Theme Aggregation → Strategic Interpretation
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleRunPipeline}
              disabled={isLoading}
              className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 px-6 h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Running Pipeline...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5 fill-current" />
                  Run Intelligence Pipeline
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>`;

const newHeader = `      <HeroSection 
        title="Market Analyst"
        subtitle="Event-driven intelligence pipeline: Source Ingestion → Entity Extraction → Deterministic Scoring → Theme Aggregation → Strategic Interpretation"
        moduleLabel="MARKETING INTELLIGENCE"
        belowContent={
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={handleRunPipeline}
              disabled={isLoading}
              className="rounded-full bg-accent text-white hover:bg-accent/80 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.2)] transition-all duration-300 px-6 h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Pipeline...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4 fill-current" />
                  Run Intelligence Pipeline
                </>
              )}
            </Button>
          </div>
        }
      />`;

// First replace the wrapper
code = code.replace(
`<motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-[1400px] mx-auto pb-20"
    >`,
`<div className="w-full flex flex-col pb-20 -mt-[116px]">
<motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-[1400px] w-full mx-auto pb-20 px-6 relative z-20"
    >`);

code = code.replace(originalHeader, newHeader);

// Close the extra div at the end
code = code.replace(/    <\/motion\.div>\n  \);\n}/, '    </motion.div>\n    </div>\n  );\n}');

fs.writeFileSync('app/marketing/market-analyst/page.tsx', code);

