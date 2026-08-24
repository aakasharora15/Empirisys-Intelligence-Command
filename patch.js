const fs = require('fs');
const file = 'app/marketing/lead-scoring/_components/lead-scoring-matrix.tsx';
let code = fs.readFileSync(file, 'utf8');

// Insert import
if (!code.includes('import HeroSection')) {
  code = code.replace('import { FunFactLoader }', 'import HeroSection from "@/components/ui/HeroSection";\nimport { FunFactLoader }');
}

// Replace top card with HeroSection
const topCardRegex = /<div className="rounded-\[32px\] overflow-hidden bg-card\/40 backdrop-blur-md shadow-xl shadow-zinc-200\/50 shadow-none border border-zinc-200\/50 border-white\/5 relative">[\s\S]*?<div className="w-full max-w-2xl mx-auto mt-8 relative group">/;
const newTop = `
      <HeroSection 
        title="Client Acquisition Intelligence (CAI)"
        subtitle="Search for a prospective client to instantly generate an AI-driven profile covering HSE compliance, strategic entry points, and competitive intelligence."
        moduleLabel="MARKETING INTELLIGENCE"
        belowContent={
          <div className="w-full max-w-2xl mt-8 relative group">
`;

code = code.replace(topCardRegex, newTop);

// Fix closing tags for the old top card
const oldBottomRegex = /<div className="flex items-center justify-center gap-3 mt-6">[\s\S]*?<\/div>\n        <\/div>\n      <\/div>/;
const newBottom = `<div className="flex items-center gap-3 mt-6">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Priority Targets:</span>
            <span className="text-[11px] text-zinc-400">Extracting targets from recent pipelines...</span>
          </div>
        }
      />
      
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto -mt-8 relative z-20">`;

code = code.replace(/<div className="flex items-center justify-center gap-3 mt-6">[\s\S]*?<\/div>\n        <\/div>\n      <\/div>/, newBottom);

// Close the new wrapper div at the end of return
code = code.replace(/    <\/div>\n  \);\n}/, '    </div>\n    </div>\n  );\n}');

fs.writeFileSync(file, code);
