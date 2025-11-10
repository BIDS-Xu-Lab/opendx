<script setup lang="ts">
import { ref } from 'vue';
import router from '../router';
import { questions } from '../models/Samples';
const input_text = ref('');
const el_textarea = ref(null);
const n_rows = ref(1);

const onClickSubmit = () => {
    console.log(input_text.value);

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