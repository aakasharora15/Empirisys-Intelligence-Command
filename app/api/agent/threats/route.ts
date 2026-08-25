import { NextResponse } from 'next/server';
import { scrapeLiveThreats } from '@/lib/ai/threat-monitor/scraper';
import { checkRateLimit } from '@/lib/security/rate-limiter';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 20);
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    const threats = await scrapeLiveThreats();
    return NextResponse.json({ threats }, { headers: rateLimit.headers });
  } catch (error) {
    console.error('[THREAT_MONITOR_API_ERROR]', error);
    return new NextResponse('Failed to fetch live threats', { status: 500 });
  }
}
