import { defineStore } from "pinia";
import axios from "axios";

export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    schedule: [] as Array<{
      id: number;
      doctor_id: number;
      day_of_the_week: number;
      hour_from: string;
      hour_to: string;
    }>,
    loading: false,
    error: "",
  }),

  actions: {
    async fetchMySchedule() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/schedule/my", {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.schedule = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Błąd pobierania harmonogramu";
      } finally {
        this.loading = false;
      }
    },

    async fetchDoctorSchedule(doctorId: number) {
      this.loading = true;
      this.error = "";

      try {
        const res = await axios.get("http://localhost:3000/schedule", {
          params: { doctorId }
        });

        this.schedule = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Błąd pobierania harmonogramu";
      } finally {
        this.loading = false;
      }
    }
  }
});
