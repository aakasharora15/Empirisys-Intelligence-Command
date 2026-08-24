import { NextResponse } from 'next/server';

export const maxDuration = 300; // Allow 5 mins for AI discovery scan

// Vercel Cron configuration (requires vercel.json in root for actual triggering, but defined here for reference)
// "crons": [{ "path": "/api/discover-competitors", "schedule": "0 6 * * 1" }]

const DISCOVERY_PROMPT = `
You are a competitor intelligence AI agent for Empirisys. 
Your task is to scan live web sources (Google News, G2, Crunchbase, etc.) and identify emerging threats in the process safety, HSE analytics, and safety culture software space.

Focus strictly on:
1. Startups entering the process safety software space.
2. Legacy consulting firms launching new digital SaaS HSE products.
3. Enterprise expansions (e.g., generic EHS platforms acquiring process safety features).
4. Any AI safety tech claiming natural language processing of unstructured logs.

Output your findings as a JSON array where each object matches this interface:
{
  "company_name": "Name",
  "website": "URL",
  "why_flagged": "Reason and source citation",
  "source": "Source (e.g., TechCrunch, LinkedIn)",
  "confidence_score": 0-100,
  "status": "EMERGING" | "WATCHLIST"
}
`;

export async function GET(request: Request) {
  try {
    // Check for cron authorization or API key in a production environment
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("Triggering AI Competitor Discovery...");
    console.log("System Prompt: ", DISCOVERY_PROMPT);

    // TODO: Wire up actual fetch to Anthropic Claude using process.env.ANTHROPIC_API_KEY
    // For now, return a placeholder indicating successful cron execution
    
    return NextResponse.json({ 
      success: true, 
      message: "Discovery scan triggered successfully.",
      prompt_used: DISCOVERY_PROMPT,
      simulated_result: [
        {
          id: 'dl_sim1',
          company_name: 'SafeSys NLP',
          website: 'https://safesys-nlp.io',
          why_flagged: 'Announced seed funding for NLP driven near miss reporting',
          source: 'Crunchbase',
          detected_at: new Date().toISOString().split('T')[0],
          confidence_score: 85,
          status: 'EMERGING'
        }
      ]
    });
  } catch (error) {
    console.error('Competitor discovery error:', error);
    return NextResponse.json(
      { error: 'Failed to run discovery scan' },
      { status: 500 }
    );
  }
}
