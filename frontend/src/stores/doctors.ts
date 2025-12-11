import { defineStore } from "pinia";
import { ref } from "vue";
import { API_URL } from "../api";

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

export const useDoctorsStore = defineStore("doctors", () => {
  const doctors = ref<Doctor[]>([]);

  async function fetchDoctors() {
    // przykladowe dane, brak backendu
    doctors.value = [
      { id: 1, name: "Dr. Jan Kowalski", specialization: "Pediatra" },
      { id: 2, name: "Dr. Anna Nowak", specialization: "Kardiolog" },
      { id: 3, name: "Dr. Piotr Wiśniewski", specialization: "Dermatolog" },
    ];
  }

  return { doctors, fetchDoctors };
});
