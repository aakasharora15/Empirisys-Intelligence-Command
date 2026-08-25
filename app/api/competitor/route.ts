import { CLAUDE_OPUS } from '@/lib/ai/models';
import { Anthropic } from '@anthropic-ai/sdk';
import { getCompetitors, getCompetitorContent, getQueries, getDiscoveryLogs } from '@/lib/db';
import { z } from 'zod';

const RequestSchema = z.object({
  query: z.string().min(1).max(5000),
});

export const runtime = 'nodejs';
export const maxDuration = 60; // Set max duration for vercel

export async function GET() {
  try {
    const [competitors, content, queries, discoveryLogs] = await Promise.all([
      getCompetitors(),
      getCompetitorContent(),
      getQueries(),
      getDiscoveryLogs()
    ]);
    
    // Artificial delay to simulate live fetching visualization
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return Response.json({ competitors, content, queries, discoveryLogs });
  } catch {
    return Response.json({ error: 'Failed to fetch competitor data' }, { status: 500 });
  }
}

const fallbackResponse = `Based on our data here is the requested competitor analysis:

DNV and Sphera pose the highest threat scores eighty two and ninety respectively due to their combination of AI analytics capabilities and strong HSE focus. However neither provides the deep cultural diagnostics that Empirisys offers through SENSE.

Key Insights:
1. Direct competitors like Intelex and Benchmark Gensuite have strong SaaS platforms but partial UK presence.
2. AI is becoming standard but Empirisys differentiates by bridging the gap between what data and why culture.

Recommendation: Highlight our unique 360 Framework in upcoming sales conversations against these vendors.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RequestSchema.safeParse(body);
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Invalid payload parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const { query } = result.data;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const competitorsData = await getCompetitors();

    if (!apiKey) {
      // Fallback streaming response
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const words = fallbackResponse.split(' ');
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '));
            await new Promise(r => setTimeout(r, 50));
          }
          controller.close();
        }
      });
      return new Response(stream, { headers: { 'Content-Type': 'text/plain' } });
    }

    const anthropic = new Anthropic({ apiKey });
    
    const systemPrompt = `You are a strategic analyst for Empirisys Ltd. Use ONLY the provided competitor data to answer.
    Structure: comparison table, key insights, recommendations.
    Data: ${JSON.stringify(competitorsData, null, 2)}`;

    const stream = await anthropic.messages.create({
      model: CLAUDE_OPUS,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: query }],
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      }
    });

    return new Response(readable, { headers: { 'Content-Type': 'text/plain' } });
  } catch (error) {
    console.error('Competitor API Error:', error);
    return new Response('Unable to process the request at this time.', { headers: { 'Content-Type': 'text/plain' } });
  }
}
