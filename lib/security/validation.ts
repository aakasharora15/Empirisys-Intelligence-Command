import { z } from 'zod';

/**
 * Centralized Zod validation schemas for API endpoint payloads
 * to protect against prompt injection, memory exhaustion, and invalid data.
 */

export const LeadScoringSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters long')
    .max(100, 'Company name cannot exceed 100 characters')
    .regex(
      /^[a-zA-Z0-9\s,.\-&()/]+$/,
      'Company name contains invalid characters'
    )
    .trim(),
});

export const ChatMessageItemSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z
    .string()
    .max(2000, 'Individual message content cannot exceed 2000 characters')
    .trim(),
});

export const ChatMessagesSchema = z.object({
  messages: z
    .array(ChatMessageItemSchema)
    .min(1, 'Messages array cannot be empty')
    .max(20, 'Chat history cannot exceed 20 messages per request'),
});

export const VectorSearchSchema = z.object({
  query: z
    .string()
    .min(2, 'Query must be at least 2 characters long')
    .max(500, 'Query cannot exceed 500 characters')
    .trim(),
  limit: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(5)
    .optional(),
});

export const TriggerSignalSchema = z.object({
  rawText: z
    .string()
    .min(5, 'rawText must be at least 5 characters long')
    .max(5000, 'rawText cannot exceed 5000 characters')
    .trim(),
  sourceUrl: z
    .string()
    .max(500, 'sourceUrl cannot exceed 500 characters')
    .optional(),
  sourceType: z
    .enum(['eu_osha', 'chemical_park_registry', 'regional_press', 'public_database'])
    .optional(),
});
