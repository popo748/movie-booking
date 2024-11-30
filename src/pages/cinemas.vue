<template>
    <v-container class="cinema-container" fluid>
      <v-row class="cinema-row" justify="center">
        <v-col cols="12" v-for="cinema in cinemas" :key="cinema.id">
          <v-card class="mx-auto">
            <v-card-title>{{ cinema.name }}</v-card-title>
            <v-card-text>
              <p><b>Address:</b> {{ cinema.address }}</p>
              <p><b>Phone:</b> {{ cinema.phone }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" text @click="showMap(cinema)">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-alert type="error" v-if="error" class="mt-4">
        {{ error }}
      </v-alert>
      
      <v-dialog v-model="isMapDialogOpen" persistent max-width="800px">
        <v-card>
          <v-card-title class="text-h6">
            Cinema Location: {{ selectedCinema?.name || 'Unknown' }}
          </v-card-title>
          <v-card-subtitle>{{ selectedCinema?.address }}</v-card-subtitle>
          <v-card-text>
            <TheaterMap
              :theaters="[selectedCinema]"
              :selectedTheater="selectedCinema?.name"
              :selectedMovie="selectedMovie"
              @theater-selected="onTheaterSelected"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="isMapDialogOpen = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import TheaterMap from '@/components/TheaterMap.vue'; 
  import { useApi } from "../composables/useApi";
  
  export default {
    components: {
      TheaterMap,
    },
    data() {
      return {
        cinemas: [],
        error: null,
        isMapDialogOpen: false,
        selectedCinema: null,
        selectedMovie: null,
      };
    },
    methods: {
      async fetchCinemas() {
        const api = useApi();
        try {
          const response = await api.get("/cinemas/all");
          this.cinemas = response.data;
        } catch (err) {
          console.error("Error fetching cinemas:", err);
          this.error = "Failed to fetch cinemas. Please try again later.";
        }
      },
  
      showMap(cinema) {
        this.selectedCinema = cinema;
        this.isMapDialogOpen = true;
      },
  
      onTheaterSelected(theaterName) {
        console.log(`Theater selected: ${theaterName}`);
      },
    },
    mounted() {
      this.fetchCinemas();
    },
  };
  </script>
  
  <style>
  .cinema-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .cinema-row {
    width: 100%;
    max-width: 35%;
    margin: auto;
  }
  
  .v-card {
    margin: 16px 0;
  }
  
  .v-dialog {
    max-height: 90vh;
  }
  </style>