import { NextResponse } from 'next/server';
import { runLeadScoringPipeline } from '@/lib/ai/lead-scoring/pipeline';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { LeadScoringSchema } from '@/lib/security/validation';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, 20); // 20 requests per minute
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    const body = await request.json().catch(() => null);
    const validation = LeadScoringSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid company name', details: validation.error.flatten() },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const profile = await runLeadScoringPipeline(validation.data.companyName);

    return NextResponse.json({ profile }, { headers: rateLimit.headers });
  } catch (error) {
    console.error('[LEAD_SCORING_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to process lead score pipeline' },
      { status: 500 }
    );
  }
}
