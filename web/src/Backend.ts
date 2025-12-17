/**
 * Backend service for API communication
 *
 * This module provides a centralized interface to communicate with the FastAPI backend.
 * All API endpoints are accessed through the `backend` object.
 *
 * Usage:
 * import { backend } from './Backend';
 *
 * const cases = await backend.getCases();
 * const case_data = await backend.getCase(case_id);
 */

import { MessageStage, type ClinicalCase, type Message } from './models/ClinicalCase';
import { useUserStore } from './stores/UserStore';
import { clinical_cases } from './models/Samples';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9627';

/**
 * Get authentication headers with JWT token
 */
function getAuthHeaders(): HeadersInit {
    const userStore = useUserStore();
    const token = userStore.accessToken;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * API Response types
 */
interface CreateCaseRequest {
    question: string;
    title?: string;
}

interface CreateCaseResponse {
    case_id: string;
    status: string;
    title: string;
    created_at: string;
    job_id: string;
}

interface CaseListResponse {
    cases: Array<{
        case_id: string;
        status: string;
        title?: string;
        created_at: string;
        updated_at: string;
    }>;
}

/**
 * Backend service object
 *
 * Provides methods to interact with the FastAPI backend.
 */
export const backend = {
    /**
     * Get the base URL for the API
     */
    getBaseUrl(): string {
        return API_BASE_URL;
    },

    /**
     * Health check endpoint
     * @returns Promise with health status
     */
    async health(): Promise<{ status: string }> {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        if (!response.ok) {
            throw new Error(`Health check failed: ${response.statusText}`);
        }
        return response.json();
    },

    /**
     * Create a new clinical case
     * @param title - Optional case title
     * @param question - Patient question or case description
     * @returns Promise with case creation response
     */
    async createCase(title: string, question: string): Promise<CreateCaseResponse> {
        const request: CreateCaseRequest = { question, title };

        const response = await fetch(`${API_BASE_URL}/api/create_case`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please sign in.');
            }
            throw new Error(`Failed to create case: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Get a specific case by ID
     * @param case_id - The case ID
     * @returns Promise with full case data
     */
    async getCase(case_id: string): Promise<ClinicalCase> {
        const response = await fetch(`${API_BASE_URL}/api/cases/${case_id}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please sign in.');
            }
            if (response.status === 404) {
                throw new Error('Case not found');
            }
            throw new Error(`Failed to get case: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Get all cases (limited to 50 most recent)
     * @returns Promise with list of cases
     */
    async getCases(): Promise<ClinicalCase[]> {
        const response = await fetch(`${API_BASE_URL}/api/cases`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please sign in.');
            }
            throw new Error(`Failed to get cases: ${response.statusText}`);
        }

        const data: CaseListResponse = await response.json();

        // Convert the case list response to full ClinicalCase objects
        // Note: The list endpoint returns summary data, so we add empty arrays for messages and evidence
        return data.cases.map(c => ({
            case_id: c.case_id,
            status: c.status as any,
            title: c.title,
            evidence_snippets: [],
            messages: [],
            created_at: c.created_at,
            updated_at: c.updated_at,
        }));
    },

    streamCaseMockup(
        case_id: string,
        onMessage?: (message: Message) => void,
        onDone?: (message: Message) => void,
        onError?: (error: any) => void
    ): EventSource {
        // Mock EventSource-like object that simulates SSE streaming
        // Uses setTimeout to send messages asynchronously without blocking the main thread
        interface MockEventSource extends EventSource {
            _readyState: number;
        }

        const mockEventSource = {
            _readyState: EventSource.CONNECTING,
            get readyState() {
                return this._readyState;
            },
            url: '',
            withCredentials: false,
            close: () => {},
        } as MockEventSource;

        // Track if the stream is closed
        let isClosed = false;
        let messageIndex = 0;

        // Get messages from sample case, excluding the first USER message
        const sampleMessages = clinical_cases[0]!.messages.slice(1); // Skip first user message

        // Function to send the next message
        const sendNextMessage = () => {
            if (isClosed) {
                return;
            }
            
            // If all messages are sent, close the stream
            if (messageIndex >= sampleMessages.length) {
                onDone?.(sampleMessages[sampleMessages.length - 1]!);
                mockEventSource._readyState = EventSource.CLOSED;
                isClosed = true;
                return;
            }

            const message = sampleMessages[messageIndex];
            if (!message) {
                return;
            }
            messageIndex++;

            // Use setTimeout to ensure non-blocking execution
            setTimeout(() => {
                if (isClosed) {
                    return;
                }

                try {
                    switch (message.stage) {
                        case MessageStage.THINKING:
                            onMessage?.(message);
                            break;

                        case MessageStage.FINAL:
                            onDone?.(message);
                            mockEventSource._readyState = EventSource.CLOSED;
                            isClosed = true;
                            return; // Stop sending more messages

                        case 'error':
                            onError?.(new Error(message.text || 'Stream error'));
                            mockEventSource._readyState = EventSource.CLOSED;
                            isClosed = true;
                            return;
                    }

                    // Schedule next message (vary delay between 3-5 seconds)
                    const delay = 1000 + Math.random() * 500;
                    setTimeout(sendNextMessage, delay);
                } catch (error) {
                    console.error('Error in mock stream:', error);
                    onError?.(error);
                    isClosed = true;
                }
            }, 0);
        };

        // Override close method
        mockEventSource.close = () => {
            isClosed = true;
            mockEventSource._readyState = EventSource.CLOSED;
        };

        // Start streaming after a short delay to simulate connection establishment
        mockEventSource._readyState = EventSource.OPEN;
        setTimeout(sendNextMessage, 100);

        return mockEventSource as EventSource;
    },

    /**
     * Delete a case (placeholder - not implemented in backend yet)
     * @param case_id - The case ID to delete
     */
    async deleteCase(case_id: string): Promise<void> {
        // TODO: Implement when backend supports deletion
        console.warn('Delete case not implemented in backend yet');
        throw new Error('Delete case not implemented');
    },

    /**
     * Export a case (placeholder - not implemented in backend yet)
     * @param case_id - The case ID to export
     */
    async exportCase(case_id: string): Promise<Blob> {
        // TODO: Implement when backend supports export
        console.warn('Export case not implemented in backend yet');
        throw new Error('Export case not implemented');
    },
};

export default backend;
