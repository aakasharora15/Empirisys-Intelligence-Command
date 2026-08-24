const fs = require('fs');
let code = fs.readFileSync('app/reporting/export/page.tsx', 'utf8');

if (!code.includes('import HeroSection')) {
  code = code.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport HeroSection from '@/components/ui/HeroSection';");
}

const badHeaderRegex = /<div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center p-6 space-y-6 overflow-y-auto">\n      \n      <motion\.div /;

const newHeader = `<div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Board-Level Export"
        subtitle="Instantly synthesize Q2 2026 data across all modules into a highly polished, print-ready PDF presentation."
        moduleLabel="MODULE 04 REPORTING"
      />
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20 flex flex-col items-center mt-12">
      
      <motion.div `;

code = code.replace(badHeaderRegex, newHeader);

// It has:
//         <h2 className="text-2xl font-bold text-text-primary mb-4">Board-Level Export Generator</h2>
//         <p className="text-sm text-text-secondary leading-relaxed mb-8">
//           Instantly synthesize Q2 2026 data across all modules (Competitor Intel, Market Signals, Churn Risk) into a highly polished, print-ready PDF presentation.
//         </p>
// We should remove this since it's in the HeroSection now.

code = code.replace(/<h2 className="text-2xl font-bold text-text-primary mb-4">Board-Level Export Generator<\/h2>\n        <p className="text-sm text-text-secondary leading-relaxed mb-8">[\s\S]*?<\/p>/, '');

code = code.replace(/    <\/div>\n  \);\n}/, '      </div>\n    </div>\n  );\n}');

fs.writeFileSync('app/reporting/export/page.tsx', code);
