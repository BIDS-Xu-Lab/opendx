<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';

const items = ref([
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