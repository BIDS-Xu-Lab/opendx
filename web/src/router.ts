import { createWebHistory, createRouter } from 'vue-router'

import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Signup from './pages/Signup.vue';
import Analyze from './pages/Analyze.vue';
import UserProfile from './pages/UserProfile.vue';
import CaseHistory from './pages/CaseHistory.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    {
        path: '/analyze',
        component: Analyze,
        meta: { requiresAuth: true }  // This route requires authentication
    },
    {
        path: '/user_profile',
        component: UserProfile,
        meta: { requiresAuth: true }  // This route requires authentication
    },
    {
        path: '/case_history',
        component: CaseHistory,
        meta: { requiresAuth: true }  // This route requires authentication
    },
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL
    ),
    routes,
})

// NOTE: Auth guard is registered in main.ts AFTER auth initialization
// This ensures the session is restored before checking authentication

export default router