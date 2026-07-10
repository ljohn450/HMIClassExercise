import { useState } from "react";
import { AnalyzedPatientRecord, AnalyticsOutput } from "../types";
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Send, 
  ArrowRight, 
  Info, 
  CheckCircle,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";

interface ResultsDashboardProps {
  results: AnalyzedPatientRecord[];
  analytics: AnalyticsOutput | null;
  selectedAgents: string[];
  onNavigate: (screen: 'office' | 'executive') => void;
  engineName: string;
}

export default function ResultsDashboard({
  results,
  analytics,
  selectedAgents,
  onNavigate,
  engineName
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState(
    selectedAgents.includes("agent_feedback") ? "feedback" :
    selectedAgents.includes("agent_monitor") ? "monitor" :
    selectedAgents.includes("agent_triage") ? "triage" : "analytics"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [serviceLineFilter, setServiceLineFilter] = useState("All Departments");
  const [sentimentFilter, setSentimentFilter] = useState("All Sentiments");
  const [selectedRecord, setSelectedRecord] = useState<AnalyzedPatientRecord | null>(results[0] || null);

  // Filters
  const filteredResults = results.filter(row => {
    const matchesSearch = row.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.patient_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceLineFilter === "All Departments" || row.service_line === serviceLineFilter;
    
    let matchesSentiment = true;
    if (sentimentFilter !== "All Sentiments") {
      const rowSent = row.insightAgent?.sentiment || "Mixed";
      matchesSentiment = rowSent === sentimentFilter;
    }

    return matchesSearch && matchesService && matchesSentiment;
  });

  const uniqueServiceLines = Array.from(new Set(results.map(r => r.service_line)));

  const handleExport = (format: "csv" | "json") => {
    let outputString = "";
    if (format === "json") {
      outputString = JSON.stringify({ results, analytics }, null, 2);
    } else {
      // Header row
      outputString = "Patient ID,Service Line,Cohort Persona,Satisfaction Score,Feedback,Primary Theme,Sentiment,Risk Level,Action\n";
      results.forEach(r => {
        const rowData = [
          r.patient_id,
          `"${r.service_line}"`,
          `"${r.patient_persona}"`,
          r.sentiment_score,
          `"${r.comment.replace(/"/g, '""')}"`,
          `"${r.insightAgent?.theme || ''}"`,
          `"${r.insightAgent?.sentiment || ''}"`,
          `"${r.monitoringAgent?.risk_level || ''}"`,
          `"${(r.insightAgent?.recommended_action || '').replace(/"/g, '""')}"`
        ];
        outputString += rowData.join(",") + "\n";
      });
    }

    const blob = new Blob([outputString], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HealAI_Executive_Report_${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Upper breadcrumb & Action panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => onNavigate('office')}
          className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Virtual Offices
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExport("csv")}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors shadow-sm flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
          <button 
            onClick={() => handleExport("json")}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-primary" />
            Export JSON Report
          </button>
          <button 
            onClick={() => onNavigate('executive')}
            className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            Combined Executive Summary
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface">Clinical Analytics Workspace</h2>
          <p className="text-sm text-on-surface-variant/80">
            Securely displaying multi-agent findings, priority indicators, and operational metrics.
          </p>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/50 text-[11px] font-medium text-slate-600">
          Engine: <strong className="text-primary">{engineName}</strong>
        </div>
      </div>

      {/* Primary Workspace Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto shrink-0">
        {selectedAgents.includes("agent_feedback") && (
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-5 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeTab === "feedback" ? "border-primary text-primary bg-primary/[0.02]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Patient Feedback Insights Agent
          </button>
        )}
        {selectedAgents.includes("agent_monitor") && (
          <button
            onClick={() => setActiveTab("monitor")}
            className={`px-5 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeTab === "monitor" ? "border-primary text-primary bg-primary/[0.02]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Patient Experience Monitor
          </button>
        )}
        {selectedAgents.includes("agent_triage") && (
          <button
            onClick={() => setActiveTab("triage")}
            className={`px-5 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeTab === "triage" ? "border-primary text-primary bg-primary/[0.02]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Complaint Triage Agent
          </button>
        )}
        {selectedAgents.includes("agent_analytics") && (
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-5 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
              activeTab === "analytics" ? "border-primary text-primary bg-primary/[0.02]" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Healthcare Analytics Agent
          </button>
        )}
      </div>

      {/* FILTER PANEL - Not visible for pure summary analytics tab */}
      {activeTab !== "analytics" && (
        <div className="bg-white p-5 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input 
              type="text"
              placeholder="Search de-identified patient comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-outline" />
              <select
                value={serviceLineFilter}
                onChange={(e) => setServiceLineFilter(e.target.value)}
                className="bg-transparent text-xs outline-none cursor-pointer text-slate-700 font-medium"
              >
                <option>All Departments</option>
                {uniqueServiceLines.map(sl => (
                  <option key={sl}>{sl}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Activity className="w-3.5 h-3.5 text-outline" />
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="bg-transparent text-xs outline-none cursor-pointer text-slate-700 font-medium"
              >
                <option>All Sentiments</option>
                <option>Positive</option>
                <option>Negative</option>
                <option>Neutral</option>
                <option>Mixed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT AREAS */}

      {/* 1. Patient Feedback Insights (Narrative Table) */}
      {activeTab === "feedback" && (
        <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-base">Feedback Theme &amp; Quality Analysis Audit</h3>
            <p className="text-xs text-outline font-medium">Systematic thematic extraction matching de-identified patient comments.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-outline border-b border-slate-100 font-bold text-xs uppercase">
                  <th className="p-4">ID</th>
                  <th className="p-4">Primary Theme</th>
                  <th className="p-4">Sentiment</th>
                  <th className="p-4">Operational Process Issue</th>
                  <th className="p-4">Bias / Safety Flag</th>
                  <th className="p-4">Managerial Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((row, idx) => {
                  const out = row.insightAgent || {
                    theme: "Clinical Care",
                    sentiment: "Negative",
                    reasoning: "Not computed",
                    operational_issue: "Care delay",
                    risk_or_bias: "None",
                    recommended_action: "Review procedures"
                  };
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors text-xs text-on-surface-variant">
                      <td className="p-4 font-bold text-on-surface whitespace-nowrap">
                        <div className="space-y-1">
                          <p>{row.patient_id}</p>
                          <span className="text-[10px] text-slate-400 font-mono block">{row.service_line}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-50 text-primary font-bold rounded-lg text-[10px]">
                          {out.theme}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          out.sentiment === "Positive" ? "bg-emerald-50 text-emerald-700" :
                          out.sentiment === "Negative" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {out.sentiment}
                        </span>
                      </td>
                      <td className="p-4 font-medium leading-relaxed max-w-xs">{out.operational_issue}</td>
                      <td className="p-4 max-w-xs">
                        {out.risk_or_bias !== "None" ? (
                          <span className="text-amber-700 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            {out.risk_or_bias}
                          </span>
                        ) : (
                          <span className="text-slate-400">None Identified</span>
                        )}
                      </td>
                      <td className="p-4 font-medium text-slate-800 leading-relaxed max-w-sm bg-blue-50/20">{out.recommended_action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Patient Experience Monitor (Step cards) */}
      {activeTab === "monitor" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: List list */}
          <div className="bg-white rounded-3xl border border-outline-variant/30 p-6 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
            <h3 className="font-bold text-sm border-b border-slate-100 pb-3">Analyzed Feedback Records</h3>
            <div className="space-y-3">
              {filteredResults.map((row) => {
                const isCurrent = selectedRecord?.patient_id === row.patient_id;
                const riskLevel = row.monitoringAgent?.risk_level || "Low Risk";
                return (
                  <div 
                    key={row.patient_id}
                    onClick={() => setSelectedRecord(row)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                      isCurrent ? "border-primary bg-blue-50/35 ring-1 ring-primary" : "border-slate-100 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{row.patient_id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        riskLevel === "High Risk" ? "bg-red-100 text-red-700" :
                        riskLevel === "Moderate Risk" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {riskLevel}
                      </span>
                    </div>
                    <p className="font-medium text-slate-500 truncate">{row.service_line} | {row.patient_persona}</p>
                    <p className="text-slate-700 line-clamp-1 italic">"{row.comment}"</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: STEP 1 - 7 Audit output details */}
          <div className="lg:col-span-2">
            {selectedRecord ? (
              <div className="bg-white rounded-3xl border border-outline-variant/30 p-8 shadow-sm space-y-8">
                {/* Header info */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                  <div>
                    <span className="px-3 py-1 bg-blue-50 text-primary font-bold rounded-full text-[10px] uppercase tracking-wider">
                      Patient Experience Monitor Audit File
                    </span>
                    <h3 className="text-xl font-bold mt-2">{selectedRecord.patient_id} ({selectedRecord.service_line})</h3>
                    <p className="text-xs text-outline mt-1 font-medium">Metadata: Outpatient Visit | {selectedRecord.patient_persona}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-outline uppercase font-bold">Severity Risk Score</p>
                    <p className={`text-lg font-bold ${
                      selectedRecord.monitoringAgent?.risk_level === "High Risk" ? "text-red-600" :
                      selectedRecord.monitoringAgent?.risk_level === "Moderate Risk" ? "text-amber-600" : "text-emerald-600"
                    }`}>
                      {selectedRecord.monitoringAgent?.risk_level || "Low Risk"}
                    </p>
                  </div>
                </div>

                {/* Original Feedback Narrative */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-700 text-xs">
                  "{selectedRecord.comment}"
                </div>

                {/* Step blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">STEP 1: Theme Classification</h4>
                    <p className="text-xs font-bold text-on-surface">{selectedRecord.monitoringAgent?.theme}</p>
                    <p className="text-[10px] text-slate-400">Secondary mapped: {selectedRecord.monitoringAgent?.secondary_themes.join(", ") || "None"}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">STEP 2: Sentiment Analysis</h4>
                    <p className="text-xs font-bold text-on-surface">{selectedRecord.monitoringAgent?.sentiment}</p>
                    <p className="text-[10px] text-slate-400">{selectedRecord.monitoringAgent?.reasoning}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">STEP 3: Operational Issue</h4>
                    <p className="text-xs font-medium text-slate-700">{selectedRecord.monitoringAgent?.operational_issue}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">STEP 4: Equity &amp; Accessibility</h4>
                    <p className="text-xs font-medium text-slate-700">{selectedRecord.monitoringAgent?.equity_concern}</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">STEP 5: Risk Assessment</h4>
                    <span className="inline-block px-2.5 py-0.5 bg-red-50 text-red-700 font-bold text-[10px] rounded-lg">
                      {selectedRecord.monitoringAgent?.risk_level}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">STEP 6: Manager Recommendation</h4>
                    <p className="text-xs font-medium text-slate-800 leading-relaxed">{selectedRecord.monitoringAgent?.recommendation}</p>
                  </div>
                </div>

                {/* STEP 7: Executive Summary */}
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider mb-2">STEP 7: Executive Summary</h4>
                  <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold">Primary issue: {selectedRecord.monitoringAgent?.summary.primary_issue}</p>
                      <p className="text-slate-600 mt-1">Severity check: {selectedRecord.monitoringAgent?.summary.severity}</p>
                      <p className="text-slate-800 font-medium mt-1">Recommended resolution action: {selectedRecord.monitoringAgent?.summary.recommended_action}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-xs text-outline">
                Select a feedback comment to view the Step-by-Step compliance monitor records.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Complaint Triage (Severity, Escalation, Human review gates) */}
      {activeTab === "triage" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: List list */}
          <div className="bg-white rounded-3xl border border-outline-variant/30 p-6 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
            <h3 className="font-bold text-sm border-b border-slate-100 pb-3">Active Complaints Core</h3>
            <div className="space-y-3">
              {filteredResults.map((row) => {
                const isCurrent = selectedRecord?.patient_id === row.patient_id;
                const severity = row.triageAgent?.severity_level || "LEVEL 1";
                const escalatePriority = row.triageAgent?.escalation_priority || "Routine";

                return (
                  <div 
                    key={row.patient_id}
                    onClick={() => setSelectedRecord(row)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                      isCurrent ? "border-primary bg-blue-50/35 ring-1 ring-primary" : "border-slate-100 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{row.patient_id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        severity.includes("Critical") ? "bg-red-600 text-white animate-pulse" :
                        severity.includes("High") ? "bg-red-100 text-red-700" :
                        severity.includes("Moderate") ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {severity.split(" – ")[0]}
                      </span>
                    </div>
                    <p className="font-medium text-slate-500 truncate">{row.service_line} | {escalatePriority} priority</p>
                    <p className="text-slate-700 line-clamp-1 italic">"{row.comment}"</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Triage audit outputs */}
          <div className="lg:col-span-2">
            {selectedRecord ? (
              <div className="bg-white rounded-3xl border border-outline-variant/30 p-8 shadow-sm space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                  <div>
                    <span className="px-3 py-1 bg-red-50 text-red-600 font-bold rounded-full text-[10px] uppercase tracking-wider">
                      Complaint Triage Core Analysis
                    </span>
                    <h3 className="text-xl font-bold mt-2">{selectedRecord.patient_id} ({selectedRecord.service_line})</h3>
                    <p className="text-xs text-outline mt-1 font-medium">Triage Priority: <strong className="text-red-600 font-bold">{selectedRecord.triageAgent?.escalation_priority}</strong></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-outline uppercase font-bold">Severity level</p>
                    <p className={`text-base font-bold uppercase tracking-tight ${
                      selectedRecord.triageAgent?.severity_level.includes("Critical") ? "text-red-600" : "text-amber-600"
                    }`}>
                      {selectedRecord.triageAgent?.severity_level}
                    </p>
                  </div>
                </div>

                {/* Original Feedback */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-700 text-xs">
                  "{selectedRecord.comment}"
                </div>

                {/* Detail list */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">Complaint Category</h4>
                      <p className="text-xs font-bold text-on-surface mt-1">{selectedRecord.triageAgent?.category}</p>
                      <p className="text-[10px] text-slate-400">Secondary categories: {selectedRecord.triageAgent?.secondary_categories.join(", ") || "None"}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">Recommended Escalation</h4>
                      <p className="text-xs font-bold text-primary mt-1">Route to: {selectedRecord.triageAgent?.recommended_department}</p>
                      <p className="text-[10px] text-slate-400">Escalation priority level: {selectedRecord.triageAgent?.escalation_priority}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">Severity Rating Justification</h4>
                    <p className="text-xs text-on-surface-variant/90 leading-relaxed">{selectedRecord.triageAgent?.severity_justification}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider">Identified Risk Alarms</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedRecord.triageAgent?.risk_flags.map((risk, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-700 font-medium text-[10px] rounded-lg border border-red-100/60 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0 text-red-500" />
                          {risk}
                        </span>
                      ))}
                      {selectedRecord.triageAgent?.risk_flags.length === 0 && (
                        <span className="text-xs text-slate-400 italic">No liability risks identified.</span>
                      )}
                    </div>
                  </div>

                  {/* HUMAN REVIEW LOCK COMPLIANCE */}
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-[10px] text-outline uppercase font-extrabold tracking-wider mb-2">Gate Audit Compliance Lock</h4>
                    <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                      selectedRecord.triageAgent?.human_review_status.includes("Required")
                        ? "bg-red-50/50 border-red-100 text-red-900"
                        : "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                    }`}>
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        selectedRecord.triageAgent?.human_review_status.includes("Required") ? "bg-red-500 text-white" : "bg-emerald-500"
                      }`}>
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-bold">{selectedRecord.triageAgent?.human_review_status}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {selectedRecord.triageAgent?.human_review_status.includes("Required")
                            ? "This complaint is marked with safety, compliance, or discrimination risks. A certified Risk Manager must review and execute a follow-up action before resolved status can be marked."
                            : "This minor operational complaint is categorized for routine Quality Improvement team auditing and does not require rapid risk intervention."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-xs text-outline">
                Select a complaint to view the automated triage logs.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Healthcare Analytics Agent Tab */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Overview KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
              <p className="text-[10px] text-outline uppercase tracking-wider font-extrabold">Comments Scanned</p>
              <p className="text-3xl font-extrabold text-on-surface mt-2">{analytics.total_analyzed}</p>
              <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                100% Data Quality Check
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
              <p className="text-[10px] text-outline uppercase tracking-wider font-extrabold">Avg Patient Satisfaction</p>
              <div className="flex items-baseline gap-1 mt-2">
                <p className="text-3xl font-extrabold text-secondary">{analytics.average_satisfaction}</p>
                <span className="text-xs font-bold text-outline">/10</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-2">HCAHPS Quality Aligned</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
              <p className="text-[10px] text-outline uppercase tracking-wider font-extrabold">Avg Communication Rating</p>
              <div className="flex items-baseline gap-1 mt-2">
                <p className="text-3xl font-extrabold text-primary">{analytics.average_communication}</p>
                <span className="text-xs font-bold text-outline">/10</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-2">Bedside manner audit</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
              <p className="text-[10px] text-outline uppercase tracking-wider font-extrabold">Follow-Up Compliance</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">{analytics.follow_up_compliance}%</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-2">Target benchmark: 85%</p>
            </div>
          </div>

          {/* NLP Theme distribution & Service Line Analysis (Responsive SVG Charts) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme distribution Bar Chart */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
              <h4 className="text-xs font-bold text-outline uppercase tracking-wider mb-6">Patient Complaints Theme Distribution</h4>
              
              <div className="space-y-4">
                {analytics.theme_distribution.map((t, idx) => {
                  const maxCount = Math.max(...analytics.theme_distribution.map(o => o.count));
                  const percent = Math.round((t.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center font-semibold">
                        <span>{t.theme}</span>
                        <span className="text-slate-400">{t.count} Comments</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-primary rounded-full transition-all duration-300" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Satisfaction by Service Line chart */}
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
              <h4 className="text-xs font-bold text-outline uppercase tracking-wider mb-6">Patient Satisfaction by Service Line</h4>
              
              <div className="space-y-4">
                {analytics.service_line_stats.map((s, idx) => {
                  const percent = (s.average_satisfaction / 10) * 100;
                  return (
                    <div key={idx} className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center font-semibold">
                        <span>{s.service_line}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          s.average_satisfaction >= 7 ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                        }`}>
                          Score: {s.average_satisfaction}/10
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-secondary rounded-full transition-all duration-300" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400">
                        <span>Total Scanned: {s.total}</span>
                        <span className="text-red-500 font-bold">{s.complaint_count} Critical Complaints</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 3: NLP Keywords Word Cloud */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
            <h4 className="text-xs font-bold text-outline uppercase tracking-wider mb-6">Most Frequently Occurring Keywords (Word Cloud)</h4>
            <div className="flex flex-wrap gap-4 items-center justify-center py-6">
              <span className="text-3xl font-extrabold text-primary animate-pulse" title="High Frequency: 18 occurrences">Wait Time</span>
              <span className="text-2xl font-bold text-secondary" title="Frequency: 14">Portal Log</span>
              <span className="text-xl font-semibold text-slate-700" title="Frequency: 11">Spanish Translation</span>
              <span className="text-2xl font-extrabold text-red-500 animate-pulse" title="Frequency: 15">Billing Dispute</span>
              <span className="text-lg font-medium text-slate-500" title="Frequency: 9">ADA Access</span>
              <span className="text-2xl font-bold text-slate-800" title="Frequency: 12">Prescription Side-effects</span>
              <span className="text-sm font-semibold text-slate-400" title="Frequency: 6">No-show charge</span>
              <span className="text-xs font-medium text-slate-400">Checkout bottleneck</span>
              <span className="text-sm font-medium text-slate-400">Penicillin allergy</span>
            </div>
          </div>

          {/* Section: Hidden problems bottlenecks & Personas accessibility */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-outline uppercase tracking-wider">Hidden Organizational Bottlenecks</h4>
              <div className="space-y-3">
                {analytics.bottlenecks.map((bot, idx) => (
                  <div key={idx} className="p-3.5 bg-red-50/40 rounded-2xl border border-red-100/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-900">{bot.patient_id} ({bot.service_line})</span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md uppercase">
                        {bot.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-normal font-semibold">Friction: {bot.issue}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic">"{bot.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-outline uppercase tracking-wider">Healthcare Equity &amp; Cohort Satisfaction</h4>
              <div className="space-y-4">
                {analytics.persona_stats.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-50 pb-3 last:border-0">
                    <div>
                      <p className="font-bold text-slate-800">{p.persona}</p>
                      <p className="text-[10px] text-slate-400">{p.count} Patients | {p.accessibility_concerns} Accessibility Flag{p.accessibility_concerns !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-secondary">Avg satisfaction: {p.average_satisfaction}/10</p>
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden mt-1 ml-auto">
                        <div className="bg-secondary h-full" style={{ width: `${(p.average_satisfaction/10)*100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: AI Agent Opportunities */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-outline uppercase tracking-wider">AI Agent Opportunities Identified</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.ai_opportunities.map((opp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold text-xs">
                    0{idx+1}
                  </div>
                  <h5 className="text-xs font-bold">{opp.agent_name}</h5>
                  <p className="text-[11px] text-slate-600 leading-normal">{opp.purpose}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase">Impact: {opp.expected_impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Executive Recommendations */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <h4 className="text-xs font-bold text-outline uppercase tracking-wider border-b border-slate-100 pb-3">Strategic Action Recommendations</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h5 className="text-xs font-extrabold text-red-600 uppercase tracking-wide">Top 5 Priorities</h5>
                <ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
                  {analytics.executive_recommendations.priorities.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-bold text-red-600">{idx+1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-extrabold text-secondary uppercase tracking-wide">Quick Wins (&lt; 3 Months)</h5>
                <ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
                  {analytics.executive_recommendations.quick_wins.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-bold text-secondary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-extrabold text-primary uppercase tracking-wide">Long-Term AI Opportunities</h5>
                <ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
                  {analytics.executive_recommendations.long_term.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-bold text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
