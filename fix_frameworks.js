const fs = require('fs');
let code = fs.readFileSync('app/frameworks/page.tsx', 'utf8');

if (!code.includes('import HeroSection')) {
  code = code.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport HeroSection from '@/components/ui/HeroSection';");
}

const badHeaderRegex = /<div className="flex-1 w-full min-h-0 flex flex-col p-6 space-y-6 overflow-y-auto">\n      \n      <div className="flex justify-between items-end border-b border-card-border pb-6">[\s\S]*?<\/div>\n      <\/div>/;

const newHeader = `<div className="pb-16 bg-background min-h-screen z-10 relative">
      <HeroSection 
        title="Strategic Frameworks"
        subtitle="Academic MBA-grade plotting of Empirisys vs. Legacy Incumbents (Sphera, Intelex)."
        moduleLabel="MODULE 03 FRAMEWORKS"
        belowContent={
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('porters')}
              className={\`px-4 py-2 rounded-xl text-sm font-bold transition-all \${activeTab === 'porters' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-panel text-text-secondary hover:text-text-primary'}\`}
            >
              Porter's Five Forces
            </button>
            <button
              onClick={() => setActiveTab('vrio')}
              className={\`px-4 py-2 rounded-xl text-sm font-bold transition-all \${activeTab === 'vrio' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-panel text-text-secondary hover:text-text-primary'}\`}
            >
              VRIO Matrix
            </button>
          </div>
        }
      />
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">`;

code = code.replace(badHeaderRegex, newHeader);

// It currently ends with `</AnimatePresence>\n    </div>\n  );\n}`
code = code.replace(/<\/AnimatePresence>\n    <\/div>/, '</AnimatePresence>\n      </div>\n    </div>');

fs.writeFileSync('app/frameworks/page.tsx', code);
