<template>
  <div class="seat-grid">
    <v-container>
      <h1 align="center">Seat Selector</h1>      
    <v-container v-if="rows.length>0" v-for="(row, rowIndex) in rows" :key="rowIndex">
      <v-row>
        <v-col align="center" cols="12">
          <SeatButton
          v-for="(seat, seatIndex) in row"
          :key="seatIndex"
          :seatRow="rowLetter(rowIndex)"
          :seatNumber="seatIndex + 1"
          :isAvailable="seat.available"
          :id="seat.id"
          :selectedSeats="selectedSeats"
          @add-seat="addSeat"
          @remove-seat="removeSeat"
          />
      </v-col>
      </v-row>
    </v-container>
    <v-skeleton-loader
      v-else
      type="image"
      height="500px"
></v-skeleton-loader>
    <v-row>
      <v-col align="center">
        <v-card color="white" align="center" width="641px" class="font-weight-bold">Screen</v-card>
      </v-col>
    </v-row>
    
    <br>
    <v-divider horiontal/>
    <br>
    <FooterSeatSelectionPage 
    :selectedSeats="selectedSeats" 
    :ticketCost="ticketCost"
    @submit="creatingTickets" 
    @cancel="handleCancel" />
  </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FooterSeatSelectionPage from '@/components/FooterSeatSelectionPage.vue';
import SeatButton from '@/components/SeatButton.vue';
import { useShowingStore } from '@/stores/showingStore';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const showing_id = computed(()=>route.query.showing_id).value
const showingStore = useShowingStore()
const rows = ref([]);
const selectedSeats = ref([]);
const ticketCost = ref();
const rowArr = ref([])
const ticketsToCreate = ref([]);

function generateSeats(){
  const totalRows = 7
  const seatsPerRow = 10
  const newRows = []
  for (let row=0; row<totalRows; row++){
      const seats = []
      for(let seat = 0; seat < seatsPerRow; seat++){
          seats.push({available: rowArr.value[row][seat].available, id: rowArr.value[row][seat].id})
      }
      newRows.push(seats)
  }
  rows.value = newRows
  ticketCost.value = (rowArr.value[0][0].pricex100)/100
}

const rowLetter = (rowIndex) => {
// Generate row letters (A, B, C, ...)
return String.fromCharCode(65 + rowIndex);
};

const addSeat = (seat) => {
selectedSeats.value.push(seat); 
};

const removeSeat = (seat) => {
selectedSeats.value = selectedSeats.value.filter(
  (selectedSeat) => selectedSeat.id !== seat.id 
);
};

const handleCancel = () => {
selectedSeats.value = [];
};
const creatingTickets = async () =>{
try{
  if(selectedSeats.value.length<1){
    alert("Please select at least one seat")
    return
  }
  for(let i = 0; i < selectedSeats.value.length; i++){
      const seatID = selectedSeats.value[i].id;
      const ticket = {
      "showing_id": showing_id,
      "seat_id" : seatID
      }
      ticketsToCreate.value.push(ticket)
  }
  console.log(ticketsToCreate.value)
  const ticketCreation = await showingStore.createTickets(ticketsToCreate.value)
  console.log(ticketCreation.id)
  router.push({path: '/booking_detail', query: {payment_id: ticketCreation.id}})
  return ticketCreation
}catch(error){

}
}
onMounted(() => {
//generateSeats();
});

onBeforeMount(async()=>{
  const seating = await showingStore.fetchShowingSeats(showing_id)
  //console.log(JSON.stringify(seating))
  if(!seating){
      alert("There was an error loading this page. Please check your network connection and reload.")
  }
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const rowArrays = rowLetters.map(letter => 
  seating.filter(seat => seat.row === letter)
  );
  //console.log(JSON.stringify(rowArrays))
  rowArr.value = rowArrays
  //console.log(JSON.stringify(rowArr.value))
  generateSeats()
})
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
}
</style>


