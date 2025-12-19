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

export interface UsersTable {
  id: number;
  firstname: string;
  lastname: string;
  birth_date: string;
  email: string;
  role: string;
  created_at: Date;
}

export const useUsersStore = defineStore("users", {
  state: () => ({
    patient: null as UserPatient | null,
    doctor: null as UserDoctor | null,
    table: [] as UsersTable[],
    error: "",
    loading: false,
    success: "",
  }),

  actions: {
    async fetchPatient() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
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
          headers: { Authorization: `Bearer ${token}` }
        });

        this.doctor = res.data;

      } catch (err: any) {
        this.error = "Błąd pobierania danych użytkownika";
      } finally {
        this.loading = false;
      }
    },

    async fetchTable() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/users/table`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.table = res.data.sort((a: UsersTable, b: UsersTable) => {
          return a.id - b.id;
        });
      } catch (err: any) {
        this.error = "Błąd pobierania tabeli";
      } finally {
        this.loading = false;
      }
    },

    async createDoctor(payload: {
      firstname: string;
      lastname: string;
      birthDate: string;
      email: string;
      password: string;
      specialization: string;
      licenseNumber: string;
    }) {
      this.loading = true;
      this.error = "";
      this.success = "";

      try {
        const token = localStorage.getItem("token");
        await axios.post(`${API_URL}/users/newdoctor`,
          { payload },
          { headers: { Authorization: `Bearer ${token}`} }
        );

        this.success = "Konto utworzone pomyślnie";
        setTimeout(() => {
          this.success = ""
        }, 3000);
      } catch (err: any) {
        this.error = "Nie udało się utworzyć konta doktora"
        setTimeout(() => {
          this.error="";
        },3000)
      } finally {
        this.loading = false;
      }
    }
    
  },
});
