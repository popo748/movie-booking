<template>
    <div class="vertical-centering">
        <v-card class="mx-auto" color="transparent" width="400" height="350">
            <div class="medium-vertical-gap">
            <div class="horizontal-centering">
                <v-card-title>Payment Success</v-card-title>
            </div>
            <div class="horizontal-centering">
                <v-img src="@/assets/check_circle_icon.png" width="120" height="120"></v-img>
            </div>
            <div class="horizontal-centering small-vertical-gap">
                <div class="vertical-align">
                    <!-- <a href="/ticket_detail">
                        <v-btn class="text-none" color="#821DE7" width="220">View Ticket</v-btn>
                    </a> -->
                    <v-btn @click="gotoTicketDetail" class="text-none" color="#821DE7" width="220">View Ticket</v-btn>
                    
                    <HomePageButton/>
                </div>
            </div>
            </div>
        </v-card>
    </div>
    
</template>

<script setup>
    import HomePageButton from '@/components/HomePageButton.vue';
    const props = defineProps({
        payment_id:{
            type: String,
            default: "not_provided"
        }
    })
    import {useRouter} from 'vue-router'
    // const payment_id = ref('1cc8b890-fdb0-4408-bf1b-9e9369ab58e4')
    const router = useRouter()
    function gotoTicketDetail(){
        console.log("Paymentid: "+props.payment_id)
        router.push({path: '/ticket_detail', query: {payment_id: props.payment_id}})
    }

</script>

<style>
    @import '@/styles/isaac-styles.css'
</style>