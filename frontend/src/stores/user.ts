import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "../api";

export interface UserPatient {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birth_date: string;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    patient: null as UserPatient | null,
    error: "",
    loading: false
  }),

  actions: {
    async fetchPatient() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/users/me`, { 
            headers: { Authorization: `Bearer ${token}`} 
        });

        this.patient = res.data;
        console.log(this.patient)
      } catch (err: any) {
        this.error = "Błąd pobierania danych użytkownika";
      } finally {
        this.loading = false;
      }
    },
  },
});
