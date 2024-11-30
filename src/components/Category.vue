<template>
    <v-container class="movie-container" fluid>
      <v-row class="movie-row" justify="space-between">
        <v-col v-for="movie in filteredMovies" :key="movie.id" cols="12" sm="6" md="3">
          <v-card class="movie-card" @click="navigateToMovie(movie.id)">
            <v-img 
              :src="movie.image_url" 
              width="100%" 
              height="400" 
              cover
              class="cursor-pointer"
            ></v-img>
            <v-card-title class="movie-title">{{ movie.title }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    movies: {
      type: Array,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  });
  
  const router = useRouter();
  
  const filteredMovies = computed(() => {
    return props.movies.filter(movie => {
      switch (props.category) {
        case 'nowShowing':
          return ['Insidious', 'Interstellar', 'Alien Romulus', 'Captain America', 'Deadpool and Wolverine', 'Speak No Evil'].includes(movie.title);
        case 'comingSoon':
          return ['Terrifier 3', 'The Substance', 'Never Let Go', 'Transformers One'].includes(movie.title);
        case 'rerun':
          return ['JUON The Grudge', 'The Babadook', 'Kungfu Hustle', 'Matrix Reloaded'].includes(movie.title);
        default:
          return [];
      }
    });
  });
  
  const navigateToMovie = (movieId) => {
    // Set scroll position to top immediately
    window.scrollTo(0, 0);
    
    // Then navigate
    router.push({
      path: '/movie-time-slot',
      query: { movie_id: movieId }
    });
  };
  </script>
  
  <style>
  .movie-container {
    padding: 0 20px;
  }
  
  .movie-row {
    margin: 0;
  }
  
  .movie-card {
    margin-bottom: 20px;
  }
  
  .movie-title {
    text-align: center;
    font-size: 16px;
    color: white;
    margin-top: 10px;
  }
  </style>