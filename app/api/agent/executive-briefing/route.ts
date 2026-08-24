import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { scrapeLiveThreats } from '@/lib/ai/threat-monitor/scraper';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export async function GET(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 15); // 15 requests per minute
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    const liveThreats = await scrapeLiveThreats();
    
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy_key' || process.env.OPENAI_API_KEY.includes('your-openai-api-key')) {
        return NextResponse.json({
            bluf: {
                headline: "HSE Improvement Notices Spike in Offshore Wind Sector",
                summary: "Recent enforcement logs show 3 major improvement notices issued to aging North Sea assets regarding corrosion under insulation.",
                recommendedAction: "Deploy Client Acquisition pipeline for BP and Balfour Beatty focusing on SENSE cultural diagnostic."
            },
            matrix: {
                tailwinds: [
                    { sector: "Offshore Wind", driver: "Aging asset integrity crackdowns", intensity: "high" },
                    { sector: "Process Safety", driver: "Seveso III inventory limits tightening", intensity: "medium" }
                ],
                headwinds: [
                    { sector: "Hydrogen", driver: "CapEx freezes pending EU subsidy approvals", intensity: "high" }
                ]
            },
            dominantTheme: "Aging Asset Integrity",
            targets: liveThreats.map(t => ({
                id: t.id,
                companyName: t.companyName,
                sector: t.sector,
                triggerIncident: t.title,
                timeAgo: t.timeAgo,
            }))
        });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the Empirisys CEO's Chief of Staff and Head of Strategy.
Review the following live threat feed detected in the last 24 hours:
${JSON.stringify(liveThreats, null, 2)}

Synthesize a corporate-grade Executive Briefing for the dashboard.

Output strictly valid JSON matching this schema:
{
  "bluf": {
    "headline": "A sharp, 5-8 word executive headline of the biggest market shift",
    "summary": "1-2 sentence executive summary of what is happening based on the threats",
    "recommendedAction": "1 sentence dictating exactly who the sales team should target and what product to pitch"
  },
  "matrix": {
    "tailwinds": [
      { "sector": "e.g. Chemicals", "driver": "Why Empirisys has leverage here (e.g. heavy fines)", "intensity": "high" | "medium" }
    ],
    "headwinds": [
      { "sector": "e.g. Hydrogen", "driver": "Why Empirisys should avoid this sector (e.g. CapEx freeze)", "intensity": "high" | "medium" }
    ]
  },
  "dominantTheme": "A 3-5 word string defining the most lucrative consulting topic right now"
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const parsedContent = JSON.parse(completion.choices[0].message.content || '{}');
    
    // We attach the targets directly from the scraped threats to save API calls downstream
    parsedContent.targets = liveThreats.map(t => ({
        id: t.id,
        companyName: t.companyName,
        sector: t.sector,
        triggerIncident: t.title,
        timeAgo: t.timeAgo,
    }));

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error('Executive Briefing API error:', error);
    return new NextResponse("Failed to fetch executive briefing", { status: 500 });
  }
}
