import {defineStore} from 'pinia'
import {useApi, useAuthApi, useLoginApi} from '@/composables/useApi'

export const useSeatStore = defineStore('seatStore',{
    state: ()=>({
        loading: false,
        error: null
    }),
    actions:{
        async fetchSeat(seat_id){
            try{
                const api = useApi()
                const response = await api.get(`/seats/${seat_id}`)
                if(response.status!==200){
                    localStorage.setItem("current_error", "There was an error fetching your ticket detail.")
                    
                    return null
                }
                return response.data
            }catch(error){
                console.error("Error fetching seat", error.response)
                localStorage.setItem("current_error", "There was an error fetching your ticket detail.")
                
                return null
            }
        }
    }
})