import { useState } from "react";
import { ScreenType, PatientRecord, AnalyzedPatientRecord, AnalyticsOutput } from "./types";
import { SAMPLE_PATIENTS, AGENT_CARDS } from "./sampleData";
import OfficeLanding from "./components/OfficeLanding";
import DataUpload from "./components/DataUpload";
import AgentConfigScreen from "./components/AgentConfigScreen";
import LiveProcessing from "./components/LiveProcessing";
import ResultsDashboard from "./components/ResultsDashboard";
import CombinedExecutiveDashboard from "./components/CombinedExecutiveDashboard";

import { 
  Building2, 
  UploadCloud, 
  Settings, 
  Search, 
  Bell, 
  FileText, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Activity, 
  Cpu, 
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Menu,
  X
} from "lucide-react";

export default function App() {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ScreenType>('office');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Dataset State
  const [dataset, setDataset] = useState<PatientRecord[]>([]);

  // Selection & Progress States
  const [selectedAgents, setSelectedAgents] = useState<string[]>([
    "agent_feedback", "agent_monitor", "agent_triage", "agent_analytics"
  ]);

  const [agentStates, setAgentStates] = useState<Record<string, { status: string; progress: number }>>({
    agent_feedback: { status: 'idle', progress: 0 },
    agent_monitor: { status: 'idle', progress: 0 },
    agent_triage: { status: 'idle', progress: 0 },
    agent_analytics: { status: 'idle', progress: 0 }
  });

  // Results State
  const [results, setResults] = useState<AnalyzedPatientRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOutput | null>(null);
  const [engineUsed, setEngineUsed] = useState("HealAI Local Clinical Simulator");
  const [timestamp, setTimestamp] = useState("");

  // Actions
  const handleToggleAgent = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  const handleSelectAllAgents = () => {
    if (selectedAgents.length === AGENT_CARDS.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(AGENT_CARDS.map(a => a.id));
    }
  };

  const handleLoadSampleDataset = () => {
    setDataset(SAMPLE_PATIENTS);
    setActiveScreen('upload'); // Go inspect validated data
  };

  const handleClearDataset = () => {
    setDataset([]);
  };

  const handleUploadDataset = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      // Simple CSV parsing for clinical sandbox rows
      const lines = text.split("\n").filter(l => l.trim() !== "");
      if (lines.length <= 1) return;

      // Parse header row to try and identify columns
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const commentIdx = headers.findIndex(h => h.includes("comment") || h.includes("feedback") || h.includes("text"));
      const scoreIdx = headers.findIndex(h => h.includes("score") || h.includes("satisfaction") || h.includes("sentiment"));
      const serviceIdx = headers.findIndex(h => h.includes("service") || h.includes("dept") || h.includes("department"));
      const personaIdx = headers.findIndex(h => h.includes("persona") || h.includes("cohort") || h.includes("patient"));

      const parsedRecords: PatientRecord[] = lines.slice(1).map((line, index) => {
        // Handle comma splitting with simple quote isolation
        const parts: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            parts.push(current);
            current = "";
          } else {
            current += char;
          }
        }
        parts.push(current);

        return {
          patient_id: `P-${1000 + index + 1}`,
          comment: parts[commentIdx >= 0 ? commentIdx : 0] || "No feedback narrative provided.",
          service_line: parts[serviceIdx >= 0 ? serviceIdx : 1] || "General Outpatient",
          patient_persona: parts[personaIdx >= 0 ? personaIdx : 2] || "Standard Cohort",
          sentiment_score: parseInt(parts[scoreIdx >= 0 ? scoreIdx : 3] || "5") || 5,
          visit_type: "Consultation",
          communication_rating: 8,
          follow_up_compliant: "Yes"
        };
      });

      setDataset(parsedRecords);
      setActiveScreen('upload'); // Go inspect mapped columns
    };
    reader.readAsText(file);
  };

  // Launch parallel AI worker analysis via API call
  const handleStartAnalysis = async (options: Record<string, any>) => {
    setActiveScreen('processing');

    // Initialize agent statuses to processing
    const initialStates: Record<string, { status: string; progress: number }> = {};
    selectedAgents.forEach(id => {
      initialStates[id] = { status: 'processing', progress: 5 };
    });
    setAgentStates(initialStates);

    // Simulate ticking progress bars in parallel while backend resolves
    const progressIntervals = selectedAgents.map(id => {
      let currentProgress = 5;
      return setInterval(() => {
        setAgentStates(prev => {
          const current = prev[id] || { status: 'idle', progress: 0 };
          if (current.status !== 'processing') return prev;
          
          // Speed up or slow down slightly to look incredibly realistic
          const increment = Math.floor(Math.random() * 15) + 5;
          const nextProgress = Math.min(95, current.progress + increment);
          return {
            ...prev,
            [id]: { ...current, progress: nextProgress }
          };
        });
      }, 350);
    });

    try {
      // If dataset is empty, we send our pre-loaded premium records
      const payloadData = dataset.length > 0 ? dataset : SAMPLE_PATIENTS;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset: payloadData,
          selectedAgents,
          options
        })
      });

      if (!response.ok) {
        throw new Error("Clinical analysis server returned non-ok status");
      }

      const body = await response.json();
      
      // Stop progress ticks and set completed status
      progressIntervals.forEach(interval => clearInterval(interval));

      // Quick visual finish tick
      setAgentStates(prev => {
        const finished: Record<string, { status: string; progress: number }> = { ...prev };
        selectedAgents.forEach(id => {
          finished[id] = { status: 'completed', progress: 100 };
        });
        return finished;
      });

      setResults(body.results || []);
      setAnalytics(body.analytics || null);
      setEngineUsed(body.metadata?.engine || "HealAI Local Clinical Simulator");
      setTimestamp(new Date().toLocaleTimeString() + " UTC");

      // Give a tiny moment for user to see 100% completion
      setTimeout(() => {
        setActiveScreen('results');
      }, 600);

    } catch (err) {
      console.error(err);
      progressIntervals.forEach(interval => clearInterval(interval));
      // Mark selected agents as failed
      setAgentStates(prev => {
        const failed: Record<string, { status: string; progress: number }> = { ...prev };
        selectedAgents.forEach(id => {
          failed[id] = { status: 'error', progress: 0 };
        });
        return failed;
      });
      // Transition back to config
      setTimeout(() => {
        alert("The backend service encountered a compilation or model error. Review settings and retry.");
        setActiveScreen('config');
      }, 1000);
    }
  };

  const handleCancelAnalysis = () => {
    // Reset agent states to idle
    setAgentStates({
      agent_feedback: { status: 'idle', progress: 0 },
      agent_monitor: { status: 'idle', progress: 0 },
      agent_triage: { status: 'idle', progress: 0 },
      agent_analytics: { status: 'idle', progress: 0 }
    });
    setActiveScreen('office');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* 1. SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transform lg:transform-none transition-transform duration-300 flex flex-col justify-between border-r border-white/5 shadow-2xl ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        <div className="flex flex-col flex-1">
          {/* Logo Brand Box */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined font-bold text-2xl text-white">neurology</span>
              </div>
              <div>
                <h1 className="font-extrabold tracking-tight text-white text-[15px] leading-tight">HealAI</h1>
                <p className="text-[10px] text-white/50 tracking-wider uppercase font-semibold">Enterprise Portal</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-6 space-y-2 flex-1">
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-4">Core Workspace</p>
            
            <button
              onClick={() => { setActiveScreen('office'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all relative group ${
                activeScreen === 'office' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              Virtual Offices
              {activeScreen === 'office' && <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
            </button>

            <button
              onClick={() => { setActiveScreen('upload'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all relative group ${
                activeScreen === 'upload' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              Data Library &amp; Upload
              {dataset.length > 0 && (
                <span className="absolute right-4 px-2 py-0.5 text-[9px] bg-emerald-500 text-white font-bold rounded-full">
                  {dataset.length}
                </span>
              )}
            </button>

            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest pt-6 mb-4">Intelligence Workforce</p>

            <button
              onClick={() => { 
                if (results.length > 0) { setActiveScreen('results'); setSidebarOpen(false); }
                else { alert("Run an analysis first to view active dashboard results!"); }
              }}
              disabled={results.length === 0}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all relative group ${
                results.length === 0 ? "opacity-40 cursor-not-allowed" : ""
              } ${
                activeScreen === 'results' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              Tabular Results
              {results.length > 0 && <span className="absolute right-4 w-2 h-2 rounded-full bg-emerald-500"></span>}
            </button>

            <button
              onClick={() => { 
                if (results.length > 0) { setActiveScreen('executive'); setSidebarOpen(false); }
                else { alert("Run an analysis first to view collective summaries!"); }
              }}
              disabled={results.length === 0}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all relative group ${
                results.length === 0 ? "opacity-40 cursor-not-allowed" : ""
              } ${
                activeScreen === 'executive' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              Combined Executive
              {results.length > 0 && <span className="absolute right-4 w-2 h-2 rounded-full bg-emerald-500"></span>}
            </button>
          </nav>
        </div>

        {/* Regulatory Footer & Profile */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-start gap-2 bg-white/5 p-3.5 rounded-2xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[10px] text-white/50 leading-relaxed">
              <strong className="text-white">HIPAA Secure Portal</strong>
              <p>Sandbox session isolation. Zero-trust narrative scrubber engaged.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header Controls */}
        <header className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-30 px-6 lg:px-10 py-4 border-b border-outline-variant/10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
            
            {/* Context Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-outline">
              <span>Enterprise Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-on-surface uppercase tracking-wider text-[11px] font-bold">
                {activeScreen === 'office' ? "Virtual Offices" :
                 activeScreen === 'upload' ? "Data Library" :
                 activeScreen === 'config' ? "Workforce Options" :
                 activeScreen === 'processing' ? "Neural Core" :
                 activeScreen === 'results' ? "Results Table" : "Combined Board Summary"}
              </span>
            </div>
          </div>

          {/* User profile and notification indicators */}
          <div className="flex items-center gap-6">
            
            {/* Clinical Alerts Dropdown Placeholder */}
            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
            </button>

            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Dr Thorne clinical profile badge */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface">Dr. Elena Thorne</p>
                <p className="text-[9px] font-extrabold text-primary uppercase tracking-widest">Chief Medical Officer</p>
              </div>
              <img 
                className="w-10 h-10 rounded-xl object-cover shadow-sm ring-1 ring-black/5" 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop" 
                alt="Dr. Elena Thorne profile photo" 
              />
            </div>
          </div>
        </header>

        {/* Core dynamic body layout based on state */}
        <main className="flex-1 px-6 lg:px-10 py-10 max-w-7xl w-full mx-auto">
          {activeScreen === 'office' && (
            <OfficeLanding 
              onNavigate={setActiveScreen}
              selectedAgents={selectedAgents}
              onToggleAgent={handleToggleAgent}
              onSelectAllAgents={handleSelectAllAgents}
              dataset={dataset}
              onLoadSampleDataset={handleLoadSampleDataset}
              onClearDataset={handleClearDataset}
              onUploadDataset={handleUploadDataset}
              agentStates={agentStates}
            />
          )}

          {activeScreen === 'upload' && (
            <DataUpload 
              dataset={dataset}
              onUploadDataset={handleUploadDataset}
              onClearDataset={handleClearDataset}
              onLoadSampleDataset={handleLoadSampleDataset}
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === 'config' && (
            <AgentConfigScreen 
              onNavigate={setActiveScreen}
              selectedAgents={selectedAgents}
              onToggleAgent={handleToggleAgent}
              onStartAnalysis={handleStartAnalysis}
              dataset={dataset}
            />
          )}

          {activeScreen === 'processing' && (
            <LiveProcessing 
              selectedAgents={selectedAgents}
              agentStates={agentStates}
              onCancel={handleCancelAnalysis}
              onRerun={() => handleStartAnalysis({})}
              metadata={{ engine: engineUsed }}
            />
          )}

          {activeScreen === 'results' && (
            <ResultsDashboard 
              results={results}
              analytics={analytics}
              selectedAgents={selectedAgents}
              onNavigate={setActiveScreen}
              engineName={engineUsed}
            />
          )}

          {activeScreen === 'executive' && (
            <CombinedExecutiveDashboard 
              results={results}
              analytics={analytics}
              onNavigate={setActiveScreen}
              selectedAgents={selectedAgents}
              timestamp={timestamp}
            />
          )}
        </main>
      </div>

    </div>
  );
}
