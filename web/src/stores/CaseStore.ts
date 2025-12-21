import { defineStore } from 'pinia';
import type { ClinicalCase, Message } from '../models/ClinicalCase';
import { MessageType, MessageStage, createEmptyMessage, createEmptyClinicalCase } from '../models/ClinicalCase';
import { backend } from '../Backend';

export const useCaseStore = defineStore('case', {
    state: () => ({
        clinical_case: null as ClinicalCase | null,
        input_text: '',
        show_thinking: true,

        // Streaming state
        is_streaming: false,
        stream_event_source: null as { close: () => void } | null,
        stream_updated_at: new Date().toISOString(),
    }),

    getters: {
        messages: (state) => state.clinical_case?.messages || [],
        evidence_snippets: (state) => state.clinical_case?.evidence_snippets || [],
    },

    actions: {
        setClinicalCase(case_data: ClinicalCase | null) {
            this.clinical_case = case_data;
        },

        setInputText(text: string) {
            this.input_text = text;
        },

        toggleThinking() {
            this.show_thinking = !this.show_thinking;
        },

        addMessage(message: Message) {
            console.log('* current messages:', this.clinical_case?.messages);
            if (this.clinical_case) {
                this.clinical_case.messages.push(message);
                this.clinical_case.updated_at = new Date().toISOString();
            }
        },

        exportChatHistory() {
            const messages = this.clinical_case?.messages || [];
            const chatData = {
                case_id: this.clinical_case?.case_id,
                title: this.clinical_case?.title,
                export_date: new Date().toISOString(),
                messages: messages.map(msg => ({
                    id: msg.message_id,
                    type: msg.message_type,
                    text: msg.text,
                    timestamp: msg.created_at,
                    payload: msg.payload_json
                }))
            };

            const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat_history_${this.clinical_case?.case_id || 'unknown'}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },

        async startStream(caseText: string) {
            if (this.is_streaming) {
                return;
            }

            this.is_streaming = true;

            // Create initial clinical case with user message
            const user_message = createEmptyMessage(
                'user',
                MessageType.USER,
                caseText,
            );

            this.clinical_case = createEmptyClinicalCase({
                title: caseText.substring(0, 100),
                messages: [user_message],
            });

            console.log('Starting stream with clinical_case:', this.clinical_case);

            try {
                // Start chat stream from backend
                const stream = await backend.chat(
                    caseText,
                    // onProgress:
                    (message: string) => {
                        const progressMessage = createEmptyMessage(
                            'system',
                            MessageType.SYSTEM,
                            message,
                            {},
                            MessageStage.THINKING
                        );
                        this.addMessage(progressMessage);
                        this.stream_updated_at = new Date().toISOString();
                    },
                    // onResult:
                    (data: any) => {
                        const resultText = data.overall_reasoning || '';

                        // Create final agent message
                        const finalMessage = createEmptyMessage(
                            'agent',
                            MessageType.AGENT,
                            resultText,
                            data,
                            MessageStage.FINAL
                        );

                        // Add final message with typing animation
                        this.handleFinalMessage(finalMessage);
                        this.is_streaming = false;

                        // Update case status
                        if (this.clinical_case) {
                            this.clinical_case.status = 'COMPLETED' as any;
                        }
                    },
                    // onError:
                    (error: string) => {
                        console.error('Stream error:', error);
                        const errorMessage = createEmptyMessage(
                            'system',
                            MessageType.SYSTEM,
                            `Error: ${error}`,
                            {},
                            'error' as any
                        );
                        this.addMessage(errorMessage);
                        this.is_streaming = false;

                        if (this.clinical_case) {
                            this.clinical_case.status = 'ERROR' as any;
                        }
                    },
                    // onCaseCreated:
                    (case_id: string) => {
                        if (this.clinical_case) {
                            this.clinical_case.case_id = case_id;
                            this.clinical_case.status = 'PROCESSING' as any;
                        }
                    }
                );

                // Store stream reference for cleanup
                this.stream_event_source = stream;
            } catch (error: any) {
                console.error('Failed to start stream:', error);
                const errorMessage = createEmptyMessage(
                    'system',
                    MessageType.SYSTEM,
                    `Failed to connect: ${error.message}`,
                    {},
                    'error' as any
                );
                this.addMessage(errorMessage);
                this.is_streaming = false;
            }
        },

        handleFinalMessage(message: Message) {
            if (message.text) {
                // Add the message with empty text first
                const typingMessage: Message = {
                    ...message,
                    text: '',
                };
                this.addMessage(typingMessage);

                // Start typing animation
                this.typeFinalMessage(message.text);
            } else {
                this.addMessage(message);
            }
        },

        typeFinalMessage(fullText: string) {
            let currentIndex = 0;
            const typingSpeed = 2; // milliseconds per character

            const typeNextChar = () => {
                if (!this.clinical_case) return;

                const messages = this.clinical_case.messages;
                if (messages.length === 0) return;

                const lastMessage = messages[messages.length - 1];

                if (lastMessage && currentIndex < fullText.length) {
                    // Update the last message's text
                    lastMessage.text = fullText.substring(0, currentIndex + 1);
                    this.clinical_case.updated_at = new Date().toISOString();
                    currentIndex++;

                    this.stream_updated_at = new Date().toISOString();
                    setTimeout(typeNextChar, typingSpeed);
                } else {
                    // Typing complete - add references if there are evidence snippets
                    if (this.evidence_snippets.length > 0 && lastMessage) {
                        const references = "\n\n## References\n\n" +
                            this.evidence_snippets.map(snippet => {
                                return `${snippet.snippet_id}. ${snippet.source_citation || snippet.source_id}`;
                            }).join('\n\n');
                        lastMessage.text = fullText + references;
                    }
                    this.clinical_case.updated_at = new Date().toISOString();
                    this.stream_updated_at = new Date().toISOString();
                }
            };

            // Start typing after a short delay
            setTimeout(typeNextChar, typingSpeed);
        },

        stopStream() {
            if (this.stream_event_source) {
                this.stream_event_source.close();
                this.stream_event_source = null;
            }
            this.is_streaming = false;
        }
    }
});
