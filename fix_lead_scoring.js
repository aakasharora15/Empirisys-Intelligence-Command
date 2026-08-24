const fs = require('fs');

let code = fs.readFileSync('app/marketing/lead-scoring/_components/lead-scoring-matrix.tsx', 'utf8');

if (!code.includes('import HeroSection')) {
  code = code.replace('import { FunFactLoader }', 'import HeroSection from "@/components/ui/HeroSection";\nimport { FunFactLoader }');
}

const originalHeader = `      {/* Search Engine (Synexis Neural Search) */}
      <div className="rounded-[32px] overflow-hidden bg-card/40 backdrop-blur-md shadow-xl shadow-zinc-200/50 shadow-none border border-zinc-200/50 border-white/5 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5  rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-primary)]/5  rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="p-10 relative z-10 flex flex-col items-center text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-[20px] bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20 border-white/10 ">
               <Network className="h-8 w-8 text-[var(--color-primary)]" />
            </div>
          </div>
          <h3 className="text-[28px] font-bold text-white mb-2">Client Acquisition Intelligence (CAI)</h3>
          <p className="text-zinc-400 max-w-xl mx-auto text-[14px]">
            Search for a prospective client to instantly generate an AI-driven profile covering HSE compliance, strategic entry points, and competitive intelligence.
          </p>

          <div className="w-full max-w-2xl mx-auto mt-8 relative group">
            <div className="absolute -inset-1 bg-[var(--color-primary)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-card/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner p-2">
              <Search className="h-6 w-6 text-zinc-400 ml-4 mr-2" />
              <input 
                type="text"
                placeholder="e.g. Shell, BP, Balfour Beatty..."
                className="w-full bg-transparent border-none outline-none text-[16px] text-white placeholder:text-zinc-500 p-2"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              {companyName && (
                <button onClick={clearReport} className="p-2 text-zinc-400 hover:text-white mr-2">
                  <X className="h-5 w-5" />
                </button>
              )}
              <button 
                className="px-6 py-3 bg-[var(--color-primary)] hover:brightness-110 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] transition-all flex items-center shrink-0"
                onClick={() => handleAnalyze()}
                disabled={isLoading || !companyName.trim()}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 text-black" />}
                Analyse Client
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Priority Targets:</span>
            {priorityTargets.length === 0 ? (
              <span className="text-[11px] text-zinc-500 italic">Extracting targets from recent pipelines...</span>
            ) : (
              priorityTargets.map((sample) => (
                <button 
                  key={sample} 
                  className="px-3 py-1 rounded-full bg-card/60 backdrop-blur-md text-[11px] font-bold text-zinc-300 hover:bg-[var(--color-primary)] hover:text-black border border-white/5 transition-colors"
                  onClick={() => handleAnalyze(sample)}
                >
                  {sample}
                </button>
              ))
            )}
          </div>
        </div>
      </div>`;

const newHeader = `      <HeroSection 
        title="Client Acquisition Intelligence (CAI)"
        subtitle="Search for a prospective client to instantly generate an AI-driven profile covering HSE compliance, strategic entry points, and competitive intelligence."
        moduleLabel="MARKETING INTELLIGENCE"
        belowContent={
          <div className="w-full max-w-2xl mt-8 relative group">
            <div className="absolute -inset-1 bg-[var(--color-primary)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-card/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner p-2">
              <Search className="h-6 w-6 text-zinc-400 ml-4 mr-2" />
              <input 
                type="text"
                placeholder="e.g. Shell, BP, Balfour Beatty..."
                className="w-full bg-transparent border-none outline-none text-[16px] text-white placeholder:text-zinc-500 p-2"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              {companyName && (
                <button onClick={clearReport} className="p-2 text-zinc-400 hover:text-white mr-2">
                  <X className="h-5 w-5" />
                </button>
              )}
              <button 
                className="px-6 py-3 bg-[var(--color-primary)] hover:brightness-110 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] transition-all flex items-center shrink-0"
                onClick={() => handleAnalyze()}
                disabled={isLoading || !companyName.trim()}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 text-black" />}
                Analyse Client
              </button>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Priority Targets:</span>
              {priorityTargets.length === 0 ? (
                <span className="text-[11px] text-zinc-500 italic">Extracting targets from recent pipelines...</span>
              ) : (
                priorityTargets.map((sample) => (
                  <button 
                    key={sample} 
                    className="px-3 py-1 rounded-full bg-card/60 backdrop-blur-md text-[11px] font-bold text-zinc-300 hover:bg-[var(--color-primary)] hover:text-black border border-white/5 transition-colors"
                    onClick={() => handleAnalyze(sample)}
                  >
                    {sample}
                  </button>
                ))
              )}
            </div>
          </div>
        }
      />`;

// First replace the wrapper
code = code.replace(
`<div className="space-y-8 pb-10">`,
`<div className="w-full flex flex-col pb-20 -mt-[116px]">
<div className="space-y-8 max-w-[1600px] w-full mx-auto pb-10 px-6 md:px-10 relative z-20">`);

code = code.replace(originalHeader, newHeader);

// Close the extra div at the end
code = code.replace(/    <\/div>\n  \);\n}/, '    </div>\n    </div>\n  );\n}');

fs.writeFileSync('app/marketing/lead-scoring/_components/lead-scoring-matrix.tsx', code);

