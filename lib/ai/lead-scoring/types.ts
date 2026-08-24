export interface BantScore {
  budget: number; // 0-100
  authority: number; // 0-100
  need: number; // 0-100
  timing: number; // 0-100
  overall: number; // 0-100
}

export interface DisplacementStrategy {
  incumbentConsultant: string;
  vulnerability: string;
  pitchAngle: string;
}

export interface LeadScoreProfile {
  companyName: string;
  industry: string;
  overallScore: number;
  bant: BantScore;
  keyRiskFactors: string[];
  recommendedProduct: "BOOST" | "SENSE" | "Both" | "Insight360" | "Leadership360";
  confidenceLevel: number;
  rationale: string;
  displacementStrategy?: DisplacementStrategy;
  incident?: {
    id: string;
    incidentType: string;
    incidentDescription: string;
    regulatoryNotice: string;
    scenario: string;
    dateTime: string;
  };
}
