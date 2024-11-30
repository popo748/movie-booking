<template>
    <div class="signup-wrapper">
      <div class="content">
        <div class="welcome-text">
          <router-link to="/">
            <img src="@/assets/v707_69.png" alt="logo" class="logo" />
          </router-link>
          <h3>Welcome</h3>
          <p>Begin your cinematic adventure now!</p>
        </div>
  
        <v-card class="signup-container">
          <img src="@/assets/v707_76.png" alt="Sign Up" class="signup-image" />
          <form @submit.prevent="Submit">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                v-model="username"
                required
                placeholder="Enter your username"
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder="Enter your email"
              />
            </div>
            <div class="form-group">
              <label for="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                v-model="phone"
                required
                placeholder="Enter your phone number"
              />
            </div>
            <div class="form-group">
              <label for="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                v-model="first_name"
                required
                placeholder="Enter your first name"
              />
            </div>
            <div class="form-group">
              <label for="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                v-model="last_name"
                required
                placeholder="Enter your last name"
              />
            </div>
            <div class="form-group password-group">
              <label for="password">Password</label>
              <input
                :type="passwordVisible ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="toggle-password"
              >
                {{ passwordVisible ? "Hide" : "Show" }}
              </button>
            </div>
            <button type="submit">Sign Up</button>
            <p class="footer-text">
              Already Have An Account? <a href="Login">Login</a>
            </p>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          </form>
        </v-card>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from "vue";
  import { useRouter } from "vue-router";
  import { createUserStore } from "../stores/userStore";
  
  export default defineComponent({
  
    name: "Register",
  
    setup() {
      const router = useRouter();
      const userStore = createUserStore();
      const username = ref("");
      const email = ref("");
      const phone = ref("");
      const password = ref("");
      const first_name = ref("");
      const last_name = ref("");
      const passwordVisible = ref(false);
      const errorMessage = ref("");
  
      const togglePasswordVisibility = () => {
        passwordVisible.value = !passwordVisible.value;
      };
  
      const Submit = async () => {
        try {
          const userData = {
            username: username.value,
            email: email.value,
            phone: phone.value,
            password: password.value,
            first_name: first_name.value,
            last_name: last_name.value,
            date_of_registration: new Date().toISOString(),
            last_modified_date: new Date().toISOString(),
          };
  
          const response = await userStore.saveuser(userData);
  
          localStorage.setItem("autoFillUsername", username.value);
          localStorage.setItem("autoFillPassword", password.value);
  
          alert("Sign up successful!");
          
          router.push("/login");
        } catch (error) {
          if (error.response && error.response.data) {
            errorMessage.value = error.response.data.detail || "Failed to sign up.";
          } else {
            errorMessage.value = "Failed to sign up.";
          }
          console.error("Error in sign-up:", error);
        }
      };
  
      return {
        username,
        email,
        phone,
        password,
        first_name,
        last_name,
        passwordVisible,
        errorMessage,
        togglePasswordVisibility,
        Submit,
      };
    },
  });
  </script>
  
  <style scoped>
  .signup-wrapper {
    display: flex;
    justify-content: center;
    height: 100vh;
    padding: 20px;
  }
  
  .content {
    max-width: 1500px;
    display: flex;
    gap: 30px;
  }
  
  .logo {
    width: 40%;
    margin-bottom: 20px;
    transition: all 0.3s ease;
  }
  
  .logo:hover {
    transform: scale(1.25);
  }
  
  .welcome-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    margin-right: 600px;
    margin-left: -100px;
    margin-bottom: 20px;
  }
  
  .welcome-text h3 {
    font-size: 3rem;
    font-weight: bold;
  }
  
  .welcome-text p {
    font-size: 1.2rem;
    margin-top: 10px;
  }
  
  .signup-container {
    flex: 1;
    max-height: 950px;
    max-width: 450px;
    background-color: white;
    padding: 35px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    flex-direction: column;
    justify-content: center;
    display: flex;
    overflow-x: hidden;
    margin-top: 130px;
    margin-right: -200px;
  }
  
  .signup-image {
    display: block;
    margin: 0 auto 20px auto;
    max-width: 100px;
    height: auto;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    color: rgba(160, 29, 231, 1);
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    color: black;
  }
  
  button[type="button"].toggle-password {
    background: none;
    color: rgba(160, 29, 231, 1);
    border: none;
    cursor: pointer;
    display: block;
    margin: 10px auto 0 auto;
  }
  
  button[type="submit"] {
    background-color: rgba(160, 29, 231, 1);
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 5px;
  }
  
  .footer-text {
    color: rgba(160, 29, 231, 1);
    text-align: center;
    margin-top: 5px;
  }
  
  .error {
    color: red;
    text-align: center;
  }
  
  @media (max-width: 1440px) {
    .signup-wrapper {
      justify-content: center;
      padding: 20px;
      margin-right: 0;
    }
  
    .welcome-text {
      margin-right: 0;
      text-align: center;
      margin-bottom: 20px;
    }
  
    .signup-container {
      margin-right: 0;
      margin-top: 0;
      max-width: 400px;
      padding: 25px;
      overflow-y: scroll;
    }
  
    .welcome-text h3 {
      font-size: 2.5rem;
    }
  
    .welcome-text p {
      font-size: 1rem;
    }
  
    button[type="button"].toggle-password {
      font-size: 0.9rem;
    }
  
    button[type="submit"] {
      font-size: 1rem;
    }
  }
  </style>