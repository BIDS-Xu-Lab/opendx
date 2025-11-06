import { createWebHistory, createRouter } from 'vue-router'

import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Analyze from './pages/Analyze.vue';
import UserProfile from './pages/UserProfile.vue';
import CaseHistory from './pages/CaseHistory.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/analyze', component: Analyze },
    { path: '/user_profile', component: UserProfile },
    { path: '/case_history', component: CaseHistory },
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL
    ),
    routes,
})

export default router