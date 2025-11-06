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

import type { ClinicalCase } from './models/ClinicalCase';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9627';

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
     * @param question - Patient question or case description
     * @param title - Optional case title
     * @returns Promise with case creation response
     */
    async createCase(question: string, title?: string): Promise<CreateCaseResponse> {
        const request: CreateCaseRequest = { question, title };

        const response = await fetch(`${API_BASE_URL}/api/create_case`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
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
        const response = await fetch(`${API_BASE_URL}/api/cases/${case_id}`);

        if (!response.ok) {
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
        const response = await fetch(`${API_BASE_URL}/api/cases`);

        if (!response.ok) {
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
     * Stream case updates via Server-Sent Events
     * @param case_id - The case ID to stream
     * @param onMessage - Callback for new messages
     * @param onStatus - Callback for status updates
     * @param onDone - Callback when streaming is complete
     * @param onError - Callback for errors
     * @returns EventSource object (can be closed with eventSource.close())
     */
    streamCase(
        case_id: string,
        onMessage?: (data: any) => void,
        onStatus?: (status: string) => void,
        onDone?: (status: string) => void,
        onError?: (error: any) => void
    ): EventSource {
        const eventSource = new EventSource(`${API_BASE_URL}/api/cases/${case_id}/stream`);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'message':
                        onMessage?.(data.data);
                        break;
                    case 'status':
                        onStatus?.(data.status);
                        break;
                    case 'done':
                        onDone?.(data.status);
                        eventSource.close();
                        break;
                    case 'error':
                        onError?.(new Error(data.message));
                        eventSource.close();
                        break;
                    case 'timeout':
                        onError?.(new Error('Stream timeout'));
                        eventSource.close();
                        break;
                }
            } catch (error) {
                console.error('Error parsing SSE data:', error);
                onError?.(error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource error:', error);
            onError?.(error);
            eventSource.close();
        };

        return eventSource;
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
