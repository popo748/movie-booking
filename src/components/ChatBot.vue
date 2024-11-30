
<template>
    <v-card class="chatbot">
      <!-- Chat Header -->
      <v-toolbar color="#6A11CB" dark flat>
        <v-toolbar-title>Ticket4U Chatbot</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
  
      <!-- Chat Content -->
      <v-card-text class="chat-content" ref="chatMessagesRef">
        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="message.sender === 'user' ? 'user-message' : 'bot-message'"
        >
          <span v-if="message.sender === 'user'">{{ message.text }}</span>
          <div v-else v-html="parseMarkdown(message.text)"></div>
        </div>
        <div v-if="querying" class="loading-message">
          <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
          <span>Typing...</span>
        </div>
      </v-card-text>
  
      <!-- Input Area -->
      <v-card-actions class="input-area">
        <v-text-field
          v-model="question"
          placeholder="Write a message..."
          @keyup.enter="submitQuery"
          dense
          outlined
          hide-details
        ></v-text-field>
        <v-btn
          color="white"
          @click="submitQuery"
          class="send-btn"
          :loading="querying"
          :disabled="!isValidQuestion || querying"
        >
          <!-- Only the Send Icon -->
          <v-icon
            icon="mdi-send"
            end
          ></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { ref, watch, computed } from "vue";
  import axios from "axios";
  import MarkdownIt from "markdown-it";
  
  export default {
    name: "Chatbot",
    setup() {
      const question = ref("");
      const querying = ref(false);
      const chatMessages = ref([]);
      const chatMessagesRef = ref(null);
  
      const API_BASE_URL = "https://vertex-api-service-1015935499035.us-central1.run.app";
  
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      }).disable("image");
  
      const isValidQuestion = computed(() => question.value.trim().length > 0);
  
      const parseMarkdown = (text) => md.render(text);
  
      const submitQuery = async () => {
        if (!isValidQuestion.value || querying.value) return;
  
        querying.value = true;
        const trimmedQuestion = question.value.trim();
        chatMessages.value.push({ sender: "user", text: trimmedQuestion });
        question.value = "";
  
        try {
          const response = await axios.get(`${API_BASE_URL}/query`, {
            params: { question: trimmedQuestion },
          });
          chatMessages.value.push({
            sender: "ai",
            text: response.data.answer || "No response available.",
          });
        } catch (error) {
          console.error("Error querying document:", error);
          chatMessages.value.push({
            sender: "ai",
            text: "Sorry, something went wrong. Please try again.",
          });
        } finally {
          querying.value = false;
        }
      };
  
      // Scroll to bottom of chat messages when a new message is added
      watch(
        chatMessages,
        () => {
          setTimeout(() => {
            if (chatMessagesRef.value) {
              chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
            }
          }, 0);
        },
        { deep: true }
      );
  
      return {
        question,
        querying,
        chatMessages,
        chatMessagesRef,
        submitQuery,
        parseMarkdown,
        isValidQuestion,
      };
    },
  };
  </script>
  
  <style scoped>
  
  .chatbot {
    max-height: 500px;
    max-width: 400px;
    border-radius: 16px;
    background: #2c2c2e;
    display: flex;
    flex-direction: column;
  }
  
  .chat-content {
    padding: 16px;
    overflow-y: auto;
    flex-grow: 1;
  }
  
  .user-message {
    background: #6a11cb;
    color: white;
    text-align: right;
    margin: 8px 0;
    padding: 10px 14px;
    border-radius: 12px;
    align-self: flex-end;
  }
  
  .bot-message {
    background: #3c3c3e;
    color: white;
    text-align: left;
    margin: 8px 0;
    padding: 10px 14px;
    border-radius: 12px;
    align-self: flex-start;
  }
  
  .loading-message {
    display: flex;
    align-items: center;
    color: white;
  }
  
  .input-area {
    display: flex;
    align-items: center;
    padding: 8px;
  }
  
  .v-text-field {
    flex-grow: 1;
    margin-right: 8px;
  }
  
  .send-btn {
    background-color: #6a11cb;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 8px; /* Rounded corners for a square button */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .send-btn v-icon {
    font-size: 24px; /* Ensure icon size is visible */
  }
  
  </style>