const fs = require('fs');

let code = fs.readFileSync('app/marketing/threats/page.tsx', 'utf8');

if (!code.includes('import HeroSection')) {
  code = code.replace('import { Button }', 'import HeroSection from "@/components/ui/HeroSection";\nimport { Button }');
}

const originalHeader = `      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Threat Monitor"
          description="Live AI tracking of high-priority competitor moves and regulatory risks."
        />
        <Button 
          onClick={fetchThreats} 
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          <RefreshCw className={\`mr-2 h-4 w-4 \${isLoading ? 'animate-spin' : ''}\`} /> 
          {isLoading ? "Scanning Horizons..." : "Force Threat Scan"}
        </Button>
      </div>`;

const newHeader = `      <HeroSection 
        title="Threat Monitor"
        subtitle="Live AI tracking of high-priority competitor moves and regulatory risks."
        moduleLabel="MARKETING INTELLIGENCE"
        belowContent={
          <div className="flex items-center mt-4">
            <Button 
              onClick={fetchThreats} 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] rounded-full px-6"
            >
              <RefreshCw className={\`mr-2 h-4 w-4 \${isLoading ? 'animate-spin' : ''}\`} /> 
              {isLoading ? "Scanning Horizons..." : "Force Threat Scan"}
            </Button>
          </div>
        }
      />`;

// First replace the wrapper
code = code.replace(
`<div className="space-y-6 animate-in fade-in duration-500">`,
`<div className="w-full flex flex-col pb-20 -mt-[116px]">
<div className="space-y-6 animate-in fade-in duration-500 w-full px-6 md:px-10 max-w-[1600px] mx-auto relative z-20">`);

code = code.replace(originalHeader, newHeader);

// Close the extra div at the end
code = code.replace(/    <\/div>\n  \);\n}/, '    </div>\n    </div>\n  );\n}');

fs.writeFileSync('app/marketing/threats/page.tsx', code);

