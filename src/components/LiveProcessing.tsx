import { useState, useEffect } from "react";
import { AGENT_CARDS } from "../sampleData";
import { 
  Loader2, 
  Terminal, 
  Brain, 
  Cpu, 
  CheckCircle, 
  Zap, 
  AlertTriangle,
  Play,
  RotateCcw
} from "lucide-react";

interface LiveProcessingProps {
  selectedAgents: string[];
  agentStates: Record<string, { status: string; progress: number }>;
  onCancel: () => void;
  onRerun: () => void;
  metadata: { engine: string } | null;
}

// Simulated diagnostic logs that look incredibly clinical and technical
const DIAGNOSTIC_LOGS_POOL: Record<string, string[]> = {
  agent_feedback: [
    "Establishing local Secure Tunnel with Clinical Data Lake...",
    "PHI scrubber initialized. Scrubbing patient names and medical records...",
    "Scanning patient comment narrative collections...",
    "Thematic categorization: Analyzing semantic wait-time blocks in Outpatient lines...",
    "Sentiment audit: Reconciling positive bedside reviews against billing complaints...",
    "Operational check: Assessing checkout congestion processes...",
    "Safety check: Flagging physical barrier ADA guidelines...",
    "Compiling quality-improvement recommendations in formal clinical tone...",
    "Successfully committed Patient Feedback Insights."
  ],
  agent_monitor: [
    "Attaching Patient Experience Monitor thread v2.4...",
    "Ingesting qualitative reviews and patient portal survey ratings...",
    "Mapping primary and secondary theme overlap matrices...",
    "Evaluating sentiment: Executing dual positive-negative mixed phrase parsing...",
    "Equity audit: Scanning vulnerabilities for Rural Patients and Older Adults...",
    "Accessibility scan: Digital literacy score calculated for patient portal log...",
    "Assessing institutional risks: Compliance and reputation risk scored...",
    "Formulating actionable recommendations for CMO Elena Thorne...",
    "Completed operational compliance report compilation."
  ],
  agent_triage: [
    "Spinning Complaint Triage Agent core thread...",
    "Analyzing critical incident reports and grievance submissions...",
    "Evaluating Severity Level: Flagging potential LEVEL 4 Patient Safety items...",
    "ALARM: Medical-malpractice threat or near-miss allergy detected! Lock verified.",
    "Drafting immediate routing coordinates to Quality & Risk Management depts...",
    "Compliance lock engaged: Setting 'Human Review Required' gate status...",
    "Escalation priority set to IMMEDIATELY routing to Nurse Leadership...",
    "Generating safety incident routing payload...",
    "Incident Triage analysis completed and signed."
  ],
  agent_analytics: [
    "Ingesting unified dataset mapping schema...",
    "Aggregating total comment volume and satisfaction rates...",
    "Generating service-line satisfaction variance matrices...",
    "NLP word distribution engine triggered. Scanning high-frequency keywords...",
    "Extracting clinical bottlenecks (Billing friction, wait times)...",
    "Persona-variance evaluation executed. Profiling Older Adult satisfaction gap...",
    "AI Agent Opportunity analysis: Modeling LEP Translate and wheelchair bots...",
    "Synthesizing CMO organizational quick-wins and 12-month roadmap...",
    "Rendering executive board charts and KPI dashboards."
  ]
};

export default function LiveProcessing({
  selectedAgents,
  agentStates,
  onCancel,
  onRerun,
  metadata
}: LiveProcessingProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Generate scrolling logs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Collect active agents' logs
    const activeLogsPool = selectedAgents.flatMap(id => DIAGNOSTIC_LOGS_POOL[id] || []);
    if (activeLogsPool.length === 0) return;

    interval = setInterval(() => {
      setLogs((prev) => {
        if (prev.length >= 35) prev.shift(); // keep it clean
        const nextLog = activeLogsPool[currentStepIndex % activeLogsPool.length];
        
        // Add timestamp to look like standard telemetry
        const timeStr = new Date().toLocaleTimeString();
        return [...prev, `[${timeStr}] [NeuralCore] ${nextLog}`];
      });
      setCurrentStepIndex((prev) => prev + 1);
    }, 450);

    return () => clearInterval(interval);
  }, [selectedAgents, currentStepIndex]);

  const activeAgentObjects = AGENT_CARDS.filter(a => selectedAgents.includes(a.id));

  // Check if all agents completed
  const allCompleted = selectedAgents.every(id => agentStates[id]?.status === 'completed');
  const anyProcessing = selectedAgents.some(id => agentStates[id]?.status === 'processing');

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface">Neural Processing Core Active</h2>
        <p className="text-sm text-on-surface-variant/80">
          The de-identified clinical feedback dataset is being analyzed by our parallel AI workforce.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Paralell workers progress - Column Span 2 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Active Workers Progress
            </h3>

            <div className="space-y-6">
              {activeAgentObjects.map((agent) => {
                const state = agentStates[agent.id] || { status: 'idle', progress: 0 };
                const isWorking = state.status === 'processing';
                const isDone = state.status === 'completed';

                return (
                  <div key={agent.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                    {/* Pulsating avatar when working */}
                    <div className="relative">
                      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary to-blue-300 opacity-0 blur ${
                        isWorking ? "animate-pulse opacity-40" : ""
                      }`}></div>
                      <img 
                        className={`w-14 h-14 rounded-2xl object-cover relative border border-slate-100 ${
                          isWorking ? "animate-bounce" : ""
                        }`} 
                        src={agent.avatar} 
                        alt={agent.name} 
                      />
                      {isWorking ? (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full shadow-sm animate-spin">
                          <Loader2 className="w-3 h-3" />
                        </div>
                      ) : isDone ? (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                      ) : null}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">{agent.name}</h4>
                          <p className="text-[10px] text-outline uppercase font-semibold">{agent.role}</p>
                        </div>
                        <span className={`text-xs font-extrabold ${isWorking ? "text-primary animate-pulse" : isDone ? "text-emerald-600" : "text-slate-400"}`}>
                          {isWorking ? `${state.progress}%` : isDone ? "Completed" : "Queued"}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDone ? "bg-emerald-500" : "bg-primary shadow-[0_0_8px_rgba(0,61,155,0.4)]"
                          }`}
                          style={{ width: `${state.progress}%` }}
                        ></div>
                      </div>

                      {/* Diagnostic step string */}
                      <p className="text-[10px] text-on-surface-variant font-mono">
                        {isWorking ? `Executing step ${Math.min(9, Math.ceil(state.progress / 11))} of 9: Thematic evaluation...` : isDone ? "Analysis completed and verified. Results generated." : "Awaiting scheduler execution..."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cancel/Retry buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-outline font-medium">
                Analysis Core: {metadata?.engine || "HealAI Local Clinical Simulator"}
              </span>
              <div className="flex gap-3">
                {anyProcessing ? (
                  <button 
                    onClick={onCancel}
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-100 transition-all"
                  >
                    Abort Core
                  </button>
                ) : (
                  <button 
                    onClick={onRerun}
                    className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-primary font-bold text-xs rounded-xl border border-blue-100 transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart Analysis
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Terminal log feed - Column Span 1 */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 shadow-2xl h-full flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Live Telemetry Feed
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-[10px] text-blue-200/90 space-y-2.5 max-h-[420px] scrollbar-thin">
              {logs.length === 0 ? (
                <p className="text-white/40 italic">Listening for core telemetry events...</p>
              ) : (
                logs.map((log, idx) => (
                  <p key={idx} className="leading-relaxed break-all">
                    {log}
                  </p>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-white/10 shrink-0 text-[10px] text-white/40">
              System is running inside HIPAA Sandbox environment. Zero-Trust Core engaged.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
