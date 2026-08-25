export const CLAUDE_OPUS = 'claude-opus-5';
export const CLAUDE_SONNET = 'claude-sonnet-5';

export const AI_ENABLED = Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "dummy_key");
