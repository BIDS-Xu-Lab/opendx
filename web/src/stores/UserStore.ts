import { defineStore } from 'pinia';
import { supabase } from '../utils/supabase';
import type { User, Session } from '@supabase/supabase-js';


export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        session: null as Session | null,
        error: null as string | null
    }),

    getters: {
        isLoggedIn: (state) => !!state.session,
        userEmail: (state) => state.user?.email || '',
    },
    actions: {
        async signIn(email: string, password: string) {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                })

                if (error) {
                    throw error
                }

                return { success: true, data }

            } catch (err) {
                return { success: false, error: err }
            }
        },


        async signOut() {
            try {
                const { error } = await supabase.auth.signOut()

                if (error) {
                    throw error
                }

                // Clear local state
                this.user = null;
                this.session = null;

                return { success: true }

            } catch (err) {
                return { success: false, error: err }
            }
        }
    }
})


