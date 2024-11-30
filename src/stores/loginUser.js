import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export const userLogin = defineStore("UserStore", {
  state: () => ({
    user: [],
    accessToken: null,
  }),

  actions: {
    async fetchUser(username, password) {
      try {
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);

        const response = await useApi().post("/token", params);

        this.accessToken = response.data.access_token;
        this.user = response.data.user;
        return response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    }
  }
});