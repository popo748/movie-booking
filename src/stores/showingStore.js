import {defineStore} from 'pinia'
import { useTypeValidator } from '@/composables/useCommonUtilities'
import {useApi, useAuthApi, useLoginApi} from '@/composables/useApi'

export const useShowingStore = defineStore('showingStore',{
    state: ()=>({
        loading: false,
        error: null
    }),
    actions:{
        async fetchShowingMovie(showing_id){
            try{
                const api = useApi()
                const response = await api.get(`/showings/${showing_id}/movie`)
                if(response.status!==200){
                    //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                    
                    return null
                }
                return response.data
            }catch(error){
                console.error("Error fetching payment tickets", error.response)
                //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                
                return null
            }
        },
        async fetchShowing(showing_id){
            try{
                const api = useApi()
                const response = await api.get(`/showings/${showing_id}`)
                if(response.status!==200){
                    //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                    
                    return null
                }
                return response.data
            }catch(error){
                console.error("Error fetching showing", error)
                //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                
                return null
            }
        },
        async fetchMovieShowings(movie_ids, showing_date1, showing_date2){
            try{
                const api = useAuthApi()
                const {removeNulls} = useTypeValidator()
                let params = {
                    movie_ids: movie_ids,
                    showing_date1: showing_date1,
                    showing_date2: showing_date2
                }
                //console.log("params: "+JSON.stringify(params))
                params = removeNulls(params)
                const response = await api.get('/movies/showings/search/', {
                    params: params,
                    paramsSerializer:{
                        indexes: null
                    }
                })
                if(response.status!==200){
                    //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                    return null
                }
                return response.data
            }catch(error){
                console.error("Error fetching showing", error)
                //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                
                return null
            }
        },
        async searchShowings(duration1, duration2, start_date1, start_date2){
            try{
                const api = useAuthApi()
                const {removeNulls} = useTypeValidator()
                let params = {
                    duration1: duration1,
                    duration2: duration2,
                    start_date1: start_date1,
                    start_date2: start_date2
                }
                params = removeNulls(params)
                const response = await api.get('/showings/search/',{
                    params: params
                })
                if(response.status!==200){
                    //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                    return null
                }
                return response.data
            }catch(error){
                console.error("Error fetching showing", error)
                //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                
                return null
            }
        },
        async fetchShowingSeats(showing_id){
            try{
                const api = useApi()
                const response = await api.get(`/showings/${showing_id}/seats`)
                if(response.status!==200){
                    //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                    
                    return null
                }
                return response.data
            }catch(error){
                console.error("Error fetching showing", error)
                //localStorage.setItem("current_error", "There was an error fetching your requested resource.")
                
                return null
            }
        },
        async createTickets(ticketsToCreate){
            
            try {
                const API = useAuthApi();
                const response = await API.post("/tickets/create", ticketsToCreate);
                return response.data;
              } catch (error) {
                if (error.response && error.response.data) {
                  throw new Error(error.response.data.detail || "An error occurred");
                } else {
                  throw new Error("Network error");
                }
              }
        }
    }
})