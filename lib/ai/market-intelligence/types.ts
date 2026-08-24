// Source tiers per Claude's workflow
export type SourceTier = 'A' | 'B' | 'C' | 'D';

export type EventType =
  | 'incident'
  | 'contract_award'
  | 'regulatory_action'
  | 'm_and_a'
  | 'leadership_change'
  | 'product_launch'
  | 'partnership'
  | 'capex_announcement';

export type EntityType = 'company' | 'facility' | 'regulator' | 'government';

export type EventLifecycle =
  | 'extracted'
  | 'filtered'
  | 'scored'
  | 'aggregated'
  | 'archived';

export type ThemeValidation = 'pending_review' | 'approved' | 'rejected';

export type DeltaStatus = 'new' | 'intensified' | 'faded' | 'stable';

export type EmpProduct = 'Sense' | 'Boost' | 'Insight360' | 'Leadership360';

export type SteepleCategory = 'Socio-cultural' | 'Technological' | 'Economic' | 'Environmental' | 'Political' | 'Legal' | 'Ethical';

export interface MarketEvent {
  id: string;
  entityName: string;
  entityType: EntityType;
  eventType: EventType;
  steepleCategory: SteepleCategory;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  sourceTier: SourceTier;
  geography: string;
  sector: string;
  eventDate: string; // ISO 8601
  relevanceScore: number; // 0-100, deterministic
  evidenceStrength: number; // 0-100, deterministic
  confirmationCount: number;
  isDuplicate: boolean;
  lifecycleStatus: EventLifecycle;
  rawContent?: string;
}

export interface StrategicInterpretation {
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
}

export interface AggregatedTheme {
  id: string;
  title: string;
  description: string;
  events: MarketEvent[];
  interpretation: StrategicInterpretation;
  status: ThemeValidation;
  deltaStatus: DeltaStatus;
  relevanceScore: number;
  timestamp: string; // ISO 8601
}

export interface DeltaReport {
  generatedAt: string;
  periodLabel: string;
  newThemes: AggregatedTheme[];
  intensifiedThemes: AggregatedTheme[];
  fadedThemes: AggregatedTheme[];
  stableThemes: AggregatedTheme[];
  topActions: { theme: string; action: string; product: EmpProduct }[];
}

// ─── NEW: Quantitative Dashboard Metrics ───

export interface TrendVelocityDataPoint {
  day: string;
  sociocultural: number;
  technological: number;
  economic: number;
  environmental: number;
  political: number;
  legal: number;
  ethical: number;
}

export interface CompetitorScatterPoint {
  competitorName: string;
  innovationScore: number; // 0-100 (Y-axis)
  marketShareScore: number; // 0-100 (X-axis)
  threatLevel: 'Low' | 'Medium' | 'High';
}

export interface BudgetAllocationPoint {
  category: string;
  allocationPercentage: number;
  trend: 'Increasing' | 'Decreasing' | 'Stable';
}

export interface QuantitativeMetrics {
  trendVelocity: TrendVelocityDataPoint[];
  competitorPositioning: CompetitorScatterPoint[];
  budgetAllocation: BudgetAllocationPoint[];
}

export interface PipelineResult {
  events: MarketEvent[];
  themes: AggregatedTheme[];
  metrics: QuantitativeMetrics;
}

// LLM extraction output shape
export interface LLMExtractedEvent {
  entityName: string;
  entityType: EntityType;
  eventType: EventType;
  steepleCategory: SteepleCategory;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  sourceTier: SourceTier;
  geography: string;
  sector: string;
  eventDate: string;
}

// ─── Market Landscape & Growth Strategy Types ───

export type SegmentReadiness = 'high' | 'medium' | 'low';
export type HorizonId = 'now' | 'next' | 'later';

export interface MarketSegment {
  id: string;
  name: string;
  geography: string;
  readiness: SegmentReadiness;
  trigger: {
    name: string;
    value: string;
    deadline: string;
  };
  mechanism: string;
  entryBarriers: string;
  bestFitProduct: EmpProduct;
  squeezeOpportunity: string;
}

export interface GrowthAction {
  action: string;
  segment: string;
  rationale: string;
}

export interface GrowthHorizon {
  id: HorizonId;
  label: string;
  timeframe: string;
  actions: GrowthAction[];
}

export interface MarketLandscape {
  segments: MarketSegment[];
  horizons: GrowthHorizon[];
  strategicPrecondition: string;
  landscapeSummary: string;
}

