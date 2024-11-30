<template>
  <v-select
    ref="movieSelect"
    v-model="selectedMovie"
    :items="movies"
    item-title="title"
    item-value="id"
    density="compact"
    label="Select A Movie"
    :menu-props="{ modelValue: isMenuOpen }"
    @update:menu="isMenuOpen = $event"
    @update:model-value="onMovieSelect"
  ></v-select>

  <v-row class="mt-10">
    <!-- Movie Info Section -->
    <v-col cols="6" class="mt-15">
      <div class="d-flex justify-center">
        <CinemaInfo :movie="movieInfo" :imageSource="movieImageSource" class="center" />
      </div>
    </v-col>

    <!-- Selection Section -->
    <v-col cols="6">
      <TheaterSelect 
        :locations="theaters" 
        :modelValue="selectedTheater"
        @doneTheater="handleTheaterSelection" 
        @update:modelValue="handleTheaterSelection"
      />
      
      <TheaterMap 
        :theaters="theaters"
        :selectedTheater="selectedTheater"
        :selectedMovie="selectedMovie"
        @theater-selected="handleTheaterSelection"
      />
      
      <DateSelect 
        :dates="showDates" 
        @doneDate="handleDate" 
        v-model="selectedDate" 
        ref="dateSelectRef"
      />

      <TimeSelect 
        :times="showTimes" 
        @doneTime="handleTime" 
        v-model="selectedTime"
        ref="timeSelectRef"
      />
    </v-col>
  </v-row>
  
  <!-- Ticket Summary -->
  <v-row class="mt-16 d-flex justify-center">
    <v-container 
      :style="`background-image: url(${ticketBg}); background-size: cover; background-position: center; height: 400px; width: 1200px;`"
      class="mt-16"
    >
      <v-row class="fill-height">
        <v-col cols="8">
          <h1 class="pt-10 ml-11 mb-10" style="color: white;">{{ movieInfo.title }}</h1>
          <h2 class="mb-5 ml-11" style="color: white;">Theater: {{ selectedTheater }}</h2>
          <h2 class="mb-5 ml-11" style="color: white;">Date: {{ selectedDate }}</h2>
          <h2 class="mb-20 ml-11" style="color: white;">Time: {{ selectedTime }}</h2>
        </v-col>
        <v-col cols="4" class="d-flex justify-end align-end">
          <v-btn @click="proceedToSeatSelection" class="seat-button">
            <h6>Proceed to <br>seat selection</h6>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
  
  <!-- Error Message -->
  <v-snackbar v-model="showError" color="error" timeout="3000" location="top">
    Please select a time before proceeding to seat selection
    <template v-slot:actions>
      <v-btn variant="text" @click="showError = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getMovies, getTheaters, getShowdates } from '@/composables/useApi';
import ticketBg from '@/assets/movieTicket.png';

// Component imports
import DateSelect from '@/components/DateSelect.vue';
import TheaterSelect from '@/components/TheaterSelect.vue';
import TimeSelect from '@/components/TimeSelect.vue';
import CinemaInfo from '@/components/CinemaInfo.vue';
import TheaterMap from '@/components/TheaterMap.vue';

// State
const movies = ref([]);
const theaters = ref([]);
const showDates = ref([]);
const showTimes = ref([]);

const selectedMovie = ref(null);
const selectedTheater = ref('');
const selectedTheaterId = ref(null);
const selectedDate = ref('');
const selectedTime = ref('');
const selectedShowingId = ref(null);

const movieInfo = ref({});
const movieImageSource = ref('');
const loading = ref(false);
const showError = ref(false);
const isMenuOpen = ref(false);

// Refs
const movieSelect = ref(null);
const timeSelectRef = ref(null);
const dateSelectRef = ref(null);

const router = useRouter();
const route = useRoute();


// Methods
const proceedToSeatSelection = () => {
  if (!selectedTime.value || !selectedShowingId.value) {
    showError.value = true;
    timeSelectRef.value?.$el.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  } else {
    router.push(`/seat_selection?showing_id=${selectedShowingId.value}`);
  }
};

const handleTheaterSelection = async (theaterName) => {
  selectedTheater.value = theaterName;
  const theater = theaters.value.find(t => t.name === theaterName);
  selectedTheaterId.value = theater?.id;
  
  if (selectedMovie.value) {
    await updateShowings(selectedMovie.value, selectedTheaterId.value);
    
    if (showDates.value.length > 0) {
      selectedDate.value = showDates.value[0].fullLabel;
      showTimes.value = showDates.value[0].times;
    }
  }
};

const handleDate = (fullLabel) => {
  timeSelectRef.value?.resetSelection();
  selectedShowingId.value = null;
  
  selectedDate.value = fullLabel;
  const selectedDateData = showDates.value.find(d => d.fullLabel === fullLabel);
  if (selectedDateData) {
    showTimes.value = selectedDateData.times;
  }
};

const handleTime = (label) => {
  selectedTime.value = label;

  const selectedDateData = showDates.value.find(d => d.fullLabel === selectedDate.value);
  const selectedTimeData = selectedDateData?.times.find(t => t.label === label);
  if (selectedTimeData) {
    selectedShowingId.value = selectedTimeData.id;
  }
};

const onMovieSelect = async (movieId) => {
  if (!movieId) return;

  await router.push({
    path: '/movies',
    query: { movie_id: movieId }
  });
 
  const selectedMovieData = movies.value.find(movie => movie.id === movieId);
  if (selectedMovieData) {
    movieInfo.value = {
      title: selectedMovieData.title,
      duration: selectedMovieData.duration,
      genre: selectedMovieData.genre,
      release_date: selectedMovieData.release_date,
      last_showing_date: selectedMovieData.last_showing_date,
      synopsis: selectedMovieData.synopsis
    };
    movieImageSource.value = selectedMovieData.image_url;

    await updateShowings(movieId, selectedTheaterId.value);
  }
};

const updateShowings = async (movieId, theaterId) => {
  if (!movieId) return;

  try {
    loading.value = true;
    const response = await getShowdates(movieId);
    
    const theaterShowings = theaterId 
      ? response.data.filter(showing => showing.cinema_id === theaterId)
      : response.data;
    
    showDates.value = processShowings(theaterShowings);
    
    selectedDate.value = '';
    showTimes.value = [];
    selectedTime.value = '';
    timeSelectRef.value?.resetSelection();
    
    if (showDates.value.length > 0) {
      selectedDate.value = showDates.value[0].fullLabel;
      showTimes.value = showDates.value[0].times;
    }
  } catch (error) {
    console.error('Error fetching showings:', error);
    showDates.value = [];
    showTimes.value = [];
    timeSelectRef.value?.resetSelection();
  } finally {
    loading.value = false;
  }
};

const processShowings = (showings) => {
  const dateMap = new Map();
  
  showings.forEach(showing => {
    const startTime = new Date(showing.start_time);
    const date = startTime.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
    });
    const day = startTime.toLocaleDateString('en-US', { weekday: 'long' });
    const time = startTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if (!dateMap.has(date)) {
      dateMap.set(date, {
        id: date,
        label: date,
        day: day,
        fullLabel: `${date} ${day}`,
        times: []
      });
    }

    dateMap.get(date).times.push({
      id: showing.id,
      label: time,
      hall_id: showing.hall_id,
      hall_name: showing.hall_name,
      price: showing.pricex100 / 100
    });
  });

  return Array.from(dateMap.values());
};

const handleScroll = () => {
  if (isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

// Initialization
onMounted(async () => {
  try {
    loading.value = true;
    window.addEventListener('scroll', handleScroll, { passive: true });

    const [moviesResponse, theatersResponse] = await Promise.all([
      getMovies(),
      getTheaters()
    ]);
    
    movies.value = moviesResponse.data;
    theaters.value = theatersResponse.data.map(theater => ({
      id: theater.id,
      label: theater.name,
      name: theater.name,
      address: theater.address,
      phone: theater.phone
    }));
    
    if (theaters.value.length > 0) {
      selectedTheater.value = theaters.value[0].label;
      selectedTheaterId.value = theaters.value[0].id;
    }

    const movieIdFromUrl = route.query.movie_id;
    if (movieIdFromUrl && movies.value.some(movie => movie.id === movieIdFromUrl)) {
      selectedMovie.value = movieIdFromUrl;
      await onMovieSelect(movieIdFromUrl);
    } else if (movies.value.length > 0) {
      selectedMovie.value = movies.value[0].id;
      await onMovieSelect(selectedMovie.value);
    }
  } catch (error) {
    console.error('Initialization error:', error);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Watch for route changes
watch(
  () => route.query.movie_id,
  async (newMovieId, oldMovieId) => {
    if (newMovieId && newMovieId !== oldMovieId) {
      selectedMovie.value = newMovieId;
      await onMovieSelect(newMovieId);
    }
  }
);
</script>

<style>
.seat-button {
  margin-right: 27px;
  margin-bottom: 45px;
}

/* Add animation for time selection highlight */
@keyframes highlight {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-error), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0);
  }
}

.highlight-time-select {
  animation: highlight 2s ease-in-out;
}
</style>