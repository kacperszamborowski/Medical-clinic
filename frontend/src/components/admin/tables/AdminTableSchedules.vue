<template>
  <div class="admin-table-schedules">
    <button class="back-btn" @click="goBack">
      Wróć
    </button>
    <h3 class="tables-header">Tabela: Schedule</h3>

    <p v-if="scheduleStore.loading" class="loading">Ładowanie...</p>
    <p v-if="scheduleStore.error" class="error">{{ scheduleStore.error }}</p>

    <div v-if="scheduleStore.table && !scheduleStore.loading &&
      !scheduleStore.error" class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Id doktora</th>
            <th>Dzień tygodnia</th>
            <th>Godzina od</th>
            <th>Godzina do</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in scheduleStore.table" :key="schedule.id">
            <td>{{ schedule.id }}</td>
            <td>{{ schedule.doctor_id }}</td>
            <td>{{ schedule.day_of_the_week }}</td>
            <td>{{ formatTime(schedule.hour_from) }}</td>
            <td>{{ formatTime(schedule.hour_to) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useScheduleStore } from '../../../stores/schedule';

const router = useRouter();
const scheduleStore = useScheduleStore();

function goBack() {
  router.back();
}

function formatTime(time: string) {
  const d = new Date(time);

  return d.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });
}

onMounted(() => {
  scheduleStore.fetchTable();
});
</script>

<style scoped>
.admin-table-schedules {
  max-width: 800px;
}
</style>