import { NextResponse } from 'next/server';
import { runMarketIntelligencePipeline } from '@/lib/ai/market-intelligence/pipeline';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 10); // 10 pipeline runs per minute
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    // Body is accepted but currently unused — reserved for future filter params
    await req.json().catch(() => ({}));

    const result = await runMarketIntelligencePipeline();

    console.log('[MARKET_ANALYST] Pipeline completed. Metrics:', !!result.metrics);

    return NextResponse.json({
      events: result.events,
      themes: result.themes,
      metrics: result.metrics,
      landscape: result.landscape,
      meta: {
        totalEventsExtracted: result.events.length,
        totalThemes: result.themes.length,
        totalSegments: result.landscape?.segments?.length || 0,
        generatedAt: new Date().toISOString(),
      },
    }, { headers: rateLimit.headers });
  } catch (error) {
    console.error('[MARKET_ANALYST_PIPELINE_ERROR]', error);
    if (error instanceof Error && error.message === 'ANTHROPIC_API_KEY_MISSING') {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY_MISSING' }, { status: 500 });
    }
    return new NextResponse('Pipeline execution failed', { status: 500 });
  }
}

// Health check
export async function GET(req: Request) {
  const rateLimit = checkRateLimit(req, 30);
  if (!rateLimit.allowed && rateLimit.errorResponse) {
    return rateLimit.errorResponse;
  }

  return NextResponse.json({
    status: 'ready',
    agent: 'market-analyst',
    pipeline:
      'event-extraction → scoring → filtering → theme-aggregation → interpretation',
  }, { headers: rateLimit.headers });
}
