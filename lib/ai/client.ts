import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { CLAUDE_OPUS, CLAUDE_SONNET, OPENAI_DEFAULT_MODEL } from './models';

/**
 * Provider-agnostic wrapper over the two chat APIs this codebase can talk to.
 *
 * The marketing pipelines were originally built against OpenAI; the competitor
 * side was built against Anthropic. Rather than pinning the merged app to one
 * vendor, the provider is chosen at runtime from whichever key is configured,
 * so either half can be run against the API it was tuned for.
 *
 * Precedence: OPENAI_API_KEY, then ANTHROPIC_API_KEY, then demo mode.
 */

export type Provider = 'openai' | 'anthropic';

const PLACEHOLDER = /^(dummy_key|your-|sk-your|changeme)/i;

function configured(value: string | undefined): boolean {
  return Boolean(value && !PLACEHOLDER.test(value));
}

/** The provider that will serve requests, or null when neither key is set. */
export function activeProvider(): Provider | null {
  if (configured(process.env.OPENAI_API_KEY)) return 'openai';
  if (configured(process.env.ANTHROPIC_API_KEY)) return 'anthropic';
  return null;
}

/** True when a live model call is possible. Callers fall back to demo data when false. */
export function aiEnabled(): boolean {
  return activeProvider() !== null;
}

export interface CompletionRequest {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  /** Ask the provider to guarantee a JSON object where it supports doing so. */
  json?: boolean;
}

/**
 * Runs one completion and returns the raw text.
 *
 * On OpenAI a `json` request sets `response_format: { type: 'json_object' }`,
 * which guarantees a parseable body. Anthropic has no equivalent, so the result
 * may carry a markdown fence or preamble — pass the return value through
 * `parseModelJson` from './parse' either way.
 *
 * Throws when no provider is configured; check `aiEnabled()` first.
 */
export async function complete(req: CompletionRequest): Promise<string> {
  const provider = activeProvider();
  const maxTokens = req.maxTokens ?? 2000;

  if (provider === 'openai') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || OPENAI_DEFAULT_MODEL,
      max_tokens: maxTokens,
      ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
      ...(req.json ? { response_format: { type: 'json_object' as const } } : {}),
      messages: [
        { role: 'system', content: req.system },
        { role: 'user', content: req.prompt },
      ],
    });
    return completion.choices[0]?.message?.content ?? '';
  }

  if (provider === 'anthropic') {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: CLAUDE_OPUS,
      max_tokens: maxTokens,
      ...(req.temperature !== undefined ? { temperature: req.temperature } : {}),
      system: req.system,
      messages: [{ role: 'user', content: req.prompt }],
    });
    const block = message.content.find((c) => c.type === 'text');
    return block && block.type === 'text' ? block.text : '';
  }

  throw new Error('No AI provider configured: set OPENAI_API_KEY or ANTHROPIC_API_KEY');
}

export interface StreamRequest {
  system: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  maxTokens?: number;
}

/**
 * Runs one streaming completion, yielding text deltas as they arrive.
 *
 * Both SDKs expose incremental text differently; this normalises them to a
 * plain async iterable of strings so route handlers can pipe either provider
 * into the same ReadableStream.
 *
 * Throws when no provider is configured; check `aiEnabled()` first.
 */
export async function* completeStream(req: StreamRequest): AsyncGenerator<string> {
  const provider = activeProvider();
  const maxTokens = req.maxTokens ?? 2000;

  if (provider === 'openai') {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || OPENAI_DEFAULT_MODEL,
      max_tokens: maxTokens,
      stream: true,
      messages: [
        { role: 'system', content: req.system },
        ...req.messages,
      ],
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
    return;
  }

  if (provider === 'anthropic') {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const stream = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: maxTokens,
      system: req.system,
      messages: req.messages,
      stream: true,
    });
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
    return;
  }

  throw new Error('No AI provider configured: set OPENAI_API_KEY or ANTHROPIC_API_KEY');
}
