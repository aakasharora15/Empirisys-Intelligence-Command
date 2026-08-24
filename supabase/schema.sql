-- Enable pgvector extension
create extension if not exists vector;

-- Competitors Table
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  founded text,
  hq text,
  description text,
  type text check (type in ('Direct', 'Indirect')),
  pricing_model text,
  ai_analytics text check (ai_analytics in ('yes', 'partial', 'no')),
  hse_focus text check (hse_focus in ('yes', 'partial', 'no')),
  uk_presence text check (uk_presence in ('yes', 'partial', 'no')),
  saas_model text check (saas_model in ('yes', 'partial', 'no')),
  threat_score integer check (threat_score >= 0 and threat_score <= 100),
  products text[],
  strengths text[],
  weaknesses text[],
  positioning text,
  employee_count integer,
  funding text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Competitor Content Monitor Table
create table if not exists public.competitor_content (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid references public.competitors(id) on delete cascade,
  type text check (type in ('Post', 'Blog', 'News', 'Research')),
  title text not null,
  url text,
  source text,
  published_at timestamp with time zone,
  summary text,
  sentiment_score text, -- 'positive', 'neutral', 'negative'
  relevance_score integer check (relevance_score >= 0 and relevance_score <= 100),
  engagement_count integer,
  topic_tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Market Signals Table
create table if not exists public.market_signals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  source text not null,
  url text,
  published_at timestamp with time zone,
  relevance_score integer check (relevance_score >= 0 and relevance_score <= 100),
  category text check (category in ('Tender', 'Regulation', 'Programme', 'Opportunity', 'Global')),
  sector text,
  estimated_value numeric,
  deadline timestamp with time zone,
  region text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- UK Tenders Table (FTS Sync)
create table if not exists public.uk_tenders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authority text,
  sector text,
  estimated_value numeric,
  published_date timestamp with time zone,
  deadline timestamp with time zone,
  status text,
  fts_id text,
  relevance_score integer check (relevance_score >= 0 and relevance_score <= 100),
  why_relevant text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Empirisys Knowledge Table
create table if not exists public.empirisys_knowledge (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text,
  section text,
  embedding vector(1536), -- pgvector similarity search
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Queries Log Table
create table if not exists public.queries (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  module_type text not null,
  results_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Marketing Opportunities Table
create table if not exists public.marketing_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  based_on text,
  recommended_action text,
  effort_level text check (effort_level in ('Low', 'Medium', 'High')),
  impact_level text check (impact_level in ('Low', 'Medium', 'High')),
  content_angle text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Client Analyses Table
create table if not exists public.client_analyses (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  hse_risk_score integer check (hse_risk_score >= 0 and hse_risk_score <= 100),
  incumbent_consultant jsonb, -- { name, estimated_value, duration, weakness }
  incidents_json jsonb, -- Array of incidents { date, description, severity }
  pitch_strategy jsonb, -- { overview, products, key_points, estimated_value, next_step }
  recommended_products text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Near Miss Feed Table
create table if not exists public.near_miss_feed (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  category text not null,
  description text not null,
  source text not null,
  published_at text not null,
  severity text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function for similarity search
create or replace function match_knowledge (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    empirisys_knowledge.id,
    empirisys_knowledge.title,
    empirisys_knowledge.content,
    1 - (empirisys_knowledge.embedding <=> query_embedding) as similarity
  from empirisys_knowledge
  where 1 - (empirisys_knowledge.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
