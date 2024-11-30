<template>
    <v-app-bar class="light-purple-bar">
        <div class="logo-text flex-grow-1 text-left">
        <router-link to="/" style="text-decoration: none; color: inherit;">
          <v-btn text>
            <h1>tiket4u.</h1>
          </v-btn>
        </router-link>
      </div>
      <div class="left_button px-2">
        <RouterLink v-if="isLoggedIn" to="/your_tickets"><v-btn>Your Tickets</v-btn></RouterLink>
        <RouterLink to="/cinemas"><v-btn>Our Cinemas</v-btn></RouterLink>
        <RouterLink to="/movies"><v-btn>Movies</v-btn></RouterLink>
        <RouterLink to="/showings"><v-btn>Showings</v-btn></RouterLink>
        
        <!-- <v-menu offset-y>
          <v-list>
            <v-list-item @click="goTo('/about-us')">
              <v-list-item-title>About Us</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goTo('/contact-us')">
              <v-list-item-title>Contact Us</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goTo('/collaboration')">
              <v-list-item-title>Collaboration</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>  -->
      </div>
  
      <!-- <div class="logo-text flex-grow-1 text-center">
        <router-link to="/" style="text-decoration: none; color: inherit;">
          <v-btn text>
            <h1>tiket4u.</h1>
          </v-btn>
        </router-link>
      </div> -->
        
      <div class="user-info mx-2">
        <span v-if="isLoggedIn">{{ username }}</span>
        <v-menu
      open-on-hover
    >
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-account-circle"
          v-bind="props"
        >
          
        </v-btn>
      </template>

      <v-list v-if="!isLoggedIn">
        <v-list-item>
          <v-list-item-title><RouterLink to="/login"><v-btn>Log In</v-btn></RouterLink></v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title><RouterLink to="/register"><v-btn>Sign Up</v-btn></RouterLink></v-list-item-title>
        </v-list-item>
        <!-- <v-list-item
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item> -->
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-title><v-btn @click="handleUserIconClick">Logout</v-btn></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
        <!-- <span v-if="isLoggedIn">{{ username }}</span>
        <v-btn icon="mdi-account-circle" @click="handleUserIconClick"></v-btn> -->
      </div>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        isLoggedIn: false,
        loggedInitems: [
        { title: 'Logout' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
        ],
        notLoggedInItems: [

        ]
      }
    },
    created() {
      this.checkLoginStatus();
    },
    methods: {
      checkLoginStatus() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('username');
        if (token && user) {
          this.isLoggedIn = true;
          this.username = user;
        } else {
          this.isLoggedIn = false;
        }
      },
      handleUserIconClick() {
        if (this.isLoggedIn) {
          this.logout();
        } else {
          this.$router.push('/login');
        }
      },
      logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        this.isLoggedIn = false;
        this.username = '';
        this.$router.push('/login');
      }
    }
  }
  </script>
  
  <style>
  .user-info {
    display: flex;
    align-items: center;
    color: white;
  }
  </style>