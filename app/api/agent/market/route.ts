import { CLAUDE_OPUS } from '@/lib/ai/models';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AggregatedTheme } from '@/lib/ai/market-intelligence/types';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const maxDuration = 60; // Prevent Vercel timeouts for LLM calls
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

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured.");
    }

    const completion = await anthropic.messages.create({
      model: CLAUDE_OPUS,
      max_tokens: 1500,
      system: `You are an elite HSE Market Intelligence AI for Empirisys Ltd. 
Your task is to analyze current European (UK/Netherlands) process safety trends and generate 4 highly relevant "AggregatedThemes" based on current events.
Output strictly in JSON format as an object with a "themes" array containing exactly 4 objects.
Ensure exactly 2 of the themes have the status "approved", and 2 of the themes have the status "pending_validation".
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
  status: 'pending_validation' | 'approved';
  deltaStatus: 'new' | 'intensified' | 'faded' | 'stable';
  timestamp: string; (Realistic ISO 8601 string representing when this theme was aggregated, e.g. some 30 mins ago, some 12 hours ago, some 3 days ago)
}
Output ONLY JSON, with no markdown formatting.`,
      messages: [
        {
          role: "user",
          content: "Generate the 4 aggregated market themes as instructed."
        }
      ]
    });

    const textContent = completion.content.find(c => c.type === 'text')?.text || '{"themes": []}';
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
    const themes: AggregatedTheme[] = parsedContent.themes;

    return NextResponse.json({
      themes: themes
    });

  } catch (error) {
    console.error('[MARKET_AGENT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
