<template>
    <v-container class="horizontal-centering vertical-centering">
        <BookingDetail :title="title" :date="date" :seats="seats" :time_remaining="time_remnant" :payments="payments" :time="time" :payment_id="payment_id" :location="location"></BookingDetail>
        
    </v-container>
</template>

<script setup>
    import { useRoute } from 'vue-router';
    import {useRouter} from 'vue-router'
    import { usePaymentStore } from '@/stores/paymentStore';
    import { useShowingStore } from '@/stores/showingStore';
    import { useSeatStore } from '@/stores/seatStore';
    import { useDateFormatter } from '@/composables/useCommonUtilities';

    const router = useRouter()
    const dateFormatter = useDateFormatter()
    const paymentStore = usePaymentStore()
    const showingStore = useShowingStore()
    const seatStore = useSeatStore()
    const route = useRoute()
    const payment_id = computed(()=>route.query.payment_id).value

    const date = ref('')
    const title = ref('Movie Title')
    const seats = ref([])
    const time = ref('')
    const location  = ref('')

    const payments = ref([])
    const time_remnant = ref(0)
    
    onBeforeMount(async()=>{
        const payment = await paymentStore.fetchPayment(payment_id)
        // if(!payment){
        //     router.push('/error_page')
        //     return
        // }
        if(payment.failed){
            if(payment.status===401){
                alert("Authorization error. Please sign in again.")
            }else if(payment.status===404){
                alert("Could not locate your requested resource.")
            }else if(payment.status===422){
                alert("Your request is invalid. Please try again.")
            }else{
                alert("There was an error executing your request. Please try again.")
            }
            return
        }

        if(payment.status!="unpaid" && payment.status!="retry"){
            alert("Your request is invalid. (Have you already paid? Thank you, but don't pay again.) Please try again.")
            return
        }
        const created_date = payment.created_date
        
        const diffInMilliseconds = (Date.parse(created_date)+660000) - Date.now()
        
        let diffInSeconds =diffInMilliseconds/1000

        if(diffInSeconds>600){
            diffInSeconds = 600
        }
        
        time_remnant.value = Number(diffInSeconds.toFixed(0))
        
        const tickets = await paymentStore.fetchPaymentTickets(payment_id)
        // if(!tickets){
        //     router.push({path: '/error_page'})
        //     return
        // }
        if(tickets.failed){
            if(tickets.status===401){
                alert("Authorization error. Please sign in again.")
            }else if(tickets.status===404){
                alert("Could not locate your requested resource.")
            }else if(tickets.status===422){
                alert("Your request is invalid. Please try again.")
            }else{
                alert("There was an error executing your request. Please try again.")
            }
            return
        }

        const showing_id = tickets[0].showing_id
        const showing = await showingStore.fetchShowing(showing_id)
        const item = {name: "Regular seat", amount: showing.pricex100/100, quantity: tickets.length}
        payments.value.push(item)
        if(!showing){
            //router.push({path: '/error_page'})
            alert("There was an error loading this page. Please check your network connection and reload.")
            return
        }

        for(let i=0; i<tickets.length; i++){
            
            const seat = await seatStore.fetchSeat(tickets[i].seat_id)
            if(!seat){
                //router.push({path: '/error_page'})
                alert("There was an error loading this page. Please check your network connection and reload.")
                return
            }
            const seatName = seat.row + seat.number.toString()
            seats.value.push(seatName)
        }

        location.value = `${showing.cinema_name}, ${showing.hall_name}`

        const movie = await showingStore.fetchShowingMovie(showing_id)
        if(!movie){
            //router.push({path: '/error_page'})
            alert("There was an error loading this page. Please check your network connection and reload.")
            return
        }

        date.value = dateFormatter.formatToReadable(showing.start_time)
        time.value = dateFormatter.get24HourTime(showing.start_time)
        title.value = movie.title
    })
</script>

<style>
    @import '@/styles/isaac-styles.css';
</style>