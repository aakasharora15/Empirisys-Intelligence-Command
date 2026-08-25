import { aiEnabled, completeStream } from '@/lib/ai/client';
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
    const hasProvider = aiEnabled();
    const competitorsData = await getCompetitors();

    if (!hasProvider) {
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

    const systemPrompt = `You are a strategic analyst for Empirisys Ltd. Use ONLY the provided competitor data to answer.
    Structure: comparison table, key insights, recommendations.
    Data: ${JSON.stringify(competitorsData, null, 2)}`;

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          const stream = completeStream({
            system: systemPrompt,
            messages: [{ role: 'user', content: query }],
            maxTokens: 4000,
          });
          for await (const text of stream) {
            controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          try { controller.close(); } catch { /* already closed */ }
        }
      }
    });

    return new Response(readable, { headers: { 'Content-Type': 'text/plain' } });
  } catch (error) {
    console.error('Competitor API Error:', error);
    return new Response('Unable to process the request at this time.', { headers: { 'Content-Type': 'text/plain' } });
  }
}
