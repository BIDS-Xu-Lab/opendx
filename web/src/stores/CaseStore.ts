import { defineStore } from 'pinia';
import type { ClinicalCase, EvidenceSnippet, Message } from '../models/ClinicalCase';
import { MessageType, MessageStage, createEmptyMessage, createEmptyClinicalCase } from '../models/ClinicalCase';
import { backend } from '../Backend';

export const useCaseStore = defineStore('case', {
    state: () => ({
        clinical_case: null as ClinicalCase | null,
        current_evidence_tab: null as string | null,
        show_thinking: true,
        chat_rating: 0,
        input_text: '',
        is_recording: false,

        // filter rendered messages by keywords
        raw_filter_keywords: '',

        // something for the hover state
        hovered_snippet_id: null as string | null,
        cite_popup_ref: null,
        hide_overlay_panel_timeout: null as number | null,

        // streaming state
        stream_event_source: null as EventSource | null,
        is_streaming: false,
        final_message_typing_text: null as string | null,
        stream_updated_at: new Date().toISOString(),
    }),

    getters: {
        filter_keywords: (state) => {
            // if several words are wrapped with quotes, treat them as a single keyword
            const input = state.raw_filter_keywords?.trim() || "";
            if (!input) return [];

            // Match either quoted phrases or single words
            // e.g. "heart failure" drug cancer → ["heart failure", "drug", "cancer"]
            const regex = /"([^"]+)"|'([^']+)'|(\S+)/g;
            const keywords: string[] = [];

            let match;
            while ((match = regex.exec(input)) !== null) {
                // match[1] = double-quoted phrase
                // match[2] = single-quoted phrase
                // match[3] = unquoted word
                const keyword = match[1] || match[2] || match[3];
                if (keyword) keywords.push(keyword.trim());
            }

            return keywords;
        },
        evidence_dict: (state) => {
            const dict: { [key: string]: any } = {};
            const snippets = state.clinical_case?.evidence_snippets || [];
            snippets.forEach((snippet: EvidenceSnippet, index: number) => {
                snippet.index = index;
                dict[snippet.snippet_id] = snippet;
            });
            return dict;
        },

        rendered_messages: (state) => {
            if (state.show_thinking) {
                return state.clinical_case?.messages || [];

            } else {
                // combine non-user and non-final messages as a placeholder
                const _messages: Message[] = [];
                let count_intermediate = 0;
                let add_placeholder = false;
                let add_message = false;
                for (const message of state.clinical_case?.messages || []) {
                    if (message.message_type == MessageType.USER) {
                        add_message = true;
                        add_placeholder = count_intermediate > 0? true : false;

                    } else if (message.stage == MessageStage.FINAL) {
                        add_message = true;
                        add_placeholder = count_intermediate > 0? true : false;

                    } else {
                        count_intermediate++;
                        add_message = false;
                    }

                    if (add_placeholder) {
                        let msg = createEmptyMessage(
                            `placeholder_${count_intermediate}`,
                            MessageType.PLACEHOLDER,
                            `Think process of ${count_intermediate} steps ...`,
                            {},
                            MessageStage.THINKING
                        );
                        _messages.push(msg);
                        add_placeholder = false;
                        count_intermediate = 0;
                    }
                    if (add_message) {
                        _messages.push(message);
                    }
                }
                return _messages;
            }
        },

        evidence_snippets: (state) => state.clinical_case?.evidence_snippets || [],
        current_evidence: (state) => {
            for (const snippet of state.clinical_case?.evidence_snippets || []) {
                if (snippet.snippet_id === state.current_evidence_tab) {
                    return snippet;
                }
            }
            return null;
        },
        current_hovered_evidence: (state) => {
            for (const snippet of state.clinical_case?.evidence_snippets || []) {
                if (snippet.snippet_id === state.hovered_snippet_id) {
                    return snippet;
                }
            }
            return null;
        },
        evidence_count: (state) => state.clinical_case?.evidence_snippets?.length || 0,
    },

    actions: {
        initializeClinicalCase(
            user_id: string,
            user_message: string) {
            this.clinical_case = createEmptyClinicalCase(
            {
                // TODO: get title from user message
                title: "New clinical case", 
                messages: [
                    createEmptyMessage(
                        user_id,
                        MessageType.USER,
                        user_message,
                    ),
                ],
            });

            // then, send out the case to backend
            backend.createCase(
                this.clinical_case?.title || "New clinical case",
                user_message,
            );
            // next, start the SSE stream
        },

        setClinicalCase(case_data: ClinicalCase | null) {
            this.clinical_case = case_data;
        },

        setCurrentEvidenceTab(snippet_id: string) {
            this.current_evidence_tab = snippet_id;
        },

        setHoveredSnippetId(snippet_id: string, event: MouseEvent) {
            this.clearHideHoveredSnippetTimeout();
            this.hovered_snippet_id = snippet_id;
            if (this.cite_popup_ref) {
                if ((this.cite_popup_ref as any).visible) {
                    (this.cite_popup_ref as any).hide();
                }
                (this.cite_popup_ref as any).show(event);
            }
        },

        hideHoveredSnippet(right_now: boolean = false) {
            if (this.hide_overlay_panel_timeout) {
                clearTimeout(this.hide_overlay_panel_timeout);
            }
            if (right_now) {
                if (this.cite_popup_ref) {
                    (this.cite_popup_ref as any).hide();
                }
            } else {
                this.hide_overlay_panel_timeout = setTimeout(() => {
                    if (this.cite_popup_ref) {
                        (this.cite_popup_ref as any).hide();
                    }
                }, 500);
            }
        },

        clearHideHoveredSnippetTimeout() {
            if (this.hide_overlay_panel_timeout) {
                clearTimeout(this.hide_overlay_panel_timeout);
            }
        },

        toggleThinking() {
            this.show_thinking = !this.show_thinking;
        },

        setChatRating(rating: number) {
            this.chat_rating = rating;
        },

        setInputText(text: string) {
            this.input_text = text;
        },

        toggleRecording() {
            this.is_recording = !this.is_recording;
        },

        addMessage(message: Message) {
            if (this.clinical_case) {
                this.clinical_case.messages.push(message);
                this.clinical_case.updated_at = new Date().toISOString();
            }
        },

        hasKeywordsInMessage(message: Message) {
            const keywords = this.filter_keywords;
            if (keywords.length === 0) return true;
            return keywords.some(keyword => 
                message.text?.toLowerCase().includes(keyword.toLowerCase())
            );
        },

        filterRenderedMessages() {
            const messages = this.rendered_messages;
            if (this.filter_keywords.length === 0) return messages;
            return messages.filter(message => this.hasKeywordsInMessage(message));
        },

        copyChatHistory() {
            const messages = this.clinical_case?.messages || [];
            const chatText = messages.map(msg => {
                const sender = msg.message_type === 'USER' ? 'User' : 
                             msg.message_type === 'AGENT' ? 'Agent' : 
                             msg.message_type === 'TOOL' ? 'Tool' : 'System';
                return `${sender}: ${msg.text || ''}`;
            }).join('\n\n');
            
            navigator.clipboard.writeText(chatText);
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

        exportEvidence() {
            const evidence = this.evidence_snippets;
            const evidenceData = {
                case_id: this.clinical_case?.case_id,
                title: this.clinical_case?.title,
                export_date: new Date().toISOString(),
                evidence_snippets: evidence.map(snippet => ({
                    id: snippet.snippet_id,
                    text: snippet.text,
                    source_id: snippet.source_id,
                    source_type: snippet.source_type,
                    source_url: snippet.source_url,
                    source_citation: snippet.source_citation,
                    created_at: snippet.created_at
                }))
            };
            
            const blob = new Blob([JSON.stringify(evidenceData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `evidence_${this.clinical_case?.case_id || 'unknown'}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },

        startMockupStream() {
            if (!this.clinical_case || this.is_streaming) {
                return;
            }

            this.is_streaming = true;
            this.final_message_typing_text = null;

            // Clear existing messages except the first USER message
            if (this.clinical_case.messages.length > 0) {
                const firstMessage = this.clinical_case.messages[0];
                if (firstMessage) {
                    this.clinical_case.messages = [firstMessage];
                }
            }

            const eventSource = backend.streamCaseMockup(
                this.clinical_case.case_id,
                (message: Message) => {
                    // Handle intermediate messages
                    this.addMessage(message);
                },
                (message: Message) => {
                    // Handle final message - start typing animation
                    this.handleFinalMessage(message);
                    this.is_streaming = false;
                },
                (error: any) => {
                    console.error('Stream error:', error);
                    this.is_streaming = false;
                }
            );

            this.stream_event_source = eventSource;
        },

        handleFinalMessage(message: Message) {
            // Start typing animation for final message
            if (message.text) {
                // Add the message with empty text first
                const typingMessage: Message = {
                    ...message,
                    text: '',
                };
                this.addMessage(typingMessage);
                
                // Start typing animation
                this.typeFinalMessage(
                    message.text
                    // + '\n\n' +
                    // '## References' +
                    // '\n\n' +
                    // // concat all evidence snippets
                    // this.evidence_snippets.map(snippet => {
                    //     return snippet.snippet_id + '. ' + snippet.source_citation;
                    // }).join('\n\n') + 
                    // '\n\n'
                );
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

                console.log('typing lastMessage:', currentIndex);
                
                if (lastMessage && currentIndex < fullText.length) {
                    // Update the last message's text
                    lastMessage.text = fullText.substring(0, currentIndex + 1);
                    this.clinical_case.updated_at = new Date().toISOString();
                    currentIndex++;

                    // update the stream_updated_at
                    this.stream_updated_at = new Date().toISOString();
                    setTimeout(typeNextChar, typingSpeed);
                } else {
                    // Typing complete
                    this.final_message_typing_text = null;
                    this.stream_updated_at = new Date().toISOString();

                    // just show all the references at the end
                    let references = "## References" + '\n\n' + this.evidence_snippets.map(snippet => {
                        return snippet.snippet_id + '. ' + snippet.source_citation;
                    }).join('\n\n');
                    if (lastMessage) {
                        lastMessage.text = fullText + '\n\n' + references;
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
            this.final_message_typing_text = null;
        }
    }
});
