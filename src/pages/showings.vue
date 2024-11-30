<template>
    <div class="horizontal-centering">
        <h1>Our Showings</h1>
    </div>
    <v-container>
        <v-card variant="outlined">
            <div class="horizontal-align vertical-centering">
                <v-card-text class="vertical-align">
                    <div class="horizontal-align">
                        <v-checkbox v-model="movieCheck" label="Movie:" class="mr-6" @update:model-value="updateMovieParams"></v-checkbox>               
                        <v-combobox v-model="selectedMovies" chips multiple min-width="400" max-width="70%" variant="outlined" :items="movies" @update:model-value="updateMovieParams"></v-combobox>
                    </div>
                    <div class="horizontal-align">
                        <v-checkbox v-model="durationCheck" label="Duration:" class="mr-2" @update:model-value="updateDurationParams"></v-checkbox>
                        <v-text-field v-model.number="duration1" max-width="200" type="number" variant="outlined" @update:model-value="updateDurationParams"></v-text-field>
                        <div>
                            <v-card-text>&#8212;</v-card-text>
                        </div>
                        <v-text-field v-model.number="duration2" max-width="200" type="number" variant="outlined" @update:model-value="updateDurationParams"></v-text-field>
                        <div>
                            <v-card-text opacity="0.8" class="text-h6">minutes</v-card-text>
                        </div>
                    </div>
                    <div class="horizontal-align">
                        <v-checkbox v-model="dateCheck" label="Date:" class="mr-9" @update:model-value="updateDateParams"></v-checkbox>
                        <v-text-field v-model="date1" type="date" max-width="200" variant="outlined" @update:model-value="updateDateParams"></v-text-field>
                        <div>
                            <v-card-text>&#8212;</v-card-text>
                        </div>
                        <v-text-field v-model="date2" type="date" max-width="200" variant="outlined" @update:model-value="updateDateParams"></v-text-field>
                    </div>
                    <div>
                        <v-card-text>Note: Only the top 200 results will be shown</v-card-text>
                    </div>
                </v-card-text>
                <v-card-text>
                    <v-btn color="#821DE7" @click="searchShowings">Search Showings</v-btn>
                </v-card-text>
            </div>
        </v-card>
    </v-container>
    <v-container>
        <div v-if="showingResults.length>0 && searching==false">
        <v-card v-for="showing in showingResults">
            <v-card-text class="horizontal-align">
                <img height="auto" width="150" :src=showing.image_url></img>
                <div class="vertical-align space-between ml-3">
                    <div>
                    <p><router-link :to="`/movies?movie_id=${showing.movie_id}`" class="text-h4 mb-2">{{ showing.title }}</router-link></p>
                    <p class="mb-1 text-h6">Showing at: <router-link :to="`/cinemas`">{{ showing.cinema_name }}</router-link></p>
                    <p class="mb-1 text-h6">Date: {{ showing.date }}</p>
                    <p class="text-h6">Time: {{ showing.time }}, Duration: {{ showing.duration }} Minutes</p>
                    <p class="text-h6">Price per seat: RM{{ showing.price }}</p>
                    </div>
                    <div>
                        <router-link :to="`/seat_selection?showing_id=${showing.id}`"><v-btn color="#821DE7">Book Now</v-btn></router-link>
                    </div>

                </div>
            </v-card-text>
        </v-card>
        </div>
        <div class="horizontal-centering" v-else-if="showingResults.length<1 && searching==false">
            <p class="text-h4">No Results</p>
        </div>
        <v-skeleton-loader v-else type="image" height="500px"></v-skeleton-loader>
        
    </v-container>
</template>

<script setup>
    import {useRouter, useRoute} from 'vue-router'
    import { useQueryManager } from '@/composables/useQueryManager';
    import { useDateFormatter, useTypeValidator } from '@/composables/useCommonUtilities';
    import { useMovieStore } from '@/stores/movieStore';
    import { useShowingStore } from '@/stores/showingStore';

    const router = useRouter()
    const route = useRoute()
    const showingStore = useShowingStore()
    const movieStore = useMovieStore()
    const queryManager = useQueryManager()
    const dateFormatter = useDateFormatter()
    const typeValidator = useTypeValidator()
    const movies = ref([])

    const movieCheck = ref(false)
    const durationCheck = ref(false)
    const dateCheck = ref(false)

    const duration1 = ref(0)
    const duration2 = ref(180)
    const date1 = ref(dateFormatter.formatToIsoDate(new Date(Date.now())))
    const date2 = ref(dateFormatter.formatToIsoDate(new Date(Date.now())))

    const selectedMovies = ref([])
    const showingResults = ref([])
    const searching = ref(true)

    showingResults.value = [
        // {id: "one", title: "Ding", movie_id: "one", cinema_name: "Cinema name", cinema_id: "one", image_url: "https://my-test-11.slatic.net/p/8d725e795cee0089b31856623044357e.jpg", date: "Mon, 12 Jan 2025", time: "04.00pm"},
        // {id: "two", title: "Dong", movie_id: "two", cinema_name: "Cinema name", cinema_id: "two", image_url: "https://my-test-11.slatic.net/p/8d725e795cee0089b31856623044357e.jpg", date: "Mon, 12 Jan 2025", time: "04.00pm"}
    ]

    onBeforeMount(async()=>{
        const movieList = await movieStore.fetchMovies()
        if(!movieList){
            //router.push({path: '/error_page'})
            alert("There was an error loading this page, it may not work correctly. Please reload the page and try again.")
            searching.value = false
            return
        }
        movies.value = movieList
        const newIds = route.query.movie_ids
        if(newIds){
            // If movie_ids is a string, convert to array
            movieCheck.value=true
            const movieIds = Array.isArray(newIds) ? newIds : [newIds]
            selectedMovies.value = movies.value.filter(movie => movieIds.includes(movie.id))
        }else{
            movieCheck.value=false
            selectedMovies.value=[]
        }

        const dur1 = route.query.duration1
        if(dur1 && typeValidator.isNumeric(dur1)){
            durationCheck.value=true
            duration1.value = dur1
        }else{
            if(duration1.value && typeof duration1.value==='number'){
                durationCheck.value=true
                await queryManager.replaceQueryParams('duration1', duration1.value)
            }else{
                durationCheck.value = false
                await queryManager.clearQueryParams('duration1')
            }
        }

        const dur2 = route.query.duration2
        if(dur2 && typeValidator.isNumeric(dur2)){
            durationCheck.value = true
            duration2.value = dur2
        }else{
            if(duration2.value && typeof duration2.value==='number'){
                durationCheck.value = true
                await queryManager.replaceQueryParams('duration2', duration2.value)
            }else{
                durationCheck.value = false
                await queryManager.clearQueryParams('duration2')
            }
        }

        const d1 = route.query.date1
        if(d1 && dateFormatter.isISODate(d1)){
            dateCheck.value = true
            date1.value = d1
        }else{
            if(date1.value && dateFormatter.isISODate(d1)){
                dateCheck.value = true
                await queryManager.replaceQueryParams('date1', date1.value)
            }else{
                dateCheck.value = false
                await queryManager.clearQueryParams('date1')
            }
        }

        const d2 = route.query.date2
        if(d2 && dateFormatter.isISODate(d2)){
            dateCheck.value = true
            date2.value = d2
        }else{
            if(date2.value && dateFormatter.isISODate(d2)){
                dateCheck.value=true
                await queryManager.replaceQueryParams('date2', date2.value)
            }else{
                dateCheck.value = false
                await queryManager.clearQueryParams('date2')
            }
        }

        await searchShowings()
    })

    function updateMovieParams(){
        if(!movieCheck.value){
            queryManager.clearQueryParams('movie_ids')
            return
        }
        if(!selectedMovies.value||selectedMovies.value.length===0){
            queryManager.clearQueryParams('movie_ids')
        }else{
            const movieIds = selectedMovies.value.map(movie=>movie.id)
            queryManager.replaceQueryParams('movie_ids', movieIds)
        }
    }

    async function updateDurationParams(){
        if(!durationCheck.value){
            await queryManager.clearQueryParams('duration1')
            await queryManager.clearQueryParams('duration2')
            return
        }
        
        if(!duration1.value||!typeof duration1.value==='number'){
            await queryManager.clearQueryParams('duration1')
        }else{
            await queryManager.replaceQueryParams('duration1', duration1.value)
        }

        if(!duration2.value||!typeof duration2.value==='number'){
            await queryManager.clearQueryParams('duration2')
        }else{
            await queryManager.replaceQueryParams('duration2', duration2.value)
        }
    }

    async function updateDateParams(){
        if(!dateCheck.value){
            await queryManager.clearQueryParams('date1')
            await queryManager.clearQueryParams('date2')
            return
        }

        if(!date1.value||!dateFormatter.isISODate(date1.value)){
            await queryManager.clearQueryParams('date1')
        }else{
            await queryManager.replaceQueryParams('date1', date1.value)
        }

        if(!date2.value||!dateFormatter.isISODate(date2.value)){
            await queryManager.clearQueryParams('date2')
        }else{
            await queryManager.replaceQueryParams('date2', date2.value)
        }
    }

    async function searchShowings(){
        showingResults.value=[]
        searching.value = true
        const movie_ids = route.query.movie_ids
        const queryDuration1 = route.query.duration1
        const queryDuration2 = route.query.duration2
        const queryDate1 = route.query.date1
        const queryDate2 = route.query.date2
        // console.log(movie_ids+" "+queryDuration1+" "+queryDuration2+" "+queryDate1+" "+queryDate2)
        if (!movie_ids){
            const results = await showingStore.searchShowings(queryDuration1, queryDuration2, queryDate1, queryDate2)
            if(!results){
                //router.push({path: '/error_page'})
                alert("There was an error executing your request. Please reload the page and try again.")
                showingResults.value=[]
                searching.value = false
                return
            }
            
            //showingResults.value = []
            for(let i=0; i<results.length; i++){
                const newResult = {id: "", title: "", movie_id: "", cinema_name: "", cinema_id: "", image_url: "", date: "", time: "", duration: 0}
                newResult.id = results[i].showing_id
                newResult.title = results[i].title
                newResult.movie_id = results[i].movie_id
                newResult.cinema_name = results[i].cinema_name
                newResult.cinema_id = results[i].cinema_id
                newResult.image_url = results[i].image_url
                newResult.price = results[i].pricex100/100
                newResult.date = dateFormatter.formatToReadable(results[i].start_time)
                newResult.time = dateFormatter.get24HourTime(results[i].start_time)
                newResult.duration = results[i].duration
                showingResults.value.push(newResult)
            }
            searching.value = false
            console.log(showingResults.value.length)
            return
        }
        const results = await showingStore.fetchMovieShowings(movie_ids, queryDate1, queryDate2)
        if(!results){
            //router.push({path: '/error_page'})
            alert("There was an error executing your request. Please check your network connection and reload the page.")
            //showingResults.value = []
            searching.value = false
            return
        }
        showingResults.value = []
        for(let i=0; i<results.length; i++){
            const newResult = {id: "", title: "", movie_id: "", cinema_name: "", cinema_id: "", image_url: "", date: "", time: "", duration: 0}
            newResult.id = results[i].id
            newResult.title = results[i].title
            newResult.movie_id = results[i].movie_id
            newResult.cinema_name = results[i].cinema_name
            newResult.cinema_id = results[i].cinema_id
            newResult.image_url = results[i].image_url
            newResult.price = results[i].pricex100/100
            newResult.date = dateFormatter.formatToReadable(results[i].start_time)
            newResult.time = dateFormatter.get24HourTime(results[i].start_time)
            newResult.duration = results[i].duration
            showingResults.value.push(newResult)
        }
        searching.value = false
    }
</script>

<style>
    @import '@/styles/isaac-styles.css';
</style>
