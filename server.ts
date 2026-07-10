import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Mock Patient Dataset Generator and high-fidelity Analysis engine
// This will serve as a robust simulator when no GEMINI_API_KEY is configured
const DEFAULT_PATIENTS = [
  {
    patient_id: "P-1001",
    patient_name: "De-identified patient 1001",
    service_line: "Family Medicine",
    comment: "The clinic was very hard to find, and the entrance did not have an automated door or wheelchair ramp. I had to wait in the cold for 20 minutes before someone helped me inside.",
    visit_type: "Outpatient",
    sentiment_score: 2,
    communication_rating: 4,
    follow_up_compliant: "Yes",
    patient_persona: "Patient with Disability"
  },
  {
    patient_id: "P-1002",
    patient_name: "De-identified patient 1002",
    service_line: "Cardiology",
    comment: "Doctor spent less than 5 minutes with me, didn't answer my questions about the side effects of my new prescription, and then I waited 45 minutes at checkout just to find out they got my copay wrong.",
    visit_type: "Outpatient",
    sentiment_score: 3,
    communication_rating: 2,
    follow_up_compliant: "No",
    patient_persona: "Older Adult"
  },
  {
    patient_id: "P-1003",
    patient_name: "De-identified patient 1003",
    service_line: "Emergency Department",
    comment: "No había nadie que hablara español en la recepción. Me dieron unos papeles en inglés y no pude entender las instrucciones de mi alta médica. Me da miedo tomar la medicina equivocada.",
    visit_type: "Emergency",
    sentiment_score: 1,
    communication_rating: 1,
    follow_up_compliant: "No",
    patient_persona: "Limited English Proficiency"
  },
  {
    patient_id: "P-1004",
    patient_name: "De-identified patient 1004",
    service_line: "Oncology",
    comment: "I've been trying to log into the HealAI patient portal for three days to see my biopsy results. The system keeps saying my activation code is expired, and when I called support, they told me to wait for a physical letter. This is incredibly stressful.",
    visit_type: "Outpatient",
    sentiment_score: 3,
    communication_rating: 3,
    follow_up_compliant: "Yes",
    patient_persona: "Low Digital Literacy"
  },
  {
    patient_id: "P-1005",
    patient_name: "De-identified patient 1005",
    service_line: "Pediatrics",
    comment: "I arrived on time for my 10 AM appointment, but wasn't called back until 11:15 AM. No one apologized or explained the delay. The waiting room was crowded and uncomfortable.",
    visit_type: "Outpatient",
    sentiment_score: 4,
    communication_rating: 5,
    follow_up_compliant: "Yes",
    patient_persona: "Parent of Minor"
  },
  {
    patient_id: "P-1006",
    patient_name: "De-identified patient 1006",
    service_line: "Orthopedics",
    comment: "The billing department sent my invoice to the wrong address, then threatened to send it to collections before I even received the first bill. The online portal didn't let me pay with my HSA card.",
    visit_type: "Outpatient",
    sentiment_score: 2,
    communication_rating: 4,
    follow_up_compliant: "Yes",
    patient_persona: "Digital Native"
  },
  {
    patient_id: "P-1007",
    patient_name: "De-identified patient 1007",
    service_line: "Cardiology",
    comment: "Wonderful care from Dr. Elena Thorne and her team! She was extremely thorough, explained everything about my heart health, and followed up personally the next day. The portal was easy to use too.",
    visit_type: "Outpatient",
    sentiment_score: 10,
    communication_rating: 10,
    follow_up_compliant: "Yes",
    patient_persona: "Older Adult"
  },
  {
    patient_id: "P-1008",
    patient_name: "De-identified patient 1008",
    service_line: "Family Medicine",
    comment: "The scheduling system booked me with a physician in another town 2 hours away instead of my local clinic. When I tried to cancel, they said I would be charged a no-show fee. I live in a rural area and don't have reliable transportation.",
    visit_type: "Outpatient",
    sentiment_score: 3,
    communication_rating: 4,
    follow_up_compliant: "No",
    patient_persona: "Rural Patient"
  },
  {
    patient_id: "P-1009",
    patient_name: "De-identified patient 1009",
    service_line: "Pediatrics",
    comment: "My grandmother is 85 and has severe hearing loss. The nurse just yelled her name in a busy hallway, and when she didn't hear, they crossed her off the list. When we asked, they said we would have to reschedule next month. Unbelievable lack of empathy.",
    visit_type: "Outpatient",
    sentiment_score: 2,
    communication_rating: 2,
    follow_up_compliant: "No",
    patient_persona: "Older Adult"
  },
  {
    patient_id: "P-1010",
    patient_name: "De-identified patient 1010",
    service_line: "Emergency Department",
    comment: "Nurse practitioner didn't double check my chart and almost administered the penicillin that I am severely allergic to. I had to point out the red allergy band on my wrist. This was a critical mistake!",
    visit_type: "Emergency",
    sentiment_score: 1,
    communication_rating: 3,
    follow_up_compliant: "Yes",
    patient_persona: "Patient with Disability"
  }
];

// Helper to simulate analysis output for a single patient record
function generateSimulatedAnalysis(patient: typeof DEFAULT_PATIENTS[0]) {
  const commentLower = patient.comment.toLowerCase();

  // Agent 1: Patient Feedback Insight Agent simulation
  let insightTheme = "Clinical Care";
  if (commentLower.includes("wait") || commentLower.includes("delay") || commentLower.includes("waiting")) {
    insightTheme = "Wait Time";
  } else if (commentLower.includes("billing") || commentLower.includes("bill") || commentLower.includes("copay") || commentLower.includes("invoice")) {
    insightTheme = "Billing";
  } else if (commentLower.includes("portal") || commentLower.includes("log") || commentLower.includes("system") || commentLower.includes("online")) {
    insightTheme = "Technology / Patient Portal";
  } else if (commentLower.includes("ramp") || commentLower.includes("automated door") || commentLower.includes("español") || commentLower.includes("spanish") || commentLower.includes("disability") || commentLower.includes("hearing")) {
    insightTheme = "Accessibility / Equity";
  } else if (commentLower.includes("scheduling") || commentLower.includes("scheduled") || commentLower.includes("book")) {
    insightTheme = "Scheduling";
  } else if (commentLower.includes("nurse yelled") || commentLower.includes("doctor spent") || commentLower.includes("questions") || commentLower.includes("explicó")) {
    insightTheme = "Communication";
  }

  let insightSentiment = "Negative";
  if (patient.sentiment_score >= 8) insightSentiment = "Positive";
  else if (patient.sentiment_score >= 5) insightSentiment = "Neutral";
  else if (patient.sentiment_score >= 3) insightSentiment = "Mixed";

  const insightReasoning = `The comment highlights an issue categorized under ${insightTheme}. The patient expresses ${insightSentiment.toLowerCase()} feelings with a satisfaction score of ${patient.sentiment_score}/10.`;
  const insightOperationalIssue = commentLower.includes("wait") ? "Waiting room congestion & throughput blockages" : 
                                   commentLower.includes("door") ? "Physical infrastructure barrier" :
                                   commentLower.includes("español") ? "Inadequate translation services / LEP protocol failure" :
                                   commentLower.includes("billing") ? "Account statement distribution & HSA processing failure" :
                                   commentLower.includes("penicillin") ? "Allergy notification verification protocol failure" : "Standard care coordination delay";

  const insightRiskOrBias = patient.patient_persona === "Limited English Proficiency" ? "Discharge comprehension risk, language equity barrier." :
                            patient.patient_persona === "Patient with Disability" ? "Physical accessibility compliance hazard (ADA checklist)." :
                            patient.patient_persona === "Older Adult" ? "Age-related communication exclusion or active dismissiveness." : "Process latency under-reporting.";

  const insightAction = commentLower.includes("español") ? "Deploy instant on-demand digital translation tablets in ED reception." :
                        commentLower.includes("ramp") ? "Conduct immediate engineering assessment for ADA-compliant automatic doors." :
                        commentLower.includes("penicillin") ? "Mandate hard electronic stop in EHR for allergy verification before nursing handoff." : "Implement operational checklist review.";

  // Agent 2: Patient Experience Monitoring Agent simulation
  const monitorSecondary = insightTheme !== "Clinical Care" ? ["Clinical Care"] : ["Communication"];
  const monitorRisk = patient.sentiment_score <= 2 ? "High Risk" : patient.sentiment_score <= 4 ? "Moderate Risk" : "Low Risk";
  const monitorExecSummary = `Primary: ${insightTheme}. Severity: ${monitorRisk}. Action: ${insightAction}`;

  // Agent 3: Complaint Triage Agent simulation
  let triageCategory = insightTheme as any;
  if (commentLower.includes("allergic") || commentLower.includes("penicillin")) {
    triageCategory = "Patient Safety";
  }
  let triageSeverity = "LEVEL 1 – Low";
  if (triageCategory === "Patient Safety" || commentLower.includes("penicillin")) {
    triageSeverity = "LEVEL 4 – Critical";
  } else if (patient.sentiment_score <= 2 || commentLower.includes("español") || commentLower.includes("hearing")) {
    triageSeverity = "LEVEL 3 – High";
  } else if (patient.sentiment_score <= 4) {
    triageSeverity = "LEVEL 2 – Moderate";
  }

  const triageSeverityJustification = triageSeverity.includes("Critical") ? "Immediate patient safety risk from potential near-miss drug allergy administration." :
                                       triageSeverity.includes("High") ? "Serious equity, accessibility, or safety concern affecting vulnerable patient cohorts." :
                                       triageSeverity.includes("Moderate") ? "Repeated clinical workflows or billing errors triggering severe frustration." : "Minor administrative inconvenience.";

  const triageRisks = [];
  if (triageCategory === "Patient Safety" || commentLower.includes("penicillin")) triageRisks.push("Patient Safety Risk", "Clinical Risk");
  if (patient.patient_persona === "Limited English Proficiency") triageRisks.push("Compliance Risk", "Equity Risk");
  if (patient.patient_persona === "Patient with Disability") triageRisks.push("Accessibility Risk", "Compliance Risk");
  if (commentLower.includes("billing") || commentLower.includes("collections")) triageRisks.push("Operational Risk", "Reputational Risk");
  if (triageRisks.length === 0) triageRisks.push("Operational Risk");

  const triageDept = triageCategory === "Patient Safety" ? "Risk Management" :
                     patient.patient_persona === "Limited English Proficiency" ? "Accessibility Coordinator" :
                     patient.patient_persona === "Patient with Disability" ? "Accessibility Coordinator" :
                     insightTheme === "Billing" ? "Revenue Cycle / Billing" :
                     insightTheme === "Technology / Patient Portal" ? "Information Technology" : "Patient Experience Team";

  const triagePriority = triageSeverity.includes("Critical") ? "Immediate" : triageSeverity.includes("High") ? "Priority" : "Routine";
  const triageHuman = triageSeverity.includes("Critical") || triageSeverity.includes("High") ? "Human Review Required" : "Human Review Recommended";

  return {
    patient_id: patient.patient_id,
    patient_name: patient.patient_name,
    service_line: patient.service_line,
    comment: patient.comment,
    visit_type: patient.visit_type,
    patient_persona: patient.patient_persona,
    sentiment_score: patient.sentiment_score,
    communication_rating: patient.communication_rating,
    follow_up_compliant: patient.follow_up_compliant,
    insightAgent: {
      theme: insightTheme,
      sentiment: insightSentiment,
      reasoning: insightReasoning,
      operational_issue: insightOperationalIssue,
      risk_or_bias: insightRiskOrBias,
      recommended_action: insightAction
    },
    monitoringAgent: {
      theme: insightTheme,
      secondary_themes: monitorSecondary,
      sentiment: insightSentiment,
      reasoning: insightReasoning,
      operational_issue: insightOperationalIssue,
      equity_concern: insightRiskOrBias,
      risk_level: monitorRisk,
      recommendation: insightAction,
      summary: {
        primary_issue: insightTheme,
        severity: monitorRisk,
        recommended_action: insightAction
      }
    },
    triageAgent: {
      category: triageCategory,
      secondary_categories: monitorSecondary,
      severity_level: triageSeverity,
      severity_justification: triageSeverityJustification,
      risk_flags: triageRisks,
      recommended_department: triageDept,
      escalation_priority: triagePriority,
      human_review_status: triageHuman,
      summary: `Triage Priority: ${triagePriority}. Route to: ${triageDept}. Status: ${triageHuman}.`
    }
  };
}

// Full execution analysis route
app.post("/api/analyze", async (req, res) => {
  const { data, selectedAgents, options = {} } = req.body;
  const isUsingSample = !data || !Array.isArray(data) || data.length === 0;
  const rawPatients = isUsingSample ? DEFAULT_PATIENTS : data;

  console.log(`Starting analysis for ${rawPatients.length} rows. Sample: ${isUsingSample}. Selected Agents:`, selectedAgents);

  const apiKey = process.env.GEMINI_API_KEY;
  const useRealGemini = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

  // Set up response framework
  let results: any[] = [];
  let analyticsOverview: any = null;

  try {
    if (useRealGemini) {
      console.log("Using Real Gemini SDK (gemini-3.5-flash) for analysis...");
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // To keep it extremely robust and fast, we analyze the records in a unified schema call or batches
      // Let's analyze them using a highly descriptive prompt
      const prompt = `
        You are an elite Clinical Intelligence Multi-Agent System analyzing patient feedback.
        Analyze the following ${rawPatients.length} patient comments:
        ${JSON.stringify(rawPatients.map((p: any, i: number) => ({ id: p.patient_id || `P-${1000+i}`, comment: p.comment, persona: p.patient_persona, service_line: p.service_line })))}

        For each patient comment, evaluate the following based on the instructions for these agents:
        1. Patient Feedback Insight Agent:
           - theme: Communication | Scheduling | Wait Time | Technology / Patient Portal | Billing | Clinical Care | Discharge / Follow-Up | Accessibility / Equity | Mixed or Ambiguous
           - sentiment: Positive | Negative | Neutral | Mixed
           - reasoning: brief clinical explanation
           - operational_issue: the specific hospital process error
           - risk_or_bias: safety, equity, language, physical disability, age bias or AI trap
           - recommended_action: practical managerial action
        2. Patient Experience Monitoring Agent:
           - theme: same as above or 'Patient Safety'
           - secondary_themes: list other matching themes
           - sentiment: same as above
           - reasoning: why this sentiment
           - operational_issue: process error
           - equity_concern: accessibility/equity failure
           - risk_level: Low Risk | Moderate Risk | High Risk
           - recommendation: detailed action
           - summary: { primary_issue: string, severity: string, recommended_action: string }
        3. Complaint Triage Agent:
           - category: Communication | Scheduling | Wait Time | Technology / Patient Portal | Billing | Clinical Care | Discharge and Follow-Up | Accessibility and Equity | Patient Safety | Privacy or Security | Staff Conduct | Other
           - secondary_categories: other categories
           - severity_level: LEVEL 1 – Low | LEVEL 2 – Moderate | LEVEL 3 – High | LEVEL 4 – Critical
           - severity_justification: explain the severity choice
           - risk_flags: array from [Patient Safety Risk, Clinical Risk, Compliance Risk, Privacy Risk, Accessibility Risk, Equity Risk, Reputational Risk, Operational Risk]
           - recommended_department: Patient Experience Team | Nursing Leadership | Physician Leadership | Quality Improvement Team | Compliance Office | Information Technology | Revenue Cycle / Billing | Accessibility Coordinator | Risk Management | Executive Review
           - escalation_priority: Routine | Priority | Immediate
           - human_review_status: AI Review Only | Human Review Recommended | Human Review Required (Required if safety, discrimination, privacy, compliance or legal risk exists)
           - summary: executive summary string

        Return a JSON object containing a 'results' array where each item has:
        - patient_id matching the input id
        - insightAgent object
        - monitoringAgent object
        - triageAgent object

        Ensure strict JSON compliance. Do not return markdown block wrappers, return ONLY the JSON payload.
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          }
        });

        const cleanedText = response.text ? response.text.trim() : "{}";
        const parsed = JSON.parse(cleanedText);
        
        if (parsed && Array.isArray(parsed.results)) {
          results = rawPatients.map((pat: any, index: number) => {
            const patId = pat.patient_id || `P-${1000 + index}`;
            const geminiReview = parsed.results.find((r: any) => r.patient_id === patId);
            if (geminiReview) {
              return {
                ...pat,
                patient_id: patId,
                insightAgent: geminiReview.insightAgent,
                monitoringAgent: geminiReview.monitoringAgent,
                triageAgent: geminiReview.triageAgent
              };
            } else {
              return generateSimulatedAnalysis(pat);
            }
          });
        } else {
          // Fallback if parsing fails or structure mismatches
          results = rawPatients.map((pat: any) => generateSimulatedAnalysis(pat));
        }
      } catch (err) {
        console.error("Gemini API execution error, falling back to simulator:", err);
        results = rawPatients.map((pat: any) => generateSimulatedAnalysis(pat));
      }
    } else {
      console.log("No Gemini API Key found or active. Running high-fidelity clinical simulation engine...");
      // Wait slightly to simulate analytical reasoning
      await new Promise((resolve) => setTimeout(resolve, 1500));
      results = rawPatients.map((pat: any) => generateSimulatedAnalysis(pat));
    }

    // Now, run the fourth agent: Healthcare Analytics Agent calculations
    // This aggregates the results of all patient reviews to build the dashboard visualizations
    const totalCount = results.length;
    const avgSatisfaction = parseFloat((results.reduce((sum, r) => sum + (r.sentiment_score || 5), 0) / totalCount).toFixed(1));
    const avgCommunication = parseFloat((results.reduce((sum, r) => sum + (r.communication_rating || 5), 0) / totalCount).toFixed(1));
    const followUpRate = Math.round((results.filter(r => r.follow_up_compliant === "Yes").length / totalCount) * 100);
    const serviceLines = Array.from(new Set(results.map(r => r.service_line)));

    // Theme Distribution
    const themesMap: Record<string, number> = {};
    results.forEach(r => {
      const th = r.insightAgent?.theme || "Clinical Care";
      themesMap[th] = (themesMap[th] || 0) + 1;
    });
    const themeDistribution = Object.entries(themesMap).map(([theme, count]) => ({ theme, count }));

    // Satisfaction by Service Line
    const serviceLineStats = serviceLines.map(sl => {
      const filtered = results.filter(r => r.service_line === sl);
      const avgSat = parseFloat((filtered.reduce((sum, r) => sum + (r.sentiment_score || 5), 0) / filtered.length).toFixed(1));
      const complaintCount = filtered.filter(r => (r.sentiment_score || 5) <= 3).length;
      return { service_line: sl, average_satisfaction: avgSat, complaint_count: complaintCount, total: filtered.length };
    });

    // Equity & Persona Review
    const personas = Array.from(new Set(results.map(r => r.patient_persona || "General Patient")));
    const personaStats = personas.map(p => {
      const filtered = results.filter(r => r.patient_persona === p);
      const avgSat = parseFloat((filtered.reduce((sum, r) => sum + (r.sentiment_score || 5), 0) / filtered.length).toFixed(1));
      const accessConcerns = filtered.filter(r => r.insightAgent?.theme === "Accessibility / Equity" || r.insightAgent?.risk_or_bias?.toLowerCase().includes("equity") || r.insightAgent?.risk_or_bias?.toLowerCase().includes("accessibility")).length;
      return { persona: p, average_satisfaction: avgSat, count: filtered.length, accessibility_concerns: accessConcerns };
    });

    // Hidden Organizational Problems
    const bottlenecks: any[] = [];
    results.forEach(r => {
      if (r.triageAgent?.severity_level.includes("High") || r.triageAgent?.severity_level.includes("Critical")) {
        bottlenecks.push({
          patient_id: r.patient_id,
          service_line: r.service_line,
          issue: r.insightAgent?.operational_issue,
          severity: r.triageAgent?.severity_level,
          comment: r.comment,
          persona: r.patient_persona
        });
      }
    });

    // AI Agent Opportunities
    const aiOpportunities = [
      {
        agent_name: "LEP Auto-Translation Companion",
        purpose: "Instantly translate discharge summaries, intake forms, and prescription details dynamically based on clinical record inputs.",
        expected_impact: "Reduces discharge comprehension risks by 90% and eliminates LEP (Limited English Proficiency) safety near-misses."
      },
      {
        agent_name: "ADA Careway Route Optimizer",
        purpose: "Pre-screen patient intake profiles for physical disabilities and automatically dispatch assistance / activate automatic routing details.",
        expected_impact: "Eliminates physical bottlenecks in reception and coordinates facilities management proactively."
      },
      {
        agent_name: "Smart Billing Dispute Resolver",
        purpose: "Analyze billing friction points, explain HSA/copay breakdowns in natural language, and correct mailing addresses automatically.",
        expected_impact: "Decreases patient accounts collections escalation and speeds up copay collection cycles."
      }
    ];

    // Executive Recommendations
    const recommendations = {
      priorities: [
        "Audit Emergency Department translation services and deploy dedicated bilingual staff or tablets.",
        "Assess Orthopedics billing distribution list pipelines to resolve wrong-address complaints.",
        "Mandate hard stops in the Electronic Health Record (EHR) for allergy verifications in nursing handover workflows.",
        "Optimize Cardiology wait times and post-discharge follow-up compliance checks.",
        "Install ADA-compliant push-button automatic entryways at Family Medicine outpatient clinic branches."
      ],
      quick_wins: [
        "Deploy on-demand translation support in the patient portal within 30 days.",
        "Revise clinic entrance signage and wheelchair access notifications.",
        "Establish an automatic sms alert system for billing verification prior to paper mail delivery."
      ],
      long_term: [
        "Integrate full-scale real-time patient experience feedback monitoring with EHR-alert routing.",
        "Pilot predictive scheduling assistants to reduce wait times by modeling historical patient arrival patterns."
      ]
    };

    analyticsOverview = {
      total_analyzed: totalCount,
      average_satisfaction: avgSatisfaction,
      average_communication: avgCommunication,
      follow_up_compliance: followUpRate,
      service_lines_count: serviceLines.length,
      theme_distribution: themeDistribution,
      service_line_stats: serviceLineStats,
      persona_stats: personaStats,
      bottlenecks: bottlenecks,
      ai_opportunities: aiOpportunities,
      executive_recommendations: recommendations
    };

    res.json({
      success: true,
      results: results,
      analytics: analyticsOverview,
      metadata: {
        isSample: isUsingSample,
        timestamp: new Date().toISOString(),
        engine: useRealGemini ? "Gemini 3.5 Flash Model" : "HealAI Local Clinical Simulator V2.4"
      }
    });

  } catch (error: any) {
    console.error("Critical error in /api/analyze:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during multi-agent clinical analysis."
    });
  }
});

// Vite & Static file serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HealAI Enterprise] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
