import {defineStore} from 'pinia'
import {useApi, useAuthApi, useLoginApi} from '@/composables/useApi'
import { useRouter } from 'vue-router'

export const usePaymentStore = defineStore('paymentStore',{
    state: ()=>({
        ticketData: [],
        loading: false,
        error: null
    }),
    actions:{
        async fetchPaymentTickets(payment_id){
            try{
                const api = useAuthApi()
                const response = await api.get(`/payments/${payment_id}/tickets`)
                //console.log("payment tickets: "+JSON.stringify(response))
                if(response.status!== 200){
                    localStorage.setItem("current_error", "There was an error fetching your ticket detail.")
                    return {status: response.status, failed: true}
                }
                return response.data
            }catch(error){
                console.error("Error fetching payment tickets", error.response)
                localStorage.setItem("current_error", "There was an error fetching your ticket detail.")
                
                return {status: error.response.status, failed: true}
            }
        },
        async fetchSuccessfulPayments(){
            try{
                const api = useAuthApi()
                const response = await api.get(`/payments/all/success`)
                //console.log("payments: "+JSON.stringify(response))
                if(response.status!== 200){
                    localStorage.setItem("current_error", "There was an error fetching your requestd resource.")
                    return {status: response.status, failed: true}
                }
                return response.data
            }catch(error){
                console.error("Error fetching payments", error.response)
                localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                return {status: error.response.status, failed: true}
            }
        },
        async makePayment(payment_id){
            try{
                const api = useAuthApi()
                const response = await api.put(`/payments/${payment_id}/pay`, "card")
                if(response.status!==200){
                    localStorage.setItem("current_error", "There was an error making payment. Please book again and try again.")
                    return {status: response.status, failed: true}
                }
                return response.data
            }catch(error){
                console.error("Error making payment", error.response)
                localStorage.setItem("current_error", "There was an error making payment. Please book again and try again.")
                return {status: error.response.status, failed: true}
            }
        },
        async fetchPayment(payment_id){
            try{
                const api  = useAuthApi()
                const response = await api.get(`/payments/${payment_id}`)
                if(response.status!==200){
                    localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                    return {status: response.status, failed: true}
                }
                console.log(response.data)
                return response.data
            }catch(error){
                console.error("Error fetching payment", error.response)
                localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                return {status: error.response.status, failed: true}
            }
        }
    }
})