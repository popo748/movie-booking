<template>
    <v-card variant="outlined" width="350" min-height="450" rounded="xl">
              <div>
                  <v-card-subtitle class="small-vertical-gap">Date</v-card-subtitle>
                  <v-card-subtitle class="text-h5 white-text" opacity="1">{{ date }}</v-card-subtitle>
              </div>
              <div>
                  <v-card-subtitle class="small-vertical-gap">Location</v-card-subtitle>
                  <v-card-subtitle class="text-h5 white-text" opacity="1">{{ location }}</v-card-subtitle>
              </div>
              <div class="small-vertical-gap">
                  <v-card-subtitle>Movie Title</v-card-subtitle>
                  <v-card-subtitle class="text-h5 text-column mb-5" opacity="1"><p class="text-content">{{ title }}</p></v-card-subtitle>
              </div>
              <div class="small-vertical-gap">
                  <v-card-subtitle>Duration</v-card-subtitle>
                  <v-card-subtitle class="text-h5 text-column mb-5" opacity="1"><p class="text-content">{{ duration }} Minutes</p></v-card-subtitle>
              </div>
              <div class="small-vertical-gap">
                  <v-row>
                      <v-col cols="8">
                          <v-card-subtitle>Seats ({{ seatCount }})</v-card-subtitle>
                          <v-card-subtitle class="text-h5 white-text" opacity="1">{{ seatString }}</v-card-subtitle>
                      </v-col>
                      <v-col cols="4">
                          <v-card-subtitle>Time</v-card-subtitle>
                          <v-card-subtitle class="text-h5 white-text" opacity="1">{{ time }}</v-card-subtitle>
                      </v-col>
                  </v-row>
              </div>
              <div class="horizontal-centering small-vertical-gap">
                  <div class="vertical-align">
                      <v-btn class="text-none" color="#821DE7" width="220">Download Ticket</v-btn>
                  </div>
              </div>
          </v-card>
  </template>
  
  <script setup>
      const props = defineProps({
          date: {
              type: String,
              default: "Mon, 23 Oct 2023"
          },
          title: {
              type: String,
              default: "Movie title"
          },
          seats: {
              type: Array,
              default: ["C1", "C2", "C3", "C4"]
          },
          time: {
              type: String,
              default: "14:40"
          },
          location:{
            type: String,
            default: "Cinema 1, Hall C"
          },
          duration:{
            type: Number,
            default: 50
          }
      })
  
      const seatString = computed(() => {
        //const strArr = props.seats.join(', ')
        const sorted = props.seats.sort((a, b) => a[0].localeCompare(b[0]) || parseInt(a.slice(1)) - parseInt(b.slice(1)));
        return sorted.join(', ')
      })
      const seatCount = computed(() => { return (props.seats).length })
  </script>
  
  <style>
      @import '@/styles/isaac-styles.css'
  </style>
