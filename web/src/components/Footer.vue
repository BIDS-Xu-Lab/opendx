<script setup lang="ts">
</script>

<template>
    <div class="footer flex flex-col items-center justify-center">
        <div class="flex flex-col items-start mb-4 w-1/2 gap-4">
            <div class="flex flex-row justify-between gap-4 w-full">
                <div>
                    <img src="/logo.svg" alt="OpenMDX Logo" class="w-10 h-10">
                    <span class="text-sm">
                        OpenMDX
                    </span>
                </div>

                <div class="flex flex-col items-start">
                    <h6 class="font-bold">
                        Product
                    </h6>
                    <a href="/" class="text-sm">
                        OpenMDX
                    </a>
                </div>


                <div class="flex flex-col items-start">
                    <h6 class="font-bold">
                        Company
                    </h6>
                    <a href="/about" class="text-sm">
                        About
                    </a>
                    <a href="/announcements" class="text-sm">
                        Announcements
                    </a>
                    <a href="/security" class="text-sm">
                        Security
                    </a>
                </div>


                <div class="flex flex-col items-start">
                    <h6 class="font-bold">
                        Contact Us
                    </h6>
                    <p class="text-sm">
                        Email
                    </p>
                    <p class="text-sm">
                        X
                    </p>
                </div>


                <div class="flex flex-col items-start">
                    <span>
                    &copy; OpenMDX 2025.
                    </span>

                    <span>
                        All rights reserved.
                    </span>

                    <a href="/terms-of-use" class="text-sm">Terms of Use</a>
                    <a href="/privacy-policy" class="text-sm">Privacy Policy</a>
                    <a href="/advertising-policy" class="text-sm">Advertising Policy</a>
                </div>

            </div>



            <div class="flex flex-row items-center mb-4 justify-center gap-4">
                
            </div>

        </div>
    </div>
</template>

<style scoped>
.footer {
    width: 100%;
    background-color: var(--footer-background-color);
    margin-top: 5rem;
    padding: 2rem 0;
}
</style>