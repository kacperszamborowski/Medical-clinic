import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "../api";

export interface UserPatient {
  firstname: string;
  lastname: string;
  email: string;
  birth_date: string;
}

export interface UserDoctor {
  firstname: string;
  lastname: string;
  email: string;
  birth_date: string;
  specialization: string;
  license_number: string;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    patient: null as UserPatient | null,
    doctor: null as UserDoctor | null,
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

      } catch (err: any) {
        this.error = "Błąd pobierania danych użytkownika";
      } finally {
        this.loading = false;
      }
    },

    async fetchDoctor() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/users/me`, { 
            headers: { Authorization: `Bearer ${token}`} 
        });

        this.doctor = res.data;

      } catch (err: any) {
        this.error = "Błąd pobierania danych użytkownika";
      } finally {
        this.loading = false;
      }
    },
  },
});
