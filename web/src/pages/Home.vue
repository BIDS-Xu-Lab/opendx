<script setup lang="ts">
import { useDataStore } from '../stores/DataStore';
import CaseInputArea from '../components/CaseInputArea.vue';
import LeftSidebar from '../components/LeftSidebar.vue';
import TopMenu from '../components/TopMenu.vue';
const data_store = useDataStore();

</script>

<template>
<LeftSidebar />
<div class="main-container">

    <TopMenu />


    <div class="main-content flex flex-col items-center justify-center">
        <div class="mt-16 items-center justify-center flex flex-col gap-4">
            <div class="font-bold text-6xl">
                OpenDx
            </div>
            <div class="text-xl">
                Find Evidence. Make Diagnosis.
            </div>
        </div>

        <CaseInputArea />





    </div>

    <Footer />
</div>
</template>

<style scoped>
.bg-container {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
}
.main-menu {
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
}
.text-on-line {
    position: relative;
    display: flex;
    grid-row: 1;
    align-items: center;
    justify-content: stretch;
    padding: 0.5rem 2rem;
    width: 100%;
}

.text-on-line > i {
    flex: 1 1;
    border-bottom: 1px solid var(--border-color);
}
.text-on-line > span {
    padding: 0 1rem;
}

.text-on-line::before {
    margin-right: 1.5rem;
}

.text-on-line::after {
    margin-left: 1.5rem;
}
.bg-line {
    width: 100%;
    height: 1px;
    background-color: var(--border-color);
    margin-bottom: 2rem;
    z-index: -1;
}
</style>
