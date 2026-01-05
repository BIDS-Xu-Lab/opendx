<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useCaseStore } from '../stores/CaseStore';
import { useUserStore } from '../stores/UserStore';
import LeftSidebar from '../components/LeftSidebar.vue';
import { MessageType } from '../models/ClinicalCase';
import type { Message } from '../models/ClinicalCase';
import { marked } from 'marked';
import { useToast } from 'primevue/usetoast';
import { backend } from '../Backend';

const toast = useToast();
const route = useRoute();

// PrimeVue components
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

const case_store = useCaseStore();
const user_store = useUserStore();

// Computed properties
const isInputDisabled = computed(() => {
    return case_store.is_streaming ||
           (case_store.clinical_case?.status === 'COMPLETED' ||
            case_store.clinical_case?.status === 'PROCESSING');
});

// Methods
const handleSubmitMessage = () => {
    if (case_store.input_text.trim() && !isInputDisabled.value) {
        const caseText = case_store.input_text.trim();
        case_store.setInputText('');  // Clear input immediately
        case_store.startStream(caseText);  // Start streaming
    }
};

const renderMessageText = (text: string) => {
    return marked.parse(text);
};

const renderFinalMessage = (message: Message) => {
    // just use the payload_json to generate the final message
    const payload = message.payload_json;

    if (!payload) {
        return renderMessageText('No result available.');
    }

    let resultText = '';

    // first, get the predictions
    if (payload.predictions && Array.isArray(payload.predictions)) {
        resultText += '### Predictions\n';
        payload.predictions.forEach((pred: string, idx: number) => {
            resultText += `${idx + 1}. ${pred}\n`;
        });
        resultText += '\n\n';
    }

    // then, the warning_diagnosis
    if (payload.warning_diagnosis && Array.isArray(payload.warning_diagnosis)) {
        resultText += '### Warning Diagnosis\n';
        payload.warning_diagnosis.forEach((warn: string, idx: number) => {
            resultText += `${idx + 1}. ${warn}\n`;
        });
        resultText += '\n\n';
    }

    // then, the overall_reasoning
    if (payload.overall_reasoning && typeof payload.overall_reasoning === 'string') {
        resultText += '### Overall Reasoning\n';
        resultText += `${payload.overall_reasoning}\n\n`;
    }

    // then, actions
    if (payload.actions && Array.isArray(payload.actions)) {
        resultText += '### Recommended Actions\n';
        payload.actions.forEach((action: string, idx: number) => {
            resultText += `${idx + 1}. ${action}\n`;
        });
        resultText += '\n\n';
    }

    return marked.parse(resultText);
};

const copyMessageToClipboard = (message: Message) => {
    navigator.clipboard.writeText(message.text || '');
    toast.add({
        severity: 'info',
        summary: 'Copied to clipboard',
        detail: 'The message has been copied to your clipboard',
        life: 3000
    });
};

// Auto-scroll functionality
const chat_body_ref = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
    if (chat_body_ref.value) {
        chat_body_ref.value.scrollTop = chat_body_ref.value.scrollHeight;
    }
};

// Watch stream updates for typing animation
// watch(() => case_store.stream_updated_at, async () => {
//     await nextTick();
//     scrollToBottom();
// });

// watch(() => case_store.messages.length, async () => {
//     await nextTick();
//     scrollToBottom();
// });

// Initialize case data
onMounted(async () => {
    const caseId = route.params.case_id as string | undefined;

    if (caseId && user_store.isLoggedIn) {
        // Load existing case from backend (only if logged in)
        try {
            const fullCase = await backend.getFullCase(caseId);
            case_store.setClinicalCase(fullCase);
        } catch (error: any) {
            console.error('Failed to load case:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Failed to load case',
                life: 5000
            });
        }
    } else {
        // Start with empty case for new sessions
        // user can just go to this page or redirect from another page
        // so do nothing here
    }

    // Scroll to bottom on initial mount
    nextTick(() => scrollToBottom());
});

// Cleanup streaming on unmount
onBeforeUnmount(() => {
    case_store.stopStream();
});
</script>

<template>
<LeftSidebar />
<div class="main-container flex flex-col h-screen">

<div ref="chat_body_ref" class="scroll-wrapper flex-1 overflow-y-auto">
    <div class="main-content">
        <!-- Chat Body -->
        <div class="chat-body p-4 w-full">
        <template v-for="message, message_idx in case_store.messages" :key="message.message_id">
            <!-- User Message -->
            <div v-if="message.message_type === MessageType.USER"
                class="message-item user-message">
                <div class="message-content prose max-w-none text-base/6"
                    v-html="renderMessageText(message.text || '')">
                </div>
            </div>

            <!-- Agent Message (Final) -->
            <div v-else-if="message.message_type === MessageType.AGENT && message.stage === 'final'"
                class="message-item agent-message border rounded-lg">
                <div class="message-header rounded-t-lg flex justify-between items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b">
                    <div class="flex items-center gap-2">
                        <span class="font-medium text-sm">
                            <font-awesome-icon icon="fa-solid fa-check-circle" />
                            Result
                        </span>
                    </div>

                    <div class="message-toolbar flex gap-2">
                        <Button size="small" icon="pi pi-copy"
                            @click="copyMessageToClipboard(message)"
                            class="p-button-text p-button-sm" />
                    </div>
                </div>

                <div class="message-content prose max-w-none text-base/6 p-4"
                    v-html="renderFinalMessage(message)">
                </div>
            </div>

            <!-- System Message (only when show_thinking is enabled) -->
            <div v-else-if="message.message_type === MessageType.SYSTEM && case_store.show_thinking"
                class="message-item system-message">
                <div class="message-content text-sm text-gray-600 dark:text-gray-400 italic">
                    <font-awesome-icon v-if="message_idx == case_store.messages.length - 1"
                        icon="fa-regular fa-circle" class="mr-2" />
                    <font-awesome-icon v-else
                        icon="fa-solid fa-circle-check" class="mr-2" />
                    {{ message.text }}
                </div>
            </div>
        </template>


        <div v-if="case_store.is_streaming" class="typing-indicator ml-2">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>

        <!-- Empty state -->
        <div v-if="case_store.messages.length === 0"
            class="empty-state text-center py-12">
            <div class="text-6xl mb-4">
                <font-awesome-icon icon="fa-solid fa-comments" />
            </div>
            <h2 class="text-2xl font-bold mb-2">Ask a Clinical Question</h2>
            <p class="text-gray-600 dark:text-gray-400">
                Type your clinical case or question below to get started.
                <span v-if="!user_store.isLoggedIn" class="block mt-2 text-sm">
                    Note: You're using the app anonymously. Sign in to save your chat history.
                </span>
            </p>
        </div>
        </div>
    </div>



    <!-- Chat Footer -->
    <div class="chat-footer w-full border-t pl-4 pr-2 py-4">
        <div class="flex flex-col gap-2">
            <!-- Input area -->
            <Textarea
                v-model="case_store.input_text"
                :placeholder="isInputDisabled ? 'This case has been submitted.' : 'Type your clinical case here...'"
                :auto-resize="true"
                :disabled="isInputDisabled"
                rows="1"
                style="max-height: 10rem;"
                class="w-full"
                @keydown.enter.prevent="handleSubmitMessage" />

            <!-- Action buttons -->
            <div class="flex justify-between items-center">
                <div class="flex gap-2">
                    <!-- <Button
                        v-if="case_store.messages.length > 0"
                        icon="pi pi-download"
                        size="small"
                        label="Export Chat"
                        class="p-button-text"
                        @click="case_store.exportChatHistory()" />
                    <Button
                        v-if="case_store.messages.length > 0"
                        :icon="case_store.show_thinking ? 'pi pi-eye-slash' : 'pi pi-eye'"
                        size="small"
                        :label="case_store.show_thinking ? 'Hide Thinking' : 'Show Thinking'"
                        class="p-button-text"
                        @click="case_store.toggleThinking()" /> -->
                </div>
                <div class="flex gap-2">
                    <Button
                        icon="pi pi-send"
                        size="small"
                        :disabled="isInputDisabled || !case_store.input_text.trim()"
                        :loading="case_store.is_streaming"
                        @click="handleSubmitMessage" />
                </div>
            </div>
        </div>
    </div>
</div>

</div>
</template>

<style scoped>
.scroll-wrapper {
    width: 100%;
    position: relative;
}

.main-content {
    min-width: 30rem;
    max-width: 60rem;
    width: auto;
    margin: 0 auto;
}

.chat-body {
    padding-bottom: 25svh;
}

.chat-footer {
    max-width: 60rem;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--background-color);
    z-index: 10;
}

.message-item {
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
}

.message-header {
    height: 3rem;
}

.message-toolbar {
    opacity: 0;
    transition: opacity 0.2s;
}

.message-item:hover .message-toolbar {
    opacity: 1;
}

.user-message {
    margin-bottom: 2rem;
    display: flex;
    align-items: flex-end;
}
.user-message .message-content {
    width: 80%;
    border-radius: 8px;
    padding: 1rem;
    background-color: var(--user-message-background-color);
}

.agent-message {
    margin-bottom: 2rem;
}

.system-message {
    margin-left: 1rem;
}

.empty-state {
    color: var(--text-color);
}

/* Typing animation */
.typing-indicator {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 8px 0;
}

.typing-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--text-color);
    opacity: 0.6;
    animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes typing-bounce {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
