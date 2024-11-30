<template>
  <div class="purple-gradient-background-fixed"></div>
  <v-carousel v-if="carouselMovies.length > 0" cycle interval="12000" hide-delimiters>
      <v-carousel-item  v-for="movie in carouselMovies" :key="movie.id">
        <v-img :src="movie.image_url || 'default-image-url'" height="1200px">
          <v-container class="fill-height align-end">
            <v-btn class="watch-trailer-btn mr-4" @click="showTrailerDialog(movie.trailer_url)">Watch Trailer</v-btn>
            <v-btn class="movie-details" @click="navigateToMovie(movie.id)">Buy Now</v-btn>
          </v-container>
        </v-img>
      </v-carousel-item>
    </v-carousel>
    <v-skeleton-loader
  v-else
  type="image"
  height="1200px"
></v-skeleton-loader>
  <v-row>
    
    <v-dialog v-model="isTrailerDialogOpen" max-width="800px">
    <v-card>
      <iframe
        v-if="trailerUrl"
        :src="trailerUrl"
        width="100%"
        height="1200"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </v-card>
  </v-dialog>
  
  <v-container class="display my-12 text-center">
    <v-divider></v-divider>
    <br>
    <!-- <RouterLink to="/movie-time-slot"><v-btn>Our Cinemas</v-btn></RouterLink> -->
    <RouterLink to="/showings"><v-btn class="mx-12">Search Showings</v-btn></RouterLink>
    <RouterLink to="/movies"><v-btn class="mx-12">Search Movies</v-btn></RouterLink>
  </v-container>
  </v-row>

  <h2 class="promo"><b>Promotion</b></h2>
  <v-row class="promotion-card">
    <v-col cols="4">
      <v-card>
        <v-img height="200px" src="@/assets/christmas.jpg"></v-img>
        <v-card-subtitle>"Chrismas Event Coming Soon"</v-card-subtitle>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-img height="200px" src="@/assets/discount.jpg"></v-img>
        <v-card-subtitle>"TGIF Enjoy 112% discount on every Friday"</v-card-subtitle>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-img height="200px" src="@/assets/popcorn.jpg"></v-img>
        <v-card-subtitle>"Popcorn sales: Buy 2 Free 1"</v-card-subtitle>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-img height="200px" src="@/assets/design.jpg"></v-img>
        <v-card-subtitle>"Step Into Freshness: A Cinema of New Beginnings!"</v-card-subtitle>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-img height="200px" src="@/assets/dinner.jpg"></v-img>
        <v-card-subtitle>"Dinner available in our cinema""</v-card-subtitle>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-img height="200px" src="@/assets/pokemon.png"></v-img>
        <v-card-subtitle>"Catch Em All: Become a Trainer!"</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { useApi } from "../composables/useApi";

export default {
  data() {
    return {
      carouselMovies: [],
      isTrailerDialogOpen: false,
      trailerUrl: null,
    };
  },
  methods: {
    async fetchCarouselMovies() {
      const api = useApi();
      try {
        const response = await api.get('/movies/all');
        console.log(response.data)
        if (response.data && response.status === 200) {
          this.carouselMovies = response.data
        }
      } catch (error) {
        console.error("Error fetching carousel movies:", error);
      }
    },
    showTrailerDialog(trailerUrl) {
      this.trailerUrl = trailerUrl;
      this.isTrailerDialogOpen = true;
    },
    navigateToMovie(movieId) {
    this.$router.push({ path: '/movies', query: { movie_id: movieId } });
  }
  },
  async beforeMount(){
    await this.fetchCarouselMovies();
  }
};
</script>

<style>
.watch-trailer-btn {
  background-color: rgba(130,29,231,1) !important;
  color: #FFFFFF !important;
  display: flex;
  align-items: center;
}

.movie-details {
background-color: rgba(130,29,231,1) !important;
color: #FFFFFF !important;
display: flex;
align-items: center;
}

.v-carousel-item {
  max-height: 1200px;
  overflow: hidden;
}

.v-card {
  height: 100%;
  background-color: transparent;
  box-shadow: none;
  border: none;
}

.showtime {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  color: white !important;
  position: relative;
}

.promo {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  color: white !important;
  position: relative;
}

.v-card-subtitle {
  text-align: center;
}

.v-container {
  margin-top: 10px;
}

.v-btn:hover {
  background-color: transparent !important;
}

.mx-12 {
  background-color: rgba(130,29,231,1) !important;
}

.promotion-card .v-card {
background-color: transparent !important;
box-shadow: none !important;
border: none !important;
}
</style>