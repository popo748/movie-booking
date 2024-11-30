<template>
  <v-btn
    :class="{
      'seat-available': isAvailable,
      'seat-selected': isSelected,
      'seat-unavailable': !isAvailable,
    }"
    :disabled="!isAvailable"
    @click="toggleSelection"
  >
    {{ seatRow }}{{ seatNumber }}
  </v-btn>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  seatRow: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  selectedSeats: {
    type: Array,
    default: () => [],
  },
  id: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['add-seat', 'remove-seat']);

const isSelected = computed(() => {
  return props.selectedSeats.some(seat => seat.id === props.id);
});

const toggleSelection = () => {
  const seat = {
    id: props.id,
    seatRow: props.seatRow,
    seatNumber: props.seatNumber,
    isAvailable: props.isAvailable
  };
  
  if (isSelected.value) {
    emit('remove-seat', seat); 
  } else {
    emit('add-seat', seat); 
  }
};
</script>

<style scoped>
.seat-available {
  background-color: #fff;
  color: black;
}

.seat-selected {
  background-color: #821de7;
  color: #fff;
}

.seat-unavailable {
  background-color: #f44336; 
}
</style>