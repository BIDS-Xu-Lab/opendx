<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';

const items = ref([
{
    label: 'Company',
    root: true,
    items: [
        [
            {
                items: [
                    { label: 'Features', icon: 'pi pi-list', subtext: 'Subtext of item' },
                    { label: 'Customers', icon: 'pi pi-users', subtext: 'Subtext of item' },
                    { label: 'Case Studies', icon: 'pi pi-file', subtext: 'Subtext of item' }
                ]
            }
        ],
        [
            {
                items: [
                    { label: 'Solutions', icon: 'pi pi-shield', subtext: 'Subtext of item' },
                    { label: 'Faq', icon: 'pi pi-question', subtext: 'Subtext of item' },
                    { label: 'Library', icon: 'pi pi-search', subtext: 'Subtext of item' }
                ]
            }
        ],
        [
            {
                items: [
                    { label: 'Community', icon: 'pi pi-comments', subtext: 'Subtext of item' },
                    { label: 'Rewards', icon: 'pi pi-star', subtext: 'Subtext of item' },
                    { label: 'Investors', icon: 'pi pi-globe', subtext: 'Subtext of item' }
                ]
            }
        ],
        [
            {
                items: [{ image: 'https://primefaces.org/cdn/primevue/images/uikit/uikit-system.png', label: 'GET STARTED', subtext: 'Build spectacular apps in no time.' }]
            }
        ]
    ]
},
{
    label: 'Resources',
    root: true
},
{
    label: 'Contact',
    root: true
}
]);


const onClickSignIn = () => {
    router.push('/login');
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
        <Button size="small" 
            @click="onClickSignIn"
            label="Sign In" icon="pi pi-user" />
    </template>
</MegaMenu>
</div>

</template>

<style scoped>
</style>