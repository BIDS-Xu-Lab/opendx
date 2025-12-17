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
        accessToken: (state) => state.session?.access_token || '',
    },
    actions: {
        async signUp(email: string, password: string) {
            try {
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/login`
                    }
                })

                if (error) {
                    throw error
                }

                // Note: With email confirmation enabled, user won't be logged in yet
                // They need to confirm their email first
                console.log('Signup successful, confirmation email sent to:', email);

                return { success: true, data }

            } catch (err) {
                this.error = err instanceof Error ? err.message : String(err);
                return { success: false, error: err }
            }
        },

        async signIn(email: string, password: string) {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                })

                if (error) {
                    throw error
                }

                // Save user and session
                this.user = data.user;
                this.session = data.session;

                // Store session in localStorage for persistence
                if (data.session) {
                    localStorage.setItem('supabase_session', JSON.stringify(data.session));
                }

                return { success: true, data }

            } catch (err) {
                this.error = err instanceof Error ? err.message : String(err);
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
                this.error = null;

                // Clear localStorage
                localStorage.removeItem('supabase_session');

                return { success: true }

            } catch (err) {
                this.error = err instanceof Error ? err.message : String(err);
                return { success: false, error: err }
            }
        },

        async initializeAuth() {
            try {
                // Check for existing session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (session) {
                    this.user = session.user;
                    this.session = session;
                }

                // Listen for auth state changes
                supabase.auth.onAuthStateChange((_event, session) => {
                    this.user = session?.user || null;
                    this.session = session;

                    if (session) {
                        localStorage.setItem('supabase_session', JSON.stringify(session));
                    } else {
                        localStorage.removeItem('supabase_session');
                    }
                });

            } catch (err) {
                this.error = err instanceof Error ? err.message : String(err);
                console.error('Failed to initialize auth:', err);
            }
        }
    }
})


