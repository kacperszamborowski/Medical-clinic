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
    days: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
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
        this.schedule.sort((a, b) => a.day_of_the_week - b.day_of_the_week);
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
        this.schedule.sort((a, b) => a.day_of_the_week - b.day_of_the_week);
      } catch (err: any) {
        this.error = err.response?.data?.message || "Błąd pobierania harmonogramu";
      } finally {
        this.loading = false;
      }
    },

    async createSchedule(dayOfTheWeek: number, hourFrom: string, hourTo: string) {
      this.error = "";
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:3000/schedule/my/create",
          { dayOfTheWeek, hourFrom, hourTo },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.fetchMySchedule();
      } catch (err: any) {
        this.error = err.response?.data?.message || "Błąd dodawania wpisu";
      }
    },
  },
});