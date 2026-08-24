import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const maxDuration = 60; // Prevent Vercel timeouts for LLM calls
export const dynamic = 'force-dynamic';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

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

export async function GET(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 20);
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1500,
      system: `You are an elite HSE (Health, Safety, and Environment) Market Intelligence AI. 
Your job is to scrape simulated real-time data and generate 5 highly realistic, up-to-the-minute market signals relevant to process safety, industrial risk, and HSE consulting in Europe (especially UK/Netherlands).
Output strictly in JSON format as an object with a "signals" array containing exactly 5 objects.
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
  url: string; (A realistic URL pointing to the source material, e.g., "https://www.hse.gov.uk/news" or "https://reuters.com/...")
}
Output ONLY JSON, with no markdown formatting.`,
      messages: [
        {
          role: "user",
          content: "Generate the latest 5 live HSE intelligence signals for the Empirisys dashboard."
        }
      ]
    });

    const textContent = completion.content.find(c => c.type === 'text')?.text || '{"signals": []}';
    const parsedContent = JSON.parse(textContent);

    return NextResponse.json({ signals: parsedContent.signals });
  } catch (error) {
    console.error('Signals agent live error:', error);
    return NextResponse.json(
      { error: 'Failed to process live market signals via OpenAI' },
      { status: 500 }
    );
  }
}
