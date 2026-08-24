const fs = require('fs');
let code = fs.readFileSync('app/competitors/battlecards/page.tsx', 'utf8');

if (!code.includes('import HeroSection')) {
  code = code.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport HeroSection from '@/components/ui/HeroSection';");
}

const badRegex = /<div className="flex-1 w-full min-h-0 flex flex-col p-6 space-y-6">\n      \n      \{\/\* Tabs \*\/}\n      <div className="flex gap-4 border-b border-card-border pb-4">/;

const newCode = `<div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Sales Battlecards"
        subtitle="Tactical, on-the-ground intelligence for displacing legacy incumbents."
        moduleLabel="MODULE 01 COMPETITOR INTELLIGENCE"
        belowContent={
          <div className="flex gap-4 mt-4">`;

code = code.replace(badRegex, newCode);

// The tabs end with:
//         ))}
//       </div>
// 
//       {/* Battlecard Content */}

code = code.replace(/        \)\)}\n      <\/div>\n\n      \{\/\* Battlecard Content \*\/\}/, `        ))}\n          </div>\n        }\n      />\n\n      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">\n      {/* Battlecard Content */}`);

code = code.replace(/<\/AnimatePresence>\n    <\/div>/, '</AnimatePresence>\n      </div>\n    </div>');

fs.writeFileSync('app/competitors/battlecards/page.tsx', code);
