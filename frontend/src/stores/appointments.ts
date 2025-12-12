import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "../api";

export const useAppointmentsStore = defineStore("appointments", {
  state: () => ({
    busyHours: [] as string[],
    loading: false,
    error: "" as string | null,
    success: "" as string | null,
    hasAppointment: false as boolean
  }),

  actions: {
    async getBusyHours(doctorId: number, date: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/appointments/busy`, {
          params: { doctorId, date },
          headers: { Authorization: `Bearer ${token}`}
        });
        
        this.busyHours = res.data.map((h: any) => h.time);
      } catch (err: any) {
        this.error = err.response?.data?.message || "Nie udało się pobrać godzin.";
        this.busyHours = [];
      } finally {
        this.loading = false;
      }
    },

    async hasAppointmentF(doctorId: number, date: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/appointments/tba`, {
          params: {doctorId, date },
          headers: { Authorization: `Bearer ${token}`}
        });

        this.hasAppointment = res.data.hasAppointment;
      } catch (err: any) {
        this.error = "Coś poszło nie tak";
        this.hasAppointment = false;
      } finally {
        this.loading = false;
      }
    },

    async createAppointment(doctorId: number, date: string, time: string) {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${API_URL}/appointments/create`, 
          { doctorId, date, time },
          { headers: { Authorization: `Bearer ${token}`}
        });
        this.success = "Wizyta została pomyślnie zarezerwowana. Możesz ją wyświetlić w zakładce 'Moje wizyty'.";

        setTimeout(() => {
          this.success = null;
        }, 9000);
      } catch (err: any) {
        this.error = "Nie udało się stworzyć wizyty.";
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});
