const fs = require('fs');
let code = fs.readFileSync('app/marketing/lead-scoring/_components/lead-scoring-matrix.tsx', 'utf8');

if (!code.includes('import FunFactLoader')) {
  code = code.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport FunFactLoader from '@/components/ui/FunFactLoader';");
}

code = code.replace(
  /<div className="col-span-2 text-center py-20 text-\[13px\] text-zinc-500 font-bold">\n\s*<Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-\[var\(--color-primary\)\]" \/>\n\s*Scanning global networks for anomalies\.\.\.\n\s*<\/div>/,
  `<div className="col-span-2 py-10">\n                <FunFactLoader message="Scanning global networks for anomalies..." />\n              </div>`
);

code = code.replace(
  /<div className="text-center py-20">\n\s*<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-\[var\(--color-primary\)\]" \/>\n\s*<p className="text-zinc-400 font-medium">Extracting client telemetry\.\.\.<\/p>\n\s*<\/div>/,
  `<div className="py-10">\n              <FunFactLoader message="Extracting client telemetry..." />\n            </div>`
);

fs.writeFileSync('app/marketing/lead-scoring/_components/lead-scoring-matrix.tsx', code);
