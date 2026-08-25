import { NextResponse } from 'next/server';
import { LeadScoringAgent } from '@/lib/ai/lead-scorer';
import { RawSignal, IncidentSource } from '@/lib/ai/types';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { TriggerSignalSchema } from '@/lib/security/validation';

export async function POST(req: Request) {
  try {
    const rateLimit = checkRateLimit(req, 30); // 30 requests per minute
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    const body = await req.json().catch(() => null);
    const validation = TriggerSignalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid signal payload', details: validation.error.flatten() },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const { rawText, sourceUrl, sourceType } = validation.data;

    const agent = new LeadScoringAgent();
    
    
    const signal: RawSignal = {
      id: Math.random().toString(36).substring(7),
      sourceUrl: sourceUrl || 'https://euosha.europa.eu/incidents',
      sourceType: (sourceType as IncidentSource) || 'eu_osha',
      rawText: rawText,
      publishedAt: new Date().toISOString()
    };

    
    const executiveOutput = await agent.processIncomingSignal(signal);

    if (!executiveOutput) {
      return NextResponse.json({ 
        message: 'Signal processed. No trigger events found or lead score too low.',
        processed: true,
        output: null
      });
    }

    return NextResponse.json({
      message: 'High-scoring lead identified. Executive output generated.',
      processed: true,
      output: executiveOutput
    });

  } catch (error) {
    console.error('[AGENT_TRIGGER_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
