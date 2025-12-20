<script setup lang="ts">
import { useDataStore } from '../stores/DataStore';
import { useUserStore } from '../stores/UserStore';
import router from '../router';
const data_store = useDataStore();
const user_store = useUserStore();

const onClickToggleSidebar = () => {
    data_store.flag_sidebar_open = !data_store.flag_sidebar_open;
}

const onClickAnalyzeCase = () => {
    router.push('/');
}

const onClickUserProfile = () => {
    router.push('/user_profile');
}

const onClickCaseHistory = () => {
    router.push('/case_history');
}
</script>

<template>

<div class="left-sidebar lg:h-screen" 
    :class="{ 'left-sidebar-open': data_store.flag_sidebar_open }">
    <div class="flex flex-col gap-2">
        <div class="menu-item"
            v-tooltip.right="'Open/close sidebar'"
            @click="onClickToggleSidebar">
            <font-awesome-icon icon="fa-solid fa-bars" />
            <div class="menu-item-text">
                <span>
                    Toggle Sidebar
                </span>
            </div>
        </div>

        <div class="menu-divider"></div>

        <div class="menu-item"
            @click="onClickAnalyzeCase"
            v-tooltip.right="'Analyze new clinical case'">
            <font-awesome-icon icon="fa-regular fa-comments" />
            <div class="menu-item-text">
                <span>
                    Analyze Case
                </span>
            </div>
        </div>

        <div class="menu-item"
            @click="onClickCaseHistory"
            v-tooltip.right="'View case history'">
            <font-awesome-icon icon="fa-regular fa-folder-open" />
            <div class="menu-item-text">
                <span>
                    Case History
                </span>
            </div>
        </div>
    </div>


    <div class="flex flex-col gap-2 align-items-end">
        <div v-if="user_store.isLoggedIn"
            class="menu-item"
            @click="onClickUserProfile"
            v-tooltip.right="'View user profile'">
            <font-awesome-icon icon="fa-regular fa-user" />
            <div class="menu-item-text">
                <span>
                    User Profile
                </span>
            </div>
        </div>
        <div v-else
            class="menu-item"
            @click="router.push('/login')"
            v-tooltip.right="'Login to access more features'">
            <font-awesome-icon icon="fa-regular fa-user" />
            <div class="menu-item-text">
                <span>
                    Login
                </span>
            </div>
        </div>
    </div>
</div>

</template>

<style scoped>
.left-sidebar {
    width: 3rem;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: var(--background-color);
    border-right: 1px solid var(--border-color);
    padding: 0.5rem;
    z-index: 999;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
}
.menu-divider {
    width: 100%;
    height: 1px;
    border-bottom: 1px solid var(--border-color);
}
.menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    padding: 0.5rem;
    cursor: pointer;
    width: 100%;
    border-radius: 0.25rem;
    height: 2rem;
}
.menu-item:hover {
    background: var(--hover-color);
}
.menu-item-text {
    font-size: 1rem;
    margin-left: 0.5rem;
    display: none;
}
.left-sidebar-open {
    width: 20rem !important;
}
.left-sidebar-open .menu-item-text {
    display: block;
}
</style>
