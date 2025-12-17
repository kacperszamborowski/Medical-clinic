import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "../api";

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
        const res = await axios.get(`${API_URL}/schedule/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.schedule = res.data;
        this.schedule.sort((a, b) => a.day_of_the_week - b.day_of_the_week);
      } catch (err: any) {
        this.error = "Błąd pobierania harmonogramu";
      } finally {
        this.loading = false;
      }
    },

    async fetchDoctorSchedule(doctorId: number) {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/schedule`, {
          params: { doctorId },
          headers: { Authorization: `Bearer: ${token}`}
        });

        this.schedule = res.data;
        this.schedule.sort((a, b) => a.day_of_the_week - b.day_of_the_week);
      } catch (err: any) {
        this.error = "Błąd pobierania harmonogramu";
      } finally {
        this.loading = false;
      }
    },

    async createSchedule(dayOfTheWeek: number, hourFrom: string, hourTo: string) {
      this.error = "";
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${API_URL}/schedule/my/create`,
          { dayOfTheWeek, hourFrom, hourTo },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.fetchMySchedule();
      } catch (err: any) {
        this.error = "Błąd dodawania slota";
      }
    },

    async updateSchedule(scheduleId: number, dayOfTheWeek: number, hourFrom: string, hourTo: string) {
      this.error = "";
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${API_URL}/schedule/my/edit`,
          { scheduleId, dayOfTheWeek, hourFrom, hourTo },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await this.fetchMySchedule();
      } catch (err: any) {
        this.error = "Błąd przy edytowaniu slota";
      }
    },

    async deleteSchedule(scheduleId: number) {
      this.error = "";
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${API_URL}/schedule/my/delete`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { scheduleId }
          }
        );
        await this.fetchMySchedule();
      } catch (err: any) {
        this.error = "Błąd usuwania slota";
      }
    }

  },
});