<template>
  <v-sheet class="map-wrapper ml-8" max-width="600px" width="100%" pl>
    <v-expansion-panels v-model="expandedPanel" :mandatory="false">
      <v-expansion-panel>
        <v-expansion-panel-title class="text-subtitle-1">
          Cinema Details
        </v-expansion-panel-title>
        
        <v-expansion-panel-text>
          <div class="position-relative">
            <div ref="mapRef" style="height: 400px; width: 100%;"></div>
            <v-overlay
              v-model="loadingAddresses"
              contained
              persistent
              class="align-center justify-center"
            >
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
              <span class="ml-2">Loading theater locations...</span>
            </v-overlay>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const props = defineProps({
  theaters: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedTheater: {
    type: String,
    default: ''
  },
  selectedMovie: {
    required: true
  }
});

const emit = defineEmits(['theater-selected']);

const mapRef = ref(null);
const loadingAddresses = ref(false);
const expandedPanel = ref(null);
let map = null;
const markers = {};
const theaterCoords = {};

// Geocoding function using Nominatim
const geocodeAddress = async (address) => {
  try {
    let realAddress = address
    if(address.toLowerCase().includes("cheras")){
      realAddress = "Jln Cheras, 56000 Kuala Lumpur"
    }else if(address.toLowerCase().includes("mid valley")){
      realAddress = "Lingkaran Syed Putra, Mid Valley City, 59200 Kuala Lumpur"
    }
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(realAddress)}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const clearMap = () => {
  if (map) {
    Object.values(markers).forEach(marker => marker.remove());
    map.remove();
    map = null;
  }
};

const zoomToTheater = (theaterName) => {
  const theater = props.theaters.find(t => t.name === theaterName);
  if (theater && theaterCoords[theater.id]) {
    const coords = theaterCoords[theater.id];
    map.setView([coords.latitude, coords.longitude], 15); // Zoom level 15 for closer view
    markers[theater.id].openPopup();
  }
};

const updateMarkers = async () => {
  if (!map) return;
  
  loadingAddresses.value = true;
  
  Object.values(markers).forEach(marker => marker.remove());
  
  const bounds = L.latLngBounds();
  
  for (const theater of props.theaters) {
    await delay(1000);
    
    const coords = await geocodeAddress(theater.address);
    if (coords) {
      theaterCoords[theater.id] = coords; // Store coordinates for later use
      
      const marker = L.marker([coords.latitude, coords.longitude])
        .bindPopup(`
          <strong>${theater.name}</strong><br>
          ${theater.address}<br>
          ${theater.phone || ''}
        `)
        .addTo(map);
      
      marker.on('click', () => {
        emit('theater-selected', theater.name);
      });
      
      markers[theater.id] = marker;
      bounds.extend([coords.latitude, coords.longitude]);
    }
  }
  
  if (Object.keys(markers).length > 0) {
    map.fitBounds(bounds);
    
    // If there's a selected theater, zoom to it immediately
    if (props.selectedTheater) {
      zoomToTheater(props.selectedTheater);
    }
  }
  
  loadingAddresses.value = false;
};

const initializeMap = () => {
  if (!mapRef.value) return;
  
  clearMap();
  
  map = L.map(mapRef.value).setView([51.505, -0.09], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  if (props.theaters.length > 0) {
    updateMarkers();
  }
};

// Watch for movie changes to close the panel
watch(() => props.selectedMovie, () => {
  expandedPanel.value = null;
  clearMap();
});

// Watch for panel expansion
watch(expandedPanel, async (newValue) => {
  if (newValue === 0) {
    await new Promise(resolve => setTimeout(resolve, 300));
    initializeMap();
    if (map) {
      map.invalidateSize();
    }
  } else {
    clearMap();
  }
});

// Watch for props changes
watch(() => props.theaters, () => {
  if (map && expandedPanel.value === 0) {
    updateMarkers();
  }
});

// Watch for selected theater changes
watch(() => props.selectedTheater, (newTheater) => {
  if (map && newTheater && expandedPanel.value === 0) {
    zoomToTheater(newTheater);
  }
});

onBeforeUnmount(() => {
  clearMap();
});
</script>

<style scoped>
.position-relative {
  position: relative;
  width: 100%;
  height: 400px;
}

.leaflet-container {
  z-index: 1;
  width: 100%;
  height: 100%;
}

.v-overlay {
  z-index: 2;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 16px !important;
}

.map-wrapper {
  margin: 0 auto;
}
</style>