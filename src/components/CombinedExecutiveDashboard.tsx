import { useState } from "react";
import { AnalyzedPatientRecord, AnalyticsOutput } from "../types";
import { 
  ChevronLeft, 
  ShieldAlert, 
  UserCheck, 
  FileWarning, 
  HelpCircle, 
  CheckCircle, 
  ArrowRight, 
  Activity, 
  AlertTriangle,
  Brain,
  Layers,
  HeartHandshake
} from "lucide-react";

interface CombinedExecutiveDashboardProps {
  results: AnalyzedPatientRecord[];
  analytics: AnalyticsOutput | null;
  onNavigate: (screen: 'results' | 'office') => void;
  selectedAgents: string[];
  timestamp: string;
}

export default function CombinedExecutiveDashboard({
  results,
  analytics,
  onNavigate,
  selectedAgents,
  timestamp
}: CombinedExecutiveDashboardProps) {
  // Mock review states
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const toggleResolve = (id: string) => {
    setResolvedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 1. Consensus Findings calculations
  const consensusCases = results.filter(r => 
    r.triageAgent?.severity_level.includes("Critical") || 
    r.triageAgent?.severity_level.includes("High")
  );

  // 2. Conflicting Interpretations
  // Let's find cases where Triage Agent rated as LEVEL 2 Moderate, but Monitor Agent flagged as High Risk
  const conflictCases = results.filter(r => {
    const isTriageModerate = r.triageAgent?.severity_level.includes("Moderate") || r.triageAgent?.severity_level.includes("Low");
    const isMonitorHigh = r.monitoringAgent?.risk_level === "High Risk";
    return isTriageModerate && isMonitorHigh;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Top Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('results')}
          className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Results Workspace
        </button>

        <span className="text-xs text-outline font-medium">
          Compiled Analysis: {timestamp}
        </span>
      </div>

      {/* Header Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface">Chief Executive Combined Intelligence</h2>
        <p className="text-sm text-on-surface-variant/80">
          Cross-agent synthesis identifying system-wide operational patterns, compliance friction, and clinical safety priorities.
        </p>
      </div>

      {/* COMBINED INSIGHTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Consensus & Cross-Agent Patterns - Column Span 7 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Consensus &amp; Cross-Agent Related Patterns
            </h3>

            <div className="space-y-4">
              {/* Pattern 1 */}
              <div className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100 space-y-2">
                <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest block bg-blue-50 w-max px-2 py-0.5 rounded-md">
                  Safety Consensus Issue
                </span>
                <h4 className="text-xs font-bold text-on-surface">Critical Near-Miss Allergy Verification (Patient P-1010)</h4>
                <p className="text-xs text-on-surface-variant/95 leading-relaxed">
                  Both <strong>Complaint Triage Agent</strong> and <strong>Patient Feedback Insight Agent</strong> identified an immediate Patient Safety threat in the Emergency Department. 
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[9px] font-semibold text-slate-500">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded">Feedback Agent: Clinical Theme Flag</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded">Triage Agent: LEVEL 4 Critical Action Required</span>
                </div>
              </div>

              {/* Pattern 2 */}
              <div className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100 space-y-2">
                <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest block bg-blue-50 w-max px-2 py-0.5 rounded-md">
                  Systemic Operational Pattern
                </span>
                <h4 className="text-xs font-bold text-on-surface">LEP Discharge Barrier &amp; Treatment Non-Compliance Link</h4>
                <p className="text-xs text-on-surface-variant/95 leading-relaxed">
                  Cross-agent correlation shows Limited English Proficiency (LEP) cohorts (such as Patient P-1003) encounter massive communication breakdowns at reception, leading to zero comprehension of English discharge summaries. This directly triggers severe follow-up non-compliance risks and medication fear.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[9px] font-semibold text-slate-500">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded">Monitor Agent: Accessibility Concern Mapped</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded">Analytics Agent: High correlation with Outpatient non-compliance</span>
                </div>
              </div>

              {/* Pattern 3 */}
              <div className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100 space-y-2">
                <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest block bg-blue-50 w-max px-2 py-0.5 rounded-md">
                  ADA Compliance Gap
                </span>
                <h4 className="text-xs font-bold text-on-surface">Outpatient Physical Barriers &amp; Wait Time Correlation</h4>
                <p className="text-xs text-on-surface-variant/95 leading-relaxed">
                  Thematic analytics show outpatient clinics lack automated wheelchair entrances, causing disabled patients to wait outdoors in sub-optimal weather for 20+ minutes before receiving staff check-in assistance.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[9px] font-semibold text-slate-500">
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded">Feedback Agent: Accessibility Theme Flag</span>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded">Triage Agent: High Accessibility Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conflicting Interpretations Section */}
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-amber-600" />
              Conflicting Multi-Agent Interpretations
            </h3>

            <div className="space-y-4 text-xs">
              <p className="text-on-surface-variant/85 leading-relaxed">
                Evaluating qualitative comments sometimes triggers divergent risk-assessment scores based on the specific clinical boundaries of each agent's persona. Review these cases carefully:
              </p>

              {/* Case 1 Conflict */}
              <div className="p-4 rounded-2xl bg-amber-50/30 border border-amber-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-900">Portal Activation Lock Anxiety (Patient P-1004)</h4>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded text-[9px] uppercase">DIVERGENT RISK</span>
                </div>
                <p className="text-on-surface-variant/95 leading-relaxed">
                  A patient undergoing oncology biopsies could not log in to retrieve critical results, triggering severe stress.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-[11px] font-medium leading-relaxed">
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-primary">Complaint Triage Agent:</p>
                    <p className="text-slate-600 mt-0.5">Categorized as <strong className="text-slate-800">LEVEL 2 Moderate</strong>. Classified as minor portal system error.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-secondary">Patient Experience Monitor:</p>
                    <p className="text-slate-600 mt-0.5">Categorized as <strong className="text-red-600">High Risk</strong>. Factors in oncology biopsy stress and communication voids.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Human Review Queue - Column Span 5 */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              High-Risk Human Review Queue
            </h3>
            
            <p className="text-xs text-on-surface-variant/80 leading-relaxed">
              These clinical grievances require human managerial sign-off and follow-up intervention under HIPAA and CMS guidelines.
            </p>

            <div className="space-y-4">
              {consensusCases.map((row) => {
                const isResolved = resolvedIds.includes(row.patient_id);
                return (
                  <div key={row.patient_id} className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isResolved ? "bg-slate-50 border-slate-200 opacity-60" : "bg-red-50/20 border-red-100"
                  }`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">{row.patient_id} ({row.service_line})</span>
                      <span className={`px-2.5 py-0.5 rounded font-bold text-[9px] uppercase ${
                        isResolved ? "bg-slate-200 text-slate-600" : "bg-red-600 text-white animate-pulse"
                      }`}>
                        {isResolved ? "RESOLVED & SIGNED" : "PENDING ACTION"}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700">Friction: {row.insightAgent?.operational_issue}</p>
                    <p className="text-[11px] text-slate-500 italic line-clamp-2">"{row.comment}"</p>

                    <div className="pt-2 border-t border-slate-100/60 flex items-center justify-between">
                      <span className="text-[10px] text-outline">Dept: {row.triageAgent?.recommended_department}</span>
                      <button 
                        onClick={() => toggleResolve(row.patient_id)}
                        className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          isResolved ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-primary text-white hover:bg-blue-600"
                        }`}
                      >
                        {isResolved ? "Reopen Case" : "Approve & Resolve"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended follow-up actions list */}
          {analytics && (
            <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-outline uppercase tracking-wider">Recommended Executive Next Steps</h3>
              <ul className="space-y-3">
                {analytics.executive_recommendations.priorities.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-xs leading-relaxed text-on-surface-variant">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx+1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

      {/* SECURE DISCLOSURE NOTICE */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <HeartHandshake className="w-6 h-6 text-primary shrink-0" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Responsible AI Clinical Decision Support Policy</h4>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">
          <strong>Notice:</strong> This collaborative portal is configured as an advanced clinical decision-support intelligence workspace under the HIPAA Zero-Trust Sandbox framework. The virtual agents and neural workforce are engineered to augment operational workflows, categorization compliance, and patient experience auditing. 
        </p>
        <p className="text-xs text-white/50 leading-relaxed">
          Artificial intelligence outputs (including observations, risk ratings, severities, triage routings, and compliance check results) are recommendations designed for human clinical manager review. These virtual offices and their associated agents do not independently formulate clinical diagnoses, treatment regimens, employment/staffing determinations, or final organizational legal compliance certifications. All high-risk safety escalations must be finalized by licensed healthcare professionals.
        </p>
      </div>

    </div>
  );
}
