import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "../api";

export const useAuthStore = defineStore("auth", {
  state: () => {
    let user = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (err) {
        console.error("Błąd parsowania usera z localStorage:", err);
        localStorage.removeItem("user"); // usuń uszkodzone dane
      }
    }

    return {
      token: localStorage.getItem("token") || "",
      user: user as { id: number; email: string; role: string } | null,
    };
  },

  actions: {
    async login(email: string, password: string) {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      this.token = res.data.token;
      this.user = res.data.user;

      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));

      return this.user!;
    },

    async register(payload: {
      firstname: string,
      lastname: string,
      birth_date: string,
      email: string,
      password: string,
    }) {
      await axios.post(`${API_URL}/auth/register`, {
        payload
      });
    },

    async changePassword(oldPassword: string, newPassword: string) {
      const token = localStorage.getItem("token");

      await axios.put(`${API_URL}/auth/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer: ${token}` } }
      );
    },

    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
