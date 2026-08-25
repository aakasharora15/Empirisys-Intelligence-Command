import { CLAUDE_SONNET } from '@/lib/ai/models';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(20000)
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).max(50)
});

const rateLimitMap = new Map<string, { tokens: number; lastRefill: number }>();
const MAX_TOKENS = 10;
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

const EMPIRISYS_KNOWLEDGE_BASE = [
  {
    id: 'k1',
    title: 'About Empirisys',
    content: 'Empirisys is a Cardiff-based industrial safety software company specialising in process safety, human factors, HSE data analytics and cultural diagnostics. We build technologies that help asset-intensive operations predict and prevent high-risk industrial accidents. We operate primarily in the UK market with strategic expansion targets across Europe and the UAE.'
  },
  {
    id: 'k2',
    title: 'BOOST — Core Safety Intelligence Engine',
    content: 'BOOST is Empirisys\'s proprietary safety data analytics engine and the product that defines the company\'s market position. It operates across three tiers: Tier 1 (Reactive) handles incidents already recorded; Tier 2 (Predictive) captures leading indicators such as near-misses, unsafe conditions and overdue actions; Tier 3 (Prescriptive) applies NLP topic modelling and incident-severity frameworks to surface risk patterns before they escalate. BOOST uses advanced natural language processing to parse unstructured safety data — maintenance notes, operator logs, audit reports and free-text observations — and maps these inputs to industrial safety taxonomies to detect weak safety signals and predict incidents before they occur. This predictive capability is what differentiates BOOST from legacy competitors who simply digitise paper-based filing systems.'
  },
  {
    id: 'k3',
    title: 'SENSE — Cultural Diagnostics Platform',
    content: 'SENSE is Empirisys\'s cultural diagnostic tool. It measures safety culture alignment, leadership capabilities and worker engagement. By matching qualitative survey data with quantitative operational records, it highlights where leadership behaviour needs intervention to reduce compliance risk. SENSE addresses the human factors dimension of safety that pure data analytics platforms cannot reach.'
  },
  {
    id: 'k4',
    title: 'Empirisys 360 — Consulting Framework',
    content: 'Empirisys 360 combines SENSE diagnostics and BOOST analytics with specialised consulting services. This framework provides an end-to-end pathway to transform industrial safety culture by combining operational technology insights with human factors expertise and training. It is the advisory heritage that represents one of Empirisys\'s key inimitable competitive advantages.'
  },
  {
    id: 'k5',
    title: 'Key Clients',
    content: 'Empirisys actively partners with leading industrial and utility organisations across the UK. Key clients include BP (offshore platform log processing), Thames Water (culture and compliance auditing), SSE (renewable energy safety metrics), Ithaca Energy, Harbour Energy (North Sea oil rig risk models), Drax and Wessex Water. These client relationships span COMAH-regulated sites in oil and gas, water utilities and energy generation.'
  },
  {
    id: 'k6',
    title: 'Competitive Differentiators vs. Sphera, DNV, Enablon and Intelex',
    content: 'Unlike generic compliance managers Sphera or Intelex who focus on structured forms and historical reporting, Empirisys focuses on unstructured data analytics. BOOST handles messy free-text fields and operator slang and maps it directly to safety taxonomies. Competitors including DNV Synergi Life, Enablon and Cority are Systems of Record — they catalogue accidents after they happen. BOOST is a System of Intelligence — it predicts and prevents them. The key sales narrative is: Sphera records incidents. BOOST prevents them. A prospect who is a Head of Safety or Operations Director facing personal criminal liability under health and safety legislation does not behave as a commodity buyer — they are buying a documented, auditable defence against the worst day of their professional life.'
  },
  {
    id: 'k7',
    title: 'Target Industries and Market Focus',
    content: 'Empirisys focuses on high-hazard, asset-intensive sectors: Oil and Gas (offshore and onshore), Utilities (water and electricity distribution), Nuclear power generation, Chemicals manufacturing and Maritime transport. Safety models are tuned to COMAH-regulated sites. The primary sales challenge is proving to a liable executive — typically a Head of Safety or Operations Director — that BOOST offers documented, auditable assurance that their organisation is prioritising the right risks, something a legacy filing system cannot provide.'
  },
  {
    id: 'k8',
    title: 'The DIY AI Substitute Threat',
    content: 'The single greatest structural competitive threat to Empirisys is customers building their own AI tools using Microsoft Copilot or ChatGPT. These DIY solutions appear credible and are cheap to deploy. However, they have no HSE-domain training, no repeatability, no auditability and cannot produce the governed, traceable outputs that a liable executive can defend to a regulator or coroner. The counter-narrative: generic AI gives you an answer. BOOST gives you an answer you can stake your career on.'
  },
  {
    id: 'k9',
    title: 'The Competitive Intelligence Engine (CIE)',
    content: 'The Empirisys Competitive Intelligence Engine is a full-stack agentic AI platform built to make Empirisys\'s competitive advantage visible and saleable at the moment a deal is being won or lost. It includes: a Threat-Scoring Engine grading all competitors; Sales Battlecards with scripted counter-positioning for each rival; a TCO Pricing Comparator reframing from licence cost to executive liability; a Governed AI Console answering competitive queries in real time; a Live Threat Scan running on-demand competitor intelligence from their live web presence; and a Strategic Frameworks module rendering Porter\'s Five Forces, Blue Ocean and VRIO live. It is built on Next.js 16, Anthropic Claude API, PostgreSQL with pgvector, and deployed on Vercel.'
  },
  {
    id: 'k10',
    title: 'VRIO Strategic Assessment',
    content: 'VRIO analysis confirms three sustained competitive advantages for Empirisys: (1) Domain-Trained NLP Engine — Valuable, Rare, Inimitable and Organised. Built on years of proprietary safety data and Life Saving Rules taxonomy. Cannot be purchased or reverse-engineered at speed. (2) Embedded Advisory Heritage — the Empirisys 360 consulting expertise encoded into the AI layer. Socially complex, reputation-based and impossible to replicate quickly. (3) Proprietary Safety Data Moat — years of COMAH-regulated incident data accumulated through embedded client relationships. First-mover advantage compounds year on year. The real-time signal pipeline (web scraping) is only a temporary advantage — replicable engineering. Incumbents\' bolt-on AI (Sphera, Enablon) registers only as competitive parity at best.'
  },
  {
    id: 'k11',
    title: 'Pricing Intelligence',
    content: 'Empirisys competes against the following approximate UK enterprise RFP price ranges: Sphera SpheraCloud (£80,000 to £250,000 per year), DNV Synergi Life (£60,000 to £180,000 per year), Enablon (£70,000 to £200,000 per year), FENNEX (£15,000 to £60,000 per year), Cority (£50,000 to £150,000 per year). The sales counter-strategy is not to compete on headline price but to reframe the conversation onto Total Cost of Ownership — factoring in regulatory exposure, the cost of a missed leading safety indicator and the executive liability that a documented, auditable System of Intelligence eliminates.'
  },
  {
    id: 'k12',
    title: 'Market Trigger Events',
    content: 'Key regulatory and market events that create buying urgency for Empirisys: HSE UK mandating COMAH near-miss digital log reporting from Q4 2026 (immediate BOOST demand driver); Thames Water safety culture deficit flagged in Ofwat audit (opens SENSE deployment pathway); ONR mandating quarterly contractor cultural assessments at nuclear decommissioning sites (expands SENSE addressable market); alarm fatigue implicated in North Sea separator pressure near-misses (reinforces BOOST NLP alarm triage narrative for oil and gas prospects). These trigger events should be used to create urgency in the sales pipeline.'
  }
];

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const result = RequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { messages } = result.data;

    const systemPrompt = `You are the Empirisys Knowledge Assistant — a highly secure internal intelligence assistant for the Empirisys commercial and sales team. You have deep, expert-level knowledge of Empirisys's products, clients, competitive position and market.

Your role is to help the Empirisys team understand their own company, products and competitive advantage, and to prepare for client conversations.

You answer ONLY using the verified Empirisys knowledge base below. You do not search the internet or use general knowledge unless it directly supports what is in the knowledge base. Every answer must be specific, grounded and immediately useful to a sales engineer or commercial leader.

Your tone is sharp, confident and direct — like a senior Empirisys strategist briefing the team before a client meeting.

EMPIRISYS KNOWLEDGE BASE:
${EMPIRISYS_KNOWLEDGE_BASE.map(k => `[${k.title}]\n${k.content}`).join('\n\n---\n\n')}

When answering:
- Lead with the most commercially relevant point first
- Use the competitive framing: BOOST = System of Intelligence, rivals = Systems of Record
- Always tie back to executive liability, COMAH compliance and the cost of a missed safety signal when relevant
- If asked about a competitor, use the battlecard framing: their weakness, the trap they set, how to win
- Be specific — reference actual clients, actual products and actual price ranges where available`;

    const stream = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          try { controller.close(); } catch (e) {}
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Knowledge API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
