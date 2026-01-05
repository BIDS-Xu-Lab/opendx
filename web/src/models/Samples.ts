import {
    ClinicalCaseStatus,
    createEmptyMessage,
    MessageType,
} from "./ClinicalCase";
import type { ClinicalCase, EvidenceSnippet, Message } from "./ClinicalCase";

export const questions = [
    {
        section: "Ask a Tough Question",
        text: `A 78-year-old woman presented to the emergency department with a sore throat. She reported painful swallowing and a sensation of something stuck in her throat that had gradually developed over the course of the day. She denied having ingested a foreign body. She had no fever, congestion, cough, dyspnea, dysphagia, or prior similar episodes.

Her past medical history was notable for hypertension, hyperlipidemia, diabetes, and hypothyroidism. Ten years earlier, she had undergone anterior cervical spine fusion. On arrival, her vital signs were: blood pressure 168/77 mmHg, pulse 90 beats/min, respiratory rate 16 breaths/min, and temperature 36.8 °C. Examination revealed normal neck range of motion but tenderness along the mid-anterior neck without edema, mass, thyroid enlargement, or posterior oropharyngeal abnormality. She exhibited no stridor, hoarseness, drooling, sublingual swelling, or respiratory distress. Neurological examination was intact. The clinician noted she felt warm to the touch, and a repeat temperature check was ordered along with a soft tissue neck radiograph to evaluate the prior hardware and surrounding structures.

Shortly after arrival, the patient developed rigors, and repeat vitals showed fever. Given the combination of odynophagia, anterior neck tenderness, and new fever, laboratory evaluation was obtained. Results showed a WBC count of 26.3 × 10³/μL and lactate 2.1 mmol/L. The soft tissue neck radiograph was read as normal by the radiologist, but the treating physician noted possible prevertebral widening, hardware displacement, and a questionable air–fluid level, raising concern for a deep neck infection. Empiric antibiotics and antipyretics were started.

CT neck with intravenous contrast demonstrated a peripherally enhancing fluid collection in the prevertebral space extending from C4/C5 to T1, measuring 2.4 × 1.5 × 4.2 cm. The collection was associated with surrounding inflammatory changes, small locules of gas within the prevertebral compartment, and retraction of the right C6 anterior plate screw compared to prior imaging. Inflammatory changes extended laterally toward the carotid spaces. The impression was of a prevertebral abscess potentially related to cervical hardware complications. Neurosurgery, otolaryngology, and cardiothoracic surgery were consulted.

Magnetic resonance imaging confirmed the prevertebral fluid collection and soft tissue changes but did not show vertebral body destruction or spinal canal involvement. A bedside nasopharyngeal scope revealed no mucosal lesions, and a fluoroscopic esophagram did not demonstrate a definite leak.

The patient was taken to the operating room for irrigation and drainage of the prevertebral collection and removal of the cervical plate hardware. During surgery, a defect in the adjacent soft tissue planes was repaired. Cultures grew Streptococcus salivarius vestibularis, Streptococcus viridans, and Corynebacterium species. The patient was admitted to the ICU and discharged six days later, neurologically intact, with a peripherally inserted central catheter for continued intravenous antibiotics.

Figure 1. Soft tissue neck radiograph with prevertebral soft tissue prominence extending from C3 to T1. Red arrow: anterior cervical screw retraction. Blue arrow: subtle air–fluid interface in the prevertebral region.

Figure 2. Contrast-enhanced CT neck showing a rim-enhancing prevertebral fluid collection extending from C4/C5 to T1, with associated inflammatory changes extending into the carotid spaces. Retraction of the right C6 anterior plate screw is also noted. Arrow: area of fluid collection.`
    },
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
    }
];

// Sample Clinical Case: Complex Heart Failure with Multiple Comorbidities (revised)
export const clinical_cases = [
{
    case_id: "case_facial_swelling_aftercare",
    status: ClinicalCaseStatus.COMPLETED,
    title: "Facial Swelling Aftercare",

    evidence_snippets: [
    {
        snippet_id: "1",
        text:
            "Vlachodimitropoulos A, Gatsounia A, Danielides G, Dafni C, Lygeros S. Bilateral Peritonsillar Abscess Secondary to Infectious Mononucleosis. Cureus. 2025 Sep 22;17(9):e92958. doi: 10.7759/cureus.92958. PMID: 41133070; PMCID: PMC12543371.",
        source_id: "41133070",
        source_type: "pubmed",
        source_citation: "Vlachodimitropoulos A, Gatsounia A, Danielides G, Dafni C, Lygeros S. Bilateral Peritonsillar Abscess Secondary to Infectious Mononucleosis. Cureus. 2025 Sep 22;17(9):e92958. doi: 10.7759/cureus.92958. PMID: 41133070; PMCID: PMC12543371.",
        created_at: "2024-01-15T08:30:00Z",
    },
    {
        snippet_id: "2",
        text: "A 19-year-old transgender adolescent on hormonal therapy with a history of recent hospitalization for exudative tonsillitis presented with worsening sore throat, dysphagia, fever, and a diffuse, generalized macular rash involving the back, face, abdomen, arms, and legs. Despite prior antibiotic treatment with amoxicillin, her symptoms recurred, prompting further evaluation. Laboratory findings revealed leukocytosis with lymphocytic and monocytic predominance, elevated inflammatory markers, and a positive Epstein-Barr virus (EBV) test, confirming infectious mononucleosis. Imaging demonstrated persistent tonsillitis without abscess formation, and additional testing identified concurrent herpes simplex virus (HSV)-1 oral ulcers. Given persistent fevers and systemic inflammation, hemophagocytic lymphohistiocytosis (HLH) was considered but not confirmed. Management included IV clindamycin for tonsillitis, corticosteroids for airway inflammation, and doxycycline for atypical pneumonia. Over the 10-day hospitalization, the patient showed gradual improvement, with resolution of the rash and all other symptoms. The rash was ultimately diagnosed as an amoxicillin-induced rash associated with EBV infection. This case highlights the importance of recognizing amoxicillin-induced rash in EBV infection and distinguishing it from allergic reactions and other common rashes, including but not limited to scarlet fever, viral exanthem, drug reactions, and HLH. Although various skin rashes are common in the transgender population, a literature review found no evidence linking amoxicillin-induced EBV rash to transgender patients. Accurate diagnosis aids in the appropriate selection of antimicrobial therapy and helps avoid unnecessary antibiotic restrictions due to misattributed allergic reactions.",
        source_id: "40786360",
        source_type: "pubmed",
        source_citation: "Gujar AA, Pernudi K, Adeyinka A, Kondamudi N. Epstein-Barr Virus (EBV) Masquerading as Exudative Tonsillitis and Rash in a Transgender Adolescent. Cureus. 2025 Jul 11;17(7):e87737. doi: 10.7759/cureus.87737. PMID: 40786360; PMCID: PMC12335877.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "3",
        text:
            "Infectious mononucleosis (IM), caused by the Epstein-Barr virus (EBV), is primarily a self-limiting illness. However, it often mimics bacterial infections, such as bacterial tonsillitis, which can represent a diagnostic pitfall and, consequently, increase the risk of developing complications. The aim of this case report is to highlight the complications resulting from the incorrect differential diagnosis of EBV-induced IM and its clinical significance. We present the case of a 24-year-old male who was initially misdiagnosed with bacterial tonsillitis. Amoxicillin-clavulanic acid was initiated for treatment, after which he developed a widespread maculopapular rash. Acute EBV infection was diagnosed via serological tests. His condition improved following the discontinuation of antibiotic therapy and the administration of supportive symptomatic treatment. This case underscores the critical need for careful differential diagnosis between viral and bacterial tonsillitis. It demonstrates that an amoxicillin-clavulanic acid-induced rash can serve as an important clue for underlying EBV infection, thereby preventing unnecessary antibiotic use and enabling the correct direction of investigation and management.",
        source_id: "40895910",
        source_type: "pubmed",
        source_citation: "Chaprava T, Ostatishvili K, Kirtadze N, Goginava A, Tabatadze I. Amoxicillin-Clavulanic Acid-Induced Rash in Epstein-Barr Virus Infection: A Case Report of a Diagnostic Pitfall in a 24-Year-Old Male. Cureus. 2025 Jul 29;17(7):e89023. doi: 10.7759/cureus.89023. PMID: 40895910; PMCID: PMC12398297.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "4",
        text: `Background: Lymphadenopathy refers to any disease process involving lymph nodes that are abnormal in size and consistency. There are multiple etiologies in the setting of a diseased lymph node, including conditions of infection, autoimmune diseases, and neoplasia. Lymphadenitis is a term that refers to lymphadenopathies that are due to inflammatory processes and can represent an acute bacterial infection resulting from streptococcal pharyngitis or a prior viral upper respiratory infection. Cervical lymphadenopathy refers to nodal swelling in the neck region. While cervical lymphadenitis is a common clinical finding in the setting of a transient response to a benign local or generalized infection, it may evade detection sometimes and thus account for a percentage of misdiagnosis or delayed diagnosis in the tropics. This case report is aimed at increasing the awareness about the presentation of bacterial cervical lymphadenitis and how it can sometimes mimic the presentation that is typical and regularly found with plasmodiasis. It contributes to improved awareness and high index of suspicion in clinic when dealing with patients in the tropics.

Case presentation: We present a case of delayed diagnosis of bacterial cervical lymphadenitis that initially presented with typical features of malaria from Plasmodium falciparum. A 26-year-old Nigerian woman presented to the outpatient department following complaints of a recurring fever of a month's duration and bilateral neck swelling of about 2 weeks prior to presentation.

Conclusion: In the setting of a busy clinic, details are easily missed and salient features in the presentation of a patient that are needed for accurate diagnosis and management could go unrecognized. Hence, this case report highlights the importance of proper examination particularly of lymph nodes and use of different diagnostic modalities for the exact diagnosis of disease.

Keywords: Cervical; Delayed diagnosis; Fine needle aspiration cytology (FNAC); Lymphadenitis; Lymphadenopathy; Neck swelling.`,
        source_id: "36755272",
        source_type: "pubmed",
        source_citation: "Olaniyi O, Ayotunde O, Christabel T, Idowu O. Delayed diagnosis of bacterial cervical lymphadenitis in the tropics: a case report. J Med Case Rep. 2023 Feb 9;17(1):41. doi: 10.1186/s13256-023-03773-9. PMID: 36755272; PMCID: PMC9909935.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "5",
        text:
            "Necrotizing lymphadenitis (NL) is a rare entity that can occur as a complication of bacterial cervical lymphadenitis (CL) and is characterized by unilateral or bilateral cervical lymphadenopathy. NL most commonly presents in females and most reports have been in Japan. In this case, we present a 37-year-old male with no significant past medical history who presented with an unusual presentation and clinical course of NL. Initial workup for Epstein-Barr Virus (EBV) and other infectious etiology was negative. Yet, aspiration later revealed Group A Streptococcus. When the patient's pain and swelling did not subside with the initial antibiotic and supportive treatment, the patient underwent a repeat aspiration and biopsy that revealed a necrotic mass or lymph node. NL is uncommon and rarely due to infectious etiology. However, this marks a case in which a Group A Streptococcus was shown to be associated with subsequent necrotic lymph nodes and should allow practitioners to further consider an infectious etiology in the differential diagnosis of NL.",
        source_id: "36793849",
        source_type: "pubmed",
        source_citation: "De Paz N, Pupo A, Frankel LR, Roorda SL, Hernandez R. Group A Streptococcus Necrotizing Lymphadenitis: A Case Report. Cureus. 2023 Jan 12;15(1):e33699. doi: 10.7759/cureus.33699. PMID: 36793849; PMCID: PMC9925034.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "6",
        text: `Objective: To identify patient and hospital characteristics associated with the choice of treatment for pediatric patients who present in the acute setting with peritonsillar abscess/cellulitis (PTA/PTC).

Study design: A retrospective cohort study was performed using Healthcare Cost and Utilization Project emergency department, ambulatory, and inpatient state databases for the years 2010 and 2011. Children aged 0 to 17 years were identified using International Classification of Diseases, Ninth Revision, Clinical Modification (ICD-9-CM) diagnosis code for PTA/PTC. The main outcome of interest was treatment received, which included medical therapy alone, incision and drainage (IND) or tonsillectomy. Multiple logistic regression analyses were conducted to model non-clinical factors associated with treatment received after adjusting for age, hospital state, race, primary expected payer, existing chronic condition(s), and type of hospital.

Results: We identified 2994 patients who presented with PTA/PTC. The most common treatment choice was medical therapy alone (30.8%), followed by IND (30.5%) and tonsillectomy (9.4%). There were significant associations between treatment choice and race, primary payer status, and type of hospital (P < .05). We found that Hispanic patients, those with Medicaid as their primary expected payer, and those treated at a designated children's hospital were 3 nonclinical factors independently associated with an increase in likelihood of receiving tonsillectomy as treatment.

Conclusion: There are important nonclinical factors associated with treatment of children who present in the acute setting with PTA/PTC. Additional research is recommended to understand these observed differences in care and how they may affect health outcomes.

Keywords: peritonsillar abscess/peritonsillar cellulitis (PTA/PTC); tonsillectomy.`,
        source_id: "25589309",
        source_type: "pubmed",
        source_citation: "Nguyen T, Haberland CA, Hernandez-Boussard T. Pediatric Patient and Hospital Characteristics Associated With Treatment of Peritonsillar Abscess and Peritonsillar Cellulitis. Clin Pediatr (Phila). 2015 Nov;54(13):1240-6. doi: 10.1177/0009922814565884. Epub 2015 Jan 14. PMID: 25589309.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "7",
        text:
            "Accidental ingestion and overdose of medications used in thyroidal illnesses may occur because of the frequency of these diagnoses. This review discusses acute overdosage of 4 groups of medicines. Acute ingestion of thyroid replacement medications occurs very frequently. Overdosage in children is usually asymptomatic and a benign condition; after evacuation of the stomach, propranolol may be used to treat symptomatic children. Other therapeutic regimens are rarely indicated in this age group. Ingestions of large amounts of antithyroid medications occur very rarely and limited information regarding treatment is available in the medical literature. Acute ingestion of iodine often results in corrosive injury of the gastrointestinal tract and renal damage. Cardiopulmonary collapse secondary to circulatory failure, oedema of the epiglottis and aspiration pneumonias may cause death. Administration of starch and sodium thiosulphate, maintenance of airway and stabilisation of circulation are the major components of therapy. Acute overdosage of beta-blockers is uncommon but can be lethal. Patients may appear well initially but they can suddenly develop convulsions and profound cardiovascular collapse requiring instant aggressive therapy. Potassium and glucose concentrations should be monitored. The usage of atropine, isoprenaline (isoproterenol), glucagon and prenalteral is discussed.",
        source_id: "2460721",
        source_type: "pubmed",
        source_citation: "Lin TH, Kirkland RT, Kirkland JL. Clinical features and management of overdosage with thyroid drugs. Med Toxicol Adverse Drug Exp. 1988 Jul-Aug;3(4):264-72. doi: 10.1007/BF03259939. PMID: 2460721.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "8",
        text: "Retropharyngeal Abscess: A Subtle Presentation of a Deep Space Neck Infection",
        source_id: "",
        source_type: "pubmed",
        source_citation: "Argintaru N, Carr D. Retropharyngeal Abscess: A Subtle Presentation of a Deep Space Neck Infection. J Emerg Med. 2017 Oct;53(4):568-569. doi: 10.1016/j.jemermed.2017.06.004. PMID: 29079072.",
        created_at: "2024-01-15",
    },
    ],
    messages: [
        createEmptyMessage(
            "user_001",
            MessageType.USER,
            `Patient presents with **Facial Swelling**: Swelling noted to the right side of the neck with complaints of right ear and right-sided sore throat pain. States hard to swallow due to pain. Handling secretions without issue.

### HPI / PE

**XX-year-old male** presents with facial swelling, reports that the right side of his neck and right ear have been hurting for the last few days, and states he has been unable to sleep. Pain worsens with swallowing. Denies any sick contacts, fevers, or chills.

**Vital Signs**

| BP      | Pulse | Resp | Temp            | SpO2 | Height  | Weight   | BMI        |
|---------|-------|------|-----------------|------|---------|----------|------------|
| 138/78  | 71    | 17   | 98.9 °F (37.2 °C) (Temporal) | 96%  | 5'7" (1.702 m) | 76.5 kg  | 26.41 kg/m² |

**Physical Exam**

- **Constitutional:** Not in acute distress. Normal appearance. **HENT:** Normocephalic. Moist mucous membranes. Posterior oropharyngeal erythema present. **Eyes:** Extraocular movements intact. Pupils equal, round, reactive to light.**Cardiovascular:** Normal rate and regular rhythm. **Pulmonary:** Normal effort and breath sounds. **Abdomen:** Flat. No distension. **Musculoskeletal:** No swelling or tenderness. Normal range of motion. **Skin:** Warm. Capillary refill < 2 seconds. **Neurological:** No focal deficit. Alert.

**Procedures / Attestation**

- Clinical impression as of DATE 0007: **Pharyngitis, unspecified etiology**
- **ED Disposition:** Discharge
`,
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Generating initial differential diagnosis list with preliminary reasoning analysis.",
            {
                event_name: "agent_running",
                agent_id: "multi_specialist_agent",
                agent_name: "Multi-Specialist Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Extracting symptoms that require special attention.",
            {
                event_name: "agent_running",
                agent_id: "warning_agent",
                agent_name: "Warning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Matching symptoms with \"should not miss\" disease guidelines, ranking the \"should not miss\" diagnosis list, and collecting the differential diagnosis list and \"should not miss\" diagnosis list.",
            {
                event_name: "agent_running",
                agent_id: "context_review_agent",
                agent_name: "Context Review Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Grouping similar diagnoses and reducing duplication.",
            {
                event_name: "agent_running",
                agent_id: "context_review_agent",
                agent_name: "Context Review Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Searching PubMed results for each diagnosis in the list.",
            {
                event_name: "agent_running",
                agent_id: "diagnosis_reasoning_agent",
                agent_name: "Diagnosis Reasoning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Matching diagnostic evidence with the patient case, providing confidence levels, and generating supporting evidence.",
            {
                event_name: "agent_running",
                agent_id: "diagnosis_reasoning_agent",
                agent_name: "Diagnosis Reasoning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Aggregating all diagnostic reasoning results, re-ranking the diagnosis list, and generating a final reasoning summary.",
            {
                event_name: "agent_running",
                agent_id: "overall_reasoning_agent",
                agent_name: "Overall Reasoning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Providing additional actions required for each diagnosis.",
            {
                event_name: "agent_running",
                agent_id: "diagnostic_action_agent",
                agent_name: "Diagnostic Action Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Compiling all actions and the final reasoning report, then generating the comprehensive management plan for the patient.",
            {
                event_name: "agent_running",
                agent_id: "management_agent",
                agent_name: "Management Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "agent",
            MessageType.AGENT,
            `



<table>
<tr>
    <td>
<h3>Top-3 Diagnosis</h3>

<ul>
<li>Viral Infections of the Throat</li>
<li>Acute unilateral cervical lymphadenitis (likely bacterial</li>
<li>Right peritonsillar cellulitis (early peritonsillar abscess)</li>
</ul>
    </td>
    <td>
<h3>Top-3 "Should Not Miss" Diagnosis</h3>

<ul>
<li>Epiglottitis</li>
<li>Retropharyngeal abscess</li>
<li>Peritonsillar abscess</li>
</ul>
    </td>
</tr>
</table>

---

## Clinical Reasoning

**Summary:**  
Right-sided sore throat with ipsilateral ear/neck swelling, normal vitals, and intact secretion handling most likely reflects pharyngitis with reactive/bacterial cervical lymphadenitis. Early peritonsillar infection remains possible. Dangerous airway/deep neck infections are less likely now but must be reconsidered if red flags (fever, trismus, muffled voice, drooling, stridor, toxicity, worsening swelling) appear.

---

### Diagnoses Considered

**1. Viral Pharyngitis:** Most likely due to mild symptoms, normal vitals, and no airway compromise. Consider EBV; do rapid strep/throat culture.

**2. Acute Bacterial Lymphadenitis:** Right neck swelling and sore throat may reflect cervical node infection. Examine nodes, consider rapid strep, empiric antibiotics.

**3. Early Peritonsillar Cellulitis:** Unilateral pain with swelling, but lacks classic abscess findings; reassess for abscess if symptoms worsen.

---

### Warning Diagnoses Not To Miss

| Diagnosis                   | Why It Matters / Key Features                                                   | Verification                                                                  |
|-----------------------------|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **Epiglottitis**            | Progressive odynophagia, drooling, muffled voice, stridor, toxic appearance. Absent here but must remain vigilant. | Upright position, avoid oral exam, urgent ENT/anesthesia, IV antibiotics.      |
| **Retropharyngeal abscess** | Severe sore throat, neck pain/stiffness, muffled voice, trismus, fever, posterior pharyngeal wall bulge. Absent now, but possible early. | Contrast CT neck, CBC/CRP, ENT consult, IV antibiotics, urgent drainage if abscess. |
| **Peritonsillar abscess**   | PTA can evolve from cellulitis; watch for unilateral pain, trismus, muffled voice, uvular deviation. | Intraoral US or CT, needle aspiration, drainage with antibiotics, airway assessment. |

---

## Management

- **Monitor airway**: Reassess for red flags (stridor, trismus, drooling, muffled voice, swelling).
- **Exam**: Focus on tonsils, neck nodes, and airway.
- **Testing**: Rapid strep, consider throat culture or imaging if high suspicion for abscess.
- **Treatment**:
    - Viral likely: Symptomatic relief (NSAIDs, fluids), no antibiotics.
    - Bacterial suspected: Oral antibiotics if able (amox-clavulanate or clinda), avoid amoxicillin if EBV possible.
    - Abscess/airway risk: Urgent ENT/drainage, IV antibiotics, admit if airway/ill-appearing.
- **Follow-up**: Outpatient unless airway risk; reassess in 1-2 days.
- **Return if**: Worsening trismus, voice changes, stridor, inability to swallow, or rapid swelling.
- **Advice**: Hydrate, avoid irritants, and if mono confirmed, no contact sports for 3-4 weeks.

---

`,
            {
                event_name: "agent_running",
                agent_id: "warning_agent",
                status: "running",
            },
            "final",
        ),
    ],
},


// full version
{
    case_id: "case_facial_swelling_aftercare",
    status: ClinicalCaseStatus.COMPLETED,
    title: "Facial Swelling Aftercare",

    evidence_snippets: [
    {
        snippet_id: "1",
        text:
            "Vlachodimitropoulos A, Gatsounia A, Danielides G, Dafni C, Lygeros S. Bilateral Peritonsillar Abscess Secondary to Infectious Mononucleosis. Cureus. 2025 Sep 22;17(9):e92958. doi: 10.7759/cureus.92958. PMID: 41133070; PMCID: PMC12543371.",
        source_id: "41133070",
        source_type: "pubmed",
        source_citation: "Vlachodimitropoulos A, Gatsounia A, Danielides G, Dafni C, Lygeros S. Bilateral Peritonsillar Abscess Secondary to Infectious Mononucleosis. Cureus. 2025 Sep 22;17(9):e92958. doi: 10.7759/cureus.92958. PMID: 41133070; PMCID: PMC12543371.",
        created_at: "2024-01-15T08:30:00Z",
    },
    {
        snippet_id: "2",
        text: "A 19-year-old transgender adolescent on hormonal therapy with a history of recent hospitalization for exudative tonsillitis presented with worsening sore throat, dysphagia, fever, and a diffuse, generalized macular rash involving the back, face, abdomen, arms, and legs. Despite prior antibiotic treatment with amoxicillin, her symptoms recurred, prompting further evaluation. Laboratory findings revealed leukocytosis with lymphocytic and monocytic predominance, elevated inflammatory markers, and a positive Epstein-Barr virus (EBV) test, confirming infectious mononucleosis. Imaging demonstrated persistent tonsillitis without abscess formation, and additional testing identified concurrent herpes simplex virus (HSV)-1 oral ulcers. Given persistent fevers and systemic inflammation, hemophagocytic lymphohistiocytosis (HLH) was considered but not confirmed. Management included IV clindamycin for tonsillitis, corticosteroids for airway inflammation, and doxycycline for atypical pneumonia. Over the 10-day hospitalization, the patient showed gradual improvement, with resolution of the rash and all other symptoms. The rash was ultimately diagnosed as an amoxicillin-induced rash associated with EBV infection. This case highlights the importance of recognizing amoxicillin-induced rash in EBV infection and distinguishing it from allergic reactions and other common rashes, including but not limited to scarlet fever, viral exanthem, drug reactions, and HLH. Although various skin rashes are common in the transgender population, a literature review found no evidence linking amoxicillin-induced EBV rash to transgender patients. Accurate diagnosis aids in the appropriate selection of antimicrobial therapy and helps avoid unnecessary antibiotic restrictions due to misattributed allergic reactions.",
        source_id: "40786360",
        source_type: "pubmed",
        source_citation: "Gujar AA, Pernudi K, Adeyinka A, Kondamudi N. Epstein-Barr Virus (EBV) Masquerading as Exudative Tonsillitis and Rash in a Transgender Adolescent. Cureus. 2025 Jul 11;17(7):e87737. doi: 10.7759/cureus.87737. PMID: 40786360; PMCID: PMC12335877.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "3",
        text:
            "Infectious mononucleosis (IM), caused by the Epstein-Barr virus (EBV), is primarily a self-limiting illness. However, it often mimics bacterial infections, such as bacterial tonsillitis, which can represent a diagnostic pitfall and, consequently, increase the risk of developing complications. The aim of this case report is to highlight the complications resulting from the incorrect differential diagnosis of EBV-induced IM and its clinical significance. We present the case of a 24-year-old male who was initially misdiagnosed with bacterial tonsillitis. Amoxicillin-clavulanic acid was initiated for treatment, after which he developed a widespread maculopapular rash. Acute EBV infection was diagnosed via serological tests. His condition improved following the discontinuation of antibiotic therapy and the administration of supportive symptomatic treatment. This case underscores the critical need for careful differential diagnosis between viral and bacterial tonsillitis. It demonstrates that an amoxicillin-clavulanic acid-induced rash can serve as an important clue for underlying EBV infection, thereby preventing unnecessary antibiotic use and enabling the correct direction of investigation and management.",
        source_id: "40895910",
        source_type: "pubmed",
        source_citation: "Chaprava T, Ostatishvili K, Kirtadze N, Goginava A, Tabatadze I. Amoxicillin-Clavulanic Acid-Induced Rash in Epstein-Barr Virus Infection: A Case Report of a Diagnostic Pitfall in a 24-Year-Old Male. Cureus. 2025 Jul 29;17(7):e89023. doi: 10.7759/cureus.89023. PMID: 40895910; PMCID: PMC12398297.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "4",
        text: `Background: Lymphadenopathy refers to any disease process involving lymph nodes that are abnormal in size and consistency. There are multiple etiologies in the setting of a diseased lymph node, including conditions of infection, autoimmune diseases, and neoplasia. Lymphadenitis is a term that refers to lymphadenopathies that are due to inflammatory processes and can represent an acute bacterial infection resulting from streptococcal pharyngitis or a prior viral upper respiratory infection. Cervical lymphadenopathy refers to nodal swelling in the neck region. While cervical lymphadenitis is a common clinical finding in the setting of a transient response to a benign local or generalized infection, it may evade detection sometimes and thus account for a percentage of misdiagnosis or delayed diagnosis in the tropics. This case report is aimed at increasing the awareness about the presentation of bacterial cervical lymphadenitis and how it can sometimes mimic the presentation that is typical and regularly found with plasmodiasis. It contributes to improved awareness and high index of suspicion in clinic when dealing with patients in the tropics.

Case presentation: We present a case of delayed diagnosis of bacterial cervical lymphadenitis that initially presented with typical features of malaria from Plasmodium falciparum. A 26-year-old Nigerian woman presented to the outpatient department following complaints of a recurring fever of a month's duration and bilateral neck swelling of about 2 weeks prior to presentation.

Conclusion: In the setting of a busy clinic, details are easily missed and salient features in the presentation of a patient that are needed for accurate diagnosis and management could go unrecognized. Hence, this case report highlights the importance of proper examination particularly of lymph nodes and use of different diagnostic modalities for the exact diagnosis of disease.

Keywords: Cervical; Delayed diagnosis; Fine needle aspiration cytology (FNAC); Lymphadenitis; Lymphadenopathy; Neck swelling.`,
        source_id: "36755272",
        source_type: "pubmed",
        source_citation: "Olaniyi O, Ayotunde O, Christabel T, Idowu O. Delayed diagnosis of bacterial cervical lymphadenitis in the tropics: a case report. J Med Case Rep. 2023 Feb 9;17(1):41. doi: 10.1186/s13256-023-03773-9. PMID: 36755272; PMCID: PMC9909935.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "5",
        text:
            "Necrotizing lymphadenitis (NL) is a rare entity that can occur as a complication of bacterial cervical lymphadenitis (CL) and is characterized by unilateral or bilateral cervical lymphadenopathy. NL most commonly presents in females and most reports have been in Japan. In this case, we present a 37-year-old male with no significant past medical history who presented with an unusual presentation and clinical course of NL. Initial workup for Epstein-Barr Virus (EBV) and other infectious etiology was negative. Yet, aspiration later revealed Group A Streptococcus. When the patient's pain and swelling did not subside with the initial antibiotic and supportive treatment, the patient underwent a repeat aspiration and biopsy that revealed a necrotic mass or lymph node. NL is uncommon and rarely due to infectious etiology. However, this marks a case in which a Group A Streptococcus was shown to be associated with subsequent necrotic lymph nodes and should allow practitioners to further consider an infectious etiology in the differential diagnosis of NL.",
        source_id: "36793849",
        source_type: "pubmed",
        source_citation: "De Paz N, Pupo A, Frankel LR, Roorda SL, Hernandez R. Group A Streptococcus Necrotizing Lymphadenitis: A Case Report. Cureus. 2023 Jan 12;15(1):e33699. doi: 10.7759/cureus.33699. PMID: 36793849; PMCID: PMC9925034.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "6",
        text: `Objective: To identify patient and hospital characteristics associated with the choice of treatment for pediatric patients who present in the acute setting with peritonsillar abscess/cellulitis (PTA/PTC).

Study design: A retrospective cohort study was performed using Healthcare Cost and Utilization Project emergency department, ambulatory, and inpatient state databases for the years 2010 and 2011. Children aged 0 to 17 years were identified using International Classification of Diseases, Ninth Revision, Clinical Modification (ICD-9-CM) diagnosis code for PTA/PTC. The main outcome of interest was treatment received, which included medical therapy alone, incision and drainage (IND) or tonsillectomy. Multiple logistic regression analyses were conducted to model non-clinical factors associated with treatment received after adjusting for age, hospital state, race, primary expected payer, existing chronic condition(s), and type of hospital.

Results: We identified 2994 patients who presented with PTA/PTC. The most common treatment choice was medical therapy alone (30.8%), followed by IND (30.5%) and tonsillectomy (9.4%). There were significant associations between treatment choice and race, primary payer status, and type of hospital (P < .05). We found that Hispanic patients, those with Medicaid as their primary expected payer, and those treated at a designated children's hospital were 3 nonclinical factors independently associated with an increase in likelihood of receiving tonsillectomy as treatment.

Conclusion: There are important nonclinical factors associated with treatment of children who present in the acute setting with PTA/PTC. Additional research is recommended to understand these observed differences in care and how they may affect health outcomes.

Keywords: peritonsillar abscess/peritonsillar cellulitis (PTA/PTC); tonsillectomy.`,
        source_id: "25589309",
        source_type: "pubmed",
        source_citation: "Nguyen T, Haberland CA, Hernandez-Boussard T. Pediatric Patient and Hospital Characteristics Associated With Treatment of Peritonsillar Abscess and Peritonsillar Cellulitis. Clin Pediatr (Phila). 2015 Nov;54(13):1240-6. doi: 10.1177/0009922814565884. Epub 2015 Jan 14. PMID: 25589309.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "7",
        text:
            "Accidental ingestion and overdose of medications used in thyroidal illnesses may occur because of the frequency of these diagnoses. This review discusses acute overdosage of 4 groups of medicines. Acute ingestion of thyroid replacement medications occurs very frequently. Overdosage in children is usually asymptomatic and a benign condition; after evacuation of the stomach, propranolol may be used to treat symptomatic children. Other therapeutic regimens are rarely indicated in this age group. Ingestions of large amounts of antithyroid medications occur very rarely and limited information regarding treatment is available in the medical literature. Acute ingestion of iodine often results in corrosive injury of the gastrointestinal tract and renal damage. Cardiopulmonary collapse secondary to circulatory failure, oedema of the epiglottis and aspiration pneumonias may cause death. Administration of starch and sodium thiosulphate, maintenance of airway and stabilisation of circulation are the major components of therapy. Acute overdosage of beta-blockers is uncommon but can be lethal. Patients may appear well initially but they can suddenly develop convulsions and profound cardiovascular collapse requiring instant aggressive therapy. Potassium and glucose concentrations should be monitored. The usage of atropine, isoprenaline (isoproterenol), glucagon and prenalteral is discussed.",
        source_id: "2460721",
        source_type: "pubmed",
        source_citation: "Lin TH, Kirkland RT, Kirkland JL. Clinical features and management of overdosage with thyroid drugs. Med Toxicol Adverse Drug Exp. 1988 Jul-Aug;3(4):264-72. doi: 10.1007/BF03259939. PMID: 2460721.",
        created_at: "2024-01-15",
    },
    {
        snippet_id: "8",
        text: "Retropharyngeal Abscess: A Subtle Presentation of a Deep Space Neck Infection",
        source_id: "",
        source_type: "pubmed",
        source_citation: "Argintaru N, Carr D. Retropharyngeal Abscess: A Subtle Presentation of a Deep Space Neck Infection. J Emerg Med. 2017 Oct;53(4):568-569. doi: 10.1016/j.jemermed.2017.06.004. PMID: 29079072.",
        created_at: "2024-01-15",
    },
    ],
    messages: [
        createEmptyMessage(
            "user_001",
            MessageType.USER,
            `Patient presents with **Facial Swelling**:

- Swelling noted to the right side of the neck with complaints of right ear and right-sided sore throat pain.
- States hard to swallow due to pain.
- Handling secretions without issue.

---

### HPI / PE

**XX-year-old male** presents with facial swelling, reports that the right side of his neck and right ear have been hurting for the last few days, and states he has been unable to sleep. Pain worsens with swallowing. Denies any sick contacts, fevers, or chills.

---

**Vital Signs**

| BP      | Pulse | Resp | Temp            | SpO2 | Height  | Weight   | BMI        |
|---------|-------|------|-----------------|------|---------|----------|------------|
| 138/78  | 71    | 17   | 98.9 °F (37.2 °C) (Temporal) | 96%  | 5'7" (1.702 m) | 76.5 kg  | 26.41 kg/m² |

---

**Physical Exam**

- **Constitutional:** Not in acute distress. Normal appearance.
- **HENT:** Normocephalic. Moist mucous membranes. Posterior oropharyngeal erythema present.
- **Eyes:** Extraocular movements intact. Pupils equal, round, reactive to light.
- **Cardiovascular:** Normal rate and regular rhythm.
- **Pulmonary:** Normal effort and breath sounds.
- **Abdomen:** Flat. No distension.
- **Musculoskeletal:** No swelling or tenderness. Normal range of motion.
- **Skin:** Warm. Capillary refill < 2 seconds.
- **Neurological:** No focal deficit. Alert.

---

**Procedures / Attestation**

- Clinical impression as of DATE 0007: **Pharyngitis, unspecified etiology**
- **ED Disposition:** Discharge
`,
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Generating initial differential diagnosis list with preliminary reasoning analysis.",
            {
                event_name: "agent_running",
                agent_id: "multi_specialist_agent",
                agent_name: "Multi-Specialist Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Extracting symptoms that require special attention.",
            {
                event_name: "agent_running",
                agent_id: "warning_agent",
                agent_name: "Warning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Matching symptoms with \"should not miss\" disease guidelines.",
            {
                event_name: "agent_running",
                agent_id: "warning_agent",
                agent_name: "Warning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Ranking the \"should not miss\" diagnosis list.",
            {
                event_name: "agent_running",
                agent_id: "warning_agent",
                agent_name: "Warning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Collecting the differential diagnosis list and \"should not miss\" diagnosis list.",
            {
                event_name: "agent_running",
                agent_id: "context_review_agent",
                agent_name: "Context Review Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Grouping similar diagnoses and reducing duplication.",
            {
                event_name: "agent_running",
                agent_id: "context_review_agent",
                agent_name: "Context Review Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Searching PubMed results for each diagnosis in the list.",
            {
                event_name: "agent_running",
                agent_id: "diagnosis_reasoning_agent",
                agent_name: "Diagnosis Reasoning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Matching diagnostic evidence with the patient case, providing confidence levels, and generating supporting evidence.",
            {
                event_name: "agent_running",
                agent_id: "diagnosis_reasoning_agent",
                agent_name: "Diagnosis Reasoning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Aggregating all diagnostic reasoning results, re-ranking the diagnosis list, and generating a final reasoning summary.",
            {
                event_name: "agent_running",
                agent_id: "overall_reasoning_agent",
                agent_name: "Overall Reasoning Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Providing additional actions required for each diagnosis.",
            {
                event_name: "agent_running",
                agent_id: "diagnostic_action_agent",
                agent_name: "Diagnostic Action Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Compiling all actions and the final reasoning report, then generating the comprehensive management plan for the patient.",
            {
                event_name: "agent_running",
                agent_id: "management_agent",
                agent_name: "Management Agent",
                status: "running",
            },
            "thinking",
        ),

        createEmptyMessage(
            "agent",
            MessageType.AGENT,
            `## Top-3 Diagnosis

1. Viral Infections of the Throat
2. Acute unilateral cervical lymphadenitis (likely bacterial
3. Right peritonsillar cellulitis (early peritonsillar abscess)

## Top-3 "Should Not Miss" Diagnosis

1. Epiglottitis
2. Retropharyngeal abscess
3. Peritonsillar abscess

---

## Clinical Reasoning

**Summary:**  
Right-sided sore throat with ipsilateral ear/neck swelling, normal vitals, and intact secretion handling most likely reflects pharyngitis with reactive/bacterial cervical lymphadenitis. Early peritonsillar infection remains possible. Dangerous airway/deep neck infections are less likely now but must be reconsidered if red flags (fever, trismus, muffled voice, drooling, stridor, toxicity, worsening swelling) appear.

---

### Diagnoses Considered

**1. Viral Infections of the Throat**

- **Why it fits:** Posterior oropharyngeal erythema, afebrile, normal vitals, no trismus/airway compromise, and ability to handle secretions compatible with uncomplicated viral pharyngitis (including EBV), which can mimic bacterial tonsillitis and may be unilateral. Recognizing EBV matters to avoid aminopenicillin rash.
- **Gaps/concerns:** Unilateral neck swelling and ipsilateral otalgia also suggest bacterial tonsillitis/adenitis or peritonsillar/deep neck pathology. No rapid strep/culture, mono testing, or documentation of exudates, tonsillar asymmetry, uvular deviation, or viral URI signs.
- **Verification:** Perform rapid strep and/or throat culture; consider heterophile antibody or EBV serologies if clinically suspected; treat supportively; return precautions.

**2. Acute unilateral cervical lymphadenitis (likely bacterial)**

- **Why it fits:** Several days of unilateral right neck swelling with ipsilateral ear pain and odynophagia, plus pharyngeal erythema, typical for acute cervical lymphadenitis from oropharyngeal infection (commonly GAS or Staph aureus). Intact secretion handling and normal vitals favor uncomplicated adenitis.
- **Limitations:** No documented node exam (size, warmth, tenderness, fluctuance), no fever, no labs/microbiology, no otoscopic/dental/salivary source identified. ED impression nonspecific pharyngitis.
- **Verification:** Cervical node exam, otoscopic, oral/dental, and salivary gland evaluation, rapid strep/culture, CBC/CRP. Consider empiric antibiotics; use neck US to assess nodes. Escalate to CT if complications.

**3. Right peritonsillar cellulitis (early peritonsillar abscess)**

- **Why it fits:** Unilateral odynophagia with ipsilateral otalgia and neck/facial swelling suggests peritonsillar infection. Afebrile, no drooling, preserved secretion control favors cellulitis/early infection over mature abscess.
- **Missing data:** No hallmark PTA signs (tonsillar bulge, uvular deviation, trismus, muffled voice), nor imaging or aspiration performed. Other causes (pharyngitis, adenitis, etc.) possible.
- **Verification:** Reassess for peritonsillar asymmetry, uvular deviation, trismus; bedside US to identify collection and guide aspiration; CT if uncertain. Negative aspiration supports cellulitis (antibiotics).


---

### Warning Diagnoses Not To Miss

| Diagnosis                   | Why It Matters / Key Features                                                   | Verification                                                                  |
|-----------------------------|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| **Epiglottitis**            | Progressive odynophagia, drooling, muffled voice, stridor, toxic appearance. Absent here but must remain vigilant. | Upright position, avoid oral exam, urgent ENT/anesthesia, IV antibiotics.      |
| **Retropharyngeal abscess** | Severe sore throat, neck pain/stiffness, muffled voice, trismus, fever, posterior pharyngeal wall bulge. Absent now, but possible early. | Contrast CT neck, CBC/CRP, ENT consult, IV antibiotics, urgent drainage if abscess. |
| **Peritonsillar abscess**   | PTA can evolve from cellulitis; watch for unilateral pain, trismus, muffled voice, uvular deviation. | Intraoral US or CT, needle aspiration, drainage with antibiotics, airway assessment. |

---


## Management

**Summary:**  
Likely acute pharyngitis with reactive/bacterial cervical lymphadenitis; early right peritonsillar infection is possible, but no current airway compromise.

---

### 1. Immediate Priorities and Safety

- Reassess airway now and at discharge (swallowing, drooling, stridor, trismus, muffled voice, rapidly progressing swelling).
- Any red flags: keep upright, urgent ENT/anesthesia, prepare airway.

---

### 2. Focused Exam Today

- **ENT:** Document tonsil size/exudate, peritonsillar fullness, uvular deviation, trismus, voice quality.
- **Neck:** Map right cervical nodes (size, tenderness, fluctuance, warmth, mobility, location), overlying erythema.
- **Otoscopy:** Rule out AOM.
- **Oral/dental exam:** Assess for odontogenic source.
- **Salivary glands:** Parotid/submandibular swelling, duct findings.
- **Score:** Calculate Centor/McIsaac score.

---

### 3. Diagnostics

- Group A Strep: RADT today; if negative but Centor ≥3 or high suspicion—throat culture/NAAT.
- Point-of-care US: Assess for peritonsillar collection and nodal suppuration.
- Labs (bacterial features/ill-appearing): CBC, CRP (±ESR), EBV tests if indicated, COVID/flu NAATs as needed.
- Fluctuant node/collection: US-guided aspiration for Gram stain/culture.

---

### 4. Treatment Pathways

- **Viral pharyngitis likely:**  
    - NSAIDs/acetaminophen, adjuncts (gargle, lozenge, fluids, rest), optional dexamethasone for severe pain.
    - NO antibiotics.

- **Bacterial lymphadenitis/peritonsillar cellulitis suspected, PO tolerated:**  
    - Empiric antibiotics (amox-clavulanate 875/125 mg PO BID x7-10d; clinda if pen-allergic), analgesia, ±dexamethasone.
    - Avoid aminopenicillins if mono strongly suspected.

- **Peritonsillar abscess confirmed or unable to take PO/airway risk:**  
    - Urgent drainage, IV abx (amp-sulbactam; clinda if allergic), IV/IM dexamethasone.
    - Monitor until PO tolerated, switch to oral.
    - Admit if airway/sepsis/dehydration/deep neck.

---

### 5. Disposition & Follow-up

- Outpatient care appropriate.
- Recheck in 24-48 hrs (earlier if worsening) for results/clinical course. Escalate to imaging/ENT if no improvement or suspicion for abscess.
- Persistent/recurrent nodes >2-4 weeks, hard/fixed: further ENT workup and imaging (US/CT, FNA).

---

### 6. Return Precautions (ED Immediately If…)

- New/worsening trismus, muffled voice, drooling, stridor, dyspnea, rapidly increasing swelling, severe pain, dehydration, inability to swallow fluids, fever ≥101°F (38.3°C), or spreading erythema.

---

### 7. Patient Guidance

- Maintain hydration, avoid smoking/irritants, no utensil sharing. If EBV confirmed, avoid contact sports 3–4 weeks.

---

**Documentation checklist:**  
Record:  
- Exam details (tonsillar asymmetry, uvula, trismus, node map)
- Centor score
- Airway assessment
- Tests ordered/results
- Antibiotic choice/rationale
- Explicit return precautions

---

`,
            {
                event_name: "agent_running",
                agent_id: "warning_agent",
                status: "running",
            },
            "final",
        ),
    ],
},



{
    case_id: "case_heart_failure_2024_001",
    status: ClinicalCaseStatus.COMPLETED,
    title: "Complex Heart Failure with Reduced Ejection Fraction in Elderly Patient with Multiple Comorbidities",

    evidence_snippets: [
        {
            snippet_id: "evid_001",
            text:
                "Create aftercare instructions for a patient discharged after a minor skin surgery. Explain how to care for the wound site, signs of infection to watch for, when they can shower, and when to come back for suture removal.",
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
            "Create aftercare instructions for a patient discharged after a minor skin surgery. Explain how to care for the wound site, signs of infection to watch for, when they can shower, and when to come back for suture removal.",
        ),

        // system + tools (unchanged)
        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Analyzing the case...",
            {
                event_name: "agent_thinking",
                agent_id: "cardiology_agent",
                status: "analyzing_case",
            },
            "thinking",
        ),

        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Searching published medical literature, guidelines, and more",
            {
                event_name: "tool_calling",
                tool_name: "guideline_search",
                parameters: {
                    query: "heart failure reduced ejection fraction",
                    year: "2023",
                },
            },
            "tooling",
        ),

        // AGENT (add citations)
        createEmptyMessage(
            "system",
            MessageType.SYSTEM,
            "Synthesizing relevant information",
            {
                event_name: "agent_synthesizing",
                agent_id: "cardiology_agent",
                status: "synthesizing_case",
            },
            "planning",
        ),

        // createEmptyMessage(
        //     "system_002",
        //     MessageType.SYSTEM,
        //     "",
        //     {
        //         event_name: "tool_calling",
        //         tool_name: "guideline_search",
        //         parameters: {
        //             condition: "heart_failure_reduced_ef",
        //             year: "2023",
        //         },
        //     },
        //     "tooling",
        // ),

        // NEW: FINAL answer to the user's first question (explicit, stage: "final")
        createEmptyMessage(
            "agent",
            MessageType.AGENT,
            `### Minor Skin Surgery Aftercare

**Wound Site Care:**  
  
- Keep the wound clean and covered with a non-adherent, moist dressing for the first 24-48 hours to promote optimal healing and reduce infection risk. Application of a thin layer of petroleum jelly or a similar ointment is recommended to maintain a moist environment.[1][2][3][4]  
  
- Change the dressing daily or if it becomes wet or soiled. Cleanse the wound gently with tap water or saline; antiseptic solutions are not required for routine care.[5][1][2][4]  
  
- Avoid trauma or excessive movement at the wound site.  
  
**Signs of Infection to Monitor:**  
  
- Watch for increasing redness, swelling, warmth, pain, purulent discharge, or fever. The Infectious Diseases Society of America defines surgical site infection as the presence of purulent drainage, positive wound cultures, or local signs such as pain, swelling, and erythema.[6]  
  
- If any of these signs develop, seek prompt medical evaluation.  
  
**Showering Recommendations:**  
  
- Showering is permitted as early as 6-12 hours after surgery, as multiple randomized trials and meta-analyses show no increased risk of infection or complications with early water exposure.[7][8][9]  
  
- When showering, allow water to run gently over the wound. Avoid soaking (e.g., baths, swimming) until sutures are removed and the wound is fully healed.[5][10][8]  
  
- After showering, gently pat the area dry and reapply a clean dressing.  
  
**Suture Removal:**  
  
- Return for suture removal as advised, typically:  
  
- Face: **5-7 days**  
  
- Scalp: **7-10 days**  
  
- Trunk and upper extremities: **7-14 days**  
  
- Lower extremities: **10-14 days**  
  
These intervals are based on expert consensus and clinical experience.[4]  
  
- Adhere to the specific timeline provided at discharge, as wound location and patient factors may influence timing.  
  
**Additional Instructions:**  
  
- Minimize strenuous activity or stretching of the wound area until sutures are removed.  
  
- Protect the wound from sun exposure to optimize cosmetic outcomes.[11][3]  
  
- Ensure tetanus immunization is up to date if indicated.[1][4]  
  
### References

1. Current Management of Acute Cutaneous Wounds. Singer AJ, Dagum AB. The New England Journal of Medicine. 2008;359(10):1037-46. doi:10.1056/NEJMra0707253.
2. Management of Minor Acute Cutaneous Wounds: Importance of Wound Healing in a Moist Environment. Korting HC, Schöllmann C, White RJ. Journal of the European Academy of Dermatology and Venereology : JEADV. 2011;25(2):130-7. doi:10.1111/j.1468-3083.2010.03775.x.
3. Wound Care Practices Following in-Office Cutaneous Surgery Among Family Physicians in Canada. Sander M, Rebner B, Wiens R, et al. Journal of Wound Care. 2024;33(Sup5):S14-S21. doi:10.12968/jowc.2024.33.Sup5.S14.
4. Laceration Repair: A Practical Approach. Forsch RT, Little SH, Williams C. American Family Physician. 2017;95(10):628-636.
5. Common Questions About Wound Care. Worster B, Zawora MQ, Hsieh C. American Family Physician. 2015;91(2):86-92.
6. Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update by the Infectious Diseases Society of America. Stevens DL, Bisno AL, Chambers HF, et al. Clinical Infectious Diseases : An Official Publication of the Infectious Diseases Society of America. 2014;59(2):147-59. doi:10.1093/cid/ciu296.
7. Early Postoperative Water Exposure Does Not Increase Complications in Cutaneous Surgeries: A Randomized, Investigator-Blinded, Controlled Trial. Samaan C, Kim Y, Zhou S, Kirby JS, Cartee TV. Journal of the American Academy of Dermatology. 2024;91(5):896-903. doi:10.1016/j.jaad.2024.05.098.
8. Can Sutures Get Wet? Prospective Randomised Controlled Trial of Wound Management in General Practice. Heal C, Buettner P, Raasch B, et al. BMJ (Clinical Research Ed.). 2006;332(7549):1053-6. doi:10.1136/bmj.38800.628704.AE.
9. Does the Timing of Postoperative Showering Impact Infection Rates? A Systematic Review and Meta-Analysis. Copeland-Halperin LR, Reategui Via Y Rada ML, Levy J, et al. Journal of Plastic, Reconstructive & Aesthetic Surgery : JPRAS. 2020;73(7):1306-1311. doi:10.1016/j.bjps.2020.02.007.
10. Postoperative Showering for Clean and Clean-Contaminated Wounds: A Prospective, Randomized Controlled Trial. Hsieh PY, Chen KY, Chen HY, et al. Annals of Surgery. 2016;263(5):931-6. doi:10.1097/SLA.0000000000001359.
11. Dermatological Postoperative Patient Information Leaflets: Is It Time for More Uniformity?. Hunt WT, McGrath EJ. Clinical and Experimental Dermatology. 2015;40(7):747-52. doi:10.1111/ced.12701.`,
            { agent_name: "Review Agent" },
            "final"
        ),
    ] as Message[],

    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T15:30:00Z",
},




] as ClinicalCase[];
