<template>
  <button class="back-btn" @click="goBack">
    Wróć
  </button>

  <div class="doctor-schedule">
    <h2>Harmonogram lekarza</h2>

    <div v-if="store.loading" class="loading">Ładowanie…</div>
    <div v-if="store.error" class="error">{{ store.error }}</div>

    <table v-if="!store.loading && store.schedule.length" class="schedule-table">
      <thead>
        <tr>
          <th>Dzień tygodnia</th>
          <th>Godzina od</th>
          <th>Godzina do</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in store.schedule" :key="row.id">
          <td>{{ dayName(row.day_of_the_week) }}</td>
          <td>{{ formatTime(row.hour_from) }}</td>
          <td>{{ formatTime(row.hour_to) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="!store.loading && store.schedule.length === 0">
      Brak ustawionego harmonogramu.
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useScheduleStore } from "../../stores/schedule";

const route = useRoute();
const router = useRouter();
const doctorId = Number(route.params.id);
const store = useScheduleStore();

function goBack() {
  router.back();
}

onMounted(() => {
  store.fetchDoctorSchedule(doctorId);
});

function dayName(n: number) {
  return store.days[n - 1] ?? "???";
}

function formatTime(t: string) {
  return t.slice(0, 5);
}
</script>

<style scoped>
.back-btn {
  display: inline-flex;
  align-items: center;

  background: #fcf9f9;
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  border-radius: 8px;

  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  transition: background 0.2s, border-color 0.2s;
}

.back-btn:hover {
  background: #e0ebf5;
  border-color: #c4d4e3;
}

.doctor-schedule {
  max-width: 800px;
  margin: 20px;
  font-family: system-ui, sans-serif;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin-top: 20px;
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
</style>
