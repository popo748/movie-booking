import {defineStore} from 'pinia'
import {useApi, useAuthApi, useLoginApi} from '@/composables/useApi'

export const useMovieStore = defineStore('movieStore',{
    state: ()=>({
        loading: false,
        error: null
    }),
    actions:{
        async fetchMovies(){
            try{
                const api = useAuthApi()
                const response = await api.get(`/movies/all`)
                if(response.status!== 200){
                    return null
                }
                return response.data
            }catch(error){
                console.error("Error fetching movies", error.response)
                //localStorage.setItem("current_error", "There was an error fetching your requested resource.")                
                return null
            }
        }
    }
})