<template>
  <div class="image-container">
    <!-- Previous v-img content remains the same -->
    <v-img
      :src="imageSource"
      height="400"
      :aspect-ratio="16/9"
      class="movie-poster"
      :cover="false"
      :contain="true"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey-lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
      <div class="fade-overlay"></div>
      <div class="image-text">
        <h2 class="text-h4 font-weight-bold mb-2">{{ movie.title }}</h2>
        <div class="chips-container mb-3">
          <v-chip
            class="ma-1"
            variant="elevated"
          > 
          {{ capitalizedGenre }}
          </v-chip>
          <v-chip
            class="ma-1"
            variant="elevated"
          > 
            {{ movie.duration }} minutes
          </v-chip>
        </div>
        <div class="button-container">
          <v-btn
            class="custom-btn"
            variant="elevated"
            color="white"
            density="comfortable"
            @click="isModalOpen = true"
          >
            <v-icon left class="mr-2">mdi-information</v-icon>
            Movie Info
          </v-btn>
        </div>
      </div>
    </v-img>

    <!-- Updated Movie Info Modal -->
    <v-dialog
      v-model="isModalOpen"
      max-width="500"
      overlay-opacity="0.8"
    >
      <v-card class="custom-modal pa-4">
        <v-btn
          icon
          variant="text"
          position="absolute"
          class="close-btn"
          style="right: 8px; top: 8px"
          @click="isModalOpen = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-card-title class="text-h5 font-weight-bold mb-4 pr-8 text-white">
          {{ movie.title }}
        </v-card-title>

        <v-card-text>
          <v-list class="custom-list rounded">
            <v-list-item class="custom-list-item mb-2">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-calendar-start</v-icon>
              </template>
              <v-list-item-title>Release Date: {{ formatDate(movie.release_date) }}</v-list-item-title>
            </v-list-item>

            <v-list-item class="custom-list-item">
              <template v-slot:prepend>
                <v-icon color="grey-darken-1">mdi-calendar-end</v-icon>
              </template>
              <v-list-item-title>Last Showing: {{ formatDate(movie.last_showing_date) }}</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider class="my-4 custom-divider"></v-divider>
          
          <div class="text-subtitle-1 font-weight-medium mb-2 text-white">Description</div>
          <p class="text-body-1 text-white">{{ movie.synopsis }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CinemaInfo',
  props: {
    movie: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        duration: '',
        genre: '',
        release_date: '',
        last_showing_date: '',
        synopsis: ''
      })
    },
    imageSource: {
      type: String,
      required: true,
      default: ''
    },
  },
  data() {
    return {
      showFullDescription: false,
      isModalOpen: false
    }
  },
  computed: {
    capitalizedGenre() {
      if (!this.movie.genre) return '';
      return this.movie.genre.charAt(0).toUpperCase() + this.movie.genre.slice(1).toLowerCase();
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.image-container {
  position: relative;
  width: 700px;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  border: 4px solid purple;
  margin-left: 80px;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.image-text {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  color: white;
  z-index: 2;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.button-container {
  margin-top: 8px;
}

.custom-btn {
  background-color: white !important;
  color: rgba(0, 0, 0, 0.87) !important;
}

.custom-btn:hover {
  background-color: #4d1167 !important;
  color: rgba(246, 239, 239, 0.87) !important;
}

.v-chip {
  background-color: rgba(255, 255, 255, 0.9) !important;
  color: rgba(0, 0, 0, 0.87) !important;
  font-weight: 500;
}

.custom-modal {
  background-color: #1a1a1a !important;
  color: white !important;
}

.close-btn {
  color: white !important;
}

.custom-divider {
  border-color: rgba(255, 255, 255, 0.12) !important;
}
</style>