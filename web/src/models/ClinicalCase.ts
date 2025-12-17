// ClinicalCase.ts (simple version, no "extends")

// ---------- Core primitives ----------

/**
 * Clinical case status is the status of the clinical case.
 * 
 * Each clinical case has a status.
 * For example:
 * 
 * - CREATED: the clinical case is created but not yet processed
 * - PROCESSING: the clinical case is being processed
 * - COMPLETED: the clinical case is completed
 * - ERROR: the clinical case has an error when processing and stoped
 */
export const ClinicalCaseStatus = {
  CREATED: "CREATED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  ERROR: "ERROR",
} as const;
export type ClinicalCaseStatus = typeof ClinicalCaseStatus[keyof typeof ClinicalCaseStatus];

// ---------- Evidence snippets ----------

/**
 * Evidence snippet is a piece of text that is used to support the clinical case.
 * 
 * Each snippet is a piece of text that is used to support the clinical case.
 * For example:
 * 
 * - user-uploaded clinical notes, or a file
 * - a paper from pubmed, pmc or other sources
 * - a clinical guideline from a professional society
 * - a web page from a clinical website
 */
export interface EvidenceSnippet {
  snippet_id: string;
  index: number | 0;   // index of the snippet in the clinical case, starting from 0
  text: string;        // the text of the snippet
  source_id: string;   // the id of the source of the snippet, e.g., PMDI, PMCID, DOI
  source_type: string; // e.g., "pubmed", "clinical_note", "uptodate", "webpage", etc.
  source_url?: string; // the url of the source of the snippet, e.g., https://pubmed.ncbi.nlm.nih.gov/12345678/
  source_citation?: string; // the citation of the source of the snippet, e.g., "Smith J, Doe R. A new study. Nature 2024;123:123-123."
  created_at: string;
}

// ---------- Messages ----------

/**
 * Message type indicates the role of the message sender.
 * Each message has a type.
 * For example:
 * 
 * - USER: the message is from the user
 * - AGENT: the message is from the agent
 * - TOOL: the message is from the tool
 * - SYSTEM: the message is from the system
 */
export const MessageType = {
  USER: "USER",
  AGENT: "AGENT",
  TOOL: "TOOL",
  SYSTEM: "SYSTEM",
  PLACEHOLDER: "PLACEHOLDER",
} as const;
export type MessageType = typeof MessageType[keyof typeof MessageType];


/**
 * Message is a basic information in the analysis conversation.
 * Each message has a sender, a type, a text, and a payload.
 * The message can be a user question, an agent response, a tool response, or a system message.
 * 
 * For user, agent, and tool messages, they are the results of each step in the analysis conversation. For example:
 * - user: the user's question with a clinical case text
 * - agent: the agent's response with its analysis result
 * - tool: the tool's response with its generated text
 * 
 * For system messages, they are mainly for system notifications to update the UI or to inform the user. More details will be defined in the payload_json.For example:
 * - "event_name": "agent_thinking", indicating the agent is thinking about the analysis result
 * - "event_name": "agent_planning", indicating the agent is planning the analysis result
 * - "event_name": "system_notification", indicating the system has finished the analysis and the result is ready
 */
export interface Message {
  message_id: string;
  from_id: string;
  message_type: MessageType;
  text?: string | "";
  payload_json?: { [key: string]: any };
  stage: string | "final";  // the stage of the message, e.g., "final", "thinking", "planning", etc.
  created_at: string;
}

export const MessageStage = {
  FINAL: "final",
  THINKING: "thinking",
  PLANNING: "planning",
  TOOLING: "tooling",
  SUMMARIZING: "summarizing",
} as const;
export type MessageStage = typeof MessageStage[keyof typeof MessageStage];

/**
 * Create an empty message with the given sender, type, text, and payload.
 * The message is created with the current timestamp.
 */
export function createEmptyMessage(
  from_id: string,
  message_type: MessageType = MessageType.USER,
  text: string = "",
  payload_json: { [key: string]: any } = {},
  stage: string = "final",
): Message {
  return {
    message_id: generateId(),
    from_id: from_id,
    message_type: message_type,
    text: text,
    payload_json: payload_json,
    stage: stage,
    created_at: new Date().toISOString(),
  };
}

// ---------- ClinicalCase root ----------

/**
 * ClinicalCase is the root object of the clinical case.
 * Each clinical case has a unique id, a status, a title, evidence snippets, and messages.
 * The clinical case is created with the current timestamp.
 */
export interface ClinicalCase {
  case_id: string;
  status: ClinicalCaseStatus;
  title?: string;

  // --- Evidence snippets ---
  evidence_snippets: EvidenceSnippet[];

  // --- Messages ---
  messages: Message[];

  // --- Timestamps ---
  created_at: string;
  updated_at: string;
}

// ---------- Helpers ----------

/**
 * Create an empty clinical case with the given partial data.
 * The clinical case is created with the current timestamp.
 */
export function createEmptyClinicalCase(partial?: Partial<ClinicalCase>): ClinicalCase {
  const now = new Date().toISOString();
  return {
    case_id: generateId(),
    title: partial?.title,
    status: partial?.status ?? ClinicalCaseStatus.CREATED,

    evidence_snippets: partial?.evidence_snippets ?? [],
    messages: partial?.messages ?? [],

    created_at: now,
    updated_at: now,
  };
}

/**
 * Add a message to the clinical case.
 * The clinical case is updated with the new message.
 * The updated_at is updated to the current timestamp.
 */
export function addMessage(clinical_case: ClinicalCase, msg: Message): ClinicalCase {
  const updated: ClinicalCase = { ...clinical_case };
  updated.messages.push(msg);
  updated.updated_at = new Date().toISOString();
  return updated;
}

// ---------- ID generator ----------

/**
 * Generate a unique id.
 * The id is a string of 12 characters.
 * The id is generated with the current timestamp.
 */
export function generateId(): string {
  const g: unknown = (globalThis as any)?.crypto?.randomUUID?.();
  return typeof g === "string" && g.length > 0
    ? (g as string)
    : (`id_${Math.random().toString(36).slice(2)}` as string);
}