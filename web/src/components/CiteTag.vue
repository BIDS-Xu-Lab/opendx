<script setup lang="ts">
import { useCaseStore } from '../stores/CaseStore';

const case_store = useCaseStore();

const props = defineProps<{
    snippet_id: string;
}>();

const emit = defineEmits<{
    (e: 'click', snippet_id: string): void;
    (e: 'mouseEnter', snippet_id: string): void;
    (e: 'mouseLeave'): void;
}>();

// Reactive refs

const handleMouseEnter = (event: MouseEvent) => {
    // get the evidence snippet from the case store
    case_store.setHoveredSnippetId(props.snippet_id, event);
};

const handleMouseLeave = () => {
    case_store.hideHoveredSnippet();
};

const handleClick = () => {
    // setup the store to show the evidence snippet
    case_store.setCurrentEvidenceTab(props.snippet_id);
    emit('click', props.snippet_id);
};

</script>

<template>
<span class="cite-tag text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600" 
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    {{ case_store.evidence_dict[props.snippet_id].index + 1 }}
</span>
</template>


<style scoped>
.cite-tag {
    transition: color 0.2s ease;
    background-color: var(--highlight-background-color);
    cursor: pointer;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    margin-right: 0.25rem;
    padding: 0 0.75rem;
    cursor: pointer;
}
</style>
