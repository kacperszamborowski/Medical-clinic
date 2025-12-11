<template>
  <div class="doctor-schedule">
    <h2>Harmonogram pracy</h2>
    <p>Ustal lub edytuj swój harmonogram</p>

    <div v-if="scheduleStore.error" class="error">{{ scheduleStore.error }}</div>

    <form v-if="availableDays.length > 0" @submit.prevent="onSubmit" class="schedule-form">
      <label>
        Dzień tygodnia:
        <select v-model.number="dayOfTheWeek">
          <option v-for="d in availableDays" :key="d.index" :value="d.index">
            {{ d.day }}
          </option>
        </select>
      </label>

      <label>
        Godzina od:
        <select v-model="hourFrom" required>
          <option v-for="hour in hoursFrom" :key="hour" :value="hour">{{ hour }}</option>
        </select>
      </label>

      <label>
        Godzina do:
        <select v-model="hourTo" required>
          <option v-for="hour in hoursTo" :key="hour" :value="hour">{{ hour }}</option>
        </select>
      </label>

      <button type="submit">Dodaj slot</button>
    </form>

    <table v-if="!scheduleStore.loading && scheduleStore.schedule.length" class="schedule-table">
      <thead>
        <tr>
          <th>Dzień tygodnia</th>
          <th>Godzina od</th>
          <th>Godzina do</th>
          <th>Edytuj</th>
          <th>Usuń</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in scheduleStore.schedule" :key="row.id">
          <td>{{ dayName(row.day_of_the_week) }}</td>
          <td>{{ formatTime(row.hour_from) }}</td>
          <td>{{ formatTime(row.hour_to) }}</td>
          <td>
            <button class="edit" @click="console.log('Edytuj', row.id)">Edytuj</button>
          </td>
          <td>
            <button class="delete" @click="console.log('Usuń', row.id)">Usuń</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!scheduleStore.loading && scheduleStore.schedule.length === 0">
      Brak ustawionego harmonogramu.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useScheduleStore } from "../../stores/schedule";

const scheduleStore = useScheduleStore();

const dayOfTheWeek = ref(1);
const hourFrom = ref("08:00");
const hourTo = ref("16:00");

const availableDays = computed(() => {
  const usedDays = scheduleStore.schedule.map(s => s.day_of_the_week);
  return scheduleStore.days
    .map((day, index) => ({ day, index: index + 1 }))
    .filter(d => !usedDays.includes(d.index));
});

const hoursFrom = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00"];
const hoursTo   = ["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

onMounted(() => {
  scheduleStore.fetchMySchedule();
});

function dayName(n: number) {
  return scheduleStore.days[n - 1] ?? "???";
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

async function onSubmit() {
  if(scheduleStore.loading) return;
  await scheduleStore.createSchedule(dayOfTheWeek.value, hourFrom.value, hourTo.value);

  if (availableDays.value?.length) {
    const firstDay = availableDays.value[0];
    if (firstDay) {
      dayOfTheWeek.value = firstDay.index;
    }
  }
}
</script>

<style scoped>
.doctor-schedule {
  max-width: 800px;
  margin-left: 20px;
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

.schedule-table button {
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.schedule-table button.edit {
  background: #2563eb;
  color: white;
}

.schedule-table button.edit:hover {
  background: #1e40af;
}

.schedule-table button.delete {
  background: #dc2626;
  color: white;
}

.schedule-table button.delete:hover {
  background: #991b1b;
}


.schedule-form {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.schedule-form label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 14px;
  color: #0f172a;
}

.schedule-form select {
  margin-top: 4px;
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: border 0.2s, box-shadow 0.2s;
}

.schedule-form select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
}

.schedule-form button {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  background: #0f172a;
  color: white;
  border: none;
  font-weight: 500;
  transition: background 0.2s;
}

.schedule-form button:hover {
  background: #1e293b;
}

.error {
  margin-top: 10px;
  font-size: 14px;
  color :red 
}
</style>
