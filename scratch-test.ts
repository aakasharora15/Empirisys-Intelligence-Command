import { runMarketIntelligencePipeline } from './lib/ai/market-intelligence/pipeline';

async function main() {
  try {
    const result = await runMarketIntelligencePipeline();
    if (result.landscape) {
    }
  } catch (err) {
    console.error("Pipeline failed:", err);
  }
}
main();
