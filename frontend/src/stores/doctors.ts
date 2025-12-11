import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "../api";

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

export const useDoctorsStore = defineStore("doctors", {
  state: () => ({
    doctors: [] as Doctor[],
    error: "",
  }),

  actions: {
    async fetchDoctors() {
      this.error = "";

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.doctors = res.data;
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Błąd pobierania listy lekarzy";
      }
    },
  },
});
