import {
    ClinicalCaseStatus,
    createEmptyMessage,
    MessageType,
} from "./ClinicalCase";
import type { ClinicalCase, EvidenceSnippet, Message } from "./ClinicalCase";

export const questions = [
    {
        section: "Ask for a Quick Fact",
        text: "What is the intravenous half-life of atropine?",
    },
    {
        section: "Ask for a Quick Fact",
        text: "When is high-dose atorvastatin indicated?",
    },
    {
        section: "Ask for a Quick Fact",
        text:
            "Can you explain the concept of the net state of immunosuppression?",
    },

    {
        section: "Write Home Care Instructions",
        text:
            "Provide discharge guidance for someone recovering from a mild ankle sprain, emphasizing RICE therapy, limits on activity, and follow-up needs.",
    },
    {
        section: "Write Home Care Instructions",
        text:
            "Prepare instructions for post-minor skin procedure care—cover cleaning, infection signs, showering, and timing of suture removal.",
    },
    {
        section: "Write Home Care Instructions",
        text:
            "Outline home management for a patient after a mild asthma flare, including inhaler technique, medication duration, and warning signs for emergency evaluation.",
    },

    {
        section: "Prepare For MOC Exams",
        text:
            "How should a 7-year-old with diarrhea and a stool test positive for Giardia be managed?",
    },
    {
        section: "Prepare For MOC Exams",
        text:
            "What is the best next step for a 60-year-old man presenting with chest pain, hypertension, and lateral ST-segment depression?",
    },
    {
        section: "Prepare For MOC Exams",
        text:
            "Identify the most likely organism causing meningitis in a 32-year-old woman with fever, headache, and neutrophilic CSF findings.",
    },

    {
        section: "Ask in a Language Other Than English",
        text:
            "¿De qué manera el PCP produce daño pulmonar en pacientes que no tienen VIH?",
    },
    {
        section: "Ask in a Language Other Than English",
        text:
            "Quelles sont les recommandations actuelles de l'ATS et de l'IDSA pour traiter l'histoplasmose ?",
    },

    {
        section: "Compute Common Formulas",
        text:
            "Given a serum calcium of 7.8 mg/dL and albumin of 2.5 g/dL, compute the corrected calcium and determine if hypocalcemia is present.",
    },
    {
        section: "Compute Common Formulas",
        text:
            "Determine the dexamethasone equivalent for a patient switching from 40 mg of prednisone daily.",
    },
    {
        section: "Compute Common Formulas",
        text:
            "With sodium 140 mEq/L, creatinine 2.0 mg/dL, urine sodium 50 mEq/L, and urine creatinine 100 mg/dL, calculate FENa and decide whether the AKI is prerenal or intrinsic.",
    },

    {
        section: "Double Check with a Quick Curbside Consult",
        text:
            "For a suspected meniscal tear, should knee MRI be ordered with or without contrast?",
    },
    {
        section: "Double Check with a Quick Curbside Consult",
        text:
            "After MRI and CT findings in a stroke patient, is CTA still indicated?",
    },
    {
        section: "Double Check with a Quick Curbside Consult",
        text:
            "In patients with atrial fibrillation and rapid ventricular response where EF is unknown, under what circumstances should diltiazem be avoided?",
    },

    {
        section: "Ask a Pop-Science Question",
        text:
            "Do artificial sweeteners taken long term raise the likelihood of metabolic diseases such as diabetes?",
    },
    {
        section: "Ask a Pop-Science Question",
        text:
            "Are GLP-1 receptor agonists associated with kidney protection in people with diabetes?",
    },
    {
        section: "Ask a Pop-Science Question",
        text:
            "Can adopting a ketogenic diet genuinely improve clinical outcomes?",
    },

    {
        section: "Ask about Treatment Options",
        text:
            "How is chronic heart failure with reduced ejection fraction typically managed?",
    },
    {
        section: "Ask about Treatment Options",
        text:
            "List current therapy options for stage IV non-small-cell lung carcinoma.",
    },
    {
        section: "Ask about Treatment Options",
        text:
            "How should recurrent *C. difficile* infection be managed after several antibiotic courses have failed?",
    },

    {
        section: "Write an Exam Question",
        text:
            "Design an MCQ testing understanding of beta-blockers' mechanisms of action.",
    },
    {
        section: "Write an Exam Question",
        text:
            "Formulate an exam item assessing antibiotic selection for pediatric otitis media.",
    },

    {
        section: "Ask about Treatment Alternatives",
        text:
            "Which antibiotics are suitable for cellulitis in a patient allergic to penicillin, cephalosporins, and Bactrim?",
    },
    {
        section: "Ask about Treatment Alternatives",
        text:
            "What are suitable replacements if metformin causes gastrointestinal intolerance?",
    },
    {
        section: "Ask about Treatment Alternatives",
        text:
            "Should ceftriaxone be avoided in someone with a known penicillin allergy?",
    },

    {
        section: "Ask about Drug Side Effects",
        text: "List the most frequent adverse effects of metformin.",
    },
    {
        section: "Ask about Drug Side Effects",
        text:
            "Are there severe or potentially fatal adverse effects linked to prolonged lisinopril use?",
    },
    {
        section: "Ask about Drug Side Effects",
        text:
            "Summarize common side effects of apixaban, especially in older adults or those with renal impairment.",
    },

    {
        section: "Calculate a Risk Score",
        text: "Compute the anion gap for a patient sample.",
    },
    {
        section: "Calculate a Risk Score",
        text:
            "Estimate the CHA₂DS₂-VASc score for a 72-year-old woman with hypertension, diabetes, and prior stroke.",
    },
    {
        section: "Calculate a Risk Score",
        text: "Determine the BMI of a person who is 6′2″ and weighs 190 lb.",
    },

    {
        section: "Ask for a Table",
        text:
            "Create a table showing how various risk factors contribute to ASCVD risk.",
    },

    {
        section: "Research a Topic",
        text:
            "Summarize recent progress in gene therapy for Duchenne muscular dystrophy.",
    },
    {
        section: "Research a Topic",
        text:
            "Describe Kawasaki disease, including its manifestations and standard treatments.",
    },
    {
        section: "Research a Topic",
        text:
            "Discuss current findings about gut microbiota involvement in autoimmune disorders.",
    },

    {
        section: "Ask about Drug Dosing",
        text:
            "What is the dosing regimen of methotrexate for adults with severe psoriasis?",
    },
    {
        section: "Ask about Drug Dosing",
        text:
            "How should ceftriaxone doses be modified in patients with significant renal dysfunction?",
    },

    {
        section: "Write a Prior Auth Letter",
        text:
            "Draft a prior-authorization request to Cigna for denosumab coverage for osteoporosis.",
    },
    {
        section: "Write a Prior Auth Letter",
        text:
            "Compose a prior-authorization letter to Kaiser requesting physical therapy approval after rotator cuff surgery.",
    },

    {
        section: "Ask for Evidence",
        text:
            "What clinical studies support choline supplementation during pregnancy?",
    },
    {
        section: "Ask for Evidence",
        text:
            "Summarize published data on bleeding risks associated with acalabrutinib.",
    },

    {
        section: "Ask about Guidelines",
        text:
            "Outline current IDSA guidance for treating multidrug-resistant *Pseudomonas* infections.",
    },
    {
        section: "Ask about Guidelines",
        text:
            "Provide a summary of AHA/ACC hypertension guidelines for patients with chronic kidney disease.",
    },
    {
        section: "Ask about Guidelines",
        text:
            "Highlight major updates in the 2024 ADA diabetes management guidelines.",
    },
    {
        section: "Ask about Guidelines",
        text:
            "According to ASCO, what are the current recommendations for immunotherapy use in triple-negative breast cancer?",
    },

    {
        section: "Ask about Primary Evidence",
        text:
            "What major trials underpin metformin's role as first-line therapy for type 2 diabetes?",
    },
    {
        section: "Ask about Primary Evidence",
        text:
            "Which randomized studies support using low-dose aspirin to prevent initial cardiovascular events?",
    },

    {
        section: "Construct a Workup",
        text:
            "Outline the appropriate evaluation for a patient with normal Pap but positive HPV-18.",
    },
    {
        section: "Construct a Workup",
        text: "Describe the diagnostic workup for hypercalciuria.",
    },
    {
        section: "Construct a Workup",
        text:
            "List the laboratory investigations recommended for stage 3b chronic kidney disease.",
    },

    {
        section: "Ask about Drug Interactions",
        text:
            "Identify potential interactions between grapefruit juice and atorvastatin.",
    },
    {
        section: "Ask about Drug Interactions",
        text:
            "Assess possible interactions among ritonavir, rosuvastatin, and apixaban given CYP3A4 inhibition.",
    },

    {
        section: "Ask About Labs to Consider",
        text:
            "Which lab tests are essential in assessing an acute heart-failure exacerbation?",
    },
    {
        section: "Ask About Labs to Consider",
        text:
            "What laboratory workup is indicated for a patient presenting with generalized weakness?",
    },
    {
        section: "Ask About Labs to Consider",
        text:
            "Which labs should be monitored in patients on amlodipine therapy?",
    },

    {
        section: "Write a Patient Handout",
        text:
            "Prepare a patient handout explaining how to control type 2 diabetes through lifestyle modification and medication adherence.",
    },
    {
        section: "Write a Patient Handout",
        text:
            "Write educational material for patients on the purpose and potential side effects of anticoagulants like warfarin.",
    },
    {
        section: "Write a Patient Handout",
        text:
            "Create a patient information sheet on recovery after knee replacement, covering exercises and precautions.",
    },

    {
        section: "Ask a Tough Question",
        text:
            "What factors influence the decision between immunotherapy and targeted therapy for metastatic melanoma with a BRAF mutation?",
    },
    {
        section: "Ask a Tough Question",
        text:
            "How would you optimize heart-failure therapy in a patient with reduced EF, CKD, and recurrent hyperkalemia?",
    },
    {
        section: "Ask a Tough Question",
        text:
            "How should clinicians weigh anticoagulation risks and benefits in an elderly patient with AF, frequent falls, and a recent GI bleed?",
    },
];

// Sample Clinical Case: Complex Heart Failure with Multiple Comorbidities (revised)
export const clinical_case = {
    case_id: "case_heart_failure_2024_001",
    status: ClinicalCaseStatus.COMPLETED,
    title:
        "Complex Heart Failure with Reduced Ejection Fraction in Elderly Patient with Multiple Comorbidities",

    evidence_snippets: [
        {
            snippet_id: "evid_001",
            text:
                "Patient: 78-year-old male with history of ischemic cardiomyopathy, EF 25%, diabetes mellitus type 2, chronic kidney disease stage 3a, and atrial fibrillation. Presents with 3-day history of progressive dyspnea, orthopnea, and bilateral lower extremity edema. Physical exam reveals: BP 145/90, HR 110 irregular, JVD elevated, bilateral rales, S3 gallop, 2+ pitting edema bilaterally. Labs: BNP 850 pg/mL, creatinine 1.8 mg/dL, eGFR 35 mL/min/1.73m², sodium 138 mEq/L, potassium 4.2 mEq/L.",
            source_id: "clinical_note_001",
            source_type: "clinical_note",
            source_citation: "Emergency Department Clinical Note - Dr. X, MD",
            created_at: "2024-01-15T08:30:00Z",
        },
        {
            snippet_id: "evid_002",
            text:
                "Echocardiogram findings: Left ventricular ejection fraction 25%, severe global hypokinesis, moderate mitral regurgitation, moderate tricuspid regurgitation, estimated pulmonary artery systolic pressure 45 mmHg, left atrial enlargement (LA volume index 45 mL/m²). No pericardial effusion. Right ventricular function mildly reduced.",
            source_id: "echo_001",
            source_type: "diagnostic_test",
            source_citation: "Echocardiogram Report - Dr. X, MD",
            created_at: "2024-01-15T10:15:00Z",
        },
        {
            snippet_id: "evid_003",
            text:
                "Current medications: Metformin 1000mg BID, Lisinopril 10mg daily, Metoprolol succinate 50mg daily, Furosemide 40mg daily, Apixaban 5mg BID, Atorvastatin 40mg daily. Patient reports good adherence to medications. No known drug allergies.",
            source_id: "med_list_001",
            source_type: "medication_list",
            source_citation: "Pharmacy Records - CVS Pharmacy #1234",
            created_at: "2024-01-15T09:00:00Z",
        },
        {
            snippet_id: "evid_004",
            text:
                "2023 AHA/ACC/HFSA Heart Failure Guideline Update: For patients with HFrEF, quadruple therapy with ACE inhibitor/ARB, beta-blocker, MRA, and SGLT2 inhibitor is recommended. SGLT2 inhibitors (dapagliflozin, empagliflozin) are now recommended for all patients with HFrEF regardless of diabetes status. ARNI (sacubitril-valsartan) is preferred over ACE inhibitor for patients with HFrEF who are tolerating ACE inhibitor or ARB therapy.",
            source_id: "10.1161/CIR.0000000000001063",
            source_type: "clinical_guideline",
            source_url:
                "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001063",
            source_citation:
                "Heidenreich PA, et al. 2022 AHA/ACC/HFSA Heart Failure Guideline. Circulation. 2022;145:e895-e1032.",
            created_at: "2024-01-15T11:00:00Z",
        },
        {
            snippet_id: "evid_005",
            text:
                "DAPA-HF Trial Results: Dapagliflozin reduced the risk of cardiovascular death or worsening heart failure by 26% (HR 0.74, 95% CI 0.65-0.85, p<0.001) in patients with HFrEF, regardless of diabetes status. The number needed to treat to prevent one primary outcome event was 21 patients over 2.3 years. Safety profile was favorable with no increase in adverse events.",
            source_id: "31535829",
            source_type: "pubmed",
            source_url: "https://pubmed.ncbi.nlm.nih.gov/31535829/",
            source_citation:
                "McMurray JJV, et al. Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction. N Engl J Med. 2019;381:1995-2008.",
            created_at: "2024-01-15T11:30:00Z",
        },
        {
            snippet_id: "evid_006",
            text:
                "PARADIGM-HF Trial: Sacubitril-valsartan (ARNI) reduced cardiovascular death or heart failure hospitalization by 20% compared to enalapril (HR 0.80, 95% CI 0.73-0.87, p<0.001) in patients with HFrEF. The benefit was consistent across all subgroups including elderly patients and those with CKD. ARNI was associated with higher rates of hypotension but lower rates of hyperkalemia and renal dysfunction.",
            source_id: "25107801",
            source_type: "pubmed",
            source_url: "https://pubmed.ncbi.nlm.nih.gov/25107801/",
            source_citation:
                "McMurray JJV, et al. Angiotensin-Neprilysin Inhibition versus Enalapril in Heart Failure. N Engl J Med. 2014;371:993-1004.",
            created_at: "2024-01-15T12:00:00Z",
        },
        {
            snippet_id: "evid_007",
            text:
                "Laboratory results from admission: Hemoglobin 11.2 g/dL, hematocrit 33.5%, WBC 8.2 K/μL, platelets 245 K/μL. Comprehensive metabolic panel: glucose 145 mg/dL, BUN 28 mg/dL, creatinine 1.8 mg/dL, eGFR 35 mL/min/1.73m², sodium 138 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, CO2 24 mEq/L, calcium 9.1 mg/dL, phosphorus 3.8 mg/dL, magnesium 1.9 mg/dL. Liver function tests within normal limits.",
            source_id: "labs_001",
            source_type: "laboratory_results",
            source_citation: "Laboratory Results - Quest Diagnostics",
            created_at: "2024-01-15T09:30:00Z",
        },
        {
            snippet_id: "evid_008",
            text:
                "Chest X-ray findings: Cardiomegaly with cardiothoracic ratio of 0.65, bilateral pleural effusions (small to moderate), pulmonary vascular congestion, no acute pulmonary edema. No pneumothorax or pneumonia. Bony structures unremarkable.",
            source_id: "cxr_001",
            source_type: "diagnostic_test",
            source_citation: "Chest X-ray Report - Dr. X, MD",
            created_at: "2024-01-15T09:45:00Z",
        },
        {
            snippet_id: "evid_009",
            text:
                "2024 ADA Standards of Care: For patients with diabetes and heart failure, SGLT2 inhibitors are recommended as first-line therapy for cardiovascular protection. Metformin remains the preferred first-line agent for diabetes management but should be used cautiously in patients with eGFR <30 mL/min/1.73m². Consider dose reduction or discontinuation if eGFR <30.",
            source_id: "ada_2024_guidelines",
            source_type: "clinical_guideline",
            source_url:
                "https://diabetesjournals.org/care/issue/47/Supplement_1",
            source_citation:
                "American Diabetes Association. Standards of Care in Diabetes—2024. Diabetes Care. 2024;47(Suppl. 1):S1-S212.",
            created_at: "2024-01-15T13:00:00Z",
        },
        {
            snippet_id: "evid_010",
            text:
                "Patient's social history: Lives alone in single-story home, independent with ADLs, has home health aide 3x/week for assistance with medication management and transportation. Family history significant for father with MI at age 65, mother with diabetes. Social support from adult daughter who lives 30 minutes away. Patient is a retired engineer, former smoker (quit 15 years ago, 30 pack-year history).",
            source_id: "social_hx_001",
            source_type: "clinical_note",
            source_citation:
                "Social History Assessment - Nurse Practitioner Lisa Wang, NP",
            created_at: "2024-01-15T14:00:00Z",
        },
    ] as EvidenceSnippet[],

    messages: [
        // user
        createEmptyMessage(
            "user_001",
            MessageType.USER,
            "I have a 78-year-old male patient with heart failure, diabetes, and kidney disease who presented with acute decompensation. His EF is 25% and he's currently on lisinopril, metoprolol, and furosemide. \n\nBP 145/90, HR 110 irregular, JVD elevated, bilateral rales, S3 gallop, 2+ pitting edema bilaterally. Labs: BNP 850 pg/mL, creatinine 1.8 mg/dL, eGFR 35 mL/min/1.73m², sodium 138 mEq/L, potassium 4.2 mEq/L.\n\nLeft VEF 25%, severe global hypokinesis, MMR, estimated pasp 45 mmHg, LA 45 mL/m².\n\nWhat's the best approach for optimizing his heart failure therapy?",
        ),

        // system + tools (unchanged)
        createEmptyMessage(
            "system_001",
            MessageType.SYSTEM,
            "",
            {
                event_name: "agent_thinking",
                agent_id: "cardiology_agent",
                status: "analyzing_case",
            },
            "thinking",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "cardiology_agent",
            MessageType.AGENT,
            "I'll analyze this complex heart failure case. Based on the patient's profile—elderly male with HFrEF (EF 25%), diabetes, CKD stage 3a, and atrial fibrillation—I will align recommendations with contemporary guidelines and trials. <cite>evid_001</cite> <cite>evid_002</cite> <cite>evid_004</cite>",
            {
                agent_name: "Cardiology Agent",
            },
            "planning",
        ),

        createEmptyMessage(
            "system_002",
            MessageType.SYSTEM,
            "",
            {
                event_name: "tool_calling",
                tool_name: "guideline_search",
                parameters: {
                    condition: "heart_failure_reduced_ef",
                    year: "2023",
                },
            },
            "planning",
        ),

        createEmptyMessage(
            "guideline_tool",
            MessageType.TOOL,
            "Retrieved 2023 AHA/ACC/HFSA Heart Failure Guidelines. Key recommendations for HFrEF include quadruple therapy: ACE inhibitor/ARB, beta-blocker, MRA, and SGLT2 inhibitor. For patients with diabetes and HFrEF, SGLT2 inhibitors are now first-line. ARNI (sacubitril-valsartan) is preferred over ACE inhibitor when tolerated.",
            { 
                tool_name: "Guideline Search",
                tool_parameters: {
                    condition: "heart_failure_reduced_ef",
                    year: "2023",
                },
                tool_response: { guidelines_found: 5, key_recommendations: 12 } 
            },
            "tooling",
        ),

        createEmptyMessage(
            "system_003",
            MessageType.SYSTEM,
            "",
            {
                event_name: "tool_calling",
                tool_name: "evidence_search",
                parameters: {
                    drug: "dapagliflozin",
                    condition: "heart_failure",
                },
            },
            "tooling",
        ),

        createEmptyMessage(
            "evidence_tool",
            MessageType.TOOL,
            "Found DAPA-HF trial results: Dapagliflozin reduced CV death or HF hospitalization by 26% (HR 0.74, 95% CI 0.65-0.85) in HFrEF patients regardless of diabetes status. NNT was 21 patients over 2.3 years. Safety profile was favorable.",
            {
                tool_name: "Trial Search",
                tool_parameters: {
                    drug: "dapagliflozin",
                    condition: "heart_failure",
                },
                tool_response: {
                    trials_found: 3,
                    primary_outcome: "CV death or HF hospitalization",
                    hazard_ratio: 0.74,
                },
            },
            "tooling",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "cardiology_agent",
            MessageType.AGENT,
            "The evidence supports adding a SGLT2 inhibitor (e.g., dapagliflozin) now; renal function is adequate (eGFR 35) for initiation with standard dosing. I will review renal dosing and contraindications next. <cite>evid_005</cite> <cite>evid_007</cite> <cite>evid_009</cite>",
            {
                agent_name: "Cardiology Agent",
            },
            "planning",
        ),

        createEmptyMessage(
            "system_004",
            MessageType.SYSTEM,
            "",
            {
                event_name: "tool_calling",
                tool_name: "drug_interaction_checker",
                parameters: {
                    medications: [
                        "lisinopril",
                        "metoprolol",
                        "furosemide",
                        "dapagliflozin",
                    ],
                    patient_conditions: [
                        "CKD_stage_3a",
                        "diabetes",
                        "atrial_fibrillation",
                    ],
                },
            },
            "planning",
        ),

        createEmptyMessage(
            "pharmacy_tool",
            MessageType.TOOL,
            "Drug interaction analysis complete. Dapagliflozin is safe in CKD stage 3a (eGFR ≥30). No significant interactions with current medications. Consider monitoring for volume depletion with furosemide. ARNI (sacubitril-valsartan) would require stopping lisinopril first due to ACE inhibitor overlap.",
            {
                tool_name: "Drug Interaction Checker",
                tool_parameters: {
                    medications: [
                        "lisinopril",
                        "metoprolol",
                        "furosemide",
                        "dapagliflozin",
                    ],
                    patient_conditions: [
                        "CKD_stage_3a",
                        "diabetes",
                        "atrial_fibrillation",
                    ],
                },
                tool_response: {
                    interactions_found: 0,
                    warnings: 1,
                    recommendations: 3,
                },
            },
            "tooling",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "nephrology_agent",
            MessageType.AGENT,
            "Agree with SGLT2 initiation; data suggest renal and cardiovascular benefit in HFrEF. For ARNI, efficacy persists in CKD stage 3, but we should watch blood pressure and potassium closely. <cite>evid_005</cite> <cite>evid_006</cite> <cite>evid_007</cite>",
            {
                agent_name: "Nephrology Agent",
            },
            "planning",
        ),

        createEmptyMessage(
            "system_005",
            MessageType.SYSTEM,
            "",
            {
                event_name: "tool_calling",
                tool_name: "trial_subgroup_analysis",
                parameters: {
                    trial: "PARADIGM-HF",
                    subgroup: "CKD_stage_3",
                    outcome: "safety_efficacy",
                },
            },
            "planning",
        ),

        createEmptyMessage(
            "trial_analysis_tool",
            MessageType.TOOL,
            "PARADIGM-HF subgroup analysis for CKD stage 3 patients (eGFR 30-60): ARNI showed consistent benefit with 18% reduction in CV death or HF hospitalization (HR 0.82, 95% CI 0.70-0.96). Safety profile acceptable with higher rates of hypotension (8.2% vs 5.8%) but lower hyperkalemia (11.2% vs 13.6%). No increase in renal adverse events.",
            {
                tool_name: "Trial Subgroup Analysis",
                tool_parameters: {
                    trial: "PARADIGM-HF",
                    subgroup: "CKD_stage_3",
                    outcome: "safety_efficacy",
                },
                tool_response: {
                    subgroup_size: 1856,
                    primary_outcome_hr: 0.82,
                    safety_events: "acceptable",
                },
            },
            "tooling",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "cardiology_agent",
            MessageType.AGENT,
            "Stepwise plan: (1) Add dapagliflozin 10 mg daily; (2) Transition from lisinopril to ARNI after washout; (3) Up-titrate beta-blocker to target as tolerated; (4) Consider MRA once potassium is stable. This aligns with guideline-directed quadruple therapy. <cite>evid_004</cite> <cite>evid_005</cite> <cite>evid_006</cite> <cite>evid_003</cite>",
            {
                agent_name: "Cardiology Agent",
            },
            "planning",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "endocrinology_agent",
            MessageType.AGENT,
            "From a diabetes standpoint, dapagliflozin is appropriate and confers CV/renal benefit. Keep metformin given current eGFR, and monitor for rare euglycemic DKA; check ketones with concerning symptoms. <cite>evid_009</cite> <cite>evid_005</cite> <cite>evid_007</cite>",
            {
                agent_name: "Endocrinology Agent",
            },
            "planning",
        ),

        createEmptyMessage(
            "system_006",
            MessageType.SYSTEM,
            "",
            {
                event_name: "tool_calling",
                tool_name: "dosing_calculator",
                parameters: {
                    drug: "dapagliflozin",
                    eGFR: 35,
                    weight: 85,
                    age: 78,
                },
            },
            "planning",
        ),

        createEmptyMessage(
            "dosing_tool",
            MessageType.TOOL,
            "Dapagliflozin dosing calculation: Standard dose 10mg daily is appropriate for eGFR ≥30. No dose adjustment needed for this patient's renal function. Monitor for volume depletion, especially with concurrent furosemide. Consider reducing furosemide if patient becomes volume depleted.",
            {
                tool_name: "Dosing Calculator",
                tool_parameters: {
                    drug: "dapagliflozin",
                    eGFR: 35,
                    weight: 85,
                    age: 78,
                },
                tool_response: {
                    recommended_dose: "10mg daily",
                    adjustments_needed: "none",
                    monitoring_required: ["volume_status", "electrolytes"],
                },
            },
            "tooling",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "pharmacy_agent",
            MessageType.AGENT,
            "Medication optimization: current regimen lacks SGLT2 inhibitor and MRA. For ARNI transition, stop lisinopril for 36 hours before initiating sacubitril-valsartan (e.g., 24/26 mg BID, titrate as tolerated). Monitor BP and potassium during up-titration. <cite>evid_004</cite> <cite>evid_006</cite> <cite>evid_003</cite>",
            {
                agent_name: "Pharmacy Agent",
            },
            "planning",
        ),

        createEmptyMessage(
            "system_007",
            MessageType.SYSTEM,
            "",
            {
                event_name: "tool_calling",
                tool_name: "contraindication_checker",
                parameters: {
                    drug: "spironolactone",
                    conditions: ["CKD_stage_3a", "hyperkalemia_risk"],
                    current_meds: ["lisinopril", "dapagliflozin"],
                },
            },
            "planning",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "contraindication_tool",
            MessageType.TOOL,
            "MRA check: not contraindicated at eGFR 35; consider eplerenone or defer MRA until after ARNI optimization and potassium monitoring given hyperkalemia risk.",
            {
                tool_name: "Contraindication Checker",
                tool_parameters: {
                    drug: "spironolactone",
                    conditions: ["CKD_stage_3a", "hyperkalemia_risk"],
                    current_meds: ["lisinopril", "dapagliflozin"],
                },
                tool_response: {
                    contraindicated: false,
                    risk_level: "moderate",
                    alternatives: ["eplerenone", "defer_until_stable"],
                },
            },
            "tooling",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "cardiology_agent",
            MessageType.AGENT,
            "Final recommendation before summary: add dapagliflozin 10 mg daily; switch from lisinopril to sacubitril-valsartan after 36-hour washout; optimize metoprolol toward target dose; defer MRA until potassium consistently <5.0 mEq/L; close follow-up in ~2 weeks. <cite>evid_004</cite> <cite>evid_005</cite> <cite>evid_006</cite> <cite>evid_009</cite> <cite>evid_002</cite> <cite>evid_007</cite>",
            {
                agent_name: "Cardiology Agent",
            },
            "planning",
        ),

        createEmptyMessage(
            "system_008",
            MessageType.SYSTEM,
            "",
            {
                event_name: "system_notification",
                status: "analysis_complete",
                summary:
                    "Multi-agent analysis completed with consensus on quadruple therapy approach",
            },
            "summarizing",
        ),

        // NEW: FINAL answer to the user's first question (explicit, stage: "final")
        createEmptyMessage(
            "msg_final_001",
            MessageType.AGENT,
            "Comprehensive plan to optimize heart failure therapy (HFrEF, EF 25%, diabetes, CKD3a, AF):\n\n" +
              "## Assessment & goals:\n" +
              "- The presentation (dyspnea/orthopnea/edema, JVD, rales, S3) with EF 25% and CKD3a is consistent with acute decompensated HFrEF on sub-optimal GDMT. <cite>evid_001</cite> <cite>evid_002</cite> <cite>evid_007</cite>\n" +
              "- Therapeutic goals: relieve congestion, initiate/optimize disease-modifying therapy (quadruple therapy), minimize renal/electrolyte complications, and reduce readmission/CV death risk. <cite>evid_004</cite>\n\n" +
              "## Stepwise disease-modifying therapy:\n" +
              "1) Start SGLT2 inhibitor now — dapagliflozin 10 mg once daily. Kidney function is adequate (eGFR 35), and benefits extend regardless of diabetes status; monitor for volume depletion given concurrent loop diuretic. <cite>evid_005</cite> <cite>evid_009</cite> <cite>evid_007</cite>\n" +
              "2) Transition ACEi → ARNI — stop lisinopril and observe a 36-hour washout, then start sacubitril/valsartan 24/26 mg BID, uptitrating as tolerated (target per BP/renal status). ARNI is preferred over ACEi in HFrEF and demonstrated superior outcomes. <cite>evid_004</cite> <cite>evid_006</cite>\n" +
              "3) Beta-blocker optimization — continue metoprolol succinate and uptitrate toward target as tolerated with HR/BP guidance (e.g., q2–4 weeks). This provides mortality and hospitalization benefit in HFrEF. <cite>evid_004</cite>\n" +
              "4) Consider MRA — once potassium is <5.0 mEq/L and renal function remains stable, add an MRA (consider eplerenone if hyperkalemia risk is a concern). With CKD3a (eGFR 35), MRA is not absolutely contraindicated but requires close K/Cr monitoring. <cite>evid_004</cite> <cite>evid_007</cite>\n\n" +
              "## Congestion management & safety net:\n" +
              "- Continue loop diuretic with daily weights and adjust to euvolemia; watch for SGLT2-related volume shifts. Check BMP within 3–7 days after changes. <cite>evid_007</cite> <cite>evid_005</cite>\n" +
              "- During ACEi→ARNI transition, monitor BP, renal function, and potassium closely; counsel on hypotension symptoms. <cite>evid_006</cite> <cite>evid_004</cite>\n\n" +
              "## Diabetes and CKD co-management:\n" +
              "- Maintain metformin at current dose if clinically appropriate; reassess if eGFR declines toward <30. SGLT2 therapy provides CV/renal protection in diabetes with HF. <cite>evid_009</cite> <cite>evid_005</cite>\n" +
              "- For CKD3a, reinforce sick-day rules (hold SGLT2 if poor intake/prolonged fasting/acute illness); monitor electrolytes and renal function during uptitrations. <cite>evid_009</cite> <cite>evid_007</cite>\n\n" +
              "## AF and background therapy:\n" +
              "- Continue anticoagulation (apixaban on board) and statin for ischemic disease as per current regimen; review doses with renal function trends. <cite>evid_003</cite> <cite>evid_007</cite>\n\n" +
              "## Follow-up & monitoring plan:\n" +
              "- Labs: BMP (K/Cr/eGFR/Na) in 3–7 days after SGLT2 start and after ARNI initiation/titrations; repeat with any dose change or symptom shift. <cite>evid_007</cite>\n" +
              "- Clinic review in ~2 weeks to up-titrate ARNI and beta-blocker if stable; reassess volume status, BP, HR, symptoms, and weight trajectory. <cite>evid_004</cite>\n" +
              "- Education: daily weights, salt/fluid guidance, hypotension and dehydration red-flags, rare euglycemic DKA symptoms (seek care if nausea/vomiting/abdominal pain). <cite>evid_009</cite> <cite>evid_005</cite>\n\n" +
              "## Why this plan:\n" +
              "- It implements guideline-directed quadruple therapy for HFrEF with evidence of reduced CV death and HF hospitalization (DAPA-HF, PARADIGM-HF) and guideline preference for ARNI over ACEi when feasible, tailored to this patient's EF 25% and CKD3a. <cite>evid_004</cite> <cite>evid_005</cite> <cite>evid_006</cite> <cite>evid_002</cite> <cite>evid_007</cite>",
            { agent_name: "Review Agent" },
            "final"
          ),
    ] as Message[],

    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T15:30:00Z",
} as ClinicalCase;
