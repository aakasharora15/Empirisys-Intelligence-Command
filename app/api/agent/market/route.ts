import { NextResponse } from 'next/server';
import { AggregatedTheme } from '@/lib/ai/market-intelligence/types';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { complete, aiEnabled } from '@/lib/ai/client';

export const maxDuration = 60; // Prevent Vercel timeouts for LLM calls
export const dynamic = 'force-dynamic';

/**
 * Shown when no provider key is configured, so the dashboard renders without
 * incurring API cost. Illustrative regulatory themes only — deliberately not
 * incidents attributed to named operators.
 */
const DEMO_THEMES: AggregatedTheme[] = [
  {
    id: 'demo-theme-1',
    title: 'COMAH digital reporting deadline tightening',
    description:
      'UK COMAH sites face a shortening window to move near-miss reporting off paper and into auditable digital logs.',
    events: [],
    status: 'approved',
    deltaStatus: 'intensified',
    relevanceScore: 88,
    timestamp: new Date().toISOString(),
    interpretation: {
      impact:
        'Raises switching costs for incumbent form-based platforms and opens a compliance-deadline entry point.',
      relevantProduct: 'Boost',
      suggestedAction:
        'Lead with ingestion of existing free-text logs so sites can show progress before the deadline.',
      scenarioForecasts: {
        bearCase: 'Deadline slips a further year and urgency decays.',
        baseCase: 'Phased enforcement drives procurement across tier-one sites.',
        bullCase: 'Regulator names digital logging as expected practice, pulling budget forward.',
      },
      stakeholderViews: {
        ceoSummary: 'A dated, externally imposed trigger we can build a campaign around.',
        ctoSummary:
          'Requires NLP over unstructured maintenance and observation text, which is our core.',
      },
      vrioAnalysis: {
        valuable: 'Directly addresses a regulatory obligation with a fixed date.',
        rare: 'Few vendors parse free-text logs rather than structured forms.',
        inimitable: 'Domain taxonomy and labelled safety corpora take years to build.',
        organization: 'Delivery and consulting already aligned to COMAH sites.',
        competitiveImplication: 'Temporary advantage while incumbents retrofit.',
      },
    },
  },
  {
    id: 'demo-theme-2',
    title: 'Offshore wind O&M safety data maturity gap',
    description:
      'Rapid offshore wind buildout is outpacing the safety-data tooling used to manage transfer and maintenance risk.',
    events: [],
    status: 'pending_review',
    deltaStatus: 'new',
    relevanceScore: 74,
    timestamp: new Date().toISOString(),
    interpretation: {
      impact: 'A growing asset base with no entrenched HSE analytics incumbent.',
      relevantProduct: 'Sense',
      suggestedAction: 'Target operators scaling past their first maintenance cycle.',
      scenarioForecasts: {
        bearCase: 'Operators extend existing oil and gas contracts instead.',
        baseCase: 'Dedicated procurement emerges as fleets mature.',
        bullCase: 'A high-profile transfer incident accelerates regulatory attention.',
      },
      stakeholderViews: {
        ceoSummary: 'Adjacent market with lower displacement cost than oil and gas.',
        ctoSummary: 'Transfer and vessel logs need new taxonomy coverage.',
      },
      vrioAnalysis: {
        valuable: 'Addresses risk in a fast-growing asset class.',
        rare: 'Most EHS vendors treat renewables as a reporting sub-case.',
        inimitable: 'Requires sector-specific incident taxonomy.',
        organization: 'Existing SSE relationship provides a reference route.',
        competitiveImplication: 'Contested but currently unowned.',
      },
    },
  },
];

export async function GET(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 20);
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    if (!aiEnabled()) {
      return NextResponse.json({ themes: DEMO_THEMES });
    }

    const textContent =
      (await complete({
        system: `You are an elite HSE Market Intelligence AI for Empirisys Ltd. 
Your task is to analyze current European (UK/Netherlands) process safety trends and generate 4 highly relevant "AggregatedThemes" based on current events.
Output strictly in JSON format as an object with a "themes" array containing exactly 4 objects.
Ensure exactly 2 of the themes have the status "approved", and 2 of the themes have the status "pending_review".
Each object must perfectly match this interface:
{
  id: string; (e.g. "theme-ai-1")
  title: string;
  description: string;
  signals: []; (leave this empty for now)
  interpretation: {
    impact: string;
    relevantProduct: 'Sense' | 'Boost' | 'Insight360' | 'Leadership360' | 'Both';
    suggestedAction: string;
  };
  status: 'pending_review' | 'approved';
  deltaStatus: 'new' | 'intensified' | 'faded' | 'stable';
  timestamp: string; (Realistic ISO 8601 string representing when this theme was aggregated, e.g. some 30 mins ago, some 12 hours ago, some 3 days ago)
}
Output ONLY JSON, with no markdown formatting.`,
        prompt: 'Generate the 4 aggregated market themes as instructed.',
        maxTokens: 1500,
        json: true,
      })) || '{"themes": []}';
    let parsedContent = { themes: [] };
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        parsedContent = JSON.parse(textContent);
      }
    } catch (e) {
      console.error('Failed to parse themes JSON', e);
    }
    const themes: AggregatedTheme[] = parsedContent.themes ?? [];

    return NextResponse.json({
      themes: themes,
    });
  } catch (error) {
    console.error('[MARKET_AGENT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
