import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import * as cheerio from 'cheerio';
import { CLAUDE_SONNET } from '@/lib/ai/models';
import { z } from 'zod';
import dns from 'dns/promises';
import net from 'net';

const RequestSchema = z.object({
  url: z.string().url()
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

async function safeFetch(urlStr: string, redirects = 0): Promise<string> {
  if (redirects > 3) throw new Error("Too many redirects");
  
  const targetUrl = new URL(urlStr);
  if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
    throw new Error('Only HTTP/HTTPS allowed');
  }

  const hostname = targetUrl.hostname;
  
  const checkIP = (ip: string) => {
    if (!net.isIP(ip)) return ip === 'localhost';
    
    // IPv4 Checks
    if (net.isIPv4(ip)) {
      if (ip === '0.0.0.0' || ip === '255.255.255.255') return true;
      return ip.startsWith('10.') || 
             ip.startsWith('127.') || 
             ip.startsWith('169.254.') || 
             ip.startsWith('192.168.') || 
             /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
             /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./.test(ip); // CGNAT
    }
    
    // IPv6 Checks
    if (net.isIPv6(ip)) {
      const normalized = ip.toLowerCase();
      return normalized === '::1' || 
             normalized === '::' ||
             normalized.startsWith('fc') || 
             normalized.startsWith('fd') ||
             normalized.startsWith('fe8') ||
             normalized.startsWith('fe9') ||
             normalized.startsWith('fea') ||
             normalized.startsWith('feb') ||
             normalized.startsWith('::ffff:');
    }
    return false;
  };

  // 1. Test the literal string (catches 10.0.0.5, 0.0.0.0, [::1] directly)
  let cleanHostname = hostname;
  if (cleanHostname.startsWith('[') && cleanHostname.endsWith(']')) {
    cleanHostname = cleanHostname.slice(1, -1);
  }
  
  if (checkIP(cleanHostname)) {
    throw new Error('Private network addresses are not allowed');
  }

  // 2. Test resolved DNS (catches public domains pointing to internal IPs)
  // Run resolve4 and resolve6 in parallel
  if (!net.isIP(cleanHostname) && cleanHostname !== 'localhost') {
    const [v4, v6] = await Promise.all([
      dns.resolve4(cleanHostname).catch(() => []),
      dns.resolve6(cleanHostname).catch(() => [])
    ]);
    const addresses = [...v4, ...v6];
    
    // Fail closed if it resolves to absolutely nothing
    if (addresses.length === 0) {
      throw new Error('Could not resolve hostname');
    }
    
    if (addresses.some(checkIP)) {
      throw new Error('Private network addresses are not allowed');
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  try {
    const response = await fetch(urlStr, { 
      signal: controller.signal, 
      redirect: 'manual',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmpirisysBot/1.0)' } 
    });
    
    // 3. Catch redirects and recursively validate the target
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error("Redirect without location");
      const nextUrl = new URL(location, urlStr).toString();
      return safeFetch(nextUrl, redirects + 1);
    }
    
    if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const { url } = result.data;
    
    let html = '';
    try {
      html = await safeFetch(url);
    } catch (e: any) {
      if (e.message === 'Private network addresses are not allowed') {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to access the provided website' }, { status: 422 });
    }

    const $ = cheerio.load(html);
    $('script, style, noscript, iframe, img, svg, nav, footer').remove();
    let textContent = $('body').text().replace(/\s+/g, ' ').trim();
    
    textContent = textContent.slice(0, 15000);
    
    if (!textContent || textContent.length < 50) {
      return NextResponse.json({ error: 'Could not extract enough readable content from website' }, { status: 422 });
    }

    const companyDomain = new URL(url).hostname.replace('www.', '');
    const companyName = companyDomain.split('.')[0];

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
      model: CLAUDE_SONNET,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: 'user', content: `Analyze this competitor's website content:\n\nURL: ${url}\n\nCONTENT:\n${textContent}` }
      ],
    });

    let aiResponseText = '';
    if (msg.content[0].type === 'text') {
      aiResponseText = msg.content[0].text;
    }

    try {
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponseText;
      const parsedData = JSON.parse(jsonStr);

      return NextResponse.json(parsedData, { status: 200 });
    } catch {
      console.error("Failed to parse JSON from AI:", aiResponseText);
      return NextResponse.json({ error: 'AI failed to return structured threat data' }, { status: 500 });
    }

  } catch (err) {
    console.error('API /analyze-url error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
