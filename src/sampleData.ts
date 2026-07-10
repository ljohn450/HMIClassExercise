import { PatientRecord } from "./types";

export const SAMPLE_PATIENTS: PatientRecord[] = [
  {
    patient_id: "P-1001",
    patient_name: "De-identified Patient A",
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
    patient_name: "De-identified Patient B",
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
    patient_name: "De-identified Patient C",
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
    patient_name: "De-identified Patient D",
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
    patient_name: "De-identified Patient E",
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
    patient_name: "De-identified Patient F",
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
    patient_name: "De-identified Patient G",
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
    patient_name: "De-identified Patient H",
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
    patient_name: "De-identified Patient I",
    service_line: "Geriatrics",
    comment: "My grandmother is 85 and has severe hearing loss. The nurse just yelled her name in a busy hallway, and when she didn't hear, they crossed her off the list. When we asked, they said we would have to reschedule next month. Unbelievable lack of empathy.",
    visit_type: "Outpatient",
    sentiment_score: 2,
    communication_rating: 2,
    follow_up_compliant: "No",
    patient_persona: "Older Adult"
  },
  {
    patient_id: "P-1010",
    patient_name: "De-identified Patient J",
    service_line: "Emergency Department",
    comment: "Nurse practitioner didn't double check my chart and almost administered the penicillin that I am severely allergic to. I had to point out the red allergy band on my wrist. This was a critical mistake!",
    visit_type: "Emergency",
    sentiment_score: 1,
    communication_rating: 3,
    follow_up_compliant: "Yes",
    patient_persona: "Patient with Disability"
  }
];

export const AGENT_CARDS = [
  {
    id: "agent_feedback",
    name: "Patient Feedback Insight Agent",
    role: "Clinical Communication Auditor",
    avatar: "https://lh3.googleusercontent.com/aida/AP1WRLv_yUqgEEUr_p0UdUVsm2mZycHEWDLg1hc746mFDyMhc6DZXFXsd6kQ_RezGlOfmDmO7rON0JZXgp0dgTckQgJZ-SQb3o3KDwTQ71ps8Ygwikor2x7YF0IE1vASW2I4yLHkB6j7shBcpSwgk_p705D1_CY82IDeV5EGCOlMri20_31eLmMtez2ZorwZp1osNbBIYGfsxdWG7v11Y6jnNvblrlQhOfc3gMoW6Uh9TGMLQQN7NZhwS9i-cyo",
    description: "Deep semantic analysis of patient comments, classifying primary themes and sentiment while auditing operational issues and bias concerns.",
    capabilities: [
      "Theme classification with reasoning",
      "Sentiment identification with quality-improvement tone",
      "Operational workflow issue flagging",
      "Equity, language, and physical accessibility safeguards"
    ]
  },
  {
    id: "agent_monitor",
    name: "Patient Experience Monitor",
    role: "Operational Compliance & Equity Officer",
    avatar: "https://lh3.googleusercontent.com/aida/AP1WRLvXUkJtmBJ-3L7weHI2X5vwbfuCRYIB0oMeOytlf76DxBziyhBhsE-H2D-Vs2vQQrrtDWH3FDayfYhp19dg5NRQ2o8ZzQ4oVcVLy7ARMMXs91e0Gzhk39YuFgUf1EtM-WBC55269QBa0R1Rdqg2c90gss0YOEamk1MG9mW-fCTC8NSrJJjItJCFuLQGYL8NBNwMmMwk1OkBeqr27N24jJrjH1mtJJz_Tzq-xj9qw1nSYuOIige1H1fZFlQ",
    description: "Evaluates feedback against institutional benchmarks, performing multi-tier risk assessment, clinical accessibility reviews, and managerial recommendations.",
    capabilities: [
      "Primary & secondary theme multi-mapping",
      "Advanced mixed-sentiment reconciliation",
      "Vulnerable cohort equity checks (older adults, rural, LEP)",
      "Organizational compliance and safety risk-level scoring"
    ]
  },
  {
    id: "agent_triage",
    name: "Complaint Triage Agent",
    role: "Risk Management & Routing Specialist",
    avatar: "https://lh3.googleusercontent.com/aida/AP1WRLtAevypCuHFrkPCoM82q6oa2SZP7TfyA8mIZYHdqKuo7U-gFehE3m33bAs3LwEsholoc76p9H3yerY2SldxaoE6cJIt2J8fpLJK5l9PbqQ8bwfcSxGldQOQWBLTTX7kFlBBMvUNPsfx4z13tv4HMB0bD3Wa9IH1KhhlwBiktLz1zsbE1YerYsQU9_RVqUgQ6XL_Pv5liUgpM_r6piQCKtUgtKdwjrbm-YUYry-OdFjFVoCLd1_kOOAbW40",
    description: "Reviews, prioritizes, and routes patient grievances. Automatically calculates severity levels, triggers risk alarms, and flags human-review compliance locks.",
    capabilities: [
      "Severity assessment (Level 1 Low to Level 4 Critical)",
      "High-risk patient safety & medical-malpractice threat alarms",
      "Escalation routing triggers for clinical leadership & risk depts",
      "Hardlocked human-review gating for high-liability cases"
    ]
  },
  {
    id: "agent_analytics",
    name: "Healthcare Analytics Agent",
    role: "Chief Executive Dashboard Architect",
    avatar: "https://lh3.googleusercontent.com/aida/AP1WRLtUWZAzEZtZHxGwrkCR2hePv8SqyqGuCprlIzaH2-ydQcBiOaJmg5-IkbyLkvqSHo6jKHtsHM6eXKD1OK0uyD0Mzwb2FkSsa7dHMr0CgQzqrk3K_1tRuS4ZA1xUmXPe1g_vGIySM27zOYNkybrGZJO89VFVLyxoRoV5T6heK3Shk1X0aeVjhbuL-kY7LiHROdIipjTSYW97p44DCt8ozMI3GAMW6E5MED0MFtKVvC8iC_Fmo0eaMPtbZNg",
    description: "Aggregates feedback data to construct interactive executive charts, tracking KPIs, patient personas, word distributions, bottlenecks, and clinical recommendations.",
    capabilities: [
      "Executive overview metrics (average satisfaction & compliance)",
      "Theme NLP distribution & hidden problem visualizations",
      "Vulnerable persona satisfaction variance monitoring",
      "AI agent opportunity recommendations & strategic action maps"
    ]
  }
];
