<template>
    <RouterLink to="/">
    <v-btn class="text-none small-vertical-gap" color="white" :width=width variant="outlined">
        Back to Home Page
    </v-btn>
    </RouterLink>
</template>

<script setup>
    const props = defineProps({
        width: {
            type: Number,
            default: 220
        }
    })
</script>