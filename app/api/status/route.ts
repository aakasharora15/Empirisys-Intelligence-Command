import { CLAUDE_OPUS } from '@/lib/ai/models';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return NextResponse.json({
    anthropic: !!anthropicKey,
    supabase: !!supabaseUrl,
    model: CLAUDE_OPUS,
    webSearch: !!anthropicKey // we'll tie web search to anthropic key presence
  });
}
