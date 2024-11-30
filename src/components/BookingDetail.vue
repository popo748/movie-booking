<template>
    <v-card variant="flat" class="bg-none" width="400" min-height="400">
        <v-card-title class="text-h4">Booking Detail</v-card-title>
        <v-card-subtitle class="text-h5 white-text" opacity="1">Schedule</v-card-subtitle>
        <br>
        <v-card-subtitle class="text-h6">Movie Title</v-card-subtitle>
        <v-card-subtitle class="text-h5 white-text" opacity="1">{{ title }}</v-card-subtitle>
        <br>
        <v-card-subtitle class="text-h6">Location</v-card-subtitle>
        <v-card-subtitle class="text-h5 white-text" opacity="1">{{ location }}</v-card-subtitle>
        <br>
        <v-card-subtitle class="text-h6">Date</v-card-subtitle>
        <v-card-subtitle class="text-h5 white-text" opacity="1">{{ date }}</v-card-subtitle>
        <br>
        <v-row>
            <v-col cols="8">
                <v-card-subtitle class="text-h6">Seats ({{ seatCount }})</v-card-subtitle>
                <v-card-subtitle class="text-h5 white-text" opacity="1">{{ seatString }}</v-card-subtitle>
            </v-col>
            <v-col cols="4">
                <v-card-subtitle class="text-h6 text-right">Time</v-card-subtitle>
                <v-card-subtitle class="text-h5 white-text text-right" opacity="1">{{ time }}</v-card-subtitle>
            </v-col>
        </v-row>
        <br><br>
        <v-card-subtitle class="text-h5" opacity="1">Transaction Detail</v-card-subtitle>

        <v-row no-gutter v-for="payment in payments" class="mt-n5">
            
            <v-col cols="6"><v-card-subtitle class="text-h6" opacity="1">{{ payment.name }}</v-card-subtitle></v-col>
            <v-col cols="4">
                <div class="text-h6 text-right">RM{{ payment.amount.toFixed(2) }}</div>
            </v-col>
            <v-col cols="2">
                <div class="text-h6 text-right">x{{ payment.quantity }}</div>
            </v-col>
            
        </v-row>
        
        <v-divider class="border-opacity-100 ml-5"></v-divider>
        <v-row>
            <v-col cols="7"><v-card-subtitle class="text-h5" opacity="1">Total payment</v-card-subtitle></v-col>
            <v-col cols="5">
                <div class="text-h5 text-right">RM{{ total }}</div>
            </v-col>
        </v-row>
        <v-divider class="border-opacity-100 ml-5"></v-divider>
        <br><br>
        <v-card-subtitle>*Purchased ticket cannot be cancelled</v-card-subtitle>
        <div class="horizontal-centering ml-5 small-vertical-gap">
            <v-btn :disabled="isButtonDisabled" class="text-h5 text-none" color="#821DE7" width="420" height="50" @click = "togglePayDialog">
                {{ checkoutText }}
                
            </v-btn>
        </div>
    </v-card>
    <v-dialog
      v-model="showDialog"
      width="auto"
    >
      <v-card max-width="400">
        <v-card-title>Payment Details</v-card-title>
        <v-card-subtitle opacity="1">Payment method: Credit/Debit Card</v-card-subtitle>
        <v-card-subtitle opacity="1">Payment amount: RM<u>{{ total }}</u></v-card-subtitle>
        <template v-slot:actions>
          <v-btn
            class="ms-auto text-none"
            color="#821DE7"
            @click="payUp"
          >{{ payText }}</v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import { usePaymentStore } from '@/stores/paymentStore';
    const paymentStore = usePaymentStore()
    const router = useRouter()
    const props = defineProps({
        title: {
            type: String,
            default: "Spiderman Yes Way Home"
        },
        date: {
            type: String,
            default: "Mon, 12 Jan 2024"
        },
        seats: {
            type: Array,
            default: ["C1", "C2", "C3", "C4"]
        },
        time: {
            type: String,
            default: "14:40"
        },
        payments: {
            type: Array,
            default: [
                { name: "Regular seat", amount: 55.70, quantity: 3 },
                { name: "Regular seat", amount: 55.70, quantity: 3 },
                { name: "Regular seat", amount: 55.70, quantity: 3 },
            ]
        },
        payment_id:{
            type: String,
            default: "unspecified"
        },
        time_remaining:{
            type: Number,
            default: 600
        },
        location:{
            type: String,
            default: "Cinema 1, Hall A"
        }
    })
    
    const timeRemaining = ref(props.time_remaining)

    watch(()=>props.time_remaining, (newValue)=>{
        timeRemaining.value = newValue
        if (newValue > 0) {
            stopTimer()
            startTimer()
        }
    })
    
    const isRunning = ref(false)
    const timerId = ref(null)

    const isButtonDisabled = computed(()=>timeRemaining.value<=0)
    const checkoutText = computed(()=>{
        if(timeRemaining.value<=0){
            return 'Expired'
        }

        const minutes = Math.floor(timeRemaining.value/60)
        const seconds = timeRemaining.value % 60
        return `Checkout - ${minutes}:${seconds.toString().padStart(2, '0')} remaining`
    })

    const payText = computed(()=>{
        if(timeRemaining.value<=0){
            return 'Expired'
        }

        const minutes = Math.floor(timeRemaining.value/60)
        const seconds = timeRemaining.value % 60
        return `Pay - ${minutes}:${seconds.toString().padStart(2, '0')} remaining`
    })

    const showDialog = ref(false)
    const seatString = computed(() => { return props.seats.join(', ') })
    const seatCount = computed(() => { return (props.seats).length })
    const total = computed(() => {
        let sum = 0
        
        for (let i = 0; i < props.payments.length; i++) {
            sum += props.payments[i].amount * props.payments[i].quantity
        }
        return sum.toFixed(2)
    })

    function togglePayDialog(){
        showDialog.value = !showDialog.value
    }

    async function payUp(){
        const payment = await paymentStore.makePayment(props.payment_id)
        if(!payment || payment.status.toLowerCase()!=="success"){
            router.push({path: '/error_page'})
            return
        }
        router.push({path: '/payment_success', query: {payment_id: props.payment_id}})
        
    }

    function startTimer(){
        if(!isRunning.value && timeRemaining.value>0){
            isRunning.value = true
            timerId.value = setInterval(()=>{
                if(timeRemaining.value>0){
                    timeRemaining.value--
                }else{
                    stopTimer()
                }
            }, 1000)
        }
    }

    function stopTimer(){
        if(timerId.value){
            clearInterval(timerId.value)
            isRunning.value = false
        }
    }

    onMounted(()=>{
        startTimer()
    })

    onUnmounted(()=>{
        stopTimer()
    })
</script>

<style>
@import '@/styles/isaac-styles.css';
</style>