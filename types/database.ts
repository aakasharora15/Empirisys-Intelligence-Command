export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      competitors: {
        Row: {
          id: string
          organisation_id: string
          name: string
          slug: string
          description: string | null
          website: string | null
          logo_url: string | null
          sector: string
          sub_sector: string | null
          employee_count_range: string | null
          revenue_range: string | null
          headquarters: string | null
          founded_year: number | null
          overall_score: number
          threat_level: "low" | "medium" | "high" | "critical"
          tracking_status: "active" | "watchlist" | "archived"
          ai_summary: string | null
          ai_summary_updated_at: string | null
          metadata: Json
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          name: string
          slug: string
          description?: string | null
          website?: string | null
          logo_url?: string | null
          sector: string
          sub_sector?: string | null
          employee_count_range?: string | null
          revenue_range?: string | null
          headquarters?: string | null
          founded_year?: number | null
          overall_score?: number
          threat_level?: "low" | "medium" | "high" | "critical"
          tracking_status?: "active" | "watchlist" | "archived"
          ai_summary?: string | null
          ai_summary_updated_at?: string | null
          metadata?: Json
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          name?: string
          slug?: string
          description?: string | null
          website?: string | null
          logo_url?: string | null
          sector?: string
          sub_sector?: string | null
          employee_count_range?: string | null
          revenue_range?: string | null
          headquarters?: string | null
          founded_year?: number | null
          overall_score?: number
          threat_level?: "low" | "medium" | "high" | "critical"
          tracking_status?: "active" | "watchlist" | "archived"
          ai_summary?: string | null
          ai_summary_updated_at?: string | null
          metadata?: Json
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      signals: {
        Row: {
          id: string
          organisation_id: string
          title: string
          description: string
          content: string | null
          category: "tender" | "regulation" | "industry" | "competitive" | "technology" | "economic"
          sub_category: string | null
          source_name: string
          source_url: string | null
          source_type: "rss" | "api" | "scrape" | "manual" | "ai_generated"
          relevance_score: number
          lifecycle_status: "discovered" | "reviewed" | "validated" | "actionable" | "archived"
          assigned_to: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          published_at: string | null
          deadline: string | null
          tags: string[]
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          description: string
          content?: string | null
          category: "tender" | "regulation" | "industry" | "competitive" | "technology" | "economic"
          sub_category?: string | null
          source_name: string
          source_url?: string | null
          source_type?: "rss" | "api" | "scrape" | "manual" | "ai_generated"
          relevance_score?: number
          lifecycle_status?: "discovered" | "reviewed" | "validated" | "actionable" | "archived"
          assigned_to?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          published_at?: string | null
          deadline?: string | null
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          description?: string
          content?: string | null
          category?: "tender" | "regulation" | "industry" | "competitive" | "technology" | "economic"
          sub_category?: string | null
          source_name?: string
          source_url?: string | null
          source_type?: "rss" | "api" | "scrape" | "manual" | "ai_generated"
          relevance_score?: number
          lifecycle_status?: "discovered" | "reviewed" | "validated" | "actionable" | "archived"
          assigned_to?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          published_at?: string | null
          deadline?: string | null
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: { Row: any; Insert: any; Update: any }
      tenders: { Row: any; Insert: any; Update: any }
      regulations: { Row: any; Insert: any; Update: any }
      conversations: { Row: any; Insert: any; Update: any }
      messages: { Row: any; Insert: any; Update: any }
      documents: { Row: any; Insert: any; Update: any }
      document_chunks: { Row: any; Insert: any; Update: any }
      content_items: { Row: any; Insert: any; Update: any }
      audit_logs: { Row: any; Insert: any; Update: any }
    }
    Enums: {
      threat_level: "low" | "medium" | "high" | "critical";
      entity_status: "active" | "watchlist" | "archived";
      signal_type: "tender" | "regulation" | "industry" | "competitive" | "technology" | "economic";
      severity_level: "low" | "medium" | "high" | "critical";
      signal_status: "discovered" | "reviewed" | "validated" | "actionable" | "archived";
      signal_source_type: "rss" | "api" | "scrape" | "manual" | "ai_generated";
      tender_status: "open" | "closed" | "awarded" | "cancelled";
      bid_decision: "pending" | "go" | "no_go";
      regulation_type: "law" | "guideline" | "standard";
      regulation_status: "draft" | "active" | "repealed";
      conversation_context_type: "competitor" | "signal" | "tender" | "regulation" | "document" | "content";
      document_type: "pdf" | "word" | "excel" | "image" | "text" | "other";
      processing_status: "pending" | "processing" | "completed" | "failed";
      content_type: "article" | "post" | "report" | "whitepaper";
      content_status: "draft" | "review" | "published" | "archived";
      user_role: "admin" | "editor" | "viewer";
      message_role: "user" | "assistant" | "system";
    }
  }
}

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
