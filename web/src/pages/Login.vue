<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/UserStore';
import router from '../router';

const user_store = useUserStore();

const email = ref('');
const password = ref('');
const check_remember_me = ref(true);

const onClickBackToHomepage = () => {
    router.push('/');
}

async function onClickSignIn() {
    const result = await user_store.signIn(email.value, password.value);
    if (result.success) {
        router.push('/');
    } else {
        console.error(result.error);
    }
}

onMounted(() => {
    console.log('Login page mounted');
})
</script>
<template>
<div class="py-16 lg:w-1/2 max-sm:w-full lg:translate-x-1/2">
    <div class="p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-sm mx-auto flex flex-col gap-8">
        <div>
            <a href="./" class="text-xs"
                @click="onClickBackToHomepage"
                title="Back to Homepage">
                &larr;
                Back to Homepage
            </a>
        </div>
        <div class="flex flex-col items-center gap-4">
            <div class="flex flex-col items-center gap-2 w-full">
                <div class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight text-center w-full">
                    <font-awesome-icon icon="fa-solid fa-door-open" />
                    Welcome to OpenMDX
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-6 w-full">
            <div class="flex flex-col gap-2 w-full">
                <label for="email1" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">Email Address</label>
                <InputText id="email1" type="text" 
                    v-model="email"
                    placeholder="Email address" 
                    class="w-full px-3 py-2 shadow-sm rounded-lg" />
            </div>
            <div class="flex flex-col gap-2 w-full">
                <label for="password1" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">Password</label>

                <Password id="password1" 
                    v-model="password" 
                    placeholder="Password" 
                    :toggleMask="true" 
                    :feedback="false" 
                    input-class="w-full!" 
                    @keyup.enter="onClickSignIn" />
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
                <div class="flex items-center gap-2">
                    <Checkbox id="rememberme1" v-model="check_remember_me" :binary="true" />
                    <label for="rememberme1" class="text-surface-900 dark:text-surface-0 leading-normal">Remember me</label>
                </div>
            </div>
        </div>
        <Button label="Sign In" icon="pi pi-user" 
            @click="onClickSignIn"
            class="w-full py-2 rounded-lg flex justify-center items-center gap-2">
            <template #icon>
                <i class="pi pi-user text-base! leading-normal!" />
            </template>
        </Button>
    </div>
</div>
</template>
