<template>
  <div class="doctor-schedule">
    <h2>Harmonogram pracy</h2>
    <p>Ustal lub edytuj swój harmonogram</p>

    <div v-if="scheduleStore.loading" class="loading">Ładowanie…</div>
    <div v-if="scheduleStore.error" class="error">{{ scheduleStore.error }}</div>

    <form v-if="availableDays.length > 0 && dayOfTheWeek != 0" @submit.prevent="onSubmit" class="schedule-form">
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
            <button @click="openEditModal(row)" class="edit">Edytuj</button>
          </td>
          <td>
            <button class="delete" @click="deleteSlot(row.id)">Usuń</button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
  <div v-if="showModal" class="modal-backdrop">
    <div class="modal">
      <h3>Edytuj slot</h3>
      <label>Dzień tygodnia:
        <select v-model.number="editDay">
          <option v-for="d in modalDays" :key="d.index" :value="d.index">
            {{ d.day }}
          </option>
        </select>
      </label>
      <label>Godzina od:
        <select v-model="editFrom">
          <option v-for="hour in hoursFrom" :key="hour" :value="hour">{{ hour }}</option>
        </select>
      </label>
      <label>Godzina do:
        <select v-model="editTo">
          <option v-for="hour in hoursTo" :key="hour" :value="hour">{{ hour }}</option>
        </select>
      </label>
      <button class = "save" @click="saveEdit">Zapisz</button>
      <button class = "abort" @click="showModal=false">Anuluj</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useScheduleStore } from "../../stores/schedule";

const scheduleStore = useScheduleStore();

const dayOfTheWeek = ref<number>(0);
const hourFrom = ref<string>("08:00");
const hourTo = ref<string>("16:00");

const availableDays = computed(() => {
  const usedDays = scheduleStore.schedule.map(s => s.day_of_the_week);
  return scheduleStore.days
    .map((day, index) => ({ day, index: index + 1 }))
    .filter(d => !usedDays.includes(d.index));
});

watch(availableDays, (newDays) => {
  if (!newDays || newDays.length === 0) return;

  const first = newDays[0];
  if (!first) return;

  if (!newDays.some(d => d.index === dayOfTheWeek.value)) {
    dayOfTheWeek.value = first.index;
  }
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
}

const editingRow = ref<any | null>(null);
const editDay = ref<number>(0);
const editFrom = ref<string>("08:00");
const editTo = ref<string>("16:00");
const showModal = ref(false);

const modalDays = ref<{ day: string; index: number }[]>([]);

function openEditModal(row: any) {
  editingRow.value = row;
  editDay.value = row.day_of_the_week;
  editFrom.value = row.hour_from.slice(0,5);
  editTo.value = row.hour_to.slice(0,5);
  modalDays.value = [...availableDays.value];

  if (!modalDays.value.some(d => d.index === editDay.value)) {
    modalDays.value.push({ day: dayName(editDay.value), index: editDay.value });
  }
  modalDays.value.sort((a,b) => a.index - b.index);

  showModal.value = true;
}

async function saveEdit() {
  if (!editingRow.value) return;
  await scheduleStore.updateSchedule(editingRow.value.id, editDay.value, editFrom.value, editTo.value);
  showModal.value = false;
  editingRow.value = null;
}

async function deleteSlot(id: number) {
  if (!confirm("Czy na pewno chcesz usunąć ten slot?")) return;
  await scheduleStore.deleteSchedule(id);
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

.schedule-table button, .modal button {
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.schedule-table button.edit, .modal button.save {
  background: #2563eb;
  color: white;
}

.schedule-table button.edit:hover, .modal button.save:hover {
  background: #1e40af;
}

.schedule-table button.delete, .modal button.abort{
  background: #dc2626;
  color: white;
}

.schedule-table button.delete:hover, .modal button.abort:hover {
  background: #991b1b;
}


.schedule-form {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.schedule-form label, .modal label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 14px;
  color: #0f172a;
}

.schedule-form select, .modal select {
  margin-top: 4px;
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: border 0.2s, box-shadow 0.2s;
}

.schedule-form select:focus, .modal select:focus {
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

.loading {
  margin-top: 10px;
  color: #555;
}

.error {
  margin-top: 10px;
  color :red 
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
}
</style>
