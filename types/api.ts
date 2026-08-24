/**
 * API Request / Response Types
 * Covers pagination, filtering, sorting, error handling,
 * and all entity-specific request/response shapes.
 */

import type { Enums } from "./database";
import type {
  Competitor,
  CompetitorDetail,
  Signal,
  SignalDetail,
  Tender,
  TenderDetail,
  Regulation,
  RegulationDetail,
  Conversation,
  ConversationDetail,
  Message,
  Document,
  DocumentDetail,
  ContentItem,
  ContentItemDetail,
  SearchResult,
  SemanticSearchResult,
  DashboardStats,
  AuditLog,
  UserProfile,
} from "./domain";

// ─── Generic API Types ───────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  error: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface PaginationParams {
  page: number;
  per_page: number;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SortParams<T extends string = string> {
  sort_by: T;
  sort_order: "asc" | "desc";
}

export interface DateRangeFilter {
  from?: string;
  to?: string;
}

// ─── Competitor API ──────────────────────────────────────────────────

export interface CompetitorListParams extends PaginationParams {
  search?: string;
  threat_level?: Enums<"threat_level">[];
  status?: Enums<"entity_status">[];
  sectors?: string[];
  sort_by?: "name" | "threat_level" | "created_at" | "updated_at" | "signal_count";
  sort_order?: "asc" | "desc";
}

export interface CompetitorListResponse extends PaginatedResponse<Competitor> {}

export interface CompetitorDetailResponse extends ApiResponse<CompetitorDetail> {}

export interface CreateCompetitorRequest {
  name: string;
  website?: string;
  description?: string;
  headquarters?: string;
  employee_count?: number;
  revenue_range?: string;
  founded_year?: number;
  sectors?: string[];
  services?: string[];
  certifications?: string[];
  key_personnel?: Array<{
    name: string;
    title: string;
    linkedin_url?: string;
    notes?: string;
  }>;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
  };
  threat_level?: Enums<"threat_level">;
  notes?: string;
}

export interface UpdateCompetitorRequest extends Partial<CreateCompetitorRequest> {
  status?: Enums<"entity_status">;
}

// ─── Signal API ──────────────────────────────────────────────────────

export interface SignalListParams extends PaginationParams {
  search?: string;
  signal_type?: Enums<"signal_type">[];
  severity?: Enums<"severity_level">[];
  status?: Enums<"signal_status">[];
  source_type?: Enums<"signal_source_type">[];
  competitor_id?: string;
  date_range?: DateRangeFilter;
  tags?: string[];
  sort_by?: "title" | "severity" | "confidence" | "detected_at" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface SignalListResponse extends PaginatedResponse<Signal> {}

export interface SignalDetailResponse extends ApiResponse<SignalDetail> {}

export interface CreateSignalRequest {
  title: string;
  summary?: string;
  content?: string;
  source_url?: string;
  source_name?: string;
  source_type?: Enums<"signal_source_type">;
  signal_type: Enums<"signal_type">;
  severity?: Enums<"severity_level">;
  confidence?: number;
  competitor_id?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  published_at?: string;
}

export interface UpdateSignalRequest extends Partial<CreateSignalRequest> {
  status?: Enums<"signal_status">;
}

export interface AcknowledgeSignalRequest {
  signal_id: string;
}

// ─── Tender API ──────────────────────────────────────────────────────

export interface TenderListParams extends PaginationParams {
  search?: string;
  status?: Enums<"tender_status">[];
  bid_decision?: Enums<"bid_decision">[];
  sectors?: string[];
  value_min?: number;
  value_max?: number;
  deadline_range?: DateRangeFilter;
  assigned_to?: string;
  region?: string;
  sort_by?: "title" | "value_max" | "submission_deadline" | "relevance_score" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface TenderListResponse extends PaginatedResponse<Tender> {}

export interface TenderDetailResponse extends ApiResponse<TenderDetail> {}

export interface CreateTenderRequest {
  title: string;
  reference_number?: string;
  description?: string;
  issuing_authority: string;
  buyer_name?: string;
  buyer_url?: string;
  source_url?: string;
  value_min?: number;
  value_max?: number;
  currency?: string;
  location?: string;
  region?: string;
  sectors?: string[];
  cpv_codes?: string[];
  submission_deadline?: string;
  published_at?: string;
  contract_start?: string;
  contract_end?: string;
  contract_duration_months?: number;
  notes?: string;
}

export interface UpdateTenderRequest extends Partial<CreateTenderRequest> {
  status?: Enums<"tender_status">;
  bid_decision?: Enums<"bid_decision">;
  bid_decision_reason?: string;
  assigned_to?: string;
  relevance_score?: number;
}

// ─── Regulation API ──────────────────────────────────────────────────

export interface RegulationListParams extends PaginationParams {
  search?: string;
  regulation_type?: Enums<"regulation_type">[];
  status?: Enums<"regulation_status">[];
  impact_level?: Enums<"severity_level">[];
  jurisdiction?: string;
  sectors_affected?: string[];
  effective_date_range?: DateRangeFilter;
  assigned_to?: string;
  sort_by?: "title" | "effective_date" | "impact_level" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface RegulationListResponse extends PaginatedResponse<Regulation> {}

export interface RegulationDetailResponse extends ApiResponse<RegulationDetail> {}

export interface CreateRegulationRequest {
  title: string;
  reference_number?: string;
  issuing_body: string;
  description?: string;
  summary?: string;
  regulation_type?: Enums<"regulation_type">;
  jurisdiction?: string;
  sectors_affected?: string[];
  effective_date?: string;
  consultation_deadline?: string;
  source_url?: string;
  document_url?: string;
  impact_level?: Enums<"severity_level">;
  compliance_notes?: string;
  action_required?: string;
  assigned_to?: string;
  tags?: string[];
}

export interface UpdateRegulationRequest extends Partial<CreateRegulationRequest> {
  status?: Enums<"regulation_status">;
}

// ─── Conversation API ────────────────────────────────────────────────

export interface ConversationListParams extends PaginationParams {
  search?: string;
  context_type?: Enums<"conversation_context_type">;
  context_id?: string;
  pinned?: boolean;
  archived?: boolean;
  sort_by?: "title" | "created_at" | "updated_at" | "last_message_at";
  sort_order?: "asc" | "desc";
}

export interface ConversationListResponse extends PaginatedResponse<Conversation> {}

export interface ConversationDetailResponse extends ApiResponse<ConversationDetail> {}

export interface CreateConversationRequest {
  title: string;
  context_type?: Enums<"conversation_context_type">;
  context_id?: string;
  model?: string;
  system_prompt?: string;
}

export interface UpdateConversationRequest {
  title?: string;
  pinned?: boolean;
  archived?: boolean;
  system_prompt?: string;
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
  context_document_ids?: string[];
}

export interface SendMessageResponse extends ApiResponse<Message> {
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface StreamMessageRequest extends SendMessageRequest {
  stream: true;
}

// ─── Document API ────────────────────────────────────────────────────

export interface DocumentListParams extends PaginationParams {
  search?: string;
  document_type?: Enums<"document_type">[];
  processing_status?: Enums<"processing_status">[];
  source_entity_type?: string;
  source_entity_id?: string;
  tags?: string[];
  sort_by?: "title" | "file_size" | "created_at" | "processed_at";
  sort_order?: "asc" | "desc";
}

export interface DocumentListResponse extends PaginatedResponse<Document> {}

export interface DocumentDetailResponse extends ApiResponse<DocumentDetail> {}

export interface UploadDocumentRequest {
  file: File;
  title?: string;
  description?: string;
  document_type?: Enums<"document_type">;
  source_entity_type?: string;
  source_entity_id?: string;
  tags?: string[];
}

export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  document_type?: Enums<"document_type">;
  tags?: string[];
}

// ─── Content API ─────────────────────────────────────────────────────

export interface ContentListParams extends PaginationParams {
  search?: string;
  content_type?: Enums<"content_type">[];
  status?: Enums<"content_status">[];
  category?: string;
  tags?: string[];
  author_id?: string;
  sort_by?: "title" | "published_at" | "view_count" | "created_at";
  sort_order?: "asc" | "desc";
}

export interface ContentListResponse extends PaginatedResponse<ContentItem> {}

export interface ContentDetailResponse extends ApiResponse<ContentItemDetail> {}

export interface CreateContentRequest {
  title: string;
  content_type?: Enums<"content_type">;
  body: string;
  excerpt?: string;
  cover_image_url?: string;
  category?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  status?: Enums<"content_status">;
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {}

export interface PublishContentRequest {
  id: string;
  published_at?: string;
}

// ─── Search API ──────────────────────────────────────────────────────

export interface GlobalSearchParams {
  query: string;
  entity_types?: Array<"competitor" | "signal" | "tender" | "regulation" | "document" | "content">;
  limit?: number;
}

export interface GlobalSearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

export interface SemanticSearchParams {
  query: string;
  document_ids?: string[];
  match_threshold?: number;
  match_count?: number;
}

export interface SemanticSearchResponse {
  results: SemanticSearchResult[];
  query: string;
}

// ─── User / Auth API ─────────────────────────────────────────────────

export interface UserListParams extends PaginationParams {
  search?: string;
  role?: Enums<"user_role">[];
  department?: string;
  sort_by?: "full_name" | "email" | "role" | "created_at" | "last_active_at";
  sort_order?: "asc" | "desc";
}

export interface UserListResponse extends PaginatedResponse<UserProfile> {}

export interface UpdateUserRequest {
  full_name?: string;
  avatar_url?: string;
  role?: Enums<"user_role">;
  department?: string;
  job_title?: string;
  phone?: string;
  preferences?: Record<string, unknown>;
}

// ─── Dashboard API ───────────────────────────────────────────────────

export interface DashboardResponse {
  stats: DashboardStats;
  recent_signals: Signal[];
  upcoming_deadlines: Tender[];
  recent_conversations: Conversation[];
}

// ─── Audit API ───────────────────────────────────────────────────────

export interface AuditLogListParams extends PaginationParams {
  user_id?: string;
  action?: string;
  entity_type?: string;
  entity_id?: string;
  date_range?: DateRangeFilter;
  sort_by?: "created_at";
  sort_order?: "asc" | "desc";
}

export interface AuditLogListResponse extends PaginatedResponse<AuditLog> {}
