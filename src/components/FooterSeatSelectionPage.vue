<template>
  <v-container>
    <v-row class="align-center justify-center">
      <v-col cols="6" class="px-0 py-0">
        <v-card flat color="transparent" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <v-card-text align="left" class="text-subtitle-1 px-1 py-1">Total</v-card-text>
            <v-card-text class="text-h5 font-weight-bold px-1">RM{{ totalPrice }}</v-card-text>
          </div>
          <div>
            <v-card-text align="left" class="text-subtitle-1 px-1 py-1">Seats</v-card-text>
            <v-card-text class="text-h5 font-weight-bold px-1 py-1">{{ seatLabels.join(', ') }}</v-card-text>
          </div>
        </v-card>
      </v-col>
      <v-col cols="auto">
          <v-btn flat color="white" variant="outlined" @click="$emit('cancel')">Cancel</v-btn>
      </v-col>
      <v-col cols="auto">
        <a>
          <v-btn color="#821de7" @click="$emit('submit')">Proceed</v-btn>
        </a>
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
selectedSeats: {
  type: Array,
  default: () => [],
},
ticketCost: {
  type: Number,
  default: 0,
},
});
const seatLabels = computed(() => {
return props.selectedSeats.map(seat => `${seat.seatRow}${seat.seatNumber}`);
});
const totalPrice = computed(() => {
return props.selectedSeats.length * props.ticketCost;
});
</script>
