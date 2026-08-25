const fs = require('fs');

// 1. Fix live-incidents (Lead Scoring)
let liveInc = fs.readFileSync('app/api/agent/live-incidents/route.ts', 'utf8');
liveInc = liveInc.replace(
  `    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured.");
    }`,
  `    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key') {
      return NextResponse.json({
        incidents: [
          {
            id: 'mock-1',
            incidentType: 'Tier 1 Process Safety Near-Miss',
            consultantHired: 'ERM',
            pitchApproach: 'Pitch BOOST to integrate frontline worker safety logs directly into operational dashboards.',
            incidentDescription: 'High pressure alarm fatigue led to a near-miss containment loss on offshore rig.',
            regulatoryNotice: 'HSE Improvement Notice served',
            clientDetails: 'BP plc - North Sea Operations',
            scenario: 'Offshore Platform',
            dateTime: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'mock-2',
            incidentType: 'Safety Culture Degradation',
            consultantHired: 'dss+',
            pitchApproach: 'Propose SENSE to run automated deep-dives on safety culture metrics instead of manual surveys.',
            incidentDescription: 'Subcontractor accident rate spiked 40% after recent turnaround phase.',
            regulatoryNotice: 'Internal Audit Flag',
            clientDetails: 'Shell - Bacton Gas Terminal',
            scenario: 'Onshore Processing',
            dateTime: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      });
    }`
);
fs.writeFileSync('app/api/agent/live-incidents/route.ts', liveInc);

// 2. Fix Lead Scoring Pipeline (CAI) OPENAI check -> ANTHROPIC check
let leadPipeline = fs.readFileSync('lib/ai/lead-scoring/pipeline.ts', 'utf8');
leadPipeline = leadPipeline.replace(
  /if \(!process\.env\.OPENAI_API_KEY \|\| process\.env\.OPENAI_API_KEY === 'dummy_key' \|\| process\.env\.OPENAI_API_KEY\.includes\('your-openai-api-key'\)\) \{/g,
  `if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key' || process.env.ANTHROPIC_API_KEY.includes('your-anthropic-api-key')) {`
);
fs.writeFileSync('lib/ai/lead-scoring/pipeline.ts', leadPipeline);

// 3. Fix Market Analyst Pipeline to not crash if no API key
let marketPipeline = fs.readFileSync('lib/ai/market-intelligence/pipeline.ts', 'utf8');
if (!marketPipeline.includes("if (!process.env.ANTHROPIC_API_KEY")) {
  marketPipeline = marketPipeline.replace(
    /export async function runMarketIntelligencePipeline\(\): Promise<PipelineResult> \{\n  const anthropic = new Anthropic\(\{ apiKey: process\.env\.ANTHROPIC_API_KEY \}\);/,
    `export async function runMarketIntelligencePipeline(): Promise<PipelineResult> {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key') {
    throw new Error("ANTHROPIC_API_KEY_MISSING");
  }
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });`
  );
  fs.writeFileSync('lib/ai/market-intelligence/pipeline.ts', marketPipeline);
}
