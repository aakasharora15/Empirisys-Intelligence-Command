import { aiEnabled, complete } from '@/lib/ai/client';
import { LeadScoreProfile, BantScore } from './types';
import { performWebSearch } from '../search';
import { parseModelJson } from '@/lib/ai/parse';

// Helper: Deterministic scoring based on simulated data points
function calculateBant(companyName: string, industry: string, simulatedData: { recentIncidents: number; daysSinceIncident: number }): BantScore {
  let budget = 50;
  let authority = 50;
  let need = 50;
  let timing = 50;

  // Need increases if there are recent incidents
  if (simulatedData.recentIncidents > 0) need += 30;
  
  // Timing increases if the incident is very recent
  if (simulatedData.daysSinceIncident < 30) timing += 35;
  
  // Budget depends on industry CapEx
  if (['Oil & Gas', 'Chemicals', 'Offshore Wind'].includes(industry)) budget += 25;
  
  // Authority: Assume finding the right HSE VP is a bit easier in heavily regulated industries
  if (['Oil & Gas', 'Nuclear', 'Chemicals'].includes(industry)) authority += 15;

  return {
    budget: Math.min(100, budget),
    authority: Math.min(100, authority),
    need: Math.min(100, need),
    timing: Math.min(100, timing),
    overall: Math.min(100, (budget + authority + need + timing) / 4)
  };
}

export async function runLeadScoringPipeline(companyName: string): Promise<LeadScoreProfile> {
  // Phase 1: Ingestion & Normalization (Simulated for now)
  const industryMap: Record<string, string> = {
    'BP': 'Oil & Gas',
    'Ineos': 'Chemicals',
    'Shell': 'Oil & Gas',
    'Orsted': 'Offshore Wind',
  };
  
  const industry = industryMap[companyName] || 'Manufacturing';
  
  const simulatedData = {
    recentIncidents: Math.random() > 0.3 ? 1 : 0, // 70% chance of a recent incident
    daysSinceIncident: Math.floor(Math.random() * 90) + 1, // 1-90 days ago
  };

  // Phase 2: Scoring
  const bant = calculateBant(companyName, industry, simulatedData);

  // Phase 3: Synthesis
  // If no real API key, return a highly realistic mock payload
  if (!aiEnabled()) {
    console.log('[Lead Scoring Pipeline] No OpenAI API Key found, using fallback simulated response.');
    
    // Create a deterministic fallback based on company name
    return {
      companyName: companyName,
      industry: industry,
      overallScore: bant.overall,
      bant,
      keyRiskFactors: [
        "Ageing asset infrastructure leading to containment losses",
        "Disconnect between corporate safety metrics and frontline reality",
        "High contractor turnover eroding local safety culture"
      ],
      recommendedProduct: bant.need > 75 ? "SENSE" : "BOOST",
      confidenceLevel: 85,
      rationale: `With recent regulatory pressure in the ${industry} sector, ${companyName} needs to demonstrate proactive safety culture transformation.`,
      displacementStrategy: {
        incumbentConsultant: "dss+",
        vulnerability: "Incumbent approach relies on heavy manual audits and legacy checklists that frontline workers ignore.",
        pitchAngle: "Pitch SENSE as a data-driven, continuous diagnostic that replaces static quarterly audits with real-time cultural insights."
      },
      incident: simulatedData.recentIncidents > 0 ? {
        id: `inc-${Date.now()}`,
        incidentType: "Tier 1 Process Safety Event",
        incidentDescription: `A recent minor loss of primary containment at a regional ${industry.toLowerCase()} facility triggered a regulatory investigation, revealing gaps in barrier management.`,
        regulatoryNotice: "Improvement Notice issued by Competent Authority.",
        scenario: "Start-up operations post-turnaround",
        dateTime: new Date(Date.now() - (simulatedData.daysSinceIncident * 24 * 60 * 60 * 1000)).toISOString()
      } : undefined
    };
  }

  // Call OpenAI if key exists
  const searchQuery = `${companyName} HSE safety news incident`;
  const scrapedData = await performWebSearch(searchQuery);

  let prompt = `
You are the Empirisys Lead Scoring AI.
Generate a tactical sales dossier for: ${companyName} (Industry: ${industry}).
The company has an estimated BANT score of: ${JSON.stringify(bant)}.

Empirisys sells:
- BOOST (analyzes safety observations to detect weak signals before incidents happen)
- SENSE (a cultural diagnostic tool to align frontline workers with leadership perception)
- Insight360 (Analytics dashboard)
- Leadership360 (Leadership training)

Your Objective:
Analyze the target company based on recent industry signals, regulatory posture, and potential incumbent competitors (such as dss+, ERM, McKinsey, Sphera, Enablon, etc. - dynamically infer who the likely incumbent is). 
Use world-class B2B SaaS sales methodologies (MEDDIC, Challenger Sale) and Deep Process Safety methodologies (CCPS RBPS, Hearts & Minds, Bradley Curve) to build a compelling displacement strategy. 
You are NOT trained on one specific competitor. You must formulate strategies to beat ANY incumbent by attacking their generic weaknesses (e.g., manual consulting vs. scalable AI, lagging indicators vs. predictive leading indicators, generic checklists vs. tailored cultural diagnostics).

Output strictly valid JSON matching this schema:
{
  "companyName": "${companyName}",
  "industry": "${industry}",
  "overallScore": ${bant.overall},
  "bant": ${JSON.stringify(bant)},
  "keyRiskFactors": ["risk1", "risk2", "risk3"],
  "recommendedProduct": "BOOST" | "SENSE" | "Both",
  "confidenceLevel": number (0-100),
  "rationale": "Why Empirisys can win this client (using Challenger Sale insights)",
  "displacementStrategy": {
    "incumbentConsultant": "e.g., dss+, ERM, McKinsey, Sphera, Enablon - guess based on industry",
    "vulnerability": "Why the incumbent's methodology is weak or outdated",
    "pitchAngle": "How to disrupt them using Empirisys tools and modern safety data science"
  },
  "incident": {
    "id": "inc-123",
    "incidentType": "Brief type",
    "incidentDescription": "Realistic description of a recent HSE incident",
    "regulatoryNotice": "e.g., COMAH improvement notice",
    "scenario": "e.g., Confined space entry, Start-up post-turnaround",
    "dateTime": "ISO8601 date"
  }
}
Note: The incident block is optional if no real incident applies.
`;

  if (scrapedData) {
    prompt += `\n\n--- LIVE INTERNET DATA ---\nUse the following real-time internet search results to ground your tactical sales dossier in actual recent events for this company:\n${scrapedData}\nIf the data is insufficient, use your deep industry knowledge to generate a realistic simulated dossier.`;
  }
  

  const textContent = await complete({
    system: "You are an elite HSE B2B Sales Intelligence AI with deep knowledge of MEDDIC, CCPS RBPS, and Challenger Sale methodologies.\nOutput ONLY JSON, with no markdown formatting.",
    prompt: prompt,
    maxTokens: 1500,
    json: true,
  }) || '{}';
  const profile = parseModelJson<LeadScoreProfile>(textContent);
  return profile;
}
