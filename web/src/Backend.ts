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

    /**
     * Chat with streaming SSE from backend
     * @param caseText - Clinical case text
     * @param onProgress - Callback for progress messages
     * @param onResult - Callback for final result
     * @param onError - Callback for errors
     * @param onCaseCreated - Callback when case is created (receives case_id)
     * @returns Object with close method to stop streaming
     */
    async chat(
        caseText: string,
        onProgress?: (message: string) => void,
        onResult?: (data: any) => void,
        onError?: (error: string) => void,
        onCaseCreated?: (case_id: string) => void
    ): Promise<{ close: () => void }> {
        let isClosed = false;
        let abortController = new AbortController();

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ case_text: caseText }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    onError?.('Unauthorized. Please sign in.');
                    return { close: () => {} };
                }
                onError?.(`Failed to start chat: ${response.statusText}`);
                return { close: () => {} };
            }

            const reader = response.body?.getReader();
            if (!reader) {
                onError?.('Failed to read response stream');
                return { close: () => {} };
            }

            const decoder = new TextDecoder();
            let buffer = ''; // Buffer to accumulate incomplete messages

            // Read stream
            const processStream = async () => {
                try {
                    while (!isClosed) {
                        const { done, value } = await reader.read();

                        if (done) break;

                        // Decode chunk and add to buffer
                        const chunk = decoder.decode(value, { stream: true });
                        buffer += chunk;
                        console.log('Buffer:', buffer);

                        // Split by SSE message delimiter (\r\n\r\n or \n\n for compatibility)
                        // EventSourceResponse uses \r\n by default
                        const messages = buffer.split(/\r\n\r\n|\n\n/);
                        console.log('Messages:', messages);

                        // Keep the last incomplete message in buffer
                        buffer = messages.pop() || '';

                        // Process complete messages
                        for (const message of messages) {
                            if (isClosed) break;
                            console.log('Processing SSE message:', message);

                            // Trim any remaining \r or \n from the message
                            const trimmedMessage = message.trim();

                            if (trimmedMessage.startsWith('data: ')) {
                                const dataStr = trimmedMessage.slice(6); // Remove "data: " prefix
                                try {
                                    // ok, parse the JSON data
                                    const data = JSON.parse(dataStr);

                                    if (data.type === 'case_created') {
                                        onCaseCreated?.(data.case_id);
                                    } else if (data.type === 'progress') {
                                        onProgress?.(data.message);
                                    } else if (data.type === 'result') {
                                        onResult?.(data.data);
                                    } else if (data.type === 'error') {
                                        onError?.(data.message);
                                        isClosed = true;
                                    }
                                } catch (e) {
                                    console.error('Failed to parse SSE data:', dataStr, e);
                                }
                            }
                        }
                    }
                } catch (error: any) {
                    if (!isClosed && error.name !== 'AbortError') {
                        console.error('Stream error:', error);
                        onError?.(error.message || 'Stream connection error');
                    }
                } finally {
                    reader.releaseLock();
                }
            };

            // Start processing stream
            processStream();

            return {
                close: () => {
                    isClosed = true;
                    abortController.abort();
                },
            };
        } catch (error: any) {
            if (error.name !== 'AbortError') {
                console.error('Chat error:', error);
                onError?.(error.message || 'Failed to connect to chat service');
            }
            return { close: () => {} };
        }
    },

    /**
     * Get chat history - all cases for the authenticated user
     * @returns Promise with list of user's cases
     */
    async getHistory(): Promise<ClinicalCase[]> {
        const response = await fetch(`${API_BASE_URL}/api/history`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please sign in.');
            }
            throw new Error(`Failed to get history: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform to ClinicalCase objects
        return data.cases.map((c: any) => ({
            case_id: c.case_id,
            status: c.status as any,
            title: c.title,
            evidence_snippets: [],
            messages: [],
            created_at: c.created_at,
            updated_at: c.updated_at,
        }));
    },

    /**
     * Get full case data including messages and evidence
     * @param case_id - The case ID
     * @returns Promise with full case data
     */
    async getFullCase(case_id: string): Promise<ClinicalCase> {
        const response = await fetch(`${API_BASE_URL}/api/cases/${case_id}/full`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Please sign in.');
            }
            if (response.status === 404) {
                throw new Error('Case not found or you don\'t have access to this case');
            }
            throw new Error(`Failed to get case: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform to ClinicalCase object
        return {
            case_id: data.case_id,
            status: data.status as any,
            title: data.title,
            messages: data.messages || [],
            evidence_snippets: data.evidence_snippets || [],
            created_at: data.created_at,
            updated_at: data.updated_at,
        };
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
