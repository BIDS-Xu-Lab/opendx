<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/UserStore';
import router from '../router';

const user_store = useUserStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const passwordsMatch = computed(() => {
    if (!confirmPassword.value) return true; // Don't show error until user starts typing
    return password.value === confirmPassword.value;
});

const isFormValid = computed(() => {
    return email.value &&
           password.value &&
           password.value.length >= 6 &&
           passwordsMatch.value;
});

const onClickBackToHomepage = () => {
    router.push('/');
}

const onClickSignIn = () => {
    router.push('/login');
}

async function onClickSignUp() {
    if (!isFormValid.value) {
        error.value = 'Please fill in all fields correctly';
        return;
    }

    loading.value = true;
    error.value = '';
    successMessage.value = '';

    try {
        const result = await user_store.signUp(email.value, password.value);

        if (result.success) {
            // Show success message about email confirmation
            successMessage.value = 'Account created! Please check your email to confirm your account before signing in.';

            // Clear form
            email.value = '';
            password.value = '';
            confirmPassword.value = '';

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } else {
            // Handle specific errors
            const errorMessage = result.error?.message || String(result.error);

            if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
                error.value = 'This email is already registered. Please sign in instead.';
                // Show button to go to login
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else if (errorMessage.includes('Invalid email')) {
                error.value = 'Please enter a valid email address';
            } else if (errorMessage.includes('Password')) {
                error.value = 'Password must be at least 6 characters long';
            } else {
                error.value = errorMessage || 'Failed to create account. Please try again.';
            }
        }
    } catch (err) {
        error.value = 'An unexpected error occurred. Please try again.';
        console.error('Signup error:', err);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
<div class="py-16 lg:w-1/2 max-sm:w-full lg:translate-x-1/2">
    <div class="p-8 shadow-sm rounded-2xl w-full max-w-sm mx-auto flex flex-col gap-8">
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
                    <font-awesome-icon icon="fa-solid fa-user-plus" />
                    Create Your Account
                </div>
                <p class="text-sm text-center text-surface-600 dark:text-surface-400">
                    Join OpenMDX to start analyzing clinical cases
                </p>
            </div>
        </div>

        <!-- Success Message -->
        <Message v-if="successMessage" severity="success" :closable="false">
            {{ successMessage }}
        </Message>

        <!-- Error Message -->
        <Message v-if="error" severity="error" :closable="false">
            {{ error }}
        </Message>

        <div class="flex flex-col gap-6 w-full">
            <div class="flex flex-col gap-2 w-full">
                <label for="email" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">
                    Email Address
                </label>
                <InputText
                    id="email"
                    type="email"
                    v-model="email"
                    placeholder="your.email@example.com"
                    class="w-full px-3 py-2 shadow-sm rounded-lg"
                    :disabled="loading" />
            </div>

            <div class="flex flex-col gap-2 w-full">
                <label for="password" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">
                    Password
                </label>
                <Password
                    id="password"
                    v-model="password"
                    placeholder="At least 6 characters"
                    :toggleMask="true"
                    :feedback="true"
                    input-class="w-full!"
                    :disabled="loading">
                    <template #header>
                        <h6>Pick a password</h6>
                    </template>
                    <template #footer>
                        <p class="mt-2 text-xs">Suggestions:</p>
                        <ul class="pl-2 ml-2 mt-0 text-xs" style="line-height: 1.5">
                            <li>At least one lowercase letter</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one number</li>
                            <li>Minimum 6 characters</li>
                        </ul>
                    </template>
                </Password>
            </div>

            <div class="flex flex-col gap-2 w-full">
                <label for="confirmPassword" class="text-surface-900 dark:text-surface-0 font-medium leading-normal">
                    Confirm Password
                </label>
                <Password
                    id="confirmPassword"
                    v-model="confirmPassword"
                    placeholder="Re-enter your password"
                    :toggleMask="true"
                    :feedback="false"
                    input-class="w-full!"
                    :disabled="loading"
                    @keyup.enter="onClickSignUp"
                    :class="{ 'p-invalid': !passwordsMatch }" />
                <small v-if="!passwordsMatch" class="p-error">Passwords do not match</small>
            </div>
        </div>

        <Button
            label="Create Account"
            icon="pi pi-user-plus"
            @click="onClickSignUp"
            :loading="loading"
            :disabled="!isFormValid || loading"
            class="w-full py-2 rounded-lg flex justify-center items-center gap-2">
            <template #icon>
                <i class="pi pi-user-plus text-base! leading-normal!" />
            </template>
        </Button>

        <div class="text-center">
            <span class="text-sm text-surface-600 dark:text-surface-400">
                Already have an account?
            </span>
            <Button
                label="Sign In"
                link
                class="p-0 ml-1 text-sm"
                @click="onClickSignIn" />
        </div>

        <div class="text-xs text-surface-500 dark:text-surface-400 text-center">
            By creating an account, you agree to receive email confirmations and updates from OpenMDX.
        </div>
    </div>
</div>
</template>

<style scoped>
.p-invalid {
    border-color: #ef4444 !important;
}
</style>
