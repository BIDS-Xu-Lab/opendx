import { defineStore } from 'pinia';
import type { ClinicalCase } from '../models/ClinicalCase';


export const useDataStore = defineStore('data', {
    state: () => ({
        current_page: '',
        color_scheme: 'light',

        flag_sidebar_open: false,

        clinical_cases: [] as ClinicalCase[],

        // ui
        show_evidence_panel: true,

        // hold a reference to other stores
        case_store: null,
        user_store: null,
    }),

    getters: {
    },
    
    actions: {
        init() {
            this.updateColorScheme();
        },

        updateColorScheme() {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (darkModeMediaQuery.matches) {
                this.color_scheme = 'dark';
            } else {
                this.color_scheme = 'light';
            }
        },

        setCurrentPage(page: string) {
            this.current_page = page;
        },

        isDarkMode() {
            return this.color_scheme === 'dark';
        },
    }
})