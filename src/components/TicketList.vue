<!-- eslint-disable vue/no-unused-vars -->
<template>
    <v-card flat class="bg-none">
        <v-tabs v-model="tab" align-tabs="center" >
            <v-tab rounded="pill" :class="[tab === 1 ? 'bg-purple' : '']" variant="outlined" :value="1"
                hide-slider>Upcoming</v-tab>
            
            <v-tab rounded="pill" variant="outlined" :value="2" hide-slider
                :class="[tab === 2 ? 'bg-purple' : '', 'ml-5']" >History</v-tab>

        </v-tabs>

        <v-tabs-window v-model="tab" class="medium-vertical-gap">
            <v-tabs-window-item :value="1">
                <v-container> 
                    <div v-if="upcomingTicketData.length>0">
                    <v-row>
                        <v-col cols="3" v-for="data in upcomingTicketData">
                            <div class="horizontal-centering">
                                <TicketDetail :date="data.date" :title="data.title" :seats="data.seats" :time="data.time" :location="data.location" :duration="data.duration"/>
                            </div>
                        </v-col>
                    </v-row>
                    </div>
                    <div v-else>
                        <p class="text-h4 text-center">You don't have any upcoming tickets</p>
                    </div>
                </v-container>
            </v-tabs-window-item>
            <v-tabs-window-item :value="2">
                <v-container> 
                    <div v-if="historyTicketData.length>0">
                    <v-row>
                        <v-col cols="3" v-for="data in historyTicketData">
                            <div class="horizontal-centering">
                                <TicketDetail :date="data.date" :title="data.title" :seats="data.seats" :time="data.time" :location="data.location" :duration="data.duration"/>
                            </div>
                        </v-col>
                    </v-row>
                    </div>
                    <div v-else>
                        <p class="text-h4 text-center">You haven't purchased any tickets</p>
                    </div>
                </v-container>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-card>
</template>

<script setup>
    const tab = ref(null)
    const props = defineProps({
        upcomingTicketData: {
            type: Array,
            default: [
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2024", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
            ]
        },
        historyTicketData: {
            type: Array,
            default: [
                // { date: "Tue, 24 Jan 2023", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2023", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2023", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
                // { date: "Tue, 24 Jan 2023", title: "Movie Title", seats: ["C1", "C2", "C3"], time:"14:40" },
            ]
        }
    })
</script>

<style>
@import '@/styles/isaac-styles.css';

</style>