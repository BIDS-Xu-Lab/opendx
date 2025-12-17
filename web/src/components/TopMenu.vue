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