<template>
  <button class="back-btn" @click="goBack">
    Wróć
  </button>

  <div class="doctor-schedule">
    <h2>Harmonogram lekarza</h2>

    <div v-if="scheduleStore.loading" class="loading">Ładowanie…</div>
    <div v-if="scheduleStore.error" class="error">{{ scheduleStore.error }}</div>

    <table v-if="!scheduleStore.loading && scheduleStore.schedule.length" class="schedule-table">
      <thead>
        <tr>
          <th>Dzień tygodnia</th>
          <th>Godzina od</th>
          <th>Godzina do</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in scheduleStore.schedule" :key="row.id">
          <td>{{ dayName(row.day_of_the_week) }}</td>
          <td>{{ formatTime(row.hour_from) }}</td>
          <td>{{ formatTime(row.hour_to) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="!scheduleStore.loading && scheduleStore.schedule.length === 0">
      Brak ustawionego harmonogramu.
    </p>
  </div>
  <button class="appointment-btn" @click="openModal" :disabled="scheduleStore.loading || scheduleStore.schedule.length === 0">
    Umów wizytę
  </button>
  <p v-if="appointmentsStore.success" class="success">
    {{ appointmentsStore.success}}
  </p>

  <div v-if="showModal" class="modal-backdrop" @click="showModal = false">
    <div class="modal" @click.stop>
      <h3>Umów wizytę</h3>

      <label>Wybierz datę:</label>
      <VueDatePicker
        v-model="selectedDate"
        :min-date="minDate"
        :max-date="maxDate"
        :time-config="{
           enableTimePicker: false,
           ignoreTimeValidation: true }"
        auto-apply
      />

      <div v-if="selectedDate" class="hours-container">
        <h4>Dostępne godziny:</h4>

        <div class="hours-select">
          <label v-if="appointmentsStore.hasAppointment">
            Masz już umówioną wizytę tego dnia.
          </label>
          <label v-else-if="freeHours.length > 0">
            Wybierz godzinę:
          </label>
          <label v-else>
            Brak dostępnych terminów dla wybranej daty.
          </label>

          <select v-if="freeHours.length > 0" v-model="selectedHour">
            <option disabled value="">-- wybierz godzinę --</option>
            <option v-for="h in freeHours" :key="h" :value="h">
              {{ h }}
            </option>
          </select>
        </div>

      </div>

      <div v-if="selectedHour" class="modal-actions">
        <button class="confirm" @click="createAppointment(selectedDate!, selectedHour)">
          Zatwierdź wizytę
        </button>

        <button class="abort" @click="showModal = false">
          Zamknij
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScheduleStore } from "../../stores/schedule";
import { useAppointmentsStore } from "../../stores/appointments";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const route = useRoute();
const router = useRouter();
const doctorId = Number(route.params.id);

const scheduleStore = useScheduleStore();
const appointmentsStore = useAppointmentsStore();

function goBack() {
  router.back();
}

onMounted(() => {
  scheduleStore.fetchDoctorSchedule(doctorId);
});

function dayName(n: number) {
  return scheduleStore.days[n - 1] ?? "???";
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

const showModal = ref(false);

function openModal() {
  showModal.value = true;
  selectedDate.value = minDate
}

const selectedDate = ref<Date | null>(null);

const minDate = new Date();
minDate.setDate(minDate.getDate() + 1);

const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 1);

function getDoctorHoursForDay(date: Date): string[] {
  const dayOfWeek = date.getDay();
  
  const scheduleForDay = scheduleStore.schedule.find(s => s.day_of_the_week === (dayOfWeek === 0 ? 7 : dayOfWeek));
  if (!scheduleForDay) return [];

  // 30-minutowe sloty
  const startHour = Number(scheduleForDay.hour_from.slice(0, 2));
  const startMinutes = Number(scheduleForDay.hour_from.slice(3, 5));
  const endHour = Number(scheduleForDay.hour_to.slice(0, 2));
  const endMinutes = Number(scheduleForDay.hour_to.slice(3, 5));

  const hours: string[] = [];
  let h = startHour;
  let m = startMinutes;

  while (h < endHour || (h === endHour && m < endMinutes)) {
    hours.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 30;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }

  return hours;
}

const freeHours = ref<string[]>([]);

watch(selectedDate, async (date) => {
  if (!date) return;

  let possibleHours = getDoctorHoursForDay(date);

  const iso = date.toISOString().substring(0, 10);
  await appointmentsStore.hasAppointmentF(doctorId, iso);
  if (appointmentsStore.hasAppointment === true) {
    freeHours.value = [];
    return;
  }
  await appointmentsStore.getBusyHours(doctorId, iso);
  const busy = appointmentsStore.busyHours;

  // reserved hours removal
  freeHours.value = possibleHours.filter(h => !busy.includes(h));

  selectedHour.value = "";
});

const selectedHour = ref("");

function createAppointment(date: Date, hour: string) {
  if (!selectedDate.value || !selectedHour.value) return;

  const iso = date.toISOString().substring(0, 10);

  appointmentsStore.createAppointment(doctorId, iso, hour);
  showModal.value = false;
}
</script>

<style scoped>
.back-btn,
.appointment-btn,
.modal button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s;
}

.back-btn {
  background: #fcf9f9;
  border: 1px solid #e0e0e0;
}

.back-btn:hover {
  background: #e0ebf5;
  border-color: #c4d4e3;
}

.appointment-btn,
.modal button.confirm {
  background: #2563eb;
  color: white;
}

.appointment-btn:hover,
.modal button.confirm:hover {
  background: #1e40af;
}

.modal button.abort {
  background: #dc2626;
  color: white;
}

.modal button.abort:hover {
  background: #991b1b;
}

.doctor-schedule {
  max-width: 800px;
  margin-top: 20px;
  font-family: system-ui, sans-serif;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.schedule-table th,
.schedule-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.schedule-table th {
  text-align: left;
  background: #dfdfdf;
  font-weight: 600;
}

.loading {
  margin-top: 10px;
  color: #555;
}

.error {
  margin-top: 10px;
  color: red;
}

.success {
  margin-top: 10px;
  color: green;
}

.hours-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.hours-select select {
  padding: 6px 8px;
  border: 1px solid #d0d7e2;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 50px;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.modal-actions button {
  width: 100%;
}
</style>