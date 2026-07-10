export interface PatientRecord {
  patient_id: string;
  patient_name?: string;
  service_line: string;
  comment: string;
  visit_type: string;
  sentiment_score: number;
  communication_rating: number;
  follow_up_compliant: string;
  patient_persona: string;
}

export interface InsightAgentOutput {
  theme: string;
  sentiment: string;
  reasoning: string;
  operational_issue: string;
  risk_or_bias: string;
  recommended_action: string;
}

export interface MonitoringAgentOutput {
  theme: string;
  secondary_themes: string[];
  sentiment: string;
  reasoning: string;
  operational_issue: string;
  equity_concern: string;
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High Risk' | string;
  recommendation: string;
  summary: {
    primary_issue: string;
    severity: string;
    recommended_action: string;
  };
}

export interface TriageAgentOutput {
  category: string;
  secondary_categories: string[];
  severity_level: 'LEVEL 1 – Low' | 'LEVEL 2 – Moderate' | 'LEVEL 3 – High' | 'LEVEL 4 – Critical' | string;
  severity_justification: string;
  risk_flags: string[];
  recommended_department: string;
  escalation_priority: 'Routine' | 'Priority' | 'Immediate' | string;
  human_review_status: 'AI Review Only' | 'Human Review Recommended' | 'Human Review Required' | string;
  summary: string;
}

export interface AnalyzedPatientRecord extends PatientRecord {
  insightAgent?: InsightAgentOutput;
  monitoringAgent?: MonitoringAgentOutput;
  triageAgent?: TriageAgentOutput;
}

export interface AIOpportunity {
  agent_name: string;
  purpose: string;
  expected_impact: string;
}

export interface AnalyticsOutput {
  total_analyzed: number;
  average_satisfaction: number;
  average_communication: number;
  follow_up_compliance: number;
  service_lines_count: number;
  theme_distribution: { theme: string; count: number }[];
  service_line_stats: { service_line: string; average_satisfaction: number; complaint_count: number; total: number }[];
  persona_stats: { persona: string; average_satisfaction: number; count: number; accessibility_concerns: number }[];
  bottlenecks: {
    patient_id: string;
    service_line: string;
    issue: string;
    severity: string;
    comment: string;
    persona: string;
  }[];
  ai_opportunities: AIOpportunity[];
  executive_recommendations: {
    priorities: string[];
    quick_wins: string[];
    long_term: string[];
  };
}

export interface AnalysisResponse {
  success: boolean;
  results: AnalyzedPatientRecord[];
  analytics: AnalyticsOutput;
  metadata: {
    isSample: boolean;
    timestamp: string;
    engine: string;
  };
}

export type ScreenType = 'office' | 'upload' | 'config' | 'processing' | 'results' | 'executive';

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  capabilities: string[];
}
