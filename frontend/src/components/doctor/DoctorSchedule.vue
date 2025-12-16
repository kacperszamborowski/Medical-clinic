<template>
  <div class="doctor-schedule">
    <h2>Harmonogram pracy</h2>
    <p>Ustal lub edytuj swój harmonogram</p>

    <p v-if="scheduleStore.loading" class="loading">Ładowanie…</p>
    <p v-if="scheduleStore.error" class="error">{{ scheduleStore.error }}</p>

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

    <table v-if="!scheduleStore.loading && scheduleStore.schedule.length" class="table">
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
      <button class="save" @click="saveEdit">Zapisz</button>
      <button class="abort" @click="showModal = false">Anuluj</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useScheduleStore } from "../../stores/schedule";
import "../../style/global.css"

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


const hoursFrom = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
const hoursTo = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

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
  if (scheduleStore.loading) return;
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
  editFrom.value = row.hour_from.slice(0, 5);
  editTo.value = row.hour_to.slice(0, 5);
  modalDays.value = [...availableDays.value];

  if (!modalDays.value.some(d => d.index === editDay.value)) {
    modalDays.value.push({ day: dayName(editDay.value), index: editDay.value });
  }
  modalDays.value.sort((a, b) => a.index - b.index);

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
}

.schedule-form button,
.table button.edit,
.modal button.save {
  background: #2563eb;
  color: white;
}

.schedule-form button:hover,
.table button.edit:hover,
.modal button.save:hover {
  background: #1e40af;
}

.table button.delete,
.modal button.abort {
  background: #dc2626;
  color: white;
}

.table button.delete:hover,
.modal button.abort:hover {
  background: #991b1b;
}

.schedule-form button {
  margin-bottom: 2px;
}

.schedule-form {
  display: flex;
  gap: 12px;
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

.schedule-form select,
.modal select {
  margin-top: 4px;
}

.loading {
  margin-top: 10px;
  color: #555;
}

.error {
  margin-top: 10px;
  color: red;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
</style>
