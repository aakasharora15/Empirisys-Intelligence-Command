import * as cheerio from "cheerio";

/**
 * Performs a real-time web search via DuckDuckGo HTML interface.
 * Returns an empty string if the search fails, gets blocked, or returns no snippets.
 */
export async function performWebSearch(query: string): Promise<string> {
  try {
    // 1. Sanitize and cap query length to prevent URI overflow or control character injection
    const sanitizedQuery = query
      .replace(/[^\x20-\x7E]/g, '') // strip non-printable ASCII
      .trim()
      .slice(0, 200);

    if (!sanitizedQuery) {
      console.warn('[performWebSearch] Empty or invalid query after sanitization.');
      return "";
    }

    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(sanitizedQuery)}`;
    
    // 2. Add timeout protection so hanging DuckDuckGo connections don't block serverless execution
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      console.warn(`[performWebSearch] DuckDuckGo returned non-OK status: ${response.status}`);
      return "";
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const results: string[] = [];
    $('.result__snippet').each((i, el) => {
      if (i < 5) {
        // 3. Sanitize extracted snippet text to remove any potential script injection or formatting anomalies
        const rawText = $(el).text().trim();
        const cleanText = rawText.replace(/[<>]/g, '').replace(/\s+/g, ' ').slice(0, 500);
        if (cleanText) {
          results.push(cleanText);
        }
      }
    });
    
    const combinedResults = results.join("\n\n");
    
    if (combinedResults.length > 0) {
      console.log(`[performWebSearch] Successfully extracted ${results.length} snippets for query: "${sanitizedQuery}"`);
    } else {
      console.log(`[performWebSearch] No snippets found for query: "${sanitizedQuery}"`);
    }

    return combinedResults;
  } catch (error) {
    console.error("[performWebSearch] Web search error:", error);
    return "";
  }
}
