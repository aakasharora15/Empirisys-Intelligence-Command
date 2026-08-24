import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { IncidentIntelligence } from '@/types/domain';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 20);
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a real-time web-scraping and intelligence aggregation AI for Empirisys Ltd. 
Your task is to surface 4 recent, highly plausible, or authentic industrial/process safety incidents from major European players (e.g. Shell, BP, Balfour Beatty, TotalEnergies, National Grid, Equinor).
Base these strictly on recent real-world events, news patterns, or highly probable near-misses from your most recent training data.

Output strictly in JSON format as an object with an "incidents" array containing exactly 4 objects.
Each object must perfectly match this interface:
{
  id: string; (e.g. "inc-random-123")
  incidentType: string; (e.g. "Tier 1 Process Safety Near-Miss")
  consultantHired: string; (e.g. "McKinsey & Company", "ERM", "dss+")
  pitchApproach: string; (How Empirisys should pitch their software tools 'BOOST' or 'SENSE' to displace the incumbent consultant)
  incidentDescription: string; (Detailed 2-sentence narrative of the incident)
  regulatoryNotice: string; (e.g. "HSE Improvement Notice served")
  clientDetails: string; (e.g. "BP plc - North Sea Operations")
  scenario: string; (e.g. "Offshore Platform")
  dateTime: string; (A realistic ISO 8601 string representing an exact time within the last 72 hours)
}`
        },
        {
          role: "user",
          content: "Generate 4 recent live incidents."
        }
      ]
    });

    const parsedContent = JSON.parse(completion.choices[0].message.content || '{"incidents": []}');
    const incidents: IncidentIntelligence[] = parsedContent.incidents;

    return NextResponse.json({ incidents });

  } catch (error) {
    console.error('[LIVE_INCIDENTS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
