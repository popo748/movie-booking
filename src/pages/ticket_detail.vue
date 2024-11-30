<template>
    <h1 class="pa-5">Ticket Detail</h1>

    <div class="horizontal-centering medium-vertical-gap">
        <TicketDetail :date="date" :title="title" :seats="seats" :time="time" :location="location" :duration="duration"/>
    </div>

    <div class="horizontal-centering big-vertical-gap">
        <div>
            <HomePageButton />
        </div>
    </div>
    
</template>

<script setup>
    import { useRoute } from 'vue-router';
    import { useRouter } from 'vue-router';
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
    const location = ref('')
    const duration = ref(0)

    onBeforeMount(async()=>{
        const payment = await paymentStore.fetchPayment(payment_id)
        // if(!payment){
        //     router.push({path: '/error_page'})
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

        // if (payment.status!=="success"){
        //     localStorage.setItem("current_error", "There was an error fetching your requested resource")
        //     router.push({path: '/error_page'})
        // }
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

        for(let i=0; i<tickets.length; i++){
            const seat = await seatStore.fetchSeat(tickets[i].seat_id)
            if(!seat){
                //router.push({path: '/error_page'})
                alert("There was an error loading this page. Please reload.")
                return
            }
            const seatName = seat.row + seat.number.toString()
            seats.value.push(seatName)
        }

        const showing_id = tickets[0].showing_id
        const showing = await showingStore.fetchShowing(showing_id)
        if(!showing){
            //router.push({path: '/error_page'})
            alert("There was an error loading this page. Please reload.")
            return
        }
        
        const movie = await showingStore.fetchShowingMovie(showing_id)
        if(!movie){
            //router.push({path: '/error_page'})
            alert("There was an error loading this page. Please reload.")
            return
        }

        location.value = `${showing.cinema_name}, ${showing.hall_name}`
        duration.value = showing.duration
        date.value = dateFormatter.formatToReadable(showing.start_time)
        time.value = dateFormatter.get24HourTime(showing.start_time)
        title.value = movie.title
    })
</script>

<style>
@import '@/styles/isaac-styles.css';
</style>