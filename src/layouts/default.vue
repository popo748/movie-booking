<template>
  <div v-if="!AuthorizePage">
    <TopBar />
  </div>
  <v-app>
    <div class="purple-gradient-background-fixed"></div>
    <!-- Chatbot Button -->
    <v-btn
      variant="outlined"
      size="60"
      icon="mdi mdi-chat-processing-outline"
      class="fixed-button"
      @click="toggleChatbot"
    ></v-btn>
    <!-- Chatbot -->
    <v-dialog v-model="chatbotVisible" persistent max-width="400">
      <Chatbot @close="chatbotVisible = false" />
    </v-dialog>
    <v-main class="higher-z-index">
      <router-view />
    </v-main>
    <div v-if="!AuthorizePage">
      <AppFooter />
    </div>
  </v-app>
</template>

<script>
import Chatbot from "@/components/ChatBot.vue"; // Adjust path as needed

export default {
  data() {
    return {
      AuthorizePage: false,
      chatbotVisible: false, // Track visibility of chatbot dialog
    };
  },
  components: {
    Chatbot,
  },
  watch: {
    $route(to) {
      this.checkAuthorizePage(to.path);
    },
  },
  mounted() {
    this.checkAuthorizePage(this.$route.path);
  },
  methods: {
    checkAuthorizePage(path) {
      const lowerCasePath = path.toLowerCase();
      this.AuthorizePage = lowerCasePath === "/login" || lowerCasePath === "/register";
    },
    toggleChatbot() {
      this.chatbotVisible = !this.chatbotVisible; // Toggle chatbot visibility
    },
  },
};
</script>

<style>
.purple-gradient-background-fixed {
  width: 100%;
  height: 100vh;
  background-color: black;
  background-image: radial-gradient(circle at top right, rgba(130, 29, 231, 1) 0%, transparent 30%),
    radial-gradient(circle at bottom left, rgba(130, 29, 231, 1) 0%, transparent 30%);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
}

.higher-z-index {
  z-index: 1;
}

.light-purple-bar {
  background-color: rgba(130, 29, 231, 1) !important;
}

#RouterLink {
  color: #FFFFFF;
}

.logo-text {
  font-family: "Futura", "Montserrat", sans-serif;
  font-weight: bold;
  font-size: 36px;
  color: white;
  margin: 0;
  text-align: center;
}

.sticky-bar {
  position: sticky;
  top: 0;
}

.fixed-button {
  position: fixed;
  bottom: 20px; /* Distance from bottom */
  right: 20px; /* Distance from right */
  z-index: 99;
  background-color: white; /* Add a white background for visibility */
  color: #6a11cb; /* Purple icon color */
  border: 2px solid #6a11cb; /* Purple border */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.fixed-button:hover {
  transform: scale(1.1); /* Slight zoom effect */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
}
</style>