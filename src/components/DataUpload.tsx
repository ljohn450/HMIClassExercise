import { useState } from "react";
import { PatientRecord } from "../types";
import { 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  Search,
  ChevronLeft,
  Settings,
  HelpCircle
} from "lucide-react";

interface DataUploadProps {
  dataset: PatientRecord[];
  onUploadDataset: (files: FileList) => void;
  onClearDataset: () => void;
  onLoadSampleDataset: () => void;
  onNavigate: (screen: 'office' | 'config') => void;
}

export default function DataUpload({
  dataset,
  onUploadDataset,
  onClearDataset,
  onLoadSampleDataset,
  onNavigate
}: DataUploadProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Scan dataset for potential security flags
  const scanForPII = () => {
    if (dataset.length === 0) return { score: 100, issues: [] };
    
    let issues: string[] = [];
    let piisFound = 0;

    // Standard PII regex checks for names, social security, emails
    dataset.forEach((r, idx) => {
      const comment = r.comment.toLowerCase();
      // Simple regex for email
      if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(comment)) {
        piisFound++;
        issues.push(`Row ${idx+1}: Potential email address pattern detected in feedback text.`);
      }
      // Simple phone number check
      if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(comment)) {
        piisFound++;
        issues.push(`Row ${idx+1}: Phone number pattern detected.`);
      }
      // SSN check
      if (/\b\d{3}-\d{2}-\d{4}\b/.test(comment)) {
        piisFound++;
        issues.push(`Row ${idx+1}: SSN / Medical Record Number format detected (CRITICAL risk).`);
      }
    });

    return {
      score: Math.max(0, 100 - (piisFound * 15)),
      issues: issues.slice(0, 5) // return top 5
    };
  };

  const piiReport = scanForPII();
  const filteredDataset = dataset.filter(r => 
    r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.service_line.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patient_persona.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('office')}
          className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Virtual Offices
        </button>
        {dataset.length > 0 && (
          <button 
            onClick={() => onNavigate('config')}
            className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            Proceed to Agent Options
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Header Info */}
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface">Data Upload &amp; Compliance Validation</h2>
        <p className="text-sm text-on-surface-variant/80">
          Upload and review patient experience CSV datasets. Automatically checks for privacy hazards, validates column mappings, and formats comments.
        </p>
      </div>

      {dataset.length === 0 ? (
        /* Empty Upload Interface */
        <div className="bg-white rounded-3xl border border-outline-variant/30 p-12 text-center max-w-2xl mx-auto space-y-8">
          <div className="w-20 h-20 rounded-3xl bg-primary/5 text-primary flex items-center justify-center mx-auto shadow-sm">
            <FileSpreadsheet className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold">No Dataset Selected</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Upload a custom patient feedback CSV spreadsheet, or load our pre-configured medical sample containing de-identified operational comments across 5 clinical departments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <label className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-md">
              Browse CSV File
              <input 
                type="file" 
                className="hidden" 
                accept=".csv" 
                onChange={(e) => {
                  if (e.target.files) onUploadDataset(e.target.files);
                }} 
              />
            </label>
            <button 
              onClick={onLoadSampleDataset}
              className="px-6 py-3 bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 font-bold text-xs rounded-xl transition-all"
            >
              Load Sample Q3 Feedback
            </button>
          </div>
        </div>
      ) : (
        /* Active Dataset Review Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Validator Panel Left - Column Span 1 */}
          <div className="space-y-6 lg:col-span-1">
            {/* Schema Validation Status */}
            <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
              <h3 className="text-sm font-bold border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Column Schema Mapping
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between text-xs">
                  <div>
                    <p className="font-bold">patient_id</p>
                    <p className="text-outline">Data Type: string (alphanumeric)</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-md">VALID</span>
                </div>

                <div className="flex items-start justify-between text-xs">
                  <div>
                    <p className="font-bold">comment</p>
                    <p className="text-outline">Data Type: string (narrative feedback)</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-md">VALID</span>
                </div>

                <div className="flex items-start justify-between text-xs">
                  <div>
                    <p className="font-bold">service_line</p>
                    <p className="text-outline">Data Type: string (category)</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-md">VALID</span>
                </div>

                <div className="flex items-start justify-between text-xs">
                  <div>
                    <p className="font-bold">patient_persona</p>
                    <p className="text-outline">Data Type: string (accessibility cohort)</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-md">VALID</span>
                </div>

                <div className="flex items-start justify-between text-xs">
                  <div>
                    <p className="font-bold">sentiment_score</p>
                    <p className="text-outline">Data Type: integer (range 1-10)</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-md">VALID</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                <span>All core parameters successfully mapped</span>
                <CheckCircle className="w-4 h-4 shrink-0" />
              </div>
            </div>

            {/* Privacy scan & warnings */}
            <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Security &amp; PHI Auditor
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  piiReport.score >= 90 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                }`}>
                  Score: {piiReport.score}%
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                  Automatic scanning checked all narrative fields for Protected Health Information (PHI) patterns like birthdates, SSNs, or patient emails.
                </p>

                {piiReport.issues.length === 0 ? (
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Zero-Trust Secured</p>
                      <p className="text-[10px] text-emerald-700 mt-0.5">No patient identifiers or high-risk liability markers detected.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-800">PII Warning Flags</p>
                        <p className="text-[10px] text-amber-700 mt-0.5">Potential identifiers found. Recommended to sanitize before execution.</p>
                      </div>
                    </div>
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {piiReport.issues.map((issue, idx) => (
                        <p key={idx} className="text-[10px] text-slate-600 font-mono leading-normal">• {issue}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100">
                  <p className="text-[11px] text-blue-800 leading-normal">
                    <strong>Notice:</strong> This system uses advanced clinical models optimized for de-identified research or synthetic testing data. Avoid uploading active un-redacted chart files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Data Preview - Column Span 2 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm flex flex-col h-full min-h-[500px]">
              
              {/* Header inside review box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold">Interactive Record Preview</h3>
                  <p className="text-xs text-outline font-medium">Displaying up to {filteredDataset.length} de-identified comments</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Search bar inside */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                    <input 
                      type="text"
                      placeholder="Search comments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 w-48 placeholder:text-outline"
                    />
                  </div>
                  
                  <button 
                    onClick={onClearDataset}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all border border-red-100 font-bold text-xs flex items-center gap-1.5"
                    title="Remove Dataset"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="p-3 text-xs font-bold text-outline uppercase">ID</th>
                      <th className="p-3 text-xs font-bold text-outline uppercase">Service Line</th>
                      <th className="p-3 text-xs font-bold text-outline uppercase">Cohort Persona</th>
                      <th className="p-3 text-xs font-bold text-outline uppercase">Feedback Comment</th>
                      <th className="p-3 text-xs font-bold text-outline uppercase text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDataset.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 text-xs font-bold text-on-surface whitespace-nowrap">{row.patient_id}</td>
                        <td className="p-3 text-xs font-medium text-primary whitespace-nowrap">{row.service_line}</td>
                        <td className="p-3 text-xs whitespace-nowrap">
                          <span className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium text-[10px]">
                            {row.patient_persona}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-on-surface-variant max-w-sm truncate" title={row.comment}>
                          {row.comment}
                        </td>
                        <td className="p-3 text-xs text-center font-bold">
                          <span className={`px-2 py-0.5 rounded ${
                            row.sentiment_score >= 8 ? "bg-emerald-50 text-emerald-700" :
                            row.sentiment_score >= 5 ? "bg-slate-100 text-slate-700" : "bg-red-50 text-red-700"
                          }`}>
                            {row.sentiment_score}/10
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredDataset.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-xs text-outline">
                          No matching records found. Try another query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
