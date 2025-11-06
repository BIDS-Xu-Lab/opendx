<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDataStore } from '../stores/DataStore';
import { useCaseStore } from '../stores/CaseStore';
import LeftSidebar from '../components/LeftSidebar.vue';
import { MessageType } from '../models/ClinicalCase';
import type { Message } from '../models/ClinicalCase';
import { marked } from 'marked';
import { useToast } from 'primevue/usetoast';
import { clinical_case as sample_clinical_case } from '../models/Samples';

const toast = useToast();

// PrimeVue components
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

const data_store = useDataStore();
data_store;
const case_store = useCaseStore();

// Computed properties
const evidence_snippets = computed(() => case_store.evidence_snippets);
const current_evidence = computed(() => case_store.current_evidence);
const evidence_count = computed(() => case_store.evidence_count);

// Chat toolbar items
const chat_toolbar_items = [
    {
        icon: 'pi pi-download',
        label: 'Export as JSON',
        command: () => case_store.exportChatHistory()
    },
    {
        label: 'More',
        items: [
            { label: 'View All', icon: 'pi pi-list' },
            { label: 'Search', icon: 'pi pi-search' },
            { label: 'Filter', icon: 'pi pi-filter' }
        ]
    }
];

const chat_toolbar_menu_ref = ref();
const toggleChatToolbarMenu = (event: Event) => {
    chat_toolbar_menu_ref.value.toggle(event);
};

// Evidence toolbar items
const evidence_toolbar_menu_ref = ref();
const evidence_toolbar_items = [
    {
        label: 'Download All Evidence',
        items: [
            { label: 'As a JSON file', icon: 'pi pi-list', command: () => case_store.exportEvidence() },
        ]
    }
];

const toggleEvidenceToolbarMenu = (event: Event) => {
    evidence_toolbar_menu_ref.value.toggle(event);
};

// Methods
const handleSubmitMessage = () => {
    if (case_store.input_text.trim()) {
        const new_message: Message = {
            message_id: `msg_${Date.now()}`,
            from_id: 'user_001',
            message_type: MessageType.USER,
            text: case_store.input_text,
            created_at: new Date().toISOString(),
            stage: 'input'
        };
        case_store.addMessage(new_message);
        case_store.setInputText('');
    }
};

const handleEvidenceTabChange = (snippet_id: string) => {
    case_store.setCurrentEvidenceTab(snippet_id);
};

const renderMessageText = (text: string) => {
    let html = marked.parse(text);

    // second, highlight the keywords in the text
    const keywords = case_store.filter_keywords;
    if (keywords.length > 0) {
        for (const keyword of keywords) {
            html = (html as string).replace(new RegExp(`(${keyword})`, 'gi'), '<span class="highlight-keyword">$1</span>');
        }
    }

    return html;
};


const cite_popup_ref = ref();
const handleMouseEnterOverlayPanel = () => {
    console.log('handleMouseEnterOverlayPanel');
    case_store.clearHideHoveredSnippetTimeout();
};

const handleMouseLeaveOverlayPanel = () => {
    console.log('handleMouseLeaveOverlayPanel');
    case_store.hideHoveredSnippet(true);
};


const shortenText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + '...';
};

const copyMessageToClipboard = (message: Message) => {
    navigator.clipboard.writeText(message.text || '');

    toast.add({
        severity: 'info',
        summary: 'Copied to clipboard',
        detail: 'The answer has been copied to your clipboard',
        life: 3000
    });
};

// Initialize case data
onMounted(() => {
    if (case_store.clinical_case == null) {
        case_store.setClinicalCase(sample_clinical_case);
    }

    case_store.cite_popup_ref = cite_popup_ref.value;
});
</script>

<template>
<LeftSidebar />
<div class="main-container">
    <div class="main-content flex flex-row h-screen">

        <Splitter style="height: 100svh; border: 0;">
            
        <!-- Chat Panel -->
        <SplitterPanel class="flex flex-col" :size="45" :minSize="30">
            <!-- Chat Header -->
            <div class="chat-header h-12 flex items-center justify-between pl-4 border-b">
                <div class="flex items-center gap-2">
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                    <span class="font-semibold">
                        Analyzer
                    </span>

                    <input type="text" 
                        v-model="case_store.raw_filter_keywords" 
                        placeholder="Filter messages by keyword" 
                        style="padding-right: 2rem;"
                        class="p-1 border-1" />

                    <Button icon="pi pi-times" 
                        size="small" 
                        class="p-button-text" text
                        @click="case_store.raw_filter_keywords = ''"
                        style="margin-left: -2.5rem" />
                </div>
                <div class="flex items-center gap-2">

                    <ToggleSwitch 
                        id="show_thinking"
                        v-model="case_store.show_thinking" 
                        class="text-xs" />

                    <label for="show_thinking">
                        Thinking
                    </label>

                    <Button type="button" 
                        text
                        size="small"
                        class="mr-2"
                        icon="pi pi-ellipsis-v" 
                        @click="toggleChatToolbarMenu" 
                        aria-haspopup="true" 
                        aria-controls="chat_toolbar_menu" />

                    <Menu ref="chat_toolbar_menu_ref"
                        id="chat_toolbar_menu" 
                        :model="chat_toolbar_items" 
                        :popup="true" />
                        
                    <!-- <Rating v-model="case_store.chat_rating" :stars="5" class="text-sm" /> -->
                </div>
            </div>

            <!-- Chat Body -->
            <div class="chat-body flex-1 overflow-y-auto p-4 ">
                <template v-for="message in case_store.filterRenderedMessages()" :key="message.message_id">
                    <div v-if="['USER'].includes(message.message_type)"
                        class="message-item user-message ">
                        <div class="message-header flex justify-between items-center gap-2">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-sm">
                                    <font-awesome-icon icon="fa-solid fa-user" />
                                </span>
                                <span class="text-xs">
                                    {{ new Date(message.created_at).toLocaleTimeString() }}
                                </span>
                            </div>
                        </div>
                        
                        <div class="message-content prose max-w-none text-base/6"
                            v-html="renderMessageText(message.text || '')" 
                            v-cite>
                        </div>
                    </div>

                    <div v-else-if="['AGENT'].includes(message.message_type) && (case_store.show_thinking && message.stage !== 'final')"
                        class="message-item agent-message " >
                        <div class="message-header message-header-on-timeline p-2 flex justify-between items-center gap-2">
                            <div class="flex items-center gap-2">
                                <span class="role-icon font-medium text-sm">
                                    <font-awesome-icon icon="fa-solid fa-robot" />
                                </span>
                                <span>
                                    {{ message.payload_json?.agent_name }}
                                </span>
                                <span class="text-xs">
                                    {{ new Date(message.created_at).toLocaleTimeString() }}
                                </span>
                            </div>
                            
                            <!-- System message toolbar -->
                            <div class="message-toolbar mt-2 flex gap-2">
                                <Button size="small" icon="pi pi-thumbs-up" class="p-button-text p-button-sm" />
                                <Button size="small" icon="pi pi-thumbs-down" class="p-button-text p-button-sm" />
                                <Button size="small" icon="pi pi-copy"  
                                    class="p-button-text p-button-sm"
                                    @click="copyMessageToClipboard(message)" />
                            </div>
                        </div>
                        
                        <div class="message-content p-2 prose max-w-none text-base/6 text-sm"
                            v-html="renderMessageText(message.text || '')" 
                            v-cite>
                        </div>
                    </div>

                    <div v-else-if="['AGENT'].includes(message.message_type) && message.stage == 'final'"
                        class="message-item border rounded-lg" >
                        <div class="message-header rounded-t-lg flex justify-between items-center gap-2 px-4 py-2 !h-12 bg-gray-100 dark:bg-gray-900 border-b">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-sm">
                                    <font-awesome-icon icon="fa-solid fa-check-circle" />
                                </span>
                                <span>
                                    Answer to your question
                                </span>
                            </div>
                            
                            <!-- System message toolbar -->
                            <div class="message-toolbar mt-2 flex gap-2">
                                <Button size="small" icon="pi pi-thumbs-up" class="p-button-text p-button-sm" />
                                <Button size="small" icon="pi pi-thumbs-down" class="p-button-text p-button-sm" />
                                <Button size="small" icon="pi pi-copy"      
                                    @click="copyMessageToClipboard(message)"
                                    class="p-button-text p-button-sm" />
                            </div>
                        </div>
                        
                        <div class="message-content prose max-w-none text-base/6 p-4"
                            v-html="renderMessageText(message.text || '')" 
                            v-cite>
                        </div>
                    </div>
                    

                    <div v-else-if="['PLACEHOLDER'].includes(message.message_type)"
                        class="message-item placeholder-message " >
                        <div class="message-content italic text-center">
                            <font-awesome-icon icon="fa-regular fa-clock" />
                            {{ message.text }}
                        </div>
                    </div>

                    <div v-else-if="['TOOL'].includes(message.message_type) && (message.stage == 'final' || case_store.show_thinking)"
                        class="message-item tool-message " >
                        <div class="message-header message-header-on-timeline p-2 flex justify-between items-center gap-2">
                            <div class="flex items-center gap-2">
                                <span class="role-icon font-medium text-sm">
                                    <font-awesome-icon icon="fa-solid fa-screwdriver-wrench" />
                                </span>
                                <span class="italic">
                                    {{ message.payload_json?.tool_name }}
                                </span>
                                <span class="text-xs">
                                    {{ new Date(message.created_at).toLocaleTimeString() }}
                                </span>
                            </div>
                            
                            <!-- System message toolbar -->
                            <div class="message-toolbar mt-2 flex gap-2">
                                <Button size="small" icon="pi pi-thumbs-up" class="p-button-text p-button-sm" />
                                <Button size="small" icon="pi pi-thumbs-down" class="p-button-text p-button-sm" />
                                <Button size="small" icon="pi pi-copy" 
                                    class="p-button-text p-button-sm"
                                    @click="copyMessageToClipboard(message)" />
                            </div>
                        </div>
                        
                        <div class="message-content text-sm p-2"
                            v-html="renderMessageText(message.text || '')" 
                            v-cite>
                        </div>

                        <div class="flex flex-row gap-2 pt-2 mt-2 p-2">
                            <div v-for="parameter_key in Object.keys(message.payload_json?.tool_parameters)" :key="parameter_key"
                                class="flex flex-col">
                                <span class="text-xs">
                                    {{ parameter_key }}
                                </span>
                                <span class="text-sm">
                                    {{ message.payload_json?.tool_parameters[parameter_key] }}
                                </span>
                            </div>
                        </div>
                    </div>
                </template>

                <div v-if="case_store.filterRenderedMessages().length === 0"
                    class="message-item user-message ">                    
                    <div class="message-content prose max-w-none text-base/6">
                        <p>
                            No messages found for the given keywords in any of the processing steps. Please try other keywords or clear the filter.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Chat Footer -->
            <div class="chat-footer border-t pl-4 pr-2 py-2 shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
                <div class="flex flex-col gap-2">
                    <!-- Input area -->
                    <Textarea 
                        v-model="case_store.input_text"
                        placeholder="Type your follow-up question here..."
                        :auto-resize="true"
                        rows="1"
                        style="max-height: 10rem;"
                        class="w-full"
                        @keydown.enter.prevent="handleSubmitMessage" />
                    
                    <!-- Action buttons -->
                    <div class="flex justify-between items-center">
                        <div class="flex gap-2">
                            <Button icon="pi pi-upload" size="small" class="p-button-text" />
                            <Button icon="pi pi-search" size="small" class="p-button-text" />
                        </div>
                        <div class="flex gap-2">
                            <Button 
                                icon="pi pi-microphone" 
                                size="small" 
                                :class="{ 'p-button-warning': case_store.is_recording }"
                                @click="case_store.toggleRecording" />
                            <Button 
                                icon="pi pi-send" 
                                size="small" 
                                @click="handleSubmitMessage" />
                        </div>
                    </div>
                </div>
            </div>
        
        </SplitterPanel>


        <!-- Evidence Panel -->
        <SplitterPanel class="flex flex-col" :size="55" :minSize="30">
            <!-- Evidence Header -->
            <div class="evidence-header h-12 flex items-center justify-between pl-4 border-b"
                style="border-color: var(--border-color);">
                <div class="flex items-center gap-2">
                    <i class="pi pi-book"></i>
                    <span class="font-semibold">
                        Evidence
                    </span>
                    <span class="text-sm text-gray-500">({{ evidence_count }})</span>
                </div>
                <div class="flex items-center gap-2">

                    <Button type="button" 
                        text
                        size="small"
                        class="mr-2"
                        icon="pi pi-ellipsis-v" 
                        @click="toggleEvidenceToolbarMenu" 
                        aria-haspopup="true" 
                        aria-controls="chat_toolbar_menu" />
                    <Menu ref="evidence_toolbar_menu_ref"
                        id="evidence_toolbar_menu" 
                        :model="evidence_toolbar_items" 
                        :popup="true" />
                </div>
            </div>

            <!-- Evidence Body -->
            <div class="evidence-body flex-1 flex">

                <!-- Evidence Tabs (Left 1/4) -->
                <div class="w-1/4 border-r overflow-x-hidden pl-2"
                    style="overflow-y: auto; height: calc(100svh - 3rem);">
                    <div v-for="(snippet, index) in evidence_snippets" 
                        :key="snippet.snippet_id"
                        :evidence-index="index"
                        class="evidence-tab p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 border-btransition-colors"
                        :class="{ 'bg-gray-100 dark:bg-gray-800 shadow-sm': snippet.snippet_id === case_store.current_evidence_tab }"
                        @click="handleEvidenceTabChange(snippet.snippet_id)">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium">
                                ({{ snippet.index + 1 }})
                            </span>
                            <template v-if="['pubmed', 'pmc', 'doi', 'webpage'].includes(snippet.source_type)">
                                <font-awesome-icon icon="fa-solid fa-globe" />
                                <span class="text-sm font-medium truncate">
                                    {{ snippet.source_type }}
                                </span>

                                <span class="text-sm font-medium truncate">
                                    {{ snippet.source_id }}
                                </span>

                            </template>

                            <template v-else-if="['clinical_guideline'].includes(snippet.source_type)">
                                <font-awesome-icon icon="fa-solid fa-book" />
                                <span>
                                    Guideline
                                </span>
                            </template>

                            <template v-else>
                                <font-awesome-icon icon="fa-regular fa-file-lines" />

                                <span class="text-sm font-medium truncate">
                                    {{ snippet.source_type.replace('_', ' ').toUpperCase() }}
                                </span>
                            </template>
                        </div>


                        <div class="text-xs text-gray-500 mt-1 truncate">
                            {{ snippet.text.substring(0, 50) }}...
                        </div>
                    </div>
                </div>

                <!-- Evidence Detail (Right 3/4) -->
                <div class="w-3/4 p-4 overflow-y-auto">
                    <div v-if="current_evidence" class="evidence-detail">
                        <div class="evidence-header mb-4">
                            <h3 class="text-lg font-semibold mb-2">{{ current_evidence.source_type.replace('_', ' ').toUpperCase() }}</h3>
                            <div class="text-sm text-gray-600 mb-2">
                                <span class="font-medium">Source:</span> {{ current_evidence.source_citation }}
                            </div>
                            <div v-if="current_evidence.source_url" class="text-sm text-blue-600 mb-2">
                                <a :href="current_evidence.source_url" target="_blank" class="hover:underline">
                                    {{ current_evidence.source_url }}
                                </a>
                            </div>
                        </div>
                        
                        <div class="evidence-content">
                            <div class="prose max-w-none">
                                <p class="whitespace-pre-wrap">{{ current_evidence.text }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <i class="pi pi-book text-4xl mb-4"></i>
                            <p>No evidence selected</p>
                        </div>
                    </div>
                </div>
            </div>
        </SplitterPanel>
        </Splitter>
    </div>
</div>





<!-- Cite Popup -->
<Popover ref="cite_popup_ref" 
    @mouseenter="handleMouseEnterOverlayPanel"
    @mouseleave="handleMouseLeaveOverlayPanel"
    class="cite-popup shadow-sm">
<div class="p-3 max-w-sm flex flex-col gap-2">
    <div class="font-medium">
        {{ case_store.current_hovered_evidence?.source_type }}
        {{ case_store.current_hovered_evidence?.source_id }}
    </div>
    <div class="text-sm">
        {{ shortenText(case_store.current_hovered_evidence?.text || '', 100) }}
    </div>

    <div class="text-sm">
        {{ case_store.current_hovered_evidence?.created_at }}
    </div>
</div>
</Popover>


</template>

<style scoped>
.main-container {
    height: 100vh;
    overflow: hidden;
}

.main-content {
    height: calc(100svh - 3rem); /* Adjust for TopMenu height */
}

.chat-body {
    scrollbar-width: thin;
}

.evidence-body {
    scrollbar-width: thin;
}

.message-item {
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
}
.message-header {
    height: 2rem;
}
.message-header-on-timeline {
    margin-left: -1.3rem;
}
.message-toolbar {
    display: none;
}
.message-item:hover .message-toolbar {
    display: inline-block;
}

.role-icon {
    background-color: var(--border-color);
    padding: 0.25rem;
    border-radius: 0.25rem;
}
.tool-message {
    margin-left: 1rem;
    border-left: 2px solid var(--border-color);
}

.agent-message {
    margin-left: 1rem;
    border-left: 2px solid var(--border-color);
}

.evidence-tab {
    transition: all 0.2s;
    cursor: pointer;
}

.evidence-tab:hover {
    transform: translateX(0.25rem);
}

.cite-popup {
    border: 1px solid var(--border-color);
}

/* Custom scrollbar */
.chat-body::-webkit-scrollbar,
.evidence-body::-webkit-scrollbar {
    width: 6px;
}

.chat-body::-webkit-scrollbar-track,
.evidence-body::-webkit-scrollbar-track {
    background-color: var(--background-color);
}

.chat-body::-webkit-scrollbar-thumb,
.evidence-body::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 9999px;
}

.chat-body::-webkit-scrollbar-thumb:hover,
.evidence-body::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
}
</style>