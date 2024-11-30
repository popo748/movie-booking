<template>
  <v-container class="ma-5">
    <h2 class="text-medium-emphasis">Select Date</h2>
    <div class="d-flex align-center">
      <v-btn
        icon="mdi-chevron-left"
        class="mr-2 nav-button"
        @click="previousDates"
        :disabled="currentIndex === 0"
      ></v-btn>

      <v-btn-toggle v-model="selectedValue">
        <v-btn
          class="rounded date-button"
          v-for="date in visibleDates"
          :key="date.id"
          :value="date.fullLabel"
          @click="selectDate(date.fullLabel)"
        >
          <v-icon left>mdi-calendar-range</v-icon>
          {{ date.fullLabel }}
        </v-btn>
      </v-btn-toggle>

      <v-btn
        icon="mdi-chevron-right"
        class="ml-2 nav-button"
        @click="nextDates"
        :disabled="currentIndex >= dates.length - 3"
      ></v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    dates: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      selectedValue: this.modelValue,
      currentIndex: 0
    }
  },

  computed: {
    visibleDates() {
      return this.dates.slice(this.currentIndex, this.currentIndex + 3)
    }
  },

  watch: {
    modelValue(newValue) {
      this.selectedValue = newValue
    },
    dates() {
      this.currentIndex = 0
    }
  },

  mounted() {
    if (!this.selectedValue && this.dates.length > 0) {
      this.selectDate(this.dates[0].fullLabel)
    }
  },

  methods: {
    selectDate(fullLabel) {
      this.selectedValue = fullLabel
      this.$emit('update:modelValue', fullLabel)
      this.$emit('doneDate', fullLabel)
    },

    nextDates() {
      if (this.currentIndex < this.dates.length - 3) {
        this.currentIndex += 3
      }
    },

    previousDates() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 3
      }
    },

    resetIndex() {
      this.currentIndex = 0
    }
  }
}
</script>

<style scoped>
/* Date selection buttons */
.date-button {
  background-color: #6A1B9A !important;
  color: white !important;
  margin-right: 10px;
  width: 200px;
  transition: all 0.3s ease;
}

.date-button:hover {
  background-color: #4d1167 !important;
  opacity: 0.9;
}

.date-button.v-btn--active {
  background-color: #ac69d5 !important;
  color: white !important;
  transform: scale(1.02);
}

/* Navigation buttons (left/right arrows) */
.nav-button {
  background-color: transparent !important;
  width: auto !important;
  margin: 0;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: rgba(106, 27, 154, 0.1) !important;
  transform: scale(1.1);
}

.nav-button:disabled {
  background-color: transparent !important;
  opacity: 0.5;
  transform: none;
}

/* Button toggle group spacing */
.v-btn-toggle {
  gap: 8px;
}

/* Icon alignment */
.v-icon {
  margin-right: 8px;
}
</style>