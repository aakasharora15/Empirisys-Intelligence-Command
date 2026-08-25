import { CLAUDE_OPUS } from '@/lib/ai/models';
import Anthropic from '@anthropic-ai/sdk';
import { RawSignal, TriggerEvent, MatrixScore, ExecutiveOutput } from './types';

/**
 * HSE Lead-Scoring Agent Engine
 * 
 * Implements the exact workflow specified:
 * 1. Data Ingestion Layer (Interface)
 * 2. Trigger Event Filter (LLM-powered extraction)
 * 3. Matrix Scoring Engine (Deterministic grading)
 * 4. Automated Executive Output (LLM-powered MEDDIC synthesis)
 */
export class LeadScoringAgent {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async processIncomingSignal(signal: RawSignal): Promise<ExecutiveOutput | null> {
    console.log(`[Data Ingestion Layer] Processing signal from ${signal.sourceType}: ${signal.sourceUrl}`);

    // Step 1: Trigger Event Filter
    const triggerEvent = await this.triggerEventFilter(signal.rawText);
    
    if (!triggerEvent) {
      console.log(`[Trigger Event Filter] No operational vulnerabilities found. Discarding signal.`);
      return null;
    }

    console.log(`[Trigger Event Filter] Identified: ${triggerEvent.type} at ${triggerEvent.companyName}`);

    // Step 2: Matrix Scoring Engine
    const score = await this.matrixScoringEngine(triggerEvent);
    console.log(`[Matrix Scoring Engine] Total Score: ${score.totalScore}/100`);

    // Step 3: Automated Executive Output
    if (score.totalScore >= 70) {
      const executiveBrief = await this.generateExecutiveOutput(triggerEvent, score, signal.rawText);
      return executiveBrief;
    }

    return null;
  }

  private async triggerEventFilter(rawText: string): Promise<TriggerEvent | null> {
    const response = await this.anthropic.messages.create({
      model: CLAUDE_OPUS,
      max_tokens: 1000,
      system: `You are the Empirisys Lead Qualification Filter.
Analyze the following market signal and identify if it contains a high-value trigger event.
Valid types: 'safety_near_miss', 'environmental_fine', 'plant_modernization', 'new_head_of_process_safety'.

If a valid trigger event is found, output JSON:
{
  "isValid": true,
  "type": "one_of_the_valid_types",
  "description": "Short summary of the event",
  "companyName": "Name of the target company",
  "location": "Geographic location or facility name"
}
If no valid trigger is found, output: { "isValid": false }
Output ONLY JSON, with no markdown formatting.`,
      messages: [
        { role: "user", content: rawText }
      ]
    });

    const textContent = response.content.find(c => c.type === 'text')?.text || '{"isValid": false}';
    const parsed = JSON.parse(textContent);
    
    if (parsed.isValid && parsed.type) {
      return {
        type: parsed.type,
        description: parsed.description,
        companyName: parsed.companyName,
        location: parsed.location
      };
    }
    return null;
  }

  private async matrixScoringEngine(trigger: TriggerEvent): Promise<MatrixScore> {
    // Deterministic consulting-grade prioritization model
    let marketSizeScore = 60;
    let regulatoryPressureScore = 70;
    let familiarityAlignmentScore = 50;

    const companyLower = trigger.companyName.toLowerCase();
    
    // High Asset Value Targets
    if (companyLower.includes('rotterdam') || companyLower.includes('basf') || companyLower.includes('shell') || companyLower.includes('bp')) {
      marketSizeScore = 95;
    }

    // High Regulatory Scrutiny Targets (Fines/Incidents directly trigger Seveso III audits)
    if (trigger.type === 'environmental_fine' || trigger.type === 'safety_near_miss') {
      regulatoryPressureScore = 95;
    }

    // Familiarity Alignment (similarity to Empirisys's UK/European energy baseline)
    if (trigger.location.toLowerCase().includes('uk') || trigger.location.toLowerCase().includes('germany') || trigger.location.toLowerCase().includes('netherlands')) {
      familiarityAlignmentScore = 90;
    }

    const totalScore = Math.round((marketSizeScore * 0.4) + (regulatoryPressureScore * 0.4) + (familiarityAlignmentScore * 0.2));

    return {
      marketSizeScore,
      regulatoryPressureScore,
      familiarityAlignmentScore,
      totalScore
    };
  }

  private async generateExecutiveOutput(trigger: TriggerEvent, score: MatrixScore, rawText: string): Promise<ExecutiveOutput> {
    const productRecommendation = trigger.type === 'plant_modernization' ? 'BOOST' : 'DETECT';

    const response = await this.anthropic.messages.create({
      model: CLAUDE_OPUS,
      max_tokens: 1500,
      system: `You are an elite Enterprise B2B Sales Partner with decades of experience closing high-ticket deals at top global management consulting firms (e.g., McKinsey, Big Four). Your logic must reflect the absolute highest echelon of elite corporate deal structuring and strategic client acquisition.
You are preparing an executive pitch brief based on a new trigger event.
Empirisys sells two main products: 
- DETECT (predictive AI safety monitoring, best for preventing fines/accidents)
- BOOST (culture/human factors analytics, best for modernizations/new leadership)

Your job is to apply the **MEDDIC sales qualification framework** to this event and synthesize the pitch.

Output JSON matching exactly this schema:
{
  "targetLead": "company name",
  "leadScore": ${score.totalScore},
  "dateGenerated": "YYYY-MM-DD",
  "incidentHistory": {
    "triggerIdentified": "event type formatted nicely",
    "summary": "description",
    "location": "location"
  },
  "regulatoryPressurePoint": {
    "relevantFramework": "e.g., Seveso III Directive, AI Act",
    "exposureAnalysis": "How this event exposes them to regulatory fines/scrutiny"
  },
  "tailoredProposition": {
    "productRecommendation": "${productRecommendation}",
    "mitigationStrategy": "A 2-sentence pitch on how the recommended product solves their exact pain point."
  },
  "meddicQualification": {
    "metrics": "What measurable impact will our product have here? (e.g., 30% reduction in near-misses)",
    "economicBuyer": "Who controls the budget here? (e.g., VP of Process Safety)",
    "decisionCriteria": "What will they base their buying decision on? (e.g., rapid compliance with Seveso III)",
    "decisionProcess": "What is the likely path to close? (e.g., Pilot at this specific facility first)",
    "identifyPain": "What is their exact, burning pain point based on this event?",
    "champion": "Who is the likely internal champion to sell this for us? (e.g., Facility Safety Director)"
  }
}
Output ONLY JSON, with no markdown formatting.`,
      messages: [
        { role: "user", content: `Trigger Event: ${JSON.stringify(trigger)}\nRaw Signal Context: ${rawText}` }
      ]
    });

    const textContent = response.content.find(c => c.type === 'text')?.text || '{}';
    const parsed = JSON.parse(textContent);
    return parsed as ExecutiveOutput;
  }
}
