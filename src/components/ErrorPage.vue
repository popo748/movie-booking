<template>
    <h1>{{ errorMessage }}</h1>
</template>

<script setup>
    const errorMessage = ref('')
    errorMessage.value = localStorage.getItem("current_error")
</script>