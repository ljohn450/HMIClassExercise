import { useState } from "react";
import { SAMPLE_PATIENTS, AGENT_CARDS } from "../sampleData";
import { ScreenType, AgentConfig, PatientRecord } from "../types";
import { 
  ChevronLeft, 
  ArrowRight, 
  Settings2, 
  ShieldCheck, 
  Target, 
  AlertCircle,
  HelpCircle,
  Clock,
  Play
} from "lucide-react";

interface AgentConfigScreenProps {
  onNavigate: (screen: ScreenType) => void;
  selectedAgents: string[];
  onToggleAgent: (agentId: string) => void;
  onStartAnalysis: (options: Record<string, any>) => void;
  dataset: PatientRecord[];
}

export default function AgentConfigScreen({
  onNavigate,
  selectedAgents,
  onToggleAgent,
  onStartAnalysis,
  dataset
}: AgentConfigScreenProps) {
  // Option configurations for each agent
  const [depths, setDepths] = useState<Record<string, string>>({
    agent_feedback: "Standard Auditing",
    agent_monitor: "Deep Benchmark Audit",
    agent_triage: "Full Escalation Model",
    agent_analytics: "Executive Board Summary"
  });

  const [complianceChecks, setComplianceChecks] = useState<Record<string, boolean>>({
    hipaa: true,
    ada: true,
    cms: true,
    jointCommission: false
  });

  const [anonymizationLevel, setAnonymizationLevel] = useState("Strict SHA-256");

  const handleStart = () => {
    // Collect all options and send to start
    onStartAnalysis({
      depths,
      complianceChecks,
      anonymizationLevel
    });
  };

  const selectedAgentObjects = AGENT_CARDS.filter(a => selectedAgents.includes(a.id));

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('office')}
          className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Virtual Offices
        </button>
        <button 
          onClick={handleStart}
          disabled={selectedAgents.length === 0}
          className={`px-8 py-3 bg-primary hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2`}
        >
          <Play className="w-4 h-4 fill-white text-white" />
          Start Simultaneous Analysis
        </button>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface">Intelligence Workforce Configuration</h2>
        <p className="text-sm text-on-surface-variant/85">
          Tune specific clinical benchmarks, scope of work, and data-integrity filters for selected neural agents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Selected Agent Tune Cards - Column Span 2 */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Selected Agent Operational Directives
          </h3>

          {selectedAgentObjects.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 text-center text-xs text-outline space-y-4">
              <p>No agents currently active in your selections. Activate at least one agent to configure clinical workflows.</p>
              <button 
                onClick={() => onNavigate('office')}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-primary font-bold rounded-xl text-[11px] border border-blue-200 transition-all"
              >
                Go Select Agents
              </button>
            </div>
          ) : (
            selectedAgentObjects.map((agent) => (
              <div key={agent.id} className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <img className="w-12 h-12 rounded-xl object-cover" src={agent.avatar} alt={agent.name} />
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{agent.name}</h4>
                      <p className="text-[10px] text-primary uppercase tracking-wider font-semibold">{agent.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onToggleAgent(agent.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-bold hover:bg-red-50/50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Deselect Agent
                  </button>
                </div>

                {/* Configuration Options per Agent */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-wider">Analysis Scope Depth</label>
                    <select 
                      value={depths[agent.id] || "Standard"}
                      onChange={(e) => setDepths({...depths, [agent.id]: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option>Standard Auditing</option>
                      <option>Deep Benchmark Audit</option>
                      <option>Critical Safety Sweep</option>
                      <option>Executive Board Summary</option>
                    </select>
                    <p className="text-[10px] text-outline leading-normal">
                      Specifies model response lengths and reasoning chains configured in agent prompts.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-outline uppercase tracking-wider">Clinical Standards Focus</label>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`std-cms-${agent.id}`} 
                          checked={true}
                          disabled
                          className="rounded text-primary focus:ring-primary/20 w-4 h-4"
                        />
                        <label htmlFor={`std-cms-${agent.id}`} className="text-xs text-on-surface-variant/90">
                          CMS Quality Benchmarks (HCAHPS aligned)
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`std-risk-${agent.id}`} 
                          checked={agent.id === "agent_triage"} 
                          disabled
                          className="rounded text-primary focus:ring-primary/20 w-4 h-4"
                        />
                        <label htmlFor={`std-risk-${agent.id}`} className="text-xs text-on-surface-variant/90">
                          Institutional Medical Liability Gating
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expected agent output card */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Configured Agent Target Output</p>
                    <p className="text-[11px] text-on-surface-variant/80 mt-1 leading-normal">
                      Outputs will strictly output de-identified analysis formatted into clean UI indicators, metrics, risk ratings, and recommended manager actions.
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Global Security Guards & Compliance - Column Span 1 */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Global Workspace Guards
          </h3>

          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">HIPAA Safeguards &amp; Privacy Scrubbing</label>
              
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="chk-hipaa" 
                    checked={complianceChecks.hipaa}
                    onChange={(e) => setComplianceChecks({...complianceChecks, hipaa: e.target.checked})}
                    className="rounded text-primary focus:ring-primary/20 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <label htmlFor="chk-hipaa" className="text-xs font-bold text-on-surface-variant">Strict PHI Anonymizer Gating</label>
                    <p className="text-[10px] text-outline mt-0.5">Scans feedback for names, phones, medical records, and location strings.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="chk-ada" 
                    checked={complianceChecks.ada}
                    onChange={(e) => setComplianceChecks({...complianceChecks, ada: e.target.checked})}
                    className="rounded text-primary focus:ring-primary/20 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <label htmlFor="chk-ada" className="text-xs font-bold text-on-surface-variant">ADA Accessibility Checker</label>
                    <p className="text-[10px] text-outline mt-0.5">Alerts compliance lead if physical wheelchair or entrance barriers are reported.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="chk-cms" 
                    checked={complianceChecks.cms}
                    onChange={(e) => setComplianceChecks({...complianceChecks, cms: e.target.checked})}
                    className="rounded text-primary focus:ring-primary/20 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <label htmlFor="chk-cms" className="text-xs font-bold text-on-surface-variant">CMS Equity Review Checks</label>
                    <p className="text-[10px] text-outline mt-0.5">Highlights translation gaps for Limited English Proficiency (LEP) cohorts.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">Metadata Encryption Mode</label>
              <select 
                value={anonymizationLevel}
                onChange={(e) => setAnonymizationLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option>Strict SHA-256 Hash</option>
                <option>Full Synthetic Scrambler</option>
                <option>Local Browser-only Parsing</option>
              </select>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/70 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800">Review Clinical Gating</p>
                <p className="text-[10px] text-amber-700 leading-relaxed mt-0.5">
                  AI-generated outputs are supportive recommendations only. This platform does not perform clinical diagnosis, treatment decisions, or legal/compliance determinations.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary animate-pulse" />
              Batch Diagnostics
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-white/40">Analysis Mode</p>
                <p className="font-bold">Multi-Agent Parallel</p>
              </div>
              <div>
                <p className="text-white/40">Total Records</p>
                <p className="font-bold">{dataset.length > 0 ? `${dataset.length} Comments` : "10 Mock Records"}</p>
              </div>
              <div>
                <p className="text-white/40">Target Model</p>
                <p className="font-bold">Gemini 3.5 Flash</p>
              </div>
              <div>
                <p className="text-white/40">Est. Latency</p>
                <p className="font-bold">&lt; 3 Seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
