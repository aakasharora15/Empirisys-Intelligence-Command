const fs = require('fs');
let code = fs.readFileSync('app/reporting/export/page.tsx', 'utf8');

if (!code.includes('import FunFactLoader')) {
  code = code.replace(
    "import { useStore } from '@/lib/store';",
    "import { useStore } from '@/lib/store';\nimport FunFactLoader from '@/components/ui/FunFactLoader';\nimport { useState } from 'react';"
  );
}

if (!code.includes('const [isGenerating')) {
  code = code.replace(
    "const { user } = useStore();",
    "const { user } = useStore();\n  const [isGenerating, setIsGenerating] = useState(false);\n\n  const handleGenerate = () => {\n    setIsGenerating(true);\n    setTimeout(() => setIsGenerating(false), 8000);\n  };\n"
  );
}

code = code.replace(
  /<button className="flex items-center gap-2 mx-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl transition-all shadow-xl shadow-accent\/20">/,
  `<button onClick={handleGenerate} className="flex items-center gap-2 mx-auto px-8 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl transition-all shadow-xl shadow-accent/20">`
);

code = code.replace(
  /      <motion\.div /g,
  `      {isGenerating ? (\n        <FunFactLoader message="Compiling Executive Briefing..." />\n      ) : (\n      <motion.div `
);

code = code.replace(
  /      <\/motion\.div>/g,
  `      </motion.div>\n      )}`
);

fs.writeFileSync('app/reporting/export/page.tsx', code);
