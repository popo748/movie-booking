import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export const createUserStore = defineStore("UserStore", {
  state: () => ({
    users: [],
  }),

  actions: {
    async saveuser(userData) {
      try {
        const API = useApi();
        const response = await API.post("/user/create", userData);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          throw new Error(error.response.data.detail || "An error occurred");
        } else {
          throw new Error("Network error");
        }
      }
    }
  }
});