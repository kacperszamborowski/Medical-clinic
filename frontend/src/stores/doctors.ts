import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "../api";

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

export interface DoctorsTable {
  id: number;
  user_id: number;
  specialization: string;
  license_number: string;
}

export const useDoctorsStore = defineStore("doctors", {
  state: () => ({
    doctors: [] as Doctor[],
    table: [] as DoctorsTable[],
    error: "",
    loading: false,
  }),

  actions: {
    async fetchDoctors() {
      this.loading = true;
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
        this.error = "Błąd pobierania listy lekarzy";
        this.doctors = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchTable() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/doctors/table`, {
          headers: { Authorization: `Bearer ${token}`}
        });

        this.table = res.data.sort((a: DoctorsTable, b: DoctorsTable) => {
          return a.id - b.id;
        });
      } catch (err: any) {
        this.error = "Błąd pobierania tabeli";
      } finally{
        this.loading = false;
      }
    }
  },
});
