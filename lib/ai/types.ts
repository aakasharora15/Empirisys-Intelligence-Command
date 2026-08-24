export type IncidentSource = 'eu_osha' | 'chemical_park_registry' | 'regional_press' | 'public_database';

export interface RawSignal {
  id: string;
  sourceUrl: string;
  sourceType: IncidentSource;
  rawText: string;
  publishedAt: string;
}

export interface TriggerEvent {
  type: 'safety_near_miss' | 'environmental_fine' | 'plant_modernization' | 'new_head_of_process_safety';
  description: string;
  companyName: string;
  location: string;
}

export interface MatrixScore {
  marketSizeScore: number; // 0-100 (deal size proxy)
  regulatoryPressureScore: number; // 0-100 (Seveso III / AI Act)
  familiarityAlignmentScore: number; // 0-100 (similarity to UK energy clients)
  totalScore: number; // Average or weighted sum
}

export interface ExecutiveOutput {
  targetLead: string;
  leadScore: number;
  dateGenerated: string;
  incidentHistory: {
    triggerIdentified: string;
    summary: string;
    location: string;
  };
  regulatoryPressurePoint: {
    relevantFramework: string;
    exposureAnalysis: string;
  };
  tailoredProposition: {
    productRecommendation: 'BOOST' | 'DETECT';
    mitigationStrategy: string;
  };
  meddicQualification: {
    metrics: string;
    economicBuyer: string;
    decisionCriteria: string;
    decisionProcess: string;
    identifyPain: string;
    champion: string;
  };
}
