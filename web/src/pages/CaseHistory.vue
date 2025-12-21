<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDataStore } from '../stores/DataStore';
import { backend } from '../Backend';
import type { ClinicalCase } from '../models/ClinicalCase';
import LeftSidebar from '../components/LeftSidebar.vue';
import TopMenu from '../components/TopMenu.vue';

const data_store = useDataStore();

// State
const cases = ref<ClinicalCase[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

/**
 * Fetch all cases from the backend
 */
const fetchCases = async () => {
    loading.value = true;
    error.value = null;

    try {
        console.log('[CaseHistory] Fetching cases from backend...');
        const fetchedCases = await backend.getHistory();
        console.log('[CaseHistory] Fetched cases:', fetchedCases.length);

        cases.value = fetchedCases;

        // Update DataStore with the fetched cases
        data_store.clinical_cases = fetchedCases;

    } catch (err) {
        console.error('[CaseHistory] Error fetching cases:', err);
        error.value = err instanceof Error ? err.message : 'Failed to fetch cases';
    } finally {
        loading.value = false;
    }
};

/**
 * Format date for display
 */
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Delete a case
 */
const deleteCase = async (case_id: string) => {
    console.log('[CaseHistory] Deleting case:', case_id);
    try {
        await backend.deleteCase(case_id);
        // Refresh the list after deletion
        await fetchCases();
    } catch (err) {
        console.error('[CaseHistory] Error deleting case:', err);
        alert('Delete functionality not yet implemented in backend');
    }
};

/**
 * Export a case
 */
const exportCase = async (case_id: string) => {
    console.log('[CaseHistory] Exporting case:', case_id);
    try {
        const blob = await backend.exportCase(case_id);
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `case_${case_id}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('[CaseHistory] Error exporting case:', err);
        alert('Export functionality not yet implemented in backend');
    }
};

/**
 * Get status badge class
 */
const getStatusClass = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return 'status-completed';
        case 'PROCESSING':
            return 'status-processing';
        case 'ERROR':
            return 'status-error';
        default:
            return 'status-created';
    }
};

// Fetch cases when component is mounted
onMounted(() => {
    console.log('[CaseHistory] Component mounted, fetching cases...');
    fetchCases();
});
</script>

<template>
<LeftSidebar />
<div class="main-container">

    <div class="w-3/4 mx-auto mt-4">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Case History</h1>
            <Button
                label="Refresh"
                icon="pi pi-refresh"
                @click="fetchCases"
                :loading="loading"
                size="small" />
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
            <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
            <p class="mt-4 text-gray-600">Loading cases...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
            <i class="pi pi-exclamation-circle text-4xl text-red-500"></i>
            <p class="mt-4 text-red-600">{{ error }}</p>
            <Button
                label="Retry"
                @click="fetchCases"
                class="mt-4"
                size="small" />
        </div>

        <!-- Empty state -->
        <div v-else-if="cases.length === 0" class="text-center py-12">
            <i class="pi pi-inbox text-4xl text-gray-400"></i>
            <p class="mt-4 text-gray-600">No cases found</p>
            <p class="text-sm text-gray-500">Start analyzing a clinical case to see it here</p>
        </div>

        <!-- Cases table -->
        <table v-else class="w-full">
            <thead>
                <tr class="h-12 border-b text-left">
                    <th class="col-date">Date</th>
                    <th class="col-title">Title</th>
                    <th class="col-status">Status</th>
                    <th class="col-actions">&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cc in cases" :key="cc.case_id"
                    class="h-12 border-b light:hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="text-sm">
                        {{ formatDate(cc.created_at) }}
                    </td>
                    <td class="font-medium cursor-pointer"
                            @click="$router.push(`/analyze/${cc.case_id}`)">
                        {{ cc.title || 'Untitled Case' }}
                    </td>
                    <td>
                        <span :class="['status-badge', getStatusClass(cc.status)]">
                            {{ cc.status }}
                        </span>
                    </td>
                    <td class="text-right">
                        <Button
                            icon="pi pi-eye"
                            text
                            @click="$router.push(`/analyze/${cc.case_id}`)"
                            size="small"
                            v-tooltip.top="'View case'" />
                        <Button
                            icon="pi pi-trash"
                            text
                            @click="deleteCase(cc.case_id)"
                            size="small"
                            v-tooltip.top="'Delete case'" />
                        <Button
                            icon="pi pi-download"
                            text
                            @click="exportCase(cc.case_id)"
                            size="small"
                            v-tooltip.top="'Export case'" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<style scoped>
.col-date {
    width: 180px;
}

.col-title {
    width: auto;
}

.col-status {
    width: 120px;
}

.col-actions {
    width: 150px;
    text-align: right;
}

.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-created {
    color: #1976d2;
}

.status-processing {
    color: #f57c00;
}

.status-completed {
    color: #388e3c;
}

.status-error {
    color: #d32f2f;
}
</style>
