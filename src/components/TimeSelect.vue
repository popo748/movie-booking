<template>
  <v-container class="ma-5">
    <h2 class="text-medium-emphasis">Select Time</h2>
    <v-btn-toggle v-model="selectedTimeButton" class="time-toggle">
      <v-btn
        class="time-btn rounded"
        v-for="time in times"
        :key="time.id"
        :value="time.label"
        @click="selectTime(time.label)"
      >
        <v-icon left>
          mdi-clock-time-eight-outline
        </v-icon>
        {{ time.label }}
      </v-btn>
    </v-btn-toggle>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  times: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'doneTime']);
const selectedTimeButton = ref(null);

// Watch for times array changes to reset selection
watch(() => props.times, () => {
  resetSelection();
}, { deep: true });

// Watch for v-model changes from parent
watch(() => props.modelValue, (newValue) => {
  selectedTimeButton.value = newValue;
});

const selectTime = (label) => {
  selectedTimeButton.value = label;
  emit('doneTime', label);
  emit('update:modelValue', label);
};

const resetSelection = () => {
  selectedTimeButton.value = null;
  emit('doneTime', '');
  emit('update:modelValue', '');
};

// Expose reset method to parent component
defineExpose({ resetSelection });
</script>

<style scoped>
.time-toggle {
  gap: 10px;
}

.time-btn {
  background-color: #6A1B9A !important;
  color: white !important;
}

.time-btn:hover {
  background-color: #4d1167 !important;
  opacity: 0.95;
}

.time-btn.v-btn--active {
  background-color: #ac69d5 !important;
  color: white !important;
}

/* Prevent default Vuetify hover behaviors */
.time-btn::before {
  background-color: transparent !important;
}

/* Smooth transitions */
.time-btn {
  transition: background-color 0.2s ease-in-out !important;
}

/* Active + Hover state */
.time-btn.v-btn--active:hover {
  background-color: #9C27B0 !important;
}

/* Focus state */
.time-btn:focus {
  background-color: #6A1B9A !important;
}

/* Disabled state if needed */
.time-btn.v-btn--disabled {
  background-color: #E1BEE7 !important;
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>