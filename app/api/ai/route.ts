import { NextResponse } from 'next/server';
import { aiEnabled, completeStream } from '@/lib/ai/client';
import { z } from 'zod';

if (!aiEnabled()) {
  console.warn('CRITICAL: no AI provider key configured (OPENAI_API_KEY or ANTHROPIC_API_KEY).');
}

// Strict Zod schema for input validation
const RequestSchema = z.object({
  prompt: z.string().min(1).max(20000),
  moduleType: z.enum(['competitors', 'assistant', 'general']).default('general'),
});

// In-memory rate limiter — no external Redis dependency required
const rateLimitMap = new Map<string, { tokens: number; lastRefill: number }>();
const MAX_TOKENS = 15;
const REFILL_RATE_MS = 60000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip) || { tokens: MAX_TOKENS, lastRefill: now };
  const timePassed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(timePassed / REFILL_RATE_MS);
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    rateLimitMap.set(ip, bucket);
    return true;
  }
  return false;
}

// Server-side controlled system prompts — never overridable by the client
const SYSTEM_PROMPTS: Record<string, string> = {
  competitors: `You are the Empirisys Competitive Intelligence AI. Your role is to help the Empirisys commercial team understand and beat competitors in the UK HSE software market.

EMPIRISYS PRODUCTS:
- BOOST: Three-tier safety intelligence engine. Tier 1 (Reactive), Tier 2 (Predictive — near-misses, leading indicators), Tier 3 (Prescriptive — NLP topic modelling to surface risk patterns before escalation). A System of Intelligence, not a System of Record.
- SENSE: Cultural diagnostic tool measuring safety culture, leadership and worker engagement.
- Empirisys 360: Consulting framework combining both with advisory services.
- Clients: BP, Thames Water, SSE, Ithaca Energy, Harbour Energy, Drax, Wessex Water.

KEY COMPETITORS AND HOW TO BEAT THEM:
- Sphera (SpheraCloud, £80k-£250k/yr): System of Record. Records accidents after they happen. Rigid, template-based, no real NLP. Counter: "Sphera records accidents. BOOST prevents them."
- DNV Synergi Life (£60k-£180k/yr): Legacy incumbent. Strong brand, outdated architecture. Cannot handle unstructured free-text logs. Counter: reframe onto COMAH unstructured data requirements.
- Enablon (£70k-£200k/yr): Enterprise EHS, complex deployment, professional services heavy. Counter: TCO argument — implementation cost erases the headline price advantage.
- FENNEX (£15k-£60k/yr): Direct competitor making similar AI claims. Threat score 85. Counter: emphasise Empirisys's deeper domain NLP and Empirisys 360 advisory heritage.
- Cority (£50k-£150k/yr): Mid-market EHS. Poor UK HSE regulatory depth. Counter: COMAH compliance and UK regulatory alignment.
- DIY AI / Microsoft Copilot: THE single greatest structural threat. Counter: "Generic AI gives you an answer. BOOST gives you an answer you can stake your career on." No auditability, no repeatability, no safety-domain governance.

Always position BOOST as a System of Intelligence vs. all rivals as Systems of Record. Tie every answer to executive liability and COMAH compliance.`,

  assistant: `You are the Empirisys Knowledge Assistant. You have deep, expert-level knowledge of Empirisys's products, clients, competitive position and market. Answer clearly and confidently, like a senior Empirisys strategist briefing the team.

EMPIRISYS PRODUCTS:
- BOOST: Proprietary safety data analytics engine. Three tiers: Tier 1 (Reactive — incidents already recorded), Tier 2 (Predictive — near-misses, unsafe conditions, overdue actions), Tier 3 (Prescriptive — NLP topic modelling to surface risk patterns before escalation). Uses NLP to parse unstructured safety data (maintenance notes, operator logs, audit reports, free-text observations) and maps to industrial safety taxonomies. This is what makes BOOST a System of Intelligence, not a System of Record.
- SENSE: Cultural diagnostic tool. Measures safety culture alignment, leadership capabilities and worker engagement. Matches qualitative survey data with quantitative operational records to highlight where leadership behaviour needs intervention.
- Empirisys 360: Consulting framework combining SENSE diagnostics and BOOST analytics with specialised advisory services. End-to-end pathway to transform industrial safety culture.

KEY CLIENTS: BP (offshore platform log processing), Thames Water (culture and compliance auditing), SSE (renewable energy safety metrics), Ithaca Energy, Harbour Energy (North Sea oil rig risk models), Drax, Wessex Water.

TARGET INDUSTRIES: Oil and Gas (offshore and onshore), Utilities (water and electricity distribution), Nuclear power generation, Chemicals manufacturing, Maritime transport. All tuned to COMAH-regulated sites.

COMPETITIVE DIFFERENTIATORS: Unlike Sphera or Intelex who focus on structured forms and historical reporting, Empirisys handles messy free-text fields and operator slang — mapping directly to safety taxonomies. Competitors are Systems of Record. BOOST is a System of Intelligence.

KEY REGULATORY TRIGGER EVENTS: HSE UK mandating COMAH near-miss digital log reporting from Q4 2026; Thames Water safety culture deficit flagged in Ofwat audit; ONR mandating quarterly contractor cultural assessments at nuclear decommissioning sites; alarm fatigue implicated in North Sea separator pressure near-misses.

Answer every question with commercial precision. Always tie back to executive liability, COMAH compliance and the cost of a missed safety signal where relevant.`,

  general: `You are an AI assistant for Empirisys, specialised in the safety tech sector. Empirisys builds BOOST (three-tier safety analytics AI), SENSE (cultural diagnostics) and Empirisys 360 (consulting framework) for high-hazard industries including oil and gas, utilities, nuclear and chemicals. Clients include BP, Thames Water, SSE, Ithaca Energy and Drax.`,
};

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
    }

    const body = await req.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload parameters' }, { status: 400 });
    }

    const { prompt, moduleType } = result.data;
    const systemPrompt = SYSTEM_PROMPTS[moduleType as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general;

    if (!aiEnabled()) {
      return NextResponse.json({ error: 'No AI provider configured' }, { status: 503 });
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const stream = completeStream({
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
            maxTokens: 1024,
          });
          for await (const text of stream) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          try { controller.close(); } catch (e) {}
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('API /ai error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
