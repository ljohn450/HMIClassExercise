import React, { useState } from "react";
import { SAMPLE_PATIENTS, AGENT_CARDS } from "../sampleData";
import { ScreenType, AgentConfig, PatientRecord } from "../types";
import { 
  Layers, 
  HelpCircle, 
  Settings, 
  Search, 
  Bell, 
  User, 
  ShieldAlert, 
  FileSpreadsheet, 
  ArrowRight, 
  BrainCircuit, 
  CheckCircle,
  FileCheck2,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Upload,
  Info
} from "lucide-react";

interface OfficeLandingProps {
  onNavigate: (screen: ScreenType) => void;
  selectedAgents: string[];
  onToggleAgent: (agentId: string) => void;
  onSelectAllAgents: () => void;
  dataset: PatientRecord[];
  onLoadSampleDataset: () => void;
  onClearDataset: () => void;
  onUploadDataset: (files: FileList) => void;
  agentStates: Record<string, { status: string; progress: number }>;
}

export default function OfficeLanding({
  onNavigate,
  selectedAgents,
  onToggleAgent,
  onSelectAllAgents,
  dataset,
  onLoadSampleDataset,
  onClearDataset,
  onUploadDataset,
  agentStates
}: OfficeLandingProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedDetailsAgent, setSelectedDetailsAgent] = useState<AgentConfig | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadDataset(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDataset(e.target.files);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-[11px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
              <span className="material-symbols-outlined text-[14px] fill-1">verified</span>
              Enterprise Certified Environment
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 leading-tight">
              Healthcare AI <br />
              <span className="text-primary">Agent Portal</span>
            </h2>
            <p className="text-lg text-on-surface-variant/80 font-normal leading-relaxed">
              Collaborative AI Workspace for Patient Experience Intelligence. Synthesize clinical datasets and qualitative comments into actionable medical strategies with four specialized neural agents.
            </p>
          </div>
          <div className="flex items-center gap-10 bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white">
            <div className="text-left">
              <p className="text-[10px] text-outline font-bold uppercase tracking-[0.2em] mb-1">Active Patients</p>
              <p className="text-[28px] font-extrabold tracking-tight">12,842</p>
            </div>
            <div className="w-px h-12 bg-outline-variant/30"></div>
            <div className="text-left">
              <p className="text-[10px] text-outline font-bold uppercase tracking-[0.2em] mb-1">Sentiment Score</p>
              <div className="flex items-baseline gap-1">
                <p className="text-[28px] text-secondary font-extrabold tracking-tight">8.4</p>
                <p className="text-[14px] font-bold text-outline">/10</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Dropzone/Dataset Source - Column Span 4 */}
        <section className="xl:col-span-4 flex flex-col">
          <div className="glass-card rounded-3xl p-8 h-full flex flex-col transition-all duration-500 hover:border-primary/20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Dataset Source</h3>
              <div className="relative group">
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/5 text-outline">
                  <Info className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-10 w-64 bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl hidden group-hover:block z-10 leading-relaxed">
                  All processed feedback comments are fully de-identified. Secure validation safeguards ensure compliance with HIPAA guidelines before sending data to neural agents.
                </div>
              </div>
            </div>

            {/* Dropzone Box */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`flex-1 border-2 border-dashed rounded-2xl bg-white/30 transition-all group flex flex-col items-center justify-center p-6 text-center relative cursor-pointer min-h-[260px] ${
                dragActive ? "border-primary bg-primary/[0.04]" : "border-outline-variant/40 hover:bg-primary/[0.02] hover:border-primary/40"
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Upload className="w-8 h-8 font-light" />
                </div>
                <h4 className="text-base font-bold text-on-surface mb-2">Drop patient dataset here</h4>
                <p className="text-xs text-on-surface-variant/70 mb-6 max-w-[200px]">
                  Supports standard CSV datasets with comments, service lines, and scores.
                </p>
                <div className="flex flex-col gap-2 w-full max-w-[200px]">
                  <span className="px-4 py-2 bg-white text-primary font-bold text-[13px] rounded-xl hover:bg-primary hover:text-white transition-all border border-primary/20 shadow-sm">
                    Browse Files
                  </span>
                </div>
              </label>
            </div>

            {/* Simulated Data Preloader */}
            <div className="mt-6 flex flex-col gap-3">
              <button 
                onClick={onLoadSampleDataset}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-primary font-bold text-xs rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Load Premium Sample Dataset
              </button>
            </div>

            {/* Dataset Metadata Box */}
            {dataset.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-outline-variant/30 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div className="truncate max-w-[150px]">
                        <p className="text-sm font-bold text-on-surface truncate">
                          {dataset[0]?.patient_name?.includes("De-identified") ? "q3_patient_feedback.csv" : "custom_upload.csv"}
                        </p>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Validated Secure</p>
                      </div>
                    </div>
                    <button 
                      onClick={onClearDataset}
                      className="p-1.5 hover:bg-red-50 text-outline hover:text-red-600 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 mt-4 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] text-outline font-bold uppercase tracking-wider">Loaded Comments</p>
                      <p className="text-sm font-bold text-on-surface">{dataset.length} Records</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-outline font-bold uppercase tracking-wider">Compliance</p>
                      <p className="text-sm font-bold text-emerald-600">HIPAA Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Intelligence Workforce - Column Span 8 */}
        <section className="xl:col-span-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold">Intelligence Workforce</h3>
              <p className="text-sm text-on-surface-variant/70">Deploy specialized neural agents for clinical reasoning.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onSelectAllAgents}
                className="px-4 py-2 rounded-xl border border-outline-variant/40 text-[13px] font-bold hover:bg-white transition-all bg-transparent"
              >
                Select All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AGENT_CARDS.map((agent) => {
              const isSelected = selectedAgents.includes(agent.id);
              const state = agentStates[agent.id] || { status: 'idle', progress: 0 };
              
              // Define visual status badge
              let statusText = "Offline";
              let statusColor = "bg-slate-400";
              let statusTextClass = "text-slate-500";
              
              if (isSelected) {
                if (state.status === 'processing') {
                  statusText = "Processing";
                  statusColor = "bg-blue-500 status-dot";
                  statusTextClass = "text-blue-600";
                } else if (state.status === 'completed') {
                  statusText = "Completed";
                  statusColor = "bg-emerald-500";
                  statusTextClass = "text-emerald-600";
                } else if (state.status === 'error') {
                  statusText = "Error";
                  statusColor = "bg-red-500";
                  statusTextClass = "text-red-600";
                } else {
                  statusText = "Selected";
                  statusColor = "bg-blue-600";
                  statusTextClass = "text-blue-600";
                }
              } else {
                statusText = "Idle";
                statusColor = "bg-amber-400";
                statusTextClass = "text-amber-600";
              }

              return (
                <div 
                  key={agent.id}
                  className={`glass-card rounded-3xl p-6 transition-all duration-500 relative group overflow-hidden border-l-[6px] ${
                    isSelected ? "border-l-primary" : "border-l-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div 
                      className="relative cursor-pointer"
                      onClick={() => setSelectedDetailsAgent(agent)}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <img 
                        className={`w-16 h-16 rounded-2xl object-cover shadow-md transition-all duration-700 ${
                          state.status === 'processing' ? 'animate-pulse scale-105 border-2 border-primary' : 'group-hover:scale-105'
                        }`} 
                        src={agent.avatar} 
                        alt={agent.name}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white shadow-sm ${statusColor}`}></div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => onToggleAgent(agent.id)}
                      />
                      <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all after:shadow-sm peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-base font-bold text-on-surface mb-1 flex items-center gap-2">
                      {agent.name}
                      {isSelected && <span className="material-symbols-outlined text-primary text-[16px] fill-1">verified</span>}
                    </h4>
                    <p className="text-xs text-outline font-semibold uppercase tracking-wider mb-2">{agent.role}</p>
                    <p className="text-xs text-on-surface-variant/80 leading-relaxed line-clamp-2">{agent.description}</p>
                  </div>

                  {state.status === 'processing' && (
                    <div className="mb-4 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-300" style={{ width: `${state.progress}%` }}></div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${statusTextClass}`}>{statusText}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedDetailsAgent(agent)}
                      className="text-primary font-bold text-xs flex items-center gap-1.5 hover:gap-3 transition-all"
                    >
                      Capabilities 
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Enhanced Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
          <p className="text-[11px] font-extrabold text-outline uppercase tracking-[0.2em] mb-4">Processed Insights</p>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-[36px] text-on-surface font-extrabold tracking-tight">4.2M</span>
            <span className="text-green-600 text-[13px] font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.4%
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            <div className="flex-1 bg-primary/10 h-[30%] rounded-sm"></div>
            <div className="flex-1 bg-primary/10 h-[45%] rounded-sm"></div>
            <div className="flex-1 bg-primary/10 h-[60%] rounded-sm"></div>
            <div className="flex-1 bg-primary/10 h-[40%] rounded-sm"></div>
            <div className="flex-1 bg-primary/10 h-[75%] rounded-sm"></div>
            <div className="flex-1 bg-primary/30 h-[90%] rounded-sm"></div>
            <div className="flex-1 bg-primary h-[85%] rounded-sm shadow-[0_0_8px_rgba(0,61,155,0.2)]"></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-sm group">
          <p className="text-[11px] font-extrabold text-outline uppercase tracking-[0.2em] mb-4">Active Analyses</p>
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-[36px] text-on-surface font-extrabold tracking-tight">18</span>
            <span className="text-on-surface-variant/60 text-[13px] font-bold">Concurrent Threads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {AGENT_CARDS.map((agent) => (
                <img 
                  key={agent.id}
                  className="w-10 h-10 rounded-full border-[3px] border-white object-cover shadow-sm ring-1 ring-black/5" 
                  src={agent.avatar} 
                  alt={agent.name}
                />
              ))}
            </div>
            <p className="ml-3 text-[13px] text-on-surface-variant font-medium">Core resources active</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-sm">
          <p className="text-[11px] font-extrabold text-outline uppercase tracking-[0.2em] mb-4">Compliance Status</p>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-[36px] text-on-surface font-extrabold tracking-tight">100%</span>
            <span className="text-emerald-600 text-[13px] font-bold">HIPAA Secure</span>
          </div>
          <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <p className="text-xs text-emerald-800 font-medium leading-tight">
              All records pre-scrubbed of protected health information (PHI) via automated zero-trust validator before analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Selected Agent Control Bar */}
      {selectedAgents.length > 0 && (
        <div className="fixed bottom-0 right-0 w-full lg:left-64 lg:w-auto z-40 p-6 pointer-events-none">
          <div className="max-w-4xl mx-auto lg:ml-auto lg:mr-0 pointer-events-auto">
            <div className="bg-slate-900 text-white rounded-3xl shadow-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 ring-1 ring-white/5">
              <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                  <BrainCircuit className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedAgents.length} Agents Selected</p>
                  <p className="text-[11px] text-white/50">
                    Ready to analyze {dataset.length > 0 ? `${dataset.length} records` : "sample data"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('config')}
                  className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  Configure &amp; Launch Analysis
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Detail Overlay Modal */}
      {selectedDetailsAgent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-outline-variant/30 relative">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img className="w-16 h-16 rounded-2xl object-cover border border-slate-100" src={selectedDetailsAgent.avatar} alt={selectedDetailsAgent.name} />
                <div>
                  <h3 className="text-xl font-bold">{selectedDetailsAgent.name}</h3>
                  <p className="text-xs text-outline uppercase tracking-wider font-semibold">{selectedDetailsAgent.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDetailsAgent(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{selectedDetailsAgent.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-outline uppercase tracking-wider mb-3">Key Analytical Capabilities</h4>
                <ul className="space-y-2">
                  {selectedDetailsAgent.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    onToggleAgent(selectedDetailsAgent.id);
                    setSelectedDetailsAgent(null);
                  }}
                  className={`flex-1 py-3 font-bold text-xs rounded-xl transition-all ${
                    selectedAgents.includes(selectedDetailsAgent.id)
                      ? "bg-red-50 hover:bg-red-100 text-red-600"
                      : "bg-primary hover:bg-blue-600 text-white"
                  }`}
                >
                  {selectedAgents.includes(selectedDetailsAgent.id) ? "Deactivate Agent" : "Activate & Select Agent"}
                </button>
                <button
                  onClick={() => setSelectedDetailsAgent(null)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
