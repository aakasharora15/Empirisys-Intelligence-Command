const fs = require('fs');
let code = fs.readFileSync('app/competitors/pricing/page.tsx', 'utf8');

if (!code.includes('import HeroSection')) {
  code = code.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport HeroSection from '@/components/ui/HeroSection';");
}

const badHeaderRegex = /<div className="flex-1 w-full min-h-0 flex flex-col p-6 space-y-6 overflow-y-auto">\n      \n      <div className="bg-card\/50 backdrop-blur-xl border border-card-border rounded-\[32px\] p-6 flex items-center justify-between">[\s\S]*?<\/div>\n      <\/div>/;

const newHeader = `<div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Pricing & Packaging Analyzer"
        subtitle="Enterprise contract estimates based on scraped RFP data (Q2 2026)."
        moduleLabel="MODULE 01 COMPETITOR INTELLIGENCE"
      />
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">`;

code = code.replace(badHeaderRegex, newHeader);

code = code.replace(/    <\/div>\n  \);\n}/, '      </div>\n    </div>\n  );\n}');

fs.writeFileSync('app/competitors/pricing/page.tsx', code);
