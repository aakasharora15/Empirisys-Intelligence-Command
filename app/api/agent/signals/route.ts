import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { parseModelJson } from '@/lib/ai/parse';
import { complete, aiEnabled } from '@/lib/ai/client';
import { performWebSearch } from '@/lib/ai/search';

export const maxDuration = 60; // Prevent Vercel timeouts for LLM calls
export const dynamic = 'force-dynamic';

export interface IntelligenceSignal {
  id: string;
  title: string;
  source: string;
  category: 'regulation' | 'competitive' | 'industry' | 'technology' | 'tender';
  time: string;
  summary: string;
  score: number;
  status: 'discovered' | 'reviewed' | 'actionable';
  confidence: number;
  strategicTags: string[];
  url?: string;
}

/**
 * Shown when no provider key is configured, so the dashboard renders without
 * incurring API cost. Illustrative regulatory and market signals only.
 */
const DEMO_SIGNALS: IntelligenceSignal[] = [
  {
    id: 'demo-sig-1',
    title: 'HSE consults on digital near-miss reporting for COMAH sites',
    source: 'HSE Executive',
    category: 'regulation',
    time: '2 hours ago',
    summary:
      'A consultation proposes auditable digital logging of near-miss events at upper-tier COMAH sites. Sites still on paper-based capture would need a migration path.',
    score: 91,
    status: 'actionable',
    confidence: 88,
    strategicTags: ['Compliance', 'Lead Gen'],
  },
  {
    id: 'demo-sig-2',
    title: 'EHS vendors add generative summarisation to incident modules',
    source: 'Market Sweep',
    category: 'competitive',
    time: '6 hours ago',
    summary:
      'Several established EHS platforms are layering text summarisation onto existing incident forms, narrowing the perceived gap with analytics-led entrants.',
    score: 78,
    status: 'reviewed',
    confidence: 71,
    strategicTags: ['Competitor Threat', 'Positioning'],
  },
  {
    id: 'demo-sig-3',
    title: 'Offshore wind operators tender for integrated O&M safety reporting',
    source: 'Procurement Digest',
    category: 'tender',
    time: '1 day ago',
    summary:
      'Maintenance-phase wind portfolios are seeking unified safety reporting across vessel transfer and turbine works, an area with no entrenched incumbent.',
    score: 74,
    status: 'discovered',
    confidence: 66,
    strategicTags: ['Renewables', 'Tender'],
  },
];

export async function GET(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 20);
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    if (!aiEnabled()) {
      return NextResponse.json({ signals: DEMO_SIGNALS });
    }

    const scrapedData = await performWebSearch(
      'UK HSE process safety regulation news OR chemical industry enforcement OR offshore safety tender',
    );

    if (!scrapedData) {
      // No grounding available. Returning demo data is honest; asking the model
      // to fill the gap would produce invented signals and invented sources.
      console.warn(
        '[Signals] Web search returned no results; serving demo signals rather than ungrounded output.',
      );
      return NextResponse.json({ signals: DEMO_SIGNALS, grounded: false });
    }

    const textContent =
      (await complete({
        system: `You are an elite HSE (Health, Safety, and Environment) Market Intelligence AI. 
You will be given real search results. Your job is to turn them into up to 5 market signals relevant to process safety, industrial risk and HSE consulting in Europe (especially UK/Netherlands).
Return only signals the supplied results actually support — fewer than 5 is correct if that is all the data shows. DO NOT invent or fabricate signals, companies, dates or URLs.
Output strictly in JSON format as an object with a "signals" array of at most 5 objects.
Each object must perfectly match this TypeScript interface:
{
  id: string; (e.g., "sig-live-xyz")
  title: string;
  source: string; (e.g., "HSE Executive", "EU Parliament", "Market Sweep")
  category: 'regulation' | 'competitive' | 'industry' | 'technology' | 'tender';
  time: string; (e.g., "12 mins ago", "2 hours ago")
  summary: string; (A 2-sentence summary of the event and its strategic impact)
  score: number; (0-100 relevance score)
  status: 'discovered' | 'reviewed' | 'actionable';
  confidence: number; (0-100)
  strategicTags: string[]; (2-3 short tags like "Lead Gen", "Compliance", "Competitor Threat")
  url: string; (The exact source URL as it appears in the supplied search results. Never construct, guess or complete a URL. Omit this field if the results do not contain one.)
}
Output ONLY JSON, with no markdown formatting.`,
        prompt: `Derive the signals strictly from these search results:\n\n${scrapedData}`,
        maxTokens: 1500,
        json: true,
      })) || '{"signals": []}';
    const parsedContent = parseModelJson<Record<string, unknown>>(textContent);

    return NextResponse.json({ signals: parsedContent.signals });
  } catch (error) {
    console.error('Signals agent live error:', error);
    return NextResponse.json({ error: 'Failed to process live market signals' }, { status: 500 });
  }
}
