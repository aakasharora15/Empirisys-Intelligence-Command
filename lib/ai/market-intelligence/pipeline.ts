import { aiEnabled, complete } from '@/lib/ai/client';
import type {
  MarketEvent,
  AggregatedTheme,
  LLMExtractedEvent,
  EmpProduct,
  DeltaStatus,
  ThemeValidation,
  MarketLandscape,
} from './types';
import { calculateRelevance, calculateEvidenceStrength, applyDecay, shouldFilter } from './scoring';
import { performWebSearch } from '../search';
import { parseModelJson } from '@/lib/ai/parse';

// ────────────────────────────────────────────────────────────
// Prompts
// ────────────────────────────────────────────────────────────

const EXTRACTION_SYSTEM_PROMPT = `You are the Empirisys Market Intelligence Extraction Engine. You analyze source intelligence from the European HSE (Health, Safety, Environment) and process safety market.
Your cognitive foundation is the **STEEPLE** framework.

Your task: Given a batch of market intelligence sources across four tiers (A: regulatory/official, B: procurement/contracts, C: trade press, D: business press), extract structured events.

For each event, extract:
- entityName: The company, facility, or regulatory body involved
- entityType: 'company', 'facility', 'regulator', or 'government'
- eventType: One of 'incident', 'contract_award', 'regulatory_action', 'm_and_a', 'leadership_change', 'product_launch', 'partnership', 'capex_announcement'
- steepleCategory: Analyze the event and strictly categorize it as 'Socio-cultural', 'Technological', 'Economic', 'Environmental', 'Political', 'Legal', or 'Ethical'
- title: A concise event title (max 15 words)
- summary: 2-3 sentence description of the event and its significance
- sourceUrl: The exact URL as it appears in the supplied search results. Never construct, guess or complete a URL. Omit this field entirely if the search results do not contain one.
- sourceName: Name of the publication/body
- sourceTier: 'A', 'B', 'C', or 'D'
- geography: Country or region (e.g., 'UK', 'Netherlands', 'Germany')
- sector: Industry sector (e.g., 'Oil & Gas', 'Chemicals', 'Offshore Wind')
- eventDate: ISO 8601 date string (within the last 14 days)

Rules:
- Generate exactly 5 events
- At least 1 must be Tier A (regulatory/official sources like HSE UK, BAuA, ECHA, eMARS)
- At least 1 must be Tier B (procurement: TED, OJEU, operator capex)
- Remaining can be Tier C or D
- Events must be highly realistic and specific to the European process safety market
- Do NOT include generic company press releases as primary sources
- Each event must be independently verifiable in principle

Output strictly valid JSON: { "events": [...] }`;

const AGGREGATION_SYSTEM_PROMPT = `You are the Empirisys Strategic Theme Aggregator, a Senior Partner-level macro-strategist with decades of experience at top-tier management consulting firms (e.g., McKinsey, BCG, Bain). Your logic must reflect the absolute highest echelon of elite, rigorous corporate strategy.
You receive a set of scored market events and must cluster them into actionable strategic themes using **Scenario Planning** and **Porter's Five Forces**.

Rules:
- Generate 3-5 themes from the provided events.
- Each theme must be SUPPORTED by at least 2 events from the input. Cite event IDs.
- Do NOT invent themes that aren't backed by the evidence.
- For each theme, provide:
  - id: Unique string (e.g., "theme-001")
  - title: A clear strategic theme name
  - description: 2-3 sentences explaining the macro pattern
  - eventIds: Array of event IDs that support this theme
  - interpretation: {
      impact: What this means for the industry structure based on Porter's Five Forces.
      relevantProduct: Which Empirisys product is most relevant ('Sense', 'Boost', 'Insight360', or 'Leadership360'). You MUST justify this using authentic process-safety frameworks and terminology (e.g., CCPS Risk Based Process Safety elements, COMAH tiering, ATEX zoning, LOPA, BowTie methodology).
      suggestedAction: One specific, actionable next step.
      scenarioForecasts: {
        bearCase: "Worst-case 12-18 month projection for the market.",
        baseCase: "Most likely 12-18 month projection.",
        bullCase: "Best-case 12-18 month projection."
      }
      stakeholderViews: {
        ceoSummary: "Why this matters for growth, market positioning, and revenue (Gus's perspective).",
        ctoSummary: "Why this matters for the product roadmap and technical capabilities (Peter's perspective)."
      }
      vrioAnalysis: {
        valuable: "Does Empirisys provide value here?",
        rare: "Is our capability rare?",
        inimitable: "Is our approach hard to copy?",
        organization: "Is Empirisys organized to capture this value?",
        competitiveImplication: "Overall VRIO outcome (e.g., Temporary Advantage, Sustained Advantage)."
      }
    }
  - deltaStatus: 'new', 'intensified', 'faded', or 'stable'
      - status: Set all to 'pending_review'

- You must also generate a "metrics" object containing quantitative data representing the broader market over the last 7 days:
  - trendVelocity: Array of 7 days (e.g. "Mon", "Tue"). For each day, provide realistic integers for STEEPLE categories (sociocultural, technological, economic, environmental, political, legal, ethical).
  - competitorPositioning: Array of 5 competitors (including "Empirisys"). For each, provide 'innovationScore' (0-100), 'marketShareScore' (0-100), and 'threatLevel' (Low/Medium/High). Make sure Empirisys is well positioned based on the VRIO analysis.
  - budgetAllocation: Array of budget categories (e.g., "Software & AI", "Legacy Hardware", "Consulting", "Safety Training") with 'allocationPercentage' (must sum to 100) and 'trend' (Increasing/Decreasing/Stable).

Output strictly valid JSON: { "themes": [...], "metrics": { "trendVelocity": [...], "competitorPositioning": [...], "budgetAllocation": [...] } }`;

const LANDSCAPE_SYSTEM_PROMPT = `You are the Empirisys Growth Strategist Engine — a Senior Partner-level commercial strategist. You think and work exactly like an elite market researcher who converts raw market signals into a targeted, repeatable commercial engine.

CORE METHODOLOGY — Follow this precisely:

1. REJECT GENERIC MARKET SIZING. Never cite syndicated report numbers (e.g., "the EHS software market is worth $X billion"). Instead, anchor ALL intelligence to NAMED regulatory deadlines, compliance duty extensions, and specific procurement events. Only time-boxed, budgeted demand matters.

2. SOURCE TRIANGULATION. Cross-reference signals across primary authorities (e.g., HSE, NSTA, European Environment Agency, ADNOC, Saudi Aramco, national regulators). Do not rely on a single source.

3. AUTONOMOUSLY DISCOVER MARKET SEGMENTS. You are NOT limited to any predefined list of segments. Scan the entire market landscape and independently identify the most commercially relevant segments for Empirisys (an AI-enabled process safety and HSE analytics company). Discover as many or as few segments as the evidence supports. For each segment, provide:
   - id: Unique string (e.g., "seg-001")
   - name: Segment name (e.g., "Water & Utilities", "Offshore Wind Decommissioning", "Middle East Energy Mega-Projects")
   - geography: Country or region
   - readiness: "high" (live dated trigger exists now), "medium" (trigger exists within 6 months), or "low" (no specific dated trigger yet)
   - trigger: { name: The exact named regulation/programme/procurement event, value: The monetary value or scale, deadline: The specific date or date range }
   - mechanism: WHY this trigger creates a buyer for Empirisys. Be specific (e.g., "H&S performance is explicitly weighted at 15% of evaluation criteria in the framework scoring matrix")
   - entryBarriers: What blocks entry (e.g., "ICV certification required, processing time 3-9 months", or "None — open framework")
   - bestFitProduct: Which Empirisys product fits best — "Sense", "Boost", "Insight360", or "Leadership360"
   - squeezeOpportunity: ONE clear sentence explaining exactly where Empirisys can apply commercial pressure right now

4. RANK SEGMENTS BY COMMERCIAL READINESS. The segment with the most immediate, time-boxed, budgeted trigger goes first. Segments with no dated trigger for the next 6 months should be marked as "low" readiness and placed last.

5. BUILD GROWTH HORIZONS. Based on the discovered segments, create exactly 3 horizons:
   - NOW (0-3 months): Actions against LIVE triggers that are already in procurement or past a regulatory deadline. These are revenue actions.
   - NEXT (3-9 months): Parallel administrative/certification work (e.g., starting prequalification processes, securing pilot accounts) that absorbs lead time while NOW actions execute.
   - LATER (9-18 months): Segments explicitly DEFERRED. For each deferred segment, state the specific condition that must change before Empirisys should invest (e.g., "Defer until a dated regulatory trigger emerges in the UK power-generation segment").

   Each horizon contains an array of actions. Each action has:
   - action: What to do (concrete, specific)
   - segment: Which segment this targets
   - rationale: Why this timing is correct

6. IDENTIFY THE STRATEGIC PRECONDITION. What is the single most critical internal capability or credibility gap that Empirisys must solve BEFORE external scaling can succeed? (e.g., "Build an auditable evidence chain behind AI diagnostic outputs to satisfy regulator-adjacent buyers and insurers"). This is the one thing that, if not solved, makes all other growth actions futile.

7. WRITE IN PLAIN BUSINESS ENGLISH. Every team member — from the CEO to a junior sales rep — must be able to read your output and immediately understand what to do. No unexplained acronyms. No jargon without context. If you use a technical term, explain it in parentheses.

8. LANDSCAPE SUMMARY. Provide a 3-4 sentence executive summary of the current market state. This should answer: "If I had 60 seconds with the CEO, what would I tell them about where the market is today and where the money is?"

You will receive the extracted market events and strategic themes as context. Use them as your evidence base. Do NOT invent triggers that aren't grounded in the event data or realistic current market conditions.

Output strictly valid JSON:
{
  "landscapeSummary": "...",
  "strategicPrecondition": "...",
  "segments": [...],
  "horizons": [
    { "id": "now", "label": "NOW", "timeframe": "0–3 Months", "actions": [...] },
    { "id": "next", "label": "NEXT", "timeframe": "3–9 Months", "actions": [...] },
    { "id": "later", "label": "LATER", "timeframe": "9–18 Months", "actions": [...] }
  ]
}`;

// ────────────────────────────────────────────────────────────
// LLM response shapes (raw JSON from OpenAI)
// ────────────────────────────────────────────────────────────

interface RawTheme {
  id: string;
  title: string;
  description: string;
  eventIds: string[];
  interpretation: {
    impact: string;
    relevantProduct: EmpProduct;
    suggestedAction: string;
    scenarioForecasts: {
      bearCase: string;
      baseCase: string;
      bullCase: string;
    };
    stakeholderViews: {
      ceoSummary: string;
      ctoSummary: string;
    };
    vrioAnalysis: {
      valuable: string;
      rare: string;
      inimitable: string;
      organization: string;
      competitiveImplication: string;
    };
  };
  deltaStatus: DeltaStatus;
  status: ThemeValidation;
}

interface RawAggregation {
  themes: RawTheme[];
  metrics: {
    trendVelocity: Array<{
      day: string;
      sociocultural: number;
      technological: number;
      economic: number;
      environmental: number;
      political: number;
      legal: number;
      ethical: number;
    }>;
    competitorPositioning: Array<{
      competitorName: string;
      innovationScore: number;
      marketShareScore: number;
      threatLevel: string;
    }>;
    budgetAllocation: Array<{
      category: string;
      allocationPercentage: number;
      trend: string;
    }>;
  };
}

// ────────────────────────────────────────────────────────────
// Pipeline
// ────────────────────────────────────────────────────────────

export interface PipelineResult {
  events: MarketEvent[];
  themes: AggregatedTheme[];
  metrics: {
    trendVelocity: Array<{
      day: string;
      sociocultural: number;
      technological: number;
      economic: number;
      environmental: number;
      political: number;
      legal: number;
      ethical: number;
    }>;
    competitorPositioning: Array<{
      competitorName: string;
      innovationScore: number;
      marketShareScore: number;
      threatLevel: string;
    }>;
    budgetAllocation: Array<{
      category: string;
      allocationPercentage: number;
      trend: string;
    }>;
  };
  landscape: MarketLandscape | null;
}

export async function runMarketIntelligencePipeline(): Promise<PipelineResult> {
  if (!aiEnabled()) {
    throw new Error('AI_PROVIDER_NOT_CONFIGURED');
  }

  // ── Step 1: Extract events via LLM ──────────────────────
  const searchQuery =
    'European process safety HSE news latest OR offshore wind safety OR chemical industry regulations';
  const scrapedData = await performWebSearch(searchQuery);

  let userContent =
    "Generate a fresh batch of market intelligence events for the current period. Today's date is " +
    new Date().toISOString().slice(0, 10) +
    '.';

  if (scrapedData) {
    userContent += `\n\n--- LIVE INTERNET DATA ---\nHere are real-time search results related to European process safety markets:\n${scrapedData}\n\nUse this data as the sole factual basis for the events you extract. Return only the events the data actually supports, even if that is fewer than 8. DO NOT invent or fabricate events, entities, dates or URLs to reach a target count.`;
  } else {
    // Search returned nothing. Without grounding there is no factual basis for
    // any event, so return empty rather than letting the model supply one.
    console.warn(
      '[Market Intelligence] Web search returned no results; skipping extraction rather than generating ungrounded events.',
    );
    return {
      events: [],
      themes: [],
      metrics: { trendVelocity: [], competitorPositioning: [], budgetAllocation: [] },
      landscape: null,
    };
  }

  const extractionText = await complete({
    system: EXTRACTION_SYSTEM_PROMPT,
    prompt: userContent,
    maxTokens: 2000,
    json: true,
  });

  if (!extractionText) {
    throw new Error('LLM returned empty extraction response');
  }

  const parsed = parseModelJson<{ events: LLMExtractedEvent[] }>(extractionText);
  if (!Array.isArray(parsed.events)) {
    throw new Error('LLM extraction response missing "events" array');
  }

  // ── Step 2: Assign IDs ──────────────────────────────────
  // ── Step 3: Score each event deterministically ──────────
  const scoredEvents: MarketEvent[] = parsed.events.map((raw, index) => {
    const id = `evt-${index}`;
    const confirmationCount = 1; // single-source at extraction time

    const relevanceScore = calculateRelevance(raw);
    const evidenceStrength = calculateEvidenceStrength(raw.sourceTier, confirmationCount);
    const decayedRelevance = applyDecay(relevanceScore, raw.eventDate);

    return {
      id,
      entityName: raw.entityName,
      entityType: raw.entityType,
      eventType: raw.eventType,
      steepleCategory: raw.steepleCategory,
      title: raw.title,
      summary: raw.summary,
      sourceUrl: raw.sourceUrl,
      sourceName: raw.sourceName,
      sourceTier: raw.sourceTier,
      geography: raw.geography,
      sector: raw.sector,
      eventDate: raw.eventDate,
      relevanceScore: decayedRelevance,
      evidenceStrength,
      confirmationCount,
      isDuplicate: false,
      lifecycleStatus: 'scored' as const,
    };
  });

  // ── Step 4: Filter below threshold ─────────────────────
  const filteredEvents = scoredEvents.filter(shouldFilter);

  if (filteredEvents.length === 0) {
    return {
      events: [],
      themes: [],
      metrics: { trendVelocity: [], competitorPositioning: [], budgetAllocation: [] },
      landscape: null,
    };
  }

  // ── Step 5: Aggregate into themes via LLM ──────────────
  const eventsForLLM = filteredEvents.map((e) => ({
    id: e.id,
    title: e.title,
    summary: e.summary,
    eventType: e.eventType,
    entityName: e.entityName,
    geography: e.geography,
    sector: e.sector,
    relevanceScore: e.relevanceScore,
    sourceTier: e.sourceTier,
  }));

  const aggregationText = await complete({
    system: AGGREGATION_SYSTEM_PROMPT,
    prompt:
      'Here are the scored market events to aggregate into strategic themes:\n\n' +
      JSON.stringify(eventsForLLM, null, 2),
    maxTokens: 2500,
    json: true,
  });

  if (!aggregationText) {
    throw new Error('LLM returned empty aggregation response');
  }

  const parsedAggregation = parseModelJson<RawAggregation>(aggregationText);
  if (!parsedAggregation.themes || !Array.isArray(parsedAggregation.themes)) {
    throw new Error('LLM aggregation response missing "themes" array');
  }

  // Fallback metrics with realistic sample data if LLM fails to generate them
  const fallbackMetrics = {
    trendVelocity: [
      {
        day: 'Mon',
        sociocultural: 3,
        technological: 7,
        economic: 5,
        environmental: 8,
        political: 2,
        legal: 6,
        ethical: 1,
      },
      {
        day: 'Tue',
        sociocultural: 4,
        technological: 9,
        economic: 6,
        environmental: 7,
        political: 3,
        legal: 8,
        ethical: 2,
      },
      {
        day: 'Wed',
        sociocultural: 2,
        technological: 8,
        economic: 4,
        environmental: 10,
        political: 5,
        legal: 7,
        ethical: 3,
      },
      {
        day: 'Thu',
        sociocultural: 5,
        technological: 6,
        economic: 8,
        environmental: 9,
        political: 4,
        legal: 9,
        ethical: 2,
      },
      {
        day: 'Fri',
        sociocultural: 3,
        technological: 10,
        economic: 7,
        environmental: 6,
        political: 6,
        legal: 5,
        ethical: 4,
      },
      {
        day: 'Sat',
        sociocultural: 6,
        technological: 8,
        economic: 5,
        environmental: 11,
        political: 3,
        legal: 10,
        ethical: 1,
      },
      {
        day: 'Sun',
        sociocultural: 4,
        technological: 7,
        economic: 9,
        environmental: 8,
        political: 7,
        legal: 6,
        ethical: 3,
      },
    ],
    competitorPositioning: [
      {
        competitorName: 'Empirisys',
        innovationScore: 82,
        marketShareScore: 35,
        threatLevel: 'Low',
      },
      { competitorName: 'Sphera', innovationScore: 68, marketShareScore: 55, threatLevel: 'High' },
      { competitorName: 'Enablon', innovationScore: 72, marketShareScore: 48, threatLevel: 'High' },
      {
        competitorName: 'Intelex',
        innovationScore: 60,
        marketShareScore: 40,
        threatLevel: 'Medium',
      },
      {
        competitorName: 'Cority',
        innovationScore: 55,
        marketShareScore: 30,
        threatLevel: 'Medium',
      },
    ],
    budgetAllocation: [
      { category: 'Software & AI', allocationPercentage: 35, trend: 'Increasing' },
      { category: 'Legacy Hardware', allocationPercentage: 20, trend: 'Decreasing' },
      { category: 'Consulting', allocationPercentage: 25, trend: 'Stable' },
      { category: 'Safety Training', allocationPercentage: 20, trend: 'Increasing' },
    ],
  };

  const rawMetrics = parsedAggregation.metrics || {};
  const metrics = {
    trendVelocity:
      rawMetrics.trendVelocity && rawMetrics.trendVelocity.length > 0
        ? rawMetrics.trendVelocity
        : fallbackMetrics.trendVelocity,
    competitorPositioning:
      rawMetrics.competitorPositioning && rawMetrics.competitorPositioning.length > 0
        ? rawMetrics.competitorPositioning
        : fallbackMetrics.competitorPositioning,
    budgetAllocation:
      rawMetrics.budgetAllocation && rawMetrics.budgetAllocation.length > 0
        ? rawMetrics.budgetAllocation
        : fallbackMetrics.budgetAllocation,
  };

  // ── Step 6 & 7: Link events, compute theme scores ─────
  const eventMap = new Map(filteredEvents.map((e) => [e.id, e]));

  const themes: AggregatedTheme[] = parsedAggregation.themes.map((raw) => {
    const linkedEvents = raw.eventIds
      .map((eid) => eventMap.get(eid))
      .filter((e): e is MarketEvent => e !== undefined);

    const themeRelevance =
      linkedEvents.length > 0
        ? Math.round(
            linkedEvents.reduce((sum, e) => sum + e.relevanceScore, 0) / linkedEvents.length,
          )
        : 0;

    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      events: linkedEvents,
      interpretation: raw.interpretation,
      status: raw.status ?? 'pending_review',
      deltaStatus: raw.deltaStatus ?? 'new',
      relevanceScore: themeRelevance,
      timestamp: new Date().toISOString(),
    };
  });

  // ── Step 8: Market Landscape & Growth Strategy via LLM ──
  let landscape: MarketLandscape | null = null;

  try {
    const landscapeContext = {
      events: eventsForLLM,
      themes: themes.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        relevanceScore: t.relevanceScore,
        deltaStatus: t.deltaStatus,
        interpretation: {
          impact: t.interpretation?.impact,
          relevantProduct: t.interpretation?.relevantProduct,
          suggestedAction: t.interpretation?.suggestedAction,
        },
      })),
    };

    const landscapeText = await complete({
      system: LANDSCAPE_SYSTEM_PROMPT,
      prompt:
        "Here are the market events and strategic themes extracted from the current intelligence cycle. Use them as your evidence base to build the market landscape and growth strategy.\n\nToday's date is " +
        new Date().toISOString().slice(0, 10) +
        '.\n\nEmpirisys Products:\n- SENSE: Real-time AI anomaly detection for process safety\n- BOOST: AI-powered safety performance improvement platform\n- Insight360: Comprehensive HSE analytics and reporting\n- Leadership360: Leadership safety culture assessment\n\n' +
        JSON.stringify(landscapeContext, null, 2),
      maxTokens: 1500,
      json: true,
    });

    if (landscapeText) {
      const parsedLandscape = parseModelJson<MarketLandscape>(landscapeText);
      landscape = {
        landscapeSummary: parsedLandscape.landscapeSummary || '',
        strategicPrecondition: parsedLandscape.strategicPrecondition || '',
        segments: Array.isArray(parsedLandscape.segments) ? parsedLandscape.segments : [],
        horizons: Array.isArray(parsedLandscape.horizons) ? parsedLandscape.horizons : [],
      };
    }

    console.log(
      '[MARKET_ANALYST] Landscape analysis completed. Segments:',
      landscape?.segments?.length || 0,
    );
  } catch (landscapeError) {
    console.error('[MARKET_ANALYST] Landscape analysis failed (non-fatal):', landscapeError);
    // Landscape is optional — pipeline still returns events, themes, metrics
  }

  return { events: filteredEvents, themes, metrics, landscape };
}
