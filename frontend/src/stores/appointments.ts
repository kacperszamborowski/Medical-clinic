import { defineStore } from "pinia";
import axios from "axios";
import { API_URL } from "../api";

export type AppointmentStatus = "zarezerwowana" | "zrealizowana" | "odwołana";

export interface DoctorAppointment {
  id: number;
  date: string;
  time: string;
  patient: string;
  status: AppointmentStatus;
  details?: {
    diagnosis?: string;
    recommendations?: string;
    prescription?: string;
  };
}

export interface PatientAppointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  specialization: string;
  status: AppointmentStatus;
  cancelReason: string;
  details?: {
    diagnosis?: string;
    recommendations?: string;
    prescription?: string;
  };
}

export interface AppointmentsTable {
  id: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  cancel_reason: string;
}

export interface AppointmentDetailsTable {
  id: number;
  appointment_id: number;
  diagnosis: string;
  recommendations: string;
  prescription: string;
}

export const useAppointmentsStore = defineStore("appointments", {
  state: () => ({
    busyHours: [] as string[],
    appointments: [] as DoctorAppointment[],
    patientAppointments: [] as PatientAppointment[],
    table: [] as AppointmentsTable[],
    detailsTable: [] as AppointmentDetailsTable[],
    hasAppointment: false,

    loading: false,
    error: null as string | null,
    success: null as string | null
  }),

  actions: {
    async getBusyHours(doctorId: number, date: string) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/appointments/busy`, {
          params: { doctorId, date },
          headers: { Authorization: `Bearer ${token}` }
        });

        this.busyHours = res.data.map((h: any) => h.time);
      } catch (err: any) {
        this.error = "Nie udało się pobrać godzin.";
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
        const res = await axios.get(
          `${API_URL}/appointments/isregistered`,
          {
            params: { doctorId, date },
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        this.hasAppointment = Boolean(res.data);
      } catch {
        this.hasAppointment = false;
      } finally {
        this.loading = false;
      }
    },

    async createAppointment(
      doctorId: number,
      date: string,
      time: string
    ) {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${API_URL}/appointments/create`,
          { doctorId, date, time },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.success = "Wizyta została pomyślnie zarezerwowana. Możesz ją zobaczyć w zakładce „Moje wizyty”.";

        setTimeout(() => {
          this.success = null;
        }, 9000);
      } catch (err: any) {
        this.error = "Nie udało się stworzyć wizyty.";
      } finally {
        this.loading = false;
      }
    },

    async getDoctorUpcomingAppointments() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/appointments/visits-upcoming`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        this.appointments = res.data.sort((a: DoctorAppointment, b: DoctorAppointment) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        });
      } catch (err: any) {
        this.error = "Nie udało się pobrać wizyt.";
        this.appointments = [];
      } finally {
        this.loading = false;
      }
    },

    async getDoctorHistory() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/appointments/visits-history`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        this.appointments = res.data.sort((a: DoctorAppointment, b: DoctorAppointment) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        });
      } catch (err: any) {
        this.error = "Nie udało się pobrać wizyt.";
        this.appointments = [];
      } finally {
        this.loading = false;
      }
    },

    async getPatientAppointments() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/appointments/history`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        this.patientAppointments = res.data.sort((a: PatientAppointment, b: PatientAppointment) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        });
      } catch (err: any) {
        this.error = "Nie udało się pobrać wizyt.";
        this.patientAppointments = [];
      } finally {
        this.loading = false;
      }
    },

    async createAppointmentDetails(
      appointmentId: number,
      diagnosis: string,
      recommendations: string,
      prescription: boolean
    ) {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        await axios.post(
          `${API_URL}/appointments/details/create`,
          { appointmentId, diagnosis, recommendations, prescription },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err: any) {
        this.error = "Coś poszło nie tak przy dodawaniu szczegółow wizyty";
      } finally {
        this.loading = false;
      }
    },

    async updateAppointmentDetails(
      appointmentId: number,
      diagnosis: string,
      recommendations: string,
      prescription: boolean
    ) {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const token = localStorage.getItem("token");

        await axios.put(
          `${API_URL}/appointments/details/update`,
          { appointmentId, diagnosis, recommendations, prescription },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.success = "Edytowanie zakończone pomyślnie"

        setTimeout(() => {
          this.success = null
        }, 5000)
      } catch (err: any) {
        this.error = "Coś poszło nie tak przy edytowaniu szczegółow wizyty";
      } finally {
        this.loading = false;
      }
    },

    async finishAppointment(appointmentId: number) {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const token = localStorage.getItem("token");

        await axios.put(
          `${API_URL}/appointments/status`,
          { appointmentId, newStatus: "zrealizowana" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.success = "Wizyta została zakończona.";

        setTimeout(() => {
          this.success = null;
        }, 5000);
      } catch (err: any) {
        this.error = "Nie udało się zakończyć wizyty.";
      } finally {
        this.loading = false;
      }
    },

    async cancelAppointment(appointmentId: number, cancelReason: string) {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const token = localStorage.getItem("token");

        await axios.put(
          `${API_URL}/appointments/status`,
          { appointmentId, newStatus: "odwołana", cancelReason },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.success = "Wizyta została odwołana.";

        setTimeout(() => {
          this.success = null;
        }, 5000);
      } catch (err: any) {
        this.error = "Nie udało się odwołać wizyty.";
      } finally {
        this.loading = false;
      }
    },

    async fetchTable() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/appointments/table`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.table = res.data.sort((a: AppointmentsTable, b: AppointmentsTable) => {
          return a.id - b.id;
        });
      } catch (err: any) {
        this.error = "Błąd pobierania tabeli";
      } finally {
        this.loading = false;
      }
    },

    async fetchDetailsTable() {
      this.loading = true;
      this.error = "";

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/appointments/details/table`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.detailsTable = res.data.sort((a: AppointmentDetailsTable, b: AppointmentDetailsTable) => {
          return a.id - b.id;
        });
      } catch (err: any) {
        this.error = "Błąd pobierania tabeli";
      } finally {
        this.loading = false;
      }
    },
  }
});
