import type { MarketEvent, SourceTier, LLMExtractedEvent } from './types';

// --- Geography & Sector match lists ---

const TARGET_GEOGRAPHIES = new Set([
  'uk',
  'netherlands',
  'germany',
  'belgium',
  'france',
  'norway',
  'sweden',
  'denmark',
  'uae',
  'saudi arabia',
  'qatar',
  'oman',
  'bahrain',
  'kuwait',
  'australia',
  'canada',
  'usa',
  'india',
]);

const TARGET_SECTORS = new Set([
  'oil & gas',
  'chemicals',
  'energy',
  'refining',
  'offshore wind',
  'hydrogen',
  'process safety',
  'water & utilities',
  'construction',
  'carbon capture',
  'offshore hydrogen',
  'mining',
  'pharmaceuticals',
  'manufacturing',
  'data centres',
  'renewables',
]);

// --- Tier weights ---

const TIER_WEIGHTS: Record<SourceTier, number> = {
  A: 1.0,
  B: 0.75,
  C: 0.4,
  D: 0.2,
};

// --- High-value event types ---

const HIGH_VALUE_EVENT_TYPES = new Set([
  'contract_award',
  'regulatory_action',
  'incident',
  'capex_announcement',
]);

const MID_VALUE_EVENT_TYPES = new Set([
  'm_and_a',
  'leadership_change',
]);

/**
 * Rules-based relevance score (0–100).
 *
 * - Geography match → +30
 * - Sector match   → +30
 * - Event type     → +10 / +25 / +40
 */
export function calculateRelevance(
  event: Pick<MarketEvent | LLMExtractedEvent, 'geography' | 'sector' | 'eventType'>,
): number {
  let score = 0;

  // Geography check (case-insensitive, null-safe)
  const geo = event.geography || '';
  if (TARGET_GEOGRAPHIES.has(geo.toLowerCase())) {
    score += 30;
  }

  // Sector check (case-insensitive, null-safe)
  const sec = event.sector || '';
  if (TARGET_SECTORS.has(sec.toLowerCase())) {
    score += 30;
  }

  // Event-type check
  if (HIGH_VALUE_EVENT_TYPES.has(event.eventType)) {
    score += 40;
  } else if (MID_VALUE_EVENT_TYPES.has(event.eventType)) {
    score += 25;
  } else {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Evidence strength score (0–100).
 *
 * Base  = tierWeight × 60
 * Bonus = min((confirmationCount - 1) × 15, 40)
 */
export function calculateEvidenceStrength(
  sourceTier: SourceTier,
  confirmationCount: number,
): number {
  const base = TIER_WEIGHTS[sourceTier] * 60;
  const bonus = Math.min(Math.max((confirmationCount - 1) * 15, 0), 40);
  return Math.min(Math.round(base + bonus), 100);
}

/**
 * Time-decay multiplier applied to a score.
 *
 * - ≤ 7 days old  → no decay (multiplier 1.0)
 * - 7–30 days old → linear decay from 1.0 → 0.5
 * - > 30 days old → floor at 0.5
 */
export function applyDecay(score: number, eventDate: string): number {
  const now = Date.now();
  const eventMs = new Date(eventDate).getTime();
  const daysSince = (now - eventMs) / (1000 * 60 * 60 * 24);

  if (daysSince <= 7) {
    return score;
  }

  if (daysSince <= 30) {
    // Linear interpolation: multiplier goes from 1.0 at day 7 → 0.5 at day 30
    const multiplier = 1.0 - 0.5 * ((daysSince - 7) / (30 - 7));
    return Math.round(score * multiplier);
  }

  // Floor at 50 %
  return Math.round(score * 0.5);
}

/**
 * Returns `true` if the event *passes* the relevance filter (i.e. should be kept).
 */
export function shouldFilter(event: Pick<MarketEvent, 'relevanceScore'>): boolean {
  return event.relevanceScore >= 40;
}
