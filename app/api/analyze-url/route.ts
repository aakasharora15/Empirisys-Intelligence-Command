import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import * as cheerio from 'cheerio';
import { z } from 'zod';

const RequestSchema = z.object({
  url: z.string().url()
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const { url } = result.data;

    // 1. Fetch live HTML
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    let html = '';
    
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmpirisysBot/1.0)' } });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Failed to fetch URL');
      html = await response.text();
    } catch (e) {
      return NextResponse.json({ error: 'Failed to access the provided website' }, { status: 422 });
    }

    // 2. Extract meaningful text using cheerio
    const $ = cheerio.load(html);
    $('script, style, noscript, iframe, img, svg, nav, footer').remove();
    let textContent = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Limit text to avoid blowing up token limits (take first ~15k chars)
    textContent = textContent.slice(0, 15000);
    
    if (!textContent || textContent.length < 50) {
      return NextResponse.json({ error: 'Could not extract enough readable content from website' }, { status: 422 });
    }

    const companyDomain = new URL(url).hostname.replace('www.', '');
    const companyName = companyDomain.split('.')[0];
    const capitalizedName = companyName.charAt(0).toUpperCase() + companyName.slice(1);

    // 3. Send to Anthropic Claude 5 for structured threat analysis
    const systemPrompt = `You are the Empirisys AI Threat Intelligence engine.
Analyze the following website text scraped from a potential competitor. 
Determine what the company does, their target market, and critically, how much of a threat they pose to Empirisys BOOST (which focuses on AI safety intelligence, risk prediction, and decision-support for high-hazard industries).

Return a strict JSON response with no other text, matching this structure:
{
  "companyName": "The name of the company",
  "description": "A 2-3 sentence assessment of what they do and their core value prop.",
  "threatScore": <number between 1 and 100>,
  "whyFlagged": "A 1-sentence punchy explanation of why they are a threat to Empirisys."
}`;

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Analyze this competitor's website content:\n\nURL: ${url}\n\nCONTENT:\n${textContent}` }
      ],
    });

    // 4. Parse the AI response
    let aiResponseText = '';
    if (msg.content[0].type === 'text') {
      aiResponseText = msg.content[0].text;
    }

    try {
      // Find JSON block if Claude wrapped it in markdown
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponseText;
      const parsedData = JSON.parse(jsonStr);

      return NextResponse.json(parsedData, { status: 200 });
    } catch (parseError) {
      console.error("Failed to parse JSON from AI:", aiResponseText);
      return NextResponse.json({ error: 'AI failed to return structured threat data' }, { status: 500 });
    }

  } catch (err) {
    console.error('API /analyze-url error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
