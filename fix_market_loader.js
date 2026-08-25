const fs = require('fs');
let code = fs.readFileSync('app/marketing/market-analyst/page.tsx', 'utf8');

if (!code.includes('import FunFactLoader')) {
  code = code.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport FunFactLoader from '@/components/ui/FunFactLoader';");
}

code = code.replace(
  /<div className="mt-12 py-24 flex flex-col items-center justify-center">\n\s*<Loader2 className="h-8 w-8 text-\[var\(--color-primary\)\] animate-spin mb-4" \/>\n\s*<p className="text-sm text-zinc-500 font-medium animate-pulse">Running full market intelligence pipeline\.\.\.<\/p>\n\s*<p className="text-\[10px\] text-zinc-400 mt-2 uppercase tracking-widest">This may take up to 30 seconds<\/p>\n\s*<\/div>/,
  `<div className="mt-12 py-10">\n            <FunFactLoader message="Compiling Analytics Dashboard..." />\n          </div>`
);

fs.writeFileSync('app/marketing/market-analyst/page.tsx', code);
