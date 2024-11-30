/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlhcH-GiGlthkR0weqNqsYDJ8Pr8aGVcQ",
  authDomain: "gaia-capstone02-prd.firebaseapp.com",
  projectId: "gaia-capstone02-prd",
  storageBucket: "gaia-capstone02-prd.firebasestorage.app",
  messagingSenderId: "1015935499035",
  appId: "1:1015935499035:web:319182c07ff99f2c75f1be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const vueApp = createApp(App)

registerPlugins(vueApp)

vueApp.mount('#app')

export {db, auth}
