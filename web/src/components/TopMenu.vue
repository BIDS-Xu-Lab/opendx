<script setup lang="ts">
import { ref, computed } from 'vue';
import router from '../router';
import { useUserStore } from '../stores/UserStore';

const items = ref([]);
const user_store = useUserStore();

const isLoggedIn = computed(() => user_store.isLoggedIn);
const userEmail = computed(() => user_store.userEmail);

const onClickSignIn = () => {
    router.push('/login');
}

const onClickSignUp = () => {
    router.push('/signup');
}

const onClickSignOut = async () => {
    const result = await user_store.signOut();
    if (result.success) {
        router.push('/');
    } else {
        console.error('Sign out failed:', result.error);
    }
}

</script>

<template>
<div class="main-menu">
<MegaMenu :model="items" style="border-radius: 0; border: none; background: transparent;">
    <template #start>
    </template>
    <!-- 
    <template #item="{ item }">
        <a v-if="item.root" class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative font-semibold text-lg uppercase" style="border-radius: 2rem">
            <span>{{ item.label }}</span>
        </a>
        <a v-else-if="!item.image" class="flex items-center p-4 cursor-pointer mb-2 gap-3">
            <span class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12">
                <i :class="[item.icon, 'text-lg']"></i>
            </span>
            <span class="inline-flex flex-col gap-1">
                <span class="font-bold text-lg">{{ item.label }}</span>
                <span class="whitespace-nowrap">{{ item.subtext }}</span>
            </span>
        </a>
        <div v-else class="flex flex-col items-start gap-4 p-2">
            <img alt="megamenu-demo" :src="item.image" class="w-full" />
            <span>{{ item.subtext }}</span>
            <Button :label="item.label" variant="outlined" />
        </div> 
    </template>
    -->
    <template #end>
        <div v-if="!isLoggedIn" class="flex items-center gap-2">
            <Button size="small"
                @click="onClickSignUp"
                label="Sign Up"
                icon="pi pi-user-plus"
                outlined />
            <Button size="small"
                @click="onClickSignIn"
                label="Sign In"
                icon="pi pi-user" />
        </div>
        <div v-else class="flex items-center gap-3">
            <span class="text-sm">
                <!-- Welcome, {{ userEmail }} -->
                Welcome, User
            </span>
            <Button size="small"
                text
                v-tooltip.bottom="'Sign out'"
                @click="onClickSignOut"
                icon="pi pi-sign-out"
                severity="secondary" />
        </div>
    </template>
</MegaMenu>
</div>

</template>

<style scoped>
</style>