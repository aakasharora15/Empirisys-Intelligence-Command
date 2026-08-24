/**
 * Domain Entity Interfaces
 * Rich domain types that extend database row types with computed fields,
 * relations, and business logic properties.
 */

import type { Tables, Enums, Json } from "./database";

// ─── Profile / User ──────────────────────────────────────────────────

export type UserProfile = Tables<"profiles"> & {
  initials: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  email_notifications: boolean;
  signal_digest_frequency: "daily" | "weekly" | "never";
  default_dashboard_view: "overview" | "signals" | "tenders";
  sidebar_collapsed: boolean;
  timezone: string;
  locale: string;
}

// ─── Competitor ──────────────────────────────────────────────────────

export type Competitor = Tables<"competitors"> & {
  signal_count?: number;
  recent_signal_count?: number;
  last_signal_at?: string | null;
}

export interface CompetitorDetail extends Competitor {
  signals: Signal[];
  documents: Document[];
  created_by_profile: UserProfile | null;
}

export interface CompetitorKeyPerson {
  name: string;
  title: string;
  linkedin_url?: string;
  notes?: string;
}

export interface CompetitorSocialLinks {
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
}

export interface CompetitorComparison {
  competitor_id: string;
  name: string;
  sectors: string[];
  services: string[];
  certifications: string[];
  employee_count: number | null;
  threat_level: Enums<"threat_level">;
  signal_count: number;
}

export interface IncidentIntelligence {
  id: string;
  incidentType: string;
  consultantHired: string;
  pitchApproach: string;
  incidentDescription: string;
  regulatoryNotice: string;
  clientDetails: string;
  scenario: string;
  dateTime: string;
}

export interface LeadScoreProfile {
  companyName: string;
  industry: string;
  overallScore: number;
  keyRiskFactors: string[];
  recommendedProduct: "BOOST" | "SENSE" | "Both" | "None";
  confidenceLevel: number;
  rationale: string;
  incident?: IncidentIntelligence | null;
}

// ─── Signal ──────────────────────────────────────────────────────────

export type Signal = Tables<"signals"> & {
  competitor_name?: string | null;
}

export interface SignalDetail extends Signal {
  competitor: Competitor | null;
  acknowledged_by_profile: UserProfile | null;
  created_by_profile: UserProfile | null;
  related_signals: Signal[];
}

export interface SignalTimelineEntry {
  id: string;
  title: string;
  signal_type: Enums<"signal_type">;
  severity: Enums<"severity_level">;
  detected_at: string;
  competitor_name: string | null;
}

// ─── Tender ──────────────────────────────────────────────────────────

export type Tender = Tables<"tenders"> & {
  assigned_to_name?: string | null;
  days_until_deadline?: number | null;
}

export interface TenderDetail extends Tender {
  assigned_to_profile: UserProfile | null;
  bid_decision_by_profile: UserProfile | null;
  created_by_profile: UserProfile | null;
  documents: Document[];
  related_tenders: Tender[];
}

export interface TenderValueRange {
  min: number | null;
  max: number | null;
  currency: string;
  formatted: string;
}

// ─── Regulation ──────────────────────────────────────────────────────

export type Regulation = Tables<"regulations"> & {
  assigned_to_name?: string | null;
  days_until_effective?: number | null;
  days_until_consultation_deadline?: number | null;
}

export interface RegulationDetail extends Regulation {
  assigned_to_profile: UserProfile | null;
  created_by_profile: UserProfile | null;
  documents: Document[];
  related_regulations: Regulation[];
}

// ─── Conversation / Message ──────────────────────────────────────────

export type Conversation = Tables<"conversations"> & {
  created_by_profile?: UserProfile | null;
  last_message_preview?: string | null;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export type Message = Tables<"messages"> & {
  parsed_citations?: Citation[];
}

export interface Citation {
  id: string;
  document_id: string;
  document_title: string;
  chunk_id: string;
  content_preview: string;
  page_number: number | null;
  similarity: number;
}

export interface StreamingMessage {
  id: string;
  conversation_id: string;
  role: Enums<"message_role">;
  content: string;
  is_streaming: boolean;
  citations: Citation[];
}

// ─── Document / Chunk ────────────────────────────────────────────────

export type Document = Tables<"documents"> & {
  created_by_profile?: UserProfile | null;
  download_url?: string;
}

export interface DocumentDetail extends Document {
  chunks: DocumentChunk[];
}

export type DocumentChunk = Tables<"document_chunks"> & {
  document_title?: string;
}

export interface DocumentChunkMatch {
  id: string;
  document_id: string;
  document_title: string;
  content: string;
  heading: string | null;
  page_number: number | null;
  similarity: number;
  metadata: Json | null;
}

// ─── Content ─────────────────────────────────────────────────────────

export type ContentItem = Tables<"content_items"> & {
  author_name?: string | null;
  author_avatar?: string | null;
}

export interface ContentItemDetail extends ContentItem {
  author_profile: UserProfile | null;
  related_content: ContentItem[];
}

// ─── Audit ───────────────────────────────────────────────────────────

export type AuditLog = Tables<"audit_logs"> & {
  user_name?: string | null;
  user_email?: string | null;
}

// ─── Dashboard ───────────────────────────────────────────────────────

export interface DashboardStats {
  total_competitors: number;
  active_signals: number;
  open_tenders: number;
  pending_regulations: number;
  recent_conversations: number;
  total_documents: number;
}

export interface DashboardSignalSummary {
  by_severity: Record<Enums<"severity_level">, number>;
  by_type: Record<Enums<"signal_type">, number>;
  trend: DashboardTrendPoint[];
}

export interface DashboardTrendPoint {
  date: string;
  count: number;
}

export interface DashboardTenderSummary {
  by_status: Record<Enums<"tender_status">, number>;
  total_value: number;
  pipeline_value: number;
  win_rate: number;
}

// ─── Search ──────────────────────────────────────────────────────────

export interface SearchResult {
  entity_type: "competitor" | "signal" | "tender" | "regulation" | "document" | "content";
  entity_id: string;
  title: string;
  subtitle: string | null;
  relevance: number;
  metadata: Json | null;
}

export interface SemanticSearchResult extends DocumentChunkMatch {
  score: number;
}

// ─── Notification ────────────────────────────────────────────────────

export interface RealtimeEvent<T = unknown> {
  event_type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  old_record: T | null;
  new_record: T | null;
  timestamp: string;
}
