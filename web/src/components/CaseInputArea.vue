<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';
import { questions, clinical_cases } from '../models/Samples';
import { useCaseStore } from '../stores/CaseStore';
import { MessageType } from '../models/ClinicalCase';
const input_text = ref('');
const el_textarea = ref(null);
const n_rows = ref(1);
const case_store = useCaseStore();

const onClickSubmit = () => {
    // Check if user has entered text
    if (!input_text.value.trim()) {
        console.warn('No input text provided');
        return;
    }

    // Clear any existing case
    case_store.setClinicalCase(null);

    // Start the streaming process with user's input
    const caseText = input_text.value.trim();
    case_store.startStream(caseText);

    // Clear the input
    input_text.value = '';
    n_rows.value = 1;

    // Navigate to analyze page
    router.push('/analyze');
}

const onClickSample = (sample: any) => {
    input_text.value = sample.text;

    onInputTextarea();
}

const onClickUpload = () => {
    console.log('upload');
}

const onClickRecord = () => {
    console.log('record');
}

const onInputTextarea = () => {
    // get the number of characters in the textarea

    const n_chars = input_text.value.length;

    // set the number of rows to the number of characters / 60
    let n = Math.ceil(n_chars / 60);

    if (n > 10) {
        n = 10;
    } else if (n < 1) {
        n = 1;
    }

    n_rows.value = n;
}

const flag_show_more_samples = ref(false);
const onClickSeeMore = () => {
    flag_show_more_samples.value = !flag_show_more_samples.value;
}

const get_samples = () => {
    // get fixed 3 samples with index
    return [
        questions[2],
        questions[8],
        questions[20],
    ];
}
</script>

<template>
<div class="flex flex-col items-center mt-8 gap-3 w-full">

    <div class="w-full flex flex-col" style="max-width: 40rem;">
        <div class="input-container relative w-full p-4 rounded-2xl border focus-within:border-primary">
            <textarea
                ref="el_textarea"
                id="input-textarea"
                wrap="soft"
                v-model="input_text"
                :rows="n_rows"
                class="input-textarea w-full p-4 resize-none border-0 focus:outline-none"
                placeholder="Describe your question related mCRPC guideline ..."
                @input="onInputTextarea"
                style="overflow: auto; max-height: 20rem;"
            ></textarea>
            <div class="flex flex-row justify-between align-items-center">
                <div class="flex flex-row gap-2 align-items-center">
                    <Button text @click="onClickUpload" 
                        v-tooltip.bottom="'Upload a clinical case file, e.g. a PDF, a Markdown, or a text file'"
                        class="!p-2 !h-10">
                        <font-awesome-icon icon="fa-solid fa-upload" class="text-2xl"/>
                    </Button>
                </div>

                <div class="flex flex-row gap-2 align-items-center">
                    <Button text @click="onClickRecord" 
                        v-tooltip.bottom="'Speak your clinical case or question'"
                        class="!p-2 !h-10">
                        <font-awesome-icon icon="fa-solid fa-microphone" class="text-2xl"/>
                    </Button>
                    <Button @click="onClickSubmit" 
                        v-tooltip.bottom="'Submit your clinical case or question'"
                        class="!p-2 !h-10">
                        <font-awesome-icon icon="fa-solid fa-paper-plane" class="text-2xl"/>
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <!-- Samples -->
    <!-- <div class="flex lg:flex-row max-sm:flex-col gap-4 mb-2 lg:w-1/2">

        <Card v-for="sample in get_samples()" 
            class="lg:w-1/3 cursor-pointer clickable-sample"
            @click="onClickSample(sample)">
            <template #title>
                {{ sample?.section }}
            </template>
            <template #content>
                <p class="m-0">
                    {{ sample?.text }}
                </p>
            </template>
        </Card>
    </div> -->


    <!-- More samples -->
    <!-- <div class="flex flex-col items-center gap-4 mb-2 w-1/2 justify-center mt-4">
        <p class="cursor-pointer" @click="onClickSeeMore">
            See more case samples ... 
            <template v-if="flag_show_more_samples">
                <font-awesome-icon icon="fa-solid fa-chevron-up" />
            </template>
            <template v-else>
                <font-awesome-icon icon="fa-solid fa-chevron-down" />
            </template>
        </p>

        <template v-if="flag_show_more_samples">
            <Fieldset legend="Type 2 Diabetes Mellitus">
                <p class="m-0">
                    
                </p>
            </Fieldset>
        </template>
    </div> -->
    
</div>
</template>

<style scoped>
.clickable-sample:hover {
    background: var(--hover-color);
}
.input-container {
    background: var(--background-color);
}
</style>