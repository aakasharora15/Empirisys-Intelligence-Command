import { createClient } from '@supabase/supabase-js';

// Environment variables check for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// High fidelity, real world data complying with the absolute NO DASHES rule in text
export interface Competitor {
  id: string;
  name: string;
  website: string;
  founded: string;
  hq: string;
  description: string;
  type: 'Direct' | 'Indirect' | 'Partner' | 'Substitute';
  pricing_model: string;
  ai_analytics: 'yes' | 'partial' | 'no';
  hse_focus: 'yes' | 'partial' | 'no';
  uk_presence: 'yes' | 'partial' | 'no';
  saas_model: 'yes' | 'partial' | 'no';
  threat_score: number;
  products: string[];
  strengths: string[];
  weaknesses: string[];
  positioning: string;
  employee_count: number;
  funding: string;
  open_roles_count?: number;
  client_overlap: 'High' | 'Medium' | 'Low';
  content_activity: 'Active' | 'Moderate' | 'Low';
  market_focus: string[];
  recent_move: string;
  status: 'TRACKED' | 'EMERGING' | 'WATCHLIST' | 'DISMISSED';
  logoUrl?: string;
}

export interface DiscoveryLog {
  id: string;
  company_name: string;
  website: string;
  why_flagged: string;
  source: string;
  detected_at: string;
  confidence_score: number;
  status: 'TRACKED' | 'EMERGING' | 'WATCHLIST' | 'DISMISSED';
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

export interface CompetitorContent {
  id: string;
  competitor_id: string;
  competitor_name: string;
  type: 'Post' | 'Blog' | 'News' | 'Research';
  title: string;
  url: string;
  source: string;
  published_at: string;
  summary: string;
  sentiment_score: 'positive' | 'neutral' | 'negative';
  relevance_score: number;
  engagement_count: number;
  topic_tags: string[];
}

export interface EmpirisysKnowledge {
  id: string;
  title: string;
  content: string;
  type: string;
  section:
    | 'About'
    | 'BOOST'
    | 'SENSE'
    | 'Empirisys 360'
    | 'Clients'
    | 'Differentiators'
    | 'Target Industries';
}

export interface QueryLog {
  id: string;
  question: string;
  module_type: string;
  results_json: Record<string, unknown>;
  created_at: string;
}

export interface TriggerEvent {
  id: string;
  title: string;
  source: string;
  published_at: string;
  severity: 'Critical' | 'High' | 'Medium';
  category: 'HSE Notice' | 'Regulatory Change' | 'Incident' | 'Market Pain Point';
  why_relevant: string;
}

export const mockCompetitors: Competitor[] = [
  {
    id: 'c1',
    status: 'TRACKED',
    name: 'FENNEX (Fenx)',
    website: 'https://www.fennex.net',
    founded: '2016',
    hq: 'Aberdeen UK',
    description:
      'Closest direct competitor making similar claims regarding safety intelligence, but reported execution quality issues exist.',
    type: 'Direct',
    pricing_model: 'Project/SaaS',
    ai_analytics: 'yes',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 85,
    products: ['Fenx Safety Analytics'],
    strengths: [
      'Uses very similar messaging to Empirisys',
      'Strong presence in Aberdeen offshore sector',
    ],
    weaknesses: [
      'Clients report poor implementation quality (Empirisys asked to redo their work)',
      'May lack deep proprietary LLM capabilities',
    ],
    positioning: 'AI-driven safety insights',
    employee_count: 45,
    funding: 'Private',
    open_roles_count: 5,
    client_overlap: 'High',
    content_activity: 'Active',
    market_focus: ['Oil and Gas', 'Offshore'],
    recent_move: 'Aggressive marketing in Aberdeen offshore safety conferences',
    logoUrl: '/logos/fennex.png',
  },
  {
    id: 'c2',
    status: 'TRACKED',
    name: 'Synergi Life (DNV)',
    website: 'https://www.dnv.com',
    founded: '1864',
    hq: 'Hovik Norway',
    description:
      'Incumbent System of Record. Massive data capture tool but fails to connect datasets into actionable decision support.',
    type: 'Indirect',
    pricing_model: 'Enterprise License',
    ai_analytics: 'partial',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'partial',
    threat_score: 75,
    products: ['Synergi Life'],
    strengths: [
      'Massive global footprint and brand authority',
      'Used as the default system of record by many operators',
      'Prospects often cite the "perceived risk of moving away from established brands" as their primary hurdle.',
    ],
    weaknesses: [
      'Legacy architecture is highly complex',
      'Analysis is purely retrospective bar charts, no decision support',
    ],
    positioning: 'The trusted system of record for industrial risk management',
    employee_count: 15000,
    funding: 'Public',
    open_roles_count: 42,
    client_overlap: 'High',
    content_activity: 'Active',
    market_focus: ['Oil and Gas', 'Maritime', 'Energy'],
    recent_move: 'Attempting to add generic AI layers to legacy infrastructure',
    logoUrl: 'https://www.google.com/s2/favicons?domain=dnv.com&sz=128',
  },
  {
    id: 'c3',
    status: 'TRACKED',
    name: 'Enablon',
    website: 'https://enablon.com',
    founded: '2000',
    hq: 'Paris France',
    description: 'Incumbent System of Record focused on ESG and operational risk data capture.',
    type: 'Indirect',
    pricing_model: 'SaaS Subscription',
    ai_analytics: 'partial',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 70,
    products: ['Enablon EHS', 'Operational Risk Management'],
    strengths: ['Deep ESG framework tracking', 'Strong corporate enterprise penetration'],
    weaknesses: [
      'Like DNV, focuses on capture rather than real-time NLP insight',
      'Complex deployment',
    ],
    positioning: 'Integrated Risk Management software',
    employee_count: 1200,
    funding: 'Wolters Kluwer Corporate',
    open_roles_count: 28,
    client_overlap: 'Medium',
    content_activity: 'Active',
    market_focus: ['Manufacturing', 'Chemicals', 'Energy'],
    recent_move: 'Heavy marketing pivot towards broad ESG compliance',
    logoUrl: 'https://www.google.com/s2/favicons?domain=enablon.com&sz=128',
  },
  {
    id: 'c4',
    status: 'TRACKED',
    name: 'eOBS',
    website: 'https://eobs.com',
    founded: '2010',
    hq: 'UK',
    description:
      'Observation-only incumbent linked to Step Change in Safety. Empirisys rebuilt it, making it both a route into accounts and a messaging challenge.',
    type: 'Partner',
    pricing_model: 'Subscription',
    ai_analytics: 'no',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 40,
    products: ['eOBS Platform', 'eOBS Boost Module'],
    strengths: ['Used by 13 major operators', 'Empirisys already built the underlying new tech'],
    weaknesses: [
      'Observation-only (lacks incidents/actions linking)',
      'Muddy messaging when BOOST is sold inside eOBS',
    ],
    positioning: 'Standard observation sharing platform',
    employee_count: 20,
    funding: 'Industry Backed',
    open_roles_count: 2,
    client_overlap: 'High',
    content_activity: 'Low',
    market_focus: ['Oil and Gas', 'UKCS'],
    recent_move: 'Integrating Empirisys tech as an optional add-on',
    logoUrl: 'https://www.google.com/s2/favicons?domain=stepchangeinsafety.net&sz=128',
  },
  {
    id: 'c5',
    status: 'EMERGING',
    name: 'Internal AI (Copilot / DIY)',
    website: 'https://microsoft.com/copilot',
    founded: '2023',
    hq: 'Global',
    description:
      'Customers attempting to stitch together PowerBI, Excel, and generic AI (Copilot) to analyze safety logs internally.',
    type: 'Substitute',
    pricing_model: 'Internal Cost',
    ai_analytics: 'yes',
    hse_focus: 'no',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 95,
    products: ['Microsoft Copilot', 'PowerBI', 'Internal Data Lakes'],
    strengths: [
      'Perceived as "free" since they already pay for Microsoft 365',
      'Data stays internal',
      'Prospects hold a massive misconception that Empirisys is equivalent to using Copilot on their own data.',
    ],
    weaknesses: [
      'Produces one-off conversational outputs rather than repeatable analytical workflows',
      'Lacks safety governance, trackability, and the underlying data architecture required for high-hazard environments',
    ],
    positioning: 'Do-It-Yourself data analysis',
    employee_count: 0,
    funding: 'N/A',
    open_roles_count: 0,
    client_overlap: 'High',
    content_activity: 'Active',
    market_focus: ['All Sectors'],
    recent_move: 'Customers running ad-hoc prompts instead of buying dedicated platforms',
    logoUrl: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
  },
  {
    id: 'c6',
    status: 'TRACKED',
    name: 'Sphera',
    website: 'https://sphera.com',
    founded: '2016',
    hq: 'Chicago USA',
    description: 'A major player in ESG performance and risk management software globally.',
    type: 'Indirect',
    pricing_model: 'Enterprise License',
    ai_analytics: 'partial',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 82,
    products: ['SpheraCloud'],
    strengths: ['Massive data set and large private equity backing', 'Strong ESG modules'],
    weaknesses: ['Extremely complex, legacy UI/UX', 'Slow to adapt deep NLP capabilities natively'],
    positioning: 'Creating a safer, more sustainable and productive world',
    employee_count: 1000,
    funding: 'Private Equity (Blackstone)',
    open_roles_count: 15,
    client_overlap: 'High',
    content_activity: 'Active',
    market_focus: ['ESG', 'Oil and Gas', 'Manufacturing'],
    recent_move: 'Acquired smaller risk analysis firms to bolster AI claims',
    logoUrl: 'https://www.google.com/s2/favicons?domain=sphera.com&sz=128',
  },
  {
    id: 'c7',
    status: 'TRACKED',
    name: 'Intelex',
    website: 'https://intelex.com',
    founded: '1992',
    hq: 'Toronto Canada',
    description: 'One of the oldest and most established EHSQ software providers globally.',
    type: 'Indirect',
    pricing_model: 'SaaS Subscription',
    ai_analytics: 'no',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 65,
    products: ['Intelex EHSQ'],
    strengths: ['Deep feature set covering almost every compliance need', 'High enterprise trust'],
    weaknesses: ['Very dated architecture', 'Hardly any predictive analytics or modern NLP'],
    positioning: 'EHSQ software that changes business for good',
    employee_count: 500,
    funding: 'Acquired by Fortive',
    open_roles_count: 8,
    client_overlap: 'High',
    content_activity: 'Moderate',
    market_focus: ['Construction', 'Manufacturing'],
    recent_move: 'Updating UI to appear more modern to new buyers',
    logoUrl: 'https://www.google.com/s2/favicons?domain=intelex.com&sz=128',
  },
  {
    id: 'c8',
    status: 'TRACKED',
    name: 'Cority',
    website: 'https://cority.com',
    founded: '1985',
    hq: 'Toronto Canada',
    description: 'Enterprise EHS software known for deep occupational health capabilities.',
    type: 'Indirect',
    pricing_model: 'SaaS Subscription',
    ai_analytics: 'partial',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 72,
    products: ['CorityOne'],
    strengths: ['Excellent occupational health and medical tracking', 'Strong unified platform'],
    weaknesses: [
      'Less focused on front-line NLP data extraction compared to Empirisys',
      'Expensive',
    ],
    positioning: 'Empowering those who transform the way the world works',
    employee_count: 500,
    funding: 'Private Equity (Thoma Bravo)',
    open_roles_count: 12,
    client_overlap: 'Medium',
    content_activity: 'Active',
    market_focus: ['Healthcare', 'Oil and Gas', 'Mining'],
    recent_move: 'Expanding heavily into sustainability and ESG reporting',
    logoUrl: 'https://www.google.com/s2/favicons?domain=cority.com&sz=128',
  },
  {
    id: 'c9',
    status: 'TRACKED',
    name: 'VelocityEHS',
    website: 'https://velocityehs.com',
    founded: '2015',
    hq: 'Chicago USA',
    description: 'Mid-market to enterprise EHS and ESG software solutions.',
    type: 'Indirect',
    pricing_model: 'SaaS Subscription',
    ai_analytics: 'partial',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 68,
    products: ['VelocityEHS Accelerate'],
    strengths: ['Ergonomics and chemical management', 'Accessible pricing for mid-market'],
    weaknesses: [
      'AI features are surface level add-ons',
      'Less suited for highly complex offshore environments',
    ],
    positioning: 'EHS & ESG software built for you',
    employee_count: 500,
    funding: 'Private Equity (Partners Group)',
    open_roles_count: 10,
    client_overlap: 'Low',
    content_activity: 'Active',
    market_focus: ['Manufacturing', 'Chemicals'],
    recent_move: 'Acquired AI ergonomics company to integrate into platform',
    logoUrl: 'https://www.google.com/s2/favicons?domain=velocityehs.com&sz=128',
  },
  {
    id: 'c10',
    status: 'TRACKED',
    name: 'EcoOnline',
    website: 'https://ecoonline.com',
    founded: '2000',
    hq: 'Oslo Norway',
    description: 'European EHS provider with a strong presence in chemical safety and general EHS.',
    type: 'Indirect',
    pricing_model: 'SaaS Subscription',
    ai_analytics: 'no',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: 60,
    products: ['EcoOnline EHS'],
    strengths: ['Chemical safety data sheets (SDS) management', 'Strong European presence'],
    weaknesses: [
      'Not focused heavily on predictive modeling or NLP',
      'Fragmented platform due to acquisitions',
    ],
    positioning: 'Making workplaces safer and more sustainable',
    employee_count: 400,
    funding: 'Private Equity (Apax)',
    open_roles_count: 5,
    client_overlap: 'Medium',
    content_activity: 'Moderate',
    market_focus: ['Life Sciences', 'Energy', 'Food'],
    recent_move: 'Aggressive European acquisition strategy',
    logoUrl: 'https://www.google.com/s2/favicons?domain=ecoonline.com&sz=128',
  },
];

export const mockDiscoveryLogs: DiscoveryLog[] = [
  {
    id: 'dl1',
    company_name: 'SafetyLens AI',
    website: 'https://safetylens.ai',
    why_flagged:
      'Press release: "SafetyLens AI raises Series A to bring LLMs to safety culture logs"',
    source: 'TechCrunch RSS',
    detected_at: '18 June 2026',
    confidence_score: 92,
    status: 'EMERGING',
  },
  {
    id: 'dl2',
    company_name: 'RiskFlow Systems',
    website: 'https://riskflow.io',
    why_flagged: 'Manually added by team member',
    source: 'User Input',
    detected_at: '15 June 2026',
    confidence_score: 100,
    status: 'WATCHLIST',
  },
];

// Content signals
export const mockCompetitorContent: CompetitorContent[] = [
  {
    id: 'cc1',
    competitor_id: 'c2',
    competitor_name: 'Sphera',
    type: 'Post',
    title: 'Announcing our new Predictive ESG and Operational Risk dashboard',
    url: 'https://sphera.com/news/predictive-esg-launch',
    source: 'LinkedIn',
    published_at: '18 June 2026',
    summary:
      'CEO announced a shift from historical logs to predictive ESG modeling leveraging Blackstone backed resource layers.',
    sentiment_score: 'positive',
    relevance_score: 92,
    engagement_count: 342,
    topic_tags: ['ESG', 'Predictive Risk', 'Compliance'],
  },
  {
    id: 'cc2',
    competitor_id: 'c1',
    competitor_name: 'DNV',
    type: 'Research',
    title: 'The role of AI analytics in maritime and refinery process safety assessments',
    url: 'https://dnv.com/whitepaper/process-safety-ai',
    source: 'Hovik Research Journal',
    published_at: '17 June 2026',
    summary:
      'A comprehensive study highlighting DNV Synergi Life data sets and their limitations in predicting unstructured near miss logs.',
    sentiment_score: 'neutral',
    relevance_score: 88,
    engagement_count: 124,
    topic_tags: ['AI', 'Maritime', 'Process Safety'],
  },
  {
    id: 'cc3',
    competitor_id: 'c5',
    competitor_name: 'Enablon',
    type: 'Blog',
    title: 'Moving beyond clipboard compliance: Why live safety data matters in 2026',
    url: 'https://enablon.com/blog/beyond-clipboard-safety',
    source: 'Enablon Insights',
    published_at: '16 June 2026',
    summary:
      'A product manager writes about moving away from slow audits to continuous real time event logging in industrial sites.',
    sentiment_score: 'positive',
    relevance_score: 85,
    engagement_count: 89,
    topic_tags: ['EHS', 'Real Time', 'Audit'],
  },
  {
    id: 'cc4',
    competitor_id: 'c9',
    competitor_name: 'Cority',
    type: 'News',
    title: 'Cority expands public sector safety monitoring contracts in Northern England',
    url: 'https://cority.com/news/uk-expansion',
    source: 'EHS Today',
    published_at: '15 June 2026',
    summary:
      'Cority wins local government contract to track water infrastructure maintenance observations using myCority mobile app.',
    sentiment_score: 'positive',
    relevance_score: 79,
    engagement_count: 45,
    topic_tags: ['Water', 'Contract', 'UK'],
  },
  {
    id: 'cc5',
    competitor_id: 'c12',
    competitor_name: 'Alcumus',
    type: 'Research',
    title: 'Annual UK supply chain contractor safety compliance audit report',
    url: 'https://alcumus.com/report/supply-chain-safety-2026',
    source: 'Alcumus Press',
    published_at: '14 June 2026',
    summary:
      'Detailed statistics showing that contractor onboarding safety checks fail 14 percent of the time on first inspection.',
    sentiment_score: 'neutral',
    relevance_score: 91,
    engagement_count: 180,
    topic_tags: ['Contractor Safety', 'UK Compliance', 'Audit'],
  },
];

// Knowledge base index
export const mockKnowledge: EmpirisysKnowledge[] = [
  {
    id: 'k1',
    title: 'About Empirisys',
    content:
      'Empirisys is a Cardiff based industrial safety software company. We specialize in process safety human factors HSE data analytics and cultural diagnostics. We build technologies that help asset intensive operations predict and prevent high risk industrial accidents.',
    type: 'Corporate Overview',
    section: 'About',
  },
  {
    id: 'k2',
    title: 'BOOST Engine Overview',
    content:
      'BOOST is our proprietary safety data analytics engine. It uses advanced natural language processing NLP to parse unstructured data like maintenance notes operator logs audit reports and safety observations. It maps these inputs to industrial safety taxonomies to detect weak safety signals and predict incidents before they occur.',
    type: 'Core Technology',
    section: 'BOOST',
  },
  {
    id: 'k3',
    title: 'SENSE Platform Overview',
    content:
      'SENSE is our cultural diagnostic tool. It measures safety culture alignment leadership capabilities and worker engagement. By matching qualitative survey data with quantitative operational records it highlights where leadership behavior needs intervention to reduce compliance risk.',
    type: 'Culture Diagnostics',
    section: 'SENSE',
  },
  {
    id: 'k4',
    title: 'Empirisys 360 Framework',
    content:
      'Empirisys 360 combines SENSE diagnostics and BOOST analytics with specialized consulting services. This framework provides an end to end pathway to transform industrial safety culture by combining operational technology insights with human factors and training.',
    type: 'Consulting Framework',
    section: 'Empirisys 360',
  },
  {
    id: 'k5',
    title: 'Key Clients and Cases',
    content:
      'We actively partner with leading industrial and utility organizations. Key clients include BP (offshore platform log processing) Thames Water (culture and compliance auditing) SSE (renewable energy safety metrics) Ithaca Energy and Harbour Energy (North Sea oil rig risk models) Drax and Wessex Water.',
    type: 'Client Portfolio',
    section: 'Clients',
  },
  {
    id: 'k6',
    title: 'Market Differentiators',
    content:
      'Unlike generic compliance managers Sphera or Intelex who focus on forms and historical reporting Empirisys focuses on unstructured data analytics. BOOST handles messy free text fields and operator slang and maps it directly to safety taxonomies. SENSE integrates these insights with cultural assessments.',
    type: 'Competitive Advantage',
    section: 'Differentiators',
  },
  {
    id: 'k7',
    title: 'Target Industries',
    content:
      'We focus on high hazard asset intensive sectors. This includes Oil and Gas (offshore and onshore) Utilities (water and electricity distribution) Nuclear power generation Chemicals manufacturing and Maritime transport. Our safety models are tuned to COMAH regulated sites.',
    type: 'Market Focus',
    section: 'Target Industries',
  },
];

// Trigger Events and industry pain points
export const mockTriggerEvents: TriggerEvent[] = [
  {
    id: 'te1',
    title: 'HSE UK mandates COMAH near miss digital log reporting from Q4 2026',
    source: 'HSE UK',
    published_at: '24 June 2026',
    severity: 'Critical',
    category: 'Regulatory Change',
    why_relevant:
      'Immediate demand driver for BOOST NLP ingestion at all COMAH regulated sites before October deadline.',
  },
  {
    id: 'te2',
    title: 'Thames Water safety culture deficit flagged in Ofwat audit report',
    source: 'Ofwat',
    published_at: '23 June 2026',
    severity: 'High',
    category: 'HSE Notice',
    why_relevant:
      'Opens a direct pathway for SENSE culture diagnostic deployment across Thames Water treatment assets.',
  },
  {
    id: 'te3',
    title: 'Subcontractor vetting failures identified at Balfour Beatty highway sites near Leeds',
    source: 'RIDDOR',
    published_at: '22 June 2026',
    severity: 'High',
    category: 'Incident',
    why_relevant:
      'Demonstrates the SENSE subcontractor behavioral vetting gap across UK construction sector.',
  },
  {
    id: 'te4',
    title: 'Alarm fatigue implicated in North Sea separator pressure near miss',
    source: 'OPITO Safety Bulletin',
    published_at: '20 June 2026',
    severity: 'Critical',
    category: 'Market Pain Point',
    why_relevant:
      'Directly reinforces the BOOST NLP alarm triage narrative for oil and gas prospects in Aberdeen.',
  },
  {
    id: 'te5',
    title:
      'ONR mandates quarterly contractor cultural assessments at nuclear decommissioning sites',
    source: 'ONR UK',
    published_at: '18 June 2026',
    severity: 'High',
    category: 'Regulatory Change',
    why_relevant:
      'Expands SENSE assessment addressable market into the nuclear decommissioning sector immediately.',
  },
  {
    id: 'te6',
    title: 'Offshore wind turbine transfer incident highlights inadequate safety briefing logs',
    source: 'MAIB',
    published_at: '17 June 2026',
    severity: 'Medium',
    category: 'Incident',
    why_relevant:
      'Validates BOOST log parsing for offshore renewables and increases SSE prospect urgency.',
  },
];

// Marketing Opportunities

// Initial Queries Log
export const mockQueries: QueryLog[] = [
  {
    id: 'q1',
    question: 'How does BOOST compare to Intelex and Sphera?',
    module_type: 'Competitor Intelligence',
    results_json: {
      response:
        'BOOST parses unstructured text logs whereas Intelex and Sphera rely on structured compliance forms.',
    },
    created_at: '18 June 2026',
  },
  {
    id: 'q2',
    question: 'What are the main safety projects in the water sector recently?',
    module_type: 'Market Scanning',
    results_json: {
      response: 'Thames Water published a safety culture project valued at 2 million pounds.',
    },
    created_at: '17 June 2026',
  },
];

// Helper functions for DB access with local cache fallback
export async function getTriggerEvents(): Promise<TriggerEvent[]> {
  // Future: add Supabase table integration
  return mockTriggerEvents;
}

export async function getCompetitors(): Promise<Competitor[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('competitors')
      .select('*')
      .order('threat_score', { ascending: false });
    if (!error && data && data.length > 0) {
      return data as Competitor[];
    }
  }
  return mockCompetitors;
}

export async function getCompetitorContent(): Promise<CompetitorContent[]> {
  if (supabase) {
    const { data, error } = await supabase.from('competitor_content').select('*');
    if (!error && data && data.length > 0) {
      return data as unknown as CompetitorContent[];
    }
  }
  return mockCompetitorContent;
}

export async function getKnowledge(): Promise<EmpirisysKnowledge[]> {
  if (supabase) {
    const { data, error } = await supabase.from('empirisys_knowledge').select('*');
    if (!error && data && data.length > 0) {
      return data as EmpirisysKnowledge[];
    }
  }
  return mockKnowledge;
}

export async function getQueries(): Promise<QueryLog[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data as unknown as QueryLog[];
    }
  }
  return mockQueries;
}

export async function addQuery(
  question: string,
  module_type: string,
  results_json: Record<string, unknown>,
): Promise<void> {
  const newQuery: QueryLog = {
    id: 'q' + Math.random().toString(36).substr(2, 9),
    question,
    module_type,
    results_json,
    created_at: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
  mockQueries.unshift(newQuery);
  if (supabase) {
    await supabase.from('queries').insert({
      question,
      module_type,
      results_json,
    });
  }
}

// Client Acquisition Intelligence Interfaces
export interface ClientAnalysis {
  id: string;
  company_name: string;
  sector: string;
  employee_count: string;
  uk_presence: string;
  hse_track_record: string;
  hse_risk_score: number;
  incumbent_consultant: {
    name: string;
    estimated_value: number;
    duration: string;
    weakness: string;
  };
  incidents_json: Array<{
    date: string;
    description: string;
    severity: string;
  }>;
  pitch_strategy: {
    overview: string;
    products: string[];
    key_points: string[];
    estimated_value: number;
    next_step: string;
  };
  recommended_products: string[];
}

export interface NearMissEvent {
  id: string;
  company_name: string;
  category: string;
  description: string;
  source: string;
  published_at: string;
  severity: string;
}

// Seed data for client analyses (no dashes)
export const mockClientAnalyses: ClientAnalysis[] = [
  {
    id: 'ca1',
    company_name: 'BP',
    sector: 'Oil and Gas',
    employee_count: '87000 employees',
    uk_presence: 'Significant offshore and retail network UK wide',
    hse_track_record:
      'Strong safety focus but challenged by legacy North Sea infrastructure issues',
    hse_risk_score: 78,
    incumbent_consultant: {
      name: 'DNV',
      estimated_value: 4500000,
      duration: '3 years',
      weakness:
        'Legacy configuration forms create administrative delay and ignore unstructured logs',
    },
    incidents_json: [
      {
        date: 'June 2025',
        description: 'Minor gas leak at North Sea offshore asset during maintenance shutdown',
        severity: 'Medium',
      },
      {
        date: 'March 2026',
        description:
          'Refinery telemetry near miss alarm fatigue resulting in delayed shut off valve response',
        severity: 'High',
      },
    ],
    pitch_strategy: {
      overview:
        'BP requires real time data ingestion for offshore near miss logs to replace slow manual auditing checklists.',
      products: ['BOOST', 'SENSE'],
      key_points: [
        'BOOST NLP engine parses unstructured logs in under twelve milliseconds',
        'SENSE culture diagnostics identify team alignment gaps before incidents happen',
        'Demonstrated Wessex Water telemetry integration results as proof',
      ],
      estimated_value: 1800000,
      next_step: 'Request meeting with Head of HSE at BP London',
    },
    recommended_products: ['BOOST', 'SENSE'],
  },
  {
    id: 'ca2',
    company_name: 'Shell',
    sector: 'Oil and Gas',
    employee_count: '93000 employees',
    uk_presence: 'Large refinery operations and head office in London',
    hse_track_record: 'Rigorous compliance auditing standard with active net zero investments',
    hse_risk_score: 72,
    incumbent_consultant: {
      name: 'Sphera',
      estimated_value: 3800000,
      duration: '2 years',
      weakness: 'Platform lacks unstructured near miss analysis and offline mobile sync',
    },
    incidents_json: [
      {
        date: 'October 2025',
        description: 'Subcontractor falls from height during crane rigging on offshore asset',
        severity: 'High',
      },
      {
        date: 'February 2026',
        description: 'Gas detector alarm failure in refinery processing block',
        severity: 'High',
      },
    ],
    pitch_strategy: {
      overview:
        'Shell needs mobile offline near miss log reporting and BOOST NLP integration to resolve rigging risk vectors.',
      products: ['BOOST', 'SENSE', 'Empirisys 360'],
      key_points: [
        'Empirisys 360 maps rig worker behavior diagnostics to digital compliance',
        'Offline sync capabilities in myCority are matched by plug and play BOOST NLP',
        'BP refinery success case study as reference',
      ],
      estimated_value: 2400000,
      next_step: 'Arrange technical demonstration with Shell EHS director in Aberdeen',
    },
    recommended_products: ['BOOST', 'SENSE', 'Empirisys 360'],
  },
  {
    id: 'ca3',
    company_name: 'Balfour Beatty',
    sector: 'Construction and Infrastructure',
    employee_count: '26000 employees',
    uk_presence: 'Largest infrastructure builder in the UK with active highways projects',
    hse_track_record: 'Comprehensive site vetting processes with high subcontractor volume risk',
    hse_risk_score: 65,
    incumbent_consultant: {
      name: 'Alcumus',
      estimated_value: 2100000,
      duration: '4 years',
      weakness: 'Vetting forms are historical and slow to report floor observations',
    },
    incidents_json: [
      {
        date: 'August 2025',
        description: 'Near miss excavation collapse on highway project due to delayed soil audit',
        severity: 'Medium',
      },
    ],
    pitch_strategy: {
      overview:
        'Balfour Beatty requires SENSE culture diagnostics to monitor subcontractor compliance behaviors in real time.',
      products: ['SENSE', 'Empirisys 360'],
      key_points: [
        'Vetting safety compliance forms are animated into active telemetry maps',
        'SENSE culture score surveys detect subcontractor risk factors early',
      ],
      estimated_value: 1500000,
      next_step: 'Provide Wessex Water compliance case study to procurement team',
    },
    recommended_products: ['SENSE', 'Empirisys 360'],
  },
  {
    id: 'ca4',
    company_name: 'Thames Water',
    sector: 'Water Utilities',
    employee_count: '7000 employees',
    uk_presence: 'Total coverage across London and Thames Valley utility assets',
    hse_track_record:
      'Under intense regulatory oversight on pollution and facility safety compliance',
    hse_risk_score: 85,
    incumbent_consultant: {
      name: 'Intelex',
      estimated_value: 2900000,
      duration: '3 years',
      weakness: 'High pricing tier and slow customization of treatment observation workflows',
    },
    incidents_json: [
      {
        date: 'November 2025',
        description: 'Chemical overflow at water treatment facility due to alarm panel lag',
        severity: 'High',
      },
    ],
    pitch_strategy: {
      overview:
        'Thames Water requires BOOST NLP to parse low level maintenance observations and prevent overflows.',
      products: ['BOOST', 'SENSE'],
      key_points: [
        'BOOST NLP maps unstructured observations to COMAH water standards',
        'Cost effective deployment compared to Intelex customization overhead',
      ],
      estimated_value: 2000000,
      next_step: 'Submit formal proposal for the open culture audit project',
    },
    recommended_products: ['BOOST', 'SENSE'],
  },
  {
    id: 'ca5',
    company_name: 'SSE',
    sector: 'Energy and Renewables',
    employee_count: '12000 employees',
    uk_presence: 'Main power transmission network operator in Scotland and wind parks',
    hse_track_record: 'Good overall safety metrics with specialized offshore transfer risk sectors',
    hse_risk_score: 58,
    incumbent_consultant: {
      name: 'Lloyds Register',
      estimated_value: 1700000,
      duration: '2 years',
      weakness: 'Consulting Day rates are high with no unified SaaS telemetry dashboard',
    },
    incidents_json: [
      {
        date: 'January 2026',
        description: 'Wind turbine technician near miss during offshore transfer in high swells',
        severity: 'Medium',
      },
    ],
    pitch_strategy: {
      overview:
        'SSE needs a centralized predictive safety telemetry dashboard utilizing SENSE diagnostics.',
      products: ['SENSE'],
      key_points: [
        'Qualitative behavioral safety score cards mapped to wind assets',
        'Lower total cost of ownership compared to LR consulting day rates',
      ],
      estimated_value: 1100000,
      next_step: 'Invite SSE HSE lead to our renewables safety webinar',
    },
    recommended_products: ['SENSE'],
  },
  {
    id: 'ca6',
    company_name: 'Harbour Energy',
    sector: 'Oil and Gas',
    employee_count: '2000 employees',
    uk_presence: 'Largest independent oil producer in the UK North Sea sector',
    hse_track_record: 'Active offshore compliance reporting with focus on process safety isolation',
    hse_risk_score: 78,
    incumbent_consultant: {
      name: 'Ideagen',
      estimated_value: 3200000,
      duration: '3 years',
      weakness: 'Product lines are highly fragmented with no unified AI predictive engine',
    },
    incidents_json: [
      {
        date: 'April 2026',
        description: 'Process safety near miss during valve isolation check on offshore rig',
        severity: 'High',
      },
    ],
    pitch_strategy: {
      overview:
        'Harbour Energy requires BOOST NLP to parse drilling logs and identify latent safety risks before isolation checks.',
      products: ['BOOST', 'Empirisys 360'],
      key_points: [
        'Ingestion of drilling notes matches safety checklist items immediately',
        'Empirisys 360 provides unified safety integrity reports',
      ],
      estimated_value: 1600000,
      next_step: 'Send technical brochure on rig logs processing with BOOST',
    },
    recommended_products: ['BOOST', 'Empirisys 360'],
  },
  {
    id: 'ca7',
    company_name: 'Drax',
    sector: 'Energy and Biomass',
    employee_count: '3000 employees',
    uk_presence: 'Operates largest single power plant in the UK located in Yorkshire',
    hse_track_record: 'Complex biomass handling plants requiring continuous thermal hazard logs',
    hse_risk_score: 60,
    incumbent_consultant: {
      name: 'Bureau Veritas',
      estimated_value: 1200000,
      duration: '1 year',
      weakness: 'Manual inspectors are slow to report risk signals to operations',
    },
    incidents_json: [
      {
        date: 'September 2025',
        description: 'Conveyor belt heat anomaly near miss in biomass fuel processing sector',
        severity: 'Medium',
      },
    ],
    pitch_strategy: {
      overview:
        'Drax needs real time risk telemetry dashboards utilizing BOOST NLP on plant operator logs.',
      products: ['BOOST'],
      key_points: [
        'BOOST NLP triages operator observations to detect conveyor anomalies early',
        'Integrate physical inspection findings into a single digital workspace',
      ],
      estimated_value: 950000,
      next_step: 'Set up briefing session with Drax plant manager in Yorkshire',
    },
    recommended_products: ['BOOST'],
  },
];

// Seed data for near miss feed (no dashes)
export const mockNearMissFeed: NearMissEvent[] = [
  {
    id: 'nm1',
    company_name: 'SSE',
    category: 'Subcontractor Fatality Risk Event',
    description:
      'Wind turbine technician near miss transfer event during rough sea conditions offshore North Sea',
    source: 'Google News RSS',
    published_at: '1 hour ago',
    severity: 'High',
  },
  {
    id: 'nm2',
    company_name: 'BP',
    category: 'Tier 1 Process Safety Near Miss',
    description:
      'Refinery telemetry alarm fatigue event leading to pressure build up inside separator unit',
    source: 'UK HSE enforcement database',
    published_at: '3 hours ago',
    severity: 'High',
  },
  {
    id: 'nm3',
    company_name: 'Thames Water',
    category: 'COMAH Reportable Event',
    description:
      'Chemical overflow warning alert at water purification plant near Reading during discharge',
    source: 'RIDDOR incident reports',
    published_at: '8 hours ago',
    severity: 'Medium',
  },
  {
    id: 'nm4',
    company_name: 'Shell',
    category: 'Subcontractor Fatality Risk Event',
    description:
      'Subcontractor fall protection lanyard failure near miss event on offshore platform deck',
    source: 'Company press release',
    published_at: '18 hours ago',
    severity: 'High',
  },
  {
    id: 'nm5',
    company_name: 'Balfour Beatty',
    category: 'Excavation Near Miss',
    description:
      'Soil wall stability warning alert during highway excavation works near Leeds bypass sector',
    source: 'RIDDOR incident reports',
    published_at: '1 day ago',
    severity: 'Medium',
  },
  {
    id: 'nm6',
    company_name: 'Harbour Energy',
    category: 'Process Safety Near Miss',
    description:
      'Isolation valve seal degradation observation recorded during pipeline check on rig C',
    source: 'Google News RSS',
    published_at: '2 days ago',
    severity: 'Low',
  },
  {
    id: 'nm7',
    company_name: 'Drax',
    category: 'Thermal near miss',
    description:
      'Biomass fuel conveyor belt thermal sensor alert near miss during intake shutdown phase',
    source: 'Company press release',
    published_at: '3 days ago',
    severity: 'Medium',
  },
];

// Helper functions for retrieval
export async function getClientAnalyses(): Promise<ClientAnalysis[]> {
  if (supabase) {
    const { data, error } = await supabase.from('client_analyses').select('*');
    if (!error && data && data.length > 0) {
      return data as ClientAnalysis[];
    }
  }
  return mockClientAnalyses;
}

export async function getNearMissFeed(): Promise<NearMissEvent[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('near_miss_feed')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data as NearMissEvent[];
    }
  }
  return mockNearMissFeed;
}

export async function addClientAnalysis(
  analysis: Omit<ClientAnalysis, 'id'>,
): Promise<ClientAnalysis> {
  const newAnalysis: ClientAnalysis = {
    ...analysis,
    id: 'ca' + Math.random().toString(36).substr(2, 9),
  };
  mockClientAnalyses.unshift(newAnalysis);
  if (supabase) {
    await supabase.from('client_analyses').insert(analysis);
  }
  return newAnalysis;
}

export async function getNearMissFeedByCompany(companyName: string): Promise<NearMissEvent[]> {
  const feed = await getNearMissFeed();
  return feed.filter((f) => f.company_name.toLowerCase() === companyName.toLowerCase());
}

export async function getDiscoveryLogs(): Promise<DiscoveryLog[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [...mockDiscoveryLogs];
}

export async function addManualWatchlist(nameOrUrl: string): Promise<Competitor> {
  await new Promise((r) => setTimeout(r, 1500));

  const id = `cw_${Date.now()}`;
  const logId = `l_${Date.now()}`;

  let formattedName = nameOrUrl;
  let formattedWebsite = `https://${nameOrUrl.toLowerCase().replace(/\s+/g, '')}.com`;

  if (nameOrUrl.startsWith('http')) {
    formattedWebsite = nameOrUrl;
    try {
      const url = new URL(nameOrUrl);
      formattedName = url.hostname.replace('www.', '').split('.')[0];
      formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    } catch {
      formattedName = 'Unknown Company';
    }
  }

  const comp: Competitor = {
    id,
    status: 'WATCHLIST',
    name: formattedName,
    website: formattedWebsite,
    founded: new Date().getFullYear().toString(),
    hq: 'Unknown',
    description: `AI-generated preliminary profile for ${formattedName}. Platform is currently gathering data to assess full market impact.`,
    type: 'Indirect',
    pricing_model: 'Unknown',
    ai_analytics: 'partial',
    hse_focus: 'yes',
    uk_presence: 'yes',
    saas_model: 'yes',
    threat_score: Math.floor(Math.random() * 30) + 40,
    products: ['Safety Module', 'Risk Analytics'],
    strengths: ['Agile market entry', 'Modern SaaS architecture'],
    weaknesses: ['Limited historical safety data', 'Small team size'],
    positioning: 'Innovating EHS software',
    employee_count: Math.floor(Math.random() * 100) + 10,
    funding: 'VC Backed',
    open_roles_count: 3,
    client_overlap: 'Low',
    content_activity: 'Moderate',
    market_focus: ['Construction', 'Manufacturing'],
    recent_move: 'Pivoting from generic computer vision to HSE specific dashboards',
    logoUrl:
      'https://ui-avatars.com/api/?name=SafetyLens&background=020617&color=eab308&size=256&font-size=0.33&bold=true',
  };

  mockCompetitors.push(comp);

  mockDiscoveryLogs.unshift({
    id: logId,
    company_name: comp.name,
    website: comp.website,
    why_flagged: 'Manually added to watchlist by team member for active tracking.',
    source: 'Manual Entry',
    detected_at: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    confidence_score: 100,
    status: 'WATCHLIST',
  });

  return comp;
}
