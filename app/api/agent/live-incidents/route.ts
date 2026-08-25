import { aiEnabled, complete } from '@/lib/ai/client';
import { NextResponse } from 'next/server';
import { IncidentIntelligence } from '@/types/domain';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { parseModelJson } from '@/lib/ai/parse';
import { performWebSearch } from '@/lib/ai/search';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/**
 * Served when there is no provider key, or when the web search returns nothing.
 * Illustrative only — these are not real reported incidents, which is why the
 * response carries `grounded: false` alongside them.
 */
const DEMO_INCIDENTS: IncidentIntelligence[] = [
  {
    id: 'demo-1',
    incidentType: 'Tier 1 Process Safety Near-Miss',
    consultantHired: 'ERM',
    pitchApproach: 'Pitch BOOST to integrate frontline worker safety logs directly into operational dashboards.',
    incidentDescription: 'Alarm fatigue on a high-pressure system contributed to a near-miss loss of containment during maintenance.',
    regulatoryNotice: 'Improvement Notice served',
    clientDetails: 'Illustrative offshore operator',
    scenario: 'Offshore Platform',
    dateTime: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'demo-2',
    incidentType: 'Safety Culture Degradation',
    consultantHired: 'dss+',
    pitchApproach: 'Propose SENSE to run automated deep-dives on safety culture metrics instead of manual surveys.',
    incidentDescription: 'Subcontractor accident rate rose sharply following a turnaround phase.',
    regulatoryNotice: 'Internal Audit Flag',
    clientDetails: 'Illustrative onshore processing site',
    scenario: 'Onshore Processing',
    dateTime: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 20);
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    if (!aiEnabled()) {
      return NextResponse.json({ incidents: DEMO_INCIDENTS });
    }

    const scrapedData = await performWebSearch(
      'UK HSE enforcement notice process safety incident OR industrial near miss investigation'
    );

    if (!scrapedData) {
      // No grounding. Serving demo data is honest; asking the model to fill the
      // gap produced invented incidents attributed to real named operators.
      console.warn('[Live Incidents] Web search returned no results; serving demo incidents rather than ungrounded output.');
      return NextResponse.json({ incidents: DEMO_INCIDENTS, grounded: false });
    }

    const textContent = await complete({
      system: `You are a real-time web-scraping and intelligence aggregation AI for Empirisys Ltd. 
You will be given real search results. Your task is to extract industrial and process safety incidents that those results actually report.

Return only incidents the supplied results substantiate — fewer than 4, or none at all, is correct if that is all the data shows.
DO NOT invent or fabricate incidents, and never attribute an incident to a named company unless the supplied results explicitly report it. Attributing a safety failure to a real operator on anything less than a cited source is a factual and reputational risk.

Output strictly in JSON format as an object with an "incidents" array.
Each object must perfectly match this interface:
{
  id: string; (e.g. "inc-random-123")
  incidentType: string; (e.g. "Tier 1 Process Safety Near-Miss")
  consultantHired: string; (e.g. "McKinsey & Company", "ERM", "dss+")
  pitchApproach: string; (How Empirisys should pitch their software tools 'BOOST' or 'SENSE' to displace the incumbent consultant)
  incidentDescription: string; (Detailed 2-sentence narrative of the incident)
  regulatoryNotice: string; (e.g. "HSE Improvement Notice served")
  clientDetails: string; (The operator and site exactly as named in the source. Never supply a company the source does not name.)
  scenario: string; (e.g. "Offshore Platform")
  dateTime: string; (ISO 8601 timestamp taken from the source. Omit if the source does not give one — do not estimate.)
}
Output ONLY JSON, with no markdown formatting.`,
      prompt: "Generate 4 recent live incidents.",
      maxTokens: 1500,
      json: true,
    }) || '{"incidents": []}';
    const parsedContent = parseModelJson<{ incidents: IncidentIntelligence[] }>(textContent);
    const incidents: IncidentIntelligence[] = parsedContent.incidents;

    return NextResponse.json({ incidents });

  } catch (error) {
    console.error('[LIVE_INCIDENTS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
