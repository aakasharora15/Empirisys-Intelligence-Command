/**
 * Parses the JSON object out of a model response.
 *
 * These pipelines were ported from OpenAI implementations that passed
 * `response_format: { type: 'json_object' }`, which guaranteed the response body
 * was valid JSON and made a bare `JSON.parse()` safe. The Anthropic API has no
 * equivalent parameter, so a response may arrive wrapped in a markdown fence or
 * preceded by a sentence of preamble. Parsing it directly throws.
 *
 * Try the whole string first, then fall back to the outermost `{...}` block.
 */
export function parseModelJson<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as T;
    }
    throw new Error('Model response contained no parseable JSON object');
  }
}

/**
 * As {@link parseModelJson}, but returns `fallback` instead of throwing when the
 * response cannot be parsed. Use where a degraded result is better than a 500.
 */
export function parseModelJsonOr<T>(text: string, fallback: T): T {
  try {
    return parseModelJson<T>(text);
  } catch (err) {
    console.error('[ai/parse] Failed to parse model JSON:', err);
    return fallback;
  }
}
