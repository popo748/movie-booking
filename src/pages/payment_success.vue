<template>
    <PaymentSuccess :payment_id="payment_id"/>
</template>

<script setup>
    import PaymentSuccess from '@/components/PaymentSuccess.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute()
    const payment_id = computed(()=>route.query.payment_id).value
    
</script>

<style>
    @import '@/styles/isaac-styles.css'
</style>