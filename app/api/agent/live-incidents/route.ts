import { CLAUDE_OPUS } from '@/lib/ai/models';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { IncidentIntelligence } from '@/types/domain';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

export async function GET(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 20);
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key') {
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
    }

    const completion = await anthropic.messages.create({
      model: CLAUDE_OPUS,
      max_tokens: 1500,
      system: `You are a real-time web-scraping and intelligence aggregation AI for Empirisys Ltd. 
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
}
Output ONLY JSON, with no markdown formatting.`,
      messages: [
        {
          role: "user",
          content: "Generate 4 recent live incidents."
        }
      ]
    });

    const textContent = completion.content.find(c => c.type === 'text')?.text || '{"incidents": []}';
    const parsedContent = JSON.parse(textContent);
    const incidents: IncidentIntelligence[] = parsedContent.incidents;

    return NextResponse.json({ incidents });

  } catch (error) {
    console.error('[LIVE_INCIDENTS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
