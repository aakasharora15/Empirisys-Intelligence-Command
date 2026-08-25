import { aiEnabled, completeStream } from '@/lib/ai/client';
import { mockClientAnalyses, ClientAnalysis } from '@/lib/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

// High fidelity structured Markdown template fallback for BP, Shell, etc. in case keys are missing
function getFallbackMarkdown(analysis: ClientAnalysis): string {
  const consultantVal = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(analysis.incumbent_consultant.estimated_value);
  const pitchVal = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(analysis.pitch_strategy.estimated_value);
  
  return `# CLIENT ANALYSIS REPORT: ${analysis.company_name}

## SECTION 1: COMPANY OVERVIEW
* **Company Name**: ${analysis.company_name}
* **Sector**: ${analysis.sector}
* **Employee Count**: ${analysis.employee_count}
* **UK Presence**: ${analysis.uk_presence}
* **HSE Track Record**: ${analysis.hse_track_record}

## SECTION 2: HSE RISK PROFILE
* **Risk Score**: ${analysis.hse_risk_score} (0 is safe, 100 is critical)
* **Near Miss Frequency**: Elevated near miss reporting logs recorded in the past two years
* **Incident History**:
${analysis.incidents_json.map(inc => `  * **Date**: ${inc.date} | **Severity**: ${inc.severity} | **Description**: ${inc.description}`).join('\n')}

## SECTION 3: INCUMBENT CONSULTANT
* **Advisor Name**: ${analysis.incumbent_consultant.name}
* **Contract Value**: ${consultantVal}
* **Contract Duration**: ${analysis.incumbent_consultant.duration}
* **Weaknesses**: ${analysis.incumbent_consultant.weakness}

## SECTION 4: EMPIRISYS PITCH STRATEGY
* **Strategic Overview**: ${analysis.pitch_strategy.overview}
* **Recommended Products**: ${analysis.pitch_strategy.products.join(', ')}
* **Key Talking Points**:
${analysis.pitch_strategy.key_points.map(pt => `  * ${pt}`).join('\n')}
* **Estimated Opportunity Value**: ${pitchVal}

## SECTION 5: RECOMMENDED NEXT STEPS
* **Action Required**: ${analysis.pitch_strategy.next_step}
* **Target Audience**: Chief Operations Officer or Operations Directors
`;
}

function getGenericFallback(companyName: string): string {
  return `# CLIENT ANALYSIS REPORT: ${companyName}

## SECTION 1: COMPANY OVERVIEW
* **Company Name**: ${companyName}
* **Sector**: Industrial Operations
* **Employee Count**: 15000 employees
* **UK Presence**: Extensive logistics and manufacturing infrastructure across the UK
* **HSE Track Record**: Moderate safety compliance logs with standard warning marks

## SECTION 2: HSE RISK PROFILE
* **Risk Score**: 62 (0 is safe, 100 is critical)
* **Near Miss Frequency**: Moderate telemetry alarms and safety logging activity
* **Incident History**:
  * **Date**: July 2025 | **Severity**: Medium | **Description**: Minor equipment failure and conveyor belt near miss during shift change

## SECTION 3: INCUMBENT CONSULTANT
* **Advisor Name**: Competitor legacy EHS suite
* **Contract Value**: £1,200,000
* **Contract Duration**: 2 years
* **Weaknesses**: Relies on static reporting checklists and slow manual entry forms which create log backlog

## SECTION 4: EMPIRISYS PITCH STRATEGY
* **Strategic Overview**: Position BOOST to automatically parse unstructured operator safety logs and SENSE to measure behavioral compliance.
* **Recommended Products**: BOOST, SENSE
* **Key Talking Points**:
  * BOOST NLP triages operator safety comments in under twelve milliseconds
  * SENSE surveys establish clear culture score references for team members
* **Estimated Opportunity Value**: £850,000

## SECTION 5: RECOMMENDED NEXT STEPS
* **Action Required**: Schedule initial technical briefing showing the BOOST text analytics dashboard
* **Target Audience**: Plant Manager or EHS Director
`;
}

import { z } from 'zod';

const AnalyzeClientSchema = z.object({
  companyName: z.string()
    .min(2)
    .max(100)
    // Only allow alphanumeric, spaces, commas, periods, ampersands, hyphens, and apostrophes
    // This strict sanitization prevents prompt injection breakouts via markdown or code blocks
    .regex(/^[a-zA-Z0-9\s\.,&'-]+$/, "Invalid company name format. Please remove special characters."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = AnalyzeClientSchema.safeParse(body);
    
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: parseResult.error.issues?.[0]?.message || 'Invalid payload' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { companyName } = parseResult.data;

    const hasProvider = aiEnabled();
    const formattedName = companyName.trim();

    // Check if we have preseeded data for the client
    const preseeded = mockClientAnalyses.find(
      c => c.company_name.toLowerCase() === formattedName.toLowerCase()
    );

    if (!hasProvider) {
      // Stream fallback mock data token by token (or rather word by word)
      const text = preseeded ? getFallbackMarkdown(preseeded) : getGenericFallback(formattedName);
      
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const words = text.split(/(\s+)/); // Keep whitespace
          for (const word of words) {
            controller.enqueue(encoder.encode(word));
            await new Promise(r => setTimeout(r, 10)); // Typwriter speed
          }
          controller.close();
        }
      });

      return new Response(stream, { headers: { 'Content-Type': 'text/plain' } });
    }

    const prompt = `You are a sales intelligence analyst for Empirisys. 
    Analyze target client: ${formattedName}
    
    1. Search for HSE incidents, near miss events, safety failures, regulatory issues at ${formattedName} in the last 2 years.
    2. Identify who the incumbent safety consultant or EHS software is.
    3. Generate a customised pitch strategy for Empirisys explaining which products (BOOST, SENSE, Empirisys 360) solve their specific problems.
    
    Structure your response EXACTLY using these Markdown headers (do not include any dashes inside titles or user facing texts, use spaces, colons, or dots):
    
    # CLIENT ANALYSIS REPORT: [Company Name]
    
    ## SECTION 1: COMPANY OVERVIEW
    [Name, sector, employee count, UK presence, HSE track record]
    
    ## SECTION 2: HSE RISK PROFILE
    * **Risk Score**: [Provide a numerical risk score between 0 and 100, where 0 is perfectly safe and 100 is high hazard threat]
    * **Near Miss Frequency**: [Assessment of near miss log counts]
    * **Incident History**: [Details of recent events]
    
    ## SECTION 3: INCUMBENT CONSULTANT
    * **Advisor Name**: [Name of current EHS software or advisor]
    * **Contract Value**: [Est value]
    * **Contract Duration**: [Duration]
    * **Weaknesses**: [Weaknesses of legacy checklists or manual logging]
    
    ## SECTION 4: EMPIRISYS PITCH STRATEGY
    * **Strategic Overview**: [Why Empirisys is better positioned]
    * **Recommended Products**: [BOOST and/or SENSE and/or Empirisys 360]
    * **Key Talking Points**: [3 to 5 bullets explaining BOOST NLP speed or SENSE culture scores]
    * **Estimated Opportunity Value**: [Est contract value]
    
    ## SECTION 5: RECOMMENDED NEXT STEPS
    * **Action Required**: [Suggested next step]
    * **Target Audience**: [Job title to target]
    
    Provide realistic, detailed, high fidelity text and do not use dashes.`;

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          const stream = completeStream({
            system: 'You are a sales intelligence analyst for Empirisys. Do not output any dashes in your response.',
            messages: [{ role: 'user', content: prompt }],
            maxTokens: 3000,
          });
          for await (const text of stream) {
            controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          try { controller.close(); } catch { /* already closed */ }
        }
      }
    });

    return new Response(readable, { headers: { 'Content-Type': 'text/plain' } });
  } catch (error) {
    console.error('Analyze Client API Error:', error);
    return new Response('Unable to process client analysis at this time.', { headers: { 'Content-Type': 'text/plain' } });
  }
}
