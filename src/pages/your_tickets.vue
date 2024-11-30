<template>
    <br>
    <TicketList :upcomingTicketData="upcomingTicketData" :historyTicketData="historyTicketData"/>
</template>

<script setup>
    //const tab = ref(null)
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
    
    const upcomingTicketData = ref([])
    const historyTicketData = ref([])

    onBeforeMount(async()=>{
        const successfulPayments = await paymentStore.fetchSuccessfulPayments()
        // if (!successfulPayments){
        //     router.push({path: '/error_page'})
        //     return
        // }
        if(successfulPayments.failed){
            if(successfulPayments.status===401){
                alert("Authorization error. Please sign in again.")
            }else if(successfulPayments.status===404){
                alert("Could not locate your requested resource.")
            }else if(successfulPayments.status===422){
                alert("Your request is invalid. Please try again.")
            }else{
                alert("There was an error executing your request. Please try again.")
            }
            return
        }

        for(let i=0; i<successfulPayments.length; i++){
            const paymentTickets = await paymentStore.fetchPaymentTickets(successfulPayments[i].id)
            // if(!paymentTickets){
            //     router.push({path: '/error_page'})
            //     return
            // }
            if(paymentTickets.failed){
                if(paymentTickets.status===401){
                    alert("Authorization error. Please sign in again.")
                }else if(paymentTickets.status===404){
                    alert("Could not locate your requested resource.")
                }else if(paymentTickets.status===422){
                    alert("Your request is invalid. Please try again.")
                }else{
                    alert("There was an error executing your request. Please try again.")
                }
            return
        }

            const showing = await showingStore.fetchShowing(paymentTickets[0].showing_id)
            if(!showing){
                //router.push({path: '/error_page'})
                alert("There was an error loading this page. Please check your network connection and reload.")
                return
            }
            const movie = await showingStore.fetchShowingMovie(paymentTickets[0].showing_id)
            if(!movie){
                //router.push({path: '/error_page'})
                alert("There was an error loading this page. Please check your network connection and reload.")
                return
            }
            const title = movie.title
            const date = dateFormatter.formatToReadable(showing.start_time)
            //alert(showing.start_time)
            const time = dateFormatter.get24HourTime(showing.start_time)
            const location = `${showing.cinema_name}, ${showing.hall_name}`
            const seats = []
            for(let i=0; i<paymentTickets.length; i++){
                const seat = await seatStore.fetchSeat(paymentTickets[i].seat_id)
                if(!seat){
                    //router.push({path: '/error_page'})
                    alert("There was an error loading this page. Please check your network connection and reload.")
                    return
                }
                const seatName = seat.row + seat.number.toString()
                seats.push(seatName)
            }
            if (Date.parse(showing.start_time) > Date.now()){
                upcomingTicketData.value.push({date: date, title: title, seats: seats, time: time, location: location, duration: showing.duration})
            }
            historyTicketData.value.push({date: date, title: title, seats: seats, time: time, location: location, duration: showing.duration})
            console.log(showing.duration)
        }
    })
</script>

<style>
@import '@/styles/isaac-styles.css';
.bg-none{
    background-color: transparent !important;
}

.bg-purple {
    background-color: #821DE7 !important
}
</style>