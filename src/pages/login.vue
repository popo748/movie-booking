<template>
    <div class="login-container">
      
      <router-link to="/">
        <img src="@/assets/v707_69.png" alt="Tiket4U Logo" class="logo" />
      </router-link>
      
      <div class="login-card">
        <h2>Welcome Back Weeb</h2>
        <form @submit.prevent="handleLogin">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Enter your username"
            required
          />
  
          <label for="password">Password</label>
          <div class="password-field">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
            <button type="button" @click="togglePasswordVisibility" class="toggle-password">
              {{ passwordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
  
          <button type="submit" class="login-btn">Login</button>
        </form>
        <p class="footer-text">
          Don't Have An Account? <router-link to="/register">Sign Up</router-link>
        </p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <br>
        <HomePageButton/>
      </div>
    </div>
  </template>
  
  <script>
  import HomePageButton from "@/components/HomePageButton.vue";
import { useApi } from "@/composables/useApi";
  
  const axios = useApi();
  
  export default {
    data() {
      return {
        username: localStorage.getItem("autoFillUsername") || "",
        password: localStorage.getItem("autoFillPassword") || "",
        passwordVisible: false,
        errorMessage: ""
      };
    },
  
    methods: {
      togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
      },
  
      async handleLogin() {
        try {
          const formData = new FormData();
          formData.append("username", this.username);
          formData.append("password", this.password);
  
          const response = await axios.post('/token', formData);
  
          if (response.data && response.data.access_token) {
            localStorage.setItem('authToken', response.data.access_token);
            localStorage.setItem('username', this.username);
  
            alert('Login successful');
            
            localStorage.removeItem("autoFillUsername");
            localStorage.removeItem("autoFillPassword");
            this.$router.push({ name: '/' });
          } else {
            alert('Login failed. Please check your credentials.');
          }
        } catch (error) {
          console.error("Login error:", error);
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .logo {
    max-width: 200px; 
    width: 100%;
    transition: transform 1.0s ease;
  }
  
  .logo:hover {
    transform: scale(1.1);
  }
  
  .login-card {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    width: 350px;
    text-align: center;
  }
  
  h2 {
    color: white;
    margin-bottom: 15px;
    text-align: center;
    margin-top: -10px;
  }
  
  label {
    color: white;
    display: block;
    margin: 10px 0 5px;
    text-align: left;
  }
  
  .password-field {
    position: relative;
  }
  
  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: none;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 16px;
  }
  
  input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  button.toggle-password {
    position: absolute;
    right: 15px;
    top: 40%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }
  
  button.login-btn {
    background-color: rgba(160, 29, 231, 1);
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 5px;
  }
  
  button.login-btn:hover {
    background-color: #8e44ad;
  }
  
  .footer-text {
    color: white;
    margin-top: 15px;
    text-align: center;
  }
  
  .footer-text a {
    color: #7a1ee3;
    text-decoration: none;
  }
  
  .footer-text a:hover {
    color: #a569bd;
  }
  </style>