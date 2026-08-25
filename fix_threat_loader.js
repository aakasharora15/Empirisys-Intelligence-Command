const fs = require('fs');
let code = fs.readFileSync('app/marketing/threats/page.tsx', 'utf8');

if (!code.includes('import FunFactLoader')) {
  code = code.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport FunFactLoader from '@/components/ui/FunFactLoader';");
}

code = code.replace(
  /isLoading \?\n\s*<div className="flex justify-center py-20">\n\s*<Loader2 className="h-8 w-8 animate-spin text-zinc-500" \/>\n\s*<\/div>\n\s*: threats\.length === 0 \?\n\s*<div className="text-center py-10 text-zinc-500">No active threats detected\.<\/div>\n\s*:/,
  `isLoading ?\n              <div className="py-10">\n                <FunFactLoader message="Fetching Strategic Signals..." />\n              </div>\n              : threats.length === 0 ?\n              <div className="text-center py-10 text-zinc-500">No active threats detected.</div>\n              :`
);

fs.writeFileSync('app/marketing/threats/page.tsx', code);
