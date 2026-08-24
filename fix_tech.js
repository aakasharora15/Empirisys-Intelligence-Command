const fs = require('fs');
let code = fs.readFileSync('app/product/tech-stack/page.tsx', 'utf8');

if (!code.includes('import HeroSection')) {
  code = code.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport HeroSection from '@/components/ui/HeroSection';");
}

const badHeaderRegex = /<div className="flex-1 w-full min-h-0 flex flex-col p-6 space-y-6 overflow-y-auto">\n      \n      <div className="bg-card\/50 backdrop-blur-xl border border-card-border rounded-\[32px\] p-6">\n        <h2 className="text-xl font-bold text-text-primary mb-1">Tech Stack Vulnerabilities<\/h2>\n        <p className="text-sm text-text-secondary">Architectural teardowns of legacy incumbents.<\/p>\n      <\/div>/;

const newHeader = `<div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Tech Stack Vulnerabilities"
        subtitle="Architectural teardowns of legacy incumbents."
        moduleLabel="MODULE 02 PRODUCT INTELLIGENCE"
      />
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">`;

code = code.replace(badHeaderRegex, newHeader);

code = code.replace(/      <\/div>\n    <\/div>\n  \);\n}/, '      </div>\n      </div>\n    </div>\n  );\n}');

fs.writeFileSync('app/product/tech-stack/page.tsx', code);
